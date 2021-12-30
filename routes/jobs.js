const express = require("express");
const router = express.Router();

const { getAllJobs, getJob, createJob, updateJob, deleteJob } = require("../controllers/jobs");

router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').post(updateJob).get(getJob).patch(deleteJob);

module.exports = router;