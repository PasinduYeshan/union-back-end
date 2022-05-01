import {Db} from "mongodb";
import {runMongoQuery, DBConfigTypes} from "../utils/mongoDB";
import {cleanQuery} from "../utils/functions";
import {UserAccount} from "./types";

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
        return await runMongoQuery(
            async (db: Db) => {
                return await db
                    .collection(this.c_userAccount)
                    .updateOne(filter, {$set: cleanQuery(updateData)}, options);
            },
            {type: DBConfigTypes.UPDATE_ONE}
        );
    }

    static async update_UserAccountAndReturnDoc(
        filter: {},
        updateData: {},
        options = {}
    ) {
        return await runMongoQuery(
            async (db: Db) => {
                return await db
                    .collection(this.c_userAccount)
                    .findOneAndUpdate(
                        filter,
                        {$set: cleanQuery(updateData)},
                        {...options, returnDocument: "after"}
                    );
            },
            {type: DBConfigTypes.UPDATE_ONE}
        );
    }

    /**
     * Getters
     */
    // Get user account by username or email
    static async get_LoginAccount(loginKey: string) {
        return await runMongoQuery(
            async (db: Db) => {
                return await db
                    .collection(this.c_userAccount)
                    .findOne({$or: [{username: loginKey}, {email: loginKey}]});
            },
            {type: DBConfigTypes.REQUIRED_ONE}
        );
    }

    // Get user account by user id
    static async get_UserAccount(userId: string) {
        return await runMongoQuery(
            async (db: Db) => {
                return await db
                    .collection(this.c_userAccount)
                    .findOne(
                        {userId},
                        {projection: {password: 0, resetPasswordId: 0, _id: 0}}
                    );
            },
            {type: DBConfigTypes.REQUIRED_ONE}
        );
    }

    // Get user account by accountType
    static async get_UserAccounts(accountTypes: string[]): Promise<any> {
        // Get accounts which are active or not have been inactive more than 30 days
        const disabledDate = new Date();
        disabledDate.setDate(disabledDate.getDate() - 31);
        return await runMongoQuery(
            async (db: Db) => {
                return db.collection(this.c_userAccount).find(
                    {
                        $and: [
                            {accountType: {$in: accountTypes}},
                            {
                                $or: [{status: "Active"}, {
                                    $and: [
                                        {status: "Inactive"},
                                        {"lastUpdatedBy.time": {$gte: disabledDate}},
                                    ],
                                }]
                            },
                        ],
                    },
                    {
                        projection: {
                            password: 0,
                            resetPasswordId: 0,
                            _id: 0,
                            createdBy: 0,
                            lastUpdatedBy: 0,
                        },
                    }
                );
            },
            {type: DBConfigTypes.FIND_MANY}
        );
    }

    // Get user account by accountType
    static async get_UserAccountsSuperAdmin(
        accountTypes: string[],
        email?: string,
        name?: string
    ) {
        return await runMongoQuery(
            async (db: Db) => {
                return db.collection(this.c_userAccount).find(
                    {
                        $or: [
                            {accountType: {$in: accountTypes}},
                            {name: `/${name}/`},
                            {email: `/${email}/`},
                        ],
                    },
                    {
                        sort: {name: 1},
                        projection: {
                            password: 0,
                        },
                    }
                );
            },
            {type: DBConfigTypes.FIND_MANY}
        );
    }
}
