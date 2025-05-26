import { createContext, useContext, useState } from "react";
import { getAllPatients } from "../Api/PatientApi";
import { ToastContext } from "./ToastContext";
import { getAppointmentTypes, getAppointments, getDoctorAppointments, getPatientAppointments } from "../Api/AppointmentApi";
import { AppContext } from "./AppContext";
import { getFile } from "../Api/CommonApi";
import { getDoctors, getUser, getUsers } from "../Api/UserApi";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { logOut } from "../Api/Index";
import { getPatientList } from "../hooks/usePatient";
import { getDoctorList } from "../hooks/useDoctor";
import { useFrappeAuth } from "frappe-react-sdk";
import { getPatientAppointmentList, getPatientAppointmentTypeList } from "../hooks/usePatientAppointment";

export const ApiContext = createContext({})

export const ApiContextProvider = ({ children }) => {
    const { notify } = useContext(ToastContext)
    const navigate = useNavigate()
    const { userDetails, selectedPatient, deselectPatient, searchValue } = useContext(AppContext)
    const [profilePicture, setProfilePicture] = useState("")
    const [profilePictureLoading, setProfilePictureLoading] = useState("Loading")
    const [patientsLoading, setPatientsLoading] = useState("Loaded")

    const [patientPage, setPatientPage] = useState(1)
    const [topbarDate, setTopbarDate] = useState(false ? "2024-01-29" : moment().format("YYYY-MM-DD"));
    // const [patients, setPatients] = useState([])
    // const [appointmentTypes, setAppointmentTypes] = useState([])
    // const [appointments, setAppointments] = useState(true ? [] : [
    //     {
    //         id: "121313132",
    //         doctor: {
    //             name: "testing doc",
    //             id: "1213122"
    //         },
    //         appointment_type: {
    //             name: "dent",
    //             color_code: "#CBAF96"
    //         },
    //         patient: {
    //             name: "khalid",
    //             id: "213123",
    //             patient_no: "1",
    //         },
    //         doctor_id: "123123",
    //         appointment_date: "2024-01-29T06:30:00.000Z",
    //         start_time: "2024-01-29T05:30:00.000Z",
    //         end_time: "2024-01-29T07:30:00.000Z",
    //     },
    //     {
    //         id: "12131313sa2",
    //         doctor: {
    //             name: "testing doc",
    //             id: "1213122"
    //         },
    //         appointment_type: {
    //             name: "dent",
    //             color_code: "#9E97E4"
    //         },
    //         patient: {
    //             name: "khalid",
    //             id: "213123",
    //             patient_no: "2",
    //         },
    //         doctor_id: "123123",
    //         appointment_date: "2024-01-29T06:30:00.000Z",
    //         start_time: "2024-01-29T04:30:00.000Z",
    //         end_time: "2024-01-29T05:40:00.000Z",
    //     },
    //     {
    //         id: "12321212",
    //         doctor: {
    //             name: "testing doc",
    //             id: "1213122"
    //         },
    //         appointment_type: {
    //             name: "dent",
    //             color_code: "#D57770"
    //         },
    //         patient: {
    //             name: "khalid",
    //             id: "213123",
    //             patient_no: "3",
    //         },
    //         doctor_id: "123123",
    //         appointment_date: "2024-01-29T06:30:00.000Z",
    //         start_time: "2024-01-29T06:30:00.000Z",
    //         end_time: "2024-01-29T07:30:00.000Z",
    //     },
    //     {
    //         id: "121313asa132",
    //         doctor: {
    //             name: "testing doc",
    //             id: "1213122"
    //         },
    //         appointment_type: {
    //             name: "dent",
    //             color_code: "#0000FF"
    //         },
    //         patient: {
    //             name: "khalid",
    //             id: "213123",
    //             patient_no: "4",
    //         },
    //         doctor_id: "123123",
    //         appointment_date: "2024-01-29T06:30:00.000Z",
    //         start_time: "2024-01-29T07:00:00.000Z",
    //         end_time: "2024-01-29T08:30:00.000Z",
    //     },
    //     {
    //         id: "1212",
    //         doctor: {
    //             name: "doc",
    //             id: "1213122"
    //         },
    //         appointment_type: {
    //             name: "dent",
    //             color_code: "#4285F4"
    //         },
    //         patient: {
    //             name: "khalid",
    //             id: "213123",
    //             patient_no: "5",
    //         },
    //         doctor_id: "123123",
    //         appointment_date: "2024-01-29T06:30:00.000Z",
    //         start_time: "2024-01-29T07:30:00.000Z",
    //         end_time: "2024-01-29T08:00:00.000Z",
    //     },
    // ])
    // const [doctors, setDoctors] = useState(true ? [{}, {}] : [
    //     {
    //         name: "doc irfan",
    //         id: "12312412",
    //     },
    //     {
    //         name: "testing doc",
    //         id: "12312412",
    //     },
    //     {
    //         name: "doctor",
    //         id: "12312412",
    //     },
    //     {
    //         name: "doc",
    //         id: "12312412",
    //     },
    //     {
    //         name: "doac",
    //         id: "12312412",
    //     },
    //     {
    //         name: "doca",
    //         id: "12312412",
    //     },
    //     {
    //         name: "doaac",
    //         id: "12312412",
    //     },
    // ])
    const [backDoctors, setBackDoctors] = useState([])
    const [calendarLoaded, setCalendarLoaded] = useState("loaded");
    const [doctorsLoaded, setDoctorsLoaded] = useState("loaded");

    const { logout } = useFrappeAuth()
    const loadProfilePicture = async () => {
        try {
            if (userDetails?.profile_photo?.path) {
                setProfilePictureLoading("Loading")
                const result = await getFile(userDetails?.profile_photo?.path)
                // console.log(result)
                setProfilePicture(result.request?.responseURL);
            } else {
                setProfilePicture("");
            }
            setProfilePictureLoading("Loaded")
        } catch (error) {
            if (error.message === "File not found") {
                setProfilePictureLoading("Missing")
            } else {
                console.log(error.message + "Profile picture error")
                setProfilePictureLoading("Error")
            }

        }
    }
    const getUserDetails = async (id) => {
        // console.log("getting user")
        try {
            const result = await getUser(id)
            // console.log(result,"User details")
            return result.data.data
        } catch (error) {
            // console.log(error)
            return null
        }
    }
    const { data: patients } = getPatientList(searchValue);
    const { data: doctors } = getDoctorList("")
    const { data: appointments } = getPatientAppointmentList()
    const { data: appointmentTypes } = getPatientAppointmentTypeList()

    const listPatients = async (search = "", page = 0, size = "") => {
        // console.log(patiets)
        // setPatientsLoading("Loading")
        // try {
        //     const result = await getAllPatients(search, page, size)
        //     // page ? (setPatients([...patients, ...result.data.data]), setPatientPage(patientPage + 1)) : (setPatients(result.data.data), setPatientPage(1))
        //     setPatients(result.data.data)
        //     console.log(result.data.data)
        //     setPatientsLoading("Loaded")
        //     return result.data.data
        // } catch (error) {
        //     // console.log(error)
        //     setPatients([])
        //     setPatientsLoading("Error")
        // }
    }
    const listAppointments = async (date = topbarDate, page = "", patient = selectedPatient, size = 100) => {
        setCalendarLoaded("loading")
        try {
            // if patient is selected,  listing patient appointment will work . else  listing all appointments will work;
            const result = patient ? await getPatientAppointments(patient?.name, date, page, size) : await getAppointments(date, page, size);
            // console.log(result.data.data)
            setAppointments(result.data.data)
            setCalendarLoaded("loaded")
        } catch (error) {
            // console.log(error)
            setCalendarLoaded("error")
        }
        setTimeout(() => {
            if (document.querySelector('#mainContainer'))
                document.querySelector('#mainContainer').scrollTop = new Date().getHours() * 32 * 4
        }, 150)
        // console.log(appointments)
        // console.log(doctors)
    }
    const listDoctorAppointments = async (id, date = topbarDate, size = 100) => {
        setCalendarLoaded("loading")
        try {
            const result = await getDoctorAppointments(id, date, "", size);
            setAppointments(result.data.data)
            // console.log(result.data.data)
            setCalendarLoaded("loaded")
        } catch (error) {
            setCalendarLoaded("error")
            // console.log(error)
        }
    }
    const listAppoimentTypes = async () => {
        try {
            const result = await getAppointmentTypes();
            // console.log(result.data.data)
            setAppointmentTypes(result.data.data)
        } catch (error) {
            // console.log(error)
        }
    }
    const listDoctors = async (search = "", page = "", size = 100, active = "", isUpdateDoctors = true) => {
        isUpdateDoctors && setDoctorsLoaded("loading")
        try {
            // const result = await getUsers(search, page, size, active, "doctor");
            const result = await getDoctors(search, page, size, active);
            if (isUpdateDoctors) {
                setDoctors(result.data.data)
                setBackDoctors(result.data.data)
                // console.log(result.data)
                setDoctorsLoaded("loaded")
            }
            return (result.data.data)
        } catch (error) {
            // console.log(error)
            notify(error._error_message)
            setDoctorsLoaded("error")
        }
    }
    const value = {
        logout,
        topbarDate,
        setTopbarDate,
        calendarLoaded,
        setCalendarLoaded,
        doctorsLoaded,
        setDoctorsLoaded,
        loadProfilePicture,
        getUserDetails,
        profilePicture,
        setProfilePicture,
        profilePictureLoading,
        setProfilePictureLoading,
        patients,
        // setPatients,
        patientsLoading,
        setPatientsLoading,
        patientPage,
        setPatientPage,
        doctors,
        // setDoctors,
        backDoctors,
        setBackDoctors,
        listPatients,
        listDoctors,
        listAppointments,
        listDoctorAppointments,
        appointments,
        // setAppointments,
        appointmentTypes,
        // setAppointmentTypes,
        listAppoimentTypes,
    };
    return <ApiContext.Provider value={value}> {children} </ApiContext.Provider>

}