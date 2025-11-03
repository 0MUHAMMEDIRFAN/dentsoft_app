import React, { useContext, useEffect, useState } from 'react'
import { getPatientAppointments } from '../../Api/AppointmentApi'
import moment from 'moment'
import { AppContext } from '../../contexts/AppContext'
import { getPatientAppointmentList } from '../../hooks/usePatientAppointment'


function Appointments() {
    // const [appointments, setAppointments] = useState([])
    // const [appointmentsLoading, setAppointmentsLoading] = useState("Loaded")
    const [appointmentsMeta, setAppointmentsMeta] = useState(1)
    const { selectedPatient } = useContext(AppContext)
    const pulseRows = new Array(10).fill()

    const { data: appointments, isLoading: appointmentsLoading, error: appointmentsError, mutate: refreshAppointments } = getPatientAppointmentList(undefined, selectedPatient.name);

    const listAppointments = async (id = "", date = "", page = 0, size = "") => {
        setAppointmentsLoading("Loading")
        setAppointments([])
        try {
            const result = await getPatientAppointments(id, date, page, size);
            setAppointments(result.data.data)
            setAppointmentsMeta(result.data.meta)
            console.log(result.data.data)
            setAppointmentsLoading("Loaded")
        } catch (error) {
            console.log(error)
            setAppointmentsLoading("Error")
        }
    }
    useEffect(() => {
        // listAppointments(selectedPatient.name)
    }, [])
    return (
        <div className='bg-[#FAFAFD] flex flex-col pl-7 p-5 box-border gap-10 min-h-full fade_in'>
            <div className='bg-white pl-[36px] pt-[20px] rounded-md drop-shadow'>
                <div className='flex gap-5 items-center'>
                    <p className='text-base font-semibold'>Patient Appointments</p>
                    {/* <div className='flex border border-solid border-[#EBEDF0] rounded-[20px] h-10 items-center px-4 gap-2'>
                        <img src={Search} alt="" />
                        <input type="search" placeholder='Search for treatment' className='outline-none w-full' onChange={(event) => listAppointments(event.target.value)} />
                    </div> */}
                </div>
                <div className='overflow-auto pr-[25px] pt-1'>
                    <table className='w-full table-fixed'>
                        <thead className="text-[#303030]">
                            <tr className='h-[60px]'>
                                <th className='w-[5%]'>No.</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Provider</th>
                                <th>Treatment type</th>
                                <th>Payment status</th>
                            </tr>
                        </thead>
                        {!appointmentsLoading || appointmentsError ?
                            <tbody className='text-[#444648]'>
                                {/* Table body */}
                                {appointments?.map((data, index) => {
                                    return (
                                        <tr key={index} className='box-border h-[60px]'>
                                            <td className=''>{index + 1}</td>
                                            <td>{moment(data?.appointment_date).format("DD-MMM-YYYY")}</td>
                                            <td>{moment(data?.appointment_datetime).format("LT")}</td>
                                            <td>
                                                <div className='flex items-center  gap-4'>
                                                    <p className={`${data?.status === "Completed" ? "text-[#5ABA53]" : data?.Status === "Declined" ? "text-[#FF2727]" : "text-[#FE9F2F]"} overflow-hidden flex items-center`}>{data?.status}</p>
                                                </div>
                                            </td>
                                            <td>{data?.practitioner_name}</td>
                                            <td>{data?.appointment_type}</td>
                                            <td >
                                                <div className='flex items-center gap-2'>
                                                    <div className={`${data?.status === "Completed" ? "bg-[#5ABA53]" : data?.status === "Declined" ? "bg-[#FF2727]" : "bg-[#FE9F2F]"} w-[8px] h-[8px] rounded-full`}></div>
                                                    <p className={`${data?.status === "Completed" ? "text-[#5ABA53]" : data?.status === "Declined" ? "text-[#FF2727]" : "text-[#FE9F2F]"} overflow-hidden whitespace-nowrap text-ellipsis flex items-center`}>{data?.status}</p>
                                                </div>
                                            </td>

                                        </tr>

                                    )
                                })}
                            </tbody>
                            : <tbody>
                                {/* Table Loading pulse */}
                                {pulseRows?.map((_, index) =>
                                    <tr key={index} className="animate-pulse h-[60px]">
                                        <td className="w-[5%]"><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
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
                                    <td></td>
                                    <td></td>
                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                </tr>
                            </tbody>
                        }
                    </table>
                    {!appointmentsLoading && (
                        appointmentsError ?
                            <div className='flex flex-col justify-center items-center'>
                                <p>Error while Loading Appointments</p>
                                <button className='bg-[#4285F4] rounded h-[20px] px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => refreshAppointments()}>Try Again</button>
                            </div>
                            : appointments?.length ?
                                <div className='box-border h-11 bg-white flex gap-5 justify-end items-center pl-0 p-2'>
                                    <i className='bx bx-rotate-right mr-auto cursor-pointer text-lg' onClick={() => refreshAppointments()}></i>
                                    <p>Total :&nbsp; {appointments?.length} / {appointmentsMeta?.total}</p>
                                    <p>page {appointmentsMeta?.page + 1} of {Math.floor(((appointmentsMeta?.total - 1) / appointmentsMeta?.size) + 1)}</p>
                                    <div className={`${appointmentsMeta?.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { appointmentsMeta?.page != 0 && listAppointments(selectedPatient.name, "", appointmentsMeta?.page - 1, appointmentsMeta?.size) }}>
                                        &lt;
                                    </div>
                                    <div className={`${appointmentsMeta?.page < Math.floor((appointmentsMeta?.total - 1) / appointmentsMeta?.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { appointmentsMeta?.page < Math.floor((appointmentsMeta?.total - 1) / appointmentsMeta?.size) && listAppointments(selectedPatient.name, "", appointmentsMeta?.page + 1, appointmentsMeta?.size) }}>
                                        &gt;
                                    </div>
                                    <p>size :
                                        <select name="" id="" defaultValue={appointmentsMeta?.size} onChange={(event) => listAppointments(selectedPatient.name, "", "", event.target.value)} className='default-select-icon'>
                                            <option value="5">5 </option>
                                            <option value="10">10 </option>
                                            <option value="15">15 </option>
                                            <option value="20">20 </option>
                                            <option value="50">50 </option>
                                        </select>
                                    </p>
                                </div>
                                : <div className='box-border min-h-[60px] bg-white flex justify-center items-center'>
                                    No Appointments Found
                                </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Appointments
