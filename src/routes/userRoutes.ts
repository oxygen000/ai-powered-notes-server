import express from "express";
import {
  deleteAccount,
  getUserById,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";
import { logoutUser } from "../controllers/auth/logoutController";
import { verifyOtp } from "../controllers/auth/otpController";
import {
  requestPasswordReset,
  resetPassword,
  changePassword,
  newPassword,
} from "../controllers/auth/passwordController";
import { loginUser, protect } from "../controllers/auth/loginController";
import { registerUser } from "../controllers/auth/registerController";
import { resendOtp } from "../controllers/auth/resendOtpController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", protect, logoutUser);

router.post("/verify-otp", verifyOtp);

router.post("/resend-otp", resendOtp);

router.post("/request-password-reset", requestPasswordReset);

router.post("/reset-password", resetPassword);

router.patch("/change-password", authenticateUser, changePassword);

router.patch("/new-password", authenticateUser, newPassword);

router.get("/profile", authenticateUser, getUserProfile);

router.put("/profile", authenticateUser, updateUserProfile);

router.delete("/delete-account", authenticateUser, deleteAccount);

router.get("/:id", authenticateUser, validateUserId, getUserById);

function validateUserId(req: any, res: any, next: any) {
  if (req.user?.role === "admin" || req.user?.id === req.params.id) {
    return next();
  }
  return res.status(403).json({ message: "Access denied." });
}

export default router;
