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

const singleIssueInspector = inspectBuilder(
  param("issueId").exists().withMessage("Issue ID is required")
);

/**
 * :: STEP 2
 * Handler
 */

// Get issues list
const _getIssues: Handler = async (req, res) => {
  const { r } = res;

  const page: number = (req.query.page as unknown as number) || 1;
  const limit: number = (req.query.limit as unknown as number) || 50;
  const sort: any =
    req.query.sort == "asc" ? { issueDate: 1 } : { issueDate: -1 };

  const filters = cleanQuery(req.query, [
    "status",
    "branchName",
    "name",
    "title",
  ]);
  const [err1, count] = await model.issue.get_IssuesCount(filters);
  const [error, response] = await model.issue.get_Issues(
    filters,
    limit,
    page,
    sort
  );

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
    .message("Issues")
    .data({
      count,
      issues: response,
    })
    .send();
};

// Get single issue
const _getSingleIssue: Handler = async (req, res) => {
  const { r } = res;

  const issueId = req.params.issueId;

  const [error, response] = await model.issue.get_SingleIssue(issueId);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Issue Not Found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Issue").data(response).send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */

export const getIssues = [inspector, <EHandler>_getIssues];
export const getSingleIssue = [inspector, <EHandler>_getSingleIssue];
