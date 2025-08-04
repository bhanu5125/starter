// Import Dependencies
import PropTypes from "prop-types";

// ----------------------------------------------------------------------

export function Divider() {
  return (
    <div className="my-2 h-px w-full bg-gray-200 dark:bg-dark-600/80" />
  );
}

Divider.propTypes = {
  id: PropTypes.string,
};