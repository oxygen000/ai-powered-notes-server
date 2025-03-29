"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("❌ MONGO_URL is not defined in .env file!");
        }
        const conn = await mongoose_1.default.connect(process.env.MONGO_URL, {
            dbName: "ai-powered-notes",
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error}`);
        process.exit(1);
    }
};
exports.default = connectDB;
