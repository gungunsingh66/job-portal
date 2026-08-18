import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob, getMyJobs } from "../controllers/job.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.route("/").get(getAllJobs);

router.route("/create").post(
    verifyJWT,
    authorizeRoles("recruiter"),
    createJob
);

router.route("/my-jobs").get(
    verifyJWT,
    authorizeRoles("recruiter"),
    getMyJobs
);

router.route("/:id")
    .get(getJobById)
    .put(verifyJWT, updateJob)
    .delete(verifyJWT, deleteJob);



export default router;