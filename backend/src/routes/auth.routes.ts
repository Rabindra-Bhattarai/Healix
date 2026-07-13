import { Router } from "express";
import {
  startRegistration,
  resendRegistrationOtp,
  verifyRegistration,
  login,
  verifyTwoFactorLogin,
  forgotPassword,
  resetPassword,
  googleAuth,
  facebookAuth,
  me,
  updateMe,
  changePassword,
  enableTwoFactor,
  verifyTwoFactorSetup,
  disableTwoFactor,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/register/start", startRegistration);
router.post("/register/resend", resendRegistrationOtp);
router.post("/register/verify", verifyRegistration);
router.post("/login", login);
router.post("/login/verify-2fa", verifyTwoFactorLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleAuth);
router.post("/facebook", facebookAuth);
router.get("/me", protect, me);
router.patch("/me", protect, updateMe);
router.post("/change-password", protect, changePassword);
router.post("/2fa/enable", protect, enableTwoFactor);
router.post("/2fa/verify-setup", protect, verifyTwoFactorSetup);
router.post("/2fa/disable", protect, disableTwoFactor);

export default router;
