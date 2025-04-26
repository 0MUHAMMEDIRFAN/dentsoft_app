import React, { useContext, useEffect, useRef, useState } from 'react'
import AsyncSelect from 'react-select/async'
import Clock from "../../assets/Clock.svg"
import Phone from "../../assets/Phone.svg"
import TypeIcon from "../../assets/Type.svg"
import LocationIcon from "../../assets/Location.svg"
import UserIcon from "../../assets/User.svg"
import NotesIcon from "../../assets/Notes.svg"
import styles from "./Home.module.css"
import { ToastContext } from '../../contexts/ToastContext'
import { createAppointment, deleteAppointment, getAppointmentTypes, getAppointments } from '../../Api/AppointmentApi'
import { AppContext } from '../../contexts/AppContext'
import moment from 'moment'
import { getUsers } from '../../Api/UserApi'
import Animation from '../Animation/Animation'
import { Form, useNavigate } from 'react-router-dom'
import { ApiContext } from '../../contexts/ApiContext'
function Home() {
  const mainContainerRef = useRef(null)
  const [addAppointmentOpen, setAddAppointmentOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [viewAppointmentOpen, setViewAppointmentOpen] = useState(false)
  const [appointmentInfo, setAppointmentInfo] = useState({})
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { listAppointments, listDoctorAppointments, listDoctors, doctors, setDoctors, backDoctors, setBackDoctors, calendarLoaded, doctorsLoaded, setCalendarLoaded, setDoctorsLoaded, topbarDate, appointments, setAppointments, patients, setPatients, listPatients, appointmentTypes, setAppointmentTypes, listAppoimentTypes } = useContext(ApiContext)
  const { sidebarCollapse, selectedPatient, selectPatient, selectedAppointment, setSelectedAppointment, setSearchValue } = useContext(AppContext)
  const { notify } = useContext(ToastContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const rows = new Array(48).fill()
  const timeColumn = new Array(24).fill()
  const prefillInput = (decimalValue, columnIndex = "") => {
    const date = new Date(topbarDate)
    const hours = Math.floor(decimalValue);
    const minutes = Math.round((decimalValue % 1) * 60);
    date.setHours(hours)
    date.setMinutes(minutes)
    setForm((prev) => ({ ...prev, appointment_date: moment(date).format("YYYY-MM-DD"), appointment_time: moment(date).format("HH:mm"), duration: moment(date).add(30, "minutes").format("HH:mm"), practitioner: doctors[columnIndex].name, doctor_name: doctors[columnIndex].practitioner_name }))
  }
  const inputs = [
    { head: "Choose appointment type", types: [{ type: "select" }], options: [], name: "appointment_type", required: true },
    { head: "Enter Date", types: [{ type: "date" }], options: [""], name: "appointment_date", required: true },
    { head: "Enter start time", types: [{ type: "time" }], options: [""], name: "appointment_time", required: true },
    { head: "Enter Duration ( minutes )", types: [{ type: "number" }], name: "duration", required: true },
    { head: "Choose Service provider", types: [{ type: "select" }], options: [], name: "practitioner", required: true },
    { head: "Choose Patient", types: [{ type: "select" }], options: [], name: "patient", required: true },
    // { head: "Choose appointment Status", types: [{ type: "select" }], options: ["APPOINTMENT_CONFIRMED", "UNCONFIRMED", "LEFT_MESSAGE", "ARRIVED", "IN_TREATMENT_ROOM", "COMPLETED"], name: "status", required: true },
    { head: "Choose appointment Status", types: [{ type: "select" }], options: ["Scheduled", "Open", "Checked In", "Checked Out", "Closed", "Cancelled", "No Show"], name: "status", required: true },
    { head: "Appointment mode", types: [{ text: "Walk_in", type: "radio" }, { text: "Telephone", type: "radio", }], name: "mode", required: true },
    { head: "Notes (Optional)", types: [{ type: "text" }], name: "notes", required: false },
  ]
  const [form, setForm] = useState({
    patient: selectedPatient?.name || "",
    patient_name: selectedPatient?.patient_name || "",
    appointment_type: "",
    appointment_date: moment().format("YYYY-MM-DD"),
    appointment_time: moment().format("HH:mm"),
    status: "Scheduled",
    duration: moment().add(30, "minutes").format("HH:mm"),
    practitioner: "",
    doctor_name: "",
    mode: "",
    notes: "",
  })



  const handleSelectAppointment = (appointment) => {
    console.log(appointment);
    setSelectedAppointment(appointment)
    localStorage.setItem("selectedAppointment", JSON.stringify(appointment))
    // setSearchValue(appointment?.patient);
    selectPatient({
      name: appointment.patient,
      patient_name: appointment.patient_name,
      patient_age: appointment.patient_age,
      sex: appointment.patient_sex,

    });
    navigate("/patient/overview");
  }
  const addAppointment = async () => {
    try {
      const payload = form;
      const appointment = await createAppointment(payload);
      setLoading(false)
      notify("Appointment Added Successfully", "success")
      // console.log(appointment)
      listAppointments(topbarDate);
      listDoctors();
      closeAddAppointment()

    } catch (error) {
      console.log(error)
      setLoading(false)
      notify("Error while adding appointment", "error")
    }
  }
  const removeAppointment = async (id) => {
    try {
      const result = await deleteAppointment(id)
      listAppointments(topbarDate)
      listDoctors("", "");
      closeViewAppointment()
      notify("Appointment Deleted Successfully", "error")
    } catch (error) {
      console.log(error)
      notify(error.message, "error")
    }
  }
  const handleChange = (event) => {
    const { type, value, name } = event.target
    if (name === "appointment_date") {
      const startDate = new Date(value);
      setForm((prev) => ({
        ...prev,
        [name]: moment(startDate).format("YYYY-MM-DD"),
        appointment_time: moment(startDate).format("HH:mm")
      }))
    } else
      type === "number" ?
        value === "" ?
          setForm((prev) => ({ ...prev, [name]: value, }))
          : setForm((prev) => ({ ...prev, [name]: Number(value), }))
        : setForm((prev) => ({ ...prev, [name]: value, }))
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!loading) {
      setLoading(true)
      addAppointment();
      console.log(form)
    }
  }
  const closeAddAppointment = () => {
    if (!loading) {
      setAddAppointmentOpen(false)
      setForm({
        patient: selectedPatient?.name || "",
        patient_name: selectedPatient?.patient_name || "",
        appointment_type: "",
        appointment_date: moment().format("YYYY-MM-DD"),
        appointment_time: moment().format("HH:mm"),
        status: "Scheduled",
        duration: moment().add(30, "minutes").format("HH:mm"),
        practitioner: "",
        doctor_name: "",
        mode: "",
        notes: "",
      })
    }
  }
  const toggleExpandViewAppointment = (appointment, action) => {
    setAppointments(prev => {
      const index = appointments.findIndex(obj => obj.name === appointment.name)
      if (index != -1) {
        prev.splice(index, 1, { ...appointment, expanded: action })
      }
      return [...prev]
    });
    setAppointmentInfo(appointment)
    setViewAppointmentOpen(true)
  }
  const closeViewAppointment = () => {
    setViewAppointmentOpen(false)
  }
  const handleAppointmentMouseEnter = (index) => {
    console.log(index)
    setHoveredIndex(index);
  };

  const handleAppointmentMouseLeave = () => {
    setHoveredIndex(null);
  };
  const getAppointmentHeight = (index, appointment) => {
    if (hoveredIndex === index) {
      return '450px'; // Increased height for the hovered row
    }
    else
      `${appointment.duration / 7.5}rem` // Default height
  };
  useEffect(() => {
    console.log(appointments)
    // if (true) {
    //   if (selectedProvider) {
    //     listDoctorAppointments(selectedProvider)
    //   } else {
    //     listDoctors("", "");
    //     listAppointments(topbarDate);
    //   }
    //   appointmentTypes.length ? "" : listAppoimentTypes();
    // }
  }, [])

  return (
    <div ref={mainContainerRef} id='mainContainer' className='h-full w-full bg-white relative overflow-auto scroll-smooth fade_in' onLoad={(event) => { event }}>
      <div className='flex w-full overflow-y-hidden snap-xsnap-mandatory'>
        {/* time_column or 1st column  */}
        <div className='min-w-[83px] sticky left-0 bg-white z-20 '>
          <div className={`${styles.half_column} h-16 z-10 flex items-center justify-center font-medium bg-white border w-full`}><img src={Clock} width={15} alt="" /></div>
          {timeColumn.map((data, index) => {
            return (
              <div key={index} className={`${styles.time_column} w-full h-32 flex items-center justify-center border ${new Date().getHours() === index ? 'text-black' : 'text-[#B3B6B9]'}`}>
                {index === 0 ? 12 + " AM" : index < 12 ? index + " AM" : index === 12 ? index + "  PM" : (index) % 12 + " PM"}
              </div>
            )
          })}
        </div>
        {/* other columns with doctor name heading */}
        {doctors?.map((provider, providerIndex) => {
          return (
            <div key={providerIndex} className='w-full h-full flex relative flex-col items-center justify-center min-w-[218px] snap-start'>
              <div className={`${styles.half_column} w-full h-16 z-10 flex items-center justify-center sticky top-0 font-medium bg-white border text-center`}>
                {provider?.practitioner_name}
              </div>
              {rows?.map((_, rowIndex) => {
                return (
                  <div key={rowIndex} className={`${styles.half_column} w-full h-16 border hover:bg-[#cfcfcf50] custom-transition`} onClick={() => {
                    // (selectedPatient?.length != 0 && selectedPatient != null) ?
                    (prefillInput(rowIndex / 2, providerIndex), setAddAppointmentOpen(true))
                    // : notify("Select A patient First", "info")
                  }}>
                  </div>
                )
              })}
              {/* all appointment cards are listed here */}
              <div className='h-full w-full top-0 absolute pointer-events-none'>
                {appointments?.filter((appointment) => { return appointment.practitioner === provider.name })
                  // .sort((a, b) => new Date(a.appointment_datetime) - new Date(b.appointment_datetime) || new Date(b.duration) - new Date(a.duration))
                  .map((appointment, filteredAppointmentIndex, filteredAppointments) => {
                    // function appointmentsCount(appointments, passAppointment, index) {
                    //   const filtered = appointments.filter((filteredAppointment) => passAppointment.duration > filteredAppointment.start_time && passAppointment.start_time <= filteredAppointment.start_time)
                    //   if (appointment.similarAppointments <= filtered.length || appointment.similarAppointments === undefined) {
                    //     appointment.similarAppointments = filtered.length
                    //   }
                    //   const currentIndex = filtered.findIndex(findAppointment => passAppointment.id === findAppointment.id)
                    //   if (filtered.length > 1) {
                    //     filtered.splice(currentIndex, 1)
                    //     filtered.forEach((filteringAppointment) => {
                    //       appointmentsCount(appointments, filteringAppointment)
                    //     })
                    //   }
                    //   return filtered
                    // }
                    // const filteredAppointmentsCount = appointmentsCount(filteredAppointments, appointment, appointmentIndex)
                    // appointment.currentIndex = appointments.filter((filteredAppointment) => appointment.duration > filteredAppointment.start_time && appointment.start_time <= filteredAppointment.start_time).findIndex(findAppointment => appointment.id === findAppointment.id)

                    // const currentIndex = appointment.similarAppointments.findIndex(findAppointment => appointment.id === findAppointment.id)
                    // appointment.similarAppointments > 1 && console.log(appointment.similarAppointments - 1, appointment.currentIndex, appointment.doctor.name, appointment.start_time, appointment.duration)
                    const appointmentIndex = (filteredAppointmentIndex + "" + providerIndex)
                    return (
                      <div key={appointmentIndex}
                        className={
                          `${hoveredIndex === appointmentIndex ?
                            `${providerIndex === 0 ? "left-1" :
                              (providerIndex === doctors.length - 1 && doctors.length > 1) ?
                                "right-1" :
                                "-left-5"} shadow-[0px_4px_30px_rgba(0,0,0,0.15)] -top-1/2 -ranslate-y-1/4 z-[50] w-[32vw]` : `${(providerIndex === doctors.length - 1 && doctors.length > 1) ? "right-[calc(10%-4px)]" : "left-1"} w-[90%]`} absolute rounded-md max-w-[32vw] text-xs text-[#444648] flex overflow-hidden cursor-pointer pointer-events-auto  min-h-[2rem] custom-transition border`
                        }
                        style={{
                          top: `${(new Date(appointment.appointment_datetime).getHours() + new Date(appointment.appointment_datetime).getMinutes() / 60) * 8 + 4}rem`,
                          // height: hoveredIndex===appointmentIndex ? "450px" : `${new Date(appointment.duration).getHours() * 8 + (new Date(appointment.duration).getMinutes() / 60 * 8) - (new Date(appointment.appointment_datetime).getHours() * 8 + (new Date(appointment.appointment_datetime).getMinutes() / 60 * 8))}rem`,
                          height: hoveredIndex === appointmentIndex ? "450px" : `${appointment.duration / 7.5}rem`,
                          // width: hoveredIndex===appointmentIndex ? "32vw" : `calc(90%/${appointment.similarAppointments} - 1px)`,
                          width: hoveredIndex === appointmentIndex ? "32vw" : `calc(90% - 1px)`,
                          // left: hoveredIndex===appointmentIndex ? "" : `calc((${(appointment.currentIndex + 0) * (90 / appointment.similarAppointments)}%) + (${appointment.currentIndex + 1} * 1px))`,
                          // background: hoveredIndex===appointmentIndex ? "#ffffff" : appointment.appointment_type?.color_code === "#FF83AD" ? "#FFEFF4" : appointment.appointment_type?.color_code === "#34A853" ? "#E5F4E9" : appointment.appointment_type?.color_code === "#9E97E4" ? "#F2F2FC" : appointment.appointment_type?.color_code === "#D57770" ? "#FAEDEC" : appointment.appointment_type?.color_code === "#CBAF96" ? "#F8F5F1" : appointment.appointment_type?.color_code === "#9E98BC" ? "#F2F2F6" : appointment.appointment_type?.color_code === "#E69140" ? "#FCF1E6" : appointment.appointment_type?.color_code === "#0000FF" ? "#DEDEFF" : appointment.appointment_type?.color_code === "#4285F4" ? "#D7E5FD" : "#0000FF21"
                          background: hoveredIndex === appointmentIndex ? "#ffffff" : appointmentTypes.find(type => appointment?.appointment_type === type.name)?.color
                        }}

                        // onMouseOver={() => { !hoveredIndex===appointmentIndex && toggleExpandViewAppointment(appointment, true) }}
                        onMouseOver={() => { handleAppointmentMouseEnter(appointmentIndex) }}
                        onMouseLeave={() => { handleAppointmentMouseLeave() }}
                        // onMouseLeave={() => { toggleExpandViewAppointment(appointment, false) }}
                        onClick={() => {
                          handleSelectAppointment(appointment)
                        }}
                      >
                        {/* appointment card left margin */}
                        {appointment.similarAppointments <= 1 &&
                          <div
                            className={`max-h-full w-2 custom-transition`}
                            style={{
                              background: hoveredIndex === appointmentIndex ? "#f5f5f5" : appointmentTypes.find(type => appointment?.appointment_type === type.name)?.color,
                            }}
                          >
                          </div>
                        }
                        {/* appointment cards content section  */}
                        <div className={`${hoveredIndex === appointmentIndex ? "py-6 px-4 gap-6" : " gap-2 p-3"} flex flex-col w-full custom-transition`}>
                          <div className={`${hoveredIndex === appointmentIndex ? "pb-6" : "pb-2"} border-b custom-transition`}>
                            <p className={`${hoveredIndex === appointmentIndex ? 'font-bold text-[18px] whitespace-nowrap pb-1' : "font-semibold"} w-full text-black border-b-[#E0E0E0] custom-transition`}>
                              {
                                // hoveredIndex===appointmentIndex ? "" :
                                appointment.similarAppointments > 1 ? appointment.name : `${appointment.patient_name}(${appointment.name})`}
                              {/* ({appointment.similarAppointments} {appointmentIndex} {appointment.currentIndex}) */}
                            </p>
                            <p className={`${hoveredIndex === appointmentIndex ? "" : "hidden"} custom-transition`}>{`${moment(appointment.appointment_date).format("DD-MM-YYYY")} | ${moment(appointment.appointment_datetime).format("LT")} - ${appointment.duration} mins`}</p>
                          </div>
                          {hoveredIndex === appointmentIndex ?
                            <>
                              <div className='flex gap-4 text-sm'>
                                <img src={TypeIcon} alt="" className='bg-[#F4F4FF] rounded p-3' />
                                <div>
                                  <p>Appointment Type</p>
                                  <p className='font-bold'>{appointment.appointment_type}</p>
                                </div>
                              </div>
                              <div className='flex gap-4 text-sm'>
                                <img src={UserIcon} alt="" className='bg-[#F4F4FF] rounded p-3' />
                                <div>
                                  <p>Provider</p>
                                  <p className='font-bold'>{appointment.practitioner_name}</p>
                                </div>
                              </div>
                              <div className='flex gap-4 text-sm'>
                                <img src={LocationIcon} alt="" className='bg-[#F4F4FF] rounded p-3' />
                                <div>
                                  <p>Appointment mode</p>
                                  <p className='font-bold'>{appointment.mode}</p>
                                </div>
                              </div>
                              <div className='gap-4 p-5 rounded-md text-sm bg-[#D1FFF1]'>
                                <img src={NotesIcon} alt="" className='inline mr-3' />
                                <span className='font-medium'>Notes</span>
                                <p className='pt-1 text-[#818181]'>{appointment.notes}</p>
                              </div>
                              <button type='button' className='absolute right-4 top-4' onClick={handleAppointmentMouseLeave} ><i className='bx bx-x text-2xl leading-7' /></button>
                              {/* <button className='absolute right-14 top-7 border border-solid rounded bg-[#FF3C5F] text-[#FFF] px-3' onClick={() => removeAppointment(appointment.id)}>Delete</button> */}
                            </> :
                            <>
                              <p className='flex gap-2'><img src={Clock} alt="" />{moment(appointment.appointment_datetime).format("LT") + "-" + ` (${appointment.duration} mins)`}</p>
                              <p className='flex gap-2'><img src={Phone} alt="" />{appointment.patient?.phone}</p>
                            </>
                          }
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

          )
        })}
      </div >
      {(doctorsLoaded === "loaded" && calendarLoaded === "loaded") ? ""
        :
        (doctorsLoaded === "error" || calendarLoaded === "error") ?
          <div className={`${sidebarCollapse ? "w-[calc(100%-80px)]" : "w-[calc(100%-200px)]"} fixed z-40 bottom-0 right-0 bg-white bg-opacity-75 h-[calc(100%-70px)] flex flex-col justify-center items-center custom-transition`}>
            <p>Error While Loading Calendar</p>
            <button className='bg-[#4285F4] w-[114px] h-[41px] text-white rounded-[5px] font-bold' onClick={() => { listAppointments(topbarDate); listDoctors() }}>Try Again</button>
          </div>
          : (doctorsLoaded === "loading" || calendarLoaded === "loading") &&
          < Animation />
      }

      {/* <<<<<<<<<<----------Filter Appointment (right bottom filtering on home page) ---------->>>>>>>>>> */}

      {/* <div className={`w-full h-full fixed inset-0 z-[100] bg-black bg-opacity-10 custom-transition`}></div> */}
      {
        selectedPatient ? "" :
          <div className={`fixed w-52 h-16 rounded-full z-[30] bg-white bottom-10 right-10 shadow-md drop-shadow flex justify-center items-center overflow-hidden custom-transition`}
            onClick={() => console.log(doctors)}>
            {/* <i className={`bx bx-chevron-left text-xl p-5 absolute custom-transition cursor-pointer`} onClick={() => setFilterOpen(true)}></i> */}
            {/* <i className={`bx bx-x text-xl hover:bg-gray-300 rounded-full absolute right-1 custom-transition cursor-pointer`}
              onClick={() => {
                setFilterOpen(false)
                setSelectedProvider("")
                listDoctors()
              }}></i> */}
            <select name="doctorFilter" value={selectedProvider} id="" className={` default-select-icon outline-none rounded-full cursor-pointer custom-transition overflow-hidden`}
              onChange={event => {
                if (event.target.value) {
                  listDoctorAppointments(event.target.value)
                  setDoctors([backDoctors[event.target.selectedIndex - 0]])
                } else {
                  listDoctors()
                  listAppointments(topbarDate)
                }
                setSelectedProvider(event.target.value)
                // setFilterOpen(false)
              }}
            >
              {backDoctors.map((provider, providerIndex) =>
                <option key={providerIndex} value={provider.name}>{provider.practitioner_name}</option>
              )}
              <option value={""}>Select Provider</option>
            </select>
          </div>
      }

      {/* <<<<<<<<<<----------Add Appointment---------->>>>>>>>>> */}

      <div className={`${addAppointmentOpen ? "bg-black" : "pointer-events-none"} bg-opacity-5 inset-0 z-[200] fixed w-full fade_in`}>
        {addAppointmentOpen && <div className='w-full h-full' onClick={closeAddAppointment}></div>}
        <div className={`${addAppointmentOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"} z-50 custom-transition flex flex-col box-border bg-white h-[calc(100vh-70px)] w-[337px] absolute right-0 top-[70px] text-xs overflow-auto`}> {/* The class custom-transition is in index.css file */}
          <h1 className='font-bold text-lg pl-7 h-6 mt-7'>Add an appointment</h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap box-border items-center">
              {inputs.map((data, index) => {
                return (
                  <div key={index} className='px-7 mt-4 w-full'>
                    <p className='text-[#8A8A8A] leading-6 '>{data.head}</p>
                    <div className="min-w-[280px] h-[40px] border border-solid border-[#DFDFDF] rounded-md font-medium flex items-center relative text-[#373434] gap-[2vw]">
                      {data.types.map((obj, index) => {
                        return (
                          obj.type === "select" ?
                            data.name === "appointment_type" ?
                              <select name={data.name} value={form[data.name]} key={index} onChange={handleChange} onFocus={handleChange} className='flex gap-[1vw] items-center w-full h-full rounded-md px-5 focus:outline-none focus:ring-2 focus:ring-blue-400' required={data.required} autoFocus >
                                <option value="" disabled hidden className=' transition-all w-full px-[20px] h-full min-w-[26px]'></option>
                                {
                                  appointmentTypes.map((optionData, index) => {
                                    return (
                                      <option key={index} value={optionData.name} className='rounded-md transition-all w-full px-5 min-w-[26px]'>{optionData.name}</option>
                                    )
                                  })
                                }
                              </select> :
                              data.name === "patient" ?
                                // <AsyncSelect key={index} defaultOptions={[{ label: "Recent Doctors", isDisabled: true, }, ...patients.map((optionData) => ({ label: optionData.patient_name, value: optionData.name }))]}
                                //   loadOptions={(string, callback) => {
                                //     listPatients(string).then((result) => {
                                //       console.log(result);
                                //       callback(result.map((optionData) => ({ label: optionData.patient_name, value: optionData.name })))
                                //     })
                                //   }}
                                //   onChange={(selected) => setForm((prev) => ({ ...prev, [data.name]: selected.value, patient_name: selected.label }))}
                                //   className="w-full h-full"
                                //   classNamePrefix="select"
                                //   name={data.name}
                                //   value={{ value: form[data.name], label: form.patient_name }}
                                //   isDisabled={loading}
                                // />
                                ""
                                : data.name === "practitioner" ?
                                  <AsyncSelect key={index} defaultOptions={[{ label: "Recent Doctors", isDisabled: true, }, ...doctors.map((optionData) => ({ label: optionData.practitioner_name, value: optionData.name }))]}
                                    loadOptions={(string, callback) => {
                                      listDoctors(string, "", 100, "", false).then((result) => {
                                        // console.log(result);
                                        callback(result.map((optionData) => ({ label: optionData.practitioner_name, value: optionData.id })))
                                      })
                                    }}
                                    onChange={(selected) => setForm((prev) => ({ ...prev, [data.name]: selected.value, doctor_name: selected.label }))}
                                    className="w-full h-full"
                                    classNamePrefix="select"
                                    name={data.name}
                                    value={{ value: form[data.name], label: form.doctor_name }}
                                    isDisabled={loading}
                                  />
                                  : <select
                                    name={data.name}
                                    value={form[data.name]}
                                    key={index}
                                    onChange={handleChange}
                                    onFocus={handleChange}
                                    className='flex gap-[1vw] items-center w-full h-full rounded-md px-5 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                    autoFocus
                                    required={data.required}
                                    disabled={loading}
                                  >
                                    <option value="" disabled hidden className=' transition-all w-full px-[20px] h-full min-w-[26px]'></option>
                                    {data.options.map((optionData, index) => {
                                      return (
                                        <option key={index} value={optionData} className='rounded-md transition-all w-full px-5 min-w-[26px]'>{optionData}</option>
                                      )
                                    })}
                                  </select> :
                            <div key={index} className='flex gap-[1vw] items-center h-full rounded-md  w-full '>
                              <input
                                type={obj.type}
                                name={data.name}
                                // min={obj.type === "datetime-local" ? moment().format("YYYY-MM-DDTHH:mm") : obj.type === "time" ? moment(form.appointment_date).add(30, "minutes").format("HH:mm") : ""}
                                min={obj.type === "datetime-local" ? "" : obj.type === "time" ? moment(form.appointment_date).add(30, "minutes").format("HH:mm") : ""}
                                className={obj.type != "radio" && obj.type != "checkbox" ? 'outline-none w-full h-full px-[20px] rounded-md min-w-[18px]' : "ml-[20px] outline-none h-[18px] w-[18px]"}
                                onChange={handleChange}
                                onClick={(event) => { (obj.type === "datetime-local" || obj.type === "time") && event.target.showPicker() }}
                                checked={obj.type === "radio" && obj.text.toUpperCase() === form[data.name]}
                                value={obj.type === "radio" ? obj.text.toUpperCase() : obj.type === "datetime-local" ? `${moment(form[data.name]).format("YYYY-MM-DD")}${"T"}${moment(form.appointment_time).format("HH:mm")}` : form[data.name]}
                                // value={obj.type === "radio" ? obj.text.toUpperCase() : obj.type === "date" ? moment(form[data.name]).format("YYYY-MM-DD") : form[data.name]}
                                required={data.required}
                                disabled={loading}
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
            <div className='my-6 flex justify-center gap-[10px]'>
              <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#4285F4] w-[114px] h-[41px] text-white rounded-[5px] font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin' /> : "Save"}</button>
              <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#F3F3F3] w-[114px] h-[41px] text-[#373434] rounded-[5px] font-medium`} onClick={closeAddAppointment} >Discard</button>
            </div>
            <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} absolute right-4 top-7`} onClick={closeAddAppointment} ><i className='bx bx-x text-2xl leading-7' /></button>
          </form >
        </div >
      </div >
    </div >
  )
}

export default Home
