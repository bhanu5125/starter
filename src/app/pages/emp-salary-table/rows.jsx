/* eslint-disable no-unused-vars */
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Avatar } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { Input, Checkbox } from "components/ui";
import { useState } from "react";

// ----------------------------------------------------------------------

export function TextCell({ getValue }) {
  return <p className="text-sm+ font-medium text-gray-800 dark:text-dark-100">{getValue()}</p>;
}

export function SalaryInputCell({ getValue, row, column, table }) {
  const initialValue = getValue() || 0;
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    const newValue = parseFloat(value) || 0;
    table.options.meta.updateData(row.index, column.id, newValue);
  };

  return (
    <Input 
      size="6" 
      value={value} 
      onChange={handleChange}
      onBlur={handleBlur}
      type="number"
      min="0"
      className="w-24"
    />
  );
}

export function PfEsiInputCell({ getValue, row, column, table }) {
  const value = getValue() === 1;

  const handleChange = () => {
    table.options.meta.updateData(row.index, column.id, value ? 0 : 1);
  };

  return (
    <div className="flex justify-center">
      <Checkbox
        checked={value}
        onChange={handleChange}
        title={value ? 1 : 0}
      />
    </div>
  );
}

export function TdsInputCell({ getValue, row, column, table }) {
  const initialValue = getValue() || 0;
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    const newValue = parseFloat(value) || 0;
    table.options.meta.updateData(row.index, column.id, newValue);
  };

  return (
    <Input 
      size="6" 
      value={value} 
      onChange={handleChange}
      onBlur={handleBlur}
      type="number"
      className="w-20"
    />
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
  const date = dayjs(timestamp).locale(locale).format("DD MMM YYYY");
  return <p className="font-medium">{date}</p>;
}

export function EmployeeNameCell({ row, getValue }) {
  const name = getValue();
  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <span className="font-medium text-gray-800 dark:text-dark-100">
        {name}
      </span>
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
    <span className={`badge bg-${color}-100 text-${color}-800`}>
      {status}
    </span>
  );
}

// PropTypes
TextCell.propTypes = {
  getValue: PropTypes.func,
};

EmployeeIdCell.propTypes = {
  getValue: PropTypes.func,
};

DateCell.propTypes = {
  getValue: PropTypes.func,
};

EmployeeNameCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

SalaryInputCell.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
  getValue: PropTypes.func,
};

PfEsiInputCell.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
  getValue: PropTypes.func,
};

TdsInputCell.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
  getValue: PropTypes.func,
};

DepartmentCell.propTypes = {
  getValue: PropTypes.func,
};

StatusCell.propTypes = {
  getValue: PropTypes.func,
};