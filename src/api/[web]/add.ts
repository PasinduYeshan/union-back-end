import { EHandler, Handler, Log } from "../../utils/types";
import { inspectBuilder, body, param } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";
import { v4 as UUID } from "uuid";
import { Issue } from "../../model/types";

/**
 * :: STEP 1
 * Validation
 */
const branchSecretaryInspector = inspectBuilder(
  body("name").exists().withMessage("Name is required"),
  body("branchName").exists().withMessage("Branch Name is required"),
  body("contactNo")
    .exists()
    .withMessage("Contact Number is required")
    .isMobilePhone("any")
    .withMessage("Contact Number is invalid")
);

const committeeMemberInspector = inspectBuilder(
  body("name").exists().withMessage("Name is required"),
  body("position").exists().withMessage("Position is required"),
  body("contactNo")
    .optional()
    .isMobilePhone("any")
    .withMessage("Contact Number is invalid"),
  body("order")
    .exists()
    .withMessage("Order is required")
    .isNumeric()
    .withMessage("Order is invalid")
);

const announcementInspector = inspectBuilder(
  body("title").exists().withMessage("Title is required"),
  body("content").optional()
);

/**
 * :: STEP 2
 * Handler
 */

// Add branch secretary
const _addBranchSecretary: Handler = async (req, res) => {
  const { r } = res;

  const { name, branchName, contactNo } = req.body;

  const data = {
    branchSecId: UUID(),
    name,
    branchName,
    contactNo,
  };

  const [error, response] = await model.web.add_BranchSecretaries(data);

  if (error) {
    if (error.code == DBErrorCode.DUPLICATE_ENTRY) {
      r.status.BAD_REQ().message("Branch Secretary already exists").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Branch Secretary added successfully").send();
};

// Add committee member
const _addCommitteeMember: Handler = async (req, res) => {
  const { r } = res;

  const { name, position, contactNo, order } = req.body;

  const data = {
    committeeMemberId: UUID(),
    name,
    position,
    contactNo,
    order,
  };

  const [error, response] = await model.web.add_CommitteeMembers(data);

  if (error) {
    if (error.code == DBErrorCode.DUPLICATE_ENTRY) {
      r.status.BAD_REQ().message("Committee Member already exists").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Committee Member added successfully").send();
};

// Add leader
const _addLeader: Handler = async (req, res) => {
  const { r } = res;

  const { name, position, contactNo, order } = req.body;

  const data = {
    leaderId: UUID(),
    name,
    position,
    contactNo,
    order,
  };

  const [error, response] = await model.web.add_Leader(data);

  if (error) {
    if (error.code == DBErrorCode.DUPLICATE_ENTRY) {
      r.status.BAD_REQ().message("Leader already exists").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Leader added successfully").send();
};

// Add announcement
const _addAnnouncement: Handler = async (req, res) => {
  const { r } = res;

  if (req.fileValidationError) {
    r.status.BAD_REQ().message("Invalid file type").send();
    return;
  }

  const { content, title, date } = req.body;

  // //   TODO: Add Image adding part
  const images = [];
  const imageFiles = <any>req.files;
  if (imageFiles) {
    for (const image of imageFiles) {
      images.push(image.path);
    }
  }

  const data = {
    announcementId: UUID(),
    date: new Date(date),
    title,
    content,
    images,
  };

  const [error, response] = await model.web.add_Announcement(data);

  if (error) {
    if (error.code == DBErrorCode.DUPLICATE_ENTRY) {
      r.status.BAD_REQ().message("Announcement already exists").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Announcement added successfully").send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */
export const addBranchSecretary = [
  branchSecretaryInspector,
  <EHandler>_addBranchSecretary,
];
export const addCommitteeMembers = [
  committeeMemberInspector,
  <EHandler>_addCommitteeMember,
];
export const addLeader = [
  committeeMemberInspector,
  <EHandler>_addLeader,
];
export const addAnnouncement = [
  announcementInspector,
  <EHandler>_addAnnouncement,
];