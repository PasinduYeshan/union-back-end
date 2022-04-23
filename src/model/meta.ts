import { Db } from "mongodb";
import { runMongoQuery, DBConfig, DBConfigTypes } from "../utils/mongoDB";
import { cleanQuery } from "../utils/functions";
import { UserAccount } from "./types";

/*
 * Queries
 * @param userData
 * @param localAccount
 */
export abstract class MemberModel {
  private static c_member = "members";

  /*
   * Creators
   */
  static async add_Branches(branchData: any) {
    return await runMongoQuery(async (db: Db) => {
      return await db.collection(this.c_member).insertMany(branchData);
    });
  }

  /*
   * Update
   */
  static async update_Branch(branchID: string, updateData: {}, options = {}) {
    return await runMongoQuery(
      async (db: Db) => {
        return await db
          .collection(this.c_member)
          .updateOne({ branchID }, { $set: cleanQuery(updateData) });
      },
      { type: DBConfigTypes.UPDATE_ONE }
    );
  }

  /*
   * Getters
   */
  static async get_MemberByNIC(oldNIC: string = "", newNIC: string = "") {
    return await runMongoQuery(async (db: Db) => {
      return await db
        .collection(this.c_member)
        .findOne(
          { $or: [{ oldNIC: oldNIC }, { newNIC: newNIC }] },
          { projection: { _id: 0 } }
        );
    });
  }

  static async get_Members(filters: {}) {
    const query = cleanQuery(filters);
    return await runMongoQuery(async (db: Db) => {
      return await db.collection(this.c_member).find({ $and: query }).toArray();
    }, { type: DBConfigTypes.FIND_MANY });
  }
}
