import React, { useEffect, useState } from 'react'
import Teeth from './Teeth';
import { useFrappeAuth, useFrappeGetDocList } from 'frappe-react-sdk';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

interface DentalChart {
    patient_dental_status: Tooth[];
}

interface Tooth {
    tooth_no: number;
    permanent: boolean;
    dental_treatments: any[];
}

function DentalChart() {
    const tabs = ["1st Tab", "2nd Tab"];
    const [currentTab, setCurrentTab] = useState("1st Tab");
    // const dentalCondition = [{ name: "" }]
    const pulseDentalChart = new Array(32).fill(32)
    const [dentalChartList, setDentalChart] = useState<DentalChart>({
        patient_dental_status: [{
            tooth_no: 18,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 17,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 16,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 15,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 14,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 13,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 12,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 11,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 21,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 22,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 23,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 24,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 25,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 26,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 27,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 28,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 48,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 47,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 46,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 45,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 44,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 43,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 42,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 41,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 31,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 32,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 33,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 34,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 35,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 36,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 37,
            permanent: true,
            dental_treatments: []
        }, {
            tooth_no: 38,
            permanent: true,
            dental_treatments: []
        }]
    });
    const [patientDentalChartLoading, setPatientDentalChartLoading] = useState("Loaded")
    const { currentUser, getUserCookie } = useFrappeAuth()
    const [docList, setDocList] = useState<any[] | undefined>([])
    const query = new URLSearchParams(useLocation().search);
    const patient = query.get('patient');
    const { data: docListClinical, error, isLoading, isValidating, mutate } = useFrappeGetDocList(
        'Clinical Procedure',
        {
            fields: ['*'],
            filters: [['patient', '=', patient]],
        }
    )
    useEffect(() => {
        setDocList(docListClinical)
        console.log(patient);
        docListClinical?.map((data) => {
            const index: number = dentalChartList.patient_dental_status.findIndex(tooth => tooth.tooth_no == data.custom_teeth)
            console.log(index)
            if (index !== -1) {
                const updatedDentalChartList = [...dentalChartList.patient_dental_status];
                updatedDentalChartList[index] = {
                    ...updatedDentalChartList[index],
                    dental_treatments: [...updatedDentalChartList[index].dental_treatments, data]
                }
                setDentalChart({ patient_dental_status: updatedDentalChartList })
            }
        })
        console.log(docListClinical)
    }, [docListClinical])
    // console.log(dentalChartList)
    return (
        <div>
            <p>{currentUser}</p>
            <p>{patient || "No Patient Selected"}</p>
            <div className='bg-gray-100 mt-2 rounded-md minh-[calc(100vh-200px) min-h-[524px] overflow-auto'>
                <div className='h-14 border-b font-medium '>

                    {/* <<<<<<<------Container Tabs------>>>>>>> */}

                    <ul className='flex w-full gap-2 items-center h-full text-[#616161]' >
                        {tabs.map((tab, index) =>
                            <li key={index} className={`${currentTab === tab && "border-b-[#446DFF] border-b-4 text-[#446DFF] "} w-full max-w-[120px] h-full cursor-pointer flex justify-center items-center custom-transition`} name={tab} onClick={() => setCurrentTab(tab)}>{tab}</li>
                        )
                        }
                    </ul>
                </div>
                {currentTab === "Conditions" ?
                    // display when tab is changed to Condition 
                    <div className='flex flex-col gap-2 p-3'>
                        {/* {dentalCondition.map((data, index) =>
                            <div key={index} className='p-3 border border-solid rounded flex justify-between'>
                                {data?.name}
                                <div className='flex gap-2'>
                                    <button className='bg-[#FF0000c0] rounded h-8 px-2 font-medium text-white hover:bg-[#FF0000] custom-transition' onClick={() => removeDentalCondition(data.id)}>Delete</button>
                                    <button className='bg-[#4285F4] rounded h-8 px-2 font-medium text-white hover:bg-[#2070F5] custom-transition' onClick={() => { setDentalForm({ name: data.name, code: data.code }); setisOpenDentalConditionModal(true) }}>Edit</button>
                                </div>
                            </div>
                        )}
                        <button className='bg-[#4285F4] rounded h-8 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => setisOpenDentalConditionModal(true)}>Add new dental Condition</button> */}
                    </div>
                    : <div className='flex flex-col p-2 pt-5 gap-5 items-center justify-center'>
                        {/* teeth listed Container */}
                        <div className='grid grid-cols-[repeat(16,minmax(0,1fr))] gap-y-2'>
                            {dentalChartList.patient_dental_status?.map((data, index) => {
                                return <Teeth no={data.tooth_no} key={index} pending={data.permanent} treatments={data.dental_treatments} />
                            }
                            )}
                        </div>
                        {/* mark teeth as permanent or primary buttons */}
                        {
                            dentalChartList.patient_dental_status?.length ?
                                <div className='flex items-center justify-center gap-2'>
                                    {/* <button className='bg-[#ff0000] text-white rounded-md h-8 px-2 border border-black border-solid hover:scale-105 active:scale-100 custom-transition' onClick={setTeethAsPermenent}>Mark As Permanent</button>
                                    <button className='bg-white rounded-md h-8 px-2 border border-solid hover:scale-105 active:scale-100 custom-transition' onClick={setTeethAsPrimary}>Mark As Primary</button> */}
                                </div> :
                                // <<<<<-----Error Handling and Loading handling----->>>>> 
                                patientDentalChartLoading === "Loading" ?
                                    <div className='grid grid-cols-[repeat(16,minmax(0,1fr))] gap-2 animate-pulse'>
                                        {pulseDentalChart.map((_, index) =>
                                            <div key={index} className={`${index > 15 && "rotate-180"} h-44 w-10 flex flex-col justify-between items-center pt-2`}>
                                                <div className='bg-neutral-200 rounded w-6 h-[69px]'></div>
                                                <div className='bg-neutral-200 rounded w-full h-10'></div>
                                            </div>
                                        )}
                                    </div>
                                    : patientDentalChartLoading === "Loaded" ? "No Chart Found"
                                        : <div className='flex flex-col justify-center items-center h-full'>
                                            <p>Error while Loading Dental Chart</p>
                                            <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listPatientDentalChart(selectedPatient.name)}>Try Again</button>
                                        </div>
                        }
                    </div>}
            </div>
            <div className='bg-gray-50 mt-2 pt-2 rounded-md'>
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
                        {docList?.map((data, index) => {
                            return (
                                <tr key={index}
                                    title='Click to Update'
                                    className='box-border h-12 hover:bg-gray-100 active:bg-gray-200 cursor-pointer custom-transition'
                                // onClick={() => { setForm(data); setSelectedPatientTreatment(data); setPatientTreatmentButton(false); setSelectedTreatment(data?.treatment); setTreatmentOpen(true); false && openNoteModal({ ...data, note: data.remarks || "-----" }, true); }}
                                >
                                    <td className='pl-6'>{moment(data.creation).format("DD-MMM-YYYY")}</td>
                                    <td>{data.practitioner_name}</td>
                                    <td>{data.procedure_template}</td>
                                    <td>{data.custom_teeth || "Not Added"}</td>
                                    {/* <td>{data.custom_teeth?.map((tooth, index, array) => tooth?.tooth_no + (index === array.length - 1 ? "" : ","))}</td> */}
                                    <td>{data.consumable_total_amount}</td>
                                    <td className='max-w-[150px]'>{data.procedure_template}</td>
                                    <td className='pr-2'>
                                        <div className={`${data.status === "Completed" ? "text-[#5ABA53]" : data.status === "Draft" ? "text-[#aeb0b3]" : data.status === "Submitted" ? "text-[#0000FF]" : data.status === "Cancelled" ? "text-[#FF2727]" : "text-[#FE9F2F]"} flex items-center gap-2`}>
                                            <i className="fa-solid fa-circle text-[10px]"></i>
                                            <p className={`flex items-center`}>{data.status}</p>
                                        </div>
                                    </td>

                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {/* {docList.length ?
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

                    </div>
                } */}
            </div>
        </div>
    )
}

export default DentalChart