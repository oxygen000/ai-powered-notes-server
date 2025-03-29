"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noteController_1 = require("../controllers/noteController");
const router = express_1.default.Router();
// 🟢 إضافة ملاحظة جديدة
router.post("/", noteController_1.createNote);
// 🔵 جلب جميع الملاحظات
router.get("/:userId", noteController_1.getNotes);
// 🟡 تحديث ملاحظة
router.put("/:id", noteController_1.updateNote);
// 🔴 حذف ملاحظة
router.delete("/:id", noteController_1.deleteNote);
exports.default = router;
