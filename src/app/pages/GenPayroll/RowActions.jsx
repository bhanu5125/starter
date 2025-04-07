import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "components/ui";

export function RowActions({ row }) {
  const navigate = useNavigate();

  // Handle View button click
  const handleView = () => {
    navigate(`/forms/emp1/view/${row.original.code}`); // Navigate to view page
  };

  // Handle Edit button click
  const handleEdit = () => {
    navigate(`/forms/emp1/edit/${row.original.code}`); // Navigate to edit page
  };

  return (
    <div className="flex justify-center space-x-1.5 rtl:space-x-reverse">
      {/* View Button */}
      <Button
        isIcon
        className="size-8 rounded-full"
        onClick={handleView}
      >
        <EyeIcon className="size-4.5 stroke-1" />
      </Button>

      {/* Edit Button */}
      <Button
        isIcon
        className="size-8 rounded-full"
        onClick={handleEdit}
      >
        <PencilIcon className="size-4.5 stroke-1" />
      </Button>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object.isRequired, // Row data from the table
};