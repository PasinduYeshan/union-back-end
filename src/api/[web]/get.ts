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

/**
 * :: STEP 2
 * Handler
 */
// Get branch secretaries list
const _getBranchSecretaries: Handler = async (req, res) => {
  const { r } = res;

  const [error, response] = await model.web.get_BranchSecretaries();

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Branch Secretaries not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Branch Secretaries").data(response).send();
};

// Get committee member list
const _getCommitteeMembers: Handler = async (req, res) => {
  const { r } = res;

  const [error, response] = await model.web.get_CommitteeMembers();
  const [error1, count] = await model.web.get_CommitteeMemberCount();

  if (error || error1) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Branch Secretaries not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Branch Secretaries").data({count, committeeMembers: response}).send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */

export const getBranchSecretaries = [<EHandler>_getBranchSecretaries];
export const getCommitteeMembers = [<EHandler>_getCommitteeMembers];
