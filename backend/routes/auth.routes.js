import { Router } from "express";
import { registerUser, loginUser, getCurrentUser, logoutUser, refreshAccessToken, uploadResume, removeResume } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.post(
    "/upload-resume",
    verifyJWT,
    upload.single("resume"),
    uploadResume
);
router.delete(
    "/remove-resume",
    verifyJWT,
    removeResume
);

export default router;