import { createColumnHelper } from "@tanstack/react-table";
import {
  EmployeeIdCell,
  EmployeeNameCell,
  DepartmentCell,
  TextCell
} from "./rows";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "SNo",
    header: "S.No",
    cell: ({ row }) => <EmployeeIdCell index={row.index} />,
  }),
  columnHelper.accessor("Code", {
    header: "Code",
    cell: TextCell,
  }),
  columnHelper.accessor("Name", {
    header: "Name",
    cell: EmployeeNameCell,
  }),
  columnHelper.accessor("DeptName", {
    header: "Department",
    cell: DepartmentCell,
  }),
  /*
  columnHelper.accessor("AcctNo", {
    header: "Account No",
    cell: TextCell,
  }),
  columnHelper.accessor("BankName", {
    header: "Bank Name",
    cell: TextCell,
  }),
  columnHelper.accessor("Branch", {
    header: "Branch",
    cell: TextCell,
  }),
  columnHelper.accessor("IFSC", {
    header: "IFSC",
    cell: TextCell,
  }),
  */
  columnHelper.accessor("Salary", {
    header: "Salary",
    cell: TextCell,
  }),
  columnHelper.accessor("Absent", {
    header: "Absent",
    cell: TextCell,
  }),
  columnHelper.accessor("LOP", {
    header: "LOP",
    cell: TextCell,
  }),
  columnHelper.accessor("GrossSal", {
    header: "Gross Salary",
    cell: TextCell,
  }),
  columnHelper.accessor("Basic", {
    header: "Basic",
    cell: TextCell,
  }),
  columnHelper.accessor("HRA", {
    header: "HRA",
    cell: TextCell,
  }),
  columnHelper.accessor("Others", {
    header: "Others",
    cell: TextCell,
  }),
  columnHelper.accessor("PF", {
    header: "PF",
    cell: TextCell,
  }),
  columnHelper.accessor("ESI", {
    header: "ESI",
    cell: TextCell,
  }),
  columnHelper.accessor("ProfTax", {
    header: "Prof Tax",
    cell: TextCell,
  }),
  columnHelper.accessor("OT", {
    header: "OT",
    cell: TextCell,
  }),
  columnHelper.accessor("OTAMOUNT", {
    header: "OTAmount",
    cell: TextCell,
  }),
  columnHelper.accessor("Bonus", {
    header: "Bonus",
    cell: TextCell,
  }),
  columnHelper.accessor("TDS", {
    header: "TDS",
    cell: TextCell,
  }),
  columnHelper.accessor("NetSal", {
    header: "Net Salary",
    cell: TextCell,
  }),
  /*
  columnHelper.accessor("Month", {
    header: "Month",
    cell: TextCell,
  }),
  columnHelper.accessor("Year", {
    header: "Year",
    cell: TextCell,
  }),
  */
];
