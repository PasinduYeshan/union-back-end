"use strict";
var  {databaseConnect,disconnect} = require("../dbConnection/conn");

module.exports.up = async function  (next) {
  var db = await databaseConnect();
  await db.createCollection("branches", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["branchName"],
        properties: {
          branchName: {
            bsonType: "string",
            description: "must be a string and is required",
          },
        },
      },
    },
  });
  await db.collection("branches").createIndex({ branchName: 1 }, { unique: true });
  await disconnect();
  // next();
};

module.exports.down = async function (next) {
  var db = await databaseConnect();
  await db.dropCollection("branches");
  await disconnect();
  // next();
};
