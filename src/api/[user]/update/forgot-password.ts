import { EHandler, Handler } from "../../../utils/types";
import { v4 as UUID } from "uuid";
import { inspectBuilder, body, param } from "../../../utils/inspect";
import model from "../../../model";
import {  sendEmailTemplate } from "../../../utils/mail";
import { TokenMan } from "../../../utils/tokenMan";

/**
 * Step 1 - Validation
 */
const forgotPasswordInspector = inspectBuilder(
  body("username").exists().withMessage("Username or email is required")
);

/**
 * Step 2 -  Send Password Reset Email
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
  // Send response
  r.status
    .OK()
    .message("Password reset link will be sent to your email shortly.")
    .send();

  // If no user exists dont send email
  if (!response) {
    return;
  }

  const resetPasswordId = UUID();

  // Store resetPasswordId in database
  const [error2, response2] = await model.user.update_UserAccount(
    {
      userId: response.userId,
    },
    { resetPasswordId }
  );
  // If update failed send internal server error
  if (error2) {
    r.pb.ISE();
    return;
  }

  // Create token with resetPasswordId
  const payload = {
    resetPasswordId,
  };
  const resetPasswordToken = TokenMan.getResetPasswordToken(payload);

  try {
    const url = `${process.env.PASSWORD_RESET_PAGE_URL}?rt=${resetPasswordToken}`;
    await sendEmailTemplate(
      "resetPasswordEmail.handlebars",
      response.email,
      "UPTO Password Reset",
      { url, name: response.name }
    );
  } catch (error) {
    console.log("Password reset email sending error : ", error);
  }
};

export default [ forgotPasswordInspector, <EHandler> sendPasswordResetEmail,];
