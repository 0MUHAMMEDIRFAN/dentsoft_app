import React from 'react'

function Treatment() {

    return (
        <div>
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
                        {data.map((data, index) => {
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
                {data.length ?
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
    )
}

export default Treatment
