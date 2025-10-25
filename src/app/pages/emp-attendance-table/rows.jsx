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

export function CheckCell({ getValue, row, column, table }) {
  const attendanceStatus = getValue();  // boolean: true = present, false = absent

  const handleChange = () => {
    const newChecked = !attendanceStatus;
    // Update the data in the table using the meta updateData function
    table.options.meta?.updateData(row.index, column.id, newChecked);
  };

  return (
    <div className="flex justify-center">
      <Checkbox 
        checked={attendanceStatus}
        onChange={handleChange}
        title={attendanceStatus ? "Present" : "Absent"}
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

export function OTIndicatorCell({ row }) {
  const isOT = row.original.isOT;
  
  if (!isOT) {
    return null;
  }
  
  return (
    <div className="flex justify-center">
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
        OT
      </span>
    </div>
  );
}

// PropTypes
TextCell.propTypes = { getValue: PropTypes.func };
EmployeeIdCell.propTypes = { index: PropTypes.number };
DateCell.propTypes = { getValue: PropTypes.func };
EmployeeNameCell.propTypes = { row: PropTypes.object, getValue: PropTypes.func };
DepartmentCell.propTypes = { getValue: PropTypes.func };
StatusCell.propTypes = { getValue: PropTypes.func };
CheckCell.propTypes = { getValue: PropTypes.func, row: PropTypes.object, column: PropTypes.object, table: PropTypes.object };
OTIndicatorCell.propTypes = { row: PropTypes.object };