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
  body("name").exists().withMessage("Your name is required"),
  body("branchName").exists().withMessage("Branch Name is required"),
  body("membershipNo").exists().withMessage("Membership Number is required"),
  body("contactNo").exists().withMessage("Contact Number is required"),
  body("title").exists().withMessage("Title is required"),
  body("description").exists().withMessage("Description is required")
);

/**
 * :: STEP 2
 * Handler
 */

// Add branches Handler
const addIssue: Handler = async (req, res) => {
  const { r } = res;

  if (req.fileValidationError) {
    r.status.BAD_REQ().message("Invalid file type").send();
    return;
  }

  const { name, branchName, membershipNo, contactNo, title, description } =
    req.body;

  //   TODO: Add Image adding part
  const images = [];
  const imageFiles = <any>req.files;
  for (const image of imageFiles) {
    images.push(image.path);
  }
  const issueData = {
    issueId: UUID(),
    issueDate: new Date(),
    status: model.issue.issueStatus.pending,
    name,
    branchName,
    membershipNo,
    contactNo,
    title,
    description,
    images,
  };
    
  const [error, response] = await model.issue.add_Issue(issueData);

  if (error) {
    if (error.code == DBErrorCode.DUPLICATE_ENTRY) {
      r.status.BAD_REQ().message("Issue already exists").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Issue added successfully").send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */
import { uploadPhotos } from "../../utils/storage";

export default [uploadPhotos, inspector, <EHandler>addIssue];
