import { EHandler, Handler, Log } from "../../utils/types";
import { inspectBuilder, body, param } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";

/**
 * :: STEP 1
 * Validation
 */
const branchSecretaryInspector = inspectBuilder(
  param("branchSecId").exists().withMessage("Branch Secretary ID is required")
);

const committeeMemberInspector = inspectBuilder(
  param("committeeMemberId")
    .exists()
    .withMessage("Committee Member ID is required")
);

const leaderInspector = inspectBuilder(
  param("leaderId").exists().withMessage("Leader ID is required")
);

const announcementInspector = inspectBuilder(
  param("announcementId").exists().withMessage("Announcement ID is required"),
  body("title").exists().withMessage("Title is required"),
  body("content").optional(),
  body("date").exists().withMessage("Date is required")
);
/**
 * :: STEP 2
 * Handler
 */
// Update branch secretary
const _updateBranchSecretary: Handler = async (req, res) => {
  const { r } = res;
  const { branchSecId } = req.params;
  const { name, branchName, contactNo } = req.body;

  const data = {
    name,
    branchName,
    contactNo,
  };

  const [error, response] = await model.web.update_BranchSecretary(
    branchSecId,
    data
  );

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Branch Secretary not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Branch Secretary updated successfully").send();
};

// Update committee member
const _updateCommitteeMember: Handler = async (req, res) => {
  const { r } = res;
  const { committeeMemberId } = req.params;
  const { name, position, contactNo, order } = req.body;

  const data = {
    name,
    position,
    contactNo,
    order,
  };

  const [error, response] = await model.web.update_CommitteeMember(
    committeeMemberId,
    data
  );

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Committee Member not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Committee Member updated successfully").send();
};

// Update Leader
const _updateLeader: Handler = async (req, res) => {
  const { r } = res;

  if (req.fileValidationError) {
    r.status.BAD_REQ().message("Invalid file type").send();
    return;
  }

  const { leaderId } = req.params;
  const { name, position, contactNo, order } = req.body;

  const data = {
    name,
    position,
    contactNo,
    order,
    image: req.file ? req.file?.path : null,
  };

  const [error, response] = await model.web.update_Leader(leaderId, data);

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Leader not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Leader updated successfully").send();
};

// Update announcement
const _updateAnnouncement: Handler = async (req, res) => {
  const { r } = res;

  if (req.fileValidationError) {
    r.status.BAD_REQ().message("Invalid file type").send();
    return;
  }

  const { announcementId } = req.params;
  const { title, content, date } = req.body;

  //   TODO: Add Image adding part
  const images = [];
  const imageFiles = <any>req.files;
  if (imageFiles) {
    for (const image of imageFiles) {
      images.push(image.path);
    }
  }

  const data = {
    title,
    content,
    date,
    images,
  };

  const [error, response] = await model.web.update_Announcement(
    announcementId,
    data
  );

  if (error) {
    if (error.code == DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Announcement not found").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  }

  r.status.OK().message("Announcement updated successfully").send();
};

/**
 * :: STEP 3
 * Request Handler Chain
 */
import { uploadPhotos, uploadSinglePhoto } from "../../utils/storage";

export const updateBranchSecretary = [
  branchSecretaryInspector,
  <EHandler>_updateBranchSecretary,
];
export const updateCommitteeMember = [
  committeeMemberInspector,
  <EHandler>_updateCommitteeMember,
];
export const updateLeader = [
  uploadSinglePhoto,
  leaderInspector,
  <EHandler>_updateLeader,
];

export const updateAnnouncement = [
  uploadPhotos,
  announcementInspector,
  <EHandler>_updateAnnouncement,
];