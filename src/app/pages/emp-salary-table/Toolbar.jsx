/* eslint-disable no-unused-vars */
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { Listbox } from "components/shared/form/Listbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Toolbar({ 
  table, 
  employees = [], 
  setEmployees = () => {}, 
  originalEmployees = [], 
  onSave = () => {},
  onReset = () => {},
  isSaving = false,
  saveError = null
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table?.getState()?.tableSettings?.enableFullScreen || false;
  const navigate = useNavigate();
  
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption?.value || "All");
  };

  const handleGenerateClick = () => {
    const filteredEmployees = originalEmployees.filter((employee) => {
      return selectedDepartment === "All" || 
             employee.department_name === selectedDepartment;
    });

    setEmployees(filteredEmployees);
  };

  const handleResetClick = () => {
    setSelectedDepartment("All");
    onReset();
  };

  const departments = [
    { label: "All", value: "All" },
    { label: "TRIBE DEVELOPMENT", value: "TRIBE DEVELOPMENT" },
    { label: "TRIBE DESIGN", value: "TRIBE DESIGN" },
    { label: "TSS ADMIN", value: "TSS ADMIN" },
    { label: "TSS DATA ENTRY", value: "TSS DATA ENTRY" },
    { label: "HTPL", value: "HTPL" },
  ];

  return (
    <div className="table-toolbar">
      <div className={clsx(
        "transition-content flex items-center justify-between gap-5", 
        isFullScreenEnabled ? "px-5 sm:px-6" : "px-[--margin-x] pt-4"
      )}>
        <div className="min-w-0">
          <h2 className="truncate px-2 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Salary List
          </h2>
        </div>
      </div>

      {isXs ? (
        <>          
          <div className={clsx(
            "hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
            isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]"
          )}>
            <div className="flex items-center gap-4 p-2">
              <Listbox
                style={{ minWidth: "200px", maxWidth: "350px", width: "100%" }}
                data={departments}
                value={departments.find((d) => d.value === selectedDepartment) || null}
                placeholder="Select Department"
                onChange={handleDepartmentChange}
                displayField="label"
              />
              <Button 
                className="rounded-md px-4 py-2 text-white" 
                color="primary" 
                onClick={handleGenerateClick}
              >
                Generate
              </Button>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button 
                type="button"
                className="min-w-[7rem]" 
                color="primary" 
                variant="outlined"
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
              type="button"
              className="min-w-[7rem]"
              onClick={() => {
                navigate("/dashboards/administration");
              }}
            >
              Back
            </Button>
            </div>
          </div>
        </>
      ) : (
        <div className={clsx(
          "custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
          isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]"
        )}>
          <div className="flex items-center gap-4 p-2">
            <Listbox
              style={{ minWidth: "200px", maxWidth: "350px", width: "100%" }}
              data={departments}
              value={departments.find((d) => d.value === selectedDepartment) || null}
              placeholder="Select Department"
              onChange={handleDepartmentChange}
              displayField="label"
            />
            <Button 
              className="rounded-md px-4 py-2 text-white" 
              color="primary" 
              onClick={handleGenerateClick}
            >
              Generate
            </Button>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Button 
              type="button"
              className="min-w-[7rem]" 
              color="primary" 
              variant="outlined"
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              className="min-w-[7rem]"
              onClick={() => {
                navigate("/dashboards/administration");
              }}
            >
              Back
            </Button>
          </div>
        </div>
      )}

      {saveError && (
        <div className="text-red-500 px-[--margin-x] pt-2">
          {saveError}
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
      onChange={(event) => table.getColumn("Deptname").setFilterValue(event.target.value)}
      placeholder="Search by Department..."
      className="flex-1"
    />
  );
};

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  employees: PropTypes.array.isRequired,
  setEmployees: PropTypes.func.isRequired,
  originalEmployees: PropTypes.array,
  onSave: PropTypes.func,
  onReset: PropTypes.func,
  isSaving: PropTypes.bool,
  saveError: PropTypes.string
};

SearchInput.propTypes = {
  table: PropTypes.object.isRequired
};