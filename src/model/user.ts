import { Db } from "mongodb";
import { runMongoQuery } from "../utils/mongoDB";
import { cleanQuery } from "../utils/functions";
import { UserAccount } from "./types";

/**
 * Transaction Pieces
 * @param userData
 */

/**
 * Queries
 * @param userData
 * @param localAccount
 */
export abstract class UserModel {
  private static c_userAccount = "userAccounts";

  static accountTypes = {
    superAdmin: "superAdmin",
    adminEditor: "adminEditor",
    adminViewer: "adminViewer",
    bsEditor: "bsEditor",
    bsViewer: "bsViewer",
    officer: "officer",
  };

  /**
   * Creators
   */
  static async create_UserAccount(userAccount: UserAccount) {
    return await runMongoQuery(async (db: Db) => {
      return await db.collection(this.c_userAccount).insertOne(userAccount);
    });
  }

  /**
   * Update
   */
  static async update_UserAccount(filter: {}, updateData: {}, options = {}) {
    return await runMongoQuery(async (db: Db) => {
      return await db
        .collection(this.c_userAccount)
        .updateOne(filter, { $set: cleanQuery(updateData) }, options);
    });
  }

  static async update_UserAccountAndReturnDoc(filter: {}, updateData: {}, options = {}) {
    return await runMongoQuery(async (db: Db) => {
      return await db
        .collection(this.c_userAccount)
        .findOneAndUpdate(filter, { $set: cleanQuery(updateData) }, { ...options, returnDocument: "after" });
    });
  };

  /**
   * Getters
   */
  // Get user account by username or email
  static async get_LoginAccount(loginKey: string) {
    return await runMongoQuery(async (db: Db) => {
      return await db
        .collection(this.c_userAccount)
        .findOne({ $or: [{ username :loginKey }, { email: loginKey }] });
    });
  };

  // Get user account by user id
  static async get_UserAccount(userId: string) {
    return await runMongoQuery(async (db: Db) => {
      return await db
        .collection(this.c_userAccount)
        .findOne({ userId}, { projection: { password: 0, resetPasswordId : 0, _id : 0 } });
    });
  }
}
