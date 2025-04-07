
// src/components/rows.jsx
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
  const selectedMonth = row.original.selectedMonth;
  const valueObj = getValue();
  // Determine initial value for the selected month (or default to 0)
  const initialVal =
    selectedMonth && typeof valueObj === "object" ? valueObj[selectedMonth] ?? 0 : 0;
  const [value, setValue] = React.useState(initialVal);
  
  const handleChange = (e) => {
    const newVal = e.target.value;
    setValue(newVal);
    // Directly update the row's "ot" field for the selected month
    row.original.ot = { 
      ...(typeof valueObj === "object" ? valueObj : {}), 
      [selectedMonth]: newVal 
    };
  };

  return <Input size="4" value={value} onChange={handleChange} />;
}

export function InputCell({ getValue, row, field }) {
  const selectedMonth = row.original.selectedMonth;
  const valueObj = getValue();
  // Determine initial value for the selected month (or default to 0)
  const initialVal =
    selectedMonth && typeof valueObj === "object" ? valueObj[selectedMonth] ?? 0 : valueObj;
  const [value, setValue] = React.useState(initialVal);
  
  const handleChange = (e) => {
    const newVal = e.target.value;
    setValue(newVal);
    // Directly update the row's field (for example "bonus") for the selected month
    row.original[field] = { 
      ...(typeof valueObj === "object" ? valueObj : {}), 
      [selectedMonth]: newVal 
    };
  };

  return <Input size={field === "bonus" ? "6" : "3"} value={value} onChange={handleChange} />;
}

export function CheckCell({ getValue }) {
  // For this dummy checkbox, initialize from getValue or default to false.
  const initial =
    (getValue() && typeof getValue() === "object" ? getValue().data : getValue()) || false;
  const [checked, setChecked] = React.useState(initial);
  
  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <div className="flex justify-center">
      <Checkbox checked={checked} onChange={handleChange} />
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
      <Avatar
        size={9}
        name={name}
        src={row.original.avatar_img}
        classNames={{ display: "mask is-squircle rounded-none text-sm" }}
      />
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
CheckCell.propTypes = { getValue: PropTypes.func };
