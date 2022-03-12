"use strict";
var  {databaseConnect,disconnect} = require("../dbConnection/conn");

module.exports.up = async function  (next) {
  var db = await databaseConnect();
  await db.createCollection("userAccounts", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "NIC", "username"],
        properties: {
          email: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          NIC: {
            bsonType: "string",
            description: "must be a string and is required",
          },
        },
      },
    },
  });
  await db.collection("userAccounts").createIndex({ email: 1 }, { unique: true });
  await db.collection("userAccounts").createIndex({ NIC: 1 }, { unique: true });
  await db.collection("userAccounts").createIndex({ username: 1 }, { unique: true });
  await disconnect();
  // next();
};

module.exports.down = async function (next) {
  var db = await databaseConnect();
  await db.dropCollection("userAccounts");
  await disconnect();
  // next();
};
