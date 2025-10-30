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
import { useNavigate } from "react-router-dom";
import { useErrorHandler } from "hooks";

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

export function Toolbar({ table, setEmployees, fetchEmployees }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = monthNames[currentDate.getMonth()].value;

  const [selectedDepartment, setSelectedDepartment] = useState(0);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const years = Array.from({ length: 31 }, (_, i) => ({
    label: (2018 + i).toString(),
    value: 2018 + i,
  }));

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://dev.trafficcounting.in/nodejs/api/get-deptname');
        const data = response.data;
        // Transform to match structure: add "All" and format as { label, value }
        const transformed = [
          { label: "All", value: 0 },
          ...data.map(item => ({ label: item.DeptName, value: item.ID }))
        ];
        setDepartments(transformed);
      } catch (error) {
        console.error('Error fetching departments:', error);
        handleError(error, "Failed to load departments.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartments();
  }, [handleError]);

  const handleDepartmentChange = (selectedOption) => {
    const value = selectedOption?.value || 0;
    setSelectedDepartment(value);
    fetchEmployees(value, selectedYear, selectedMonth, 2);
  };

  const handleYearChange = (selectedOption) => {
    const value = selectedOption?.value || currentYear;
    setSelectedYear(value);
    fetchEmployees(selectedDepartment, value, selectedMonth, 2);
  };

  const handleMonthChange = (selectedOption) => {
    const value = selectedOption?.value || currentMonth;
    setSelectedMonth(value);
    fetchEmployees(selectedDepartment, selectedYear, value, 2);
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
            PaySlip Reports for{" "}
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
              handleDepartmentChange={handleDepartmentChange}
              handleYearChange={handleYearChange}
              handleMonthChange={handleMonthChange}
              years={years}
              months={monthNames}
              departments={departments}
              isLoading={isLoading}
            />
          </div>
        </>
      ) : (
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
            handleDepartmentChange={handleDepartmentChange}
            handleYearChange={handleYearChange}
            handleMonthChange={handleMonthChange}
            years={years}
            months={monthNames}
            departments={departments}
            isLoading={isLoading}
          />
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
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
  handleDepartmentChange,
  handleYearChange,
  handleMonthChange,
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
    </div>
  );
};

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  setEmployees: PropTypes.func.isRequired,
  fetchEmployees: PropTypes.func.isRequired,
};
