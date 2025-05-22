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
  const [originalEmployees, setOriginalEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [updatedEmployees, setUpdatedEmployees] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
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

  // Handle cell edits
  const handleCellEdit = (rowIndex, columnId, value) => {
    const updatedEmployee = employees[rowIndex];
    
    setUpdatedEmployees(prev => {
      const existing = prev.find(e => e.StaffId === updatedEmployee.StaffId);
      
      if (existing) {
        return prev.map(e => 
          e.StaffId === updatedEmployee.StaffId 
            ? { ...e, [columnId]: value, isModified: true }
            : e
        );
      }
      return [...prev, { ...updatedEmployee, [columnId]: value, isModified: true }];
    });

    setEmployees(prev =>
      prev.map((row, index) => {
        if (index === rowIndex) {
          return { ...row, [columnId]: value };
        }
        return row;
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("https://tms-backend-three.vercel.app/api/get-salary");
      const data = res.data.map((staff) => ({
        StaffId: staff.SId,
        SalId: staff.SalId || staff.SId, // Use provided SalId or fallback to SId
        code: staff.Code,
        firstname: staff.FirstName,
        surname: staff.LastName,
        department_name: staff.Deptname,
        Salary: staff.Salary || 0,
        Pfon: staff.Pf_ESIon?.data?.[0] || 0,
        TDS: staff.TDS,
        Year: staff.Year,
        Month: staff.Month,
        ABRY_Flag: staff.ABRY_Flag || 0,
        isModified: false
      }));
      setEmployees(data);
      setOriginalEmployees(data);
    } catch (err) {
      console.error("Error fetching salary data:", err);
    }
  };  

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
        key: "Hr!$h!kesh",
        employees: employees.map(emp => ({
          SalId: emp.SalId,            // Ensure SalId is included
          StaffId: emp.SId,          // Ensure StaffId is included
          Salary: emp.Salary,
          Pf_ESIon: emp.Pfon || 0,
          TDS: emp.TDS || 0,
        }))
      };
  
      const response = await axios.put("https://tms-backend-three.vercel.app/api/update-salaries", payload);
  
      if (response.data.success) {
        // Refresh data after a successful update
        const refreshed = await axios.get("https://tms-backend-three.vercel.app/api/get-salary");
        const data = refreshed.data.map((staff) => ({
          StaffId: staff.SId,
          SalId: staff.SalId || staff.SId, // Again, fallback to SId if SalId is missing
          code: staff.Code,
          firstname: staff.FirstName,
          surname: staff.LastName,
          department_name: staff.Deptname,
          Salary: staff.Salary || 0,
          Pfon: staff.Pf_ESIon?.data?.[0] || 0,
          TDS: staff.TDS?.data?.[0] || 0,
          Year: staff.Year,
          Month: staff.Month,
          ABRY_Flag: staff.ABRY_Flag || 0,
          isModified: false
        }));
        setOriginalEmployees(data);
        setEmployees(data);
        setUpdatedEmployees([]);
      } else {
        setSaveError(response.data.message || "Failed to update salaries");
      }
    } catch (error) {
      setSaveError(error.message || "Error occurred while updating salaries");
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
      updateData: (rowIndex, columnId, value) => {
        handleCellEdit(rowIndex, columnId, value);
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