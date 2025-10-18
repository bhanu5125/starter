/* eslint-disable no-unused-vars */
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { Listbox } from "components/shared/form/Listbox";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const monthNames = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

export function Toolbar({ table, setEmployees, fetchEmployees, selectedOptionalColumns, setSelectedOptionalColumns, columnOptions }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const navigate = useNavigate();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = monthNames[currentDate.getMonth()].value;

  const [selectedDepartment, setSelectedDepartment] = useState(0);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [pEval, setPEval] = useState(2);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://tcs.trafficcounting.com/nodejs/api/get-deptname');
        const data = response.data;
        // Transform to match old structure: add "All" and format as { label, value }
        const transformed = [
          { label: "All", value: 0 },
          ...data.map(item => ({ label: item.DeptName, value: item.ID }))
        ];
        setDepartments(transformed);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const years = Array.from({ length: 31 }, (_, i) => ({
    label: (2018 + i).toString(),
    value: 2018 + i,
  }));


  // Unified handler to update state and fetch employees
  const handleDepartmentChange = (selectedOption) => {
    const value = selectedOption?.value || 0;
    setSelectedDepartment(value);
    fetchEmployees(value, selectedYear, selectedMonth, pEval);
  };

  const handleYearChange = (selectedOption) => {
    const value = selectedOption?.value || currentYear;
    setSelectedYear(value);
    fetchEmployees(selectedDepartment, value, selectedMonth, pEval);
  };

  const handleMonthChange = (selectedOption) => {
    const value = selectedOption?.value || currentMonth;
    setSelectedMonth(value);
    fetchEmployees(selectedDepartment, selectedYear, value, pEval);
  };

  const handlePEvalChange = (selectedOption) => {
    const value = selectedOption?.value ?? 2;
    setPEval(value);
    fetchEmployees(selectedDepartment, selectedYear, selectedMonth, value);
  };

  // Remove handleGenerateClick, not needed anymore

  const handleColumnSelectionChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedOptionalColumns(selectedIds);
  };

  const handleExport = async (reportType) => {
    const params = new URLSearchParams({
      deptId: selectedDepartment,
      year: selectedYear,
      month: selectedMonth,
      pPEVal: pEval,
    });
  
    try {
      const response = await axios.get(
        `https://tcs.trafficcounting.com/nodejs/api/export-${reportType}?${params.toString()}`,
        {
          responseType: "blob", // Important for binary responses
        }
      );
      console.log("Export response:", response);
  
      if (response.status !== 200) throw new Error("Export failed");
  
      // Instead of calling response.blob(), access the blob directly from response.data
      const blob = response.data;
      const downloadUrl = window.URL.createObjectURL(blob);
  
      // Extract filename from content-disposition header if available, otherwise use a default
      let filename = `HTPL${reportType === "salary" ? "SalReport" : "SalBankReport"}-${new Date().getTime()}.xlsx`;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(.+)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
  
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
  
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      // Consider adding user-friendly error notification here
    }
  };
  
  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          "transition-content flex items-center justify-between gap-5",
          isFullScreenEnabled ? "px-5 sm:px-6" : "px-[--margin-x] pt-4",
        )}
      >
        <div className="min-w-0">
          <h2 className="truncate px-2 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Salary Report for{" "}
            {selectedDepartment === 0
              ? "All"
              : departments.find((d) => d.value === selectedDepartment)
                  ?.label}{" "}
            - {selectedYear} -{" "}
            {selectedMonth
              ? monthNames.find((m) => m.value === selectedMonth).label
              : "All"}
          </h2>
        </div>
      </div>
      {isXs ? (
        <>
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
            )}
          >
            <Filters
              selectedDepartment={selectedDepartment}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              pEval={pEval}
              handleDepartmentChange={handleDepartmentChange}
              handleYearChange={handleYearChange}
              handleMonthChange={handleMonthChange}
              handlePEvalChange={handlePEvalChange}
              years={years}
              months={monthNames}
              departments={departments}
              isLoading={isLoading}
            />
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button
                type="button"
                className="min-w-[7rem]"
                color="primary"
                variant="outlined"
                onClick={() => handleExport("salary")}
              >
                Export
              </Button>
              <Button
                type="button"
                className="min-w-[7rem]"
                color="primary"
                onClick={() => handleExport("bank")}
              >
                Export for Bank
              </Button>
              <Button
              type="button"
              className="min-w-[7rem]"
              onClick={() => {
                navigate("/dashboards/payroll");
              }}
            >
              Back
            </Button>
            </div>
          </div>
          <div
            className={clsx(
              "flex justify-start pb-1 pt-2",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
            )}
          >
            <ColumnSelection
              selectedOptionalColumns={selectedOptionalColumns}
              columnOptions={columnOptions}
              handleColumnSelectionChange={handleColumnSelectionChange}
            />
          </div>
        </>
      ) : (
        <>
          <div
            className={clsx(
              "custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
            )}
          >
            <Filters
              selectedDepartment={selectedDepartment}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              pEval={pEval}
              handleDepartmentChange={handleDepartmentChange}
              handleYearChange={handleYearChange}
              handleMonthChange={handleMonthChange}
              handlePEvalChange={handlePEvalChange}
              years={years}
              months={monthNames}
              departments={departments}
              isLoading={isLoading}
            />
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Button
                  type="button"
                  className="min-w-[5rem]"
                  color="primary"
                  variant="outlined"
                  onClick={() => handleExport("salary")}
                >
                  Export
                </Button>
                <Button
                  type="button"
                  className="min-w-[8rem]"
                  color="primary"
                  onClick={() => handleExport("bank")}
                >
                  Export for Bank
                </Button>
                <Button
                type="button"
                className="min-w-[5rem]"
                onClick={() => {
                  navigate("/dashboards/payroll");
                }}
              >
                Back
              </Button>
            </div>
          </div>
          <div
            className={clsx(
              "flex justify-start pb-1 pt-2",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
            )}
          >
            <ColumnSelection
              selectedOptionalColumns={selectedOptionalColumns}
              columnOptions={columnOptions}
              handleColumnSelectionChange={handleColumnSelectionChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

const SearchInput = ({ table }) => {
  return (
    <Input
      size="small"
      icon={<MagnifyingGlassIcon className="size-4" />}
      onChange={(event) =>
        table.getColumn("department_name").setFilterValue(event.target.value)
      }
      placeholder="Search Employees..."
      className="flex-1"
    />
  );
};

const Filters = ({
  selectedDepartment,
  selectedYear,
  selectedMonth,
  pEval,
  handleDepartmentChange,
  handleYearChange,
  handleMonthChange,
  handlePEvalChange,
  years,
  months,
  departments,
  isLoading,
}) => {
  return (
    <div className="flex items-center gap-4 p-2">
      <Listbox
        style={{ minWidth: "200px", maxWidth: "350px", width: "100%" }}
        data={departments}
        value={departments.find((d) => d.value === selectedDepartment) || null}
        placeholder="Select Department"
        onChange={handleDepartmentChange}
        displayField="label"
        disabled={isLoading}
      />
      <Listbox
        style={{ minWidth: "200px", maxWidth: "350px", width: "100%" }}
        data={years}
        value={years.find((y) => y.value === selectedYear) || null}
        placeholder="Select Year"
        onChange={handleYearChange}
        displayField="label"
      />
      <Listbox
        style={{ minWidth: "200px", maxWidth: "350px", width: "100%" }}
        data={months}
        value={months.find((m) => m.value === selectedMonth) || null}
        placeholder="Select Month"
        onChange={handleMonthChange}
        displayField="label"
      />
      <Listbox
        style={{ minWidth: "150px", maxWidth: "200px", width: "100%" }}
        data={[
          { label: "All", value: 2 },
          { label: "PF(ON)", value: 1 },
          { label: "PF(OFF)", value: 0 },
        ]}
        value={[
          { label: "All", value: 2 },
          { label: "PF(ON)", value: 1 },
          { label: "PF(OFF)", value: 0 },
        ].find((item) => item.value === pEval)}
        placeholder="Select pEval"
        onChange={handlePEvalChange}
        displayField="label"
      />
    </div>
  );
};

function ColumnSelection({ selectedOptionalColumns, columnOptions, handleColumnSelectionChange }) {
  // Defensive programming: ensure columnOptions is an array
  const safeColumnOptions = columnOptions || [];
  const safeSelectedOptionalColumns = selectedOptionalColumns || [];
  
  const selectedOptions = safeColumnOptions.filter(option => 
    safeSelectedOptionalColumns.includes(option.value)
  );

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Columns:
      </span>
      <div className="min-w-[200px]">
        <Listbox
          multiple
          value={selectedOptions}
          onChange={handleColumnSelectionChange}
          placeholder="Show/Hide columns..."
          data={safeColumnOptions}
        />
      </div>
    </div>
  );
}

ColumnSelection.propTypes = {
  selectedOptionalColumns: PropTypes.array,
  columnOptions: PropTypes.array,
  handleColumnSelectionChange: PropTypes.func.isRequired,
};

ColumnSelection.defaultProps = {
  selectedOptionalColumns: [],
  columnOptions: [],
};

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  setEmployees: PropTypes.func.isRequired,
  fetchEmployees: PropTypes.func.isRequired,
  selectedOptionalColumns: PropTypes.array,
  setSelectedOptionalColumns: PropTypes.func,
  columnOptions: PropTypes.array,
};

Toolbar.defaultProps = {
  selectedOptionalColumns: [],
  setSelectedOptionalColumns: () => {},
  columnOptions: [],
};
