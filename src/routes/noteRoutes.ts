import express from "express";
import { createNote, getNotes, updateNote, deleteNote } from "../controllers/noteController";

const router = express.Router();

router.post("/", createNote);

router.get("/:userId", getNotes);

router.put("/:id", updateNote);

router.delete("/:id", deleteNote);

export default router; 