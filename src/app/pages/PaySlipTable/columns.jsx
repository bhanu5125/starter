/* eslint-disable no-unused-vars */
import { createColumnHelper } from "@tanstack/react-table";
import {
  EmployeeIdCell,
  EmployeeNameCell,
  DepartmentCell,
  InputCell,
  TextCell,
  CheckCell,
  ButtonCell
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
  columnHelper.accessor("Generate", {
    header: "Action",
    cell: ButtonCell,
  }),

];
