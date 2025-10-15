// src/components/columns.jsx
import { createColumnHelper } from "@tanstack/react-table";
import {
  EmployeeIdCell,
  EmployeeNameCell,
  TextCell,
  CheckCell,
} from "./rows";


const columnHelper = createColumnHelper();

// Define base columns that everyone can see
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
    header: "SurName",
    cell: EmployeeNameCell,
  }),
  columnHelper.accessor("attendance", {
    header: "Attendance",
    cell: CheckCell,
  }),
];

