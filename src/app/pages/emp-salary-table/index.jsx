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

// Local Imports
import { Table, Card, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Page } from "components/shared/Page";
import { useLockScrollbar, useDidUpdate, useLocalStorage, useErrorHandler } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { toast } from "sonner";

export default function EmployeesDatatable() {
  const [originalEmployees, setOriginalEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [updatedEmployees, setUpdatedEmployees] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const { handleError } = useErrorHandler();
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

  const transformSalaryData = useCallback((rows = []) => {
    return rows.map((staff, index) => {
      const staffId =
        staff?.StaffId ??
        null;

      const salId =
        staff?.SalId ??
        staffId ??
        index;

      const rowKeyBase = salId ?? staffId ?? staff?.Code ?? `row-${index}`;
      const rowKeySuffix = [staff?.Year, staff?.Month].filter(Boolean).join("-");
      const rowKey = String(
        rowKeySuffix ? `${rowKeyBase}-${rowKeySuffix}` : `${rowKeyBase}-${index}`
      );

      return {
        rowKey,
        StaffId: staffId ?? salId ?? index,
        SalId: salId,
        code: staff?.Code,
        firstname: staff?.FirstName,
        surname: staff?.LastName,
        department_name: staff?.Deptname,
        Salary: staff?.Salary ?? 0,
        Pfon: staff?.Pf_ESIon?.data?.[0] ?? 0,
        TDS: staff?.TDS ?? 0,
        Year: staff?.Year,
        Month: staff?.Month,
        ABRY_Flag: staff?.ABRY_Flag ?? 0,
        isModified: false,
      };
    });
  }, []);

  // Handle cell edits
  const handleCellEdit = (rowKey, columnId, value) => {
    const normalizedKey = rowKey != null ? String(rowKey) : null;
    const matchesRow = (row) => {
      if (!normalizedKey) {
        return false;
      }
      const candidates = [row?.rowKey, row?.SalId, row?.StaffId].filter(
        (candidate) => candidate !== undefined && candidate !== null
      );
      return candidates.some((candidate) => String(candidate) === normalizedKey);
    };

    const updateRows = (rows) =>
      rows.map((row) => (matchesRow(row) ? { ...row, [columnId]: value } : row));

    setEmployees((prev) => updateRows(prev));
    setOriginalEmployees((prev) => updateRows(prev));
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("https://tcs.trafficcounting.com/nodejs/api/get-salary", { params: { pKey: sessionStorage.getItem("Key") || "" } });
      console.log("Raw salary data response:", res.data);
      const data = transformSalaryData(res.data);
      setEmployees(data);
      setOriginalEmployees(data);
      console.log("Fetched salary data:", data);
    } catch (err) {
      console.error("Error fetching salary data:", err);
      handleError(err, "Failed to load salary data.");
    }
  }, [handleError, transformSalaryData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
  
    try {
      if (employees.length === 0) {
        setSaveError("No employee records to save");
        setIsSaving(false);
        return;
      }
  
      const payload = {
        pKey: sessionStorage.getItem("Key") || "",
        employees: originalEmployees.map(emp => ({
          SalId: emp.SalId,            // Ensure SalId is included
          StaffId: emp.StaffId,        // Fixed: Changed from emp.SId to emp.StaffId
          Salary: emp.Salary,
          Pf_ESIon: emp.Pfon || 0,
          TDS: emp.TDS || 0,
        }))
      };

      console.log("Saving salary data - Total employee count:", payload.employees.length);
      console.log("Saving salary data - Sample (first 2):", payload.employees.slice(0, 2));
  
      const response = await axios.put("https://tcs.trafficcounting.com/nodejs/api/update-salaries", payload);
  
      if (response.data.success) {
        toast.success("Salaries updated successfully!");
        // Refresh data after a successful update
        const refreshed = await axios.get("https://tcs.trafficcounting.com/nodejs/api/get-salary", { params: { pKey: sessionStorage.getItem("Key") || "" } });
        const data = transformSalaryData(refreshed.data);
        setOriginalEmployees(data);
        setEmployees(data);
        setUpdatedEmployees([]);
        setSaveError(null);
      } else {
        setSaveError(response.data.message || "Failed to update salaries");
        handleError(new Error(response.data.message), "Failed to update salaries");
      }
    } catch (error) {
      setSaveError(error.message || "Error occurred while updating salaries");
      handleError(error, "Failed to update salaries.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // React Table configuration
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
      updateData: (rowKey, columnId, value) => {
        handleCellEdit(rowKey, columnId, value);
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
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    autoResetPageIndex: false, // Prevent page reset when data changes
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
            originalEmployees={originalEmployees}
            onSave={handleSave}
            isSaving={isSaving}
            saveError={saveError}
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