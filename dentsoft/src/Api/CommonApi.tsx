import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const getFile = async (path = "", responseType = "") => {
    const URL = API_BASE_URL + `/file?file_path=${path}`;
    return await get(URL,responseType);
};
export const fileUpload = async (payload) => {
    const URL = API_BASE_URL + `/file/upload`;
    return await post(URL, payload);
};