require("dotenv").config();
import { Db, MongoClient } from "mongodb";
import {DBErrorCode} from "./dbError"

// Mongodb options
const mongoOptions = {
  // tls: true,
  // tlsCaFile: process.env.MONGODB_CA_FILE,
};

const dbName = process.env.MONGODB_DB_NAME || "upto";
const uri: string = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
// const uri: string = "mongodb://124.0.0.1:27017";
const client = new MongoClient(uri, mongoOptions);

let dbInstance: any;

// MongoDB Connection
export default async function databaseConnect() {
  try {
    if (dbInstance) {
      console.log("Requested database connection but already connected");
      return dbInstance;
    }
    // Logging
    const eventNames = ["commandStarted", "commandSucceeded", "commandFailed"];
    eventNames.map((eventName) => client.on(eventName, event =>  console.log(`received ${eventName}: ${JSON.stringify(event, null, 2)}`)));
    await client.connect();
    console.log("Connected to MongoDB");
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (err : any) {
    console.error("MongoDB Connection Issue: ", err);
    throw {code : DBErrorCode.DB_CONNECTION, message : err.toString()};
  }
}




