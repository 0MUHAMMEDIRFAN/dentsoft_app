import { useState, useCallback } from 'react'
import QuestionMark from "../../assets/Question-mark.svg"
import { showToastMessage } from '../Core/Toast'
import { getTreatmentList, useTreatmentOperations } from '../../hooks/useTreatment'
import type { Treatment, TreatmentForm, FormInput, SelectedTreatment, TabType } from '../../types/types.d'
import Modal from '../Core/Modal'

function Treatments() {
    const [isOpen, setIsOpen] = useState(false)
    const [isConfirmBoxOpen, setIsConfirmBoxOpen] = useState(false)
    const [confirmBoxValue, setConfirmBoxValue] = useState("")
    const [confirmBoxError, setConfirmBoxError] = useState("")
    const [treatmentButton, setTreatmentButton] = useState(true)
    const [selectedTreatment, setSelectedTreatment] = useState<SelectedTreatment>({ id: '', name: '' })
    const [currentTab, setCurrentTab] = useState<TabType>("Active Treatments")
    const [searchTreatment, setSearchTreatment] = useState("")
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const tabs: TabType[] = ["Active Treatments", "Inactive Treatments"]

    const inputs: FormInput[] = [
        { head: "Name", types: [{ type: "text" }], name: "template", required: true },
        { head: "Code", types: [{ type: "text" }], name: "item_code", required: true },
        { head: "Price", types: [{ type: "number" }], name: "rate", required: true },
        { head: "Type", types: [{ text: "Procedure", type: "radio" }, { text: "Condition", type: "radio" }], name: "is_billable", required: true },
        { head: "Status", types: [{ type: "select" }], options: ["active", "inactive"], name: "disabled", required: true },
    ]

    const pulseRows = new Array(10).fill(undefined)

    const [form, setForm] = useState<TreatmentForm>({
        item_code: "",
        template: "",
        description: "Treatment Name",
        item_group: "services",
        rate: "",
        is_billable: 0,
        disabled: 0,
    })

    // Frappe React SDK hooks
    const { data: treatments, isLoading: treatmentsLoading, error: treatmentsError, mutate } = getTreatmentList(searchTreatment, currentTab === "Active Treatments")
    const { addTreatment, editTreatment, removeTreatment, loading } = useTreatmentOperations()

    const handleTabChange = useCallback((tab: TabType) => {
        setCurrentTab(tab)
    }, [])

    const handleSearch = useCallback((value: string) => {
        setSearchTreatment(value)
    }, [])

    const handleTreatmentSubmit = async () => {
        const isLoading = treatmentButton ? loading.create : loading.update

        if (!isLoading) {
            try {
                if (treatmentButton) {
                    await addTreatment(form)
                    showToastMessage({
                        type: "success",
                        title: "Treatment Added Successfully"
                    })
                } else {
                    await editTreatment(selectedTreatment.id, form)
                    showToastMessage({
                        type: "success",
                        title: "Treatment Updated Successfully"
                    })
                }
                closeModal()
            } catch (error) {
                console.error(error)
                showToastMessage({
                    type: "error",
                    title: (error as Error).message || `Failed to ${treatmentButton ? 'add' : 'update'} treatment`
                })
            }
        }
    }

    const handleRemoveTreatment = async (id: string) => {
        try {
            await removeTreatment(id)
            showToastMessage({
                type: "success",
                title: "Treatment Deleted Successfully"
            })
            closeModal()
        } catch (error) {
            console.error(error)
            showToastMessage({
                type: "error",
                title: (error as Error).message || "Failed to delete treatment"
            })
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value, name, type } = event.target

        if (type === "number") {
            setForm(prev => ({
                ...prev,
                [name]: value === "" ? value : Number(value)
            }))
        } else if (name === "is_billable") {
            setForm(prev => ({
                ...prev,
                [name]: value === "Condition" ? 0 : 1
            }))
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    function closeModal() {
        const isLoading = loading.create || loading.update || loading.delete

        if (!isLoading) {
            setIsOpen(false)
            setIsConfirmBoxOpen(false)
            setConfirmBoxError("")
            setSelectedTreatment({ id: '', name: '' })
            setForm({
                item_code: "",
                template: "",
                description: "Treatment Name",
                item_group: "services",
                rate: "",
                is_billable: 0,
                disabled: 0,
            })
        }
    }

    function openModal() {
        setIsOpen(true)
    }

    const handleEditClick = (data: Treatment) => {
        setTreatmentButton(false)
        setForm({
            item_code: data.item_code,
            template: data.template,
            rate: data.rate,
            description: data.description,
            item_group: data.item_group,
            is_billable: data.is_billable,
            disabled: data.disabled,
        })
        openModal()
        setSelectedTreatment({ id: data.name, name: data.template })
    }

    const handleDeleteClick = (data: Treatment) => {
        setIsConfirmBoxOpen(true)
        setSelectedTreatment({ id: data.name, name: data.template })
    }

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
                        <button
                            key={index}
                            className={`${currentTab === tab ? "bg-[#5DB370] text-white" : "hover:bg-[#5db37033]"} rounded-md border-[#5DB370] border-[.5px] border-solid h-10 px-4 font-semibold custom-transition`}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab}
                        </button>
                    )}
                </div>
                <div className='flex gap-3'>
                    <div className='flex border border-solid bg-white border-[#EBEDF0] rounded-[20px] h-10 items-center px-4 gap-2 '>
                        <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                        <input
                            type="search"
                            placeholder='Search'
                            className='outline-none w-full bg-transparent'
                            value={searchTreatment}
                            onChange={(event) => handleSearch(event.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            openModal()
                            setTreatmentButton(true)
                        }}
                        className='bg-[#4285F4] rounded-[20px] h-9 px-4 font-semibold text-white hover:bg-[#2070F5]'
                    >
                        Add Treatments
                    </button>
                </div>
            </div>

            {/* <<<<<<<<<<----------Table---------->>>>>>>>>> */}

            <div className='overflow-auto mt-6 rounded-md drop-shadow'>
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

                    {!treatmentsLoading && !treatmentsError ?
                        <tbody className='text-[#444648]'>
                            {/* Table body */}
                            {paginatedTreatments?.map((data: Treatment, index: number) => {
                                return (
                                    <tr key={index} className='h-14'>
                                        <td className='pl-9'>{data.item_code}</td>
                                        <td>{data.template}</td>
                                        <td>{data.is_billable ? "Condition" : "Procedure"}</td>
                                        <td className={!data.disabled ? "text-[#5ABA53]" : "text-[#F8254B]"}>{data.disabled === 0 ? "active" : "inactive"}</td>
                                        <td>{data.rate}</td>
                                        <td>
                                            <div className='flex gap-2'>
                                                <button
                                                    className='border border-solid rounded border-[#A0A3A6] text-[#444648] px-3'
                                                    onClick={() => handleEditClick(data)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className='border border-solid rounded border-[#FF3C5F] text-[#FF3C5F] px-3'
                                                    onClick={() => handleDeleteClick(data)}
                                                >
                                                    Delete
                                                </button>
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
                        <div className='box-border min-h-[60px] bg-white flex justify-center items-center gap-2'>
                            {/* Table Error */}
                            <p>Error while Loading {currentTab}</p>
                            <button
                                className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]'
                                onClick={() => mutate()}
                            >
                                Try Again
                            </button>
                        </div>
                        : treatments?.length ?
                            <div className='box-border h-11 bg-white flex gap-5 justify-between items-center pl-9 p-2'>
                                {/* Table Bottom with Pagination */}
                                <div className="flex items-center gap-4">
                                    <i
                                        className='bx bx-rotate-right cursor-pointer text-lg'
                                        onClick={() => mutate()}
                                    ></i>
                                    <p>Total: {startIndex + 1} - {endIndex} / {totalItems}</p>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    {/* Page Size Selector */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Show:</span>
                                        <select
                                            value={pageSize}
                                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                            className="border border-[#DFDFDF] rounded px-2 py-1 text-sm"
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={15}>15</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </select>
                                    </div>
                                    
                                    {/* Page Navigation */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Page {currentPage + 1} of {totalPages}</span>
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 0}
                                            className="px-2 py-1 border border-[#DFDFDF] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages - 1}
                                            className="px-2 py-1 border border-[#DFDFDF] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                            : <div className='box-border min-h-[60px] bg-white flex justify-center items-center'>
                                No {currentTab} Found
                            </div>
                )}
            </div>

            {/* <<<<<<<<<<----------Add Treatment Modal---------->>>>>>>>>> */}

            <Modal
                isShow={isOpen}
                setShow={setIsOpen}
                title={treatmentButton ? "Add Treatment" : "Update Treatment"}
                loading={loading.create || loading.update}
                onCancel={closeModal}
                submitLabel={treatmentButton ? "Add" : "Update"}
                onSubmit={handleTreatmentSubmit}
                showButtons={true}
            >
                <div className="flex flex-wrap box-border items-center">
                    {inputs?.map((data, index) => {
                        return (
                            <div key={index} className=' mt-4 w-full'>
                                <p className='text-[#8A8A8A] leading-6 '>{data.head}</p>
                                <div className="min-w-[280px] h-12 font-medium flex items-center relative text-[#373434] gap-[2vw]">
                                    {data.types.map((obj, typeIndex) => {
                                        return (
                                            obj.type === "select" ?
                                                <select
                                                    name={data.name}
                                                    defaultValue={form[data.name]}
                                                    key={typeIndex}
                                                    onChange={handleChange}
                                                    className='flex gap-[1vw] items-center w-full h-full border border-solid border-[#DFDFDF] bg-transparent rounded-md px-5 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                                    required={data.required}
                                                    disabled={loading.create || loading.update}
                                                >
                                                    {data.options?.map((optionData, optionIndex) => {
                                                        return (
                                                            <option key={optionIndex} value={optionData === "active" ? 0 : 1} className='rounded-md transition-all w-full px-5 h-full min-w-[26px]'>{optionData}</option>
                                                        )
                                                    })}
                                                </select>
                                                :
                                                <div key={typeIndex} className='flex gap-[1vw] rounded-md border border-solid border-[#DFDFDF] items-center w-full h-full'>
                                                    <input
                                                        type={obj.type}
                                                        name={data.name}
                                                        className={obj.type !== "radio" && obj.type !== "checkbox" ? 'outline-none rounded-md border border-solid border-[#DFDFDF] px-5 w-full h-full min-w-[18px]' : "ml-5 outline-none h-4 w-4"}
                                                        onChange={handleChange}
                                                        checked={obj.type === "radio" && form[data.name] === (obj.text === "Condition" ? 0 : 1)}
                                                        value={obj.type === "radio" ? obj.text : form[data.name]}
                                                        required={data.required}
                                                        disabled={loading.create || loading.update}
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
            </Modal>

            {/* <<<<<<<<<<----------Treatment deletion Confirm Box---------->>>>>>>>>> */}

            <Modal
                isShow={isConfirmBoxOpen}
                setShow={setIsConfirmBoxOpen}
                loading={loading.delete}
                title="Are you sure want to Delete the Treatment?"
                showButtons={true}
                submitLabel="Confirm"
                cancelLabel="Cancel"
                onCancel={closeModal}
                onSubmit={() => {
                    if (selectedTreatment.name === confirmBoxValue) {
                        setConfirmBoxError("")
                        handleRemoveTreatment(selectedTreatment.id)
                    } else {
                        setConfirmBoxError("Entered text is not matching")
                    }
                }}
            >
                <div className="box-border items-center w-full">
                    <div className='flex flex-col mt-4 gap-2'>
                        <p className='text-[#8A8A8A] leading-6 '>Type <span className='text-black font-semibold'>{selectedTreatment.name}</span> to Confirm</p>
                        <div className='flex items-center w-full h-10 border border-solid border-[#DFDFDF]  rounded-md'>
                            <input
                                type="text"
                                className="outline-none w-full h-full rounded-md px-5"
                                onChange={(event) => {
                                    setConfirmBoxValue(event.target.value)
                                    setConfirmBoxError("")
                                }}
                                value={confirmBoxValue}
                                required
                                disabled={loading.delete}
                            />
                        </div>
                        <p className='text-[#D10000] text-xs'>{confirmBoxError}</p>
                    </div>
                </div>
            </Modal>


        </div >
    )
}

export default Treatments
