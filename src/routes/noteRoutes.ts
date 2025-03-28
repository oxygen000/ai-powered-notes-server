import express from "express";
import { createNote, getNotes, updateNote, deleteNote } from "../controllers/noteController";

const router = express.Router();

// 🟢 إضافة ملاحظة جديدة
router.post("/", createNote);

// 🔵 جلب جميع الملاحظات
router.get("/:userId", getNotes);

// 🟡 تحديث ملاحظة
router.put("/:id", updateNote);

// 🔴 حذف ملاحظة
router.delete("/:id", deleteNote);

export default router; 