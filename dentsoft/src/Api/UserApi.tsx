import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const userId = ""

export const registerUser = async (payload) => {
    // const URL = API_BASE_URL + `/users/register`;
    const URL = API_BASE_URL + `/api/resource/User`;
    return await post(URL, payload);
};
export const loginUser = async (payload) => {
    // const URL = API_BASE_URL + `/users/auth/login`;
    const URL = API_BASE_URL + `/api/method/login`;
    return await post(URL, payload);
};
export const getUsers = async (search = "", page = 0, size = "", active = "", role = "",sort_by="modified",sort_order="desc") => {
    // const URL = API_BASE_URL + `/users?search=${search}&page=${page}&size=${size}${active ? "&active=" + active : ""}${role ? "&role=" + role : ""}`;
    const URL = API_BASE_URL + `/api/resource/User?fields=["*"]&or_filters=[["User","full_name","like","%${search}%"],["User","phone","like","%${search}%"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&filters=[${active === "true" ? `["User","enabled","=","1"]` : active === "false" ? `["User","enabled","=","0"]` : ""}${role ? `${active ? "," : ""}["Has Role","role","=","${role}"]` : ""}]&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const getUser = async (id) => {
    // const URL = API_BASE_URL + `/users/${id}`;
    const URL = API_BASE_URL + `/api/resource/User/${id}?fields=["*"]`;
    return await get(URL);
};
export const updateUser = async (payload, id) => {
    // const URL = API_BASE_URL + `/users/${id}`;
    const URL = API_BASE_URL + `/api/resource/User/${id}`;
    return await put(URL, payload);
};
export const getDoctors = async (search = "", page = 0, size = "", active = "", role = "",sort_by="modified",sort_order="desc") => {
    // const URL = API_BASE_URL + `/users?search=${search}&page=${page}&size=${size}${active ? "&active=" + active : ""}${role ? "&role=" + role : ""}`;
    const URL = API_BASE_URL + `/api/resource/Healthcare Practitioner?fields=["*"]&or_filters=[["Healthcare Practitioner","practitioner_name","like","%${search}%"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&filters=[${active === "true" ? `["Healthcare Practitioner","status","=","Active"]` : active === "false" ? `["Healthcare Practitioner","status","=","Disabled"]` : ""}]&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const resetUserPassword = async (payload) => {
    // const URL = API_BASE_URL + `/users/auth/password/reset`;
    const URL = API_BASE_URL + `/users/auth/password/reset`;
    return await put(URL, payload);
};
export const generateUserAccessToken = async (payload) => {
    // const URL = API_BASE_URL + `/users/auth/token/refresh`;
    const URL = API_BASE_URL + `/users/auth/token/refresh`;
    return await post(URL, payload);
};
export const createReceptioninstNote = async (payload) => {
    // const URL = API_BASE_URL + `/users/notes`;
    const URL = API_BASE_URL + `/api/resource/Note`;
    return await post(URL, payload);
};
export const userLogout = async (payload) => {
    // const URL = API_BASE_URL + `users/auth/logout`;
    const URL = API_BASE_URL + `/api/method/logout`;
    return await post(URL, payload);
};
export const getReceptioninstNotes = async (id = "", search = "", page = 0, size = 10,sort_by="modified",sort_order="desc") => {
    // const URL = API_BASE_URL + `/users/${id}/notes?search=${search}`;
    const URL = API_BASE_URL + `/api/resource/Note?fields=["*"]&or_filters=[["Note","title","like","%${search}%"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const getActivity = async (date = "", page = "", size = "",sort_by="modified",sort_order="desc") => {
    // const URL = API_BASE_URL + `/users/activity?page=${page}limit_page_lengthsize=${size}${date ? "&date=" + date : ""}`;
    const URL = API_BASE_URL + `/api/resource/Activity Log?fields=["*"]&or_filters=[["Activity Log","communication_date","Between",["${date}","${date}"]]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};