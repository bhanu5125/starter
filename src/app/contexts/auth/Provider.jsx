/* eslint-disable no-unused-vars */
// app/contexts/auth/AuthProvider.js
import { useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "utils/axios";
import { isTokenValid, setSession } from "utils/jwt";
import { AuthContext } from "./context";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  isSecretKeyVerified: localStorage.getItem('isSecretKeyVerified') === 'true' || false,
  errorMessage: null,
  user: null,
};

const reducerHandlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    const isSadmin = user?.username?.toLowerCase() === 'sadmin';
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      isSecretKeyVerified: isSadmin 
        ? localStorage.getItem('isSecretKeyVerified') === 'true'
        : true,
      user,
    };
  },

  LOGIN_REQUEST: (state) => ({
    ...state,
    isLoading: true,
    errorMessage: null,
  }),

  LOGIN_SUCCESS: (state, action) => {
    const { user } = action.payload;
    const isSadmin = user?.username?.toLowerCase() === 'sadmin';
    localStorage.setItem('username', user.username);
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      isSecretKeyVerified: isSadmin 
        ? localStorage.getItem('isSecretKeyVerified') === 'true'
        : true,
      user,
    };
  },

  LOGIN_ERROR: (state, action) => ({
    ...state,
    errorMessage: action.payload.errorMessage,
    isLoading: false,
  }),

  SECRET_KEY_VERIFIED: (state) => {
    localStorage.setItem('isSecretKeyVerified', 'true');
    return {
      ...state,
      isSecretKeyVerified: true,
    };
  },

  LOGOUT: (state) => {
    localStorage.removeItem('isSecretKeyVerified');
    return {
      ...state,
      isAuthenticated: false,
      user: null,
      isSecretKeyVerified: false,
    };
  },
};

const reducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (authToken && isTokenValid(authToken)) {
          setSession(authToken);
          const response = await axios.get("https://tms-backend-three.vercel.app/user/profile");
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user: response.data.user,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };
    initialize();
  }, []);

  const login = async ({username, password}) => {
    dispatch({ type: "LOGIN_REQUEST" });
    try {
      const response = await axios.post("https://tms-backend-three.vercel.app/api/login", {username, password});
      setSession(response.data.authToken);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: response.data.user },
      });
    } catch (err) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: { errorMessage: err.response?.data?.message || "Login failed" },
      });
    }
  };

  const verifySecretKey = async (secretKey) => {
    try {
      const response = await axios.post("https://tms-backend-three.vercel.app/api/verify-secret", { secretKey });
      if (response.data === "SMS") {
        dispatch({ type: "SECRET_KEY_VERIFIED" });
        return true;
      }
      throw new Error("Invalid secret key");
    } catch (err) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: { errorMessage: "Invalid secret key" },
      });
      return false;
    }
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
        verifySecretKey,
      }}
    >
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};