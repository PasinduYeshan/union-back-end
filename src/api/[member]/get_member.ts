import { v4 as UUID } from "uuid";
import { EHandler, Handler, Log } from "../../utils/types";
import { inspectBuilder, body, param, query } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";
import { cleanQuery } from "../../utils/functions";
import { setQueryValues } from "../../utils/functions";

/**
 * :: STEP 1
 * Validation
 */
const getMemberByUserIdInspector = inspectBuilder(
  param("userId").exists().withMessage("UserId is required")
);

const findMembersInspector = inspectBuilder(
  query("sort").optional().isIn(["asc", "desc"]).withMessage("Sort is invalid"),
  query("limit").optional().isInt().withMessage("Limit is invalid")
);
/**
 * :: STEP 2
 * Get members
 */
const _getMemberByUserId: Handler = async (req, res) => {
  const { r } = res;
  const { userId } = req.params;
  const [error, response] = await model.member.get_MemberByUserId(userId);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.NOT_FOUND().message("Member not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Member details").data(response).send();
};

const _findSingleMember: Handler = async (req, res) => {
  const { r } = res;
  const { oldNIC, newNIC } = setQueryValues(req.query);
  const [err, response] = await model.member.get_MemberByNIC(oldNIC, newNIC);
  if (err) {
    r.pb.ISE();
  } else {
    if (response == null) {
      r.status.NOT_FOUND().message("Member not found").send();
    } else {
      r.status.OK().data(response).message("Member found").send();
    }
  }
};

// Query members
const _findMultipleMembers: Handler = async (req, res) => {
  const { r } = res;

  const page: number = (req.query.page as unknown as number) || 1;
  const limit: number = (req.query.limit as unknown as number) || 50;
  const sort: any = req.query.sort == "asc" ? { name: 1 } : { name: -1 };

  const filters = cleanQuery(req.query, ["branchName", "title"]);
  const [err1, count] = await model.member.get_MembersCount(filters);
  const [error, response] = await model.member.get_Members(
    filters,
    limit,
    page,
    sort
  );

  if (err1 || error) {
    r.pb.ISE();
    return;
  }

  r.status
    .OK()
    .data({
      count: count,
      members: response,
    })
    .message("Members found")
    .send();
};

/**
 * :: STEP 3
 *
 */
export const findSingleMember = [
  getMemberByUserIdInspector,
  <EHandler>_findSingleMember,
];
export const findMultipleMembers = [<EHandler>_findMultipleMembers];
export const getMemberByUserId = [
  findMembersInspector,
  <EHandler>_getMemberByUserId,
];
