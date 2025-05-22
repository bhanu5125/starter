// schema.js
import * as Yup from "yup";

export const personalInfoSchema = Yup.object().shape({
  firstName: Yup.string().trim().required("First Name is required"),
  lastName: Yup.string().trim().required("Last Name is required"),
  guardian: Yup.string().trim().required("Guardian Name is required"),
  primaryPhone: Yup.string().trim().required("Primary Phone is required"),
  secondaryPhone: Yup.string().trim().required("Secondary Phone is required"),
  Aadhaar: Yup.string().trim().required("Aadhaar is required"),
  DOJ: Yup.date().required("Date of Joining is required"),
  DOR: Yup.date().nullable(), // Date of Resignation (optional)
  resignationReason: Yup.string().trim(), // Reason for Resignation (optional)
  deptId: Yup.object().shape({
    label: Yup.string().required(),
    value: Yup.number().required(),
  }),
  address: Yup.string().trim().required("Address is required"),
  AccountNumber: Yup.string().trim().required("Account Number is required"),
  BankName: Yup.string().trim().required("Bank Name is required"),
  Branch: Yup.string().trim(),
  IFSC: Yup.string().trim().required("IFSC is required"),
  Otherinfo: Yup.string().trim(),
  /*
  groupNo: Yup.string().when("deptId", {
    is: (deptId) => deptId?.value === 4, // TSS DATA ENTRY has value 4
    then: Yup.string().required("Group No is required"),
    otherwise: Yup.string().notRequired(),
  }),
  */
});

export const addressInfoSchema = Yup.object().shape({
  address: Yup.string().trim().required("Address is required"),
});

export const declarationSchema = Yup.object().shape({
  agreed: Yup.boolean().oneOf([true], "You must validate."),
});

export const additionalInfoSchema = Yup.object().shape({
    isActive: Yup.boolean(),
    staffType: Yup.number().required("Staff Type is required"),
    deptId: Yup.number().required("Department is required"),
  });