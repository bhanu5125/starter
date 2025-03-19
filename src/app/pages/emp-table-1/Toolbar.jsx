/* eslint-disable no-unused-vars */
// Toolbar.js
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { TbUpload } from "react-icons/tb";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";
// Local Imports
import { Button, Input } from "components/ui";
import { Radio, RadioGroup } from "@headlessui/react";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { departments } from "./data"; // Assuming you have employee status options
import { employeeStatusOptions } from "./data";
import { Listbox } from "components/shared/form/Listbox";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// ----------------------------------------------------------------------

export function Toolbar({
  table,
  employees = [],
  setEmployees = () => {},
  originalEmployees = [],
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const navigate = useNavigate();

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          "transition-content flex items-center justify-between gap-5",
          isFullScreenEnabled ? "px-5 sm:px-6" : "px-[--margin-x] pt-4",
        )}
      >
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 px-2">
          Staff List
          </h2>
        </div>
      </div>
      {isXs ? (
        <>
          <div
            className={clsx(
              "flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
            )}
          >
            <SearchInput table={table} />
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
            />
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button
                type="submit"
                className="min-w-[7rem]"
                color="primary"
                variant="outlined"
                onClick={() => navigate("/forms/emp1")}
              >
                Add Staff
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div
          className={clsx(
            "custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
            isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
          )}
          style={{
            "--margin-scroll": isFullScreenEnabled ? "4rem" : "0",
          }}
        >
          <Filters
            employees={employees}
            setEmployees={setEmployees}
            originalEmployees={originalEmployees}
          />
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Button
              type="submit"
              className="min-w-[7rem]"
              color="primary"
              variant="outlined"
              onClick={() => navigate("/forms/emp1")}
            >
              Add Staff
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------

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

// Filters Component
const Filters = ({
  employees = [],
  setEmployees = () => {},
  originalEmployees = [],
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState("All"); // Department filter
  const [selectedStatus, setSelectedStatus] = useState("Active"); // Status filter (null = "All")

  // Handle department change
  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption?.label === "All" ? "" : selectedOption?.label);
  };

  // Handle status change
  const handleStatusChange = (value) => {
    setSelectedStatus(value === null ? null : value); // Handle "All" option
  };

  // Apply filters when the Generate button is clicked
  const handleGenerateClick = () => {
    // Filter the original employees based on the selected department and status
    const filteredEmployees = originalEmployees.filter((employee) => {
      // Check department filter
      const departmentMatch =
        !selectedDepartment || employee.department_name === selectedDepartment;

      // Check status filter
      const statusMatch =
        selectedStatus === null || employee.status === selectedStatus;

      // Include the employee if both filters match
      return departmentMatch && statusMatch;
    });

    // Update the employees data with the filtered data
    setEmployees(filteredEmployees);
  };

  return (
    <div className="flex items-center gap-4 p-2">
      <Listbox
        style={{ minWidth: "200px", maxWidth: "350px", width: "100%" }}
        data={departments}
        value={departments.find((d) => d.label === selectedDepartment) || null}
        placeholder="Select Department"
        onChange={handleDepartmentChange}
        displayField="label"
      />

      {/* Employee Status - Inline Radio Buttons */}
      <RadioGroup
        value={selectedStatus}
        onChange={handleStatusChange}
        className="flex gap-3"
        label="Employee Status"
      >
        {employeeStatusOptions.map((option) => (
          <label
            key={option.label}
            className="danger flex cursor-pointer items-center gap-2"
          >
            <Radio
              value={option.value} // Use the value from employeeStatusOptions
              className={({ checked }) =>
                `h-4 w-4 rounded-full border-2 transition-colors ${
                  checked
                    ? "border-blue-500 bg-blue-500" // Selected state
                    : "border-gray-400 bg-transparent" // Unselected state
                }`
              }
            />
            <span className="text-slate-950 ">{option.label}</span>
          </label>
        ))}
      </RadioGroup>

      <div className="flex gap-2">
        <Button
          className="rounded-md px-4 py-2 text-white"
          color="primary"
          onClick={handleGenerateClick}
        >
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
