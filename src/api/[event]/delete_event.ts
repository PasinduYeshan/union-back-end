import { EHandler, Handler, Log } from "../../utils/types";
import { inspectBuilder, body, param } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";

/**
 * :: STEP 1
 * Validation
 */
const inspector = inspectBuilder(
  param("eventId").exists().withMessage("Event Id is required")
);

/**
 * :: STEP 2
 * Handler
 */

const deleteEvent: Handler = async (req, res) => {
  const { r } = res;
  
  const { eventId } = req.params;

  const [error, response] = await model.event.delete_Event(eventId);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Event Not Found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Event deleted successfully").send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */

export default [inspector, <EHandler>deleteEvent];
