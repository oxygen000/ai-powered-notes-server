import { Request, Response } from "express";
import Note from "../models/Note";

// 🟢 إنشاء ملاحظة جديدة
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, userId } = req.body;
    const note = new Note({ title, content, userId });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ أثناء إنشاء الملاحظة" });
  }
  
};


// 🔵 جلب جميع الملاحظات لمستخدم معين
export const getNotes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ أثناء جلب الملاحظات" });
  }
};

// 🟡 تحديث ملاحظة
export const updateNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedNote = await Note.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ أثناء تحديث الملاحظة" });
  }
};

// 🔴 حذف ملاحظة
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.json({ message: "تم حذف الملاحظة بنجاح" });
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ أثناء حذف الملاحظة" });
  }
};
