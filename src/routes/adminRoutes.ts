import express from "express";
import { protect, isAdmin } from "../middleware/adminMiddleware";
import { getUsers } from "../controllers/adminController"; // دالة لاسترداد المستخدمين

const router = express.Router();

router.get("/dashboard", protect, isAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/users", protect, isAdmin, getUsers);

export default router;
