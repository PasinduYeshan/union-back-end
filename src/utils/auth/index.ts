import { EHandler, Handler } from "../types";
import { TokenMan } from "../tokenMan";
import { inspectBuilder, header } from "../inspect";
import model from "../../model";
var _ = require("lodash");

/**
 * :: STEP 1
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

/**
 * :: STEP 2
 * @param req
 * @param res
 * @param next
 */
const parsePayload: Handler = (req, res, next) => {
  const { r } = res;

  const token = req.headers["authorization"] || "";

  const [error, payload] = TokenMan.verifyAccessToken(token);
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

  req.user = payload;
  next();
};

// type AccountType : string;

/**
 * :: STEP 3 Builder
 * @param types
 */
function filter(...types: string[]): Handler {
  return (req, res, next) => {
    const { r } = res;
    if (types.includes(req.user.accountType)) {
      next();
      return;
    }

    r.status.UN_AUTH().message(`Only ${types} are allowed to access`).send();
  };
}

/**
 * Request Handler Chain
 */

// Get users for access Levels
 const bsEditorAccessUsers = _.pullAll(Object.values(model.user.accountTypes), [
  model.user.accountTypes.officer,
  model.user.accountTypes.bsViewer,
]);
const bsViewerAccessUsers = _.pullAll(Object.values(model.user.accountTypes), [
  model.user.accountTypes.officer,
]);
const officerAccessUsers = _.pullAll(Object.values(model.user.accountTypes), [
  model.user.accountTypes.bsEditor,
  model.user.accountTypes.bsViewer
]);

const ip = [inspectAuthHeader, <EHandler>parsePayload];
export default {
  // any: [...ip],
  superAdmin: [...ip, <EHandler>filter(model.user.accountTypes.superAdmin)],
  admin: [
    ...ip,
    <EHandler>(
      filter(
        model.user.accountTypes.superAdmin,
        model.user.accountTypes.adminEditor,
        model.user.accountTypes.adminViewer
      )
    ),
  ],
  adminEditor: [
    ...ip,
    <EHandler>(
      filter(
        model.user.accountTypes.superAdmin,
        model.user.accountTypes.adminEditor
      )
    ),
  ],
  adminViewer: [
    ...ip,
    <EHandler>(
      filter(
        model.user.accountTypes.superAdmin,
        model.user.accountTypes.adminViewer
      )
    ),
  ],
  bsEditor: [...ip, <EHandler>filter(...bsEditorAccessUsers)],
  bsViewer: [...ip, <EHandler>filter(...bsViewerAccessUsers)],
  officer: [
    ...ip,
    <EHandler>(
      filter(
       ...officerAccessUsers
      )
    ),
  ],
  any: [...ip, <EHandler>filter(...Object.values(model.user.accountTypes))],
};
