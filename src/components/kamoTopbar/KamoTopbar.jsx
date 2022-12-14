import React, {useState} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";
import { KamoSideBar } from '../../components';

import logo from "../../assets/img/color-logo.png";
import mobilelogo from "../../assets/img/mobile-color-logo.png";

import profileImg from "../../assets/img/profile_img.png";
import { NavLink, useHistory } from "react-router-dom";

const Topbar = (props)  => {
  const [switchLeftSide, setSwitchLeftSide] = useState("");
  const [switchToggle, setswitchToggle] = useState("");
  const role = localStorage.getItem("role");

  const toggleSwitch = ()=>{
    setSwitchLeftSide (switchLeftSide === "" ? "bodyleftHide" : "");
    setswitchToggle (switchToggle === "" ? "togglebtn_hide" : "");
  }
  const history = useHistory();

  const logoutFunc=()=>{
    localStorage.clear();
    history.push('/')
  }

  return (
    <>
      <header className="main_header">
        <div className="header_left">
          <button className={`togglebtn ${switchToggle}`} onClick={toggleSwitch} type="button">
            <i className="fal fa-bars"></i>
          </button>
          <NavLink exact to={"/admin"}>
            <div className="logo">
              <img className="desktoplogo" src={logo} alt="" />
              <img className="mobilelogo" src={mobilelogo} alt="" />
              {/* <img src={logo} alt="" /> */}
            </div>
          </NavLink>
        </div>
        <div className="acount_lastseen">
          <div className="myacount">
            <Dropdown>
              <Dropdown.Toggle className="myacount_btn shadow-0 p-0" id="acount_dropdown">
                <img src={profileImg} alt="" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
              {role && role!="Admin" &&
                <Link to="/myaccount" className="dropdown-item">My Account</Link>
  }
                <Link onClick={logoutFunc} className="dropdown-item">Logout</Link>
               
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </header>
      <KamoSideBar className={`bodyleft ${switchLeftSide}`} />
    </>
  )
}

export default Topbar