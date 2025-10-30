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
  const { handleError } = useErrorHandler();
  
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://dev.trafficcounting.in/nodejs/api/get-deptname');
        const data = response.data;
        // Transform to match old structure: add "All" and format as { label, value }
        const transformed = [
          { label: "All", value: "All" },
          ...data.map(item => ({ label: item.DeptName, value: item.DeptName }))
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

    // Sync Listbox display to 'All' when reset (when originalEmployees changes after reset)
    // This ensures the Listbox always shows the correct value after a reset/save
    useEffect(() => {
      setSelectedDepartment("All");
    }, [originalEmployees]);

    const handleResetClick = () => {
      onReset();
    };

  const handleDepartmentChange = (selectedOption) => {
    const value = selectedOption?.value || "All";
    setSelectedDepartment(value);
    const filteredEmployees = originalEmployees.filter((employee) => {
      return value === "All" || employee.department_name === value;
    });
    setEmployees(filteredEmployees);
  };

    // handleResetClick is now above, updated to force Listbox re-render

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
                disabled={isLoading}
              />
              {/* Generate button removed: filtering is now automatic */}
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
              disabled={isLoading}
            />
            {/* Generate button removed: filtering is now automatic */}
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