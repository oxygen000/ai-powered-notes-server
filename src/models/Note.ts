import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  isArchived: boolean;
  isPinned: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema<INote> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, 
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100, 
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10, 
    },
    isArchived: { type: Boolean, default: false }, 
    isPinned: { type: Boolean, default: false }, 
    deletedAt: { type: Date, default: null }, 
  },
  { timestamps: true }
);

NoteSchema.pre(/^find/, function (next) {
  if (!(this as mongoose.Query<any, any>).getQuery().deletedAt) {
    (this as mongoose.Query<any, any>).getQuery().deletedAt = null;
  }
  next();
});



NoteSchema.methods.softDelete = async function () {
  this.deletedAt = new Date();
  await this.save();
};

const Note = mongoose.model<INote>("Note", NoteSchema);
export default Note;
