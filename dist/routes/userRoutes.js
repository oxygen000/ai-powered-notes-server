"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const logoutController_1 = require("../controllers/auth/logoutController");
const otpController_1 = require("../controllers/auth/otpController");
const passwordController_1 = require("../controllers/auth/passwordController");
const loginController_1 = require("../controllers/auth/loginController");
const registerController_1 = require("../controllers/auth/registerController");
const resendOtpController_1 = require("../controllers/auth/resendOtpController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// ✅ تسجيل مستخدم جديد
router.post("/register", registerController_1.registerUser);
// ✅ تسجيل الدخول
router.post("/login", loginController_1.loginUser);
// ✅ تسجيل الخروج (يحتاج إلى توثيق)
router.post("/logout", loginController_1.protect, logoutController_1.logoutUser);
// ✅ التحقق من OTP
router.post("/verify-otp", otpController_1.verifyOtp);
router.post("/resend-otp", resendOtpController_1.resendOtp);
// ✅ طلب إعادة تعيين كلمة المرور عبر البريد الإلكتروني
router.post("/request-password-reset", passwordController_1.requestPasswordReset);
// ✅ إعادة تعيين كلمة المرور عبر الرمز المرسل إلى البريد الإلكتروني
router.post("/reset-password", passwordController_1.resetPassword);
// ✅ تغيير كلمة المرور عند معرفة القديمة (يحتاج إلى توثيق)
router.patch("/change-password", authMiddleware_1.authenticateUser, passwordController_1.changePassword);
// ✅ تعيين كلمة مرور جديدة (يحتاج إلى توثيق)
router.patch("/new-password", authMiddleware_1.authenticateUser, passwordController_1.newPassword);
// ✅ الحصول على الملف الشخصي (يحتاج إلى توثيق)
router.get("/profile", authMiddleware_1.authenticateUser, userController_1.getUserProfile);
router.get("/me", authMiddleware_1.authenticateUser, userController_1.getUser);
// ✅ تحديث الملف الشخصي (يحتاج إلى توثيق)
router.put("/profile", authMiddleware_1.authenticateUser, userController_1.updateUserProfile);
// ✅ حذف الحساب نهائيًا (يحتاج إلى توثيق)
router.delete("/delete-account", authMiddleware_1.authenticateUser, userController_1.deleteAccount);
// ✅ الحصول على بيانات مستخدم معين عبر الـ ID (يحتاج إلى توثيق)
// ✅ يتحقق من صحة `id` ويمنع الوصول إذا لم يكن المستخدم مسؤولًا أو يطلب بياناته الشخصية فقط
router.get("/:id", authMiddleware_1.authenticateUser, validateUserId, userController_1.getUserById);
// ✅ ميدلوير للتحقق مما إذا كان المستخدم يطلب بياناته الخاصة أو مسؤولًا
function validateUserId(req, res, next) {
    if (req.user?.role === "admin" || req.user?.id === req.params.id) {
        return next();
    }
    return res.status(403).json({ message: "Access denied." });
}
exports.default = router;
