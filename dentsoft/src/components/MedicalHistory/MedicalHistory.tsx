import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { createPatientResponse, generatePatientResponseId, getAllForms, getFormWithId, getPatientAllFormResponse } from '../../Api/MedicalFormsApi'
import { ToastContext } from '../../contexts/ToastContext'
import { AppContext } from '../../contexts/AppContext'
import { PDFViewer, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import DownloadPDFButton from '../DownloadAsPDF'
import moment from 'moment/moment'

function MedicalHistory() {
    const [isOpen, setIsOpen] = useState(false)
    const medFormContainerRef = useRef(null)
    const [parentContainerWidth, setParentContainerWidth] = useState(medFormContainerRef?.current?.clientWidth)
    const [medForms, setMedForms] = useState([])
    const [medForm, setMedForm] = useState({})
    const { notify } = useContext(ToastContext)
    const { setViewMedical, addMedicalClicked, setAddMedicalClicked, selectedPatient, setMedicalForm, medicalForm, setMedicalFormId } = useContext(AppContext)
    const [patientResponses, setPatientResponses] = useState([])
    const [loading, setLoading] = useState(false)
    const [patientResponsesLoading, setPatientResponsesLoading] = useState("Loaded")
    const [searchPatientResponse, setSearchPatientResponse] = useState("")
    const [searchMedForm, setSearchMedForm] = useState("")
    const [patientResponsesMeta, setPatientResponsesMeta] = useState({})
    const [medFormsMeta, setMedFormsMeta] = useState({})
    const [MedFormsLoading, setMedformsLoading] = useState("Loaded")
    const pulseRows = new Array(10).fill()
    const [form, setForm] = useState({
        // patient_id: selectedPatient.id,
        // medical_form_id: "",
        response: []
    })
    const generatePatientResponse = async (medFormId) => {
        try {
            const payload = { patient_id: selectedPatient.id, medical_form_id: medForm.form?.id };
            const result = await generatePatientResponseId(payload);
            // notify("Patinet Response Added successfully", "success")
            // listPatientResponses(selectedPatient.id)
            console.log(result)
            return result
        } catch (error) {
            console.log(error)
            notify(error.message, "error")
        }
        setLoading(false)
    }
    const addPatientResponse = async (patientFormId) => {
        try {
            const payload = { ...form, patient_form_id: patientFormId };
            const result = await createPatientResponse(payload);
            notify("Patinet Response Added successfully", "success")
            listPatientResponses(selectedPatient.id)
        } catch (error) {
            console.log(error)
            notify(error.message, "error")
        }
        setLoading(false)
    }
    const listPatientResponses = async (id, search = "", page = 0, size = "") => {
        setPatientResponsesLoading("Loading")
        setPatientResponses([])
        try {
            const result = await getPatientAllFormResponse(id, search, page, size)
            // page ? (setPatientResponses(([...patientResponses, ...result.data.data])), setPatientResponsePage(patientResponsePage + 1)) : (setPatientResponses(result.data.data), setPatientResponsePage(1))
            console.log(result.data.data)
            setPatientResponses(result.data.data)
            setPatientResponsesMeta(result.data.meta)
            setPatientResponsesLoading("Loaded")
        } catch (error) {
            setPatientResponsesLoading("Error")
            console.log(error)
        }
    }
    const listAllMedForms = async (search = "", page = 0, size = "") => {
        setMedformsLoading("Loading")
        setMedForms([])
        try {
            const result = await getAllForms(selectedPatient.name, search, page, size);
            // console.log(result.data.data)
            setMedForms(result.data.data)
            setMedFormsMeta(result.data.meta)
            setMedformsLoading("Loaded")
        } catch (error) {
            console.log(error)
            setMedformsLoading("Error")
        }
    }
    const listMedFormWithId = async (id) => {
        try {
            const result = await getFormWithId(id);
            console.log(result.data.data)
            setMedForm(result.data.data)
        } catch (error) {

        }
    }
    const handleResize = () => {
        setParentContainerWidth(medFormContainerRef?.current?.clientWidth)
    }
    const handleChange = (event, data) => {
        const { name, value } = event.target;
        setForm(prev => {
            const index = prev.response.findIndex(obj => obj.input_field_id === name)
            // console.log(value)
            if (index != -1)
                prev.response.splice(index, 1, { input_field_id: name, answer: value })
            else
                return { ...prev, response: [...prev.response, { input_field_id: name, answer: value }] }
            return { ...prev }
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        if (!loading) {
            setLoading(true)
            generatePatientResponse().then((response) => {
                addPatientResponse(response.id)
                closeModal();
            }).catch(error => console.log(error))
        }
    }
    function openModal() {
        setIsOpen(true)
        setForm({
            // patient_id: selectedPatient.id,
            // medical_form_id: "",
            response: []
        })
    }
    function closeModal() {
        if (!loading) {
            setIsOpen(false)
            setMedForm({})
            setForm({})
            console.log(medicalForm)
        }
    }
    window.onresize = handleResize;
    useEffect(() => {
        listAllMedForms(searchMedForm, medFormsMeta.page, medFormsMeta.size)
        listPatientResponses(selectedPatient.name, searchPatientResponse, patientResponsesMeta.page, patientResponsesMeta.size)
        handleResize();
    }, [])

    return (
        <div className={`bg-[#FAFAFD] text-[#444648] flex flex-col pl-7 p-5 box-border min-h-full ${addMedicalClicked && "slide2"} fade_in`}>

            < div >
                {/* heading and search bar */}
                < div className='flex gap-5 items-center font-semibold' >
                    {/* <p className='text-[22px] '>Medical history</p> */}
                    <div className='flex bg-white font-normal border border-solid border-[#EBEDF0] rounded-[20px] h-10 items-center px-4 gap-2'>
                        <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                        <input type="search" placeholder='Search for responses' className='outline-none w-full' value={searchMedForm} onChange={(event) => { setSearchMedForm(event.target.value); listAllMedForms(event.target.value, medFormsMeta.page, medFormsMeta.size); }} />
                    </div>
                    <button onClick={() => { setViewMedical(false); setAddMedicalClicked(true); setMedicalFormId("") }} className='bg-[#4285F4] rounded-[20px] h-10 px-6 text-white ml-auto hover:bg-[#2070F5] '>Add Form</button>
                </div>
                {/* downloading navs */}
                <div ref={medFormContainerRef} className='flex flex-wrap font-medium gap-4 w-full py-5'>
                    {medForms?.map((medForm, index) =>
                        <div key={index} className='bg-white flex items-center border border-solid border-[#DCDCDC] rounded-lg h-14 min-w-[320px] w-[calc(100%/3-0.7rem)] '
                            onClick={() => { openModal(); listMedFormWithId(medForm.id) }}
                        >
                            <i className='bx bx-file px-5 border-r text-2xl text-[#B1B1B1]'></i>
                            <p className='px-5'>{medForm.name}</p>
                            {/* <DownloadPDFButton data={medForm}> */}
                            <i className='bx bx-download ml-auto mr-4 px-2 py-1 rounded-full bg-blue-50 text-[#5E81FF] text-2xl cursor-pointer' onClick={() => listMedFormWithId(medForm.id)}></i>
                            {/* </DownloadPDFButton> */}
                        </div>
                    )}
                    {medForms?.length ?
                        <div className={`${parentContainerWidth / 3 < 330.5 ? "w-[656px]" : "w-[calc(99%+2rem)]"} box-border bg-white border border-solid border-[#DCDCDC] rounded-lg h-10 min-w-[656px] flex gap-5 justify-end items-center px-5`}>
                            <i className='bx bx-rotate-right mr-auto cursor-pointer text-lg' onClick={() => listAllMedForms(searchMedForm, medFormsMeta.page, medFormsMeta.size)}></i>
                            <p>Total Medical Forms :&nbsp; {medForms.length} / {medFormsMeta.total}</p>
                            <p>page {medFormsMeta.page + 1} of {Math.floor(((medFormsMeta.total - 1) / medFormsMeta.size) + 1)}</p>
                            <div className={`${medFormsMeta.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { medFormsMeta.page != 0 && listAllMedForms(searchMedForm, medFormsMeta.page - 1, medFormsMeta.size) }}>
                                &lt;
                            </div>
                            <div className={`${medFormsMeta.page < Math.floor((medFormsMeta.total - 1) / medFormsMeta.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { medFormsMeta.page < Math.floor((medFormsMeta.total - 1) / medFormsMeta.size) && listAllMedForms(searchMedForm, medFormsMeta.page + 1, medFormsMeta.size) }}>
                                &gt;
                            </div>
                            <p>size :
                                <select name="" id="" defaultValue={medFormsMeta.size} onChange={(event) => listAllMedForms(searchMedForm, "", event.target.value)} className='default-select-icon'>
                                    <option value="5">5 </option>
                                    <option value="10">10 </option>
                                    <option value="15">15 </option>
                                    <option value="20">20 </option>
                                    <option value="50">50 </option>
                                </select>
                            </p>
                        </div>
                        : <div className='box-border min-h-[60px] w-full flex justify-center items-center'>
                            {MedFormsLoading === "Loading" ?
                                <div className='flex flex-wrap font-medium gap-4 w-full'>
                                    {pulseRows?.map((_, index) =>
                                        <div key={index} className='bg-neutral-200 animate-pulse flex items-center border border-solid border-[#DCDCDC] rounded-lg h-14 min-w-[320px] w-[calc(100%/3-0.7rem)] '></div>
                                    )}
                                    <div className={`${parentContainerWidth / 3 < 330.5 ? "w-[656px]" : "w-[calc(99%+2rem)]"} h-10 min-w-[656px] box-border bg-neutral-200 animate-pulse border border-solid border-[#DCDCDC] rounded-lg flex gap-5 justify-end items-center px-5`}>
                                    </div>
                                </div>
                                : MedFormsLoading === "Loaded" ? "No Medical Forms Found"
                                    : <div className='flex flex-col justify-center items-center'>
                                        <p>Error while Loading Medical Forms</p>
                                        <button className='bg-[#4285F4] rounded h-[20px] px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listAllMedForms(searchMedForm, medFormsMeta.page, medFormsMeta.size)}>Try Again</button>
                                    </div>}
                        </div>
                    }
                </div>
            </div >

            {/* table  */}

            < div className='bg-white pl-[35px] pt-[20px] rounded-md drop-shadow' >
                <div className='flex gap-5 items-center'>
                    <p className='text-base font-semibold'>Responses</p>
                    <div className='flex border border-solid border-[#EBEDF0] rounded-[20px] h-10 items-center px-4 gap-2'>
                        <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                        <input type="search" placeholder='Search for responses' className='outline-none w-full' onChange={(event) => { listPatientResponses(selectedPatient.id, event.target.value, patientResponsesMeta.page, patientResponsesMeta.size); setSearchPatientResponse(event.target.value) }} />
                    </div>
                </div>
                <div className='max-h-[420px] overflow-auto pr-[25px] pt-1'>
                    <table className='w-full table-fixed'>
                        <thead className="text-[#303030]">
                            <tr className='h-[60px]'>
                                <th className='w-[5%]'>No.</th>
                                <th>Date</th>
                                <th>Form name</th>
                                <th className='w-1/3'>Form link</th>
                            </tr>
                        </thead>
                        <tbody className='text-[#444648]'>
                            {patientResponses?.map((data, index) => {
                                return (
                                    <tr key={index} className='box-border h-[60px]'>
                                        <td>{index + 1}</td>
                                        <td>{moment(data.updateAt).format("DD-MMM-YYYY")}</td>
                                        <td>{data.medical_form?.name}</td>
                                        <td className='text-[#446DFF] text-ellipsis overflow-hidden whitespace-nowrap'>{data.link}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {patientResponses?.length ?
                        <div className='box-border h-11 bg-white flex gap-5 justify-end items-center pl-0 p-2'>
                            <i className='bx bx-rotate-right mr-auto cursor-pointer text-lg' onClick={() => listPatientResponses(selectedPatient.id, searchPatientResponse, patientResponsesMeta.page, patientResponsesMeta.size)}></i>
                            <p>Total Responses :&nbsp; {patientResponses.length} / {patientResponsesMeta.total}</p>
                            <p>page {patientResponsesMeta.page + 1} of {Math.floor(((patientResponsesMeta.total - 1) / patientResponsesMeta.size) + 1)}</p>
                            <div className={`${patientResponsesMeta.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { patientResponsesMeta.page != 0 && listPatientResponses(selectedPatient.id, searchPatientResponse, patientResponsesMeta.page - 1, patientResponsesMeta.size) }}>
                                &lt;
                            </div>
                            <div className={`${patientResponsesMeta.page < Math.floor((patientResponsesMeta.total - 1) / patientResponsesMeta.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { patientResponsesMeta.page < Math.floor((patientResponsesMeta.total - 1) / patientResponsesMeta.size) && listPatientResponses(selectedPatient.id, searchPatientResponse, patientResponsesMeta.page + 1, patientResponsesMeta.size) }}>
                                &gt;
                            </div>
                            <p>size :
                                <select name="" id="" defaultValue={patientResponsesMeta.size} onChange={(event) => listPatientResponses(selectedPatient.id, searchPatientResponse, "", event.target.value)} className='default-select-icon'>
                                    <option value="5">5 </option>
                                    <option value="10">10 </option>
                                    <option value="15">15 </option>
                                    <option value="20">20 </option>
                                    <option value="50">50 </option>
                                </select>
                            </p>
                        </div>
                        : <div className='box-border min-h-[60px] bg-white flex justify-center items-center'>
                            {patientResponsesLoading === "Loading" ?
                                <table className="w-full table-fixed">
                                    <tbody>
                                        {pulseRows?.map((_, index) =>
                                            <tr key={index} className="animate-pulse h-[60px]">
                                                <td className="w-[5%]"><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                <td className='w-1/3'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            </tr>
                                        )}
                                        <tr className="animate-pulse h-11">
                                            <td className=''><div className='bg-neutral-200 rounded h-4 w-5'></div></td>
                                            <td></td>
                                            <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                        </tr>
                                    </tbody>
                                </table>
                                : patientResponsesLoading === "Loaded" ? "No Responses Found"
                                    : <div className='flex flex-col justify-center items-center'>
                                        <p>Error while Loading Responses</p>
                                        <button className='bg-[#4285F4] rounded h-[20px] px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listPatientResponses(selectedPatient.id, searchPatientResponse, patientResponsesMeta.page, patientResponsesMeta.size)}>Try Again</button>
                                    </div>}
                        </div>
                    }
                </div>
            </div >

            {/* Fill Medical Form || View medical form with id */}

            <>
                <Transition appear show={isOpen} as={Fragment}>
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
                                    <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-6">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                        </Dialog.Title>
                                        {medForm.form_input_fields ?
                                            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                                                <p className='font-medium text-black text-lg text-center'>{medForm.form?.name}</p>
                                                {medForm.form_input_fields?.map((data, index) =>
                                                    <div key={index} className='flex items-center gap-5 justify-between'>
                                                        {/* inputField's question */}
                                                        <p className='font-medium text-black w-1/2'>{data.required && "* "}{data.question}</p>
                                                        {/* inputField's Options */}
                                                        <div className='h-10 font-medium flex items-center w-1/2 p-0.5 relative text-[#373434] gap-[1vw] overflow-auto'>
                                                            {data.type === "DROP_DOWN" ?
                                                                <select
                                                                    className='px-2 items-center h-full rounded-md bg-transparent border border-solid border-[#DFDFDF] focus:outline-none focus:ring-2 focus:ring-blue-400'
                                                                    name={data.id}
                                                                    onChange={(event) => handleChange(event, data)}
                                                                    required={data.required}
                                                                    disabled={loading}
                                                                >
                                                                    <option hidden value=""></option>
                                                                    {data.options?.map((option, optionIndex) =>
                                                                        <option key={optionIndex} value={option}>{option}</option>
                                                                    )}
                                                                </select>
                                                                : data.options?.length ? data.options.map((option, optionIndex) =>
                                                                    <div key={optionIndex} className='flex gap-[1vw] p-2 items-center h-full rounded-md whitespace-nowrap'>
                                                                        <input
                                                                            type={data.type === "CHECKBOX" ? "radio" : data.type === "MULTIPLE_CHOICE" ? "checkbox" : data.type.toLowerCase()}
                                                                            className={`${data.type != "MULTIPLE_CHOICE" && data.type != "CHECKBOX" ? "px-5 w-full border border-solid border-[#DFDFDF] rounded-md h-full" : ""}`}
                                                                            name={data.id}
                                                                            value={option}
                                                                            onChange={(event) => handleChange(event, data)}
                                                                            required={data.type != "MULTIPLE_CHOICE" ? data.required : false}
                                                                            disabled={loading}
                                                                        />
                                                                        <p>{option}</p>
                                                                    </div>
                                                                ) :
                                                                    <div className='flex gap-[1vw] items-center h-full rounded-md'>
                                                                        <input
                                                                            type={data.type.toLowerCase()}
                                                                            name={data.id}
                                                                            className={`px-5 w-full border border-solid border-[#DFDFDF] rounded-md h-full`}
                                                                            onChange={(event) => handleChange(event, data, index)}
                                                                            required={data.required}
                                                                            disabled={loading}
                                                                        />
                                                                    </div>
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                                <div className='mb-6 flex gap-[10px]'>
                                                    <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#4285F4] w-28 h-10 text-white rounded-[5px] font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Save"}</button>
                                                    <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded-[5px] font-medium`} onClick={closeModal} >Discard</button>
                                                    <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#4285F4] ml-auto w-20 h-10 text-white rounded-[5px] font-bold`} onClick={() => {
                                                        setMedicalForm(
                                                            {
                                                                name: medForm.form.name,
                                                                description: medForm.form.description,
                                                                is_document: false,
                                                                input_fields: [...medForm.form_input_fields.map(data => ({ type: data.type, required: data.required, question: data.question, options: data.options }))]
                                                            });
                                                        setViewMedical(false);
                                                        setAddMedicalClicked(true);
                                                        setMedicalFormId(medForm.form.id)
                                                    }}>Edit</button>
                                                </div>
                                            </form>
                                            :
                                            <div className='flex justify-center'>
                                                <i className='bx bx-loader-alt animate-spin text-2xl'></i>
                                            </div>
                                        }
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

export default MedicalHistory
