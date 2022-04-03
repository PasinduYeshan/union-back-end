import { v4 as UUID } from "uuid";
import { EHandler, Handler, Log } from "../../utils/types";
import { encrypt_password } from "../../utils/hasher";
import { inspectBuilder, body } from "../../utils/inspect";
import model, { DBErrorCode } from "../../model";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
  // Personal details
  body("fullName").exists().withMessage("fullName is required"),
  body("nameWithInitials")
    .exists()
    .withMessage("Name with Initials is required"),
  body("otherNames").optional(),
  body("oldNIC")
    .optional()
    .custom((value: any, { req }: any) => {
      return req.body.newNIC == null || req.body.newNIC == "NIL" ? value != null && value != "NIL" : true;
    })
    .withMessage("Both old and new NIC can not be empty"),
  body("newNIC")
    .optional()
    .custom((value: any, { req }: any) => {
      return req.body.oldNIC == null || req.body.oldNIC == "NIL" ? value != null && value != "NIL" : true;
    })
    .withMessage("Both old and new NIC can not be empty"),
  body("dob").exists().withMessage("Date of Birth is required"),
  body("sex").exists().withMessage("Sex is required"),
  body("permanentAddress")
    .exists()
    .withMessage("Permanent address is required"),
  body("mailingAddress").exists().withMessage("Mailing address is required"),
  body("emailAddress")
    .optional()
    .isEmail()
    .withMessage("Email address is required"),
  body("mobileCN")
    .exists()
    .withMessage("Mobile Contact Number is required")
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
  body("civilStatus").exists().withMessage("Civil Status is required"),
  body("nominee").exists().withMessage("Nominee is required"),
  body("relationshipOfNominee")
    .exists()
    .withMessage("Relationship of Nominee is required"),

  // Family details
  body("spouseName").optional(),
  body("children").optional(),
  body("fatherName").optional(),
  body("motherName").optional(),
  body("fatherInLawName").optional(),
  body("motherInLawName").optional(),

  // Department details
  body("title").exists().withMessage("Title is required"),
  body("grade").exists().withMessage("Grade is required"),
  body("dateOfAppointment")
    .exists()
    .withMessage("Date of Appointment is required"),
  body("permanentWorkStation")
    .exists()
    .withMessage("Permanent Work Station is required"),
  body("presentWorkStation")
    .exists()
    .withMessage("Present Work Station is required"),
  body("dateOfPension").exists().withMessage("Date of Pension is required"),
  body("officeOfRegionalAccountant")
    .exists()
    .withMessage("Office of Regional Accountant is required"),
  body("paySheetNo").exists().withMessage("Pay Sheet No is required"),
  body("employeeId").exists().withMessage("Employee Id is required"),
  body("officeOfDPMG").exists().withMessage("Office of DPMG is required"),

  // Membership details
  body("membershipNo").exists().withMessage("Membership Number is required"),
  body("dateOfMembership")
    .exists()
    .withMessage("Date of Membership is required"),
  body("RDSNumber").exists().withMessage("RDS Number is required"),
  body("memberOfOtherUnion")
    .exists()
    .withMessage("Member of Other Union is required"),
  body("otherUnions").optional(),

  // Branch details
  body("branchName").exists().withMessage("Branch Name is required")
);

/**
 * :: STEP 2
 * Add member to database
 * @param req
 * @param res
 */
const addMember: Handler = async (req, res) => {
  const { r } = res;
  const userId = UUID();
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
    userId,
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

  

  const [err, response] = await model.member.create_Member(memberData);
  if (err) {
    if (err.code === DBErrorCode.DUPLICATE_ENTRY) {
      r.status.BAD_REQ().message("Duplicate Entry").send();
      return;
    } else {
      r.pb.ISE();
      return;
    }
  } else {
    r.status.OK().message("Successfully added").send();
  }
};

/**
 * :: STEP 3
 * Request Handler chain
 *
 */
export default [inspector, <EHandler>addMember];
