import { Router } from "express";
import auth from "../../utils/auth";

import {addBranchSecretary, addCommitteeMembers} from "./add";
import {updateBranchSecretary, updateCommitteeMember} from "./update";
import { getBranchSecretaries, getCommitteeMembers } from "./get";
import { deleteBranchSecretary, deleteCommitteeMember } from "./delete";

const rWeb = Router();

// Add
rWeb.post("/add-branch-secretary", auth.officer, addBranchSecretary);
rWeb.post("/add-committee-member", auth.officer, addCommitteeMembers);

// Update
rWeb.put("/update-branch-sec/:branchSecId", auth.officer, updateBranchSecretary);
rWeb.put("/update-committee-member/:committeeMemberId", auth.officer, updateCommitteeMember);

// Get
rWeb.get("/get-branch-secretaries", getBranchSecretaries);
rWeb.get("/get-committee-members", getCommitteeMembers);

// Delete
rWeb.delete("/delete-branch-secretary/:branchSecId", auth.officer, deleteBranchSecretary);
rWeb.delete("/delete-committee-member/:committeeMemberId", auth.officer, deleteCommitteeMember);

export default rWeb;
