import * as Yup from "yup";

export const salaryCalcSchema = Yup.object().shape({
  TotalDays: Yup.number()
    .required("Total Days is required")
    .positive("Total Days must be a positive number")
    .integer("Total Days must be an integer"), // Ensure TotalDays is an integer
  Basic: Yup.number()
    .required("Basic Salary is required")
    .positive("Basic Salary must be a positive number"), // Allows decimals
  HRA: Yup.number()
    .required("HRA is required")
    .positive("HRA must be a positive number"), // Allows decimals
  PF: Yup.number()
    .required("PF is required")
    .positive("PF must be a positive number"), // Allows decimals
  ESI: Yup.number()
    .required("ESI is required")
    .positive("ESI must be a positive number"), // Allows decimals
});