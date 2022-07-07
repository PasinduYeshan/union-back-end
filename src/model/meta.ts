import { Db , ObjectId} from "mongodb";
import { runMongoQuery, DBConfig, DBConfigTypes } from "../utils/mongoDB";
import { cleanQuery } from "../utils/functions";
import { UserAccount } from "./types";

export abstract class MetaModel {
  private static c_branches = "branches";

  /*
   * Creators
   */
  // Add multiple branches
  static async add_Branches(branchData: any) {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_branches).insertMany(branchData);
    });
  }

  /*
   * Update
   */
  // Update single branch
  static async update_Branch(branchID: string, updateData: {}, options = {}) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_branches)
          .updateOne({ _id : new ObjectId(branchID) }, { $set: cleanQuery(updateData) });
      },
      { type: DBConfigTypes.UPDATE_ONE }
    );
  }

  /*
   * Getters
   */

  // Get all the branches
  static async get_Branches() {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_branches).find();
    }, { type: DBConfigTypes.FIND_MANY });
  }
}
