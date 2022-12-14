import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { getAllSurvivorList } from "../../redux/action";
import AllSurvivortDataTable from "./AllSurvivorDataTable";

const AllSurvivorList = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const allsurvivorList = useSelector((state) => state.allsurvivorList);
  const [addShgData, setAddShgData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [messagType, setMessagType] = useState("");

  const [checked, setChecked] = React.useState(false);
  const [toggleId, setToggleId] = useState("");
  const handleChange = (event, id) => {
    //console.log(event.target.checked, id, "iiiiiiiiiiii");
    // setChecked(!checked)
    setToggleId(id);
    let body = {
      approval: event.target.checked,
    };
    setIsLoading(true);
    axios
      .patch(api + "/survival-profile/toggle-approval/" + id, body, axiosConfig)
      .then((response) => {
        //console.log(response);
     
        if (response.data && response.data.error === false) {
          const { data } = response;
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success")
          dispatch(getAllSurvivorList());
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
          //   setChecked(false);
          setToggleId("");
          setSelectedData({});
        }else{
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("error")
        }
      })
      .catch((error) => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        //console.log(error, "shg add error");
      });
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSelectRow = (item) => {
    if (item !== null) {
      setSelectedData(item);
      setActiveClass(true);
      setSelectedProduct5(item)
    } else {
      setSelectedData({});
      setActiveClass(false);
      setSelectedProduct5(null)

    }
  };
  useEffect(() => {
    dispatch(getAllSurvivorList());
  }, [props]);

  return (
    <>
      <KamoTopbar />
      <main className="main_body">
        <NotificationPage
          handleClose={handleClose}
          open={open}
          type={messagType}
          message={updateMessage}
        />
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">All Survivor List</h2>
            </div>
          </div>
          <div className="white_box_shadow_20 survivors_table_wrap vieweditdeleteMargin40 position-relative">
            <AllSurvivortDataTable
              allsurvivorList={
                allsurvivorList && allsurvivorList.length > 0 && allsurvivorList
              }
              selectedProduct5={selectedProduct5}
              isLoading={isLoading}
              onSelectRow={onSelectRow}
              checked={checked}
              handleChange={handleChange}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default AllSurvivorList;
