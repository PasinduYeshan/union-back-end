import { v4 as UUID } from "uuid";
import { EHandler, Handler, Log } from "../../utils/types";
import { encrypt_password } from "../../utils/hasher";
import { inspectBuilder, body, param } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
  param("userId").exists().withMessage("User Id is required")
);

/**
 * :: STEP 2
 * Delete member from database
 * @param req
 * @param res
 */
const _deleteMember: Handler = async (req, res) => {
  const { r } = res;
  const userId = req.params.userId;

  const [err, response] = await model.member.delete_Member(userId);

  if (err) {
    if (err.code === DBErrorCode.NOT_FOUND) {
      r.status.NOT_FOUND().message("Member not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  } else {
    r.status.OK().message("Successfully deleted").send();
  }
};

/**
 * :: STEP 3
 * Request Handler chain
 *
 */
export default [inspector, <EHandler>_deleteMember];
