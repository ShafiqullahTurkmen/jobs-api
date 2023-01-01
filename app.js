require("dotenv").config();
require("express-async-errors");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticateUser = require("./middleware/authentication");

const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);
app.use(express.json());
app.use(cors());

//Swagger
const swaggerDocument = YAML.load("./swagger.yaml");
app.get("/", (req, res) => {
  res.send("<h1>jobs API</h1><a href='/api-docs'>Documentation</a>")
})
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));


// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is running on  http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
