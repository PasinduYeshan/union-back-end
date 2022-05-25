import { Db, ObjectId } from "mongodb";
import { runMongoQuery, DBConfig, DBConfigTypes } from "../utils/mongoDB";
import { cleanQuery } from "../utils/functions";
import { Event } from "./types";

export abstract class EventModel {
  private static c_events = "events";

  /*
   * Creators
   */
  // Add multiple issues
  static async add_Event(eventData: any) {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_events).insertOne(eventData);
    });
  }

  /*
   * Update
   */
  // Update Issue
  static async update_Event(eventId: string, updateData: {}, options = {}) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_events)
          .updateOne(
            { eventId },
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
  static async get_SingleEvent(eventId: string
  ) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_events)
          .findOne({eventId});
      },
      { type: DBConfigTypes.REQUIRED_ONE }
    );
  }

  // Get all the issues
  static async get_Events(
    query: any,
    limit: number = 20,
    page: number = 1,
    sort: any = { issueDate: 1 }
  ) {
    return await runMongoQuery(
      async (db: Db) => {
        return db
          .collection(this.c_events)
          .find(query)
          .sort(sort)
          .limit(parseInt(limit.toString()))
          .skip((page - 1) * limit);
      },
      { type: DBConfigTypes.FIND_MANY }
    );
  }

  // Get all the issue count
  static async get_EventsCount(query: any) {
    return await runMongoQuery(async (db: Db) => {
      return db.collection(this.c_events).countDocuments(query);
    });
  }
}
