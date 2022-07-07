import { Router } from "express";
import auth from "../../utils/auth";

import {
  addBranchesHandler,
  updateBranchHandler,
  getBranchesHandler,
} from "./branches";

const rMeta = Router();

rMeta.get("/", (_, res) => res.send("Meta data module"));

// Branch APIs
rMeta.post("/branches", auth.officer, addBranchesHandler);
rMeta.put("/branches/:branchId", auth.officer, updateBranchHandler);
rMeta.get("/branches", getBranchesHandler);

export default rMeta;
