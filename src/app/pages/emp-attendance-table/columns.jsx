// columns.jsx
import { createColumnHelper } from "@tanstack/react-table";
import {
    EmployeeIdCell,
    EmployeeNameCell,
    DepartmentCell,
    InputCell,
    TextCell,
    CheckCell
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
        header: "SurName",
        cell: EmployeeNameCell,
    }),
    columnHelper.accessor("department_name", {
        header: "Department",
        cell: DepartmentCell,
    }),
    columnHelper.accessor("attendance", {
        header: "Attendance",
        cell: CheckCell
    }),
    columnHelper.accessor("ot", {
        header: "OT(In days)",
        cell: (props) => <InputCell {...props} field="ot" />,
    }),
    columnHelper.accessor("bonus", {
        header: "Bonus",
        cell: (props) => <InputCell {...props} field="bonus" />,
    })
];