import mongoose, { Document, Schema } from "mongoose";

// 🎯 تعريف الواجهة TypeScript لمودل الملاحظات
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
      index: true, // تحسين سرعة البحث عن ملاحظات مستخدم معين
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100, // الحد الأقصى لطول العنوان
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10, // الحد الأدنى لطول المحتوى لمنع الرسائل الفارغة
    },
    isArchived: { type: Boolean, default: false }, // للحفاظ على الملاحظات بدلاً من حذفها
    isPinned: { type: Boolean, default: false }, // تثبيت الملاحظات المهمة
    deletedAt: { type: Date, default: null }, // لتحديد وقت الحذف بدلاً من الحذف النهائي
  },
  { timestamps: true }
);

// 🛡️ منع عمليات البحث عن الملاحظات المحذوفة
NoteSchema.pre(/^find/, function (next) {
  if (!(this as mongoose.Query<any, any>).getQuery().deletedAt) {
    (this as mongoose.Query<any, any>).getQuery().deletedAt = null;
  }
  next();
});



// 🔄 وظيفة لحذف الملاحظات بدون فقدانها نهائيًا
NoteSchema.methods.softDelete = async function () {
  this.deletedAt = new Date();
  await this.save();
};

const Note = mongoose.model<INote>("Note", NoteSchema);
export default Note;
