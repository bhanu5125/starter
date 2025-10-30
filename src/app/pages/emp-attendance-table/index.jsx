/* eslint-disable no-unused-vars */
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
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { Table, Card, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Page } from "components/shared/Page";
import { useLockScrollbar, useDidUpdate, useLocalStorage, useErrorHandler } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import Toolbar from "./Toolbar";
import { columns } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";


export default function EmployeesDatatable() {
  const [originalEmployees, setOriginalEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableRefreshKey, setTableRefreshKey] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { handleError } = useErrorHandler();

  // Get today's date components
  const today = new Date().toISOString().slice(0, 10);
  const currentYear = today.slice(0, 4);
  const currentMonth = today.slice(5, 7);
  const currentDay = today.slice(8, 10);

  const fetchAttendanceData = useCallback(async (date, deptId) => {
    setIsLoading(true);
    try {
      const resp = await axios.get("https://tcs.trafficcounting.com/nodejs/api/attendance", {
        params: { date, deptId },
      });

      console.log("Attendance data:", resp.data);

      // Normalize data to match table structure
      const normalizedData = resp.data.map(staff => ({
        employee_id: staff.SID,
        code: staff.CODE,
        firstname: staff.FIRSTNAME,
        surname: staff.SURNAME,
        department_name: staff.DEPARTMENT,
        staff_type: staff.StaffType,
        // Invert: backend false = present (checked), true = absent (unchecked)
        attendance: staff.attendance === false ? true : false,
        year: staff.Year,
        isOT: staff.isOT || false, // Whether this specific date is an OT day for this employee
        otCount: staff.otCount || 0 // Total OT count for the month
      }));

      // Check if any employee has OT for this specific date
      const hasOTForThisDate = normalizedData.some(staff => staff.isOT === true);

      // Update both original and filtered data
      setOriginalEmployees(normalizedData);
      setEmployees(normalizedData);
      setTableRefreshKey(prev => prev + 1); // Force table refresh
      
      return { data: normalizedData, hasOT: hasOTForThisDate };
      
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      handleError(err, "Failed to load attendance data.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    fetchAttendanceData(today);
  }, [today, fetchAttendanceData]);

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
    enableSorting: true,
    enableColumnFilters: true,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useLocalStorage("column-visibility-employees", {});
  const [columnPinning, setColumnPinning] = useLocalStorage("column-pinning-employees", {});

  const table = useReactTable({
    data: employees,
    columns,
    state: { globalFilter, sorting, pagination, columnVisibility, columnPinning, tableSettings },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Update both employees and originalEmployees to persist changes across filtering
        setEmployees(old =>
          old.map((row, idx) =>
            idx === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
        
        // Find the employee in the current filtered list and update in originalEmployees
        const employeeToUpdate = employees[rowIndex];
        if (employeeToUpdate) {
          setOriginalEmployees(old =>
            old.map((row) =>
              row.employee_id === employeeToUpdate.employee_id 
                ? { ...row, [columnId]: value } 
                : row
            )
          );
        }
        
        // Mark that there are unsaved changes
        setHasUnsavedChanges(true);
      }
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex: false, // Prevent auto reset of page index
  });
  useLockScrollbar(tableSettings.enableFullScreen);

  // Function to reset pagination to first page
  const resetToFirstPage = () => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

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
            fetchAttendanceData={fetchAttendanceData}
            hasUnsavedChanges={hasUnsavedChanges}
            setHasUnsavedChanges={setHasUnsavedChanges}
            resetToFirstPage={resetToFirstPage}
          />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen ? "overflow-hidden" : "px-[--margin-x]"
            )}
          >
            <Card className={clsx(
                "relative flex grow flex-col",
                tableSettings.enableFullScreen && "overflow-hidden"
              )}>
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                <Table
                  key={tableRefreshKey}
                  hoverable
                  dense={tableSettings.enableRowDense}
                  sticky={tableSettings.enableFullScreen}
                  className="w-full text-left rtl:text-right"
                >
                  <THead>
                    {table.getHeaderGroups().map(hg => (
                      <Tr key={hg.id}>
                        {hg.headers.map(h => (
                          <Th key={h.id} className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
                            {h.isPlaceholder
                              ? null
                              : flexRender(h.column.columnDef.header, h.getContext())}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </THead>
                  <TBody>
                    {table.getRowModel().rows.map(r => (
                      <Tr key={r.id} className="relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
                        {r.getVisibleCells().map(cell => (
                          <Td key={cell.id} className="relative bg-white dark:bg-dark-900">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center p-8 text-gray-500">
                  <p className="text-lg font-medium">Loading employees...</p>
                </div>
              ) : table.getCoreRowModel().rows.length > 0 ? (
                <div className="px-4 pb-4 sm:px-5 sm:pt-4 bg-gray-50 dark:bg-dark-800">
                  <PaginationSection table={table} />
                </div>
              ) : (
                <div className="flex justify-center items-center p-8 text-gray-500">
                  <div className="text-center">
                    <p className="text-lg font-medium">No matching records found</p>
                    <p className="mt-1">Try adjusting your filters or search criteria</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}