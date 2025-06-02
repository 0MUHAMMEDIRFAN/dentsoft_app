import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import faker from 'faker';
import moment from 'moment';
import { getAppointmentsOverview, getDocumentsOverview, getPaymentsOverview, getTreatmentsOverview } from '../../Api/ChartApi';

function ReportAnalysis() {
    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState("Loaded")
    const [documentOverview, setDocumentsOverview] = useState([])

    const listDocumentsOverview = async (startDate, endDate, doctorId, patientId, orderBy) => {
        try {
            const result = await getDocumentsOverview(startDate, endDate, doctorId, patientId, orderBy)
            setDocumentsOverview(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    const listAppointmentsOverview = async (startDate, endDate, doctorId, patientId, orderBy, type, status, mode) => {
        try {
            const result = await getAppointmentsOverview(startDate, endDate, doctorId, patientId, orderBy, type, status, mode)
            setDocumentsOverview(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    const listPaymentsOverview = async (startDate, endDate, doctorId, patientId, orderBy, type, status, mode) => {
        try {
            const result = await getPaymentsOverview(startDate, endDate, doctorId, patientId, orderBy, type, status, mode)
            setDocumentsOverview(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    const listTreatmentsOverview = async (startDate, endDate, doctorId, patientId, orderBy, type, status, mode) => {
        try {
            const result = await getTreatmentsOverview(startDate, endDate, doctorId, patientId, orderBy, type, status)
            setDocumentsOverview(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ArcElement, Tooltip, Legend);
    const labels = ['01', '05', '10', '15', '20', '25', '30', "days"];
    const LineData = {
        labels,
        datasets: [
            {
                label: 'Production',
                data: labels.map(() => faker.datatype.number({ min: 0, max: 80000 })),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Collection',
                data: labels.map(() => faker.datatype.number({ min: 0, max: 80000 })),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };
    const DoughnutData = {
        labels: [],
        datasets: [
            {
                label: '%',
                data: [10, 20, 15],
                backgroundColor: [
                    '#7952DA',
                    '#9A74F7',
                    '#F4BE37',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
                hoverOffset: 5,
            },
        ],
    }

    const datas = [{
        provider: "Dr same",
        production: "$50000",
        date: "12-12-12",
        collection: "$55000",
        discount: "$55000",
    },
    {
        provider: "Dr jacob",
        production: "$80000",
        date: "12-12-12",
        collection: "$55000",
        discount: "$55000",
    },
    {
        provider: "Dr Salim",
        production: "$55000",
        date: "12-12-12",
        collection: "$55000",
        discount: "$55000",
    },]

    useEffect(() => {
        listDocumentsOverview()
        listAppointmentsOverview()
        listPaymentsOverview()
        listTreatmentsOverview()
    }, [])
    return (
        <div className='bg-[#FAFAFD] text-[#444648] flex flex-col p-7 box-border h-full w-full overflow-auto fade_in'>
            <div className='flex gap-2 items-center pb-6 '>
                <h2 className='text-[22px] font-semibold'>Report and Analysis</h2>
            </div>

            {/* <<<<<<<<<<----------Line Chart---------->>>>>>>>>> */}

            <div className='bg-white drop-shadow font-medium text-black p-3 my-5 rounded-lg'>
                <p>Production & Collections for period</p>
                <Line options={options} data={LineData} />
            </div>

            {/* <<<<<<<<<<----------Doughnut Chart---------->>>>>>>>>> */}

            <div className='flex w-full justify-between font-semibold'>
                <div className='flex flex-col w-1/4 bg-white rounded-lg p-5 drop-shadow'>
                    <div className='flex flex-col items-center justify-between w-full'>
                        <p>Production</p>
                        <Doughnut data={DoughnutData} />
                    </div>
                    <div className='w-full p-4 flex flex-col gap-4'>
                        <p className='m-auto'>Providers</p>
                        {datas?.map((obj, index) => {
                            return (
                                <div key={index} className='flex gap-2 font-medium m-auto text-[#717171]'>
                                    <p className='bg-black w-2 h-2 rounded-full mt-2'></p>
                                    <div className='flex flex-col gap-2'>
                                        <p className='text-[#A4A4A4] text-xs'>{obj.provider}</p>
                                        <p className='text-[#101010] text-base'>{obj.production}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='flex flex-col w-1/4 bg-white rounded-lg p-5 drop-shadow'>
                    <div className='flex flex-col items-center justify-between w-full'>
                        <p>Collection</p>
                        <Doughnut data={DoughnutData} />
                    </div>
                    <div className='w-full p-4 flex flex-col gap-4'>
                        <p className='m-auto'>Providers</p>
                        {datas?.map((obj, index) => {
                            return (
                                <div key={index} className='flex gap-2 font-medium m-auto text-[#717171]'>
                                    <p className='bg-black w-2 h-2 rounded-full mt-2'></p>
                                    <div className='flex flex-col gap-2'>
                                        <p className='text-[#A4A4A4] text-xs'>{obj.provider}</p>
                                        <p className='text-[#101010] text-base'>{obj.production}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='flex flex-col w-1/4 bg-white rounded-lg p-5 drop-shadow'>
                    <div className='flex flex-col items-center justify-between w-full'>
                        <p>Production</p>
                        <Doughnut data={DoughnutData} />
                    </div>
                    <div className='w-full p-4 flex flex-col gap-4'>
                        <p className='m-auto'>Procedure Classes</p>
                        {datas?.map((obj, index) => {
                            return (
                                <div key={index} className='flex gap-2 font-medium m-auto text-[#717171]'>
                                    <p className='bg-black w-2 h-2 rounded-full mt-2'></p>
                                    <div className='flex flex-col gap-2'>
                                        <p className='text-[#A4A4A4] text-xs'>{obj.provider}</p>
                                        <p className='text-[#101010] text-base'>{obj.production}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>

            {/* <<<<<<<<<<----------Prdctn & clctn Table---------->>>>>>>>>> */}

            <div className='bg-[#FAFAFD] text-[#444648] flex flex-col box-border h-full'>
                <div className='overflow-auto mt-[25px] h-full rounded-md drop-shadow'>
                    <table className='w-full  bg-white'>
                        <thead className="text-[#8B8B8B]">
                            <tr className='h-[60px] text-[#616161]'>
                                <th className='pl-9 max-w-[200px]'>Provider</th>
                                <th>Date</th>
                                <th>Production</th>
                                <th>Collection</th>
                                <th>Discount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className='text-[#444648]'>
                            {datas?.map((data, index) => {
                                return (
                                    <tr key={index} className='box-border h-[60px]'>
                                        <td className='pl-9 max-w-[200px]'>{data.provider}</td>
                                        <td>{moment(data.date).format("Do MMM YYY")}</td>
                                        <td>{data.production}</td>
                                        <td>{data.collection}</td>
                                        <td>{data.discount}</td>
                                    </tr>

                                )
                            })}
                        </tbody>
                    </table>
                    {/* {datas?.length ? "" :
                        <div className='box-border h-[60px] bg-white flex justify-center items-center'>
                            {usersLoading === "Loading" ?
                                <i className='bx bx-loader-alt animate-spin text-2xl'></i>
                                : usersLoading === "Loaded" ? "No Users Found"
                                    : <div className='flex flex-col justify-center items-center'>
                                        <p>Error while Loading Users</p>
                                        <button className='bg-[#4285F4] rounded h-[20px] px-2 font-medium text-white hover:bg-[#2070F5]' onClick={listUsers}>Try Again</button>
                                    </div>}
                        </div>
                    } */}
                </div>
            </div>
        </div>
    )
}

export default ReportAnalysis
