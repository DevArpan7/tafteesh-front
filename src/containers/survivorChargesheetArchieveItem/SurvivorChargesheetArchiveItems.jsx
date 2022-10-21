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
import './survivorChargesheetArchiveItems.css'
import queryString from "query-string";

import {
    getArchiveItem
} from "../../redux/action";
import ChargesheetArchieveDataTableFilter from "./ChargesheetArchieveDataTableFilter";

const SurvivorChargesheetArchiveItems = (props) => {
    let url = props.location.search;
    let getModule = queryString.parse(url, { parseNumbers: true });
    const survivorChargesheetArchiveItem = useSelector((state) => state.survivorArchiveItem);
  
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [editData,setEditData] = useState({})
  const [survivorId, setSurvivorId] = useState("");

  useEffect(() => {
    dispatch(getArchiveItem(getModule.module,userId,getModule.survivor));
  }, [props]);


useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      //console.log(getModule,'getModule')

    }, 1000);
    // initFilters1();
  }, [survivorChargesheetArchiveItem]);
  const onSelectRow = (value) => {
    //console.log(value,"value");
    // setActiveClass(true);
    setEditData(value)
    setSurvivorId(value._id);
  };


  return (
    <>
      <Topbar />
      <main className="main_body">
      <div className="bodyright">
<div className="row justify-content-between mb-4">
  <div className="col-auto">
    <h2 className="page_title">Archive Chargesheet</h2>
  </div>
  
</div>

<div className="white_box_shadow_20 position-relative">
  {/* <div className="vieweditdelete">
    
  </div> */}
  <ChargesheetArchieveDataTableFilter editData={editData} isLoading={isLoading} chargeSheetList={survivorChargesheetArchiveItem && survivorChargesheetArchiveItem.length>0 && survivorChargesheetArchiveItem} onSelectRow={onSelectRow} />
    
</div>
</div>
      </main>
     
    </>
  );
};

export default SurvivorChargesheetArchiveItems;
