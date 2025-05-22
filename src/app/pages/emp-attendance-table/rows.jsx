/* eslint-disable no-unused-vars */
import React from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Avatar, Input, Checkbox } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";

// ----------------------------------------------------------------------

export function TextCell({ getValue }) {
  const value = getValue();
  if (value !== null && typeof value === "object") {
    return (
      <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
        {value.data !== undefined ? value.data.toString() : JSON.stringify(value)}
      </p>
    );
  }
  return (
    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{value}</p>
  );
}

export function OTCell({ getValue, row }) {
  const [value, setValue] = React.useState(getValue() || 0);

  const handleChange = (e) => {
    const newVal = Number(e.target.value);
    setValue(newVal);
    row.original.ot = newVal; // Directly update ot field
  };

  return (
    <Input 
      size="small"
      type="number"
      min="0"
      max="24"
      value={value}
      onChange={handleChange}
      className="w-20"
    />
  );
}

export function InputCell({ getValue, row, column, table }) {
  const value = parseFloat(getValue());

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    table.options.meta.updateData(row.index, column.id, newValue);
  };

  return (
    <Input 
      size="6" 
      value={value} 
      onChange={handleChange}
      type="number"
      min="0"
      className="w-24"
    />
  );
}

export function CheckCell({ getValue, row }) {
  const attendanceStatus = getValue();  // boolean: true = absent, false = present

  const [checked, setChecked] = React.useState(attendanceStatus); 
  // checked = present → true, unchecked = absent → false

  const handleChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    row.original.attendance = newChecked; 
    // If checked (present), attendance = false (not absent)
    // If unchecked (absent), attendance = true (absent)
  };

  return (
    <div className="flex justify-center">
      <Checkbox 
        checked={checked}
        onChange={handleChange}
        title={checked ? "Present" : "Absent"}
      />
    </div>
  );
}

export function EmployeeIdCell({ index }) {
  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      {index + 1}
    </span>
  );
}

export function DateCell({ getValue }) {
  const { locale } = useLocaleContext();
  const timestamp = getValue();
  const formattedDate = dayjs(timestamp).locale(locale).format("DD MMM YYYY");
  return <p className="font-medium">{formattedDate}</p>;
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

export function StatusCell({ getValue }) {
  const status = getValue();
  const color = status === "Active" ? "green" : "red";
  return (
    <span className={`badge bg-${color}-100 text-${color}-800`}>{status}</span>
  );
}

// PropTypes
TextCell.propTypes = { getValue: PropTypes.func };
EmployeeIdCell.propTypes = { index: PropTypes.number };
DateCell.propTypes = { getValue: PropTypes.func };
EmployeeNameCell.propTypes = { row: PropTypes.object, getValue: PropTypes.func };
InputCell.propTypes = { row: PropTypes.object, getValue: PropTypes.func, field: PropTypes.string };
DepartmentCell.propTypes = { getValue: PropTypes.func };
StatusCell.propTypes = { getValue: PropTypes.func };
CheckCell.propTypes = { getValue: PropTypes.func, row: PropTypes.object };
OTCell.propTypes = { getValue: PropTypes.func, row: PropTypes.object };