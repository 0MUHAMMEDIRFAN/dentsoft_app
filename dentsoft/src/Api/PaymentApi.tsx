import { useContext } from "react";
import Package from "../../package.json";
import { get, post, put, remove } from "./NetworkUtils";
import { AppContext } from "../Contexts/AppContext";
// export const versionString = `Version: ${Package.version} ${import.meta.env.REACT_APP_STAGE}`;

const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL;
// const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
// const { selectedPatient } = useContext(AppContext)

export const createPayment = async (payload) => {
    // const URL = API_BASE_URL + `/payments`;
    const URL = API_BASE_URL + `/api/resource/Payment Entry`;
    return await post(URL, payload);
};
export const getPatientPayments = async (patientId, search = "", page = 0, size = "",sort_by="modified",sort_order="desc") => {
    // const URL = API_BASE_URL + `/payments/patients/${patientId}?search=${search}&page=${page}&size=${size}`;
    const URL = API_BASE_URL + `/api/resource/Payment Entry?fields=["*"]&filters=[["Payment Entry","party","=","${patientId}"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&patient=${patientId}&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};
export const getPaymentInfo = async (paymentId) => {
    // const URL = API_BASE_URL + `/payments/${paymentId}`;
    const URL = API_BASE_URL + `/api/resource/Payment Entry/${paymentId}`;
    return await get(URL);
};
// export const getPaymentTotalInfo = async (patientId) => {
//     // const URL = API_BASE_URL + `/payments/${paymentId}`;
//     const URL = API_BASE_URL + `/api/resource/Sales Invoice/pendingtotal?patient=${patientId}`;
//     return await get(URL);
// };
export const getPaymentPendingTreatment = async (id, search = "", page = "", size = "",sort_by="modified",sort_order="desc") => {
    // const URL = API_BASE_URL + `/payments/pending/patients/${id}?search=${search}&page=${page}&size=${size}`;
    const URL = API_BASE_URL + `/api/resource/Sales Invoice?fields=["*"]&filters=[["Sales Invoice","patient","=","${id}"],["Sales Invoice","status","!=","Paid"],["Sales Invoice","status","!=","Cancelled"]]&limit_start=${page * size}${size ? `&limit_page_length=${size}` : ""}&order_by=${sort_by} ${sort_order}`;
    return await get(URL);
};