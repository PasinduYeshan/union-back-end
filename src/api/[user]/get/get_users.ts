require("dotenv").config();
import { EHandler, Handler, Log } from "../../../utils/types";
import { inspectBuilder, body, param, query } from "../../../utils/inspect";
import model, { DBErrorCode } from "../../../model";
const _ = require("lodash");

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
  query("accountType")
    .optional()
    .isIn(["branchSecretary", "officer", "admin"])
    .withMessage("accountType is invalid"),
  query("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status is invalid"),
  query("name").optional(),
  query("email").optional().isEmail().withMessage("Email is invalid")
);

const singleUserInspector = inspectBuilder(
  param("userId").exists().withMessage("UserId is required")
);

/**
 * :: STEP 2
 * Get user accounts by account types
 */
const _getUserAccountsByAccountType: Handler = async (req, res) => {
  const { r } = res;
  const status: string = req.query.status as string;
  let accountTypes: string[] = [];

  // All allowed account types
  const allowedAccountTypes = _.pullAll(
    Object.values(model.user.accountTypes),
    [model.user.accountTypes.superAdmin]
  );

  switch (req.query.accountType) {
    case "branchSecretary":
      accountTypes = [
        model.user.accountTypes.bsEditor,
        model.user.accountTypes.bsViewer,
      ];
      break;
    case "officer":
      accountTypes = [model.user.accountTypes.officer];
      break;
    case "admin":
      accountTypes = [
        model.user.accountTypes.adminEditor,
        model.user.accountTypes.adminViewer,
      ];
      break;
    default:
      accountTypes = allowedAccountTypes;
      break;
  }

  // Get user accounts from the database
  const [error, response] = await model.user.get_UserAccounts(accountTypes);
  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.NOT_FOUND().message("User not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("User accounts").data(response).send();
};

/**
 * Get all the users for Super Admin
 * @param req
 * @param res
 * @returns
 */
const _getUserAccounts: Handler = async (req, res) => {
  const { r } = res;
  let accountTypes: string[] = [];

  // All allowed account types
  const allowedAccountTypes = Object.values(model.user.accountTypes);

  switch (req.query.accountType) {
    case "branchSecretary":
      accountTypes = [
        model.user.accountTypes.bsEditor,
        model.user.accountTypes.bsViewer,
      ];
      break;
    case "officer":
      accountTypes = [model.user.accountTypes.officer];
      break;
    case "admin":
      accountTypes = [
        model.user.accountTypes.adminEditor,
        model.user.accountTypes.adminViewer,
      ];
      break;
    default:
      accountTypes = allowedAccountTypes;
      break;
  }

  // Get user accounts from the database
  const [error, response] = await model.user.get_UserAccountsSuperAdmin(
    accountTypes
  );
  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.NOT_FOUND().message("User not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("User accounts").data(response).send();
};

/**
 * Get single user account by userId
 * @param req
 * @param res
 * @returns
 */
const _getUserAccount: Handler = async (req, res) => {
  const { r } = res;
  const { userId } = req.params;

  // Get user accounts from the database
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
  r.status.OK().message("User accounts").data(response).send();
};

/**
 * Request Handler Chain
 */
export const getUserAccountsByAccountType = [
  inspector,
  <EHandler>_getUserAccountsByAccountType,
];
export const getUserAccountsForSuperAdmin = [
  inspector,
  <EHandler>_getUserAccounts,
];
export const getUserAccount = [inspector, <EHandler>_getUserAccount];
