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
    .withMessage("accountType is invalid")
);

/**
 * :: STEP 2
 * Get user accounts by account types
 */
const getUserAccountsByAccountType: Handler = async (req, res) => {
  const { r } = res;

    let accountTypes: string[] = [];
    
    // All allowed account types
    const allowedAccountTypes = _.pullAll(Object.values(model.user.accountTypes), [
        model.user.accountTypes.superAdmin,
      ]);

    switch (req.query.accountType) {
        case "branchSecretary":
            accountTypes = [model.user.accountTypes.bsEditor, model.user.accountTypes.bsViewer];
            break;
        case "officer":
            accountTypes = [model.user.accountTypes.officer];
            break;
        case "admin":
            accountTypes = [model.user.accountTypes.adminEditor, model.user.accountTypes.adminViewer];
            break;
        default:
            accountTypes = allowedAccountTypes;
            break;
    }

  // Get user accounts from the database
  const [error, response] = await model.user.get_UserAccounts(accountTypes);
  console.log( response);
  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.NOT_FOUND().message("User not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  // response is and pointer therefore it is converted to array
  r.status.OK().message("User accounts").data(response).send();
};

/**
 * Request Handler Chain
 */

const getUsersByAccountType = [inspector, <EHandler>getUserAccountsByAccountType];

export  {getUsersByAccountType};
