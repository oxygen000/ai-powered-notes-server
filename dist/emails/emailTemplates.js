"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accountDeleted_email_1 = __importDefault(require("./emailTemplates/accountDeleted-email"));
const emailChanged_email_1 = __importDefault(require("./emailTemplates/emailChanged-email"));
const newLoginAlert_email_1 = __importDefault(require("./emailTemplates/newLoginAlert-email"));
const otpVerification_email_1 = __importDefault(require("./emailTemplates/otpVerification-email"));
const passwordChanged_email_1 = __importDefault(require("./emailTemplates/passwordChanged-email"));
const passwordReset_email_1 = __importDefault(require("./emailTemplates/passwordReset-email"));
const welcome_email_1 = __importDefault(require("./emailTemplates/welcome-email"));
const emailTemplates = {
    welcome: welcome_email_1.default,
    otpVerification: otpVerification_email_1.default,
    passwordReset: passwordReset_email_1.default,
    passwordChanged: passwordChanged_email_1.default,
    accountDeleted: accountDeleted_email_1.default,
    emailChanged: emailChanged_email_1.default,
    newLoginAlert: newLoginAlert_email_1.default,
};
exports.default = emailTemplates;
