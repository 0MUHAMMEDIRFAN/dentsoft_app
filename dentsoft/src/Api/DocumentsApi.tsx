import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const createDocument = async (payload) => {
    const URL = API_BASE_URL + `/documents`;
    return await post(URL, payload);
};
export const getAllDocuments = async (search = "", page = "", size = "") => {
    const URL = API_BASE_URL + `/documents?search=${search}&page=${page}&size=${size}`;
    return await get(URL);
};
export const getDocument = async (id) => {
    const URL = API_BASE_URL + `/documents/${id}`;
    return await get(URL);
};
export const updateDocument = async (payload, id) => {
    const URL = API_BASE_URL + `/documents/${id}`;
    return await put(URL, payload);
};
export const deleteDocument = async (id) => {
    const URL = API_BASE_URL + `/documents/${id}`;
    return await remove(URL);
};