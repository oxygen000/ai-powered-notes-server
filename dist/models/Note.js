"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const NoteSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
// 🛡️ منع عمليات البحث عن الملاحظات المحذوفة
NoteSchema.pre(/^find/, function (next) {
    if (!this.getQuery().deletedAt) {
        this.getQuery().deletedAt = null;
    }
    next();
});
// 🔄 وظيفة لحذف الملاحظات بدون فقدانها نهائيًا
NoteSchema.methods.softDelete = async function () {
    this.deletedAt = new Date();
    await this.save();
};
const Note = mongoose_1.default.model("Note", NoteSchema);
exports.default = Note;
