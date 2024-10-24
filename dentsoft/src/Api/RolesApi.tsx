import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const id = ""

export const updateRole = async (payload, id) => {
    // const URL = API_BASE_URL + `/roles/${id}`;
    const URL = API_BASE_URL + `/api/resource/Role Profile/${id}`;
    return await put(URL, payload);
};
export const getRoles = async (search = "", page = 0, size = "",sort_by="modified",sort_order="desc") => {
    // const URL = API_BASE_URL + `/roles?search=${search}&page=${page}&size=${size}`;
    const URL = API_BASE_URL + `/api/resource/Role Profile?fields=["*"]&or_filters=[["Role Profile","role_profile","like","%${search}%"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const getPermissions = async () => {
    // const URL = API_BASE_URL + `/roles/permissions`;
    const URL = API_BASE_URL + `/api/resource/Role?fields=["*"]&limit_page_length=`;
    return await get(URL);
};
export const createRole = async (payload) => {
    // const URL = API_BASE_URL + `/roles`;
    const URL = API_BASE_URL + `/api/resource/Role Profile`;
    return await post(URL, payload);
};
export const getRoleDetails = async () => {
    // const URL = API_BASE_URL + `/roles/${id}`;
    const URL = API_BASE_URL + `/api/resource/Role/${id}?fields=["*"]`;
    return await get(URL);
};
export const deleteRole = async (id) => {
    // const URL = API_BASE_URL + `/roles/${id}`;
    const URL = API_BASE_URL + `/api/resource/Role/${id}`;
    return await remove(URL);
};