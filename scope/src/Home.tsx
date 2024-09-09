import React, { useState } from 'react'
import Teeth from './Teeth';

interface DentalChart {
    patient_dental_status?: Tooth[];
}

interface Tooth {
    tooth_no: number;
    permanent: boolean;
    dental_treatments: any[];
}

function Home() {
    const tabs = ["1st Tab", "2nd Tab"];
    const [currentTab, setCurrentTab] = useState("1st Tab");
    const dentalCondition = [{ name: "" }]
    const pulseDentalChart = new Array(32).fill(32)
    const [dentalChart, setDentalChart] = useState<DentalChart>({
        patient_dental_status: [{
            tooth_no: 18,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 17,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 16,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 15,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 14,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 13,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 12,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 11,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 21,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 22,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 23,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 24,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 25,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 26,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 27,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 28,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 48,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 47,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 46,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 45,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 44,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 43,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 42,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 41,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 31,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 32,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 33,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 34,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 35,
            permanent: true,
            dental_treatments: []
        },{
            tooth_no: 36,
            permanent: true,
            dental_treatments: []
        },{
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

    return (
        <div>
            <div className='bg-gray-100 rounded-md minh-[calc(100vh-200px) min-h-[524px] overflow-auto'>
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
                            {dentalChart.patient_dental_status?.map((data, index) => {
                                return <Teeth no={data.tooth_no} key={index} pending={data.permanent} treatments={data.dental_treatments} />
                            }
                            )}
                        </div>
                        {/* mark teeth as permanent or primary buttons */}
                        {
                            dentalChart.patient_dental_status?.length ?
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
        </div>
    )
}

export default Home
