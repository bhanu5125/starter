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
import { RadioGroup, Radio } from "@headlessui/react";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { departments } from "./data"; // Assuming you have employee status options
import { employeeStatusOptions } from "./data";
import { Listbox } from "components/shared/form/Listbox";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
              <Button
              type="button"
              className="min-w-[7rem]"
              onClick={() => navigate(-1)}
            >
              Back
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
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("Active");

  // Get unique department list from originalEmployees
  const departmentOptions = [
    { label: "All", value: "All" },
    ...Array.from(
      new Set(originalEmployees.map((emp) => emp.department_name).filter(Boolean))
    ).map((dept) => ({ label: dept, value: dept })),
  ];

  // Filter employees automatically when filter changes
  useEffect(() => {
    let filtered = originalEmployees;
    if (selectedDepartment !== "All") {
      filtered = filtered.filter((emp) => emp.department_name === selectedDepartment);
    }
    if (selectedStatus !== "All") {
      filtered = filtered.filter((emp) => emp.status === selectedStatus);
    }
    setEmployees(filtered);
  }, [selectedDepartment, selectedStatus, originalEmployees, setEmployees]);

  // Handle department change
  const handleDepartmentChange = (option) => {
    setSelectedDepartment(option.value);
  };

  // Handle status change
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Department Listbox */}
      <Listbox
        data={departmentOptions}
        value={departmentOptions.find((d) => d.value === selectedDepartment)}
        onChange={handleDepartmentChange}
        displayField="label"
        valueField="value"
        style={{ minWidth: 160, maxWidth: 240 }}
        placeholder="Select Department"
      />
      {/* Status RadioGroup */}
      <RadioGroup
        value={selectedStatus}
        onChange={handleStatusChange}
        className="flex gap-3"
      >
        {['Active', 'InActive', 'All'].map((status) => (
          <label key={status} className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              value={status}
              checked={selectedStatus === status}
              onChange={() => handleStatusChange(status)}
              className="accent-blue-600"
            />
            <span>{status}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
};

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  employees: PropTypes.array.isRequired,
  setEmployees: PropTypes.func.isRequired,
  originalEmployees: PropTypes.array,
};
