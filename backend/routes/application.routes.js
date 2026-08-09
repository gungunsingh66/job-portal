import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { applyForJob, getMyApplications, getJobApplicants, updateApplicationStatus, checkApplicationStatus } from "../controllers/application.controller.js";

const router = Router();

router.route("/my").get(
    verifyJWT,
    getMyApplications
);

router.route("/:id/apply").post(
    verifyJWT,
    applyForJob
);

router.route("/:id/status").get(
    verifyJWT,
    checkApplicationStatus
);

router.route("/job/:id").get(
    verifyJWT,
    getJobApplicants
);

router.route("/:applicationId/status").patch(
    verifyJWT,
    updateApplicationStatus
);

export default router;