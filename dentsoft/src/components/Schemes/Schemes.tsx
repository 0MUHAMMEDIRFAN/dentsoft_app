import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import QuestionMark from "../../assets/Question-mark.svg"
// import Close from "../../assets/Close.svg"
import { ToastContext } from '../../contexts/ToastContext'
import { createNewScheme, getSchemes, updateScheme } from '../../Api/SchemeApi'
import moment from 'moment'
import { deleteScheme } from '../../Api/SchemeApi'
import { getSchemeList } from '../../hooks/useScheme'

function Schemes() {
  // const [schemes, setSchemes] = useState([])
  const [schemesMeta, setSchemesMeta] = useState({})
  const [schemeButton, setSchemeButton] = useState(true)
  const [selectedScheme, setselectedScheme] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirmBoxOpen, setIsConfirmBoxOpen] = useState(false)
  const [confirmBoxValue, setConfirmBoxValue] = useState("")
  const [confirmBoxError, setConfirmBoxError] = useState("")
  // const [schemesLoading, setSchemesLoading] = useState("Loaded")
  const [loading, setLoading] = useState(false);
  const { notify } = useContext(ToastContext)
  const [form, setForm] = useState({
    payment_term_name: "",
    // start_date: "",
    // end_date: "",
    discount_validity: "",
    due_date_based_on: "",
    custom_disabled: "",
    discount: "",
  })
  const [currentTab, setCurrentTab] = useState("Active Schemes")
  const [searchScheme, setSearchScheme] = useState("")
  const tabs = ["Active Schemes", "Inactive Schemes"]
  const inputs = [
    { head: "Name", types: [{ type: "text" }], name: "payment_term_name", required: true },
    // { head: "Validity Start Date", types: [{ type: "date" }], name: "start_date", required: true },
    // { head: "Validity End Date", types: [{ type: "date" }], name: "end_date", required: true },
    { head: "Discount", types: [{ type: "number" }], name: "discount", required: true },
    { head: "Due Date Based On", types: [{ type: "select" }], options: ["Day(s) after invoice date", "Day(s) after the end of the invoice month", "Month(s) after the end of the invoice month"], name: "due_date_based_on", required: true },
    { head: "Validity", types: [{ type: "number" }], name: "discount_validity", required: true },
    { head: "Status", types: [{ type: "select" }], options: ["active", "inactive"], name: "custom_disabled", required: true },
  ]
  const pulseRows = new Array(10).fill()

  const { data: schemes, isLoading: schemesLoading, error: schemesError, mutate: refreshSchemes } = getSchemeList(searchScheme, currentTab === "Active Schemes");


  const addSchemes = async () => {
    try {
      const payload = form;
      const result = await createNewScheme(payload);
      listSchemes(searchScheme, schemesMeta?.page, schemesMeta?.size, `${currentTab === "Active Schemes"}`)
      notify("Scheme Added SuccessFully", "success")
      closeModal()
      console.log(result)

    } catch (error) {
      console.log(error)
      notify(error.message, "error")
    }
    setLoading(false)
  }
  const listSchemes = async (search = "", page = 0, size = "", active = "") => {
    setSchemesLoading("Loading")
    setSchemes([])
    try {
      const result = await getSchemes(search, page, size, active);
      // page ? (setSchemes(prev => ([...schemes, ...result.data.data])), setSchemePage(schemePage + 1)) : (setSchemes(result.data.data), setSchemePage(1))
      setSchemes(result.data.data)
      setSchemesMeta(result.data.meta)
      setSchemesLoading("Loaded")
    } catch (error) {
      console.log(error)
      setSchemesLoading("Error")

    }
  }
  const editScheme = async (id) => {
    try {
      const payload = form;
      const result = await updateScheme(payload, id)
      listSchemes(searchScheme, schemesMeta?.page, schemesMeta?.size, `${currentTab === "Active Schemes"}`)
      notify("Scheme Updated SuccessFully", "success")
      closeModal()
    } catch (error) {
      console.log(error)
      notify(error.message, "error")
    }
    setLoading(false)
  }
  const removeScheme = async (id) => {
    setLoading(true)
    try {
      const result = await deleteScheme(id);
      listSchemes(searchScheme, schemesMeta?.page, schemesMeta?.size, `${currentTab === "Active Schemes"}`);
      notify("Scheme Deleted Successfully", "success")
      closeModal();
    } catch (error) {
      console.log(error.message)
      notify(error.message, "error")
    }
    setLoading(false)
  }
  const handleSchemeChange = (event) => {
    const { name, value, type } = event.target
    type === "number" ?
      value === "" ?
        setForm((prev) => ({ ...prev, [name]: value, }))
        : setForm((prev) => ({ ...prev, [name]: Number(value), }))
      :
      type === "date" ?
        setForm((prev) => ({ ...prev, [name]: new Date(value), }))
        :
        setForm((prev) => ({ ...prev, [name]: value, }))
  }
  const handleSchemeSubmit = (event) => {
    event.preventDefault();
    if (!loading) {
      setLoading(true)
      if (schemeButton)
        addSchemes();
      else
        editScheme(selectedScheme.id);
    }
  };
  function closeModal() {
    if (!loading) {
      setIsConfirmBoxOpen(false)
      setConfirmBoxValue("")
      setConfirmBoxError("")
      setIsOpen(false)
      setForm({
        name: "",
        // start_date: "",
        // end_date: "",
        discount_validity: "",
        due_date_based_on: "",
        custom_disabled: "",
        discount: "",
      })
    }
  }
  function openSchemeModal() {
    setIsOpen(true)
  }
  useEffect(() => {
    // listSchemes(searchScheme, schemesMeta?.page, schemesMeta?.size, `${currentTab === "Active Schemes"}`);
  }, [])
  return (
    <div className='bg-[#FAFAFD] text-[#444648] flex flex-col p-7 box-border min-h-full overflow-auto fade_in'>

      {/* <<<<<<<<<<----------Heading---------->>>>>>>>>> */}

      <div>
        <div className='flex gap-2 items-center relative pb-6 head_with_qstn_mark'>
          <h2 className='text-xl font-semibold'>Schemes</h2>
          <img src={QuestionMark} alt="" />
          <p className='absolute w-52 bg-black text-white rounded-md px-2 py-1 text-xs left-36'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut </p>
        </div>
      </div>


      <div className='flex items-center justify-between'>
        {/* The Tabs switching buttons are in below div  */}
        <div className='text-[#5DB370] flex gap-1'>
          {tabs.map((tab, index) =>
            <button key={index} className={`${currentTab === tab ? "bg-[#5DB370] text-white" : "hover:bg-[#5db37033]"} rounded-md border-[#5DB370] border-[.5px] border-solid h-10 px-4 font-semibold custom-transition`} name={tab} onClick={() => { setCurrentTab(tab); listSchemes(searchScheme, "", schemesMeta?.size, `${tab === "Active Schemes"}`); }}>{tab}</button>
          )}
        </div>
        <div className='flex gap-3'>
          <div className='flex border border-solid bg-white border-[#EBEDF0] rounded-[20px] h-10 items-center px-4 gap-2 '>
            <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
            <input type="search" placeholder='Search' className='outline-none w-full bg-transparent' value={searchScheme} onChange={(event) => { listSchemes(event.target.value, schemesMeta?.page, schemesMeta?.size, `${currentTab === "Active Schemes"}`); setSearchScheme(event.target.value) }} />
          </div>
          <button onClick={() => { openSchemeModal(); setSchemeButton(true) }} className='bg-[#4285F4] rounded-[20px] h-9 px-4 font-semibold text-white hover:bg-[#2070F5]'>Add Scheme</button>
        </div>
      </div>

      {/* <<<<<<<<<<----------Table---------->>>>>>>>>> */}

      <div className='overflow-auto mt-6  rounded-md drop-shadow'>
        <table className='w-full table-fixed bg-white'>
          {/* Table Head */}
          <thead className="text-[#8B8B8B]">
            <tr className='h-16 text-[#303030]'>
              <th className='pl-9'>Name</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Validity</th>
              <th>Action</th>
            </tr>
          </thead>
          {!schemesLoading || schemesError ?
            <tbody className='text-[#444648]'>
              {/* Table body */}
              {schemes?.map((data, index) => {
                return (
                  <tr key={index} className='box-border h-14'>
                    <td className='pl-9'>{data.name}</td>
                    <td>{data.discount}</td>
                    <td className={!data.custom_disabled ? "text-[#1A9617]" : "text-[#F8254B]"}>{!data.custom_disabled ? "Active" : "Inactive"}</td>
                    <td>{`${data.discount_validity} ${data.discount_validity <= 1 ? "day" : "days"}`}</td>
                    <td>
                      <div className='flex gap-2'>
                        <button className='border border-solid rounded border-[#A0A3A6] text-[#444648] px-3' onClick={() => {
                          console.log(data)
                          setSchemeButton(false);
                          setForm({
                            payment_term_name: data.payment_term_name,
                            // start_date: data.start_date,
                            // end_date: data.end_date,
                            discount_validity: data.discount_validity,
                            due_date_based_on: data.due_date_based_on,
                            custom_disabled: data.custom_disabled,
                            discount: data.discount,
                          });
                          openSchemeModal();
                          setselectedScheme({ id: data.name })
                        }}>Edit</button>
                        <button className='border border-solid rounded border-[#FF3C5F] text-[#FF3C5F] px-3' onClick={() => { setIsConfirmBoxOpen(true); setselectedScheme({ id: data.name, name: data.name }) }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })
              }
            </tbody>
            : <tbody>
              {/* Table Loading pulse */}
              {pulseRows.map((_, index) =>
                <tr key={index} className="animate-pulse h-14">
                  <td className="pl-9"><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                  <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                  <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                  <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                  <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                </tr>
              )}
              <tr className="animate-pulse h-11">
                <td className='pl-9'><div className='bg-neutral-200 rounded h-4 w-5'></div></td>
                <td></td>
                <td></td>
                <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
              </tr>
            </tbody>
          }
        </table>
        {!schemesLoading && (
          schemesError ?
            <div className='flex flex-col justify-center items-center'>
              {/* Table Error */}
              <p>Error while Loading {currentTab}</p>
              <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listSchemes(searchScheme, schemesMeta?.page, schemesMeta?.size, `${currentTab === "Active Schemes"}`)}>Try Again</button>
            </div>
            : schemes?.length ?
              <div className='box-border h-11 bg-white flex gap-5 justify-end items-center pl-9 p-2'>
                {/* Tabel Bottom */}
                <i className='bx bx-rotate-right mr-auto cursor-pointer text-lg' onClick={() => listSchemes(searchScheme, schemesMeta?.page, schemesMeta?.size, `${currentTab === "Active Schemes"}`)}></i>
                <p>Total {currentTab} :&nbsp; {schemes?.length} / {schemesMeta?.total}</p>
                <p>Page {schemesMeta?.page + 1} of {Math.floor(((schemesMeta?.total - 1) / schemesMeta?.size) + 1)}</p>
                <div className={`${schemesMeta?.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { schemesMeta?.page != 0 && listSchemes(searchScheme, schemesMeta?.page - 1, schemesMeta?.size, `${currentTab === "Active Schemes"}`) }}>
                  &lt;
                </div>
                <div className={`${schemesMeta?.page < Math.floor((schemesMeta?.total - 1) / schemesMeta?.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { schemesMeta?.page < Math.floor((schemesMeta?.total - 1) / schemesMeta?.size) && listSchemes(searchScheme, schemesMeta?.page + 1, schemesMeta?.size, `${currentTab === "Active Schemes"}`) }}>
                  &gt;
                </div>
                <p>size :
                  <select name="" id="" defaultValue={schemesMeta?.size} onChange={(event) => listSchemes(searchScheme, "", event.target.value, `${currentTab === "Active Schemes"}`)} className='default-select-icon'>
                    <option value="5">5 </option>
                    <option value="10">10 </option>
                    <option value="15">15 </option>
                    <option value="20">20 </option>
                    <option value="50">50 </option>
                  </select>
                </p>
              </div>
              : <div className='box-border min-h-[60px] bg-white flex justify-center items-center w-full'>
                No {currentTab} Found
              </div>

        )}
      </div>

      {/* <<<<<<<<<<----------Add Scheme Modal---------->>>>>>>>>> */}

      <>
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
                  enterFrom="opacity-0 translate-x-full scale-75"
                  enterTo="opacity-100 translate-x-0 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-x-0 tanslate-y-0 scale-100 "
                  leaveTo="opacity-0 translate-x-3/4 -translate-y-20 scale-75"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex flex-col">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      <p className='font-semibold text-base'>
                        {schemeButton ? "Add Scheme" : "Update Scheme"}
                      </p>

                    </Dialog.Title>
                    <div className='flex text-sm'>
                      <form onSubmit={handleSchemeSubmit}>
                        <div className="flex flex-wrap box-border items-center">
                          {inputs.map((data, index) => {
                            return (
                              <div key={index} className=' mt-4 w-full'>
                                <p className='text-[#8A8A8A] leading-6 '>{data.head}</p>
                                <div className="min-w-[280px] h-12  font-medium flex items-center relative  text-[#373434] gap-[2vw]">
                                  {data.types.map((obj, index) => {
                                    return (
                                      obj.name === "custom_disabled" ?
                                        <select
                                          name={data.name}
                                          defaultValue={form[data.name]}
                                          key={index}
                                          onChange={handleSchemeChange}
                                          className='flex gap-[1vw] items-center w-full h-full border border-solid border-[#DFDFDF] bg-transparent rounded-md px-5 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                          required={data.required}
                                          disabled={loading}
                                        >
                                          <option value="" disabled hidden className=' transition-all w-full px-5 h-full min-w-[26px]'></option>
                                          {data.options.map((optionData, index) => {
                                            return (
                                              <option key={index} value={optionData === "active" ? 0 : 1} className='rounded-md transition-all w-full px-5 h-full min-w-[26px]'>{optionData}</option>
                                            )
                                          })}
                                        </select> :
                                        obj.type === "select" ?
                                          <select
                                            name={data.name}
                                            defaultValue={form[data.name]}
                                            key={index}
                                            onChange={handleSchemeChange}
                                            className='flex gap-[1vw] items-center w-full h-full border border-solid border-[#DFDFDF] bg-transparent rounded-md px-5 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                            required={data.required}
                                            disabled={loading}
                                          >
                                            <option value="" disabled hidden className=' transition-all w-full px-5 h-full min-w-[26px]'></option>
                                            {data.options.map((optionData, index) => {
                                              return (
                                                <option key={index} value={optionData} className='rounded-md transition-all w-full px-5 h-full min-w-[26px]'>{optionData}</option>
                                              )
                                            })}
                                          </select>
                                          :
                                          <div key={index} className='flex gap-[1vw] rounded-md items-center w-full h-full'>
                                            <input
                                              type={obj.type}
                                              name={data.name}
                                              className={obj.type != "radio" && obj.type != "checkbox" ? 'rounded-md border border-solid border-[#DFDFDF] px-5 outline-none w-full h-full min-w-[18px]' : "outline-none h-4 w-4"}
                                              onFocus={(event) => { obj.type === "date" && event.target.showPicker() }}
                                              onChange={handleSchemeChange} value={obj.type === "date" ? !schemeButton ? moment(form[data.name]).format("YYYY-MM-DD") : this : form[data.name]}
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
                        <div className='mt-6 flex gap-2.5'>
                          <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#4285F4] w-28 h-10 text-white rounded font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Save"}</button>
                          <button type='button' className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded font-medium`} onClick={closeModal} >Discard</button>
                        </div>
                      </form >
                    </div>
                    <button className={`${loading ? "opacity-70 cursor-wait active:scale-100" : ""} absolute right-5 top-6`} onClick={closeModal} ><i className='bx bx-x text-2xl leading-7' /></button>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>

      {/* <<<<<<<<<<----------Schemes deletion Confirm Box---------->>>>>>>>>> */}

      <>
        <Transition appear show={isConfirmBoxOpen} as={Fragment}>
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex flex-col justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      <p className='font-semibold text-base'>
                        Are you sure want to <span className='text-[#D10000]'>Delete </span> the Scheme?
                      </p>

                    </Dialog.Title>
                    <div className='flex text-sm w-full'>
                      <form className='w-full' onSubmit={(event) => {
                        event.preventDefault();
                        if (selectedScheme.name === confirmBoxValue) {
                          setConfirmBoxError("")
                          removeScheme(selectedScheme.id)
                        } else {
                          setConfirmBoxError("Entered text is not matching")
                        }
                      }}>
                        <div className="box-border items-center w-full">
                          <div className='flex flex-col mt-4 gap-2'>
                            <p className='text-[#8A8A8A] leading-6 '>Type <span className='text-black font-semibold'>{selectedScheme.name}</span> to Confirm</p>
                            {/* <div className="min-w-[280px] h-12 font-medium flex items-center relative text-[#373434] gap-[2vw]"> */}
                            <div className='flex items-center w-full h-10 border border-solid border-[#DFDFDF]  rounded-md'>
                              <input
                                type="text"
                                // name={data.name}
                                className="outline-none w-full h-full rounded-md px-5"
                                // onFocus={(event) => { obj.type === "date" && event.target.showPicker() }}
                                onChange={(event) => { setConfirmBoxValue(event.target.value); setConfirmBoxError("") }}
                                value={confirmBoxValue}
                                required
                                disabled={loading}
                              />
                              {/* {obj.text && <span className='font-medium'>{obj.text}</span>} */}
                            </div>
                            <p className='text-[#D10000] text-xs'>{confirmBoxError}</p>
                            {/* </div> */}
                          </div>
                        </div>
                        <div className='mt-4 flex gap-2.5'>
                          <button className={`${loading && "bg-opacity-50 cursor-wait active:scale-100"} bg-[#4285F4] w-28 h-10 text-white rounded font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Confirm"}</button>
                          <button type='button' className={`${loading && "bg-opacity-50 cursor-wait active:scale-100"} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded font-medium`} onClick={closeModal} >Cancel</button>
                        </div>
                      </form >
                    </div>
                    <button className={`${loading && "bg-opacity-50 cursor-wait active:scale-100"} absolute right-5 top-6`} onClick={closeModal} ><i className='bx bx-x text-2xl leading-7' /></button>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    </div >
  )
}


export default Schemes
