import { EHandler, Handler } from "../../../utils/types";
import { inspectBuilder, body, header } from "../../../utils/inspect";
import model from "../../../model";
import { encrypt_password } from "../../../utils/hasher";
import { sendEmailTemplate } from "../../../utils/mail";
import { TokenMan } from "../../../utils/tokenMan";

/**
 * Step 1 - Token Validation
 */
 const inspectAuthHeader = inspectBuilder(
    header("authorization")
      .isString()
      .withMessage("Bearer authorization header is required")
         .customSanitizer((value) => {
        return (String(value) || "").split(" ")[1];
      })
      .isString()
      .withMessage("authorization header is invalid")
      .isJWT()
      .withMessage("authorization token is invalid")
);
  
const resetPasswordTokenValidator: Handler = (req, res, next) => {
  const { r } = res;
  // Get resetPasswordId from token
  const [error, payload] = TokenMan.verifyResetPasswordToken(
    req.headers["authorization"] || ""
  );
  if (error === "EXPIRED") {
    r.status
      .UN_AUTH()
      .data({ expired: true })
      .message("Authentication token is expired")
      .send();
    return;
  } else if (error === "ERROR") {
    r.status.UN_AUTH().message("Authentication token is invalid").send();
    return;
  }
    // Set resetPasswordId to request body
    req.body.resetPasswordId = payload.resetPasswordId;
    next();
};

/**
 * Step 2 - Validation
 */
const inspector = inspectBuilder(
  body("password")
    .exists()
    .withMessage("Password is Required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .exists()
    .withMessage("Confirm Password is Required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Confirm Password must match Password"),
);

/**
 * Step 3 - Update Password
 */
const resetPassword: Handler = async (req, res, next) => {
  const { r } = res;
  const {password, resetPasswordId} = req.body;

  // Update password in database
  const [error1, response] = await model.user.update_UserAccountAndReturnDoc(
    { resetPasswordId },
    { password: await encrypt_password(password) }
  );

  if (error1) {
    r.pb.ISE();
    return;
  } else if (response.value == null) {
    r.status.NOT_FOUND().message("User not found").send();
    return;
  } else {
    r.status.OK().message("Success").send();

    // Send password updated email
      try {
      await sendEmailTemplate(
        "passwordUpdatedEmail.handlebars",
        response.value.email,
        "UPTO Password Updated",
        {name : response.value.name}
      );
    } catch (error) {
      console.log("Password update email sending error : ", error);
    }
  }
};

export default [<EHandler> inspectAuthHeader,  <EHandler> resetPasswordTokenValidator, inspector, <EHandler>resetPassword];
