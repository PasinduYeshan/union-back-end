import { UserModel } from "./user";
import { MemberModel } from "./member";
import { MetaModel } from "./meta";
import { IssueModel } from "./issue";

export { DBErrorCode } from "../utils/mongoDB";

export const model = {
  user: UserModel,
  member: MemberModel,
  meta: MetaModel,
  issue: IssueModel,
};

export default model;
