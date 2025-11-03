import { useState, useCallback } from 'react'
import QuestionMark from "../../assets/Question-mark.svg"
import { showToastMessage } from '../Core/Toast'
import { getSchemeList, useSchemeOperations } from '../../hooks/useScheme'
import Modal from '../Core/Modal'

function Schemes() {
  const [schemeButton, setSchemeButton] = useState(true)
  const [selectedScheme, setSelectedScheme] = useState<any>({})
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirmBoxOpen, setIsConfirmBoxOpen] = useState(false)
  const [confirmBoxValue, setConfirmBoxValue] = useState("")
  const [confirmBoxError, setConfirmBoxError] = useState("")
  const [form, setForm] = useState({
    payment_term_name: "",
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
    { head: "Discount", types: [{ type: "number" }], name: "discount", required: true },
    { head: "Due Date Based On", types: [{ type: "select" }], options: ["Day(s) after invoice date", "Day(s) after the end of the invoice month", "Month(s) after the end of the invoice month"], name: "due_date_based_on", required: true },
    { head: "Validity", types: [{ type: "number" }], name: "discount_validity", required: true },
    { head: "Status", types: [{ type: "select" }], options: ["active", "inactive"], name: "custom_disabled", required: true },
  ]
  const pulseRows = new Array(10).fill(undefined)

  const { data: schemes, isLoading: schemesLoading, error: schemesError, mutate } = getSchemeList(searchScheme, currentTab === "Active Schemes");
  const { addScheme, editScheme, removeScheme, loading } = useSchemeOperations()

  const handleTabChange = useCallback((tab: string) => {
    setCurrentTab(tab)
  }, [])

  const handleSearch = useCallback((value: string) => {
    setSearchScheme(value)
  }, [])

  const handleSchemeSubmit = async () => {
    const isLoading = schemeButton ? loading.create : loading.update

    if (!isLoading) {
      try {
        if (schemeButton) {
          await addScheme(form)
          showToastMessage({
            type: "success",
            title: "Scheme Added Successfully"
          })
        } else {
          await editScheme(selectedScheme.name, form)
          showToastMessage({
            type: "success",
            title: "Scheme Updated Successfully"
          })
        }
        closeModal()
      } catch (error) {
        console.error(error)
        showToastMessage({
          type: "error",
          title: (error as Error).message || `Failed to ${schemeButton ? 'add' : 'update'} scheme`
        })
      }
    }
  }

  const handleRemoveScheme = async (id: string) => {
    try {
      await removeScheme(id)
      showToastMessage({
        type: "success",
        title: "Scheme Deleted Successfully"
      })
      closeModal()
    } catch (error) {
      console.error(error)
      showToastMessage({
        type: "error",
        title: (error as Error).message || "Failed to delete scheme"
      })
    }
  }

  const handleSchemeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target
    
    if (type === "number") {
      setForm((prev) => ({ 
        ...prev, 
        [name]: value === "" ? value : Number(value)
      }))
    } else {
      setForm((prev) => ({ 
        ...prev, 
        [name]: value
      }))
    }
  }

  function closeModal() {
    const isLoading = loading.create || loading.update || loading.delete
    
    if (!isLoading) {
      setIsConfirmBoxOpen(false)
      setConfirmBoxValue("")
      setConfirmBoxError("")
      setIsOpen(false)
      setSelectedScheme({})
      setForm({
        payment_term_name: "",
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

  const handleEditClick = (data: any) => {
    setSchemeButton(false)
    setForm({
      payment_term_name: data.payment_term_name,
      discount_validity: data.discount_validity,
      due_date_based_on: data.due_date_based_on,
      custom_disabled: data.custom_disabled,
      discount: data.discount,
    })
    openSchemeModal()
    setSelectedScheme({ name: data.name, payment_term_name: data.payment_term_name })
  }

  const handleDeleteClick = (data: any) => {
    setIsConfirmBoxOpen(true)
    setSelectedScheme({ name: data.name, payment_term_name: data.payment_term_name })
  }

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
            <button 
              key={index} 
              className={`${currentTab === tab ? "bg-[#5DB370] text-white" : "hover:bg-[#5db37033]"} rounded-md border-[#5DB370] border-[.5px] border-solid h-10 px-4 font-semibold custom-transition`} 
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          )}
        </div>
        <div className='flex gap-3'>
          <div className='flex border border-solid bg-white border-[#EBEDF0] rounded-[20px] h-10 items-center px-4 gap-2 '>
            <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
            <input 
              type="search" 
              placeholder='Search' 
              className='outline-none w-full bg-transparent' 
              value={searchScheme} 
              onChange={(event) => handleSearch(event.target.value)} 
            />
          </div>
          <button 
            onClick={() => { 
              openSchemeModal(); 
              setSchemeButton(true) 
            }} 
            className='bg-[#4285F4] rounded-[20px] h-9 px-4 font-semibold text-white hover:bg-[#2070F5]'
          >
            Add Scheme
          </button>
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
          {!schemesLoading && !schemesError ?
            <tbody className='text-[#444648]'>
              {/* Table body */}
              {schemes?.map((data: any, index: number) => {
                return (
                  <tr key={index} className='box-border h-14'>
                    <td className='pl-9'>{data.payment_term_name}</td>
                    <td>{data.discount}%</td>
                    <td className={!data.custom_disabled ? "text-[#1A9617]" : "text-[#F8254B]"}>{!data.custom_disabled ? "Active" : "Inactive"}</td>
                    <td>{`${data.discount_validity} ${data.discount_validity <= 1 ? "day" : "days"}`}</td>
                    <td>
                      <div className='flex gap-2'>
                        <button 
                          className='border border-solid rounded border-[#A0A3A6] text-[#444648] px-3' 
                          onClick={() => handleEditClick(data)}
                        >
                          Edit
                        </button>
                        <button 
                          className='border border-solid rounded border-[#FF3C5F] text-[#FF3C5F] px-3' 
                          onClick={() => handleDeleteClick(data)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            : <tbody>
              {/* Table Loading pulse */}
              {pulseRows?.map((_, index) =>
                <tr key={index} className="animate-pulse h-14">
                  <td className="pl-9"><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                  <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                  <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                  <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                  <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                </tr>
              )}
            </tbody>
          }
        </table>
        {!schemesLoading && (
          schemesError ?
            <div className='box-border min-h-[60px] bg-white flex justify-center items-center gap-2'>
              {/* Table Error */}
              <p>Error while Loading {currentTab}</p>
              <button 
                className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' 
                onClick={() => mutate()}
              >
                Try Again
              </button>
            </div>
            : schemes?.length ?
              <div className='box-border h-11 bg-white flex gap-5 justify-end items-center pl-9 p-2'>
                {/* Table Bottom */}
                <i 
                  className='bx bx-rotate-right mr-auto cursor-pointer text-lg' 
                  onClick={() => mutate()}
                ></i>
                <p>Total {currentTab}: {schemes?.length}</p>
              </div>
              : <div className='box-border min-h-[60px] bg-white flex justify-center items-center'>
                No {currentTab} Found
              </div>
        )}
      </div>

      {/* <<<<<<<<<<----------Add Scheme Modal---------->>>>>>>>>> */}

      <Modal
        isShow={isOpen}
        setShow={setIsOpen}
        title={schemeButton ? "Add Scheme" : "Update Scheme"}
        loading={loading.create || loading.update}
        onCancel={closeModal}
        submitLabel={schemeButton ? "Add" : "Update"}
        onSubmit={handleSchemeSubmit}
        showButtons={true}
      >
        <div className="flex flex-wrap box-border items-center">
          {inputs?.map((data, index) => {
            return (
              <div key={index} className=' mt-4 w-full'>
                <p className='text-[#8A8A8A] leading-6 '>{data.head}</p>
                <div className="min-w-[280px] h-12 font-medium flex items-center relative text-[#373434] gap-[2vw]">
                  {data.types.map((obj, typeIndex) => {
                    return (
                      obj.type === "select" ?
                        <select
                          name={data.name}
                          defaultValue={form[data.name]}
                          key={typeIndex}
                          onChange={handleSchemeChange}
                          className='flex gap-[1vw] items-center w-full h-full border border-solid border-[#DFDFDF] bg-transparent rounded-md px-5 focus:outline-none focus:ring-2 focus:ring-blue-400'
                          required={data.required}
                          disabled={loading.create || loading.update}
                        >
                          {data.options?.map((optionData, optionIndex) => {
                            return (
                              <option key={optionIndex} value={optionData === "active" ? 0 : 1} className='rounded-md transition-all w-full px-5 h-full min-w-[26px]'>{optionData}</option>
                            )
                          })}
                        </select>
                        :
                        <div key={typeIndex} className='flex gap-[1vw] rounded-md border border-solid border-[#DFDFDF] items-center w-full h-full'>
                          <input
                            type={obj.type}
                            name={data.name}
                            className='outline-none rounded-md border border-solid border-[#DFDFDF] px-5 w-full h-full min-w-[18px]'
                            onChange={handleSchemeChange}
                            value={form[data.name]}
                            required={data.required}
                            disabled={loading.create || loading.update}
                          />
                        </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Modal>

      {/* <<<<<<<<<<----------Scheme deletion Confirm Box---------->>>>>>>>>> */}

      <Modal
        isShow={isConfirmBoxOpen}
        setShow={setIsConfirmBoxOpen}
        loading={loading.delete}
        title="Are you sure want to Delete the Scheme?"
        showButtons={true}
        submitLabel="Confirm"
        cancelLabel="Cancel"
        onCancel={closeModal}
        onSubmit={() => {
          if (selectedScheme.payment_term_name === confirmBoxValue) {
            setConfirmBoxError("")
            handleRemoveScheme(selectedScheme.name)
          } else {
            setConfirmBoxError("Entered text is not matching")
          }
        }}
      >
        <div className="box-border items-center w-full">
          <div className='flex flex-col mt-4 gap-2'>
            <p className='text-[#8A8A8A] leading-6 '>Type <span className='text-black font-semibold'>{selectedScheme.payment_term_name}</span> to Confirm</p>
            <div className='flex items-center w-full h-10 border border-solid border-[#DFDFDF]  rounded-md'>
              <input
                type="text"
                className="outline-none w-full h-full rounded-md px-5"
                onChange={(event) => {
                  setConfirmBoxValue(event.target.value)
                  setConfirmBoxError("")
                }}
                value={confirmBoxValue}
                required
                disabled={loading.delete}
              />
            </div>
            <p className='text-[#D10000] text-xs'>{confirmBoxError}</p>
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default Schemes
