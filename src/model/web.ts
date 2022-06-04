import { Db, ObjectId } from "mongodb";
import { runMongoQuery, DBConfig, DBConfigTypes } from "../utils/mongoDB";
import { cleanQuery } from "../utils/functions";
import { Event } from "./types";

export abstract class WebModel {
  private static c_leaders = "leaders";
  private static c_branch_secretaries = "branch_secretaries";
  private static c_committee_members = "committee_members";

  /*
   * Creators
   */
  // Add multiple branch secretaries
  static async add_BranchSecretaries(branchSecretaries: any) {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_branch_secretaries).insertMany(branchSecretaries);
    });
  }

  // Add multiple committee members
  static async add_CommitteeMembers(committeeMembers: any) {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_committee_members).insertMany(committeeMembers);
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

  /*
   * Getters
   */
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
