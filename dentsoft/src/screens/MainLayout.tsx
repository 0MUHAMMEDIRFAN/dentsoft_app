import { Layout, Menu, theme } from "antd";
import { useState, useContext, useEffect } from "react";
// import { AppContext } from "../Contexts/AppContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Topbar from "../components/Topbar/Topbar";
// import Sidebar from "../Components/Sidebar/Sidebar";
import NoAccess from "../Components/NoAccess/NoAccess";
import moment from "moment";

const { Header, Content, Footer, Sider } = Layout;
const MainLayout = () => {
  // const { sidebarCollapse, setSidebarCollapse, selectedPatient, deselectPatient, handleEditPatient, addPatientForm } = useContext(AppContext) || {};
  const { sidebarCollapse, setSidebarCollapse, selectedPatient, deselectPatient, handleEditPatient, addPatientForm } = {};
  const navigate = useNavigate()
  const tabs = [{ name: "Overview", value: "/patient/overview" }, { name: "Documents", value: "/patient/documents" }, { name: "Appointments", value: "/patient/appointments" }, { name: "Med History", value: "/patient/medicalhistory" }, { name: "Payments", value: "/patient/payments" }]
  const location = useLocation()
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const layoutElement = document.getElementById("layoutContainer")
  const [scrolled, setscrolled] = useState(document.documentElement.scrollTop)
  return (
    <>
      <Topbar />
      <Layout
        style={{ height: "calc(100vh - 70px)", marginTop: "70px" }}
        hasSider
      >
        <Sider
          theme="light"
          collapsible
          collapsed={sidebarCollapse}
          trigger={null}
          style={{ background: "white", color: "black", overflow: "", position: "fixed", height: "calc(100vh - 70px)", zIndex: 200, }}
          // style={{ background: "linear-gradient(to bottom,#4285F4,#2027FB)", color: "black", overflow: "", position: "fixed", height: "calc(100vh - 70px)", zIndex: 200, }}
          // className="border-r border-r-[#EAECF0]"
          className="border-r border-r-[#cdcdcd] custom-transition overflow-y-auto overflow-x-hidden hide-scrollbar"
        >
          {/* <Sidebar /> */}
        </Sider>

        {/* this layout for main contents , / body contents after sidebar */}

        <Layout
          className={`site-layout custom-transition overflow-scroll  ${!sidebarCollapse ? "ml-[200px]" : "ml-[80px]"}`} id="layoutContainer"
          onScroll={() => setscrolled(layoutElement.scrollTop)}
        >
          {selectedPatient &&
            <div className={`${scrolled > 120 && "shadow-md"} border-b px-5 pt-4 sticky -top-[110px] z-50 bg-white`} onClick={() => ""}>
              <div className={`flex gap-5 drop-shadow-sm bg-white border border-[#EBEDF0] h-20 rounded-[20px] p-[5px] mb-2 ${location.pathname === "/patient/overview" && "max-xl:mr-14"} custom-transition`}>
                <div className='grid place-items-center text-[50px] rounded-2xl bg-[#EBEDF0]'>
                  <i className="fa-solid fa-user w-[70px] text-center"></i>
                </div>
                <div className='flex flex-col gap-[5px] pt-1'>
                  <div className='flex items-center gap-2.5' onClick={() => console.log(selectedPatient)}>
                    <p className='font-medium text-xl'>{selectedPatient.patient_name}</p>
                    <p className='font-medium text-base'>({selectedPatient.name})</p>
                    <p className='text-xs text-[#444648]'>{selectedPatient.dob ? moment(selectedPatient.dob).fromNow().replace("ago", "old") : selectedPatient.patient_age}</p>
                  </div>
                  <p className='text-xs text-[#444648]'>{selectedPatient.phone || selectedPatient.mobile}</p>
                </div>
                <div className='flex gap-2 items-center ml-auto mr-3'>
                  <i className="fa-solid fa-pen-to-square text-xl" onClick={() => { handleEditPatient(selectedPatient) }}></i>
                  <i className="fa-solid fa-circle-xmark  text-xl text-[#444648] p-2 cursor-pointer" onClick={() => { deselectPatient(); navigate("/") }}></i>
                </div>
              </div>
              {location.pathname.startsWith("/patient") &&
                <div className='font-medium pt-3 pl-2 sticky top-0 bg-white'>
                  {/* <<<<<<<------Tabs------>>>>>>> */}
                  <ul className='flex w-full gap-10 text-lg items-center h-full text-[#616161]' >
                    {tabs.map((tab, index) =>
                      <li key={index} className={`${location.pathname === tab.value && "border-b-[#446DFF] border-b-black border-b-[2px] text-[#446DFF] text-black "} px-2 h-full flex justify-center items-center custom-transition`} name={tab.name} onClick={() => navigate(tab.value)}>{tab.name}</li>
                    )
                    }
                  </ul>
                </div>
              }
            </div>
          }
          <Content>
            {/* <NoAccess /> */}
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default MainLayout