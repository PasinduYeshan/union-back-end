import { Db, ObjectId } from "mongodb";
import { runMongoQuery, DBConfig, DBConfigTypes } from "../utils/mongoDB";
import { cleanQuery } from "../utils/functions";
import { Issue } from "./types";

export abstract class IssueModel {
  private static c_issues = "issues";

  public static issueStatus = {
    pending: "Pending",
    viewed: "Viewed",
    resolved: "Resolved",
  };

  /*
   * Creators
   */
  // Add multiple issues
  static async add_Issue(issueData: any) {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_issues).insertOne(issueData);
    });
  }

  /*
   * Update
   */
  // Update Issue
  static async update_Issue(issueId: string, updateData: {}, options = {}) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_issues)
          .updateOne(
            { issueId },
            { $set: cleanQuery(updateData) }
          );
      },
      { type: DBConfigTypes.UPDATE_ONE }
    );
  }

  /*
   * Getters
   */

  // Get all the issues
  static async get_SingleIssue(issueId: string
  ) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_issues)
          .findOne({issueId});
      },
      { type: DBConfigTypes.REQUIRED_ONE }
    );
  }

  // Get all the issues
  static async get_Issues(
    query: any,
    limit: number = 20,
    page: number = 1,
    sort: any = { issueDate: 1 }
  ) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_issues)
          .find(query)
          .sort(sort)
          .limit(parseInt(limit.toString()))
          .skip((page - 1) * limit);
      },
      { type: DBConfigTypes.FIND_MANY }
    );
  }

  // Get all the issue count
  static async get_IssuesCount(query: any) {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_issues).countDocuments(query);
    });
  }
}
