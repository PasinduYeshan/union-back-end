import { Db } from "mongodb";
import { runMongoQuery } from "../utils/mongoDB";
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
  static async create_Member(memberData: any) {
    return await runMongoQuery(async (db: Db) => {
      return await db.collection(this.c_member).insertOne(memberData);
    });
  }

  /*
   * Update
   */
  static async update_Member(userId: string, updateData: {}, options = {}) {
    return await runMongoQuery(async (db: Db) => {
      return await db
        .collection(this.c_member)
        .updateOne({ userId }, { $set: cleanQuery(updateData) }, options);
    });
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
    console.log(query);
    return await runMongoQuery(async (db: Db) => {
      return await db.collection(this.c_member).find({ $and: query }).toArray();
    });
  }
}
