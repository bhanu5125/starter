// src/components/columns.jsx
import { createColumnHelper } from "@tanstack/react-table";
import {
  EmployeeIdCell,
  EmployeeNameCell,
  DepartmentCell,
  InputCell,
  TextCell,
  CheckCell,
  OTCell
} from "./rows";

// Check admin status (this runs on client-side)
const admin_value = localStorage.getItem("isSecretKeyVerified");
console.log("Admin value from localStorage:", admin_value);
const isAdmin = (admin_value === null || admin_value === false) ? false : true;

const columnHelper = createColumnHelper();

const baseColumns = [
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
    header: "SurName",
    cell: EmployeeNameCell,
  }),
  columnHelper.accessor("department_name", {
    header: "Department",
    cell: DepartmentCell,
  }),
  columnHelper.accessor("attendance", {
    header: "Attendance",
    cell: CheckCell,
  }),
  columnHelper.accessor("ot", {
    header: "OT (In days)",
    cell: OTCell,
  }),
];

// Conditionally add the bonus column only if admin
const bonusColumn = isAdmin
  ? columnHelper.accessor("bonus", {
      header: "Bonus",
      cell: (props) => <InputCell {...props} field="bonus" />,
    })
  : null;

export const columns = [...baseColumns, bonusColumn].filter(Boolean);
