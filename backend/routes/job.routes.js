import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob, getMyJobs } from "../controllers/job.controller.js";

const router = Router();

router.route("/").get(getAllJobs);

router.route("/create").post(
    verifyJWT,
    createJob
);

router.route("/my-jobs").get(
    verifyJWT,
    getMyJobs
);

router.route("/:id")
    .get(getJobById)
    .put(verifyJWT, updateJob)
    .delete(verifyJWT, deleteJob);



export default router;