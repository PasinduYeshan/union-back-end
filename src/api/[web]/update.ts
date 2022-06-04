import { EHandler, Handler, Log } from "../../utils/types";
import { inspectBuilder, body, param } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";

/**
 * :: STEP 1
 * Validation
 */
const branchSecretaryInspector = inspectBuilder(
  param("branchSecId").exists().withMessage("Branch Secretary ID is required")
);

const committeeMemberInspector = inspectBuilder(
  param("committeeMemberId")
    .exists()
    .withMessage("Committee Member ID is required")
);

const leaderInspector = inspectBuilder(
  param("leaderId").exists().withMessage("Leader ID is required")
);

/**
 * :: STEP 2
 * Handler
 */
// Add branch secretary
const _updateBranchSecretary: Handler = async (req, res) => {
  const { r } = res;
  const { branchSecId } = req.params;
  const { name, branchName, contactNo } = req.body;

  const data = {
    name,
    branchName,
    contactNo,
  };

  const [error, response] = await model.web.update_BranchSecretary(
    branchSecId,
    data
  );

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Branch Secretary not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Branch Secretary updated successfully").send();
};

// Add committee member
const _updateCommitteeMember: Handler = async (req, res) => {
  const { r } = res;
  const { committeeMemberId } = req.params;
  const { name, position, contactNo, order } = req.body;

  const data = {
    name,
    position,
    contactNo,
    order,
  };

  const [error, response] = await model.web.update_CommitteeMember(
    committeeMemberId,
    data
  );

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Committee Member not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Committee Member updated successfully").send();
};

// Add committee member
const _updateLeader: Handler = async (req, res) => {
  const { r } = res;
  const { leaderId } = req.params;
  const { name, position, contactNo, order } = req.body;

  const data = {
    name,
    position,
    contactNo,
    order,
  };

  const [error, response] = await model.web.update_Leader(leaderId, data);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Leader not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Leader updated successfully").send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */
export const updateBranchSecretary = [
  branchSecretaryInspector,
  <EHandler>_updateBranchSecretary,
];
export const updateCommitteeMember = [
  committeeMemberInspector,
  <EHandler>_updateCommitteeMember,
];
export const updateLeader = [leaderInspector, <EHandler>_updateLeader];
