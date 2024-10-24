import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const patientId = ""

export const markTeethAsPermenent = async (payload, id) => {
    // const URL = API_BASE_URL + `/dental/conditions/patient/${id}/permanent`;
    const URL = API_BASE_URL + `/dental/conditions/patient/${id}/permanent`;
    return await put(URL, payload);
};
export const markTeethAsPrimary = async (payload, id) => {
    // const URL = API_BASE_URL + `/dental/conditions/patient/${id}/primary`;
    const URL = API_BASE_URL + `/dental/conditions/patient/${id}/primary`;
    return await put(URL, payload);
};
export const getAllDentalCondition = async () => {
    // const URL = API_BASE_URL + `/dental/conditions`;
    // const URL = API_BASE_URL + `/dental/conditions`;
    // return await get(URL);
};
export const deleteDentalCondition = async (id) => {
    // const URL = API_BASE_URL + `/dental/conditions/${id}`;
    const URL = API_BASE_URL + `/dental/conditions/${id}`;
    return await remove(URL);
};
export const editDentalCondition = async (payload, id) => {
    // const URL = API_BASE_URL + `/dental/conditions/${id}`;
    const URL = API_BASE_URL + `/dental/conditions/${id}`;
    return await put(URL, payload);
};
export const createDentalCondition = async (payload) => {
    // const URL = API_BASE_URL + `/dental/conditions/`;
    const URL = API_BASE_URL + `/dental/conditions/`;
    return await post(URL, payload);
};
export const getSpecificDentalCondition = async (id) => {
    // const URL = API_BASE_URL + `/dental/conditions/${id}`;
    const URL = API_BASE_URL + `/dental/conditions/${id}`;
    return await get(URL);
};
export const getDentalChart = async (id) => {
    // const URL = API_BASE_URL + `/dental/patient/${id}`;
    const URL = API_BASE_URL + `/api/resource/Patient Teeth?fields=["*"]&limit_page_length=`;
    return await get(URL);
};
export const createPatientDentalCondition = async (payload) => {
    // const URL = API_BASE_URL + `/dental/conditions/patient`;
    const URL = API_BASE_URL + `/dental/conditions/patient`;
    return await post(URL, payload);
};