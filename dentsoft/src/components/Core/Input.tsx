import moment from 'moment'
import React from 'react'

type InputProps = {
    obj: {
        type: string
        text: string
    }
    data: {
        name: string
        required?: boolean
        pattern?: string
        title?: string
    }
    inputForm: Record<string, any>
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    loading?: boolean
    index?: number
}

const Input: React.FC<InputProps> = ({
    obj,
    data,
    inputForm,
    handleChange,
    loading = false,
    index = 0,
}) => {
    return (
        <div key={index} className='flex gap-[1vw] items-center rounded-md w-full h-full'>
            <input
                type={obj.type}
                name={data.name}
                className={`${(obj.type === "radio" || obj.type === "checkbox") ? "h-5 ml-5 w-5" : "focus:outline-none rounded-md transition-all w-full px-5 h-full min-w-[26px]"} ${data.name === "name" && "camelCase"}`}
                onChange={handleChange}
                onFocus={(event) => { obj.type === "date" && event.target.showPicker() }}
                value={
                    obj.type === "radio"
                        ? obj.text
                        : obj.type === "checkbox"
                            ? obj.text?.toLowerCase()
                            : data.name === "ID"
                                ? inputForm.patient_no || "* * * *"
                                : obj.type === "date"
                                    ? moment(inputForm[data.name]).format("YYYY-MM-DD") === "Invalid date"
                                        ? ""
                                        : moment(inputForm[data.name]).format("YYYY-MM-DD")
                                    : inputForm[data.name]
                }
                checked={
                    obj.type === "radio"
                        ? inputForm[data.name] === obj.text
                        : obj.type === "checkbox"
                            ? inputForm[data.name] && inputForm[data.name][obj.text?.toLowerCase()]
                            : undefined
                }
                required={obj.type !== "checkbox" ? data.required : false}
                disabled={data.name === "ID" || loading}
                pattern={data.pattern}
                title={data.title}
            />
            {obj.text && <span className='text-sm font-medium'>{obj.text}</span>}
        </div>
    )
}

export default Input
