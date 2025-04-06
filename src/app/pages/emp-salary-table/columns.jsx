import { createColumnHelper } from "@tanstack/react-table";
import {
  EmployeeIdCell,
  EmployeeNameCell,
  DepartmentCell,
  SalaryInputCell, // Changed from InputCell to SalaryInputCell
  TextCell,
  PfEsiInputCell, // New component for PF/ESI
  TdsInputCell,   // New component for TDS
} from "./rows";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "SNo",
    header: "S.No",
    cell: ({ row }) => <EmployeeIdCell index={row.index} />,
  }),
  columnHelper.accessor("code", {
    header: "Code",
    cell: TextCell,
  }),
  columnHelper.accessor("firstname", {
    header: "First Name",
    cell: EmployeeNameCell,
  }),
  columnHelper.accessor("surname", {
    header: "Surname",
    cell: EmployeeNameCell,
  }),
  columnHelper.accessor("department_name", {
    header: "Department",
    cell: DepartmentCell,
  }),
  columnHelper.accessor("Salary", {
    header: "Salary",
    cell: SalaryInputCell,
  }),
  columnHelper.accessor("Pfon", {
    header: "PF & ESI",
    cell: PfEsiInputCell, // Changed from CheckCell to PfEsiInputCell
  }),
  columnHelper.accessor("TDS", {
    header: "TDS",
    cell: TdsInputCell, // Changed from CheckCell to TdsInputCell
  }),
];