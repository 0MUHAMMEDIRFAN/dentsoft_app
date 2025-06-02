import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import polygon from "../../assets/Polygon.svg"
import { AppContext } from '../../contexts/AppContext'
import { ToastContext } from '../../contexts/ToastContext'
import { getPatientPayments } from '../../Api/PaymentApi'
import moment from 'moment'
import { getPaymentList } from '../../hooks/usePayment'
function ViewPayments() {
    const { notify } = useContext(ToastContext)
    const [isOpen, setIsOpen] = useState(false)
    const [paymentsMeta, setPaymentsMeta] = useState({})
    const [searchPayment, setSearchPayment] = useState("")
    // const [paymentsLoading, setPaymentsLoading] = useState("Loading")
    const [paymentDate, setPaymentDate] = useState(moment(new Date).format("YYYY-MM-DD"))
    // const [payments, setPayments] = useState({ balance_summary: [{ incompleted: "-", completed: "-", estimated: "-", age_debitor_30_to_60_days: "-", age_debitor_60_to_90_days: "-", age_debitor_above_90_days: "-" }], patient_payments: [] })
    // const [payments, setPayments] = useState([])
    const [paymentsTotalInfo, setPaymentsTotalInfo] = useState({})
    const { setViewPayment, addPaymentClicked, setAddPaymentClicked, selectedPatient } = useContext(AppContext)
    const pulseRows = new Array(10).fill()

    const { data: payments, isLoading: paymentsLoading, error: paymentsError, mutate: refreshPayments } = getPaymentList(searchPayment, selectedPatient.name,paymentDate);

    const listpayments = async (id, search = "", page = "", size = "") => {
        setPaymentsLoading("Loading")
        // setPayments((prev) => ({ balance_summary: prev.balance_summary, patient_payments: [] }))
        setPaymentsTotalInfo({})
        setPayments([])
        try {
            const result = await getPatientPayments(id, search, page, size);
            setPayments(result.data.data)
            setPaymentsMeta(result.data.meta)
            setPaymentsTotalInfo(result.data.total_info)
            setPaymentsLoading("Loaded")
        } catch (error) {
            console.log(error)
            setPaymentsLoading("Error")
        }
    }
    function closeModal(send) {
        setIsOpen(false)
        if (send === true) {
            console.log("Reminder sent")
            notify("Reminder Sent", "success")
        } else {

            console.log("Modal closed")
        }
    }
    function openModal() {
        setIsOpen(true)
    }
    useEffect(() => {
        // listpayments(selectedPatient.name, searchPayment, paymentsMeta?.page, paymentsMeta?.size);
    }, [])

    return (
        <div className={`bg-[#FAFAFD] flex flex-col p-5 pl-7 box-border gap-5 ${addPaymentClicked ? "slide2" : "fade_in"}`}>
            {/* header */}
            <div className='flex items-center font-semibold gap-6'>
                <h1 className='text-xl'>Patient Payments</h1>
                <div className='flex items-center bg-white border-solid border border-[#EBEDF0] rounded-[20px] overflow-hidden h-10 gap-2 px-3'>
                    <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                    <input type="search" placeholder='Search payments' className='outline-none font-normal' onChange={(event) => { setSearchPayment(event.target.value); listpayments(selectedPatient.name, event.target.value, paymentsMeta?.page, paymentsMeta?.size) }} />
                </div>
                <button onClick={() => { setViewPayment(false); setAddPaymentClicked(true); }} className='bg-[#4285F4] rounded-[20px] h-10 px-6 text-white ml-auto hover:bg-[#2070F5]'>Add Payment</button>
            </div>
            {/* payments Container  */}
            <div className='flex flex-col gap-6 font-medium'>
                {/* amount details container  */}
                <div className='p-7 bg-white rounded-lg drop-shadow'>
                    {/* amount balance section  */}
                    <div onClick={() => console.log(paymentsTotalInfo)}>
                        <p className='text-[#616161]'>Amount balance</p>
                        {paymentsLoading ? <div className='w-20 h-8 my-0.5 bg-neutral-200 animate-pulse rounded'></div> :
                            <h2 className='text-3xl font-medium'>${paymentsTotalInfo?.total_balance}</h2>
                        }
                    </div>
                    {/* treatment consts section  */}
                    <div className='flex flex-wrap gap-5'>
                        <div className='w-[48%] mt-8 min-w-[390px]'>
                            <p className='text-[#616161] mb-4'>Treatment costs</p>
                            <div className='flex justify-between rounded-2xl border border-solid border-[#EBEDF0] px-5 py-2.5'>
                                <div className='w-full'>
                                    <div>
                                        <h6 className='text-[#888888]'>Treatment cost</h6>
                                        {paymentsLoading ?
                                            <div className='w-14 h-4 my-1.5 bg-neutral-200 animate-pulse rounded'></div>
                                            : <p className='text-lg'>${paymentsTotalInfo?.grand_total}</p>
                                        }
                                    </div>
                                </div>
                                <div className='w-full place-content-center flex border-[#EBEDF0] border-solid border-x'>
                                    <div>
                                        <h6 className='text-[#888888]'>Completed</h6>
                                        {paymentsLoading ?
                                            <div className='w-14 h-4 my-1.5 bg-neutral-200 animate-pulse rounded'></div>
                                            : <p className='text-lg'>${paymentsTotalInfo?.completed}</p>
                                        }
                                    </div>
                                </div>
                                <div className='w-full flex place-content-end'>
                                    <div>
                                        <h6 className='text-[#888888]'>Incompleted</h6>
                                        {paymentsLoading ?
                                            <div className='w-14 h-4 my-1.5 bg-neutral-200 animate-pulse rounded'></div>
                                            : <p className='text-lg'>${paymentsTotalInfo?.total_balance}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* treatment costs section  */}
                        <div className='w-[48%] mt-8 min-w-[390px]'>
                            <p className='text-[#616161] mb-4'>Age debitor</p>
                            <div className='flex justify-between rounded-2xl border border-solid border-[#EBEDF0] px-5 py-2.5'>
                                <div className='w-full'>
                                    <div>
                                        <h6 className='text-[#888888]'>30-60</h6>
                                        {paymentsLoading ?
                                            <div className='w-14 h-4 my-1.5 bg-neutral-200 animate-pulse rounded'></div>
                                            : <p className='text-lg'>${paymentsTotalInfo?.age_debitor_31_to_60_days}</p>
                                        }
                                    </div>
                                </div>
                                <div className='w-full place-content-center flex border-[#EBEDF0] border-solid border-x'>
                                    <div>
                                        <h6 className='text-[#888888]'>60-90</h6>
                                        {paymentsLoading ?
                                            <div className='w-14 h-4 my-1.5 bg-neutral-200 animate-pulse rounded'></div>
                                            : <p className='text-lg'>${paymentsTotalInfo?.age_debitor_61_to_90_days}</p>
                                        }
                                    </div>
                                </div>
                                <div className='w-full flex place-content-end'>
                                    <div>
                                        <h6 className='text-[#888888]'>90+</h6>
                                        {paymentsLoading ?
                                            <div className='w-14 h-4 my-1.5 bg-neutral-200 animate-pulse rounded'></div>
                                            : <p className='text-lg'>${paymentsTotalInfo?.age_debitor_above_90_days}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {/* transaction table  */}
                <div className='bg-white pt-5 rounded-md drop-shadow'>
                    <div className='flex gap-5 items-center pl-9'>
                        <p className='text-base font-semibold'>Recent Transactions</p>
                        {/* <button className='font-medium rounded border border-solid border-[#DADCE0]  p-2 text-[#888888] flex items-center justify-center gap-2'>Today <img src={polygon} alt="" /></button> */}
                        <div className='w-28 flex'>
                            <label htmlFor='paymentDate' className="text-sm border border-solid border-[#DADCE0] text-[#888888] rounded px-1.5 py-1 hover:bg-gray-100" onClick={() => ""}>
                                {paymentDate === moment(new Date).format("YYYY-MM-DD") ? "Today" : paymentDate || "Select"}
                                <span className='text-xs'>&#9660;</span>
                                <input id='paymentDate' type="date" max={moment(new Date).format("YYYY-MM-DD")}
                                    value={paymentDate}
                                    className='opacity-0 absolute right-0'
                                    onChange={(event) => { setPaymentDate(event.target.value); listpayments(selectedPatient.name, event.target.value, paymentsMeta?.page, paymentsMeta?.size) }}
                                    onFocus={(event) => event.target.showPicker()}
                                    onClick={(event) => event.target.showPicker()}
                                />
                            </label>
                        </div>
                    </div>

                    {/* <<<<<<<<<<----------Table---------->>>>>>>>>> */}

                    <div className='overflow-auto'>
                        <table className='w-full table-fixed'>
                            <thead className="text-[#303030]">
                                <tr className='h-16'>
                                    <th className='w-[calc(9%)] pl-9'>No.</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    {/* <th>Status</th> */}
                                    <th className='w-[30%]'>Remarks</th>
                                    <th className='text-center'>Payment type</th>
                                    <th className='w-[7%]'>Paid</th>
                                </tr>
                            </thead>
                            {!paymentsLoading || paymentsError ?
                                <tbody className='text-[#444648]'>
                                    {payments?.map((data, index) => {
                                        return (
                                            <tr key={index} className={`box-border h-14 ${data.status === "Cancelled" && "bg-red-200"}`}>
                                                <td className='pl-9'>{index + 1}</td>
                                                <td>{moment(data.posting_date).format("DD-MMM-YYYY")}</td>
                                                <td>{moment(data.modified).format("hh:mm A")}</td>
                                                {/* <td >
                                                <div className='flex items-center gap-2'>
                                                    <div className={`${data.status === "Completed" ? "bg-[#5ABA53]" : data.status === "Declined" ? "bg-[#FF2727]" : "bg-[#FE9F2F]"} w-2 h-2 rounded-full`}></div>
                                                    <p className={`${data.status === "Completed" ? "text-[#5ABA53]" : data.status === "Declined" ? "text-[#FF2727]" : "text-[#FE9F2F]"} flex items-center`}>{data.Status}</p>
                                                </div>
                                            </td> */}
                                                <td>{data.remarks || "-----"}</td>
                                                <td className='text-center'>{data.paid_to_account_type}</td>
                                                <td>{data.paid_amount}</td>
                                                {/* <td>
                                                <div className='flex items-center  gap-4'>
                                                    <p className={data.status === "Completed" ? "text-[#5ABA53]" : data.status === "Declined" ? "text-[#FF2727]" : "text-[#444648]"}>{data.payment}</p>
                                                    {data.Status === "Progress" && <button onClick={openModal} className='font-semibold h-[23px] w-[45px] rounded-[14px] bg-[#5ABA53] text-white'>Pay</button>}
                                                </div>
                                            </td> */}
                                                {/* <td className='flex items-center gap-2'>
                                            <div className={`bg-[${color}] w-[8px] h-[8px] rounded-full`}></div>
                                            <p className={`text-[${color}] h-[60px] flex items-center`}>{data.Status}</p>
                                        </td> */}
                                            </tr>

                                        )
                                    })}
                                </tbody>
                                : <tbody>
                                    {pulseRows?.map((_, index) =>
                                        <tr key={index} className="animate-pulse h-14">
                                            <td className="w-[5%]"><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            {/* <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td> */}
                                            <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                        </tr>
                                    )}
                                    <tr className="animate-pulse h-11">
                                        <td className=''><div className='bg-neutral-200 rounded h-4 w-5'></div></td>
                                        <td></td>
                                        <td></td>
                                        {/* <td></td> */}
                                        <td></td>
                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                    </tr>
                                </tbody>
                            }
                        </table>
                        {!paymentsLoading && (
                            paymentsError ?
                                <div className='flex flex-col justify-center items-center'>
                                    <p>Error while Loading Transactions</p>
                                    <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => refreshPayments()}>Try Again</button>
                                </div>
                                : payments?.length ?
                                    <div className='box-border h-11 bg-white flex gap-5 justify-end items-center pl-0 p-2'>
                                        <i className='bx bx-rotate-right mr-auto cursor-pointer text-lg' onClick={() => refreshPayments()}></i>
                                        <p>Total Payments :&nbsp; {payments?.length} / {paymentsMeta?.total}</p>
                                        <p>page {paymentsMeta?.page + 1} of {Math.floor(((paymentsMeta?.total - 1) / paymentsMeta?.size) + 1)}</p>
                                        <div className={`${paymentsMeta?.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { paymentsMeta?.page != 0 && listpayments(selectedPatient.name, searchPayment, paymentsMeta?.page - 1, paymentsMeta?.size) }}>
                                            &lt;
                                        </div>
                                        <div className={`${paymentsMeta?.page < Math.floor((paymentsMeta?.total - 1) / paymentsMeta?.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { paymentsMeta?.page < Math.floor((paymentsMeta?.total - 1) / paymentsMeta?.size) && listpayments(selectedPatient.name, searchPayment, paymentsMeta?.page + 1, paymentsMeta?.size) }}>
                                            &gt;
                                        </div>
                                        <p>size :
                                            <select name="" id="" defaultValue={paymentsMeta?.size} onChange={(event) => listpayments(selectedPatient.name, searchPayment, "", event.target.value)} className='default-select-icon'>
                                                <option value="5">5 </option>
                                                <option value="10">10 </option>
                                                <option value="15">15 </option>
                                                <option value="20">20 </option>
                                                <option value="50">50 </option>
                                            </select>
                                        </p>
                                    </div>
                                    : <div className='box-border min-h-[60px] bg-white flex justify-center items-center'>
                                        No Transaction Found
                                    </div>
                        )}
                    </div>
                </div>

            </div>
            {/* Reminder Modal */}
            {/* <>
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
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-6">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Text to pay (+968-98765432)
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Remind the customer the balance pay via text messge
                                                </p>
                                            </div>
                                        </Dialog.Title>
                                        <div className='flex items-center bg-white rounded-lg text-center border border-solid border-[#DFDFDF]'>
                                            <p className='w-1/2 h-16 text-xl border-r flex items-center justify-center '>John Doe</p>
                                            <p className='w-1/2 h-16 text-xl flex items-center justify-center'>INR 500</p>
                                        </div>

                                        <div className="flex justify-center gap-2.5">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-[#4285F4] px-4 py-2 text-sm font-medium text-white w-28 h-10 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={() => closeModal(true)}
                                            >
                                                Send
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-[#F0EBEB] px-4 py-2 text-sm font-medium text-[#373434] w-28 h-10 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={closeModal}
                                            >
                                                Discard
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </> */}
        </div >
    )
}

export default ViewPayments


