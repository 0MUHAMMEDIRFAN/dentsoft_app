import { useState, useContext, useEffect } from "react";
import SidebarItem from "../SidebarItem/SidebarItem";
import { AppContext } from "../../contexts/AppContext";
import { getFile } from "../../Api/CommonApi";
import { ApiContext } from "../../contexts/ApiContext";

const Sidebar = () => {
  const { location, sidebarCollapse, sidebarItems, setSidebarItems, filterSidebarItems, selectedPatient, selectSidebarItem, userDetails } = useContext(AppContext);
  const { profilePicture, setProfilePicture, profilePictureLoading, setProfilePictureLoading, loadProfilePicture } = useContext(ApiContext);
  useEffect(() => {
    // setSidebarItems(filterSidebarItems());
    // selectSidebarItem();
    // console.log(userDetails)
  }, [location])
  return (
    <div className={`w-auto bg- ${sidebarCollapse ? "" : "pt-52"} custom-transition relative min-h-full`}>
      <div className="flex flex-col justify-center w-full">
        <div className={`${sidebarCollapse ? "opacity-0 scale-0 left-0 gap-0" : ""} flex flex-col items-center justify-center gap-3 my-5 w-full absolute -z-0 top-0 left-1/2 -translate-x-1/2 custom-transition`}>
          {profilePictureLoading === "Loading" ?
            <div className="rounded-full w-28 h-28 bg-neutral-200 animate-pulse drop-shadow">
            </div> :
            profilePictureLoading === "Error" ?
              <i className='bx bx-refresh text-[40px] leading-[112px] w-28 h-28 text-center text-[#] bg-[#ffff] cursor-pointer drop-shadow rounded-full' onClick={() => loadProfilePicture()} />
              :
              profilePictureLoading === "Missing" ?
                <i className='bx bx-error-circle text-[20px] leading-[112px] w-28 h-28 text-center text-[#ff2c2c]  bg-[#ffff] drop-shadow rounded-full' />
                :
                profilePictureLoading === "Loaded" ?
                  profilePicture ?
                    <img
                      className="w-28 h-28 rounded-full drop-shadow"
                      src={profilePicture}
                      alt="Profile picture"
                      crossOrigin="anonymous"
                    />

                    :
                    <i className='bx bxs-user text-[70px] leading-[112px] w-28 h-28 text-center text-[#a2c4ff]  bg-[#F2F4F9] drop-shadow rounded-full' />
                  : ""
          }
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-[14px] font-semibold text-[#444648 text-[#444648]">
              {userDetails?.name || userDetails}
            </p>
            <p className="text-[14px] font-semibold text-[#B3B6B9 text-[#B3B6B9]">
              {userDetails?.role?.name && `as ${userDetails?.role?.name}`}
            </p>
          </div>
        </div>
        <div className="bg- z-10 pb-1 border-t bg-white overflow-y-auto overflow-x-hidden hide-scrollbar">
          <ul>
            {/* <h1 onClick={() => console.log(profilePicture)}>lfaskdfjlajs</h1>
              <img src={`http://20.244.4.123:5000/file?file_path=${userDetails.profile_photo?.path}`} alt="" />
              <h1 onClick={() => console.log(profilePicture)}>lfaskdfjlajs</h1> */}
            {sidebarItems?.map((data, index) => (
              <SidebarItem
                selected={data.selected}
                name={data.name}
                navigation={data.navigate}
                icon={data.icon}
                key={data.name}
                set={setSidebarItems}
                sett={sidebarItems}
              />
            ))}
          </ul>
        </div>
        {/* <div className="absolute bottom-0 right-0" id="versionInfo">
          version :
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
