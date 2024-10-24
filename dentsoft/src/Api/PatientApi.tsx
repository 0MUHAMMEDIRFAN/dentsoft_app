import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;


export const getAllPatients = async (search = "", page = 0, size = "", sort_by = "modified", sort_order = "desc") => {
  // const URL = API_BASE_URL + `/patients?search=${search}&page=${page}&size=${size}`;
  const URL = API_BASE_URL + `/api/resource/Patient?fields=["*"]&or_filters=[["Patient","patient_name","like","%${search}%"],["Patient","phone","like","%${search}%"],["Patient","mobile","like","%${search}%"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&order_by=${sort_by} ${sort_order}`;
  return await get(URL);
};
export const createDoctorNote = async (payload) => {
  // const URL = API_BASE_URL + `/patients/doctor/notes`;
  const URL = API_BASE_URL + `/api/resource/Clinical Note`;
  return await post(URL, payload);
};
export const getPatient = async (patientId) => {
  // const URL = API_BASE_URL + `/patients/${patientId}`;
  const URL = API_BASE_URL + `/api/resource/Patient/${patientId}`;
  return await get(URL);
};
export const createPatient = async (payload) => {
  const URL = API_BASE_URL + `/api/resource/Patient`;
  return await post(URL, payload);
};
export const updatePatient = async (payload, patientId) => {
  // const URL = API_BASE_URL + `/patients/${patientId}`;
  const URL = API_BASE_URL + `/api/resource/Patient/${patientId}`;
  return await put(URL, payload);
};
export const getAllDoctorNote = async (patientId, page, size = "", sort_by = "modified", sort_order = "desc") => {
  // const URL = API_BASE_URL + `/patients/${patientId}/doctor/notes`;
  const URL = API_BASE_URL + `/api/resource/Clinical Note?fields=["*"]&filters=[["Clinical Note","patient","=","${patientId}"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&order_by=${sort_by} ${sort_order}`;
  return await get(URL);
};