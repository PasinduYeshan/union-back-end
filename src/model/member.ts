import { Db } from "mongodb";
import { runMongoQuery, DBConfigTypes } from "../utils/mongoDB";
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
  static async get_MemberByUserId(userId: string) {
    return await runMongoQuery(
      async (db: Db) => {
        return await db
          .collection(this.c_member)
          .findOne({ userId }, { projection: { _id: 0 } });
      },
      { type: DBConfigTypes.REQUIRED_ONE }
    );
  }

  static async get_MemberByNIC(oldNIC: string = "", newNIC: string = "") {
    return await runMongoQuery(
      async (db: Db) => {
        return await db
          .collection(this.c_member)
          .findOne(
            { $or: [{ oldNIC: oldNIC }, { newNIC: newNIC }] },
            { projection: { _id: 0 } }
          );
      },
      { type: DBConfigTypes.REQUIRED_ONE }
    );
  }

  // Get all the issues
  static async get_Members(
    query: any,
    limit: number = 20,
    page: number = 1,
    sort: any = { issueDate: 1 }
  ) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_member)
          .find(query)
          .sort(sort)
          .limit(parseInt(limit.toString()))
          .skip((page - 1) * limit);
      },
      { type: DBConfigTypes.FIND_MANY }
    );
  }

  // Get all the members count
  static async get_MembersCount(query: any) {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_member).countDocuments(query);
    });
  }
}
