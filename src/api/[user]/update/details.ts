require("dotenv").config();
import { EHandler, Handler, Log } from "../../../utils/types";
import { inspectBuilder, body, param } from "../../../utils/inspect";
import model, { DBErrorCode } from "../../../model";
import { cleanQuery } from "../../../utils/functions";
const _ = require("lodash");

// Get list of super admin emails
const temp = process.env.SUPER_ADMIN_EMAIL;
const superAdminEmails = temp ? temp.split(",") : [];

/**
 * :: STEP 1
 * Validate Request
 */
const profileInspector = inspectBuilder(
  body("name").optional(),
  body("NIC").optional().isString(),
  body("branchName").optional().isString(),
  // If user is a super admin user -> he can update his own email only to given email list.
  body("email")
    .optional()
    .isEmail()
    .withMessage("email is invalid")
    .custom((email, { req }) =>
      req.user.accountType == model.user.accountTypes.superAdmin
        ? superAdminEmails.includes(email)
        : true
    ),
  body("contactNo")
    .optional()
    .isMobilePhone("any")
    .withMessage("contactNo is invalid")
);

// Get account types except super admin account
const accountT = _.pullAll(Object.values(model.user.accountTypes), [
  model.user.accountTypes.superAdmin,
]);

const accountInspector = inspectBuilder(
  body("name").optional(),
  body("NIC").optional().isString(),
  body("branchName").optional().isString(),
  body("email").optional().isEmail().withMessage("email is invalid"),
  body("contactNo")
    .optional()
    .isMobilePhone("any")
    .withMessage("contactNo is invalid"),
  body("accountType")
    .optional()
    .isIn(accountT)
    .withMessage("accountType is invalid"),
  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Account status is invalid"),
  param("userId")
    .exists()
    .exists()
    .withMessage("User id is required")
    .isUUID()
    .withMessage("invalid user id")
);

/**
 * :: STEP 2
 * Update user profile
 */
const updateProfile: Handler = async (req, res) => {
  const { r } = res;

  // Setup Data
  const userId = req.user.userId;
  const { name, NIC, branchName, email, contactNo, status } = req.body;

  // Updated by
  const updateData: Log = {
    name: name || req.user.name,
    userId: req.user.userId,
    time: new Date(),
  };

  const userData = {
    name,
    NIC,
    branchName,
    email,
    contactNo,
    status,
    lastUpdatedBy: updateData,
  };

  // Sync model to database (filter, update, options)
  const [error, response] = await model.user.update_UserAccount(
    { userId },
    userData,
    {}
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

  r.status.OK().message("Profile updated successfully").send();
};

/**
 *
 * @param req update user account
 * @param res
 */
const updateUserAccount: Handler = async (req, res) => {
  const { r } = res;
  // Setup Data
  const updaterName = req.user.name;
  const updaterUserId = req.user.userId;
  const updaterAccountType = req.user.accountType;
  const userId = req.params.userId;
  const { name, NIC, branchName, email, contactNo, accountType, status } =
    req.body;

  const updateData: Log = {
    name: updaterName,
    userId: updaterUserId,
    time: new Date(),
  };

  const userData = cleanQuery({
    name,
    NIC,
    branchName,
    email,
    contactNo,
    accountType,
    status,
    lastUpdatedBy: updateData,
  });
  
  if (Object.keys(userData).length == 1) {
    r.status.BAD_REQ().message("No data to update").send();
    return;
  }
  
  // Sync model to database (filter, update, options)
  const [error, response] = await model.user.update_UserAccount(
    {
      userId,
      accountType: { $not: { $eq: model.user.accountTypes.superAdmin } },
    }, // others cant update super admin account
    userData,
    {}
  );

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("User Not Found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }



  r.status.OK().message("Account updated successfully").send();
};

/**
 * Request Handler Chain
 */
const updateUser = {
  profile: [profileInspector, <EHandler>updateProfile],
  account: [accountInspector, <EHandler>updateUserAccount],
};
export default updateUser;
