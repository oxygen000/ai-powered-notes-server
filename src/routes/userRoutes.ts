import express from "express";
import {
  deleteAccount,
  getUser,
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

// ✅ تسجيل مستخدم جديد
router.post("/register", registerUser);

// ✅ تسجيل الدخول
router.post("/login", loginUser);

// ✅ تسجيل الخروج (يحتاج إلى توثيق)
router.post("/logout", protect, logoutUser);

// ✅ التحقق من OTP
router.post("/verify-otp", verifyOtp);

router.post("/resend-otp", resendOtp);

// ✅ طلب إعادة تعيين كلمة المرور عبر البريد الإلكتروني
router.post("/request-password-reset", requestPasswordReset);

// ✅ إعادة تعيين كلمة المرور عبر الرمز المرسل إلى البريد الإلكتروني
router.post("/reset-password", resetPassword);

// ✅ تغيير كلمة المرور عند معرفة القديمة (يحتاج إلى توثيق)
router.patch("/change-password", authenticateUser, changePassword);

// ✅ تعيين كلمة مرور جديدة (يحتاج إلى توثيق)
router.patch("/new-password", authenticateUser, newPassword);

// ✅ الحصول على الملف الشخصي (يحتاج إلى توثيق)
router.get("/profile", authenticateUser, getUserProfile);

router.get("/me", authenticateUser, getUser);

// ✅ تحديث الملف الشخصي (يحتاج إلى توثيق)
router.put("/profile", authenticateUser, updateUserProfile);

// ✅ حذف الحساب نهائيًا (يحتاج إلى توثيق)
router.delete("/delete-account", authenticateUser, deleteAccount);

// ✅ الحصول على بيانات مستخدم معين عبر الـ ID (يحتاج إلى توثيق)
// ✅ يتحقق من صحة `id` ويمنع الوصول إذا لم يكن المستخدم مسؤولًا أو يطلب بياناته الشخصية فقط
router.get("/:id", authenticateUser, validateUserId, getUserById);

// ✅ ميدلوير للتحقق مما إذا كان المستخدم يطلب بياناته الخاصة أو مسؤولًا
function validateUserId(req: any, res: any, next: any) {
  if (req.user?.role === "admin" || req.user?.id === req.params.id) {
    return next();
  }
  return res.status(403).json({ message: "Access denied." });
}

export default router;
