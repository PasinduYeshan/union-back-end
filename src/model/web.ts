import { Db, ObjectId } from "mongodb";
import { runMongoQuery, DBConfig, DBConfigTypes } from "../utils/mongoDB";
import { cleanQuery } from "../utils/functions";
import { BranchSecretary, Leader, CommitteeMember } from "./types";

export abstract class WebModel {
  private static c_leaders = "leaders";
  private static c_branch_secretaries = "branch_secretaries";
  private static c_committee_members = "committee_members";

  /*
   * Creators
   */
  // Add multiple branch secretaries
  static async add_BranchSecretaries(data: BranchSecretary ) {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_branch_secretaries).insertOne(data);
    });
  }

  // Add multiple committee members
  static async add_CommitteeMembers(data: CommitteeMember) {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_committee_members).insertOne(data);
    });
  }

  // Add multiple leaders
  static async add_Leader(data: Leader) {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_leaders).insertOne(data);
    });
  }

  /*
   * Update
   */
  // Update Branch Secretary
  static async update_BranchSecretary(branchSecId: string, updateData: {}, options = {}) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_branch_secretaries)
          .updateOne(
            { branchSecId },
            { $set: cleanQuery(updateData) }
          );
      },
      { type: DBConfigTypes.UPDATE_ONE }
    );
  }

  // Update committee member data
  static async update_CommitteeMember(committeeMemberId: string, updateData: {}, options = {}) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_committee_members)
          .updateOne(
            { committeeMemberId },
            { $set: cleanQuery(updateData) }
          );
      },
      { type: DBConfigTypes.UPDATE_ONE }
    );
  }

  // Update leader data
  static async update_Leader(leaderId: string, updateData: {}, options = {}) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_leaders)
          .updateOne(
            { leaderId },
            { $set: cleanQuery(updateData) }
          );
      },
      { type: DBConfigTypes.UPDATE_ONE }
    );
  }


  /*
   * Delete
   */
  // Delete branch secretary
  static async delete_BranchSecretary(branchSecId: string) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_branch_secretaries)
          .deleteOne(
            { branchSecId },
          );
      },
      { type: DBConfigTypes.DELETE_ONE }
    );
  }

  // Delete committee member
  static async delete_CommitteeMember(committeeMemberId: string) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_committee_members)
          .deleteOne(
            { committeeMemberId },
          );
      },
      { type: DBConfigTypes.DELETE_ONE }
    );
  }

  // Delete leader
  static async delete_Leader(leaderId: string) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_leaders)
          .deleteOne(
            { leaderId },
          );
      },
      { type: DBConfigTypes.DELETE_ONE }
    );
  }

  /*
   * Getters
   */
  // Get all the leaders
  static async get_Leaders(
    sort: any = { order: 1 }
  ) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_leaders)
          .find()
          .sort(sort)
      },
      { type: DBConfigTypes.FIND_MANY }
    );
  }

  // Get all branch secretaries
  static async get_BranchSecretaries(
    sort: any = { branchName: 1 }
  ) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_branch_secretaries)
          .find()
          .sort(sort)
      },
      { type: DBConfigTypes.FIND_MANY }
    );
  }

  // Get all committee members
  static async get_CommitteeMembers(
    sort: any = { order: 1 }
  ) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_branch_secretaries)
          .find()
          .sort(sort)
      },
      { type: DBConfigTypes.FIND_MANY }
    );
  }

  // Get count of committee members
  static async get_CommitteeMemberCount() {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_committee_members).countDocuments();
    });
  }

}
