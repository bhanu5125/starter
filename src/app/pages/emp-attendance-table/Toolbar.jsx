/* eslint-disable no-unused-vars */
// src/components/toolbar.jsx
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { Listbox } from "components/shared/form/Listbox";
import { useState, useEffect } from "react";

// Month names (abbreviated) matching attendance keys.
const monthNames = [
  { label: "January", value: "Jan" },
  { label: "February", value: "Feb" },
  { label: "March", value: "Mar" },
  { label: "April", value: "Apr" },
  { label: "May", value: "May" },
  { label: "June", value: "Jun" },
  { label: "July", value: "Jul" },
  { label: "August", value: "Aug" },
  { label: "September", value: "Sep" },
  { label: "October", value: "Oct" },
  { label: "November", value: "Nov" },
  { label: "December", value: "Dec" },
];

export function Toolbar({ table, employees = [], setEmployees = () => {}, originalEmployees = [] }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  // Check admin status.
  const isAdmin = localStorage.getItem("isSecretKeyVerified") === "true";

  // Get current date values.
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = monthNames[now.getMonth()].value;
  const currentDateValue = now.getDate().toString(); // as string

  console.log("Current Date:", currentDateValue);

  // Initialize state. Non-admin users cannot change these.
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedYear, setSelectedYear] = useState(isAdmin ? currentYear : currentYear);
  const [selectedMonth, setSelectedMonth] = useState(isAdmin ? currentMonth : currentMonth);
  const [selectedDate, setSelectedDate] = useState(isAdmin ? currentDateValue : currentDateValue);

  // List of years.
  const years = Array.from({ length: 31 }, (_, i) => ({
    label: (2010 + i).toString(),
    value: 2010 + i,
  }));

  // Generate dates for the selected month and year.
  const generateDates = (year, monthAbbr) => {
    const monthIndex = monthNames.findIndex((m) => m.value === monthAbbr);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      label: (i + 1).toString(),
      value: (i + 1).toString(),
    }));
  };

  const [dates, setDates] = useState(generateDates(selectedYear, selectedMonth));

  useEffect(() => {
    // When selectedYear or selectedMonth changes, update the available dates.
    const newDates = generateDates(selectedYear, selectedMonth);
    setDates(newDates);
    // If current date (as string) is valid, use it; otherwise, default to "1"
    const dayNum = parseInt(currentDateValue, 10);
    if (dayNum <= newDates.length) {
      setSelectedDate(currentDateValue);
    } else {
      setSelectedDate("1");
    }
  }, [selectedYear, selectedMonth, currentDateValue]);

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption?.value || "");
  };

  const handleYearChange = (selectedOption) => {
    if (isAdmin) {
      setSelectedYear(selectedOption?.value || currentYear);
    }
  };

  const handleMonthChange = (selectedOption) => {
    if (isAdmin) {
      setSelectedMonth(selectedOption?.value || currentMonth);
    }
  };

  const handleDateChange = (selectedOption) => {
    if (isAdmin) {
      setSelectedDate(selectedOption?.value || currentDateValue);
    }
  };

  const handleGenerateClick = () => {
    // Filter originalEmployees based on department, year, and existence of attendance/OT for the selected month.
    const filteredEmployees = originalEmployees.filter((employee) => {
      const departmentMatch = !selectedDepartment || employee.department_name === selectedDepartment;
      const yearMatch = !selectedYear || employee.year === selectedYear;
      const monthMatch =
        !selectedMonth ||
        (employee.attendance && employee.attendance[selectedMonth] !== undefined) ||
        (employee.ot && employee.ot[selectedMonth] !== undefined);
      return departmentMatch && yearMatch && monthMatch;
    });

    // Attach the selected month and date to each employee.
    const employeesWithDate = filteredEmployees.map((emp) => ({
      ...emp,
      selectedMonth,
      selectedDate,
    }));

    console.log("Filtered Employees:", employeesWithDate);
    setEmployees(employeesWithDate);
  };

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          "transition-content flex items-center justify-between gap-5",
          isFullScreenEnabled ? "px-5 sm:px-6" : "px-[--margin-x] pt-4"
        )}
      >
        <div className="min-w-0">
          <h2 className="truncate px-2 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Attendance List
          </h2>
        </div>
      </div>
      {isXs ? (
        <>
          <div
            className={clsx(
              "flex space-x-2 pt-4 rtl:space-x-reverse",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]"
            )}
          >
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]"
            )}
          >
            <Filters
              employees={employees}
              setEmployees={setEmployees}
              originalEmployees={originalEmployees}
              selectedDepartment={selectedDepartment}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDate={selectedDate}
              handleDepartmentChange={handleDepartmentChange}
              handleYearChange={handleYearChange}
              handleMonthChange={handleMonthChange}
              handleDateChange={handleDateChange}
              handleGenerateClick={handleGenerateClick}
              years={years}
              months={monthNames}
              dates={dates}
              isAdmin={isAdmin}
            />
            <div className="flex items-center space-x-3">
              <Button type="button" className="min-w-[7rem]" color="primary" variant="outlined">
                Save
              </Button>
              <Button type="button" className="min-w-[7rem]" variant="outlined">
                Cancel
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div
          className={clsx(
            "custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4",
            isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]"
          )}
        >
          <Filters
            employees={employees}
            setEmployees={setEmployees}
            originalEmployees={originalEmployees}
            selectedDepartment={selectedDepartment}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDate={selectedDate}
            handleDepartmentChange={handleDepartmentChange}
            handleYearChange={handleYearChange}
            handleMonthChange={handleMonthChange}
            handleDateChange={handleDateChange}
            handleGenerateClick={handleGenerateClick}
            years={years}
            months={monthNames}
            dates={dates}
            isAdmin={isAdmin}
          />
          <div className="flex items-center space-x-3">
            <Button type="button" className="min-w-[7rem]" color="primary" variant="outlined">
              Save
            </Button>
            <Button type="button" className="min-w-[7rem]" variant="outlined">
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
  selectedDate,
  handleDepartmentChange,
  handleYearChange,
  handleMonthChange,
  handleDateChange,
  handleGenerateClick,
  years,
  months,
  dates,
  isAdmin,
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
        disabled={!isAdmin}
      />
      <Listbox
        style={{ minWidth: "200px", maxWidth: "350px", width: "100%" }}
        data={months}
        value={months.find((m) => m.value === selectedMonth) || null}
        placeholder="Select Month"
        onChange={handleMonthChange}
        displayField="label"
        disabled={!isAdmin}
      />
      <Listbox
        style={{ minWidth: "100px", maxWidth: "150px", width: "100%" }}
        data={dates}
        value={dates.find((d) => d.value === selectedDate) || null}
        placeholder="Select Date"
        onChange={handleDateChange}
        displayField="label"
        disabled={!isAdmin}
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

export default Toolbar;
