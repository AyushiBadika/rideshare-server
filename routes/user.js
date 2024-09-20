import { Router } from "express";
import { login, logout } from "../controllers/auth.js";
import { resendOtp, signUp, verifyOtp, getUser } from "../controllers/user.js";
import { verifyToken, verifyUser } from "../middleware/authHandler.js";

const router = Router();

router.route("/login").post(verifyUser, login);
router.route("/logout").post(logout);
router.route("/signup").post(signUp);
router.route("/verify-otp").post(verifyOtp);
router.route("/resend-otp").post(verifyUser, resendOtp);
router.route("/get-profile").post(verifyToken, getUser);

export default router;
