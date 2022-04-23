import { v4 as UUID } from "uuid";
import { EHandler, Handler, Log } from "../../utils/types";
import { encrypt_password } from "../../utils/hasher";
import { inspectBuilder, body, param } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";
import { setQueryValues } from "../../utils/functions";

/**
 * :: STEP 1
 * Validation
 */


/**
 * :: STEP 2
 * Find members
 */
const findSingleMember: Handler = async (req, res) => {
    const { r } = res;
    const { oldNIC, newNIC } = setQueryValues(req.query);
    const [err, response] = await model.member.get_MemberByNIC(oldNIC, newNIC);
    if (err) {
        r.pb.ISE()
    } else {
        if (response == null) {
            r.status.NOT_FOUND().message("Member not found").send();
        } else {
            r.status.OK().data(response).message("Member found").send();
        }
    }
}

const findMultipleMembers: Handler = async (req, res) => {
    const { r } = res;
    const { oldNIC, newNIC } = setQueryValues(req.query);
    const [err, response] = await model.member.get_MemberByNIC(oldNIC, newNIC);
    if (err) {
        r.pb.ISE()
    } else {
        if (response == null) {
            r.status.NOT_FOUND().message("Member not found").send();
        } else {
            r.status.OK().data(response).message("Member found").send();
        }
    }
}

/**
 * :: STEP 3
 * 
 */
export const getSingleMember = [<EHandler>findSingleMember];
export const getMultipleMembers = [<EHandler> findMultipleMembers];


