import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const schemeId = ""

export const getScheme = async (id) => {
    // const URL = API_BASE_URL + `/schemes/${schemeId}`;
    const URL = API_BASE_URL + `/api/resource/Payment Term/${id}`;
    return await get(URL);
};

export const createNewScheme = async (payload) => {
    // const URL = API_BASE_URL + `/schemes`;
    const URL = API_BASE_URL + `/api/resource/Payment Term`;
    return await post(URL, payload);
};

export const deleteScheme = async (id) => {
    // const URL = API_BASE_URL + `/schemes/${id}`;
    const URL = API_BASE_URL + `/api/resource/Payment Term/${id}`;
    return await remove(URL);
};

export const getSchemes = async (search = "", page = 0, size = "", active = "",sort_by="modified",sort_order="desc") => {
    // const URL = API_BASE_URL + `/schemes?search=${search}&page=${page}&size=${size}${active ? "&active=" + active : ""}`;
    const URL = API_BASE_URL + `/api/resource/Payment Term?fields=["*"]&or_filters=[["Payment Term","name","like","%${search}%"],["Payment Term","discount","like","%${search}%"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&filters=[${active === "true" ? `["Payment Term","custom_disabled","=","0"]` : active === "false" ? `["Payment Term","custom_disabled","=","1"]` : ""}]&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};

export const updateScheme = async (payload, id) => {
    // const URL = API_BASE_URL + `/schemes/${id}`;
    const URL = API_BASE_URL + `/api/resource/Payment Term/${id}`;
    return await put(URL, payload);
};