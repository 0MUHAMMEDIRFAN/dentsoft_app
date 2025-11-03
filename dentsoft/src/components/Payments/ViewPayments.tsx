import { useContext, useState, useCallback } from 'react'
import { AppContext } from '../../contexts/AppContext'
import { showToastMessage } from '../Core/Toast'
import { getPaymentList } from '../../hooks/usePayment'
import moment from 'moment'
import Modal from '../Core/Modal'

function ViewPayments() {
    const [isOpen, setIsOpen] = useState(false)
    const [searchPayment, setSearchPayment] = useState("")
    const [paymentDate] = useState(moment(new Date).format("YYYY-MM-DD"))
    const [paymentsTotalInfo] = useState<any>({})
    const { setViewPayment, addPaymentClicked, setAddPaymentClicked, selectedPatient } = useContext(AppContext)
    const pulseRows = new Array(10).fill(undefined)

    const { data: payments, isLoading: paymentsLoading, error: paymentsError, mutate } = getPaymentList(searchPayment, selectedPatient.name, paymentDate);

    const handleSearch = useCallback((value: string) => {
        setSearchPayment(value)
    }, [])

    function closeModal(send?: boolean) {
        setIsOpen(false)
        if (send === true) {
            showToastMessage({
                type: "success",
                title: "Reminder Sent"
            })
        }
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <div className={`bg-[#FAFAFD] flex flex-col p-5 pl-7 box-border gap-5 ${addPaymentClicked ? "slide2" : "fade_in"}`}>
            {/* header */}
            <div className='flex items-center font-semibold gap-6'>
                <h1 className='text-xl'>Patient Payments</h1>
                <div className='flex items-center bg-white border-solid border border-[#EBEDF0] rounded-[20px] overflow-hidden h-10 gap-2 px-3'>
                    <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                    <input 
                        type="search" 
                        placeholder='Search payments' 
                        className='outline-none font-normal' 
                        value={searchPayment}
                        onChange={(event) => handleSearch(event.target.value)} 
                    />
                </div>
                <button 
                    onClick={() => { 
                        setViewPayment(false); 
                        setAddPaymentClicked(true); 
                    }} 
                    className='bg-[#4285F4] rounded-[20px] h-10 px-6 text-white ml-auto hover:bg-[#2070F5]'
                >
                    Add Payment
                </button>
            </div>

            {/* payments Container  */}
            <div className='flex flex-col gap-6 font-medium'>
                {/* amount details container  */}
                <div className='p-7 bg-white rounded-lg drop-shadow'>
                    {/* amount balance section  */}
                    <div>
                        <p className='text-[#616161]'>Amount balance</p>
                        {paymentsLoading ? 
                            <div className='w-20 h-8 my-0.5 bg-neutral-200 animate-pulse rounded'></div> :
                            <h2 className='text-3xl font-medium'>${paymentsTotalInfo?.total_balance || '0.00'}</h2>
                        }
                    </div>

                    {/* treatment costs section  */}
                    <div className='flex flex-wrap gap-5'>
                        <div className='w-[48%] mt-8 min-w-[390px]'>
                            <p className='text-[#616161] mb-4'>Treatment costs</p>
                            <div className='flex justify-between rounded-2xl border border-solid border-[#EBEDF0] px-5 py-2.5'>
                                <div className='w-full'>
                                    <div>
                                        <h6 className='text-[#888888]'>Treatment cost</h6>
                                        {paymentsLoading ?
                                            <div className='w-14 h-4 my-1.5 bg-neutral-200 animate-pulse rounded'></div>
                                            : <p className='text-lg'>${paymentsTotalInfo?.grand_total || '0.00'}</p>
                                        }
                                    </div>
                                </div>
                                <div className='w-full place-content-center flex border-[#EBEDF0] border-solid border-x'>
                                    <div>
                                        <h6 className='text-[#888888]'>Completed</h6>
                                        {paymentsLoading ?
                                            <div className='w-14 h-4 my-1.5 bg-neutral-200 animate-pulse rounded'></div>
                                            : <p className='text-lg'>${paymentsTotalInfo?.completed || '0.00'}</p>
                                        }
                                    </div>
                                </div>
                                <div className='w-full place-content-center flex'>
                                    <div>
                                        <h6 className='text-[#888888]'>Pending</h6>
                                        {paymentsLoading ?
                                            <div className='w-14 h-4 my-1.5 bg-neutral-200 animate-pulse rounded'></div>
                                            : <p className='text-lg'>${paymentsTotalInfo?.pending || '0.00'}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='w-[48%] mt-8 min-w-[390px]'>
                            <p className='text-[#616161] mb-4'>Outstanding balance</p>
                            <div className='flex justify-between rounded-2xl border border-solid border-[#EBEDF0] px-5 py-2.5'>
                                <div className='w-full'>
                                    <div>
                                        <h6 className='text-[#888888]'>0-30 days</h6>
                                        {paymentsLoading ?
                                            <div className='w-14 h-4 my-1.5 bg-neutral-200 animate-pulse rounded'></div>
                                            : <p className='text-lg'>${paymentsTotalInfo?.age_debitor_30_to_60_days || '0.00'}</p>
                                        }
                                    </div>
                                </div>
                                <div className='w-full place-content-center flex border-[#EBEDF0] border-solid border-x'>
                                    <div>
                                        <h6 className='text-[#888888]'>31-60 days</h6>
                                        {paymentsLoading ?
                                            <div className='w-14 h-4 my-1.5 bg-neutral-200 animate-pulse rounded'></div>
                                            : <p className='text-lg'>${paymentsTotalInfo?.age_debitor_60_to_90_days || '0.00'}</p>
                                        }
                                    </div>
                                </div>
                                <div className='w-full place-content-center flex'>
                                    <div>
                                        <h6 className='text-[#888888]'>60+ days</h6>
                                        {paymentsLoading ?
                                            <div className='w-14 h-4 my-1.5 bg-neutral-200 animate-pulse rounded'></div>
                                            : <p className='text-lg'>${paymentsTotalInfo?.age_debitor_above_90_days || '0.00'}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* payments table */}
                <div className='bg-white rounded-lg drop-shadow overflow-auto'>
                    <table className='w-full table-fixed'>
                        <thead className="text-[#8B8B8B]">
                            <tr className='h-16 text-[#303030]'>
                                <th className='pl-7'>Date</th>
                                <th>ID</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Method</th>
                                <th></th>
                            </tr>
                        </thead>
                        {!paymentsLoading && !paymentsError ?
                            <tbody className='text-[#444648]'>
                                {payments?.map((data: any, index: number) => (
                                    <tr key={index} className='h-14 border-t border-[#EBEDF0]'>
                                        <td className='pl-7'>{moment(data.creation).format("MMM DD, YYYY")}</td>
                                        <td>{data.name}</td>
                                        <td>${data.amount || '0.00'}</td>
                                        <td>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                data.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                                                data.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {data.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td>{data.payment_method || '-'}</td>
                                        <td>
                                            <button 
                                                className='text-blue-600 hover:text-blue-800'
                                                onClick={() => openModal()}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            : <tbody>
                                {/* Loading pulse */}
                                {pulseRows?.map((_, index) =>
                                    <tr key={index} className="animate-pulse h-14 border-t border-[#EBEDF0]">
                                        <td className="pl-7"><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                    </tr>
                                )}
                            </tbody>
                        }
                    </table>
                    
                    {!paymentsLoading && (
                        paymentsError ?
                            <div className='p-4 text-center text-red-600'>
                                Error loading payments
                                <button 
                                    className='ml-2 text-blue-600 hover:text-blue-800'
                                    onClick={() => mutate()}
                                >
                                    Try Again
                                </button>
                            </div>
                            : !payments?.length ?
                                <div className='p-8 text-center text-gray-500'>
                                    No payments found
                                </div>
                                : <div className='p-2 text-right text-sm text-gray-500'>
                                    Total payments: {payments?.length}
                                </div>
                    )}
                </div>
            </div>

            {/* Payment Details Modal */}
            <Modal
                isShow={isOpen}
                setShow={setIsOpen}
                title="Payment Details"
                showButtons={false}
                onCancel={() => closeModal()}
            >
                <div className="space-y-4">
                    <p className="text-gray-600">Payment details would be displayed here...</p>
                    <div className="flex gap-2 mt-4">
                        <button 
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => closeModal(true)}
                        >
                            Send Reminder
                        </button>
                        <button 
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            onClick={() => closeModal()}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ViewPayments
