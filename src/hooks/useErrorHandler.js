// Import Dependencies
import { useCallback } from "react";
import { toast } from "sonner";

/**
 * Custom hook for handling API errors and displaying user-friendly messages
 * @returns {Function} handleError - Function to handle and display errors
 */
export function useErrorHandler() {
  const handleError = useCallback((error, customMessage = null) => {
    console.error("Error occurred:", error);

    let errorMessage = customMessage || "An unexpected error occurred. Please try again.";

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          errorMessage = data?.message || "Invalid request. Please check your input.";
          break;
        case 401:
          errorMessage = "Unauthorized. Please log in again.";
          break;
        case 403:
          errorMessage = "Access denied. You don't have permission to perform this action.";
          break;
        case 404:
          errorMessage = data?.message || "The requested resource was not found.";
          break;
        case 409:
          errorMessage = data?.message || "A conflict occurred. The resource may already exist.";
          break;
        case 422:
          errorMessage = data?.message || "Validation failed. Please check your input.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        case 502:
          errorMessage = "Bad gateway. The server is temporarily unavailable.";
          break;
        case 503:
          errorMessage = "Service unavailable. Please try again later.";
          break;
        default:
          errorMessage = data?.message || `Error ${status}: ${error.message}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response from server. Please check your internet connection.";
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message || errorMessage;
    }

    // Display error toast
    toast.error(errorMessage, {
      duration: 5000,
      className: "error-toast",
    });

    return errorMessage;
  }, []);

  return { handleError };
}
