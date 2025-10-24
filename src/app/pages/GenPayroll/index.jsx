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
import { Toolbar } from "./Toolbar";
import { getColumns, columnOptions } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";

export default function EmployeesDatatable() {
  const [employees, setEmployees] = useState([]);
  // Start with all columns selected by default EXCEPT specific ones
  const [selectedOptionalColumns, setSelectedOptionalColumns] = useState(() => {
    const exclude = new Set(["Absent", "LOP", "Basic", "HRA", "Others"]);
    return columnOptions.map((c) => c.value).filter((v) => !exclude.has(v));
  });

  const fetchEmployees = async (deptId = 0, year = new Date().getFullYear(), month = (new Date().getMonth() + 1), pPEVal = 2) => {
    try {
      const response = await axios.get("https://tcs.trafficcounting.com/nodejs/api/get-report", {
       params:{ 
        pKey: sessionStorage.getItem("Key") || "",
        deptId,
        year,
        month,
        pPEVal
      }});
      console.log("Response data:", response); // Log the response data
      setEmployees(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchEmployees();
  }, []);

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
    enableSorting: true,
    enableColumnFilters: true,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  // Initialize column visibility with default columns always visible
  const [columnVisibility, setColumnVisibility] = useLocalStorage("column-visibility-employees", {
    SNo: true,
    Code: true, 
    Name: true,
    NetSal: true
  });
  const [columnPinning, setColumnPinning] = useLocalStorage("column-pinning-employees", {});

  // Get dynamic columns based on selected optional columns
  const dynamicColumns = getColumns(selectedOptionalColumns);

  const table = useReactTable({
    data: employees,
    columns: dynamicColumns,
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
        setEmployees((old) => old.filter((oldRow) => oldRow.StaffId !== row.original.StaffId));
      },
      deleteRows: (rows) => {
        const rowIds = rows.map((row) => row.original.StaffId);
        setEmployees((old) => old.filter((row) => !rowIds.includes(row.StaffId)));
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
    <Page title="Employees Management">
      <div className="transition-content w-full pb-5">
        <div className={clsx("flex h-full w-full flex-col", tableSettings.enableFullScreen && "fixed inset-0 z-[61] bg-white pt-3 dark:bg-dark-900")}>
          <Toolbar 
          table={table} 
          setEmployees={setEmployees} 
          fetchEmployees={fetchEmployees}
          selectedOptionalColumns={selectedOptionalColumns}
          setSelectedOptionalColumns={setSelectedOptionalColumns}
          columnOptions={columnOptions}
        />
          <div className={clsx("transition-content flex grow flex-col pt-3", tableSettings.enableFullScreen ? "overflow-hidden" : "px-[--margin-x]")}>
            <Card className={clsx("relative flex grow flex-col", tableSettings.enableFullScreen && "overflow-hidden")}>
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                <Table hoverable dense={tableSettings.enableRowDense} sticky={tableSettings.enableFullScreen} className="w-full text-left rtl:text-right">
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th key={header.id} className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
                            {header.column.getCanSort() ? (
                              <div className="flex cursor-pointer select-none items-center space-x-3 rtl:space-x-reverse" onClick={header.column.getToggleSortingHandler()}>
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
                  {employees.length === 0 ? (
                    <p className="text-lg font-medium">No matching records found</p>
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
