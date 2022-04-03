import { Router } from "express";
import auth from "../../utils/auth";

import addMember from "./add_member";
import updateMember from "./update_member";
import { getSingleMember, getMultipleMembers } from "./get_member";

const rMember = Router();

// Create member
rMember.post("/add", auth.bsEditor,addMember );

// Update member
rMember.put("/update/:userId", auth.bsEditor, updateMember);

// Get member
rMember.get("/get", auth.bsViewer, getSingleMember);
rMember.get("/find", auth.bsViewer, getMultipleMembers);

export default rMember;