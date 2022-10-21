import React from 'react';
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getNotificationList
} from "../../redux/action";

const SidebarMenu = (props) => {
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));
  // //console.log(userAccessData,"userAccessData")
  const notificationList = useSelector((state) => state.notificationList);

  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();


useEffect(()=>{
  dispatch(getNotificationList(userId))
},[userId])

  return (
    <>
      <nav className="sidemenu">
        <ul>
          <li><NavLink exact to="/dashboard"><i className="fal fa-clipboard"></i> Dashboard</NavLink></li>
          {userAccessData &&userAccessData.length > 0 && userAccessData.map((item)=>{
            return(
              item && item.module && item.module.name == "SURVIVOR PROFILE" && item.can_view == true &&
              <li><NavLink activeClassName="active" exact to="/survivors"><i className="fal fa-users"></i> Survivors</NavLink></li>

            )
          })}
          <li><NavLink activeClassName="active" exact to="/my_diary"><i className="fal fa-list-alt"></i>My Diary</NavLink></li>
          <li><NavLink activeClassName="active" exact to="/social-report"><i class="fal fa-file-chart-line"></i>Report</NavLink></li>
          <li><NavLink activeClassName="active" exact to="/notification"><i className="fal fa-bell"></i> Notification <span className='new'>{notificationList && notificationList.unreadCount}</span></NavLink></li>
        </ul>
      </nav>
    </>
  )
}

export default SidebarMenu

   {/* <li><NavLink activeClassName="active" exact to="/traffickers"><i className="fal fa-list-alt"></i>Traffickers List</NavLink></li> */}
          {/* <li><NavLink activeClassName="active" exact to="/survivors"><i className="fal fa-sack-dollar"></i> Victim Compensation </NavLink></li>
          <li><NavLink activeClassName="active" exact to="/survivors"><i className="fal fa-gavel"></i> Procedural Correction </NavLink></li> */}