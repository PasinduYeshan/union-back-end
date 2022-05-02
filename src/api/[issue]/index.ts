import { Router } from "express";
import auth from "../../utils/auth";

import addIssue from "./add_issue";
import updateIssue from './update_issue';
import getIssues from './get_issues';

const rIssue = Router();

// Add issue
rIssue.post("/add", addIssue);

// Update issue
rIssue.put('/update/:issueId', auth.admin, updateIssue);

// Get issues
rIssue.get('/get', auth.admin, getIssues);



export default rIssue;