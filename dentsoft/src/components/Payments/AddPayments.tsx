import React, { useContext, useEffect, useState } from 'react'
import polygon from "../../assets/Polygon.svg"
import { AppContext } from '../../contexts/AppContext'
import { ToastContext } from '../../contexts/ToastContext'
import { createPayment, getPaymentPendingTreatment } from '../../Api/PaymentApi'
import moment from 'moment'
import { getPendingPaymentList } from '../../hooks/usePayment'


function AddPayments() {
    const { setViewPayment, selectedPatient } = useContext(AppContext)
    // const [pendingPayments, setPendingPayments] = useState([])
    const [pendingPaymentsMeta, setPendingPaymentsMeta] = useState({})
    const [sumBalance, setSumBalance] = useState(0)
    const [loading, setLoading] = useState(false)
    // const [paymentsLoading, setPaymentsLoading] = useState("Loaded")
    const [totalTreatmentAmount, setTotalTreatmentAmount] = useState(0)
    const [addPaymentError, setAddPaymentError] = useState("")
    const [paymentDate, setPaymentDate] = useState(moment(new Date).format("YYYY-MM-DD"))
    const { notify } = useContext(ToastContext)
    const [form, setForm] = useState({
        party_type: "Customer",
        party: selectedPatient.name,
        paid_amount: "",
        received_amount: "",
        mode_of_payment: "",
        paid_to: "Cash - four",
        custom_remarks: 0,
        remarks: "",
        target_exchange_rate: 1,
        references: []
    })
    const inputs = [
        { head: "Sum Deposited", types: [{ type: "number" }], name: "paid_amount", text: "INR", required: true },
        { head: "Type", types: [{ text: "Cash", type: "radio", icon: "fa-solid fa-money-bill-wave" }, { text: "Card", type: "radio", icon: "fa-solid fa-credit-card" },], name: "mode_of_payment", required: true },
        // { head: "Payment date", types: [{ type: "date" }], name: "payment_date", required: true },
        // { head: "Payment plan", types: [{ type: "text" }], name: "payment_plan" },
    ]
    const pulseRows = new Array(10).fill()

    const { data: pendingPayments, isLoading: paymentsLoading, error: paymentsError, mutate: refreshPendingPayments } = getPendingPaymentList(selectedPatient.name, paymentDate);

    const paymentSelect = (condition, id, allocated_amount = 0) => {
        condition ?
            setForm((prev) => {
                return {
                    ...prev,
                    references: [...prev.references, { reference_doctype: "Sales Invoice", reference_name: id, allocated_amount: Number(allocated_amount) }]
                }
            })
            : setForm((prev) => {
                const index = prev.references.findIndex(x => x?.reference_name === id)
                if (index != -1) {
                    prev.references.splice(index, 1)
                }
                const total = Number(form.references.reduce((accumulator, obj) => accumulator + obj?.allocated_amount, 0))
                return { ...prev, paid_amount: total, received_amount: total }
            }
            );
    }
    const oldPaymentSelect = (event) => {
        const { value, name } = event.target
        // pendingPayments
    }
    const AddPayment = async () => {
        try {
            const payload = form;
            const result = await createPayment(payload);
            console.log(result)
            notify("Payment Added", "success")
            listPendingPayments(selectedPatient.name, paymentDate, pendingPaymentsMeta?.page, pendingPaymentsMeta?.size)
            setForm({
                party_type: "Customer",
                party: selectedPatient.name,
                paid_amount: "",
                received_amount: "",
                mode_of_payment: "",
                paid_to: "Cash - four",
                custom_remarks: 0,
                remarks: "",
                target_exchange_rate: 1,
                references: []
            })
        } catch (error) {
            console.log(error)
            notify(error.message, "error")
        }
        setLoading(false)
    }
    const listPendingPayments = async (id, search = "", page = "", size = "") => {
        setPaymentsLoading("Loading")
        setPendingPayments([])
        try {
            const result = await getPaymentPendingTreatment(id, search, page, size);
            setPendingPayments(result.data.data)
            setPendingPaymentsMeta(result.data.meta)
            setSumBalance(result.data.data.reduce((accumulator, data) => accumulator + Number(data.outstanding_amount || 0), 0) || 0)
            console.log(result.data, "Pending Payments")
            setPaymentsLoading("Loaded")
        } catch (error) {
            console.log(error)
            setPaymentsLoading("Error")
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!loading) {
            setAddPaymentError("")
            if (form.references.length) {
                setLoading(true)
                AddPayment();
            }
            else if (pendingPayments?.length)
                setAddPaymentError("Select A Payment From Below")
            else
                setAddPaymentError("No Pending Payments")
            console.log(form)
        }

    };
    const handleChange = (event) => {
        const { value, name, type } = event.target;
        if (name === "paid_amount") {
            let forbreak = true;
            let balance = value
            const selectedPayments = pendingPayments?.map((payment, paymentIndex) => {
                if (forbreak) {
                    if (payment.outstanding_amount >= balance) {
                        forbreak = false
                        setPendingPayments(prev => {
                            prev.splice(paymentIndex, 1, { ...prev[paymentIndex], enter_amount: balance })
                            return [...prev]
                        })
                        return ({ reference_doctype: "Sales Invoice", reference_name: payment.name, allocated_amount: Number(balance) })
                    } else {
                        balance = balance - payment.outstanding_amount
                        setPendingPayments(prev => {
                            prev.splice(paymentIndex, 1, { ...prev[paymentIndex], enter_amount: payment.outstanding_amount })
                            return [...prev]
                        })
                        return ({ reference_doctype: "Sales Invoice", reference_name: payment.name, allocated_amount: Number(payment.outstanding_amount) })
                    }
                }
                setPendingPayments(prev => {
                    prev.splice(paymentIndex, 1, { ...prev[paymentIndex], enter_amount: "" })
                    return [...prev]
                })
                return false
            }).filter(payment => payment !== false)
            setForm(prev => ({
                ...prev,
                paid_amount: Number(value) || "",
                received_amount: Number(value) || "",
                references: [...selectedPayments]
            }))
            // setPendingPayments(prev=>{})
        } else {
            type === "number" ?
                value === "" ?
                    setForm((prev) => ({ ...prev, [name]: value, }))
                    : setForm((prev) => ({ ...prev, [name]: Number(value), }))
                : name === "remarks" ?
                    value === "" ?
                        setForm((prev) => ({ ...prev, [name]: value, custom_remarks: 0 }))
                        : setForm((prev) => ({ ...prev, [name]: value, custom_remarks: 1 }))
                    : setForm((prev) => ({ ...prev, [name]: value, }))
        }
    }
    const closeAddPayment = () => {
        setViewPayment(true)
    }
    useEffect(() => {
        // pendingPayments?.length || listPendingPayments(selectedPatient.name, paymentDate, pendingPaymentsMeta?.page, pendingPaymentsMeta?.size)
    }, [])
    useEffect(() => {
        const total = Number(form.references.reduce((accumulator, obj) => accumulator + obj?.allocated_amount, 0))
        setForm(prev => ({ ...prev, paid_amount: total, received_amount: total }))
    }, [form.references])
    return (
        <div className='flex flex-col gap-5 pl-7 pr-[1.5vw] pt-5 bg-[#FAFAFD] min-h-full slide1'>

            {/* heading Container */}

            <div className='flex'>
                <h1 onClick={closeAddPayment} className='font-semibold text-xl text-[#8B8B8B] cursor-pointer'>Payments </h1>
                <h1 className='font-semibold text-xl'>&nbsp;&gt; Add Payment</h1>
                {/* <div className='pl-7 flex gap-2.5 text-base ml-auto'>
                    <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#F3F3F3] w-28 h-8 text-[#373434] rounded font-medium`} onClick={closeAddPayment}>Discard</button>
                </div> */}
            </div>

            <div className='flex gap-5 w-full'>


                {/* Pending Payments Container */}

                <div className='bg-white pt-5 rounded-[20px] w-full drop-shadow self-start'>
                    <div className='flex gap-5 items-center'>
                        <p className='text-base font-semibold pl-8'>Pending Payments</p>
                        {/* date selection Container */}
                        <div className='w-28 flex'>
                            <label htmlFor='paymentDate' className="text-sm border border-solid border-[#DADCE0] text-[#888888] rounded px-1.5 py-1 hover:bg-gray-100" onClick={() => ""}>
                                {paymentDate === moment(new Date).format("YYYY-MM-DD") ? "Today" : paymentDate || "Select"}
                                <span className='text-xs'>&#9660;</span>
                                <input
                                    id='paymentDate'
                                    type="date"
                                    max={moment(new Date).format("YYYY-MM-DD")}
                                    value={paymentDate}
                                    className='opacity-0 absolute right-0'
                                    onChange={(event) => { setPaymentDate(event.target.value); listPendingPayments(selectedPatient.name, event.target.value, pendingPaymentsMeta?.page, pendingPaymentsMeta?.size) }}
                                    onFocus={(event) => event.target.showPicker()}
                                    onClick={(event) => event.target.showPicker()}
                                    disabled={loading}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Table Container */}

                    <div className='maxh-[360px] overflow-auto'>
                        <table className='w-full table-fixed'>
                            <thead className="text-[#303030]">
                                <tr className='h-16'>
                                    {/* <th className='w-[5%]'><input className='w-4 h-4' type="checkbox" disabled /></th> */}
                                    <th className='pl-8'>Date</th>
                                    <th className='pl-2'>Provider</th>
                                    <th className='pl-2'>Status</th>
                                    <th>Allowed Amt.</th>
                                    <th>Balance Amt.</th>
                                    <th className='pr-2'>Payment Amt.</th>
                                </tr>
                            </thead>
                            {!paymentsLoading || paymentsError ?
                                <tbody className='text-[#444648]'>
                                    {pendingPayments?.map((data, paymentIndex) => {
                                        return (
                                            <tr key={paymentIndex} className={`box-border h-16 ${form.references.findIndex(x => x?.reference_name === data.name) + 1 && "bg-gray-100"}`}>
                                                <td className='pl-8'>{moment(data.posting_date).format("DD-MMM-YYYY")}</td>
                                                <td className='pl-2'>{data.owner}</td>
                                                <td className='pl-2'>
                                                    <div className='flex items-center  gap-4'>
                                                        <p className={`${data?.status === "Paid" ? "text-[#5ABA53]" : data?.status === "Overdue" ? "text-[#FF2727]" : data?.status === "Partly Paid" ? "text-[#FE9F2F]" : "text-[#FF2727]"} overflow-hidden rounded-full flex items-center`}>{data?.status}</p>
                                                    </div>
                                                </td>
                                                <td>{data.grand_total}</td>
                                                <td >{data.outstanding_amount}</td>
                                                <td className='pr-2'>
                                                    <div className='flex items-center w-full rounded-md border'>
                                                        $<input
                                                            type="number"
                                                            placeholder='0'
                                                            className='w-full h-8 p-1'
                                                            maxLength={6}
                                                            min={0}
                                                            value={data.enter_amount || ""}
                                                            onInput={(event) => {
                                                                const value = Math.abs(event.target.value)
                                                                if (value > data.outstanding_amount) {
                                                                    event.target.setCustomValidity(`Maximum allowed Amount is ${data.outstanding_amount}`);
                                                                    event.target.reportValidity();
                                                                } else {
                                                                    setPendingPayments(prev => {
                                                                        prev.splice(paymentIndex, 1, { ...prev[paymentIndex], enter_amount: value })
                                                                        return [...prev]
                                                                    })
                                                                    setForm((prev) => {
                                                                        const currentIndex = prev.references.findIndex(x => x?.reference_name === data.name)
                                                                        if (currentIndex != -1) {
                                                                            value ?
                                                                                prev.references.splice(currentIndex, 1, { reference_doctype: "Sales Invoice", reference_name: data.name, allocated_amount: Number(value) }) :
                                                                                prev.references.splice(currentIndex, 1)
                                                                            const total = Number(form.references.reduce((accumulator, obj) => accumulator + obj?.allocated_amount, 0))
                                                                            return { ...prev, paid_amount: total, received_amount: total }
                                                                        } else {
                                                                            return {
                                                                                ...prev,
                                                                                references: [...prev.references, { reference_doctype: "Sales Invoice", reference_name: data.name, allocated_amount: Number(value) }]
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }}
                                                            onWheel={event => event.target.blur()}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </td>

                                            </tr>

                                        )
                                    })}
                                    {pendingPayments?.length ?
                                        <tr className='h-16'>
                                            {/* <td></td> */}
                                            <td className='font-bold pl-8'>Total</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td className='font-bold'>{sumBalance}</td>
                                            <td>
                                                <div className='font-bold flex'>
                                                    <p className="w-14">$ {pendingPayments.reduce((accumulator, data) => accumulator + Number(data.enter_amount || 0), 0) || 0}</p>
                                                </div>
                                            </td>
                                        </tr> : ""}
                                </tbody>
                                : <tbody>
                                    {pulseRows?.map((_, index) =>
                                        <tr key={index} className="animate-pulse h-16">
                                            {/* <td className="w-[5%]"><div className='bg-neutral-200 rounded h-4 mr-2 w-4'></div></td> */}
                                            <td className='pl-8'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                        </tr>
                                    )}
                                    <tr className="animate-pulse h-16">
                                        {/* <td></td> */}
                                        <td className='pl-8'><div className='bg-neutral-200 rounded h-4'></div></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                    </tr>
                                    <tr className="animate-pulse h-11">
                                        <td className='pl-8'><div className='bg-neutral-200 rounded h-4 w-5'></div></td>
                                        {/* <td></td> */}
                                        <td></td>
                                        <td></td>
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
                                    <p>Error while Loading Payments</p>
                                    <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => refreshPendingPayments()}>Try Again</button>
                                </div>
                                : pendingPayments?.length ?
                                    <div className='box-border h-11  flex gap-5 justify-end items-center pl-8 p-2'>
                                        <i className='bx bx-rotate-right mr-auto cursor-pointer text-lg' onClick={() => refreshPendingPayments()}></i>
                                        <p>Total Pending payments :&nbsp; {pendingPayments?.length} / {pendingPaymentsMeta?.total}</p>
                                        <p>page {pendingPaymentsMeta?.page + 1} of {Math.floor(((pendingPaymentsMeta?.total - 1) / pendingPaymentsMeta?.size) + 1)}</p>
                                        <div className={`${pendingPaymentsMeta?.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { pendingPaymentsMeta?.page != 0 && listPendingPayments(searchScheme, pendingPaymentsMeta?.page - 1, pendingPaymentsMeta?.size) }}>
                                            &lt;
                                        </div>
                                        <div className={`${pendingPaymentsMeta?.page < Math.floor((pendingPaymentsMeta?.total - 1) / pendingPaymentsMeta?.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { pendingPaymentsMeta?.page < Math.floor((pendingPaymentsMeta?.total - 1) / pendingPaymentsMeta?.size) && listPendingPayments(searchScheme, pendingPaymentsMeta?.page + 1, pendingPaymentsMeta?.size) }}>
                                            &gt;
                                        </div>
                                        <p>size :
                                            <select name="" id="" defaultValue={pendingPaymentsMeta?.size} onChange={(event) => listPendingPayments(selectedPatient.name, paymentDate, pendingPaymentsMeta?.page, event.target.value)} className='default-select-icon'>
                                                <option value="5">5 </option>
                                                <option value="10">10 </option>
                                                <option value="15">15 </option>
                                                <option value="20">20 </option>
                                                <option value="50">50 </option>
                                            </select>
                                        </p>
                                    </div>
                                    : <div className='box-border min-h-[60px]  flex justify-center items-center'>
                                        No Pending Payments Found
                                    </div>
                        )}
                    </div>
                </div>
                {/* Add Payment form  Container */}
                <form onSubmit={handleSubmit} className=' flex flex-col bg-white min-w-[clamp(200px,21.11vw,305px)] p-5 rounded-[20px] border border-[#EBEDF0] self-start'>
                    <div className='flex items-center justify-between font-medium'>
                        <p className='text-[32px] text-[#FE9F2F]'>
                            {sumBalance} INR
                        </p>
                        <div className='bg-[#EBEDF0] text-center rounded-[5px] text-[#FE9F2F] text-[12px] py-[4.5px] px-2'>
                            <p>Not Paid</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2.5 box-border w-full items-center">
                        {inputs?.map((data, inputIndex) => {
                            return (
                                data.name === "mode_of_payment" ?
                                    <div key={inputIndex} className='flex flex-col gap-2.5 w-full'>
                                        {data.types.map((obj, typeIndex) =>
                                            <div key={typeIndex} className={`${form[data.name] === obj.text.toUpperCase() ? "customInputSelected" : "customInputHover"} w-full h-10 font-medium rounded-md border border-solid border-[#DFDFDF]  flex items-center relative text-[#373434] gap-[1vw] `}>
                                                <input type={obj.type} name={data.name}
                                                    className={obj.type != "radio" && obj.type != "checkbox" ? 'outline-none rounded-md transition-all w-full px-5 h-full min-w-[26px]' : "h-4 ml-5 w-4"}
                                                    onChange={handleChange}
                                                    checked={form[data.name] === obj.text.toUpperCase()}
                                                    value={obj.text.toUpperCase()}
                                                    required={data.required}
                                                    disabled={loading}
                                                />
                                                <i className={`${obj.icon}`}></i>
                                                {obj.text}
                                            </div>
                                        )}
                                    </div>
                                    :
                                    <div key={inputIndex} className='w-full'>
                                        <p className='text-black font-medium leading-6'>{data.head}</p>
                                        <div className={`${(data.name === "paid_amount" || loading) && "bg-[#EBEDF0]"} w-full h-10 font-medium rounded-md border border-solid border-[#DFDFDF]  flex items-center relative text-[#373434] b gap-[1vw]`}>
                                            {data.types.map((obj, index) => {
                                                return (
                                                    <div key={index} className='flex items-center w-full h-full text-base rounded-md '>
                                                        {data.text && <p className=' border-r border-solid px-5'>{data.text}</p>}
                                                        <input type={obj.type} name={data.name}
                                                            className={obj.type != "radio" && obj.type != "checkbox" ? 'outline-none rounded-md transition-all w-full px-5 h-full min-w-[26px]' : "h-4 ml-5 w-4"}
                                                            onFocus={(event) => { obj.type === "date" && event.target.showPicker() }}
                                                            onInput={(event) => {
                                                                if (data.name === "paid_amount") {
                                                                    const value = Math.abs(event.target.value)
                                                                    if (value > sumBalance) {
                                                                        event.target.setCustomValidity(`Maximum allowed Amount is ${sumBalance}`);
                                                                        event.target.reportValidity();
                                                                    } else
                                                                        handleChange(event)
                                                                }
                                                            }}
                                                            onChange={handleChange}
                                                            // value={obj.type === "radio" ? obj.text.toUpperCase() : obj.type === "date" ? this : data.name === "paid_amount" ? Number(form.references.reduce((accumulator, obj) => accumulator + obj.allocated_amount, 0)) : form[data.name]}
                                                            value={obj.type === "radio" ? obj.text.toUpperCase() : form[data.name]}
                                                            onWheel={event => obj.type === "number" && event.target.blur()}
                                                            required={data.required}
                                                            disabled={data.name === "paidamount" || loading}
                                                        />
                                                        {obj.text && <span className='font-medium whitespace-nowrap	'>{obj.text}</span>}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                            )
                        })}

                        {/* Remarks Container */}

                        <div className='w-full min-w-[150px]'>
                            <p className='text-[#8A8A8A] leading-6'>Remarks</p>
                            <textarea name="remarks" rows={2}
                                className='w-full min-h-[50px] text-base p-3 rounded-md border border-solid border-[#DFDFDF] font-medium flex items-center relative text-[#373434] outline-none transition-all px-5'
                                onChange={handleChange}
                                value={form.remarks}
                            />
                        </div>
                    </div>
                    <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ((form.paid_amount && form.mode_of_payment) || "bg-gray-400 cursor-not-allowed active:scale-100")} flex items-center justify-center bg-[#4285F4] h-10 text-white rounded-[5px] mt-5 text-base font-medium custom-transition`}>Pay</button>
                    {/* <p className='pl-7 text-red-600 font-medium'>{addPaymentError}</p> */}
                </form >
            </div>
        </div>
    )
}

export default AddPayments
