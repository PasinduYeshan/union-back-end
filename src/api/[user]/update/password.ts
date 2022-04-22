import { EHandler, Handler } from "../../../utils/types";
import { inspectBuilder, body, param } from "../../../utils/inspect";
import model, { DBErrorCode } from "../../../model";
import { encrypt_password } from "../../../utils/hasher";
import { compare } from "bcrypt";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
  body("currentPassword").exists().withMessage("current password is required"),
  body("password").exists().withMessage("password is required"),
  param("userId").optional().isUUID().withMessage("invalid user id")
);

/**
 * :: STEP 2
 * Validate existing credentials
 */
const validateCredentials: Handler = async (req, res, next) => {
  const { r } = res;

  const userId = req.params.userId || req.user.userId;
  const { currentPassword } = req.body;

  const [error, response] = await model.user.get_UserAccount(userId);
  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.NOT_FOUND().message("User not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  // password verification
  if (!(await compare(currentPassword, response.password))) {
    r.status.UN_AUTH().message("Current password is incorrect").send();
    return;
  }
  if (req.body.password == response.password) {
    r.status.BAD_REQ().message("You can't update the same password!").send();
  }

  req.body.userId = response.userId; // bind userId to request
  next(); // send pair of tokens
};

/**
 * :: STEP 3
 * Update user data
 */
const updateUserPassword: Handler = async (req, res) => {
  const { r } = res;

  // Setup Data
  const userId = req.body.userId;

  const userAccount = {
    password: await encrypt_password(req.body.password),
  };

  // Sync model to database
  const [error, response] = await model.user.update_UserAccount(
    { userId },
    userAccount
  );

  if (error) {
    r.pb.ISE();
    return;
  }
  r.status.OK().message("Success").send();
};

/**
 * Request Handler Chain
 */
export default [
  inspector,
  <EHandler>validateCredentials,
  <EHandler>updateUserPassword,
];
