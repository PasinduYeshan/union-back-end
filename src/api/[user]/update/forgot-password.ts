import { EHandler, Handler } from "../../../utils/types";
import { inspectBuilder, body, param } from "../../../utils/inspect";
import model, { DBErrorCode } from "../../../model";
import { encrypt_password } from "../../../utils/hasher";
import { sendEmail, sendEmailTemplate, templates } from "../../../utils/mail";
import { TokenMan } from "../../../utils/tokenMan";
let ejs = require("ejs");

/**
 * Step 1 - Validation
 */
const forgotPasswordInspector = inspectBuilder(
  body("username").exists().withMessage("Username or email is required")
);

/**
 * Step 2
 */
const sendPasswordResetEmail: Handler = async (req, res, next) => {
  const { r } = res;
  const username = req.body.username;

  // Check if user exists
  const [error, response] = await model.user.get_LoginAccount(username);
  if (error) {
    r.pb.ISE();
    return;
  }
  r.status
    .OK()
    .message("Password reset link will be sent to your email shortly.")
    .send();

  //If no user exists dont send email
  if (!response) {
    return;
  }

  // Set token containing user id and expiry time
  const payload = {
    userId: response.userId,
    createdAt: new Date(),
  };
  const resetPasswordToken = TokenMan.getResetPasswordToken(payload);
  const url = `${process.env.PASSWORD_RESET_URL}?rt=${resetPasswordToken}`;

  // Get ejs template
  // const html = await ejs.renderFile(__dirname + "/passwordResetEmail.ejs", {
  //   url,
  // });

  try {
    await sendEmailTemplate(
      "./templates/resetPasswordEmail.handlebars",
      response.email,
      "UPTO Password Reset",
      { url, name: response.name }
    );
  } catch (error) {
    console.log("Password reset email sending error : ", error);
  }
};

const forgotPasswordHandlers = {
  sendPasswordResetEmail: [
    forgotPasswordInspector,
    <EHandler>sendPasswordResetEmail,
  ],
};

export default forgotPasswordHandlers;
