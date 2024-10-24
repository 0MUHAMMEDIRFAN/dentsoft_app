import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const loginToApp = async (payload) => {
  // const URL = API_BASE_URL + `/admin/auth/login`;
  const URL = API_BASE_URL + `/api/method/login`;
  return await post(URL, payload);
};
export const generateAccessToken = async (payload) => {
  const URL = API_BASE_URL + `/admin/auth/token/refresh`;
  return await post(URL, payload);
};
export const logOut = async (payload) => {
  // const URL = API_BASE_URL + `/admin/auth/logout`;
  const URL = API_BASE_URL + `/api/method/logout`;
  return await get(URL, payload);
};
export const resetPassword = async (payload) => {
  const URL = API_BASE_URL + `/admin/auth/password/reset`;
  return await put(URL, payload);
};

