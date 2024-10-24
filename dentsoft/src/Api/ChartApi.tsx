import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const createPatientDocument = async (payload) => {
    const URL = API_BASE_URL + `/documents/patient`;
    return await post(URL, payload);
};

export const getDocumentsOverview = async (start_date = "", end_date = "", doctor_id = "", patient_id = "", sort_by = "modified", sort_order = "desc") => {
    const URL = API_BASE_URL + `/documents/overview?start_date=${start_date}&end_date=${end_date}&doctor_id=${doctor_id}&patient_id=${patient_id}&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const getAppointmentsOverview = async (start_date = "", end_date = "", doctor_id = "", patient_id = "", type = "", status = "", mode = "", sort_by = "modified", sort_order = "desc") => {
    const URL = API_BASE_URL + `/appointments/overview?start_date=${start_date}&end_date=${end_date}&doctor_id=${doctor_id}&patient_id=${patient_id}&type=${type}&status=${status}&mode=${mode}&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const getPaymentsOverview = async (start_date = "", end_date = "", doctor_id = "", patient_id = "", type = "", status = "", mode = "", sort_by = "modified", sort_order = "desc") => {
    const URL = API_BASE_URL + `/payments/overview?start_date=${start_date}&end_date=${end_date}&doctor_id=${doctor_id}&patient_id=${patient_id}&type=${type}&status=${status}&mode=${mode}&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const getTreatmentsOverview = async (start_date = "", end_date = "", doctor_id = "", patient_id = "", type = "", status = "", sort_by = "modified", sort_order = "desc") => {
    const URL = API_BASE_URL + `/treatments/overview?start_date=${start_date}&end_date=${end_date}&doctor_id=${doctor_id}&patient_id=${patient_id}&type=${type}&status=${status}&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};