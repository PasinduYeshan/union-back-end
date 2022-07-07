import { EHandler, Handler, Log } from "../../utils/types";
import { inspectBuilder, body, param } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";

/**
 * :: STEP 1
 * Validation
 */
const addBranchInspector = inspectBuilder(
  body("branches")
    .exists()
    .withMessage("Branch details are required")
);

const updateBranchInspector = inspectBuilder(
  param("branchId").exists().withMessage("Branch Id is required")
);

/**
 * :: STEP 2
 * Handler
 */

// Add branches Handler
const addBranches: Handler = async (req, res, next) => {
  const { r } = res;
  const { branches } = req.body;
  
  // Add branches to the database
  const [error, response] = await model.meta.add_Branches(branches);

  if (error) {
    if (error.code == DBErrorCode.DUPLICATE_ENTRY) {
      r.status.BAD_REQ().message("Branch already exists").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Branches added successfully").send();
};

// UPdate branch Handler
const updateBranch: Handler = async (req, res, next) => {
  const { r } = res;
  const branchId: string = req.params.branchId as string;
    const { branchName } = req.body;
    
  // Update branch in the database
  const [error, response] = await model.meta.update_Branch(
    branchId,
    {branchName}
  );

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.NOT_FOUND().message("Branch not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Branch updated successfully").send();
};

// Get branch Handler
const getBranches: Handler = async (req, res, next) => {
  const { r } = res;

  // Get branches from the database
  const [error, response] = await model.meta.get_Branches();

  if (error) {
    r.pb.ISE();
    return;
  }

  r.status
    .OK()
    .message("Branches retrieved successfully")
    .data(response)
    .send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */
export const addBranchesHandler = [addBranchInspector, <EHandler>addBranches];
export const updateBranchHandler = [updateBranchInspector, <EHandler>updateBranch];
export const getBranchesHandler = [<EHandler>getBranches];

