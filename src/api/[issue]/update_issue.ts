import { EHandler, Handler, Log } from "../../utils/types";
import { inspectBuilder, body, param } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";
import { v4 as UUID } from "uuid";
import { Issue } from "../../model/types";

/**
 * :: STEP 1
 * Validation
 */
const inspector = inspectBuilder(
  body("status")
    .exists()
    .withMessage("Status is required")
    .isIn(Object.values(model.issue.issueStatus))
    .withMessage("Invalid status"),
  param("issueId").exists().withMessage("Issue Id is required")
);

/**
 * :: STEP 2
 * Handler
 */

// Add branches Handler
const updateIssue: Handler = async (req, res) => {
  const { r } = res;
  const { issueId } = req.params;
  const { status } = req.body;

  const updateData = {
    status,
  };
  const [error, response] = await model.issue.update_Issue(issueId, updateData);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Issue Not Found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Issue updated successfully").send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */

export default [inspector, <EHandler>updateIssue];
