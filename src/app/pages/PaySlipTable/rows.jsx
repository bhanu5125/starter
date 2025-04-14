/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Input, Checkbox } from "components/ui";

export function TextCell({ getValue }) {
  const value = getValue();
  // If value is an object, safely convert it to a string.
  if (value !== null && typeof value === "object") {
    return (
      <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
        {value?.data}
      </p>
    );
  }
  return (
    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
      {value}
    </p>
  );
}

export function EmployeeIdCell({ index }) {
  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      {index + 1}
    </span>
  );
}

export function EmployeeNameCell({ row, getValue }) {
  const name = getValue();
  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <span className="font-medium text-gray-800 dark:text-dark-100">{name}</span>
    </div>
  );
}

export function DepartmentCell({ getValue }) {
  return <TextCell getValue={getValue} />;
}

export function ButtonCell({ getValue, row }) {
  const navigate = useNavigate();
  // On click, navigate to the payslip page with the staff id.
  const handleGenerate = () => {
    // Option 1: Pass employee id in the URL
    navigate(`/tables/payslip/${row.original.StaffId}`, {
      // Optionally, you could also send the whole employee object in state:
      state: { employee: row.original },
    });
  };

  return (
    <Button color="primary" onClick={handleGenerate}>
      Generate
    </Button>
  );
}
// PropTypes
TextCell.propTypes = {
  getValue: PropTypes.func,
};

EmployeeIdCell.propTypes = {
  getValue: PropTypes.func,
};

EmployeeNameCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

DepartmentCell.propTypes = {
  getValue: PropTypes.func,
};

ButtonCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
};