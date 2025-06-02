import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import QuestionMark from "../../assets/Question-mark.svg"
// import Close from "../../assets/Close.svg"
import { ToastContext } from '../../contexts/ToastContext'
import { createTreatment, deleteTreatment, getAllTreatments, updateTreatment } from '../../Api/TreatmentApi'
import { getTreatmentList } from '../../hooks/useTreatment'

function Treatments() {

    const { notify } = useContext(ToastContext)
    const [isOpen, setIsOpen] = useState(false)
    const [isConfirmBoxOpen, setIsConfirmBoxOpen] = useState(false)
    const [confirmBoxValue, setConfirmBoxValue] = useState("")
    const [confirmBoxError, setConfirmBoxError] = useState("")
    // const [treatmentsLoading, setTreatmentsLoading] = useState("Loaded")
    const [treatmentButton, setTreatmentButton] = useState(true)
    const [selectedTreatment, setSelectedTreatment] = useState("")
    const [loading, setLoading] = useState(false);
    // const [treatments, setTreatments] = useState([]);
    const [treatmentsMeta, setTreatmentsMeta] = useState({})
    const [currentTab, setCurrentTab] = useState("Active Treatments")
    const [searchTreatment, setSearchTreatment] = useState("")
    const tabs = ["Active Treatments", "Inactive Treatments"]
    const inputs = [
        { head: "Name", types: [{ type: "text" }], name: "template", required: true },
        { head: "Code", types: [{ type: "text" }], name: "item_code", required: true },
        { head: "Price", types: [{ type: "number" }], name: "rate", required: true },
        { head: "Type", types: [{ text: "Procedure", type: "radio" }, { text: "Condition", type: "radio" }], name: "custom_condition", required: true },
        { head: "Status", types: [{ type: "select" }], options: ["active", "inactive"], name: "disabled", required: true },
    ]
    const pulseRows = new Array(10).fill()
    const [form, setForm] = useState({
        item_code: "",
        template: "",
        description: "Treatment Name",
        item_group: "services",
        rate: "",
        custom_condition: "",
        disabled: 0,
    })

    const { data: treatments, isLoading: treatmentsLoading, error: treatmentsError, mutate: refreshTreatments } = getTreatmentList(searchTreatment, currentTab === "Active Treatments");


    const Addtreatment = async () => {
        try {
            const payload = form;
            const result = await createTreatment(payload);
            listTreatments(searchTreatment, treatmentsMeta?.page, treatmentsMeta?.size, `${currentTab === "Active Treatments"}`);
            console.log(result)
            notify("Treatment Added SuccessFully", "success")
            closeModal()

        } catch (error) {
            console.log(error)
            notify(error.message, "error")
        }
        setLoading(false)
    }
    const listTreatments = async (search = "", page = 0, size = "", active = "") => {
        setTreatmentsLoading("Loading")
        setTreatments([])
        try {
            const result = await getAllTreatments(search, page, size, active);
            // console.log(result.data.data)
            // page ? (setTreatments(prev => ([...treatments, ...result.data.data])), setTreatmentPage(treatmentPage + 1)) : (setTreatments(result.data.data), setTreatmentPage(1))
            setTreatments(result.data.data)
            setTreatmentsLoading("Loaded")
            setTreatmentsMeta(result.data.meta)
        } catch (error) {
            console.log(error)
            setTreatmentsLoading("Error")
        }
    }
    const editTreatment = async (id) => {
        try {
            const payload = form;
            const result = await updateTreatment(payload, id)
            listTreatments(searchTreatment, treatmentsMeta?.page, treatmentsMeta?.size, `${currentTab === "Active Treatments"}`)
            notify("Treatment Updated SuccessFully", "success")
            closeModal()
        } catch (error) {
            console.log(error)
            notify(error.message, "error")
        }
        setLoading(false)
    }
    const removeTreatment = async (id) => {
        setLoading(true)
        try {
            const result = await deleteTreatment(id);
            notify("Treatment Deleted Successfully", "success")
            listTreatments(searchTreatment, treatmentsMeta?.page, treatmentsMeta?.size, `${currentTab === "Active Treatments"}`);
            closeModal()
        } catch (error) {
            console.log(error)
            notify(error.message, "error")
        }
        setLoading(false)
    }
    const handleTreatmentSubmit = (event) => {
        event.preventDefault();
        if (!loading) {
            console.log(form)
            setLoading(true)
            if (treatmentButton)
                Addtreatment();
            else
                editTreatment(selectedTreatment.id)
        }
    };
    const handleChange = (event) => {
        const { value, name, type } = event.target
        type === "number" ?
            value === "" ?
                setForm((prev) => ({ ...prev, [name]: value, }))
                : setForm((prev) => ({ ...prev, [name]: Number(value), }))
            : name === "custom_condition" ?
                setForm((prev) => ({ ...prev, [name]: value === "Condition" ? 1 : 0, }))
                :
                setForm((prev) => ({ ...prev, [name]: value, }))
    }
    function closeModal() {
        if (!loading) {
            setIsConfirmBoxOpen(false)
            setConfirmBoxValue("")
            setConfirmBoxError("")
            setIsOpen(false)
            setForm({
                item_code: "",
                template: "",
                description: "Treatment Name",
                item_group: "services",
                rate: "",
                condition: "",
                disabled: 0,
            })
        }
    }
    function openModal() {
        setIsOpen(true)
    }
    useEffect(() => {
        // listTreatments(searchTreatment, treatmentsMeta?.page, treatmentsMeta?.size, `${currentTab === "Active Treatments"}`);
    }, [])
    return (
        <div className='bg-[#FAFAFD] text-[#444648] flex flex-col p-7 box-border min-h-full overflow-auto fade_in'>

            {/* <<<<<<<<<<----------Heading---------->>>>>>>>>> */}

            <div>
                <div className='flex gap-2 items-center relative pb-6 head_with_qstn_mark'>
                    <h2 className='text-xl font-semibold'>Treatments</h2>
                    <img src={QuestionMark} alt="" />
                    <p className='absolute w-52 bg-black text-white rounded-md px-2 py-1 text-xs left-44'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut </p>
                </div>
            </div>


            <div className='flex items-center justify-between'>
                {/* The Tabs switching buttons are in below div  */}
                <div className='text-[#5DB370] flex gap-1'>
                    {tabs?.map((tab, index) =>
                        <button key={index} className={`${currentTab === tab ? "bg-[#5DB370] text-white" : "hover:bg-[#5db37033]"} rounded-md border-[#5DB370] border-[.5px] border-solid h-10 px-4 font-semibold custom-transition`} name={tab} onClick={() => { setCurrentTab(tab); listTreatments(searchTreatment, "", treatmentsMeta?.size, `${tab === "Active Treatments"}`); }}>{tab}</button>
                    )}
                </div>
                <div className='flex gap-3'>
                    <div className='flex border border-solid bg-white border-[#EBEDF0] rounded-[20px] h-10 items-center px-4 gap-2 '>
                        <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                        <input type="search" placeholder='Search' className='outline-none w-full bg-transparent' value={searchTreatment} onChange={(event) => { listTreatments(event.target.value, treatmentsMeta?.page, treatmentsMeta?.size, `${currentTab === "Active Treatments"}`); setSearchTreatment(event.target.value) }} />
                    </div>
                    <button onClick={() => { openModal(); setTreatmentButton(true) }} className='bg-[#4285F4] rounded-[20px] h-9 px-4 font-semibold text-white hover:bg-[#2070F5]'>Add Treatments</button>
                </div>
            </div>

            {/* <<<<<<<<<<----------Table---------->>>>>>>>>> */}

            <div className='overflow-auto mt-6  rounded-md drop-shadow'>
                <table className='w-full table-fixed bg-white'>
                    {/* Table Head */}
                    <thead className="text-[#8B8B8B]">
                        <tr className='h-16 text-[#303030]'>
                            <th className='pl-9'>Code</th>
                            <th>Name</th>
                            <th className='w-[15%]'>Type</th>
                            <th className='w-[15%]'>Status</th>
                            <th className='w-[10%]'>Price</th>
                            <th></th>
                        </tr>
                    </thead>

                    {!treatmentsLoading || treatmentsError ?
                        <tbody className='text-[#444648]'>
                            {/* Table body */}
                            {treatments?.map((data, index) => {
                                return (
                                    <tr key={index} className='h-14'>
                                        <td className='pl-9'>{data.item_code}</td>
                                        <td>{data.template}</td>
                                        <td>{data.custom_condition ? "Condition" : "Procedure"}</td>
                                        <td className={!data.disabled ? "text-[#5ABA53]" : "text-[#F8254B]"}>{data.disabled === 0 ? "active" : "inactive"}</td>
                                        <td>{data.rate}</td>
                                        <td>
                                            <div className='flex gap-2'>
                                                <button className='border border-solid rounded border-[#A0A3A6] text-[#444648] px-3' onClick={() => {
                                                    setTreatmentButton(false);
                                                    setForm({
                                                        item_code: data.item_code,
                                                        template: data.template,
                                                        rate: data.rate,
                                                        description: data.description,
                                                        item_group: data.item_group,
                                                        custom_condition: data.custom_condition,
                                                        disabled: data.disabled,
                                                    });
                                                    openModal();
                                                    setSelectedTreatment({ id: data.name })
                                                }} >Edit</button>
                                                <button className='border border-solid rounded border-[#FF3C5F] text-[#FF3C5F] px-3' onClick={() => { setIsConfirmBoxOpen(true); setSelectedTreatment({ id: data.name, name: data.name }) }}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        : <tbody>
                            {/* Table Loading pulse */}
                            {pulseRows?.map((_, index) =>
                                <tr key={index} className="animate-pulse h-14">
                                    <td className="pl-9"><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                    <td className='w-[15%]'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                    <td className='w-[15%]'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                    <td className='w-[10%]'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                </tr>
                            )}
                            <tr className="animate-pulse h-11">
                                <td className='pl-9'><div className='bg-neutral-200 rounded h-4 w-5'></div></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                            </tr>
                        </tbody>
                    }
                </table>
                {!treatmentsLoading && (
                    treatmentsError ?
                        <div className='box-border min-h-[60px] bg-white flex justify-center items-center'>
                            {/* Table Error */}
                            <p>Error while Loading {currentTab}</p>
                            <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => refreshTreatments()}>Try Again</button>
                        </div>
                        : treatments?.length ?
                            <div className='box-border h-11 bg-white flex gap-5 justify-end items-center pl-9 p-2'>
                                {/* Tabel Bottom */}
                                <i className='bx bx-rotate-right mr-auto cursor-pointer text-lg' onClick={() => listTreatments(searchTreatment, treatmentsMeta?.page, treatmentsMeta?.size, `${currentTab === "Active Treatments"}`)}></i>
                                <p>Total {currentTab} :&nbsp; {treatments?.length} / {treatmentsMeta?.total}</p>
                                <p>Page {treatmentsMeta?.page + 1}&nbsp; of {Math.floor(((treatmentsMeta?.total - 1) / treatmentsMeta?.size) + 1)}</p>
                                <div className={`${treatmentsMeta?.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { treatmentsMeta?.page != 0 && listTreatments(searchTreatment, treatmentsMeta?.page - 1, treatmentsMeta?.size, `${currentTab === "Active Treatments"}`) }}>
                                    &lt;
                                </div>
                                <div className={`${treatmentsMeta?.page < Math.floor((treatmentsMeta?.total - 1) / treatmentsMeta?.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { treatmentsMeta?.page < Math.floor((treatmentsMeta?.total - 1) / treatmentsMeta?.size) && listTreatments(searchTreatment, treatmentsMeta?.page + 1, treatmentsMeta?.size, `${currentTab === "Active Treatments"}`) }}>
                                    &gt;
                                </div>
                                <p>size :
                                    <select name="" id="" defaultValue={treatmentsMeta?.size} onChange={(event) => listTreatments(searchTreatment, "", event.target.value, `${currentTab === "Active Treatments"}`)} className='default-select-icon'>
                                        <option value="5">5 </option>
                                        <option value="10">10 </option>
                                        <option value="15">15 </option>
                                        <option value="20">20 </option>
                                        <option value="50">50 </option>
                                    </select>
                                </p>
                            </div>
                            : <div className='box-border min-h-[60px] bg-white flex justify-center items-center'>
                                No {currentTab} Found
                            </div>
                )}
            </div>

            {/* <<<<<<<<<<----------Add Treatment Modal---------->>>>>>>>>> */}

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
                                    enterFrom="opacity-0 translate-x-full scale-75"
                                    enterTo="opacity-100 translate-x-0 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-x-0 tanslate-y-0 scale-100 "
                                    leaveTo="opacity-0 translate-x-3/4 -translate-y-20 scale-75"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex flex-col">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            <p className='font-semibold text-base'>
                                                {treatmentButton ? "Add Treatment" : "Update Treatment"}
                                            </p>

                                        </Dialog.Title>
                                        <div className='flex text-sm'>
                                            <form onSubmit={handleTreatmentSubmit}>
                                                <div className="flex flex-wrap box-border items-center">
                                                    {inputs?.map((data, index) => {
                                                        return (
                                                            <div key={index} className=' mt-4 w-full'>
                                                                <p className='text-[#8A8A8A] leading-6 '>{data.head}</p>
                                                                <div className="min-w-[280px] h-12 font-medium flex items-center relative text-[#373434] gap-[2vw]">
                                                                    {data.types.map((obj, index) => {
                                                                        return (
                                                                            obj.type === "select" ?
                                                                                <select
                                                                                    name={data.name}
                                                                                    defaultValue={form[data.name]}
                                                                                    key={index}
                                                                                    onChange={handleChange}
                                                                                    className='flex gap-[1vw] items-center w-full h-full border border-solid border-[#DFDFDF] bg-transparent rounded-md px-5 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                                                                    required={data.required}
                                                                                    disabled={loading}
                                                                                >
                                                                                    {data.options.map((optionData, index) => {
                                                                                        return (
                                                                                            <option key={index} value={optionData === "active" ? 0 : 1} className='rounded-md transition-all w-full px-5 h-full min-w-[26px]'>{optionData}</option>
                                                                                        )
                                                                                    })}
                                                                                </select>
                                                                                :
                                                                                <div key={index} className='flex gap-[1vw] rounded-md border border-solid border-[#DFDFDF] items-center w-full h-full'>
                                                                                    <input
                                                                                        type={obj.type}
                                                                                        name={data.name}
                                                                                        className={obj.type != "radio" && obj.type != "checkbox" ? 'outline-none rounded-md border border-solid border-[#DFDFDF] px-5 w-full h-full min-w-[18px]' : "ml-5 outline-none h-4 w-4"}
                                                                                        onChange={handleChange}
                                                                                        checked={obj.type === "radio" && form[data.name] === (obj.text === "Condition" ? 1 : 0)}
                                                                                        value={obj.type === "radio" ? obj.text : form[data.name]}
                                                                                        required={data.required}
                                                                                        disabled={loading}
                                                                                    />
                                                                                    {obj.text && <span className='font-medium'>{obj.text}</span>}
                                                                                </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className='mt-6 flex gap-2.5'>
                                                    <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#4285F4] w-28 h-10 text-white rounded font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Save"}</button>
                                                    <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded font-medium`} onClick={closeModal} >Discard</button>
                                                </div>
                                            </form >
                                        </div>
                                        <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} absolute right-5 top-6`} onClick={closeModal} ><i className='bx bx-x text-2xl leading-7' /></button>

                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </>

            {/* <<<<<<<<<<----------Treatment deletion Confirm Box---------->>>>>>>>>> */}

            <>
                <Transition appear show={isConfirmBoxOpen} as={Fragment}>
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
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex flex-col justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            <p className='font-semibold text-base'>
                                                Are you sure want to <span className='text-[#D10000]'>Delete </span> the Treatment?
                                            </p>

                                        </Dialog.Title>
                                        <div className='flex text-sm w-full'>
                                            <form className='w-full' onSubmit={(event) => {
                                                event.preventDefault();
                                                if (selectedTreatment.name === confirmBoxValue) {
                                                    setConfirmBoxError("")
                                                    removeTreatment(selectedTreatment.id)
                                                } else {
                                                    setConfirmBoxError("Entered text is not matching")
                                                }
                                            }}>
                                                <div className="box-border items-center w-full">
                                                    <div className='flex flex-col mt-4 gap-2'>
                                                        <p className='text-[#8A8A8A] leading-6 '>Type <span className='text-black font-semibold'>{selectedTreatment.name}</span> to Confirm</p>
                                                        {/* <div className="min-w-[280px] h-12 font-medium flex items-center relative text-[#373434] gap-[2vw]"> */}
                                                        <div className='flex items-center w-full h-10 border border-solid border-[#DFDFDF]  rounded-md'>
                                                            <input
                                                                type="text"
                                                                // name={data.name}
                                                                className="outline-none w-full h-full rounded-md px-5"
                                                                // onFocus={(event) => { obj.type === "date" && event.target.showPicker() }}
                                                                onChange={(event) => { setConfirmBoxValue(event.target.value); setConfirmBoxError("") }}
                                                                value={confirmBoxValue}
                                                                required
                                                                disabled={loading}
                                                            />
                                                            {/* {obj.text && <span className='font-medium'>{obj.text}</span>} */}
                                                        </div>
                                                        <p className='text-[#D10000] text-xs'>{confirmBoxError}</p>
                                                        {/* </div> */}
                                                    </div>
                                                </div>
                                                <div className='mt-4 flex gap-2.5'>
                                                    <button className={`${loading && "bg-opacity-50 cursor-wait active:scale-100"} bg-[#4285F4] w-28 h-10 text-white rounded font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Confirm"}</button>
                                                    <button type='button' className={`${loading && "bg-opacity-50 cursor-wait active:scale-100"} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded font-medium`} onClick={closeModal} >Cancel</button>
                                                </div>
                                            </form >
                                        </div>
                                        <button className={`${loading && "bg-opacity-50 cursor-wait active:scale-100"} absolute right-5 top-6`} onClick={closeModal} ><i className='bx bx-x text-2xl leading-7' /></button>
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

export default Treatments
