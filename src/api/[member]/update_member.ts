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
  // Personal details
  body("fullName").optional(),
  body("nameWithInitials")
    .optional(),
  body("otherNames").optional(),
  body("dob").optional(),
  body("sex").optional(),
  body("permanentAddress")
    .optional(),
  body("mailingAddress").optional(),
  body("emailAddress")
    .optional()
    .isEmail()
    .withMessage("Email address is required"),
  body("mobileCN")
    .optional()
    .isMobilePhone("any")
    .withMessage("Office Contact Number should be a valid mobile number"),
  body("officeCN")
    .optional()
    .isMobilePhone("any")
    .withMessage("Office Contact Number should be a valid mobile number"),
  body("homeCN")
    .optional()
    .isMobilePhone("any")
    .withMessage("Home Contact Number should be a valid mobile number"),
  body("civilStatus").optional(),
  body("nominee").optional(),
  body("relationshipOfNominee")
    .optional(),

  // Family details
  body("spouseName").optional(),
  body("children").optional(),
  body("fatherName").optional(),
  body("motherName").optional(),
  body("fatherInLawName").optional(),
  body("motherInLawName").optional(),

  // Department details
  body("title").optional(),
  body("grade").optional(),
  body("dateOfAppointment")
    .optional()
    ,
  body("permanentWorkStation")
    .optional(),
  body("presentWorkStation")
    .optional(),
  body("dateOfPension").optional(),
  body("officeOfRegionalAccountant")
    .optional(),
  body("paySheetNo").optional(),
  body("employeeId").optional(),
  body("officeOfDPMG").optional(),

  // Membership details
  body("membershipNo").optional(),
  body("dateOfMembership")
    .optional(),
  body("RDSNumber").optional(),
  body("memberOfOtherUnion")
    .optional(),
  body("otherUnions").optional(),

  // Branch details
  body("branchName").optional(),
  param("userId").exists().withMessage("User Id is required"),
);

/**
 * :: STEP 2
 * Add member to database
 * @param req
 * @param res
 */
const updateMember: Handler = async (req, res) => {
  const { r } = res;
  const userId = req.params.userId;

  const {
    fullName,
    nameWithInitials,
    otherName,
    oldNIC,
    newNIC,
    dob,
    sex,
    permanentAddress,
    mailingAddress,
    emailAddress,
    mobileCN,
    officeCN,
    homeCN,
    civilStatus,
    nominee,
    relationshipOfNominee,
    spouseName,
    children,
    fatherName,
    motherName,
    fatherInLawName,
    motherInLawName,
    childName,
    title,
    grade,
    dateOfAppointment,
    permanentWorkStation,
    presentWorkStation,
    dateOfPension,
    officeOfRegionalAccountant,
    paySheetNo,
    employeeId,
    officeOfDPMG,
    membershipNo,
    dateOfMembership,
    RDSNumber,
    memberOfOtherUnion,
    otherUnions,
    unionName,
    branchName,
  } = req.body;

  // Log of who is creating the user account
  let createdBy: Log;

  createdBy = {
    userId: req.user.userId,
    name: req.user.name,
    time: new Date(),
  };

  let memberData = {
    fullName,
    nameWithInitials,
    otherName,
    oldNIC,
    newNIC,
    dob,
    sex,
    permanentAddress,
    mailingAddress,
    emailAddress,
    mobileCN,
    officeCN,
    homeCN,
    civilStatus,
    nominee,
    relationshipOfNominee,
    spouseName,
    children,
    fatherName,
    motherName,
    fatherInLawName,
    motherInLawName,
    childName,
    title,
    grade,
    dateOfAppointment,
    permanentWorkStation,
    presentWorkStation,
    dateOfPension,
    officeOfRegionalAccountant,
    paySheetNo,
    employeeId,
    RDSNumber,
    officeOfDPMG,
    membershipNo,
    dateOfMembership,
    memberOfOtherUnion,
    otherUnions,
    unionName,
    branchName,
    createdBy
  };

  

  const [err, response] = await model.member.update_Member(userId, memberData);
  
  if (err) {
    if (err.code === DBErrorCode.NOT_FOUND) {
      r.status.BAD_REQ().message("Duplicate Entry").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  } else {
    if (response.matchedCount === 0) {
      r.status.NOT_FOUND().message("Member not found").send();
      return;
    }else{
      r.status.OK().message("Successfully updated").send();
    }

    
  }
};

/**
 * :: STEP 3
 * Request Handler chain
 *
 */
export default [inspector, <EHandler>updateMember];
