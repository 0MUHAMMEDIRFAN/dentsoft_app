import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import AsyncSelect from 'react-select/async'
import { Dialog, Transition } from '@headlessui/react'
// import Close from "../../assets/Close.svg"
import styles from "./Topbar.module.css"
import DentSoft from "../../assets/DentalLogo.svg"
import { AppContext } from '../../contexts/AppContext'
import { Form, useLocation, useNavigate } from 'react-router-dom'
import { ToastContext } from '../../contexts/ToastContext'
import { createPatient, getAllPatients, updatePatient } from '../../Api/PatientApi'
import moment from 'moment/moment'
import { getSchemes } from '../../Api/SchemeApi'
import { ApiContext } from '../../contexts/ApiContext'
import { createReceptioninstNote, getReceptioninstNotes } from '../../Api/UserApi'

function Topbar() {
    const { sidebarCollapse, setSidebarCollapse, setSidebarItems, searchValue, setSearchValue, addPatientForm, setAddPatientForm, isAddPatientOpen, setIsAddPatientOpen, patientButton, setPatientButton, selectedPatientId, setSelectedPatientId, handleEditPatient, selectedPatient, setSelectedPatient, selectPatient, deselectPatient, searchText, setSearchText, userDetails } = useContext(AppContext)
    const { profilePicture, setProfilePicture, patients, setPatients, listPatients, patientsLoading, setPatientsLoading, patientPage, setPatientPage, topbarDate, listAppointments, setTopbarDate, profilePictureLoading, setProfilePictureLoading, loadProfilePicture, logout } = useContext(ApiContext);
    const [loading, setLoading] = useState(false)
    const [notesLoading, setNotesLoading] = useState("Loaded")
    const [isNotiOpen, setIsNotiOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [noteButton, setNoteButton] = useState(true)
    const [selectedNote, setSelectedNote] = useState({})
    const [noteForm, setNoteForm] = useState("")
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
    const [isReceptionistNotesOpen, setIsReceptionistNotesOpen] = useState(false)
    const navigate = useNavigate()
    const { notify } = useContext(ToastContext)
    const location = useLocation()
    const [schemes, setSchemes] = useState([])
    const [notes, setNotes] = useState([]);
    const pulseRows = new Array(10).fill()
    const inputs = [
        { head: "Patient name", types: [{ type: "text" }], name: "first_name", required: true },
        { head: "Patient ID", types: [{ type: "text" }], name: "ID" },
        { head: "Email ID", types: [{ type: "email" }], name: "email", required: false },
        { head: "Phone", types: [{ type: "tel" }], name: "mobile", required: true, pattern: "[0-9+]{8,15}", title: "Ensure your mobile number is correct" },
        { head: "Date of birth", types: [{ type: "date" }], name: "dob", required: true },
        { head: "Scheme", types: [{ type: "select" }], options: [], name: "custom_scheme" },
        { head: "Address line 1", types: [{ type: "text" }], name: "address", required: false },
        { head: "Address line 2", types: [{ type: "text" }], name: "address2" },
        { head: "Gender", types: [{ text: "Male", type: "radio" }, { text: "Female", type: "radio", }], name: "sex", required: true },
        { head: "Patient type", types: [{ text: "General", type: "radio" }, { text: "Ortho", type: "radio" }], name: "custom_patient_type", required: false },
        { head: "Communications via", types: [{ text: "Text", type: "checkbox" }, { text: "Voice", type: "checkbox" }, { text: "Email", type: "checkbox" }], name: "enabled_communications", required: true }
    ]
    const changeDate = (value = false) => {
        if (value) {
            const date = moment(new Date(new Date(topbarDate).setDate(new Date(topbarDate).getDate() + value))).format("YYYY-MM-DD")
            setTopbarDate(date)
            listAppointments(date)
        } else
            setDate(new Date())
    }
    const checkDay = (day) => {
        switch (day) {
            case 0: return "Sunday";
            case 1: return "Monday";
            case 2: return "Tuesday";
            case 3: return "Wednesday";
            case 4: return "Thursday";
            case 5: return "Friday";
            case 6: return "Saturday";
            default: return "Select";
        }
    }
    const handleSearchChange = (event) => {
        // setPatients([])
        listPatients(event.target.value)
        if (selectedPatient) {
            // deselectPatient();
            // listAppointments(topbarDate, "", "")
            // navigate("/home")
            setTimeout(() =>
                event.target.focus()
                , 10)
        }
        setSearchValue(event.target.value);
        setSearchText(event.target.value);
    }
    const handleSelectPatient = (patient) => {
        // console.log(patient);
        // setSearchValue(patient.name + ` (${patient.patient_no})`);
        setSearchValue("");
        selectPatient(patient);
        listAppointments(topbarDate, "", patient)
        setTimeout(() => navigate("/patient/overview"), 150)
    }
    const listSchemes = async (search = "", page = "", size = "", active = "true") => {
        try {
            const result = await getSchemes(search, page, size, active)
            setSchemes(result.data.data)
            // console.log(result.data.data)
            return result.data.data
        } catch (error) {
            console.log(error)
        }

    }
    const listReceptionistNotes = async (id, search = "") => {
        setNotesLoading("Loading")
        try {
            const result = await getReceptioninstNotes(id, search)
            setNotes(result.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
            console.log(result.data.data)
            setNotesLoading("Loaded")
        } catch (error) {
            console.log(error)
            setNotesLoading("Error")
        }
    }
    const addReceptionistNote = async () => {
        setLoading(true)
        try {
            const payload = { title: noteForm };
            const result = await createReceptioninstNote(payload);
            notify("Reception Note Added Successfully", "success")
            listReceptionistNotes(userDetails?.id)
            closeNoteModal()
            console.log(result)
        } catch (error) {
            console.log(error)
            notify(error.message, "error")
        }
        setLoading(false)
    }
    const addPatient = async () => {
        try {
            const payload = { ...addPatientForm, address: addPatientForm.address + "§ͱ" + (addPatientForm.address2 || "") };
            const patient = await createPatient(payload);
            console.log(patient)
            notify("Patient Details Added", "success")
            setLoading(false)
            closeAll();
        } catch (error) {
            console.log(error.message, error);
            notify(error.message, "error");
            setLoading(false)

        }
    }
    const editPatient = async (id) => {
        try {
            const payload = { ...addPatientForm, address: addPatientForm.address + "§ͱ" + (addPatientForm.address2 || "") };
            const result = await updatePatient(payload, id)
            console.log(result)
            if (selectedPatient) {
                result.name === selectedPatient.name && (setSelectedPatient(result), localStorage.setItem("selectedPatient", JSON.stringify(result)))
            }
            listPatients(searchText)
            notify("Patient Updated SuccessFully", "success")
            setLoading(false)
            closeAll()
        } catch (error) {
            console.log(error)
            setLoading(false)
            notify(error.message, "error")
        }
    }
    const handleChange = (event) => {
        const { value, name, type } = event.target;
        // if (type === "date") {
        //     setAddPatientForm((prev) => ({ ...prev, [name]: new Date(value), }))
        // }
        // else
        if (type === "checkbox") {
            setAddPatientForm((prev) => ({ ...prev, [name]: { ...prev[name], [value]: !addPatientForm[name][value] } }))
        } else {
            setAddPatientForm((prev) => ({
                ...prev, [name]: name === "first_name" ? value.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : value,
            }))
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!loading) {
            setLoading(true)
            console.log(addPatientForm);
            if (patientButton)
                addPatient();
            else
                editPatient(selectedPatientId)
        }
    }
    const closeAll = () => {
        if (!loading) {
            setIsReceptionistNotesOpen(false)
            setIsAddPatientOpen(false)
            setAddPatientForm({
                first_name: "",
                ID: "",
                email: "",
                mobile: "",
                dob: "",
                custom_scheme: "",
                sex: "",
                address: "",
                address2: "",
                custom_patient_type: "",
                enabled_communications: {
                    text: false,
                    voice: false,
                    email: false,
                },
            })
        }
    }
    function openNoteModal() {
        setIsNoteModalOpen(true)
    }
    function closeNoteModal() {
        if (!loading) {
            setIsNoteModalOpen(false)
            setNoteForm("")
        }
    }
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen)
        setIsNotiOpen(false)
    }
    useEffect(() => {
        // listSchemes()
        loadProfilePicture()
        listReceptionistNotes(userDetails?.id)
    }, [])
    const profileRef = useRef(null)
    const notiRef = useRef(null)
    useEffect(() => {
        loadProfilePicture()
    }, [userDetails])
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notiRef.current && !notiRef.current.contains(event.target)) {
                setIsNotiOpen(false);
            }
        };

        if (isNotiOpen) {
            window.addEventListener('click', handleClickOutside);
        } else {
            window.removeEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isNotiOpen]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            window.addEventListener('click', handleClickOutside);
        } else {
            window.removeEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isProfileOpen]);
    return (
        <div className={"top-0 w-full fixed z-[300] h-[70px]"}>
            <div className='flex box-border top-0 w-full items-center border-b border-b-[#cdcdcd] px-[15px] fixed z-[300] bg-white h-[70px]'>
                {/* <<<<<<<<<<----------Burger icon and Logo---------->>>>>>>>>> */}
                <div className={"flex w-[calc(199px-15px)] items-center gap-[13px] "}>
                    <div className={`flex items-center justify-center p-[10px] relative cursor-pointer`} onClick={() => { setSidebarCollapse(!sidebarCollapse) }}>
                        <div className={`${styles.burger_icon} ${sidebarCollapse ? "" : ""} custom-transition `}></div>
                    </div>
                    <div className="">
                        <img className='h-[35px]' src={DentSoft} alt="" />
                    </div>
                </div>
                {/* <<<<<<<<<<----------date selection input, butttons, date---------->>>>>>>>>> */}
                <div className={`${location.pathname === "/home" ? "gap-[1.5vw]" : "opacity-0 pointer-events-none gap-[1vw]"} flex items-center font-medium text-lg leading-[21px] text-[#444648] whitespace-nowrap custom-transition`}>
                    <div className='w-28 flex custom-transition'>
                        <label htmlFor='topbarDate' className="text-sm border border-solid border-[#DADCE0] text-[#888888] rounded px-1.5 py-1 custom-transition hover:bg-gray-100" onClick={() => ""}>
                            {topbarDate === moment(new Date).format("YYYY-MM-DD") ? "Today" : checkDay(new Date(topbarDate).getDay())}
                            <span className='text-xs'>&#9660;</span>
                            <input id='topbarDate' type="date"
                                value={topbarDate}
                                onChange={(event) => {
                                    const date = moment(new Date(event.target.value)).format("YYYY-MM-DD");
                                    event.target.value === "" || setTopbarDate(date);
                                    listAppointments(date);
                                }}
                                onClick={(event) => event.target.showPicker()}
                                className='opacity-0 absolute left-0 -z-10 pointer-events-none w-0'
                                required
                            />
                        </label>
                    </div>
                    <div className="flex gap-[1vw] text-xl select-none">
                        <div className='hover:bg-gray-300 flex justify-center items-center rounded-full w-6 h-6 cursor-pointer custom-transition' onClick={() => { changeDate(-1) }}>
                            &lt;
                        </div>
                        <div className='hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer custom-transition' onClick={() => { changeDate(1) }}>
                            &gt;
                        </div>
                    </div>
                    <p className="w-36">{moment(topbarDate).format("Do MMM YYYY")}</p>
                </div>
                {/* <<<<<<<<<<----------serach and add add patient button---------->>>>>>>>>> */}
                <div className={`flex items-center gap-[1vw] ml-auto`}>
                    <label htmlFor="search" className={`flex items-center max-w-[290px] bg-[#F2F2F2] rounded-[22px] overflow-hidden ml-[.5vw] ${isNotiOpen ? "w-[38px] px-[9px]" : "w-[15vw] px-3.5"} h-8 cursor-text relative custom-transition`}>
                        {/* {selectedPatient ? "" : */}
                        <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                        {/* } */}
                        <input
                            className={`font-normal h-full bg-[#f2f2f2] outline-none disabled:opacity-100 text-sm leading-[17px] text-[#888888] border-none ${selectedPatient ? "" : "", "bg-gray-100 rounded-full pl-4 pr-2 custom-cancel-button", isNotiOpen ? "hidden" : "pl-2"} ${isNotiOpen ? "w-8" : "w-full"} custom-transition`}
                            name='search'
                            id='search'
                            type="search"
                            placeholder='Search'
                            autoComplete='off'
                            // disabled={selectedPatient}
                            value={searchValue}
                            onChange={(event) => handleSearchChange(event)}
                            onFocus={(event) => { setTimeout(() => setSearchText(event.target.value), 200); closeAll() }}
                        // onFocus={(event) => event.preventDefault()}
                        />

                    </label>
                    <button className={"rounded-[16.5px] w-[132px] h-[32px] text-sm leading-[17px] text-white bg-[#4285F4] hover:bg-[#2070F5] custom-transition"} onClick={() => { setIsAddPatientOpen(!isAddPatientOpen); setPatientButton(!isAddPatientOpen); setSearchText("") }}>Add Patient</button>
                </div>
                {/* <<<<<<<<<<----------notification icon, notes icon, user icon---------->>>>>>>>>> */}
                <div ref={notiRef} className={`${isNotiOpen ? "gap-[1.2vw]" : "gap-[1.5vw]"} ml-[2vw] flex items-center gap[1.5vw] custom-transition`}>
                    <div className={`relative flex items-center justify-end text-[#444648] rounded-3xl box-border ${isNotiOpen ? "w-[calc(15vw-9px)]" : "w-9"} custom-transition`}>
                        <div className={`bg-white min-h-full text-sm absolute top-0 right-0 rounded-3xl z-10 overflow-hidden custom-transition ${isNotiOpen ? "w-full drop-shadow-xl" : "w-9"}`}>
                            <p className={`${isNotiOpen ? "w-[calc(100%-2.25rem)] h-[52px]" : "opacity-0 h-9"} pl-4 leading-9 overflow-hidden custom-transition`}>Notification</p>
                            <ul className='w-full text-xs'>
                                <li className={`${isNotiOpen ? "h-14" : "h-0 opacity-0"} w-full px-4 flex text-center border-t items-center whitespace-nowrap custom-transition overflow-hidden`}>No New Notification</li>
                                <li className={`${isNotiOpen ? "h-14" : "h-0 opacity-0"} w-full px-4 flex text-center border-t items-center whitespace-nowrap custom-transition overflow-hidden`}>No New Notification</li>
                            </ul>
                        </div>
                        <i className={`bx bx-bell cursor-pointer text-3xl hover:bg-gray-300 rounded-full px-[3px] w-9 active:scale-90 h-9 text-center custom-transition z-10 ${isNotiOpen ? "bg-gray-300" : ""}`} onClick={() => { setIsProfileOpen(false); setIsNotiOpen(!isNotiOpen); }} />
                    </div>
                    {/* note icon  */}
                    <i className='uil uil-comment-alt-message text-3xl hover:text-[26px] active:w-8 active:h-8 active:leading-8 text-[#444648] hover:bg-gray-300 rounded-full w-9 h-9 leading-9 text-center cursor-pointer custom-transition' title='Notes' onClick={() => setIsReceptionistNotesOpen(!isReceptionistNotesOpen)}></i>
                    {/* user icon */}
                    <div className='cursor-pointer relative custom-transition' ref={profileRef}>
                        <div className='active:w-8 active:h-8 w-9 h-9 custom-transition' onClick={toggleProfile}>
                            {profilePictureLoading === "Loading" ?
                                <div className={`w-full h-full bg-neutral-200 animate-pulse drop-shadow rounded-full custom-transition ${isProfileOpen && "rounded-b-none"}`} >
                                </div> :
                                profilePictureLoading === "Missing" ?
                                    <i className={`bx bx-error-circle text-[20px] leading-9 w-full h-full text-center text-[#ff2c2c]  bg-[#ffff] drop-shadow rounded-full custom-transition ${isProfileOpen && "rounded-b-none"}`} />
                                    :
                                    profilePicture ?
                                        <img
                                            className={`w-full h-full drop-shadow rounded-full custom-transition ${isProfileOpen && "rounded-b-none"}`}
                                            src={profilePicture}
                                            alt=""
                                            crossOrigin="anonymous"

                                        />
                                        :
                                        <i className={`bx bxs-user text-5 leading-9 w-full h-full text-center text-[#a2c4ff]  bg-[#F2F4F9] drop-shadow rounded-full custom-transition ${isProfileOpen && "rounded-b-none"}`} />
                            }
                        </div>
                        <div className={`flex flex-col bg-[#FFFFFF] min-h-full font-medium justify-center border absolute rounded-3xl -z-10 overflow-hidden custom-transition max-w-[250px] ${isProfileOpen ? "w-[20vw] shadow-xl top-[110%] -right-1/3 text-sm" : "w-full top-0 right-0 text-xs opacity-0 pointer-events-none"}`}>
                            <p className={`${isProfileOpen ? "" : "opacity-0"} px-4 py-2 flex justify-between items-center border-b hover:bg-gray-100 custom-transition `} onClick={() => { navigate("/reset-password") }}>Reset Password <i className='uil uil-unlock-alt text-xl' /></p>
                            <p className={`${isProfileOpen ? "" : "opacity-0"} px-4 py-2 flex justify-between items-center hover:bg-gray-100 custom-transition`} onClick={logout}>Logout <i className='uil uil-sign-out-alt text-lg' /></p>
                        </div>
                    </div>
                </div >
            </div>

            {/* <<<<<<<<<<----------Patient List---------->>>>>>>>>> */}


            <div className={`${searchText ? "opacity-1" : "opacity-0 pointer-events-none"} custom-transition`}>
                <div className="w-full h-[calc(100vh-70px)] absolute bg-black bg-opacity-10 top-[70px] left-0" onClick={() => setSearchText("")}></div>
                <div className={`${searchText ? "top-[72px] max-h-[calc(100vh-80px)]" : "top-[40px] max-h-[calc(90vh-80px)] "} w-[760px]  absolute right-[calc(255px+13.5vw)] translate-x-1/2 min-h-[69px] bg-white drop-shadow rounded-md border border-solid z-10 overflow-scroll hide-scrollbar custom-transition`}>
                    <div className={`${(patientsLoading === "Loading" && patients.length) ? "bg-opacity-50" : "bg-opacity-0"} w-full h-full bg-black absolute animate-pulse pointer-events-none custom-transition`}></div>
                    {patients.map((patient, index) => {
                        return (
                            <div key={index} className='border-b min-h-[56px] px-4 py-2 flex gap-1 items-center hover:bg-black w-full hover:bg-opacity-10 hover:py-2.5 custom-transition fade_in'  >
                                <div className='flex w-full' onClick={() => { handleSelectPatient(patient) }}>
                                    <div className='flex items-center gap-2 w-full'>
                                        <div className=''>
                                            {patient.gender || patient.sex === "Female" ?
                                                <i className="fa-solid fa-person-dress w-10 h-10 text-center leading-10 text-xl rounded bg-[#bdc1cb]"></i>
                                                : <i className="fa-solid fa-person w-10 h-10 text-center leading-10 text-xl rounded bg-[#EBEDF0]"></i>
                                            }
                                        </div>
                                        <div className='flex flex-col gap-1 w-full pr-2'>
                                            <div className='flex items-center gap-2'>
                                                <p className='text font-medium '>{`${patient?.patient_name}`}</p>
                                                <p className='text font-medium'>({patient.patient_no})</p>
                                                <p className='text-sm whitespace-nowrap'>{patient.dob ? moment(patient.dob).fromNow().replace("ago", "old") : "--------"}</p>
                                            </div>
                                            <div className='flex items-center gap-2 text-[#444648] font-medium'>
                                                <p className='text-sm'>{patient.phone || patient.mobile},</p>
                                                <p className='text-sm'>{patient.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='ml-auto w-2/3 flex gap-1 items-center text-[#444648]'>
                                        <i className="uil uil-map-marker text-xl"></i>
                                        <p className='text-sm'>{patient.address?.split("§ͱ")[0]}</p>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center h-full cursor-pointer' onClick={() => { handleEditPatient(patient) }}>
                                    <i className="fa-solid fa-pen-to-square text-xl" ></i>
                                </div>
                            </div>
                        )
                    })}

                    {patients.length ?
                        // (patients.length / 10 === patientPage) &&
                        // <div className='box-border h-7 bg-white flex justify-center items-center'>
                        //     {patientsLoading === "Loading" ?
                        //         <i className='bx bx-loader-alt animate-spin text-2xl'></i>
                        //         : <button className='bg-gray-300 border rounded h-5 px-2 font-medium hover:bg-gray-200' onClick={() => { listPatients(searchText, patientPage); }}>Load more...</button>
                        //     }
                        // </div>
                        ""
                        : <div className='box-border h-14 flex justify-center items-center'>
                            {patientsLoading === "Loading" ?
                                <i className='bx bx-loader-alt animate-spin text-2xl'></i>
                                : patientsLoading === "Loaded" ? "No Patients Found"
                                    : <div className='flex flex-col justify-center items-center'>
                                        <p>Error while Loading Patients</p>
                                        <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listPatients(searchText)}>Try Again</button>
                                    </div>}
                        </div>
                    }
                </div>
            </div>


            {/* <<<<<<<<<<----------Add Patient---------->>>>>>>>>> */}

            {isAddPatientOpen && <div className='w-full h-[calc(100vh-70px)] absolute top-[70px] left-0 ' onClick={closeAll}></div>}
            <div className={`${isAddPatientOpen ? "translate-x-0" : "translate-x-full pointer-events-none "} custom-transition absolute top-[70px] flex flex-col box-border bg-white pl-3 inset-0 h-[calc(100vh-70px)] text-sm py-7  overflow-auto ${sidebarCollapse ? "w-[calc(100vw-80px)] left-[80px]" : "w-[calc(100vw-200px)] left-[200px]"}`}>
                <h1 className='font-bold text-lg pl-7 ' onClick={() => console.log(addPatientForm, moment(addPatientForm.dob).format("YYYY-MM-DD"))}>{patientButton ? "Patient details" : "Update Patient details"}</h1>
                <form action="" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap box-border items-center ">
                        {inputs.map((data, index) => {
                            return (
                                <div key={index} className='pl-7 mt-5'>
                                    <p className='text-[#8A8A8A] leading-6'>{data.head}</p>
                                    <div className="w-[30vw] min-w-[270px] h-12 rounded-md border border-solid border-[#DFDFDF] font-medium flex items-center relative  text-[#373434] ">
                                        {data.types.map((obj, index) => {
                                            return (
                                                obj.type === "select" ?
                                                    <AsyncSelect
                                                        key={index}
                                                        defaultOptions={[{ label: "Recent Schemes", isDisabled: true, }, ...schemes.map((optionData) => ({ label: optionData.name, value: optionData.name }))]}
                                                        loadOptions={(string, callback) => {
                                                            listSchemes(string, "", 15).then((result) => {
                                                                console.log(result);
                                                                callback(result.map((optionData) => ({ label: optionData.name, value: optionData.name })))
                                                            })
                                                        }}
                                                        onChange={(selected) => setAddPatientForm((prev) => ({ ...prev, [data.name]: selected.value, scheme: selected.label }))}
                                                        className="w-full h-full"
                                                        classNamePrefix="select"
                                                        name={data.name}
                                                        value={{ value: addPatientForm[data.name], label: addPatientForm.scheme }}
                                                        isDisabled={loading}
                                                    />

                                                    :
                                                    <div key={index} className='flex gap-[1vw] items-center rounded-md w-full h-full' >
                                                        <input
                                                            type={obj.type}
                                                            name={data.name}
                                                            className={`${(obj.type === "radio" || obj.type === "checkbox") ? "h-5 ml-5 w-5" : "focus:outline-none rounded-md transition-all w-full px-5 h-full min-w-[26px]"} ${data.name === "name" && "camelCase"}`}
                                                            onChange={handleChange}
                                                            onFocus={(event) => { obj.type === "date" && event.target.showPicker() }}
                                                            value={obj.type === "radio" ? obj.text : obj.type === "checkbox" ? obj.text?.toLowerCase() : data.name === "ID" ? addPatientForm.patient_no || "* * * *" : obj.type === "date" ? moment(addPatientForm[data.name]).format("YYYY-MM-DD") === "Invalid date" ? this : moment(addPatientForm[data.name]).format("YYYY-MM-DD") : addPatientForm[data.name]}
                                                            checked={obj.type === "radio" ? addPatientForm[data.name] === obj.text : obj.type === "checkbox" ? addPatientForm[data.name] && addPatientForm[data.name][obj.text?.toLowerCase()] : null}
                                                            required={obj.type != "checkbox" ? data.required : false}
                                                            disabled={data.name === "ID" || loading}
                                                            pattern={data.pattern}
                                                            title={data.title}
                                                        />
                                                        {obj.text && <span className='text-sm font-medium'>{obj.text}</span>}
                                                    </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className='pl-7 mt-5 flex gap-2.5'>
                        <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#4285F4] w-28 h-10 text-white rounded font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Save"}</button>
                        <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded font-medium`} onClick={closeAll}>Discard</button>
                    </div>
                </form >
                <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} absolute right-6 top-7`} onClick={closeAll} ><i className='bx bx-x text-2xl leading-7' /></button>
            </div >

            {/* <<<<<<<<<<----------Receptionist notes---------->>>>>>>>>> */}

            <div className={`${isReceptionistNotesOpen ? "" : "opacity-0 pointer-events-none"} w-full h-[calc(100vh-70px)] absolute bg-black bg-opacity-10 top-[70px] left-0 custom-transition`} onClick={closeAll}></div>
            <div className={`${isReceptionistNotesOpen ? "-translate-x-full" : "-translate-x-0 pointer-events-none "} custom-transition absolute top-[70px] left-full flex flex-col box-border bg-white px-5 pt-14 pb-3 inset-0 h-[calc(100vh-70px)] text-sm border-l overflow-auto w-[337px]`}>
                <div className='flex border border-solid border-[#EBEDF0] rounded-[20px] h-10 items-center px-4 gap-2'>
                    <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                    <input type="search" placeholder='Search for notes' className='outline-none w-full' onChange={(event) => listReceptionistNotes(userDetails?.id, event.target.value)} />
                </div>
                <div className='mt-2 h-[calc(100%-40px)] overflow-auto border-y'>
                    <ul className='flex flex-col border border-solid border-[#E7DBDB] rounded-lg bg-[#F3FFF2]'>
                        <li className='  h-19 p-5  flex flex-col justify-center text-[#444648] font-medium text-xs gap-1 border-b' onClick={() => { setIsNoteModalOpen(true); setNoteButton(false) }}>
                            <div className='flex justify-between font-medium items-center'>
                                <h6 className='text-sm'>Add title</h6>
                            </div>
                            <p className='text-[#8B8B8B]'>Description</p>
                        </li>
                        {notes.map((data, index) => {
                            return (
                                <li key={index} className='min-h-[75px] p-5  flex flex-col justify-center text-[#444648] font-medium text-xs gap-1 border-b' onClick={() => { openNoteModal(); setSelectedNote(data); setNoteButton(true) }}>
                                    <div className='flex justify-between font-medium items-center'>
                                        <p className='whitespace-nowrap'>{moment(data.modified).format("DD-MM-YYYY")}</p>
                                    </div>
                                    <p className='text-[#8B8B8B] whitespace-nowrap text-ellipsis overflow-hidden'>{data.title}</p>
                                </li>
                            )
                        })}
                        {notes.length ? ""
                            : notesLoading === "Loading" ?
                                pulseRows.map((_, index) =>
                                    <li key={index} className='min-h-[75px] p-5  flex flex-col justify-center text-[#444648] font-medium text-xs gap-1 border-b box-border items-center animate-pulse'>
                                        <div className='bg-neutral-200 rounded h-4 w-full'></div>
                                        <div className='bg-neutral-200 rounded h-4 w-full'></div>
                                    </li>
                                )
                                : <li className='min-h-[75px] p-5  flex flex-col justify-center text-[#444648] font-medium text-xs gap-1 border-b box-border items-center'>
                                    <p>{notesLoading === "Loaded" ? "No Notes Found" : "Error while Loading Notes"}</p>
                                    {notesLoading != "Loaded" && <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listReceptionistNotes(userDetails?.id)}>Try Again</button>}
                                </li>
                        }
                    </ul>
                </div>
                <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} absolute right-5 top-5`} onClick={closeAll} ><i className='bx bx-x text-2xl leading-7' /></button>
            </div >

            {/* <<<<<<<<<<----------Add or Update Note Modal---------->>>>>>>>>> */}

            <>
                <Transition appear show={isNoteModalOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-[500] " onClose={closeNoteModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto ">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-x-full scale-75"
                                    enterTo="opacity-100 translate-x-0 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-x-0 tanslate-y-0 scale-100 "
                                    leaveTo="opacity-0 translate-x-3/4 -translate-y-20 scale-75"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-6">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-gray-900 font-semibold text-base"
                                        >
                                            {noteButton ?
                                                <p className="text-sm text-gray-500 font-medium mr-5">
                                                    {`${moment(selectedNote.modified).format("hh:mmA , DD-MM-YYYY")} | Added by ${selectedNote.owner}`}
                                                </p>
                                                : "Add note"}
                                        </Dialog.Title>
                                        {noteButton ?
                                            <div className='flex bg-[#F3FFF2] rounded-lg px-4 py-3 text-sm border border-solid border-[#DFDFDF] whitespace-pre-wrap'>
                                                {selectedNote.title}
                                            </div>
                                            : <form action="" onSubmit={(event) => { event.preventDefault(); addReceptionistNote() }}>
                                                <textarea
                                                    name="addNote"
                                                    id="addNote"
                                                    cols="30"
                                                    rows="10"
                                                    className='bg-[#F3FFF2] rounded-md px-4 py-3 text-sm border border-solid w-full border-[#DFDFDF] outline-none min-h-[45px]'
                                                    onChange={(event) => setNoteForm(event.target.value)}
                                                    value={noteForm}
                                                    required
                                                    disabled={loading}
                                                >
                                                </textarea>
                                                <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#4285F4] rounded-md h-9 px-4 font-semibold text-white hover:bg-[#2070F5]`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Submit"}</button>
                                            </form>
                                        }
                                        <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} absolute right-5 top-6`} onClick={closeNoteModal} ><i className='bx bx-x text-2xl leading-7' /></button>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </>

        </div >
    )
}

export default Topbar
