require("dotenv").config();
import { MongoClient } from "mongodb";

// Mongodb options
const mongoOptions = {
  // tls: true,
  // tlsCaFile: process.env.MONGODB_CA_FILE,
};

const dbName = process.env.MONGODB_DB_NAME;
const uri: string = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri, mongoOptions);

// MongoDB Connection
async function databaseConnect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(dbName);
    return db;
  } catch (err) {
    console.error(err);
  }
}

// export default databaseConnect;
export const mongodb = databaseConnect();
