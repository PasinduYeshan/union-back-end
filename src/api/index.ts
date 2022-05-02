import {Router} from "express";
import cAbout from "./about";
import {rBuilder} from "../utils/resp";

import rUser from "./[user]"
import rMeta from "./[meta]";
import rMember from "./[member]";
import rIssue from "./[issue]";

export const rApi = Router();

// Specific middlewares for /api routes
rApi.use(rBuilder);

// Endpoints
rApi.get("/", cAbout);

// Routers
rApi.use("/user", rUser)
rApi.use("/meta", rMeta)
rApi.use("/member", rMember)
rApi.use("/issue", rIssue)

// Router
export default rApi
