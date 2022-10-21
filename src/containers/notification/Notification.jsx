import React, { useEffect, useState } from "react";
import { Topbar } from "../../components";

import { Link } from "react-router-dom";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBTooltip,
  MDBBtn,
} from "mdb-react-ui-kit";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "./notification.css";
import axios from "axios";

import { getNotificationList } from "../../redux/action";
const Notification = (props) => {
  const changeLogList = useSelector((state) => state.changeLogList);
  const notificationList = useSelector((state) => state.notificationList);

  const [modalNewloanLogShow, setModalNewloanLogShow] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();

  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };


const[disabledRow,setDisabledRow] = useState(false)
  const checkReadfunc = (e,id) => {
    e.preventDefault();
    setDisabledRow(true)
    axios
      .patch(
        api + "/notification/mark-as-read/" + id,
        { mark_as_read: true },
        axiosConfig
      )
      .then((res) => {
        console.log(res, "res");
        if(res.data.error == false){
          
          dispatch(getNotificationList(userId))
          setDisabledRow(false)

        }
      })
      .catch((err) => {
        setDisabledRow(false)
        console.log(err,"err")
      });
  };

  // useEffect(()=>{
  //   dispatch(getNotificationList(userId))
  // },[props])

  return (
    <>
      <Topbar />
      <main className="main_body">
        <div className="bodyright">
          <div className="row justify-content-between mb30">
            <div className="col-auto">
              <h2 className="page_title mb-3 mb-md-0">Notification</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                {/* <MDBBreadcrumbItem active>Survivor Documents</MDBBreadcrumbItem> */}
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="white_box_shadow_20 survivors_table_wrap notificationtable position-relative">
            <div className="table-responsive medium-mobile-responsive">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th width="4%">Created Date</th>
                    <th width="4%">Time</th>
                    <th width="10%">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationList &&
                  notificationList.data &&
                  notificationList.data.length > 0 ? (
                    notificationList.data.map((item) => {
                      return (
                        <tr  onClick={(e)=> checkReadfunc(e,item._id)} className ={ item.mark_as_read === true ? "light_padding" : "dark_padding"}>
                          <td >
                            {item &&
                              item.createdAt &&
                              moment(item.createdAt).format("DD-MMM-YYYY")}
                          </td>
                          <td>
                            {item &&
                              item.createdAt &&
                              moment(item.createdAt).format("hh:mm A")}
                          </td>
                          <td >{item && item.description}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={3}>
                        <b>NO Data Found !!</b>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Notification;
