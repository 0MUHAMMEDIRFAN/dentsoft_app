import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const createForm = async (payload) => {
    // const URL = API_BASE_URL + `/medical/forms`;
    const URL = API_BASE_URL + `/api/resource/Patient Medical Record`;
    return await post(URL, payload);
};
export const getFormWithId = async (id) => {
    // const URL = API_BASE_URL + `/medical/forms/${id}`;
    const URL = API_BASE_URL + `/medical/forms/${id}`;
    return await get(URL);
};
export const getAllINputFields = async () => {
    // const URL = API_BASE_URL + `/medical/forms/fields/types`;
    const URL = API_BASE_URL + `/medical/forms/fields/types`;
    return await get(URL);
};
export const getAllForms = async (patient = "", search = "", page = 0, size = "") => {
    // const URL = API_BASE_URL + `/medical/forms?type=${type}&search=${search}&page=${page}&size=${size}`;
    const URL = API_BASE_URL + `/api/resource/Patient Medical Record?fields=["*"]&or_filters=[["Patient Medical Record","patient","=","%${patient}%"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}`;
    return await get(URL);
};
export const updateForm = async (payload, id) => {
    // const URL = API_BASE_URL + `/medical/forms/${id}`;
    const URL = API_BASE_URL + `/api/resource/Patient Medical Record/${id}`;
    return await put(URL, payload);
};
export const generatePatientResponseId = async (payload) => {
    // const URL = API_BASE_URL + `/medical/forms/send`;
    const URL = API_BASE_URL + `/medical/forms/send`;
    return await post(URL, payload);
}
export const createPatientResponse = async (payload) => {
    // const URL = API_BASE_URL + `/medical/forms/patient/response`;
    const URL = API_BASE_URL + `/medical/forms/patient/response`;
    return await post(URL, payload);
};
export const getPatientAllFormResponse = async (id, search = "", page = 0, size = "") => {
    // const URL = API_BASE_URL + `/medical/forms/patient/${id}?search=${search}&page=${page}&size=${size}`;
    const URL = API_BASE_URL + `/medical/forms/patient/${id}?search=${search}&page=${page}&size=${size}`;
    return await get(URL);
};
export const getPatientFormResponse = async (id) => {
    // const URL = API_BASE_URL + `/forms/patient-forms/response/${id}`;
    const URL = API_BASE_URL + `/forms/patient-forms/response/${id}`;
    return await get(URL);
};