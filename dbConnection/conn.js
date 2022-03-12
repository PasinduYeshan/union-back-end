const MongoClient = require("mongodb").MongoClient;
// Mongodb options
const mongoOptions = {
  // tls: true,
  // tlsCaFile: process.env.MONGODB_CA_FILE,
};

const dbName = process.env.MONGODB_DB_NAME || "upto";
const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri, mongoOptions);

let dbInstance;

// MongoDB Connection
module.exports.databaseConnect = async function () {
  try {
    if (dbInstance) {
      console.log("Requested database connection but already connected");
      return dbInstance;
    }
    
    await client.connect();
    console.log("Connected to MongoDB");
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (err) {
    console.error(err);
  }
}

module.exports.disconnect = async function () {
    await client.close();
    console.log("Disconnected from MongoDB");
    }