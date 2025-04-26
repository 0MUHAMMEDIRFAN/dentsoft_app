import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ToastContext } from '../../contexts/ToastContext'
import { AppContext } from '../../contexts/AppContext'
import { useNavigate } from 'react-router-dom'
import { createPatientTreatment, getAllTreatments, getPatientTreatment, updatePatientTreatment } from '../../Api/TreatmentApi'
import moment from 'moment'
import Teeth from '../Teeth'
import { createDentalCondition, deleteDentalCondition, getAllDentalCondition, getDentalChart, markTeethAsPermenent, markTeethAsPrimary } from '../../Api/DentalConditionApi'
import { createDoctorNote, getAllDoctorNote } from '../../Api/PatientApi'
import { ApiContext } from '../../contexts/ApiContext'
import DentalChart from '../DentalChart'
import { getTreatmentList } from '../../hooks/useTreatment'
import { getPatientTreatmentList } from '../../hooks/usePatientTreatment'


function Overview() {
    const { notify } = useContext(ToastContext)
    const { selectedPatient, setSelectedPatient, selectedAppointment, setSidebarItems, deselectPatient, setSelectedTeeth, selectedTeeth } = useContext(AppContext)
    const { listAppointments } = useContext(ApiContext)
    const [patientTreatmentButton, setPatientTreatmentButton] = useState(true)
    const [sidebarRightCollapse, setSidebarRightCollapse] = useState(true)
    const [notesExpanded, setNotesExpanded] = useState(false)
    const [appointmentCollapsed, setAppointmentCollapsed] = useState(false)
    const [selectedTreatment, setSelectedTreatment] = useState({})
    const [selectedPatientTreatment, setSelectedPatientTreatment] = useState({})
    const [patientTreatmentsLoading, setPatientTreatmentsLoading] = useState("Loaded")
    const [patientDentalChartLoading, setPatientDentalChartLoading] = useState("Loaded")
    const [notesLoading, setNotesLoading] = useState("Loaded")
    const [treatmentPage, setTreatmentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [treatmentsLoading, setTreatmentsLoading] = useState("Loaded")
    // const [patientTreatments, setPatientTreatments] = useState([]);
    // const [patientTreatmentsMeta, setPatientTreatmentsMeta] = useState({})
    const [isDiscountApplied, setIsDiscountApplied] = useState(true);
    // const [treatments, setTreatments] = useState([]);
    const [dentalChart, setDentalChart] = useState({});
    const [dentalCondition, setDentalCondition] = useState([]);
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState({});
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
    const [isOpenDentalConditionModal, setisOpenDentalConditionModal] = useState(false)
    const [noteForm, setNoteForm] = useState("")
    const [noteButton, setNoteButton] = useState(true)
    const [dentalConditionButton, setDentalConditionButton] = useState(true)
    const [treatmentOpen, setTreatmentOpen] = useState(false)
    const [treatmentType, setTreatmentType] = useState("Treatment")
    const [currentTab, setCurrentTab] = useState("All")
    const navigate = useNavigate()
    const tabs = ["All", "Conditions", "Existing", "Proposed", "Completed", "Today"]
    const inputs = [
        { head: "Status", types: [{ text: "Proposed", type: "radio" }, { text: "Existing", type: "radio", }], name: "status", required: true },
        // { head: "Service provider", types: [{ type: "select" }], name: "provider" },
        // { head: "Tooth number", types: [{ type: "text" }], name: "teeth" ,required: true },
        { head: "Date", types: [{ type: "date" }], name: "start_date", required: true },
        { head: "Fees", types: [{ type: "number" }], name: "custom_paid_amount", required: true },
        { head: "Phase number", types: [{ type: "number" }], name: "phase_no", required: true },
        { head: "Remark", types: [{ type: "text" }], name: "remarks", required: false },
        { head: "Response", types: [{ type: "select" }], options: ["ACCEPTED", "REFERRED", "REJECTED", "WALKOUT", "HALF_PAYMENT"], name: "patient_response", required: true },
    ]
    const pulseRows = new Array(10).fill()
    const pulseDentalChart = new Array(32).fill()
    const [dentalForm, setDentalForm] = useState({
        name: "",
        code: "",
    })
    const [form, setForm] = useState({
        patient: selectedPatient.name,
        procedure_template: "",
        status: "",
        start_date: moment(new Date()).format("YYYY-MM-DD"),
        phase_no: "",
        remarks: "",
        patient_response: "ACCEPTED",
        appointment: selectedAppointment?.name,
        custom_paid_amount: "",
        custom_discount: 0,
        teeth: [],
    })
    const setTeethAsPermenent = async () => {
        if (selectedTeeth?.length) {
            try {
                const payload = { tooth_nos: selectedTeeth.map(tooth => tooth.tooth_no) };
                const result = await markTeethAsPermenent(payload, selectedPatient.name);
                notify("Marked teeths as permanent", "success")
                listPatientDentalChart(selectedPatient.name);
            } catch (error) {
                console.log(error)
                notify(error.message, "error")
            }
        } else {
            notify("Please Select a tooth 1st", "info")
        }
    }
    const setTeethAsPrimary = async () => {
        if (selectedTeeth?.length) {
            try {
                const payload = { tooth_nos: selectedTeeth.map(tooth => tooth.tooth_no) };
                const result = await markTeethAsPrimary(payload, selectedPatient.name);
                notify("Marked teeths as primary", "success")
                listPatientDentalChart(selectedPatient.name);
            } catch (error) {
                console.log(error)
                notify(error.message, "error")
            }
        } else {
            notify("Please Select a tooth 1st", "info")

        }
    }

    const { data:treatments } = getTreatmentList()
    const { data:patientTreatments } = getPatientTreatmentList()


    const addDentalCondition = async () => {
        setLoading(true)
        try {
            const payload = dentalForm;
            const result = await createDentalCondition(payload);
            console.log(result)
            listDentalCondition();
            notify("Dental Condition Added Success", "success")
            setisOpenDentalConditionModal(false)
        } catch (error) {
            console.log(error)
            notify(error.message, "error")
        }
        setLoading(false)
    }
    const listPatientDentalChart = async (id) => {
        setDentalChart([])
        setPatientDentalChartLoading("Loading")
        try {
            const result = await getDentalChart(id);
            // console.log(result.data)
            const firstQuadrant = result.data.data?.sort((a, b) => a.tooth_no - b.tooth_no);
            console.log(result)
            const sortedData = [...firstQuadrant?.slice(0, 8).reverse(), ...firstQuadrant?.slice(8, 16), ...firstQuadrant?.slice(24, 32).reverse(), ...firstQuadrant?.slice(16, 24)];
            setDentalChart({ patient_dental_status: sortedData })
            // console.log(sortedData)
            // result.data.data.patient_dental_status.sort((a, b) => a.tooth_no - b.no)
            setPatientDentalChartLoading("Loaded")
        } catch (error) {
            console.log(error)
            setPatientDentalChartLoading("Error")
        }
    }
    const listDentalCondition = async () => {
        try {
            const result = await getAllDentalCondition()
            // console.log(result.data.data)
            setDentalCondition(result.data.data)
        } catch (error) {
            // console.log(error)
        }
    }
    const addPatientTreatment = async () => {
        try {
            const payload = { ...form, teeth: selectedTeeth };
            const result = await createPatientTreatment(payload);
            notify("Patinet Treatment Added Success", "success")
            listPatientDentalChart(selectedPatient.name)
            listPatientTreatments(selectedPatient.name)
            closeModal()
            console.log(result)
        } catch (error) {
            notify(error.message, "error")
            console.log(error)
        }
        setLoading(false)
    }
    const editPatientTreatment = async (id) => {
        try {
            const payload = form;
            const result = await updatePatientTreatment(payload, id);
            notify("Patinet Treatment Updated Success", "success")
            listPatientDentalChart(selectedPatient.name)
            listPatientTreatments(selectedPatient.name)
            closeModal()
            console.log(result)
        } catch (error) {
            notify(error.message, "error")
            console.log(error)
        }
        setLoading(false)
    }
    const listAllTreatments = async (search = "", page = 0) => {
        setTreatmentsLoading("Loading")
        try {
            const result = await getAllTreatments(search, page)
            page ? (setTreatments([...treatments, ...result.data.data]), setTreatmentPage(treatmentPage + 1)) : (setTreatments(result.data.data), setTreatmentPage(1))
            // console.log(result.data.data)
            setTreatmentsLoading("Loaded")
        } catch (error) {
            console.log(error)
            setTreatmentsLoading("Error")
        }
    }
    const listPatientTreatments = async (id) => {
        setPatientTreatments([])
        setPatientTreatmentsLoading("Loading")
        try {
            const result = await getPatientTreatment(id)
            setPatientTreatments(result.data.data)
            // setPatientTreatmentsMeta(result.data.meta)
            console.log(result.data)
            setPatientTreatmentsLoading("Loaded")
        } catch (error) {
            console.log(error)
            setPatientTreatmentsLoading("Error")
        }
    }
    const addDoctorNote = async () => {
        setLoading(true)
        try {
            const payload = { patient: selectedPatient.name, note: noteForm };
            const result = await createDoctorNote(payload);
            notify("Doctor Note Added Successfully", "success")
            listDoctorNotes(selectedPatient.name)
            setIsNoteModalOpen(false)
            console.log(result)
        } catch (error) {
            notify(error.message, "error")
            console.log(error)
        }
        setLoading(false)
    }
    const listDoctorNotes = async (id, search = "") => {
        setNotes([])
        setNotesLoading("Loading")
        try {
            const result = await getAllDoctorNote(id, search)
            setNotes(result.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
            // console.log(result.data.data)
            setNotesLoading("Loaded")
        } catch (error) {
            console.log(error)
            setNotesLoading("Error")
        }
    }
    const removeDentalCondition = async (id) => {
        try {
            const result = await deleteDentalCondition(id);
            notify("Dental Condition deleted Success", "success")
            listDentalCondition();
        } catch (error) {
            notify(error.message, "error")
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!loading) {
            setLoading(true)
            // console.log(form, "Remember that The payload is editing before calling the api ") // Remember that The payload is editing before calling the api 
            console.log(selectedTeeth)
            if (patientTreatmentButton) {
                addPatientTreatment();
            } else {
                editPatientTreatment(selectedPatientTreatment.id);
            }
        }

    };
    const handleChange = (event) => {
        event.target.type === "number" ?
            event.target.value === "" ?
                setForm((prev) => ({ ...prev, [event.target.name]: event.target.value, }))
                : setForm((prev) => ({ ...prev, [event.target.name]: Number(event.target.value), }))
            :
            setForm((prev) => ({ ...prev, [event.target.name]: event.target.value, }))
    }
    const dentalFormHandleChange = (event) => {
        setDentalForm((prev) => ({ ...prev, [event.target.name]: event.target.value, }))
    }
    function openNoteModal(data, noteButton) {
        setSelectedNote(data)
        setNoteButton(noteButton)
        setIsNoteModalOpen(true)
    }
    function closeModal() {
        if (!loading) {
            setSelectedTeeth([])
            setTreatmentOpen(false)
            setIsNoteModalOpen(false)
            setPatientTreatmentButton(true)
            setSelectedPatientTreatment({})
            setNoteForm("")
            setisOpenDentalConditionModal(false)
            setForm({
                patient: selectedPatient.name,
                procedure_template: "",
                status: "Pending",
                start_date: moment().format("YYYY-MM-DD"),
                phase_no: "",
                notes: "",
                patient_response: "ACCEPTED",
                appointment: selectedAppointment?.name,
                custom_paid_amount: "",
                custom_discount: 0,
                teeth: [],
            })
        }
    }
    useEffect(() => {
        // listPatientDentalChart(selectedPatient.name);
        // listPatientTreatments(selectedPatient.name)
        // listDoctorNotes(selectedPatient.name)
    }, [selectedPatient])
    useEffect(() => {
        // listDentalCondition();
        // listAllTreatments()
    }, [])
    return (
        <div className='bg-[#FAFAFD] p-5 pl-7 min-h-full fade_in'>
            <div className='flex justify-between pb-5'>
                <h1 className='text-xl font-semibold'></h1>
                <div className={`${appointmentCollapsed ? "" : ""} flex overflow-hidden border rounded-lg text-center cursor-pointer max-xl:mr-10 custom-transition`}
                    onClick={() => selectedAppointment && setAppointmentCollapsed(!appointmentCollapsed)}
                    style={{ background: (selectedAppointment?.appointment_type?.color_code ?? "#808080") + 21 }}
                >
                    <div className={`h-full w-2 custom-transition`} style={{ background: selectedAppointment?.appointment_type?.color_code ?? "#808080" }}></div>
                    <div className='flex flex-col py-1 px-2 items-center justify-center'>
                        <p className='w-full font-medium text-sm'>Selected Appointment : {selectedAppointment?.name || "Not selected"}</p>
                        {/* <p className='w-full font-medium text-sm'>Selected Appointment : {selectedAppointment ? `${moment(selectedAppointment?.start_time).format("hh:mmA")} - ${moment(selectedAppointment?.end_time).format("hh:mmA")}` : "Not selected"}</p> */}
                        <div className={`${appointmentCollapsed ? "grid-rows-[repeat(2,1fr)]" : "grid-rows-[repeat(2,0fr)]"} grid w-full gap1 fade_in custom-transition`}>
                            <p className='w-full font-medium overflow-hidden text-sm'>Date : {moment(selectedAppointment?.appointment_date).format("DD-MMM-YYYY")}</p>
                            <p className='w-full font-medium overflow-hidden text-sm'>Provider : {selectedAppointment?.practitioner_name}</p>
                        </div>
                    </div>
                    {selectedAppointment && <i className='bx bxs-chevron-down h-full flex items-center pr-2 custom-transition' />}
                </div>
                {/* <div className='pl-3 pr-2 border h-6 flex rounded-lg items-center gap-4 cursor-pointer xl:mr[calc(25%-20px)] max-xl:mr-10'
                    onClick={() => {
                        deselectPatient();
                        navigate("/home");
                    }}
                >{selectedPatient.name} <i className='bx bx-x text-lg leading-7' /></div> */}
            </div>
            <div className='flex gap-5'>
                <div className='flex flex-col gap-5 overflow-auto drop-shadow xl:w-[70%] max-xl:pr-10'>

                    {/* <<<<<<<<<<----------Teeth Container---------->>>>>>>>>> */}

                    <div className='bg-white rounded-md minh-[calc(100vh-200px) min-h-[524px] overflow-auto'>
                        <div className='h-14 border-b font-medium '>

                            {/* <<<<<<<------Container Tabs------>>>>>>> */}

                            <ul className='flex w-full gap-2 items-center h-full text-[#616161]' >
                                {tabs.map((tab, index) =>
                                    <li key={index} className={`${currentTab === tab && "border-b-[#446DFF] border-b-4 text-[#446DFF] "} w-full max-w-[120px] h-full flex justify-center items-center custom-transition`} name={tab} onClick={() => setCurrentTab(tab)}>{tab}</li>
                                )
                                }
                            </ul>
                        </div>
                        {currentTab === "Conditions" ?
                            // display when tab is changed to Condition 
                            <div className='flex flex-col gap-2 p-3'>
                                {dentalCondition.map((data, index) =>
                                    <div key={index} className='p-3 border border-solid rounded flex justify-between'>
                                        {data?.name}
                                        <div className='flex gap-2'>
                                            <button className='bg-[#FF0000c0] rounded h-8 px-2 font-medium text-white hover:bg-[#FF0000] custom-transition' onClick={() => removeDentalCondition(data.id)}>Delete</button>
                                            <button className='bg-[#4285F4] rounded h-8 px-2 font-medium text-white hover:bg-[#2070F5] custom-transition' onClick={() => { setDentalForm({ name: data.name, code: data.code }); setisOpenDentalConditionModal(true) }}>Edit</button>
                                        </div>
                                    </div>
                                )}
                                <button className='bg-[#4285F4] rounded h-8 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => setisOpenDentalConditionModal(true)}>Add new dental Condition</button>
                            </div>
                            : <DentalChart />}
                    </div>

                    {/* <<<<<<<<<<----------Table Patient Treatments---------->>>>>>>>>> */}

                    <div className='bg-white pt-2 rounded-md'>
                        <table className='w-full table-fixed'>
                            <thead className="text-[#8B8B8B]">
                                <tr className='h-20'>
                                    <th className='pl-6'>Date</th>
                                    <th>Provider</th>
                                    <th className='w-[10%]'>Code</th>
                                    <th className='w-[10%]'>Teeth</th>
                                    <th className='w-[10%]'>Price</th>
                                    <th>Treatment</th>
                                    <th className='pr-2'>Status</th>
                                </tr>
                            </thead>
                            <tbody className='text-[#444648]'>
                                {patientTreatments?.map((data, index) => {
                                    return (
                                        <tr key={index} className='box-border h-12 hover:bg-gray-100 active:bg-gray-200 cursor-pointer custom-transition' title='Click to Update' onClick={() => { setForm(data); setSelectedPatientTreatment(data); setPatientTreatmentButton(false); setSelectedTreatment(data?.treatment); setTreatmentOpen(true); false && openNoteModal({ ...data, note: data.remarks || "-----" }, true); }}>
                                            <td className='pl-6'>{moment(data.treatment_date).format("DD-MMM-YYYY")}</td>
                                            <td>{data.practitioner_name}</td>
                                            <td>{data.procedure_template}</td>
                                            <td>{data.Patient_Treatment_Teeth?.map((tooth, index, array) => tooth?.tooth_no + (index === array.length - 1 ? "" : ","))}</td>
                                            <td>{data.custom_paid_amount}</td>
                                            <td className='max-w-[150px]'>{data.procedure_template}</td>
                                            <td className='pr-2'>
                                                <div className={`${data.status === "Completed" ? "text-[#5ABA53]" : data.status === "Draft" ? "text-[#aeb0b3]" : data.status === "Submitted" ? "text-[#0000FF]" : data.status === "Cancelled" ? "text-[#FF2727]" : "text-[#FE9F2F]"} flex items-center gap-2`}>
                                                    <i className="fa-solid fa-circle text-[10px]"></i>
                                                    <p className={`flex items-center`}>{data.status}</p>
                                                </div>
                                            </td>
                                            {/* <td className='pr-2'>
                                                <div className={`${data.patient_response === "ACCEPTED" ? "text-[#5ABA53]" : data.patient_response === "WALKOUT" ? "text-[#aeb0b3]" : data.patient_response === "REFERRED" ? "text-[#0000FF]" : data.patient_response === "REJECTED" ? "text-[#FF2727]" : "text-[#FE9F2F]"} flex items-center gap-2`}>
                                                    <i className="fa-solid fa-circle text-[10px]"></i>
                                                    <p className={`flex items-center`}>{data.patient_response}</p>
                                                </div>
                                            </td> */}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {patientTreatments?.length ?
                            // <div className='box-border h-11 bg-white flex gap-5 justify-end items-center pl-9 p-2'>
                            //     <i className='bx bx-rotate-right mr-auto cursor-pointer text-lg' onClick={() => listPatientTreatments(selectedPatient.name, patientTreatmentsMeta.page, patientTreatmentsMeta.size, `${currentTab === "Active Treatments"}`)}></i>
                            //     <p>Total {currentTab} :&nbsp; {treatments.length} / {patientTreatmentsMeta.total}</p>
                            //     <p>Page {patientTreatmentsMeta.page + 1}&nbsp; of {Math.floor(((patientTreatmentsMeta.total - 1) / patientTreatmentsMeta.size) + 1)}</p>
                            //     <div className={`${patientTreatmentsMeta.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { patientTreatmentsMeta.page != 0 && listPatientTreatments(selectedPatient.name, patientTreatmentsMeta.page - 1, patientTreatmentsMeta.size, `${currentTab === "Active Treatments"}`) }}>
                            //         &lt;
                            //     </div>
                            //     <div className={`${patientTreatmentsMeta.page < Math.floor((patientTreatmentsMeta.total - 1) / patientTreatmentsMeta.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { patientTreatmentsMeta.page < Math.floor((patientTreatmentsMeta.total - 1) / patientTreatmentsMeta.size) && listPatientTreatments(selectedPatient.name, patientTreatmentsMeta.page + 1, patientTreatmentsMeta.size, `${currentTab === "Active Treatments"}`) }}>
                            //         &gt;
                            //     </div>
                            //     <p>size :
                            //         <select name="" id="" defaultValue={patientTreatmentsMeta.size} onChange={(event) => listPatientTreatments(selectedPatient.name, "", event.target.value, `${currentTab === "Active Treatments"}`)} className='default-select-icon'>
                            //             <option value="5">5 </option>
                            //             <option value="10">10 </option>
                            //             <option value="15">15 </option>
                            //             <option value="20">20 </option>
                            //             <option value="50">50 </option>
                            //         </select>
                            //     </p>
                            // </div>
                            "" :
                            // <<<<<-----Error Handling and Loading handling----->>>>> 
                            <div className='box-border min-h-[60px] bg-white flex justify-center items-center'>
                                {patientTreatmentsLoading === "Loading" ?
                                    <table className="w-full table-fixed">
                                        <tbody>
                                            {pulseRows.map((_, index) =>
                                                <tr key={index} className="animate-pulse h-14">
                                                    <td className='pl-6'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td className='w-[10%]'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td className='w-[10%]'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td className='w-[10%]'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                </tr>
                                            )}
                                            {/* <tr className="animate-pulse h-7">
                                                <td className='pl-9'><div className='bg-neutral-200 rounded h-4 w-5'></div></td>
                                                <td></td>
                                                <td></td>
                                                <td><div className='bg-neutral-200 rounded h-4'></div></td>
                                                <td><div className='bg-neutral-200 rounded h-4'></div></td>
                                            </tr> */}
                                        </tbody>
                                    </table>
                                    : patientTreatmentsLoading === "Loaded" ? "No Treatments Found"
                                        : <div className='flex flex-col justify-center items-center'>
                                            <p>Error while Loading Treatments</p>
                                            <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listPatientTreatments(selectedPatient.name)}>Try Again</button>
                                        </div>}
                            </div>
                        }
                    </div>
                </div>
                <div className={`${sidebarRightCollapse ? "max-xl:w-14" : "max-xl:overflow-auto"} flex flex-col w-[calc(30%-30px)] gap-5 min-h-[calc(100vh-200px)] custom-transition max-xl:fixed right-0 top-0 max-xl:bg-[#FAFAFD] max-xl:border-l max-xl:px-2 max-xl:min-h-full max-xl:pt-24`}>
                    <button className={`min-h-[40px] w-full text-lg font-medium drop-shadow rounded-md bg-white xl:hidden`} onClick={() => setSidebarRightCollapse(!sidebarRightCollapse)}><p className={`${sidebarRightCollapse ? "" : "rotate-180"} custom-transition w-full`}>&lt;</p></button>

                    {/* <<<<<<<<<<---------- All Treatments ---------->>>>>>>>>> */}

                    <div className={`${sidebarRightCollapse ? "max-xl:px-0 max-xl:drop-shadow-none max-xl:bg-transparent" : ""} bg-white p-5 rounded-md max-h[40%] ${notesExpanded ? "h-[100px]" : "h-[240px]"} box-border relative drop-shadow custom-transition`} onClick={() => setNotesExpanded(false)}>
                        <div className={`${sidebarRightCollapse ? "max-xl:px-0" : ""} px-4 flex justify-center border border-solid border-[#EBEDF0] rounded-[20px] h-10 items-center gap-2`}>
                            <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                            <input type="search" placeholder='Search for treatment' className={`${sidebarRightCollapse ? "max-xl:hidden" : ""} outline-none w-full`} onChange={(event) => listAllTreatments(event.target.value)} />
                        </div>
                        <div className={`${sidebarRightCollapse ? "max-xl:overflow-y-hidden" : ""} mt-2 h-[calc(100%-40px)] overflow-auto hide-scrollbar`}>
                            <ul className='flex flex-wrap gap-2 hfull custom-transition'>
                                {treatments?.map((data, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className={`${sidebarRightCollapse ? "max-xl:justify-center max-xl:w-full max-xl:pl-0" : ""} border px-5 border-solid border-[#4E9BA9] bg-[#EDF6FF] whitespace-nowrap text-ellipsis overflow-hidden min-h-[48px] h-12 w-[48%] rounded-lg flex items-center text-[#444648] font-medium hover:bg-[#d0e7ff] active:bg-[#EDF6FF] custom-transition`}
                                            onClick={() => {
                                                // console.log(selectedTeeth)
                                                console.log(selectedPatient)
                                                if (window.innerWidth < 1280 && sidebarRightCollapse) {
                                                    setSidebarRightCollapse(false)
                                                } else {
                                                    if (selectedAppointment) {
                                                        if (selectedTeeth?.length) {
                                                            setForm((prev) => ({ ...prev, procedure_template: data.name, custom_paid_amount: data.type === "CONDITION" ? "" : selectedPatient.custom_scheme?.discount ? data.price - (selectedPatient.custom_scheme?.discount * data.price / 100) : data.price }));
                                                            setTreatmentOpen(true);
                                                            setSelectedTreatment(data)
                                                        } else {
                                                            notify("You are not selected any Tooth", "info")
                                                        }
                                                    } else {
                                                        notify("Please Select an Appointment First", "info")
                                                    }
                                                }
                                            }}
                                        >
                                            {sidebarRightCollapse && window.innerWidth < 1280 ? index + 1 : data?.name}
                                        </li>
                                    )
                                })}
                                {treatments?.length ?
                                    (treatments?.length / 10 === treatmentPage) &&
                                    <li className='box-border h-7 bg-white flex justify-center items-center'>
                                        {treatmentsLoading === "Loading" ?
                                            <i className='bx bx-loader-alt animate-spin text-2xl'></i>
                                            : <button className='bg-gray-300 border rounded h-5 px-2 font-medium hover:bg-gray-200' onClick={() => { listAllTreatments("", treatmentPage); }}>Load more...</button>
                                        }
                                    </li>
                                    : treatmentsLoading === "Loading" ?
                                        // <i className='bx bx-loader-alt animate-spin text-2xl'></i>
                                        pulseRows.map((_, index) =>
                                            <li key={index} className={`${sidebarRightCollapse ? "max-xl:w-full" : ""} border border-solid border-[#EBEDF0] min-h-[48px] h-12 w-[48%] pl-5 rounded-lg flex items-center text-[#444648] font-medium animate-pulse bg-neutral-200`}></li>
                                        )
                                        : treatmentsLoading === "Loaded" ? "No Treatments Found"
                                            : <li className={`${sidebarRightCollapse ? "max-xl:pl-0" : ""} p-5 w-full flex flex-col items-center justify-center text-[#444648] font-medium text-xs gap-1 h-full`}>
                                                <p>Error while Loading Treatments</p>
                                                <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listAllTreatments()}>Try Again</button>
                                            </li>
                                }
                            </ul>
                        </div>
                        <div className='absolute bottom-2 left-0 fading_bg w-[calc(100%-0px)] h-16 pointer-events-none'></div>
                    </div >

                    {/* <<<<<<<<<<----------Notes Section---------->>>>>>>>>> */}

                    <div className={`${sidebarRightCollapse ? "max-xl:px-0 max-xl:drop-shadow-none max-xl:bg-transparent" : ""} bg-white max-h[60%] p-5 rounded-md drop-shadow custom-transition`} style={{ height: notesExpanded ? 472 + (patientTreatments?.length * 48) : 372 + (patientTreatments?.length * 48) }}>
                        <div className='flex gap-2 items-center text-[#444648]'>
                            <div className={`${sidebarRightCollapse ? "max-xl:px-0" : ""} flex justify-center border border-solid border-[#EBEDF0] rounded-[20px] h-10 w-full items-center px-4 gap-2`}>
                                <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                                <input type="search" placeholder='Search for notes' className={`${sidebarRightCollapse ? "max-xl:hidden" : ""} outline-none w-full`} onChange={(event) => listDoctorNotes(selectedPatient.name, event.target.value)} />
                            </div>
                            <i className={`bx ${notesExpanded ? "bx-collapse" : "bx-expand"} ${sidebarRightCollapse ? "max-xl:hidden" : ""} text-xl cursor-pointer `} onClick={() => setNotesExpanded(!notesExpanded)}></i>
                        </div>
                        <div className={`${sidebarRightCollapse ? "max-xl:hidden" : ""} mt-2 h-[calc(100%-40px)] overflow-auto hide-scrollbar`}>
                            <ul className='flex flex-col gap-2 rounded-lg'>
                                <li className='p-5 flex flex-col justify-center bg-[#FDFAE1] text-[#444648] border-[#E7DBDB] rounded-sm font-medium text-xs gap-1 border border-dashed relative' onClick={() => { setIsNoteModalOpen(true); setNoteButton(false) }}>
                                    <div className='bg-[#46C31A] w-[3px] rounded-[3px] h-full absolute left-0 top-0 '></div>
                                    <div className='flex justify-between font-medium items-center'>
                                        <h6 className='text-sm'>Add title</h6>
                                    </div>
                                    <p className='text-[#8B8B8B]'>Description</p>
                                </li>
                                {notes.map((data, index) => {
                                    return (
                                        <li key={index} className='min-h-[75px] p-5 flex flex-col justify-center bg-[#FDFAE1] text-[#444648] border-[#E7DBDB] rounded-sm font-medium text-xs gap-1 border relative' onClick={() => { openNoteModal(data, true) }}>
                                            <div className='bg-[#46C31A] w-[3px] rounded-[3px] h-full absolute left-0 top-0 '></div>
                                            <div className='flex justify-between font-medium items-center'>
                                                <p className='whitespace-nowrap'>{moment(data.modified).format("DD-MMM-YYYY")}</p>
                                            </div>
                                            <p className='text-[#8B8B8B] whitespace-nowrap text-ellipsis overflow-hidden'>{data.note}</p>
                                        </li>
                                    )
                                })}
                                {notes.length ? ""
                                    : notesLoading === "Loading" ?
                                        pulseRows.map((_, index) =>
                                            <li key={index} className='min-h-[75px] p-5  flex flex-col justify-center bg-[#FDFAE1] text-[#444648] border-[#E7DBDB] rounded-sm font-medium text-xs gap-1 border box-border items-center relative animate-pulse'>
                                                <div className='bg-[#46C31A] w-[3px] rounded-[3px] h-full absolute left-0 top-0 '></div>
                                                <div className='bg-neutral-200 rounded h-4 w-full'></div>
                                                <div className='bg-neutral-200 rounded h-4 w-full'></div>
                                            </li>
                                        )
                                        : <li className='min-h-[75px] p-5  flex flex-col justify-center bg-[#FDFAE1] text-[#444648] border-[#E7DBDB] rounded-sm font-medium text-xs gap-1 border box-border items-center'>
                                            <p>{notesLoading === "Loaded" ? "No Notes Found" : "Error while Loading Notes"}</p>
                                            {notesLoading != "Loaded" && <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listDoctorNotes(selectedPatient.name)}>Try Again</button>}
                                        </li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* <<<<<<<<<<----------Add patient treatment---------->>>>>>>>>> */}

            <div className={`${treatmentOpen ? "bg-black" : "pointer-events-none"} bg-opacity-5 inset-0 fixed w-full z-[201]`}>
                {treatmentOpen && <div className='w-full h-full' onClick={closeModal}></div>}
                {/* The class custom-transition is in index.css file */}
                <div className={`${treatmentOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"} z-[200] custom-transition flex flex-col box-border bg-white h-full w-[337px] absolute right-0 top-[70px] text-xs overflow-auto`} style={{ height: "calc(100vh - 70px)" }}>
                    <h1 className='font-bold text-lg pl-7 h-6 my-7'>{!patientTreatmentButton && "Update "}Treatment details</h1>
                    <div className='flex justify-around text-[#616161] border-b font-medium'>
                        <p className={`${treatmentType === "Treatment" && 'text-[#4285F4] border-b-2 border-[#4285F4]'} h-7`} onClick={() => setTreatmentType("Treatment")} >Treatment</p>
                        <p className={`${treatmentType === "Proposed" && 'text-[#4285F4] border-b-2 border-[#4285F4]'} h-7`} onClick={() => setTreatmentType("Proposed")} >Proposed</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-wrap box-border justify-center items-center">
                            <p className='px-7 mt-4 w-full font-medium text-sm text-center'>{selectedTreatment?.name}</p>
                            {inputs.map((data, index) => {
                                return (
                                    <div key={index} className={`${selectedTreatment?.type === "CONDITION" && data.name === "custom_paid_amount" && "hidden"} px-7 mt-4 w-full`}>
                                        <p className='text-[#8A8A8A] leading-6 '>{data.head}</p>
                                        <div className="min-w-[280px] h-10 border border-solid border-[#DFDFDF] rounded-md font-medium flex items-center relative text-[#373434] gap-[2vw]">
                                            {data.types.map((obj, index) => {
                                                return (
                                                    obj.type === "select" ?
                                                        <select
                                                            name={data.name}
                                                            value={form[data.name]}
                                                            key={index}
                                                            onChange={handleChange}
                                                            className='flex gap-[1vw] items-center w-full h-full cursor-pointer rounded-md px-5 border-r-[12px] border-r-transparent focus:outline-none focus:ring-2 focus:ring-blue-400'
                                                            required={data.required}
                                                            disabled={loading}
                                                        >
                                                            {data.options.map((optionData, index) => {
                                                                return (
                                                                    <option key={index} hidden={optionData === "HALF_PAYMENT" || optionData === "WALKOUT"} value={optionData} className='rounded-md transition-all w-full px-5 h-full min-w-[26px]'>{optionData}</option>
                                                                )
                                                            })}
                                                        </select>
                                                        :
                                                        <div key={index} className={`flex gap-[1vw] items-center h-full rounded-md  w-full `}>
                                                            <input
                                                                type={obj.type}
                                                                // min={obj.type === "date" ? moment(new Date()).format("YYYY-MM-DD") : ""}
                                                                name={data.name}
                                                                className={obj.type != "radio" && obj.type != "checkbox" ? 'px-5 rounded-md outline-none w-full h-full min-w-[18px]' : "ml-5 outline-none h-4 w-4"}
                                                                onFocus={(event) => { obj.type === "date" && event.target.showPicker() }}
                                                                onChange={handleChange}
                                                                checked={obj.type === "radio" && form[data.name] === obj.text.toUpperCase()}
                                                                value={obj.type === "radio" ? obj.text.toUpperCase() : obj.type === "date" ? moment(form[data.name]).format("yyyy-MM-DD") : form[data.name]}
                                                                required={data.required}
                                                                disabled={loading || (!patientTreatmentButton && data.name !== "remarks")}
                                                            />
                                                            {obj.text && <span className='font-medium'>{obj.text}</span>}
                                                        </div>
                                                )
                                            })}
                                        </div>
                                        {data.name === "custom_paid_amount" && selectedPatient?.custom_scheme?.discount && patientTreatmentButton &&
                                            <div className='text-xs p-1 flex justify-between'>
                                                <p className='text-[#008000]'><i className="uil uil-tag-alt"></i>{selectedPatient?.custom_scheme?.discount}% Discount (<span className='max-w-[100px] overflow-hidden inline-block align-middle text-ellipsis whitespace-nowrap'>{selectedPatient?.custom_scheme?.name}</span>) Applied <i className="uil uil-check"></i></p>
                                                {/* <i className="fa-solid fa-circle-xmark cursor-pointer text-[#808080]"></i> */}
                                            </div>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                        <div className='my-6 flex justify-center gap-2.5'>
                            <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#4285F4] w-28 h-10 text-white rounded font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : patientTreatmentButton ? "Save" : "Update"}</button>
                            <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded font-medium`} onClick={() => { setTreatmentOpen(false) }} >Discard</button>
                        </div>
                        <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} absolute right-4 top-7`} onClick={closeModal} ><i className='bx bx-x text-2xl leading-7' /></button>
                    </form >
                </div >
            </div>

            {/* <<<<<<<<<<----------Add or Update Note Modal---------->>>>>>>>>> */}

            <>
                <Transition appear show={isNoteModalOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-[200] " onClose={closeModal}>
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
                                    leaveFrom="opacity-100 translate-x-0 scale-100 "
                                    leaveTo="opacity-0 translate-x-full scale-75"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-6">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-gray-900 font-semibold text-base"
                                        >
                                            {noteButton ?
                                                <p className="text-sm text-gray-500 font-medium mr-5">
                                                    {`${moment(selectedNote.modified).format("hh:mm A , DD-MMM-YYYY")} | Added by ${selectedNote.modified_by}`}
                                                </p>
                                                : "Add note"}
                                        </Dialog.Title>
                                        {noteButton ?
                                            <div className='flex bg-[#F3FFF2] rounded-lg px-4 py-3 text-sm border border-solid border-[#DFDFDF] whitespace-pre-wrap'>
                                                {selectedNote.note}
                                            </div>
                                            : <form action="" onSubmit={(event) => { event.preventDefault(); addDoctorNote() }}>
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
                                        <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} absolute right-5 top-6`} onClick={closeModal} ><i className='bx bx-x text-2xl leading-7' /></button>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </>

            {/* <<<<<<<<<<----------Add dental Condition modal---------->>>>>>>>>> */}

            <>
                <Transition appear show={isOpenDentalConditionModal} as={Fragment}>
                    <Dialog as="div" className="relative z-[500] " onClose={closeModal}>
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
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-6">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            <p className='font-semibold text-base'>
                                                {dentalConditionButton ? "Add Dental Condition" : "Update Dental Condition"}
                                            </p>
                                        </Dialog.Title>
                                        <form onSubmit={(event) => { event.preventDefault(); addDentalCondition() }} className='flex flex-col gap-5'>
                                            <div className='flex rounded-lg px-4 py-3 text-sm border border-solid border-[#DFDFDF]'>
                                                <input type="text" placeholder='Name' onChange={dentalFormHandleChange} value={dentalForm?.name} name='name' required disabled={loading} />
                                            </div>
                                            <div className='flex rounded-lg px-4 py-3 text-sm border border-solid border-[#DFDFDF]'>
                                                <input type="text" placeholder='Code' onChange={dentalFormHandleChange} value={dentalForm.code} name='code' required disabled={loading} />
                                            </div>
                                            <div className='flex gap-2.5'>
                                                <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#4285F4] w-28 h-10 text-white rounded font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Submit"}</button>
                                                <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded font-medium`} onClick={() => { setisOpenDentalConditionModal(false) }} >Discard</button>
                                            </div>
                                        </form>
                                        <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} absolute right-5 top-6`} onClick={closeModal} ><i className='bx bx-x text-2xl leading-7' /></button>
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

export default Overview
