import { EHandler, Handler, Log } from "../../utils/types";
import { inspectBuilder, body, param } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";
import { v4 as UUID } from "uuid";
import { Issue } from "../../model/types";

/**
 * :: STEP 1
 * Validation
 */
const inspector = inspectBuilder(
  body("title").exists().withMessage("Title is required"),
  body("description").exists().withMessage("Description is required"),
  body("date").exists().withMessage("Date is required")
);

/**
 * :: STEP 2
 * Handler
 */

// Add event Handler
const addEvent: Handler = async (req, res) => {
  const { r } = res;

  if (req.fileValidationError) {
    r.status.BAD_REQ().message("Invalid file type").send();
    return;
  }

  const { date, title, description } = req.body;

  // //   TODO: Add Image adding part
  const images = [];
  const imageFiles = <any>req.files;
  if (imageFiles) {
    for (const image of imageFiles) {
      images.push(image.path);
    }
  }

  const eventData = {
    eventId: UUID(),
    date: new Date(date),
    title,
    description,
    images,
  };
  const [error, response] = await model.event.add_Event(eventData);

  if (error) {
    if (error.code == DBErrorCode.DUPLICATE_ENTRY) {
      r.status.BAD_REQ().message("Event already exists").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Event added successfully").send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */
import { uploadPhotos } from "../../utils/storage";

export default [uploadPhotos, inspector, <EHandler>addEvent];
