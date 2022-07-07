// Export all the MongoDb Functions

import databaseConnect from "./conn";

export interface DBConfig {
    type : DBConfigTypes,
}

export enum DBConfigTypes {
    UPDATE_ONE,
    REQUIRED_ONE,
    FIND_MANY,
    DELETE_ONE,
    DELETE_MANY
}

export  {databaseConnect} ;
export { DBErrorCode, NoError, NotFound } from "./dbError";
export { runMongoQuery } from "./resolver";

