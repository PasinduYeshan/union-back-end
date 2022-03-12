import { UserModel } from "./user";

export {DBErrorCode} from "../utils/mongoDB";

export const model = {
    user: UserModel,
};

export default model;
