/* eslint-disable no-unused-vars */
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { Listbox } from "components/shared/form/Listbox";
import { useState } from "react";

// Define monthNames array at the top
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

export function Toolbar({ table, employees = [], setEmployees = () => {}, originalEmployees = [] }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  // Get current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = monthNames[currentDate.getMonth()].value; // Use monthNames array for month abbreviations

  // Initialize state with current year and month
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const years = Array.from({ length: 31 }, (_, i) => ({
    label: (2010 + i).toString(),
    value: 2010 + i,
  }));

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption?.value || "");
  };

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption?.value || null);
  };

  const handleMonthChange = (selectedOption) => {
    setSelectedMonth(selectedOption?.value || null);
  };

  const handleGenerateClick = () => {
    const filteredEmployees = originalEmployees.filter((employee) => {
      // Filter by department
      const departmentMatch = !selectedDepartment || employee.department_name === selectedDepartment;

      // Filter by year
      const yearMatch = !selectedYear || employee.Year === selectedYear;

      // Filter by month
      const monthMatch = !selectedMonth || employee.Month === selectedMonth;

      return departmentMatch && yearMatch && monthMatch;
    });

    console.log("Filtered Employees:", filteredEmployees);
    setEmployees(filteredEmployees);
  };

  return (
    <div className="table-toolbar">
      <div className={clsx("transition-content flex items-center justify-between gap-5", isFullScreenEnabled ? "px-5 sm:px-6" : "px-[--margin-x] pt-4")}>
        <div className="min-w-0">
          <h2 className="truncate px-2 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Staff Payroll
            </h2>
        </div>
      </div>
      {isXs ? (
        <>
          <div className={clsx("flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1", isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]")}>
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>
          <div className={clsx("hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse", isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]")}>
            <Filters
              employees={employees}
              setEmployees={setEmployees}
              originalEmployees={originalEmployees}
              selectedDepartment={selectedDepartment}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              handleDepartmentChange={handleDepartmentChange}
              handleYearChange={handleYearChange}
              handleMonthChange={handleMonthChange}
              handleGenerateClick={handleGenerateClick}
              years={years}
              months={monthNames}
            />
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button type="submit" className="min-w-[7rem]" color="primary" variant="outlined">
                Save
              </Button>
              <Button type="submit" className="min-w-[7rem]" color="" variant="outlined">
                Cancel
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className={clsx("custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse", isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]")}>
          <Filters
            employees={employees}
            setEmployees={setEmployees}
            originalEmployees={originalEmployees}
            selectedDepartment={selectedDepartment}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            handleDepartmentChange={handleDepartmentChange}
            handleYearChange={handleYearChange}
            handleMonthChange={handleMonthChange}
            handleGenerateClick={handleGenerateClick}
            years={years}
            months={monthNames}
          />
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Button type="submit" className="min-w-[7rem]" color="primary" variant="outlined">
              Save
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="" variant="outlined">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const SearchInput = ({ table }) => {
  return (
    <Input
      size="small"
      icon={<MagnifyingGlassIcon className="size-4" />}
      onChange={(event) => table.getColumn("department_name").setFilterValue(event.target.value)}
      placeholder="Search Employees..."
      className="flex-1"
    />
  );
};

const Filters = ({
  employees = [],
  setEmployees = () => {},
  originalEmployees = [],
  selectedDepartment,
  selectedYear,
  selectedMonth,
  handleDepartmentChange,
  handleYearChange,
  handleMonthChange,
  handleGenerateClick,
  years,
  months,
}) => {
  const departments = [
    { label: "All", value: null },
    { label: "TRIBE DEVELOPMENT", value: "TRIBE DEVELOPMENT" },
    { label: "TRIBE DESIGN", value: "TRIBE DESIGN" },
    { label: "TSS ADMIN", value: "TSS ADMIN" },
    { label: "TSS DATA ENTRY", value: "TSS DATA ENTRY" },
    { label: "HTPL", value: "HTPL" },
  ];

  return (
    <div className="flex items-center gap-4 p-2">
      <Listbox
        style={{ minWidth: "200px", maxWidth: "350px", width: "100%" }}
        data={departments}
        value={departments.find((d) => d.value === selectedDepartment) || null}
        placeholder="Select Department"
        onChange={handleDepartmentChange}
        displayField="label"
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
      <div className="flex gap-2">
        <Button className="rounded-md px-4 py-2 text-white" color="primary" onClick={handleGenerateClick}>
          Generate
        </Button>
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  employees: PropTypes.array.isRequired,
  setEmployees: PropTypes.func.isRequired,
  originalEmployees: PropTypes.array,
};