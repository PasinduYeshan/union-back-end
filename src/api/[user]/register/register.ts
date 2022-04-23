import { v4 as UUID } from "uuid";
import { EHandler, Handler, Log } from "../../../utils/types";
import { encrypt_password } from "../../../utils/hasher";
import { inspectBuilder, body } from "../../../utils/inspect";
import model, { DBErrorCode } from "../../../model";
require("dotenv").config();

const superAdminKey = process.env.SUPER_ADMIN_KEY || "";
const saEmails = process.env.SUPER_ADMIN_EMAIL || "";

const superAdminEmails = saEmails ? saEmails.split(",") : [];

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
  body("username").exists().withMessage("username is required"),
  body("password").exists().withMessage("password is required"),
  body("name").exists().withMessage("name is required"),
  body("NIC").exists().withMessage("NIC is is required"),
  body("contactNo")
    .exists()
    .isMobilePhone("any")
    .withMessage("contact number is required"),
  body("branchName").optional(),
  body("accountType")
    .optional()
    .isIn([...Object.values(model.user.accountTypes)]),
  body("security")
    .custom((value: any, { req }: any) =>
      req.body.accountType == model.user.accountTypes.superAdmin
        ? value == superAdminKey
        : true
    )
    .withMessage("You are not allowed to create super admin account"),
  body("email")
    .exists()
    .isEmail()
    .withMessage("email is required")
    .custom((value: any, { req }: any) =>
      req.body.accountType == model.user.accountTypes.superAdmin
        ? superAdminEmails.includes(value)
        : true
    )
    .withMessage("You are not allowed to create super admin account")
);

/**
 * :: STEP 2
 * Create a new user account -> Super admin, admin, branch secretary, officer
 * @param req body
 * @param res
 *  message
 */
const registerUserAccount: Handler = async (req, res) => {
  const { r } = res;

  // Check if users except super admin are registered by unauthorized users.
  if (
    req.body.accountType != model.user.accountTypes.superAdmin &&
    req.user == null
  ) {
    r.status.UN_AUTH().message("You are not allowed to create users").send();
  }

  // Setup Data
  const userId = UUID();

  const {
    username,
    password,
    name,
    NIC,
    email,
    contactNo,
    branchName,
    accountType,
  } = req.body;

  let userData = {
    userId,
    username,
    password: await encrypt_password(password),
    name,
    NIC,
    email,
    contactNo,
    branchName,
    accountType,
    status: "Active",
    createdBy: {},
    lastUpdatedBy: {},
  };

  // Log of who is creating the user account
  let createdBy: Log;
  if (
    req.user != null &&
    req.user.accountType != model.user.accountTypes.superAdmin
  ) {
    createdBy = {
      userId: req.user.userId,
      name: req.user.name,
      time: new Date(),
    };
    userData = { ...userData, createdBy };
  }

  // Sync model to database
  const [error, response] = await model.user.create_UserAccount(userData);
  if (error) {
    switch (error.code) {
      case DBErrorCode.DUPLICATE_ENTRY:
        r.status
          .BAD_REQ()
          .message(
            "Duplicate Data Entry, Check if another user is having the same username or email or NIC"
          )
          .send();
        return;
      default:
        r.pb.ISE();
    }
    return;
  }
  // Send Response
  r.status.OK().message("User Registered Successfully").send();
};

/**
 * Request Handler Chain
 */
export default [inspector, <EHandler>registerUserAccount];
