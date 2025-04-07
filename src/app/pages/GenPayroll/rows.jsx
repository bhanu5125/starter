/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
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


TextCell.propTypes = { getValue: PropTypes.func };
EmployeeIdCell.propTypes = { index: PropTypes.number };
EmployeeNameCell.propTypes = { row: PropTypes.object, getValue: PropTypes.func };
DepartmentCell.propTypes = { getValue: PropTypes.func };
