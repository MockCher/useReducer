import { useEffect, useReducer } from "react";
import "./styles.css";
import { login } from "./utils";

function loginReducer(state, action) {
  switch (action.type) {
    case "field": {
      return {
        ...state,
        [action.fieldName]: action.payload
      };
    }
    case "login": {
      return {
        ...state,
        error: "",
        isLoading: true
      };
    }
    case "success": {
      return {
        ...state,
        isLoggedIn: true,
        isLoading: false
      };
    }
    case "error": {
      return {
        ...state,
        error: "Incorrect username or password!",
        isLoggedIn: false,
        isLoading: false,
        username: "",
        password: ""
      };
    }
    case "logOut": {
      return initialState;
    }
    default:
      return state;
  }
}

const initialState = {
  username: "",
  password: "",
  isLoading: false,
  error: "",
  isLoggedIn: false
};

export default function App() {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const { username, password, isLoading, error, isLoggedIn } = state;

  const onSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: "login" });

    try {
      await login({ username, password });
      dispatch({ type: "success" });
    } catch (error) {
      dispatch({ type: "error" });
    }
  };

  return (
    <div className="App">
      <div className="form-wrapper">
        {isLoggedIn ? (
          <>
            <h1>Welcome {username}!</h1>
            <button onClick={() => dispatch({ type: "logOut" })}>
              Log Out
            </button>
          </>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            {error && <p className="error-message">{error}</p>}
            <Heading title="Login" />
            <Formfield
              label="Username"
              value={username}
              onChange={(e) =>
                dispatch({
                  type: "field",
                  fieldName: "username",
                  payload: e.currentTarget.value
                })
              }
            />

            <Formfield
              secure
              label="Password"
              value={password}
              onChange={(e) =>
                dispatch({
                  type: "field",
                  fieldName: "password",
                  payload: e.currentTarget.value
                })
              }
            />
            <button
              className="btn btn-success m-1"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function Heading({ title }) {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}

export function Formfield({
  label,
  onChange,
  value,
  errorMessage,
  secure = false
}) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <input
        type={secure ? "password" : ""}
        value={value}
        onChange={onChange}
      />
      <p className="error-message">{errorMessage}</p>
    </div>
  );
}
