import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { createPatientResponse, getAllForms, getFormWithId, getPatientAllFormResponse } from '../../Api/MedicalFormsApi.js'
import { ToastContext } from '../../contexts/ToastContext'
import { AppContext } from '../../contexts/AppContext'
import { getAllDocuments, getDocument } from '../../Api/DocumentsApi.js'
import DownloadAsPDF from "../DownloadAsPDF.jsx"
import DentSoft from "../../assets/DentalLogo.svg"
import { Document, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import moment from 'moment'

function Documents() {
    const [isOpen, setIsOpen] = useState(false)
    const DocumentContainerRef = useRef(null)
    const [parentContainerWidth, setParentContainerWidth] = useState(DocumentContainerRef.current?.clientWidth)
    const [documents, setDocuments] = useState([])
    const [Document, setDocument] = useState({})
    const { notify } = useContext(ToastContext)
    const { setViewDocument, addDocumentClicked, setAddDocumentClicked, selectedPatient, setDocumentForm, DocumentForm, setDocumentId } = useContext(AppContext)
    const [patientResponses, setPatientResponses] = useState([])
    const [loading, setLoading] = useState(false)
    const [patientResponsesLoading, setPatientResponsesLoading] = useState("Loaded")
    const [searchPatientResponse, setSearchPatientResponse] = useState("")
    const [searchDocument, setSearchDocument] = useState("")
    const [patientResponsesMeta, setPatientResponsesMeta] = useState({})
    const [DocumentsMeta, setDocumentsMeta] = useState({})
    const [DocumentsLoading, setDocumentsLoading] = useState("Loaded")
    const pulseRows = new Array(10).fill()
    const [form, setForm] = useState({
        patient_id: selectedPatient.id,
        medical_form_id: "",
        response: []
    })
    const addPatientResponse = async (id) => {
        try {
            const payload = form;
            const result = await createPatientResponse(payload, id);
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
            console.log(result.data.data)
            setPatientResponses(result.data.data)
            setPatientResponsesMeta(result.data.meta)
            setPatientResponsesLoading("Loaded")
        } catch (error) {
            setPatientResponsesLoading("Error")
            console.log(error)
        }
    }
    const listAllDocuments = async (search = "", page = 0, size = "") => {
        setDocumentsLoading("Loading")
        setDocuments([])
        try {
            const result = await getAllDocuments(search, page, size);
            setDocuments(result.data.data)
            // console.log(result.data.data)
            setDocumentsMeta(result.data.meta)
            setDocumentsLoading("Loaded")
        } catch (error) {
            console.log(error)
            setDocumentsLoading("Error")
        }
    }
    const listDocumentWithId = async (id) => {
        try {
            const result = await getDocument(id);
            console.log(result.data.data)
            setDocument(result.data.data)
        } catch (error) {

        }
    }
    const handleResize = () => {
        setParentContainerWidth(DocumentContainerRef.current.clientWidth)
    }
    const handleChange = (event, data) => {
        const { name, value } = event.target;
        setForm(prev => {
            const index = prev.response.findIndex(obj => obj.input_field_id === name)
            console.log(value)
            if (index != -1)
                prev.response.splice(index, 1, { input_field_id: name, answer: value })
            else
                return { ...prev, medical_form_id: Document.form.id, response: [...prev.response, { input_field_id: name, answer: value }] }
            return { ...prev, medical_form_id: Document.form.id }
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        if (!loading) {
            setLoading(true)
            addPatientResponse(Document.form.id)
            console.log(form)
            closeModal();
        }
    }
    function openModal() {
        setIsOpen(true)
        setForm({
            patient_id: selectedPatient.id,
            medical_form_id: "",
            response: []
        })
    }
    function closeModal() {
        if (!loading) {
            setIsOpen(false)
            setDocument({})
            setForm({})
            console.log(DocumentForm)
        }
    }
    useEffect(() => {
        listAllDocuments(searchDocument, DocumentsMeta.page, DocumentsMeta.size)
        // listPatientResponses(selectedPatient.id, searchPatientResponse, patientResponsesMeta.page, patientResponsesMeta.size) not confirmed is this needed? this is copied from medical history
        handleResize();
    }, [])
    window.onresize = handleResize;
    return (
        <div className={`bg-[#FAFAFD] text-[#444648] flex flex-col pl-7 p-5 box-border min-h-full ${addDocumentClicked ? "slide2" : "fade_in"}`}>
            {/* downloads */}

            < div >
                {/* heading and search bar */}
                < div className='flex gap-5 items-center font-semibold' >
                    {/* <p className='text-[22px] '>Documents</p> */}
                    <div className='flex bg-white font-normal border border-solid border-[#EBEDF0] rounded-[20px] h-10 items-center px-4 gap-2'>
                        <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                        <input type="search" placeholder='Search for Documents' className='outline-none w-full' value={searchDocument} onChange={(event) => { setSearchDocument(event.target.value); listAllDocuments(event.target.value, DocumentsMeta.page, DocumentsMeta.size); }} />
                    </div>
                    <button onClick={() => { setViewDocument(false); setAddDocumentClicked(true); setDocumentId("") }} className='bg-[#4285F4] rounded-[20px] h-10 px-6 text-white ml-auto hover:bg-[#2070F5] '>Add Document</button>
                </div>
                {/* downloading navs */}
                <div ref={DocumentContainerRef} className='flex flex-wrap font-medium gap-4 w-full py-5'>
                    {documents?.map((Document, index) =>
                        <div key={index} className='bg-white flex items-center border border-solid border-[#DCDCDC] rounded-lg h-14 min-w-[320px] w-[calc(100%/3-0.7rem)] ' onClick={() => { openModal(); listDocumentWithId(Document.id) }}>
                            {/* <img className='px-5 py-3' src={Doc} alt="" /> */}
                            <i className='bx bx-file px-5 border-r text-2xl text-[#B1B1B1]'></i>
                            <p className='px-5'>{Document.title}</p>
                            <i className='bx bx-download ml-auto mr-4 px-2 py-1 rounded-full bg-blue-50 text-[#5E81FF] text-2xl cursor-pointer'></i>
                        </div>
                    )}
                    {documents?.length ?
                        <div className={`${parentContainerWidth / 3 < 330.5 ? "w-[656px]" : "w-[calc(99%+2rem)]"} box-border bg-white border border-solid border-[#DCDCDC] rounded-lg h-10 min-w-[656px] flex gap-5 justify-end items-center px-5`}>
                            <i className='bx bx-rotate-right mr-auto cursor-pointer text-lg' onClick={() => listAllDocuments(searchDocument, DocumentsMeta.page, DocumentsMeta.size)}></i>
                            <p>Total Document :&nbsp; {documents?.length} / {DocumentsMeta.total}</p>
                            <p>page {DocumentsMeta.page + 1} of {Math.floor(((DocumentsMeta.total - 1) / DocumentsMeta.size) + 1)}</p>
                            <div className={`${DocumentsMeta.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { DocumentsMeta.page != 0 && listAllDocuments(searchDocument, DocumentsMeta.page - 1, DocumentsMeta.size) }}>
                                &lt;
                            </div>
                            <div className={`${DocumentsMeta.page < Math.floor((DocumentsMeta.total - 1) / DocumentsMeta.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { DocumentsMeta.page < Math.floor((DocumentsMeta.total - 1) / DocumentsMeta.size) && listAllDocuments(searchDocument, DocumentsMeta.page + 1, DocumentsMeta.size) }}>
                                &gt;
                            </div>
                            <p>size :
                                <select name="" id="" defaultValue={DocumentsMeta.size} onChange={(event) => listAllDocuments(searchDocument, "", event.target.value)} className='default-select-icon'>
                                    <option value="5">5 </option>
                                    <option value="10">10 </option>
                                    <option value="15">15 </option>
                                    <option value="20">20 </option>
                                    <option value="50">50 </option>
                                </select>
                            </p>
                        </div>
                        : <div className='box-border min-h-[60px] w-full flex justify-center items-center'>
                            {DocumentsLoading === "Loading" ?
                                <div className='flex flex-wrap font-medium gap-4 w-full'>
                                    {pulseRows?.map((_, index) =>
                                        <div key={index} className='bg-neutral-200 animate-pulse flex items-center border border-solid border-[#DCDCDC] rounded-lg h-14 min-w-[320px] w-[calc(100%/3-0.7rem)] '></div>
                                    )}
                                    <div className={`${parentContainerWidth / 3 < 330.5 ? "w-[656px]" : "w-[calc(99%+2rem)]"} h-10 min-w-[656px] box-border bg-neutral-200 animate-pulse border border-solid border-[#DCDCDC] rounded-lg flex gap-5 justify-end items-center px-5`}>
                                    </div>
                                </div>
                                : DocumentsLoading === "Loaded" ? "No Document Found"
                                    : <div className='flex flex-col justify-center items-center'>
                                        <p>Error while Loading Document</p>
                                        <button className='bg-[#4285F4] rounded h-[20px] px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listAllDocuments(searchDocument, DocumentsMeta.page, DocumentsMeta.size)}>Try Again</button>
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
                                        <td>{moment(data.createdAt).format("DD-MMM-YYYY")}</td>
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
                            <p>Total Responses :&nbsp; {patientResponses?.length} / {patientResponsesMeta.total}</p>
                            <p>page {patientResponsesMeta.page + 1} of {Math.floor(((patientResponsesMeta.total - 1) / patientResponsesMeta.size) + 1)}</p>
                            <div className={`${patientResponsesMeta.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { patientResponsesMeta.page != 0 && listPatientResponses(selectedPatient.id, searchPatientResponse, patientResponsesMeta.page - 1, patientResponsesMeta.size) }}>
                                &lt;
                            </div>
                            <div className={`${patientResponsesMeta.page < Math.floor((patientResponsesMeta.total - 1) / patientResponsesMeta.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { patientResponsesMeta.page < Math.floor((patientResponsesMeta.total - 1) / patientResponsesMeta.size) && listPatientResponses(selectedPatient.id, searchPatientResponse, patientResponsesMeta.page + 1, patientResponsesMeta.size) }}>
                                &gt;
                            </div>
                            <p>size :
                                <select name="" id="" defaultValue={patientResponsesMeta.size} onChange={(event) => listPatientResponses(selectedPatient.id, searchPatientResponse, "", event.target.value)}>
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
                                            <td className='pl-'><div className='bg-neutral-200 rounded h-4 w-5'></div></td>
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

            {/* Fill Document || View document with id */}

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
                                        <PDFViewer>
                                            <DownloadAsPDF data={Document} />
                                        </PDFViewer>
                                        {Document.title ?
                                            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                                                < div className='w-full drop-shadow bg-white rounded-md p-3 overflow-auto' >
                                                    <div className='p-3 text-black flex flex-col gap-3'>
                                                        <div className='flex justify-center'>
                                                            <img src={DentSoft} alt="" />
                                                        </div>
                                                        <h1 className='text-xl font-semibold'>{Document.title}</h1>
                                                        <p className='text-gray-600 font-medium text-xs whitespace-pre-wrap'>{Document.description}</p>
                                                        {/* signature  */}
                                                        <div className='text-xs w-full flex gap-2'>
                                                            {Document.doctor_signature && <div className='border p-5 rounded-md w-full'>
                                                                <p>Doctor : </p>
                                                                <p className='mt-4'>Signature : </p>
                                                            </div>}
                                                            {Document.patient_signature && <div className='border p-5 rounded-md w-full'>
                                                                <p>Patient : </p>
                                                                <p className='mt-4'>Signature : </p>
                                                            </div>}
                                                        </div>
                                                        {Document.clinic_stamp &&
                                                            <i className="bx bxs-certification text-[200px] text-red-700 absolute bottom-0 left-0 opacity-50" />
                                                        }
                                                    </div>
                                                </div >
                                                <div className='mb-6 flex gap-[10px]'>
                                                    <PDFDownloadLink document={<DownloadAsPDF data={Document} />} fileName={`${Document?.title}-document${""}`}>
                                                        <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#4285F4] w-28 h-10 text-white rounded-[5px] font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Download"}</button>
                                                    </PDFDownloadLink>
                                                    <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded-[5px] font-medium`} onClick={closeModal} >Discard</button>
                                                    {Document.editable && <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#4285F4] ml-auto w-20 h-10 text-white rounded-[5px] font-bold`} onClick={() => {
                                                        setDocumentForm(Document);
                                                        setViewDocument(false);
                                                        setAddDocumentClicked(true);
                                                        setDocumentId(Document.id)
                                                    }}>Edit</button>}
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

export default Documents
