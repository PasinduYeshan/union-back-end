import { Router } from "express";
import auth from "../../utils/auth";

import addMember from "./add_member";
import updateMember from "./update_member";
import { findSingleMember, findMultipleMembers, getMemberByUserId } from "./get_member";

const rMember = Router();

// Create member
rMember.post("/add", auth.bsEditor,addMember );

// Update member
rMember.put("/update/:userId", auth.bsEditor, updateMember);

// Get member
rMember.get("/get", auth.bsViewer, findSingleMember);
rMember.get("/get/:userId", auth.bsViewer, getMemberByUserId);
rMember.get("/find", auth.bsViewer, findMultipleMembers, getMemberByUserId);

export default rMember;