// src/components/index.jsx
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

import { Table, Card, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Page } from "components/shared/Page";
import { useLockScrollbar, useDidUpdate, useLocalStorage } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import Toolbar from "./toolbar";
import { columns } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";

export default function EmployeesDatatable() {
  const [originalEmployees, setOriginalEmployees] = useState([]); // Original data
  const [employees, setEmployees] = useState([]); // Filtered data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/attendance");
        // Map response data to expected structure.
        const data = response.data.map((staff) => ({
          employee_id: staff.SID,
          code: staff.CODE,
          firstname: staff.FIRSTNAME,
          surname: staff.SURNAME,
          status: staff.isActive.data[0] === 1 ? "Active" : "Inactive",
          department_name: staff.DEPARTMENT,
          attendance: staff.ABSENT || {}, // Expect object like { "Jan": { "1": true, ... } }
          year: staff.Year,
          ot: staff.OT || {}, // Similarly structured object.
          bonus: staff.BONUS || 0,
        }));
        const sortedData = [...data].sort((a, b) => a.status.localeCompare(b.status));
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

  const [columnVisibility, setColumnVisibility] = useLocalStorage("column-visibility-employees", {});
  const [columnPinning, setColumnPinning] = useLocalStorage("column-pinning-employees", {});

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
              return { ...old[rowIndex], [columnId]: value };
            }
            return row;
          })
        );
      },
      deleteRow: (row) => {
        setEmployees((old) =>
          old.filter((oldRow) => oldRow.employee_id !== row.original.employee_id)
        );
        setOriginalEmployees((old) =>
          old.filter((oldRow) => oldRow.employee_id !== row.original.employee_id)
        );
      },
      deleteRows: (rows) => {
        const rowIds = rows.map((row) => row.original.employee_id);
        setEmployees((old) => old.filter((row) => !rowIds.includes(row.employee_id)));
        setOriginalEmployees((old) => old.filter((row) => !rowIds.includes(row.employee_id)));
      },
      setTableSettings,
    },
    filterFns: { fuzzy: fuzzyFilter },
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
    <Page title="Attendance Management">
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
            originalEmployees={originalEmployees}
          />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen ? "overflow-hidden" : "px-[--margin-x]"
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
                                className="flex cursor-pointer select-none items-center space-x-3"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                <span className="flex-1">
                                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </span>
                                <TableSortIcon sorted={header.column.getIsSorted()} />
                              </div>
                            ) : header.isPlaceholder ? null : (
                              flexRender(header.column.columnDef.header, header.getContext())
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
