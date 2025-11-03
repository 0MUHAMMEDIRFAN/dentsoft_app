import { useContext, useState } from 'react'
import moment from 'moment'
import { AppContext } from '../../contexts/AppContext'
import { showToastMessage } from '../Core/Toast'
import { getPendingPaymentList, usePaymentOperations } from '../../hooks/usePayment'

interface PaymentReference {
    reference_doctype: string
    reference_name: string
    allocated_amount: number
}

interface PaymentForm {
    party_type: string
    party: any
    paid_amount: string
    received_amount: string
    mode_of_payment: string
    paid_to: string
    custom_remarks: number
    remarks: string
    target_exchange_rate: number
    references: PaymentReference[]
    [key: string]: any
}

function AddPayments() {
    const { setViewPayment, selectedPatient } = useContext(AppContext)
    const [loading, setLoading] = useState(false)
    const [paymentDate, setPaymentDate] = useState(moment(new Date()).format("YYYY-MM-DD"))
    
    const [form, setForm] = useState<PaymentForm>({
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
        { 
            head: "Type", 
            types: [
                { text: "Cash", type: "radio", icon: "fa-solid fa-money-bill-wave" }, 
                { text: "Card", type: "radio", icon: "fa-solid fa-credit-card" }
            ], 
            name: "mode_of_payment", 
            required: true 
        },
    ]
    
    const pulseRows = new Array(10).fill(null)
    
    const { 
        data: pendingPayments, 
        isLoading: paymentsLoading, 
        error: paymentsError, 
        mutate: refreshPendingPayments 
    } = getPendingPaymentList(selectedPatient.name, paymentDate)
    
    const { addPayment } = usePaymentOperations()
    
    const paymentSelect = (condition: boolean, id: string, allocated_amount = 0) => {
        if (condition) {
            setForm((prev) => ({
                ...prev,
                references: [...prev.references, { 
                    reference_doctype: "Sales Invoice", 
                    reference_name: id, 
                    allocated_amount: Number(allocated_amount) 
                }]
            }))
        } else {
            setForm((prev) => {
                const index = prev.references.findIndex(x => x?.reference_name === id)
                if (index !== -1) {
                    const list = [...prev.references]
                    list.splice(index, 1)
                    return { ...prev, references: list }
                }
                return prev
            })
        }
    }
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target
        setForm(prev => ({ ...prev, [name]: value }))
    }
    
    const handleSubmit = async () => {
        if (!form.paid_amount || !form.mode_of_payment) {
            showToastMessage({ type: "validation", title: "Please fill all required fields" })
            return
        }
        
        setLoading(true)
        try {
            const payload = {
                ...form,
                received_amount: form.paid_amount,
                payment_date: paymentDate
            }
            
            await addPayment(payload)
            showToastMessage({ type: "success", title: "Payment Added Successfully" })
            setViewPayment(true)
        } catch (error: any) {
            showToastMessage({ type: "error", title: error.message || "Failed to add payment" })
        } finally {
            setLoading(false)
        }
    }
    
    const calculateTotalAmount = () => {
        return form.references.reduce((total, ref) => total + (ref.allocated_amount || 0), 0)
    }
    
    return (
        <div className='bg-[#FAFAFD] flex flex-col pl-7 p-5 box-border gap-10 min-h-full fade_in'>
            <div className='bg-white pl-[36px] pt-[20px] rounded-md drop-shadow'>
                <div className='flex gap-5 items-center mb-4'>
                    <p className='text-base font-semibold'>Add Payment</p>
                    <button 
                        onClick={() => setViewPayment(true)}
                        className='text-blue-500 hover:text-blue-700'
                    >
                        View Payments
                    </button>
                </div>
                
                <div className='space-y-6 pr-[25px] pb-6'>
                    {/* Payment Date */}
                    <div>
                        <label className='block text-sm font-medium mb-2'>Payment Date</label>
                        <input
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            className='border px-3 py-2 rounded'
                        />
                    </div>
                    
                    {/* Payment Form */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {inputs.map((input, index) => (
                            <div key={index}>
                                <label className='block text-sm font-medium mb-2'>
                                    {input.head} {input.required && '*'}
                                </label>
                                {input.types[0].type === 'number' ? (
                                    <div className='flex'>
                                        <input
                                            type="number"
                                            name={input.name}
                                            value={form[input.name as keyof typeof form]}
                                            onChange={handleInputChange}
                                            className='flex-1 border px-3 py-2 rounded-l'
                                            required={input.required}
                                        />
                                        <span className='bg-gray-100 border border-l-0 px-3 py-2 rounded-r'>
                                            {input.text}
                                        </span>
                                    </div>
                                ) : input.types[0].type === 'radio' ? (
                                    <div className='flex gap-4'>
                                        {input.types.map((type, typeIndex) => (
                                            <label key={typeIndex} className='flex items-center gap-2'>
                                                <input
                                                    type="radio"
                                                    name={input.name}
                                                    value={(type as any).text}
                                                    checked={form[input.name as keyof typeof form] === (type as any).text}
                                                    onChange={handleInputChange}
                                                />
                                                <i className={(type as any).icon}></i>
                                                <span>{(type as any).text}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                    
                    {/* Pending Treatments Table */}
                    <div>
                        <h3 className='text-lg font-semibold mb-4'>Pending Treatments</h3>
                        <div className='overflow-auto'>
                            <table className='w-full border'>
                                <thead>
                                    <tr className='bg-gray-50'>
                                        <th className='border p-2 text-left'>Select</th>
                                        <th className='border p-2 text-left'>Treatment</th>
                                        <th className='border p-2 text-left'>Date</th>
                                        <th className='border p-2 text-left'>Amount</th>
                                        <th className='border p-2 text-left'>Outstanding</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentsLoading ? (
                                        pulseRows.map((_, index) => (
                                            <tr key={index} className="animate-pulse">
                                                <td className="border p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                                <td className="border p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                                <td className="border p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                                <td className="border p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                                <td className="border p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                            </tr>
                                        ))
                                    ) : paymentsError ? (
                                        <tr>
                                            <td colSpan={5} className='border p-4 text-center'>
                                                <p>Error loading pending payments</p>
                                                <button 
                                                    onClick={() => refreshPendingPayments()}
                                                    className='bg-blue-500 text-white px-4 py-2 rounded mt-2'
                                                >
                                                    Retry
                                                </button>
                                            </td>
                                        </tr>
                                    ) : pendingPayments?.length ? (
                                        pendingPayments.map((payment: any) => (
                                            <tr key={payment.name}>
                                                <td className='border p-2'>
                                                    <input
                                                        type="checkbox"
                                                        onChange={(e) => paymentSelect(
                                                            e.target.checked, 
                                                            payment.name, 
                                                            payment.outstanding_amount
                                                        )}
                                                    />
                                                </td>
                                                <td className='border p-2'>{payment.description}</td>
                                                <td className='border p-2'>
                                                    {moment(payment.posting_date).format("DD-MMM-YYYY")}
                                                </td>
                                                <td className='border p-2'>₹{payment.grand_total}</td>
                                                <td className='border p-2'>₹{payment.outstanding_amount}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className='border p-4 text-center'>
                                                No pending treatments found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Payment Summary */}
                    {form.references.length > 0 && (
                        <div className='bg-gray-50 p-4 rounded'>
                            <h4 className='font-semibold mb-2'>Payment Summary</h4>
                            <p>Selected treatments: {form.references.length}</p>
                            <p>Total amount: ₹{calculateTotalAmount()}</p>
                            <p>Amount paid: ₹{form.paid_amount || 0}</p>
                        </div>
                    )}
                    
                    {/* Submit Button */}
                    <div className='flex justify-end gap-4'>
                        <button
                            onClick={() => setViewPayment(true)}
                            className='px-6 py-2 border border-gray-300 rounded hover:bg-gray-50'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !form.paid_amount || !form.mode_of_payment}
                            className='px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? 'Adding...' : 'Add Payment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPayments
