import databaseConnect from "./conn";
import { MongoServerError } from "mongodb";
import { mongoErrorToDBError, DBErrorCode } from "./dbError";
import { DBConfig, DBConfigTypes } from "./index";

/**
 * // Run mongo db query and return result as an array [error, data]
 * @param fn
 * @returns [error : : { message, code} , data]
 *
 */
export async function runMongoQuery(fn: any, configs?: DBConfig) {
  try {
    const db = await databaseConnect();
    const response = await fn(db);
    console.log(response);
    if (
      configs != null &&
      ((configs.type === DBConfigTypes.UPDATE_ONE &&
        response.matchedCount === 0) ||
        (configs.type === DBConfigTypes.REQUIRED_ONE && response == null))
    ) {
      return [{ message: "No data found", code: DBErrorCode.NOT_FOUND }, null];
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
