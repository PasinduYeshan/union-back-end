import {v4 as UUID} from "uuid";
import {EHandler, Handler, Log} from "../../../utils/types";
import {encrypt_password} from "../../../utils/hasher";
import {inspectBuilder, body} from "../../../utils/inspect";
import model, {DBErrorCode} from "../../../model";

require("dotenv").config();
import generator from 'generate-password';

import {sendEmailTemplate} from "../../../utils/mail";
import {TokenMan} from "../../../utils/tokenMan";

// Configs
const superAdminKey = process.env.SUPER_ADMIN_KEY || "";
const saEmails = process.env.SUPER_ADMIN_EMAIL || "";
const superAdminEmails = saEmails ? saEmails.split(",") : [];

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    body("username").exists().withMessage("username is required"),
    body("name").exists().withMessage("name is required"),
    body("NIC").exists().withMessage("NIC is is required"),
    body("contactNo")
        .exists()
        .isMobilePhone("any")
        .withMessage("contact number is required"),
    body("branchName").optional(),
    body("accountType")
        .optional()
        .isIn([...Object.values(model.user.accountTypes)]),
    body("security")
        .custom((value: any, {req}: any) =>
            req.body.accountType == model.user.accountTypes.superAdmin
                ? value == superAdminKey
                : true
        )
        .withMessage("You are not allowed to create super admin account"),
    body("email")
        .exists()
        .isEmail()
        .withMessage("email is required")
        .custom((value: any, {req}: any) =>
            req.body.accountType == model.user.accountTypes.superAdmin
                ? superAdminEmails.includes(value)
                : true
        )
        .withMessage("You are not allowed to create super admin account")
);

/**
 * :: STEP 2
 * Create a new user account -> Super admin, admin, branch secretary, officer
 * @param req body
 * @param res
 *  message
 */
const registerUserAccount: Handler = async (req, res) => {
    const {r} = res;

    // Check if users except super admin are registered by unauthorized users.
    if (
        req.body.accountType != model.user.accountTypes.superAdmin &&
        req.user == null
    ) {
        r.status.UN_AUTH().message("You are not allowed to create users").send();
    }
    ;

    // Setup Data
    const userId = UUID();

    const {
        username,
        name,
        NIC,
        email,
        contactNo,
        branchName,
        accountType,
    } = req.body;

    // For development purposes every user account password will be 'password'
    const password = process.env.NODE_ENV == 'development' ? generator.generate({
        length: 6,
        numbers: true,
    }) : 'password';

    const resetPasswordId = UUID();

    let userData = {
        userId,
        username,
        password: await encrypt_password(password),
        name,
        NIC,
        email,
        contactNo,
        branchName,
        accountType,
        status: "Active",
        createdBy: {},
        lastUpdatedBy: {},
        resetPasswordId
    };

    // Log of who is creating the user account
    let createdBy: Log;
    if (
        req.user != null &&
        req.user.accountType != model.user.accountTypes.superAdmin
    ) {
        createdBy = {
            userId: req.user.userId,
            name: req.user.name,
            time: new Date(),
        };
        userData = {...userData, createdBy};
    }

    // Sync model to database
    const [error, response] = await model.user.create_UserAccount(userData);
    if (error) {
        switch (error.code) {
            case DBErrorCode.DUPLICATE_ENTRY:
                r.status
                    .BAD_REQ()
                    .message(
                        "Duplicate Data Entry, Check if another user is having the same username or email or NIC"
                    )
                    .send();
                return;
            default:
                r.pb.ISE();
        }
        return;
    }

    /*
    * Send password reset email to new user since random password is set.
     */

    // Create token with resetPasswordId
    const payload = {
        resetPasswordId,
    };
    const resetPasswordToken = TokenMan.getResetPasswordToken(payload);

    try {
        const url = `${process.env.PASSWORD_RESET_PAGE_URL}?rt=${resetPasswordToken}`;
        await sendEmailTemplate(
            "resetPasswordEmail.handlebars",
            email,
            "UPTO Password Reset",
            {url, name}
        );
        // Send Response
        r.status.OK().message("User Registered Successfully").send();
        return;
    } catch (error) {
        console.log("Password reset email sending error : ", error);
        r.pb.ISE();
        return;
    }
};

/**
 * Request Handler Chain
 */
export default [inspector, <EHandler>registerUserAccount];
