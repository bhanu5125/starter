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

// We'll determine admin status in a safer way that works in both server and client contexts
const determineIsAdmin = () => {
  try {
    if (typeof window !== 'undefined') {
      const adminValue = localStorage.getItem("isSecretKeyVerified");
      return adminValue === "true";
    }
    return false;
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return false;
  }
};

const isAdmin = determineIsAdmin();

const columnHelper = createColumnHelper();

// Define base columns that everyone can see
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
    header: "OT (Hours)",
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
