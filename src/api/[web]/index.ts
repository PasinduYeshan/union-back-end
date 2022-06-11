import { Router } from "express";
import auth from "../../utils/auth";

import {addBranchSecretary, addCommitteeMembers, addLeader, addAnnouncement} from "./add";
import {updateBranchSecretary, updateCommitteeMember, updateLeader} from "./update";
import { getBranchSecretaries, getCommitteeMembers, getLeaders} from "./get";
import { deleteBranchSecretary, deleteCommitteeMember , deleteLeader} from "./delete";

const rWeb = Router();

// Add
rWeb.post("/add-branch-secretary", auth.officer, addBranchSecretary);
rWeb.post("/add-committee-member", auth.officer, addCommitteeMembers);
rWeb.post("/add-leader", auth.officer, addLeader);
rWeb.post("/add-leader", auth.officer, addAnnouncement);

// Update
rWeb.put("/update-branch-secretary/:branchSecId", auth.officer, updateBranchSecretary);
rWeb.put("/update-committee-member/:committeeMemberId", auth.officer, updateCommitteeMember);
rWeb.put("/update-leader/:leaderId", auth.officer, updateLeader);

// Get
rWeb.get("/get-branch-secretaries", getBranchSecretaries);
rWeb.get("/get-committee-members", getCommitteeMembers);
rWeb.get("/get-leaders", getLeaders);

// Delete
rWeb.delete("/delete-branch-secretary/:branchSecId", auth.officer, deleteBranchSecretary);
rWeb.delete("/delete-committee-member/:committeeMemberId", auth.officer, deleteCommitteeMember);
rWeb.delete("/delete-leader/:leaderId", auth.officer, deleteLeader);

export default rWeb;
