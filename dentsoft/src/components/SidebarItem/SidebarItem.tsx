import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";

const SidebarItem = ({ navigation, selected, icon, name }) => {
  const { sidebarCollapse } = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => { }, [])
  return (

    <div className={`fade_in overflow-hidden custom-transition`} onClick={() => {
      navigate(navigation)
    }
    }>
      <li
        id="home-link"
        className={`group grid grid-cols-12 px-7 py-3.5 ${selected ? "bg-[#446dff26] bg[#e6ebff] drop-shadow " : `hover:bg-[#446dff12] bg[#bdbdbd34] active:pr-1 ${!sidebarCollapse && "hover:pl-8"}`}  items-center cursor-pointer custom-transition`}
        title={sidebarCollapse ? name : ""}
      >
        <i
          className={`${icon} col-start-1 ${selected ? "text-[#4285F4]" : "text-[#909090] textwhite"} transition col-end-3 text-[18px] font-light`}
        ></i>
        <p
          className={
            (sidebarCollapse ? "opacity-0 w-0" : "") +
            " col-start-3 col-end-13 text-left whitespace-nowrap" +
            (selected
              ? " text-[#4285F4]"
              : " text-[#616161] textwhite") +
            " transition font-normal text-[14px] ml-[5px]"
          }
        >
          {name}
        </p>
      </li>
    </div>

  );
};

export default SidebarItem;
