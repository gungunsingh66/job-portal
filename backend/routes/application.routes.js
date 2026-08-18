import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { applyForJob, getMyApplications, getJobApplicants, updateApplicationStatus, checkApplicationStatus } from "../controllers/application.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.route("/my").get(
    verifyJWT,
    authorizeRoles("jobseeker"),
    getMyApplications
);

router.route("/:id/apply").post(
    verifyJWT,
    authorizeRoles("jobseeker"),
    applyForJob
);

router.route("/:id/status").get(
    verifyJWT,
    checkApplicationStatus
);

router.route("/job/:id").get(
    verifyJWT,
    authorizeRoles("recruiter"),
    getJobApplicants
);

router.route("/:applicationId/status").patch(
    verifyJWT,
    authorizeRoles("recruiter"),
    updateApplicationStatus
);

export default router;