import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const id = ""

export const getTreatmentDetails = async (id) => {
    // const URL = API_BASE_URL + `/treatments/${id}`;
    const URL = API_BASE_URL + `/api/resource/Clinical Procedure Template/${id}`;
    return await get(URL);
};
export const updateTreatment = async (payload, id) => {
    // const URL = API_BASE_URL + `/treatments/${id}`;
    const URL = API_BASE_URL + `/api/resource/Clinical Procedure Template/${id}`;
    return await put(URL, payload);
};
export const calculateTreatmentAmount = async (payload) => {
    // const URL = API_BASE_URL + `/treatments/patient/treatment-amount`;
    const URL = API_BASE_URL + `/treatments/patient/treatment-amount`;
    return await post(URL, payload);
};
export const getAllTreatments = async (search = "", page = 0, size = "", active = "",sort_by="modified",sort_order="desc") => {
    // const URL = API_BASE_URL + `/treatments?search=${search}&page=${page}&size=${size}${active ? "&active=" + active : ""}`;
    const URL = API_BASE_URL + `/api/resource/Clinical Procedure Template?fields=["*"]&or_filters=[["Clinical Procedure Template","template","like","%${search}%"],["Clinical Procedure Template","item_code","like","%${search}%"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&filters=[${active === "true" ? `["Clinical Procedure Template","disabled","=","0"]` : active === "false" ? `["Clinical Procedure Template","disabled","=","1"]` : ""}]&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const createTreatment = async (payload) => {
    // const URL = API_BASE_URL + `/treatments`;
    const URL = API_BASE_URL + `/api/resource/Clinical Procedure Template`;
    return await post(URL, payload);
};
export const getPatientTreatment = async (id, search, page = 0, size = "",sort_by="modified",sort_order="desc") => {
    // const URL = API_BASE_URL + `/treatments/patient/${id}`;
    const URL = API_BASE_URL + `/api/resource/Clinical Procedure?fields=["*"]&filters=[["Clinical Procedure","patient","=","${id}"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const deleteTreatment = async (id) => {
    // const URL = API_BASE_URL + `/treatments/${id}`;
    const URL = API_BASE_URL + `/treatments/${id}`;
    return await remove(URL);
};
export const createPatientTreatment = async (payload) => {
    // const URL = API_BASE_URL + `/treatments/patient`;
    const URL = API_BASE_URL + `/api/resource/Clinical Procedure`;
    return await post(URL, payload);
};
export const updatePatientTreatment = async (payload, id) => {
    // const URL = API_BASE_URL + `/treatments/patient/${id}`;
    const URL = API_BASE_URL + `/treatments/patient/${id}`;
    return await put(URL, payload);
};