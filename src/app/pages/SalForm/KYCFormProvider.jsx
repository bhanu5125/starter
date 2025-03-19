// KYCFormProvider.jsx
import PropTypes from "prop-types";
import { useReducer } from "react";
import { KYCFormContextProvider } from "./KYCFormContext";

const initialState = {
  formData: {
    SalData: {
      Basic:"",
      PF:"",
      TotalDays:"",
      HRA:"",
      ESI:""

    }
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case "SET_STEP_STATUS":
      return {
        ...state,
        stepStatus: {
          ...state.stepStatus,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export function KYCFormProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <KYCFormContextProvider value={value}>{children}</KYCFormContextProvider>
  );
}

KYCFormProvider.propTypes = {
  children: PropTypes.node,
};