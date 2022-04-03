import { UserModel } from "./user";
import { MemberModel } from "./member";

export {DBErrorCode} from "../utils/mongoDB";

export const model = {
    user: UserModel,
    member : MemberModel,

};

export default model;
