import axios from "axios";
import { generateAccessToken, logOut } from "./Index";
import { generateUserAccessToken } from "./UserApi";
import { useNavigate } from "react-router-dom";

const ACCESS_TOKEN_STRING = "access_token";
const REFRESH_TOKEN_STRING = "refresh_token";
const userDetails = JSON.parse(localStorage.getItem("userDetails"))
let isRefreshingToken = false

const DEFAULT_CONFIG = {
  headers: {
    "content-type": "application/json",
  },
};

const RefreshAccessToken = async (state = false) => {
  if (state) {
    console.log("refreshing access token")
    if (userDetails) {
      isRefreshingToken = true
      try {
        const payload = { email: userDetails.email, refresh_token: window.localStorage.getItem(REFRESH_TOKEN_STRING) }
        // const result = await generateAccessToken(payload)
        const result = userDetails.name === "admin" ? await generateAccessToken(payload) : await generateUserAccessToken(payload)
        console.log(result)
        localStorage.setItem(ACCESS_TOKEN_STRING, result.access_token)
        location.reload()
      } catch (error) {
        console.log(error)
      }
      isRefreshingToken = false
    }
  }
  return <></>
}
function getCookie(cookieName) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('='); // Split cookie into name and value
    if (name === cookieName) {
      return decodeURIComponent(value); // Return the decoded value of the cookie
    }
  }
}
const NetworkErrorLogger = (error) => {
  const cookie = getCookie("user_id")
  if ((!cookie || cookie === "Guest")) {
    localStorage.clear()
    window.location.href = "/#/login"
  }
  if (error.response) {
    // When response status code is out of 2xxx range
    // console.log(error.response.data);
    console.log(error.response.status);
    if (error.response.status === 401 && error.response.data.error === "access token expired") {
      // window.error = true;
      if (window.localStorage.getItem(ACCESS_TOKEN_STRING) != null && !isRefreshingToken) {
        RefreshAccessToken(true);
        // window.localStorage.removeItem(ACCESS_TOKEN_STRING);
        // window.location.reload();
      }
      // } else if ((error.response.status === 401 && error.response.data.error === "refresh token expired") || error.response.data.error === "Unauthorize") {
    } else if ((error.response.status === 401 && error.response.data.error === "refresh token expired") || error.response.data.error === "Unauthorize") {
      localStorage.clear()
      window.location.href = "/#/login"
      window.location.reload();
    }
    const errMsg =
      error?.response?.data?.error ??
      error?.response?.data?.message ??
      error?.response?.data ??
      "Response Failed.";
    throw new Error(errMsg);
  } else if (error.request) {
    //When no response was received after request was made
    throw new Error("Request Failed.");
  } else {
    // Error
    throw new Error("Something went wrong.");
    // console.log(error.message);
  }
  return <></>
};

const setUpConfig = (isAuthenticated) => {
  if (isAuthenticated) {
    return {
      headers: {
        "content-type": "application/json",
        "access-token": window.localStorage.getItem(ACCESS_TOKEN_STRING),
      },
    };
  } else {
    return DEFAULT_CONFIG;
  }
};

const get = async (URL, responseType = "", isAuthenticated = true, getFullResult = true) => {
  try {
    const CONFIG = setUpConfig(isAuthenticated);
    const result = await axios.get(URL, {
      headers: { "x-access-token": localStorage.getItem("access_token") },
      withCredentials: true,
    }, responseType);
    if (getFullResult) {
      return result;
    } else {
      return result;
    }
  } catch (e) {
    NetworkErrorLogger(e);
  }
};

const post = async (
  URL,
  PAYLOAD = {},
  isAuthenticated = true,
  getFullResult = true
) => {
  try {
    const CONFIG = setUpConfig(isAuthenticated);
    const result = await axios.post(URL, PAYLOAD, {
      headers: {
        "x-access-token": localStorage.getItem("access_token"),
        // "X-Frappe-CSRF-Token": ""
      },
      withCredentials: true,
    });
    if (getFullResult) {
      return result.data;
    } else {
      return result.data.data;
    }
  } catch (e) {
    NetworkErrorLogger(e);
  }
};

const put = async (
  URL,
  PAYLOAD = {},
  isAuthenticated = true,
  getFullResult = true
) => {
  try {
    const CONFIG = setUpConfig(isAuthenticated);
    const result = await axios.put(URL, PAYLOAD, {
      headers: { "x-access-token": localStorage.getItem("access_token") },
      withCredentials: true,
    });
    if (getFullResult) {
      return result.data;
    } else {
      return result.data.data;
    }
  } catch (e) {
    NetworkErrorLogger(e);
  }
};
const remove = async (URL, isAuthenticated = true, getFullResult = true) => {
  // if (window.confirm("Do you want to proceed"))
  try {
    const CONFIG = setUpConfig(isAuthenticated);
    const result = await axios.delete(URL, {
      headers: { "x-access-token": localStorage.getItem("access_token") },
      withCredentials: true,
    });
    if (getFullResult) {
      return result.data;
    } else {
      return result.data.data;
    }
  } catch (e) {
    NetworkErrorLogger(e);
  }
  // else {
  //   NetworkErrorLogger({
  //     response: {
  //       status: {
  //         code: 100
  //       },
  //       data: {
  //         message: "Operation Cancelled",
  //       },
  //     },
  //   });
  // }
};

const getStageString = (apiBaseURL) => {
  if (apiBaseURL.includes("staging")) {
    return "/staging";
  }
  if (apiBaseURL.includes("dev")) {
    return "/dev";
  }
  return "";
};

const getStageStringPrefix = (apiBaseURL) => {
  if (apiBaseURL.includes("staging")) {
    return "staging.";
  }
  if (apiBaseURL.includes("dev")) {
    return "staging.";
  }
  return "";
};

const getStageStringRaw = (apiBaseURL) => {
  if (apiBaseURL.includes("staging")) {
    return "staging";
  }
  if (apiBaseURL.includes("dev")) {
    return "dev";
  }
  return "";
};

export {
  post,
  get,
  put,
  remove,
  getStageString,
  getStageStringRaw,
  getStageStringPrefix,
  RefreshAccessToken,
  NetworkErrorLogger
};
