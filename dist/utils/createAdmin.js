"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const createAdmin = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URL, { dbName: "ai-powered-notes" });
        const adminExists = await User_1.default.findOne({ role: "admin" });
        if (adminExists) {
            console.log("✅ Admin already exists");
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash("admin123", salt);
        const admin = new User_1.default({
            name: "Super Admin",
            email: "admin@admin.com",
            password: hashedPassword,
            role: "admin",
        });
        await admin.save();
        console.log("🚀 Admin account created successfully");
    }
    catch (error) {
        console.error("❌ Error creating admin:", error);
    }
    finally {
        mongoose_1.default.connection.close();
    }
};
exports.default = createAdmin;
