// rows.jsx
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Avatar } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { Input, Checkbox } from "components/ui";

// ----------------------------------------------------------------------

export function TextCell({ getValue }) {
  return <p className="text-sm+ font-medium text-gray-800 dark:text-dark-100">{getValue()}</p>;
}

export function InputCell({ getValue, row, field }) {
  const selectedMonth = row.original.selectedMonth;
  const value = getValue();
  let displayValue;
  if (selectedMonth) {
    displayValue = value?.[selectedMonth] ?? 0;
  } else {
    displayValue = JSON.stringify(value);
  }

  return <Input size={field === "bonus" ? "6" : "3"} value={displayValue} />;
}

export function CheckCell({getValue}) {
  return <div className="flex justify-center">
      <Checkbox checked={getValue()} />
      </div>;
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
      <Avatar
        size={9}
        name={name}
        src={row.original.avatar_img}
        classNames={{
          display: "mask is-squircle rounded-none text-sm",
        }}
      />
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

InputCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

DepartmentCell.propTypes = {
  getValue: PropTypes.func,
};

StatusCell.propTypes = {
  getValue: PropTypes.func,
};