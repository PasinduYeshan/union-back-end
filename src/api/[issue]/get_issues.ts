import { EHandler, Handler, Log } from "../../utils/types";
import { inspectBuilder, body, param, query } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";
import { v4 as UUID } from "uuid";
import { Issue } from "../../model/types";
import { cleanQuery } from "../../utils/functions";

/**
 * :: STEP 1
 * Validation
 */
const inspector = inspectBuilder(
  query("status").optional().isIn(Object.values(model.issue.issueStatus)),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
);

/**
 * :: STEP 2
 * Handler
 */

// Add branches Handler
const getIssues: Handler = async (req, res) => {
  const { r } = res;

  const page: number = (req.query.page as unknown as number) || 1;
    const limit: number = (req.query.limit as unknown as number) || 50;
    const sort: any = req.query.sort == 'asc' ? { issueDate: 1 } : { issueDate: -1 };

  const filters = cleanQuery(req.query, [
    "status",
    "branchName",
    "name",
    "title",
  ]);
  const [err1, count] = await model.issue.get_IssuesCount(filters);
  const [error, response] = await model.issue.get_Issues(filters, limit, page, sort);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Issue Not Found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status
    .OK()
    .message("Issue updated successfully")
    .data({
      count,
      issues: response,
    })
    .send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */

export default [inspector, <EHandler>getIssues];
