import accountDeletedTemplate from "./emailTemplates/accountDeleted-email";
import emailChangedTemplate from "./emailTemplates/emailChanged-email";
import newLoginAlertTemplate from "./emailTemplates/newLoginAlert-email";
import otpVerificationTemplate from "./emailTemplates/otpVerification-email";
import passwordChangedTemplate from "./emailTemplates/passwordChanged-email";
import passwordResetTemplate from "./emailTemplates/passwordReset-email";
import welcomeTemplate from "./emailTemplates/welcome-email";

const emailTemplates = {
  welcome: welcomeTemplate,
  otpVerification: otpVerificationTemplate,
  passwordReset: passwordResetTemplate,
  passwordChanged: passwordChangedTemplate,
  accountDeleted: accountDeletedTemplate,
  emailChanged: emailChangedTemplate,
  newLoginAlert: newLoginAlertTemplate,
};

export default emailTemplates;
