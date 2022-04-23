import { UserModel } from "./user";
import { MemberModel } from "./member";
import { MetaModel } from "./meta";

export { DBErrorCode } from "../utils/mongoDB";

export const model = {
  user: UserModel,
  member: MemberModel,
  meta: MetaModel,
};

export default model;
