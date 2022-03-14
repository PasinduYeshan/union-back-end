
import databaseConnect from "./conn"
import { MongoServerError } from "mongodb";
import { mongoErrorToDBError } from "./dbError";

/**
 * // Run mongo db query and return result as an array [error, data]
 * @param fn 
 * @returns [error : : { message, code} , data]
 * 
 */
export async function runMongoQuery(fn : any) {
    try {
        const db = await databaseConnect();
        const response = await fn(db);
        return [null , response]
    } catch (error : any ){
        if (error instanceof MongoServerError) {
            console.log(`MongoServer Error at runMongoQuery: ${error}`); 
            return [mongoErrorToDBError(error), null]
        }
        console.log(`Error at runMongoQuery: ${error}`);
        return [error, null]
    }
}

// Clean query object to remove null or undefined values
export function cleanQuery(query: any, fields: string[] | null = null) {
    const qClone = {...query}
    Object.keys(qClone).forEach(
        (k) => {
            if (fields === null || fields.includes(k) ) {
                (qClone[k] === null || qClone[k] === undefined) && delete qClone[k]
            } else {
                delete qClone[k]
            }

        }
    )

    return qClone
}