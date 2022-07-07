import { EHandler, Handler, Log } from "../../utils/types";
import { inspectBuilder, body, param, query } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";
import { v4 as UUID } from "uuid";
import { Issue } from "../../model/types";
import { cleanQuery } from "../../utils/functions";

/**
 * :: STEP 1
 * Validation
 */
const inspector = inspectBuilder(
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
);

const singleEventInspector = inspectBuilder(
  param("eventId").exists().withMessage("Event ID is required")
);

/**
 * :: STEP 2
 * Handler
 */

// Get event list
const _getEvent: Handler = async (req, res) => {
  const { r } = res;

  const page: number = (req.query.page as unknown as number) || 1;
  const limit: number = (req.query.limit as unknown as number) || 99999999999;
  const sort: any =
    req.query.sort == "asc" ? { date: 1 } : { date: -1 };

  const [err1, count] = await model.event.get_EventsCount({});
  const [error, response] = await model.event.get_Events({}, limit, page, sort);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Event Not Found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status
    .OK()
    .message("Events")
    .data({
      count,
      events: response,
    })
    .send();
};

// Get single event
const _getSingleEvent: Handler = async (req, res) => {
  const { r } = res;

  const eventId = req.params.eventId;

  const [error, response] = await model.event.get_SingleEvent(eventId);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Event Not Found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Event").data(response).send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */

export const getEvents = [inspector, <EHandler>_getEvent];
export const getSingleEvent = [inspector, <EHandler>_getSingleEvent];
