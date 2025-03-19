// columns.js
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";

import { 
    EmployeeIdCell,
    EmployeeNameCell,
    DepartmentCell,
    StatusCell,
    TextCell
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
    columnHelper.accessor("name", {
        header: "Employee Name",
        cell: EmployeeNameCell,
    }),

    columnHelper.accessor("primary_phone", {
        header: "Primary Phone",
        cell: TextCell,
    }),

    columnHelper.accessor("status", {
        header: "Status",
        cell: StatusCell,
    }),

    columnHelper.accessor("department_name", {
        header: "Department",
        cell: DepartmentCell,
    }),

    columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: RowActions,
    }),
];