import databaseConnect from "./conn";
import { MongoServerError } from "mongodb";
import { mongoErrorToDBError, DBErrorCode } from "./dbError";
import { DBConfig, DBConfigTypes } from "./index";
import { config } from "dotenv";

/**
 * // Run mongo db query and return result as an array [error, data]
 * @param fn
 * @returns [error : : { message, code} , data]
 *
 */
export async function runMongoQuery(
  fn: any,
  configs?: DBConfig
): Promise<[any, any]> {
  try {
    const db = await databaseConnect();
    const response = await fn(db);
    if (configs == null) {
      return [null, response];
    }
    if (
      (configs.type === DBConfigTypes.UPDATE_ONE &&
        response.matchedCount === 0) ||
      (configs.type === DBConfigTypes.REQUIRED_ONE && response == null) ||
      ((configs.type == DBConfigTypes.DELETE_ONE ||
        configs.type == DBConfigTypes.DELETE_MANY) &&
        response.deletedCount === 0)
    ) {
      return [{ message: "No data found", code: DBErrorCode.NOT_FOUND }, null];
    } else if (configs.type == DBConfigTypes.FIND_MANY) {
      return [null, await response.toArray()];
    }
    return [null, response];
  } catch (error: any) {
    if (error instanceof MongoServerError) {
      console.log(`MongoServer Error at runMongoQuery: ${error}`);
      return [mongoErrorToDBError(error), null];
    }
    console.log(`Error at runMongoQuery: ${error}`);
    return [error, null];
  }
}
