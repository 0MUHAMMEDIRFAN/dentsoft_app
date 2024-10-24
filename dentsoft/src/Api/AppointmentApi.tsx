import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const createAppointment = async (payload) => {
    // const URL = API_BASE_URL + `/appointments`;
    const URL = API_BASE_URL + `/api/resource/Patient Appointment`;
    return await post(URL, payload);
};
export const getAppointmentTypes = async (sort_by = "modified", sort_order = "desc") => {
    // const URL = API_BASE_URL + `/appointments/types`;
    const URL = API_BASE_URL + `/api/resource/Appointment Type?fields=["*"]&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const deleteAppointment = async (id) => {
    // const URL = API_BASE_URL + `/appointments/${id}`;
    const URL = API_BASE_URL + `/api/resource/Patient Appointment/${id}`;
    return await remove(URL);
};
export const deleteAppointmentType = async (id) => {
    // const URL = API_BASE_URL + `/appointments/types/${id}`;
    const URL = API_BASE_URL + `/api/resource/Appointment Type/${id}`;
    return await remove(URL);
};
export const createAppointmentTypes = async (payload) => {
    // const URL = API_BASE_URL + `/appointments/types`;
    const URL = API_BASE_URL + `/api/resource/Appointment Type`;
    return await post(URL, payload);
};
export const getAppointments = async (date = "", page = 0, size = 100, sort_by = "modified", sort_order = "desc") => {
    // const URL = API_BASE_URL + `/appointments?date=${date}&page=${page}&size=${size}`;
    const URL = API_BASE_URL + `/api/resource/Patient Appointment?fields=["*"]&filters=[["Patient Appointment","appointment_date","=","${date}"]]&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const getDoctorAppointments = async (id, date = "", page = 0, size, sort_by = "modified", sort_order = "desc") => {
    // const URL = API_BASE_URL + `/appointments/doctor/${id}?date=${date}`;
    const URL = API_BASE_URL + `/api/resource/Patient Appointment?fields=["*"]&or_filters=[["Patient Appointment","practitioner","=","${id}"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&filters=[["Patient Appointment","appointment_date","=","${date}"]]&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const getPatientAppointments = async (id, date = "", page = 0, size = 100, sort_by = "modified", sort_order = "desc") => {
    // const URL = API_BASE_URL + `/appointments/patient/${id}?date=${date}&page=${page}&size=${size}`;
    const URL = API_BASE_URL + `/api/resource/Patient Appointment?fields=["*"]&or_filters=[["Patient Appointment","patient","=","${id}"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&filters=${date ? `[["Patient Appointment", "appointment_date", "=", "${date}"]]` : ""}&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};