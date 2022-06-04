import { EHandler, Handler, Log } from "../../utils/types";
import { inspectBuilder, body, param } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";

/**
 * :: STEP 1
 * Validation
 */
const branchSecretaryInspector = inspectBuilder(
  param("branchSecId").exists().withMessage("Branch secretary Id is required")
);

const committeeMemberInspector = inspectBuilder(
  param("committeeMemberId").exists().withMessage("Committee Member Id is required")
);

const leaderInspector = inspectBuilder(
  param("leaderId").exists().withMessage("Leader Id is required")
);

/**
 * :: STEP 2
 * Handler
 */
// Delete branch secretary
const _deleteBranchSecretary: Handler = async (req, res) => {
  const { r } = res;
  
  const { branchSecId } = req.params;

  const [error, response] = await model.web.delete_BranchSecretary(branchSecId);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Branch secretary not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Branch secretary deleted successfully").send();
};

// Delete committee member
const _deleteCommitteeMember: Handler = async (req, res) => {
  const { r } = res;
  
  const { committeeMemberId } = req.params;

  const [error, response] = await model.web.delete_CommitteeMember(committeeMemberId);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Committee member not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Committee member deleted successfully").send();
};

// Delete leader
const _deleteLeader: Handler = async (req, res) => {
  const { r } = res;
  
  const { leaderId } = req.params;

  const [error, response] = await model.web.delete_Leader(leaderId);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Leader not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Leader deleted successfully").send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */

export const deleteBranchSecretary = [branchSecretaryInspector, <EHandler>_deleteBranchSecretary];
export const deleteCommitteeMember = [committeeMemberInspector, <EHandler>_deleteCommitteeMember];
export const deleteLeader = [leaderInspector, <EHandler>_deleteLeader];
