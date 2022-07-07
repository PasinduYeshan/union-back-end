import multer from "multer";
import { s3StoragePhotos, s3StorageAvatars, localStorage } from "./storage";

export const uploadPhotos = multer({
  storage: localStorage,
  limits: {
    fieldSize: 1024 * 1024 * 6,
  },
  fileFilter: (req: any, file, cb) => {
    if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
      cb(null, true);
      return;
    }
      req.fileValidationError = "Invalid file type";
    return cb(null, false);
  },
}).array("images", 10);

export const uploadSinglePhoto = multer({
  storage: localStorage,
  limits: {
    fieldSize: 1024 * 1024 * 6,
  },
  fileFilter: (req: any, file, cb) => {
    if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
      cb(null, true);
      return;
    }
      req.fileValidationError = "Invalid file type";
    return cb(null, false);
  },
}).single("image");

export const uploadAvatar = multer({
  storage: s3StorageAvatars,
  limits: {
    fieldSize: 1024 * 1024 * 6,
  },
  fileFilter: (_, file, cb) => {
    if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(null, false);
  },
}).single("avatar");
