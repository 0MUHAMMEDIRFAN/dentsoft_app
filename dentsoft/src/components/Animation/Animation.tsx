import React, { useContext } from 'react'
import "./Animation.css"
import Loading from "../../assets/LoadingAnimation.svg"
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../contexts/AppContext'


function Animation() {
    // const navigate = useNavigate()
    const { sidebarCollapse } = useContext(AppContext)
    return (
        <div className={`${sidebarCollapse ? "w-[calc(100%-80px)]" : "w-[calc(100%-200px)]"} fixed top-[70px] right-0 flex flex-col items-center justify-center h-[calc(100%-70px)] bg-white bg-opacity-75 z-40 custom-transition`}>
            <div className="flex flex-col items-center justify-center w-[104px] h-[104px] bg-white rounded-full relative z-50 box-border overflow-hidden ">
                <div className="flex items-center justify-center bg-white w-[95px] h-[95px] rounded-full ">
                    <img src={Loading} alt="" />
                </div>
                <div className="box animate-spin z-[-1] absolute w-[104px] h-[104px] rounded-full "></div>
            </div>
        </div>
    )
}

export default Animation
