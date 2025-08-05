// columns.js
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";

import { 
    EmployeeIdCell,
    EmployeeNameCell,
    StatusCell,
    TextCell
} from "./rows";

const columnHelper = createColumnHelper();

// Create a function that returns columns based on the selected department
export const columns = (selectedDepartment = "All") => {
  const isTSSDepartment = selectedDepartment === "TSS Data Entry";
  
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
    columnHelper.accessor("name", {
      header: "Employee Name",
      cell: EmployeeNameCell,
    }),
  ];

  // Add Group column if TSS Data Entry is selected
  if (isTSSDepartment) {
    baseColumns.push(
      columnHelper.accessor("staff_type", {
        id: "group",
        header: "Group",
        cell: ({ getValue }) => {
          const value = getValue() ?? 0; // Treat null as 0, keep as number
          return <span>Group {value}</span>;
        },
      })
    );
  }

  // Add the rest of the columns
  baseColumns.push(
    columnHelper.accessor("primary_phone", {
      header: "Primary Phone",
      cell: TextCell,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: StatusCell,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: RowActions,
    })
  );

  return baseColumns;
};