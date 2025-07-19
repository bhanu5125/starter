/* eslint-disable no-unused-vars */
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { Listbox } from "components/shared/form/Listbox";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";


// Month names with correct values matching backend expectation (01-12)
const monthNames = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

export function Toolbar({
  table,
  employees = [],
  setEmployees = () => {},
  originalEmployees = [],
  fetchAttendanceData,
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const navigate = useNavigate();

  // Check admin status.
  const isAdmin = localStorage.getItem("isSecretKeyVerified") === "true";

  // Get current date values.
  const now = new Date();
  const currentYear = now.getFullYear().toString();
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0"); // 01-12 format
  const currentDateValue = now.getDate().toString().padStart(2, "0"); // 01-31 format

  // Initialize state
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDate, setSelectedDate] = useState(currentDateValue);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // List of years.
  const years = Array.from({ length: 31 }, (_, i) => ({
    label: (2018 + i).toString(),
    value: (2018 + i).toString(),
  }));

  // Generate dates for the selected month and year.
  const generateDates = (year, month) => {
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      label: (i + 1).toString().padStart(2, "0"),
      value: (i + 1).toString().padStart(2, "0"),
    }));
  };

  const [dates, setDates] = useState(
    generateDates(selectedYear, selectedMonth),
  );

  useEffect(() => {
    // When selectedYear or selectedMonth changes, update the available dates.
    const newDates = generateDates(selectedYear, selectedMonth);
    setDates(newDates);

    // If current date is valid for the new month, keep it; otherwise, set to "01"
    const maxDay = newDates.length;
    if (parseInt(selectedDate) > maxDay) {
      setSelectedDate("01");
    }
  }, [selectedYear, selectedMonth, selectedDate]);

  // Function to apply all filters (department and search)
  const applyFilters = () => {
    let filteredData = [...originalEmployees];

    // Apply department filter if selected
    if (selectedDepartment) {
      filteredData = filteredData.filter(
        (employee) => employee.department_name === selectedDepartment,
      );
    }

    // Apply search filter if there's a search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (employee) =>
          (employee.name &&
            employee.name.toLowerCase().includes(lowerSearchTerm)) ||
          (employee.employee_id &&
            employee.employee_id.toString().includes(lowerSearchTerm)) ||
          (employee.department_name &&
            employee.department_name.toLowerCase().includes(lowerSearchTerm)),
      );
    }

    setEmployees(filteredData);
  };

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption?.value || "");
  };

  const handleYearChange = (selectedOption) => {
    if (isAdmin && selectedOption) {
      setSelectedYear(selectedOption.value);
    }
  };

  const handleMonthChange = (selectedOption) => {
    if (isAdmin && selectedOption) {
      setSelectedMonth(selectedOption.value);
    }
  };

  const handleDateChange = (selectedOption) => {
    if (isAdmin && selectedOption) {
      setSelectedDate(selectedOption.value);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenerateClick = async () => {
    const dateStr = `${selectedYear}-${selectedMonth}-${selectedDate}`;
    const deptId = selectedDepartment || "";

    await fetchAttendanceData(dateStr, deptId);
  };

  const handleFilterClick = () => {
    // Apply filters when the Filter button is clicked
    applyFilters();
  };

  const handleSaveClick = async () => {
    if (employees.length === 0) {
      alert("No employees to save.");
      return;
    }

    setIsSaving(true);
    try {
      // Prepare the records to save
      const records = employees.map((emp) => {
        const isAbsent = emp.attendance;
        const otHours = emp.ot || 0;
        const bonus = emp.bonus || 0;

        return {
          staffId: emp.employee_id,
          date: `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`,
          status: isAbsent,
          ot: parseFloat(otHours) || 0,
          bonus: bonus,
        };
      });
      console.log("Attendance records to save:", records);

      if (records.length === 0) {
        alert("No attendance records to save.");
        return;
      }

      // Save attendance records
      const response = await axios.post(
        "http://vps65389.dreamhostps.com:5000/api/attendance",
        {
          records,
        },
      );

      console.log("Save response:", response.data);
      alert("Attendance data saved successfully!");
    } catch (err) {
      console.error("Error saving attendance data:", err);
      alert("Failed to save attendance data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedDepartment("");
    setSearchTerm("");
    setEmployees(originalEmployees);
  };

  const handleKeyPress = (event) => {
    // Apply filters when Enter key is pressed in the search input
    if (event.key === "Enter") {
      applyFilters();
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
            Attendance List
          </h2>
        </div>
      </div>
      {isXs ? (
        <>
          <div
            className={clsx(
              "flex space-x-2 pt-4 rtl:space-x-reverse",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
            )}
          >
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
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
              <Button
                type="button"
                className="min-w-[7rem]"
                color="primary"
                variant="outlined"
                onClick={handleSaveClick}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
              type="button"
              className="min-w-[7rem]"
              onClick={() => {
                navigate("/dashboards/home");
              }}
            >
              Back
            </Button>
            </div>
          </div>
        </>
      ) : (
        <div
          className={clsx(
            "custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4",
            isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
          )}
        >
          <div className="flex items-center gap-4">
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
          </div>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              className="min-w-[7rem]"
              color="primary"
              variant="outlined"
              onClick={handleSaveClick}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              className="min-w-[7rem]"
              onClick={() => {
                navigate("/dashboards/home");
              }}
            >
              Back
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const SearchInput = ({ value, onChange, onKeyPress }) => {
  return (
    <Input
      size="small"
      icon={<MagnifyingGlassIcon className="size-4" />}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder="Search Employees..."
      className="min-w-[240px] flex-1"
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
    { label: "All", value: "" },
    { label: "TRIBE DEVELOPMENT", value: 1 },
    { label: "TRIBE DESIGN", value: 2 },
    { label: "TSS ADMIN", value: 3 },
    { label: "TSS DATA ENTRY", value: 4 },
    { label: "HTPL", value: 5 },
  ];
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex items-center gap-4 p-2">
      <Listbox
        style={{ minWidth: "180px", maxWidth: "250px", width: "100%" }}
        data={departments}
        value={departments.find(d => d.value === selectedDepartment)}
        onChange={handleDepartmentChange}
        placeholder="Select Department"
        displayField="label"
      />
      <Listbox
        style={{ minWidth: "120px", maxWidth: "150px", width: "100%" }}
        data={years}
        value={years.find((y) => y.value === selectedYear) || null}
        placeholder="Select Year"
        onChange={handleYearChange}
        displayField="label"
        disabled={!isAdmin}
      />
      <Listbox
        style={{ minWidth: "120px", maxWidth: "150px", width: "100%" }}
        data={months}
        value={months.find((m) => m.value === selectedMonth) || null}
        placeholder="Select Month"
        onChange={handleMonthChange}
        displayField="label"
        disabled={!isAdmin}
      />
      <Listbox
        style={{ minWidth: "120px", maxWidth: "150px", width: "100%" }}
        data={dates}
        value={dates.find((d) => d.value === selectedDate) || null}
        placeholder="Select Date"
        onChange={handleDateChange}
        displayField="label"
        disabled={!isAdmin}
      />
      <Button
        type="button"
        color="primary"
        variant="outlined"
        className="min-w-[7rem]"
        onClick={handleGenerateClick}
        disabled={isLoading} // Disable while loading
      >
        {isLoading ? "Generating..." : "Generate"}
      </Button>
    </div>
  );
};

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  employees: PropTypes.array.isRequired,
  setEmployees: PropTypes.func.isRequired,
  originalEmployees: PropTypes.array.isRequired,
  fetchAttendanceData: PropTypes.func.isRequired,
};

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
};

Filters.propTypes = {
  employees: PropTypes.array,
  setEmployees: PropTypes.func,
  originalEmployees: PropTypes.array,
  selectedDepartment: PropTypes.string,
  selectedYear: PropTypes.string,
  selectedMonth: PropTypes.string,
  selectedDate: PropTypes.string,
  handleDepartmentChange: PropTypes.func,
  handleYearChange: PropTypes.func,
  handleMonthChange: PropTypes.func,
  handleDateChange: PropTypes.func,
  handleGenerateClick: PropTypes.func,
  years: PropTypes.array,
  months: PropTypes.array,
  dates: PropTypes.array,
  isAdmin: PropTypes.bool,
  handleResetFilters: PropTypes.func,
};

export default Toolbar;
