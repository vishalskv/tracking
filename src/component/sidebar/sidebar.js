// Sidebar.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { RxLapTimer } from "react-icons/rx";
import { AiOutlineTeam } from "react-icons/ai";
import { GoProjectRoadmap } from "react-icons/go";
import { SiClockify } from "react-icons/si";
import "./sidebar.css";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const menuItem = [
    {
      path: "/tracking",
      name: "Tracking",
      icon: <RxLapTimer size={20} />,
    },
    {
      path: "/project-list",
      name: "Projects",
      icon: <GoProjectRoadmap size={20} />,
    },
    {
      path: "/clients",
      name: "Clients",
      icon: <AiOutlineTeam size={20} />,
    },
   
  ];
  return (
    <div className="sidebar1">
      <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
        <div className="top_section">
          <div
            style={{ marginLeft: isOpen ? "50px" : "0px", cursor: "pointer" }}
            className="bars"
          >
            {isOpen ? (
              <FaArrowCircleLeft onClick={toggle} size={25} />
            ) : (
              <FaArrowCircleRight onClick={toggle} size={25} />
            )}
          </div>
        </div>
        <div className="text-center mt-3">
          <SiClockify color="blue" size={30} />
          {menuItem.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className="link"
              activeclassName="active mt-2"
            >
              <div className="icon">{item.icon}</div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className="link_text"
              >
                {item.name}
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
