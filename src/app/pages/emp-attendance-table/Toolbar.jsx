/* eslint-disable no-unused-vars */
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Button, Input } from "components/ui";
import { Checkbox } from "components/ui";
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
  hasUnsavedChanges = false,
  setHasUnsavedChanges = () => {},
  resetToFirstPage = () => {},
}) {
  const [isOT, setIsOT] = useState(false); // OT checkbox state
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const navigate = useNavigate();

  // Check admin status.
  const isAdmin = sessionStorage.getItem("isSecretKeyVerified") === "true";

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
  const [selectedStaffType, setSelectedStaffType] = useState("All");

  // Department id 4 corresponds to TSS DATA ENTRY in this screen
  const isTSSDepartment = selectedDepartment === 3;

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

    // Note: Department filtering is handled via fetch (Generate). We only apply local
    // filtering for staff type when TSS DATA ENTRY is selected.
    if (isTSSDepartment && selectedStaffType !== "All") {
      filteredData = filteredData.filter((employee) => {
        const staffType = employee.staff_type ?? 0;
        return staffType === selectedStaffType;
      });
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

  const [isTableLoading, setIsTableLoading] = useState(false);

  const handleDepartmentChange = async (selectedOption) => {
    const value = selectedOption?.value || "";
    
    // Check for unsaved changes before switching
    if (hasUnsavedChanges) {
      const confirmSwitch = window.confirm(
        "You have unsaved changes. Switching departments will discard them. Do you want to continue?"
      );
      if (!confirmSwitch) {
        return; // Don't switch departments
      }
    }
    
    setSelectedDepartment(value);
    setSelectedStaffType("All");
    const dateStr = `${selectedYear}-${selectedMonth}-${selectedDate}`;
    setIsTableLoading(true);
    const result = await fetchAttendanceData(dateStr, value);
    if (result && result.hasOT) {
      setIsOT(true);
    } else {
      setIsOT(false);
    }
    setIsTableLoading(false);
    setHasUnsavedChanges(false); // Reset unsaved changes flag
    resetToFirstPage(); // Reset to page 1 when department changes
  };

  const handleYearChange = async (selectedOption) => {
    if (isAdmin && selectedOption) {
      // Check for unsaved changes before switching
      if (hasUnsavedChanges) {
        const confirmSwitch = window.confirm(
          "You have unsaved changes. Changing the year will discard them. Do you want to continue?"
        );
        if (!confirmSwitch) {
          return;
        }
      }
      
      setSelectedYear(selectedOption.value);
      const dateStr = `${selectedOption.value}-${selectedMonth}-${selectedDate}`;
      setIsTableLoading(true);
      const result = await fetchAttendanceData(dateStr, selectedDepartment);
      if (result && result.hasOT) {
        setIsOT(true);
      } else {
        setIsOT(false);
      }
      setIsTableLoading(false);
      setHasUnsavedChanges(false);
      resetToFirstPage(); // Reset to page 1 when year changes
    }
  };

  const handleMonthChange = async (selectedOption) => {
    if (isAdmin && selectedOption) {
      // Check for unsaved changes before switching
      if (hasUnsavedChanges) {
        const confirmSwitch = window.confirm(
          "You have unsaved changes. Changing the month will discard them. Do you want to continue?"
        );
        if (!confirmSwitch) {
          return;
        }
      }
      
      setSelectedMonth(selectedOption.value);
      const dateStr = `${selectedYear}-${selectedOption.value}-${selectedDate}`;
      setIsTableLoading(true);
      const result = await fetchAttendanceData(dateStr, selectedDepartment);
      if (result && result.hasOT) {
        setIsOT(true);
      } else {
        setIsOT(false);
      }
      setIsTableLoading(false);
      setHasUnsavedChanges(false);
      resetToFirstPage(); // Reset to page 1 when month changes
    }
  };

  const handleDateChange = async (selectedOption) => {
    if (isAdmin && selectedOption) {
      // Check for unsaved changes before switching
      if (hasUnsavedChanges) {
        const confirmSwitch = window.confirm(
          "You have unsaved changes. Changing the date will discard them. Do you want to continue?"
        );
        if (!confirmSwitch) {
          return;
        }
      }
      
      setSelectedDate(selectedOption.value);
      const dateStr = `${selectedYear}-${selectedMonth}-${selectedOption.value}`;
      setIsTableLoading(true);
      const result = await fetchAttendanceData(dateStr, selectedDepartment);
      if (result && result.hasOT) {
        setIsOT(true);
      } else {
        setIsOT(false);
      }
      setIsTableLoading(false);
      setHasUnsavedChanges(false);
      resetToFirstPage(); // Reset to page 1 when date changes
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle OT checkbox change with confirmation
  const handleOTChange = (e) => {
    const shouldEnableOT = e.target.checked;
    
    if (shouldEnableOT) {
      const dateFormatted = `${selectedDate}-${selectedMonth}-${selectedYear}`;
      const confirmOT = window.confirm(
        `This date (${dateFormatted}) will be considered as OT. Do you want to continue?`
      );
      
      if (!confirmOT) {
        return; // Don't change the checkbox state if user cancels
      }
    }
    
    setIsOT(shouldEnableOT);
  };

  // Staff type options (Groups A-G)
  const staffTypeOptions = [
    { label: "All", value: "All" },
    ...Array.from({ length: 7 }, (_, i) => ({ label: `Group ${String.fromCharCode(65 + i)}`, value: i+1 })),
  ];

  const handleStaffTypeChange = (option) => {
    setSelectedStaffType(option.value);
    // If TSS DATA ENTRY is selected, apply staff type filter immediately
    if (isTSSDepartment) {
      let filteredData = [...originalEmployees];
      if (option.value !== "All") {
        filteredData = filteredData.filter((employee) => {
          const staffType = employee.staff_type ?? 0;
          return staffType === option.value;
        });
      }
      setEmployees(filteredData);
      resetToFirstPage(); // Reset to page 1 when group changes
    }
  };

  const handleGenerateClick = async () => {
    const dateStr = `${selectedYear}-${selectedMonth}-${selectedDate}`;
    const deptId = selectedDepartment || "";

    const data = await fetchAttendanceData(dateStr, deptId);
    // Apply staff type filter only AFTER data is generated
    let final = data || [];
    if (isTSSDepartment && selectedStaffType !== "All") {
      final = final.filter((emp) => {
        const staffType = emp.staff_type ?? 0;
        return staffType === selectedStaffType;
      });
    }
    setEmployees(final);
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
      // New logic: attendance true = present (checked), false = absent (unchecked)
      // Backend expects 0 for present, 1 for absent
      const records = employees.map((emp) => {
        const isPresent = emp.attendance; // true = present, false = absent
        return {
          staffId: emp.employee_id,
          date: `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`,
          status: isPresent ? 0 : 1, // backend expects 0 for present, 1 for absent
          isOT: isOT
        };
      });
      console.log("Attendance records to save (0=present, 1=absent):", records);

      if (records.length === 0) {
        alert("No attendance records to save.");
        return;
      }

      // Save attendance records
      const response = await axios.post(
        "https://tcs.trafficcounting.com/nodejs/api/attendance",
        {
          records,
        },
      );

      console.log("Save response:", response.data);
      alert("Attendance data saved successfully!");
      
      // Reset unsaved changes flag
      setHasUnsavedChanges(false);
      
      // Refresh the table after successful save
      const dateStr = `${selectedYear}-${selectedMonth}-${selectedDate}`;
      const result = await fetchAttendanceData(dateStr, selectedDepartment);
      
      // result is an object { data, hasOT }, not an array
      if (result && result.hasOT) {
        setIsOT(true);
      } else {
        setIsOT(false);
      }
      
      // Apply staff type filter if TSS department is selected
      // Note: fetchAttendanceData already updates the employees state,
      // so we only need to apply additional filtering if needed
      if (isTSSDepartment && selectedStaffType !== "All" && result && result.data) {
        const filteredData = result.data.filter((emp) => {
          const staffType = emp.staff_type ?? 0;
          return staffType === selectedStaffType;
        });
        setEmployees(filteredData);
      }
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
      {isTableLoading && (
        <div className="w-full text-center py-2 text-blue-600 font-medium">Loading...</div>
      )}
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
              years={years}
              months={monthNames}
              dates={dates}
              isAdmin={isAdmin}
              isTSSDepartment={isTSSDepartment}
              staffTypeOptions={staffTypeOptions}
              selectedStaffType={selectedStaffType}
              handleStaffTypeChange={handleStaffTypeChange}
              isOT={isOT}
              handleOTChange={handleOTChange}
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
              years={years}
              months={monthNames}
              dates={dates}
              isAdmin={isAdmin}
              isTSSDepartment={isTSSDepartment}
              staffTypeOptions={staffTypeOptions}
              selectedStaffType={selectedStaffType}
              handleStaffTypeChange={handleStaffTypeChange}
              isOT={isOT}
              handleOTChange={handleOTChange}
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
  isTSSDepartment,
  staffTypeOptions,
  selectedStaffType,
  handleStaffTypeChange,
  isOT,
  handleOTChange,
}) => {
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
          { label: "All", value: "" },
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

  return (
    <div className="flex items-center gap-4 p-2">
      <Listbox
        style={{ minWidth: "180px", maxWidth: "250px", width: "100%" }}
        data={departments}
        value={departments.find(d => d.value === selectedDepartment)}
        onChange={handleDepartmentChange}
        placeholder="Select Department"
        displayField="label"
        disabled={isLoading}
      />
      {isTSSDepartment && (
        <Listbox
          style={{ minWidth: "120px", maxWidth: "160px", width: "100%" }}
          data={staffTypeOptions}
          value={staffTypeOptions.find((t) => t.value === selectedStaffType) || staffTypeOptions[0]}
          onChange={handleStaffTypeChange}
          displayField="label"
          valueField="value"
          placeholder="Select Group"
        />
      )}
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
      {/* OT Checkbox */}
      <div className="flex items-center">
        <Checkbox
          checked={isOT}
          onChange={handleOTChange}
          label="OT"
          color="primary"
          variant="outlined"
        />
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  employees: PropTypes.array.isRequired,
  setEmployees: PropTypes.func.isRequired,
  originalEmployees: PropTypes.array.isRequired,
  fetchAttendanceData: PropTypes.func.isRequired,
  hasUnsavedChanges: PropTypes.bool,
  setHasUnsavedChanges: PropTypes.func,
  resetToFirstPage: PropTypes.func,
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
  selectedDepartment: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
  isTSSDepartment: PropTypes.bool,
  staffTypeOptions: PropTypes.array,
  selectedStaffType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleStaffTypeChange: PropTypes.func,
  isOT: PropTypes.bool,
  handleOTChange: PropTypes.func,
};

export default Toolbar;
