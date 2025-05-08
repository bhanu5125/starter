import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useState, useEffect } from "react";
import axios from "axios";

// Local Imports
import { Table, Card, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Page } from "components/shared/Page";
import { useLockScrollbar, useDidUpdate, useLocalStorage } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";

export default function EmployeesDatatable() {
  const [originalEmployees, setOriginalEmployees] = useState([]); // Store the original data
  const [employees, setEmployees] = useState([]); // Store the filtered data
  //const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://tms-backend-three.vercel.app/api/getstaff");
        const data = response.data.map((staff) => ({
          employee_id: staff.SId,
          code: staff.Code,
          name: `${staff.FirstName} ${staff.LastName}`,
          guardian: staff.Guardian,
          address: staff.Address,
          primary_phone: staff.PrimaryPhone,
          secondary_phone: staff.SecondaryPhone,
          status: staff.IsActive,
          staff_type: staff.StaffType,
          department_id: staff.DeptId,
          department_name: staff.DeptName,
          created_date: new Date(staff.CreatedDate).getTime(),
          modified_date: new Date(staff.ModifiedDate).getTime(),
          created_by: staff.CreatedBy,
          modified_by: staff.ModifiedBy,
        }));
  
        // Automatically sort employees based on Active status
        const sortedData = [...data].sort((b, a) => {
          return b.status.localeCompare(a.status); // "Active" first, "Inactive" last
        });
  
        setOriginalEmployees(sortedData);
        setEmployees(sortedData);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
  }, []);
  

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
    enableSorting: true,
    enableColumnFilters: true,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-employees",
    {}
  );

  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-employees",
    {}
  );

  const table = useReactTable({
    data: employees,
    columns: columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setEmployees((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
      deleteRow: (row) => {
        setEmployees((old) =>
          old.filter((oldRow) => oldRow.employee_id !== row.original.employee_id)
        );
        // Also update originalEmployees to keep them in sync when deleting
        setOriginalEmployees((old) =>
          old.filter((oldRow) => oldRow.employee_id !== row.original.employee_id)
        );
      },
      deleteRows: (rows) => {
        const rowIds = rows.map((row) => row.original.employee_id);
        setEmployees((old) => old.filter((row) => !rowIds.includes(row.employee_id)));
        // Also update originalEmployees to keep them in sync when deleting
        setOriginalEmployees((old) => old.filter((row) => !rowIds.includes(row.employee_id)));
      },
      setTableSettings,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
  });

  useDidUpdate(() => table.resetRowSelection(), [employees]);

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <Page title="Employees Management">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
              "fixed inset-0 z-[61] bg-white pt-3 dark:bg-dark-900"
          )}
        >
          <Toolbar
            table={table}
            employees={employees}
            setEmployees={setEmployees}
            originalEmployees={originalEmployees} // Pass the original data
          />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen
                ? "overflow-hidden"
                : "px-[--margin-x]"
            )}
          >
            <Card
              className={clsx(
                "relative flex grow flex-col",
                tableSettings.enableFullScreen && "overflow-hidden"
              )}
            >
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                <Table
                  hoverable
                  dense={tableSettings.enableRowDense}
                  sticky={tableSettings.enableFullScreen}
                  className="w-full text-left rtl:text-right"
                >
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th key={header.id} className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
                            {header.column.getCanSort() ? (
                              <div
                                className="flex cursor-pointer select-none items-center space-x-3 rtl:space-x-reverse"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                <span className="flex-1">
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                </span>
                                <TableSortIcon sorted={header.column.getIsSorted()} />
                              </div>
                            ) : header.isPlaceholder ? null : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                            )}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </THead>
                  <TBody>
                    {table.getRowModel().rows.map((row) => (
                      <Tr key={row.id} className="relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
                        {row.getVisibleCells().map((cell) => (
                          <Td key={cell.id} className="relative bg-white dark:bg-dark-900">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </div>
              
              {table.getCoreRowModel().rows.length > 0 ? (
                <div className="px-4 pb-4 sm:px-5 sm:pt-4 bg-gray-50 dark:bg-dark-800">
                  <PaginationSection table={table} />
                </div>
              ) : (
                <div className="flex justify-center items-center p-8 text-gray-500">
                  {employees.length === 0 && originalEmployees.length > 0 ? (
                    <div className="text-center">
                      <p className="text-lg font-medium">No matching records found</p>
                      <p className="mt-1">Try adjusting your filters or search criteria</p>
                    </div>
                  ) : (
                    <p className="text-lg font-medium">Loading employees...</p>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}