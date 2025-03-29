"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.getNotes = exports.createNote = void 0;
const Note_1 = __importDefault(require("../models/Note"));
// 🟢 إنشاء ملاحظة جديدة
const createNote = async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const note = new Note_1.default({ title, content, userId });
        await note.save();
        res.status(201).json(note);
    }
    catch (error) {
        res.status(500).json({ error: "حدث خطأ أثناء إنشاء الملاحظة" });
    }
};
exports.createNote = createNote;
// 🔵 جلب جميع الملاحظات لمستخدم معين
const getNotes = async (req, res) => {
    try {
        const { userId } = req.params;
        const notes = await Note_1.default.find({ userId });
        res.json(notes);
    }
    catch (error) {
        res.status(500).json({ error: "حدث خطأ أثناء جلب الملاحظات" });
    }
};
exports.getNotes = getNotes;
// 🟡 تحديث ملاحظة
const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNote = await Note_1.default.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedNote);
    }
    catch (error) {
        res.status(500).json({ error: "حدث خطأ أثناء تحديث الملاحظة" });
    }
};
exports.updateNote = updateNote;
// 🔴 حذف ملاحظة
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        await Note_1.default.findByIdAndDelete(id);
        res.json({ message: "تم حذف الملاحظة بنجاح" });
    }
    catch (error) {
        res.status(500).json({ error: "حدث خطأ أثناء حذف الملاحظة" });
    }
};
exports.deleteNote = deleteNote;
