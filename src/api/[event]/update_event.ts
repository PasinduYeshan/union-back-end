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
const updateEvent: Handler = async (req, res) => {
  const { r } = res;

  if (req.fileValidationError) {
    r.status.BAD_REQ().message("Invalid file type").send();
    return;
  }

  const { eventId } = req.params;
  const { date, title, description } = req.body;

  //   TODO: Add Image adding part
  const images = [];
  const imageFiles = <any>req.files;
  if (imageFiles) {
    for (const image of imageFiles) {
      images.push(image.path);
    }
  }

  const updateData = {
    date: date ? new Date(date) : date,
    title,
    description,
    images,
  };
  const [error, response] = await model.event.update_Event(eventId, updateData);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Event Not Found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Event updated successfully").send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */
import { uploadPhotos } from "../../utils/storage";

export default [uploadPhotos, inspector, <EHandler>updateEvent];
