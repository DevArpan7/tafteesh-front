import React, { useState, useEffect } from "react";
import { Topbar, SurvivorTopCard } from "../../components";
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBTooltip,
  MDBBtn,
} from "mdb-react-ui-kit";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import {
  getSurvivorDetails,
  getNextPlanList,
  getChangeLog,
  getSurvivorList,
  getDiaryStatusList
} from "../../redux/action";
import { InputGroup } from "react-bootstrap";

import moment from "moment";
import NextPlanDataTable from "./NextPlanDataTable";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";
import "./mydairy.css"

const SurvivorsNextPlan = (props) => {
  const [modalRescueShow, setModalRescueShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/survival-diary";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);

  const deletedById = localStorage.getItem("userId");
  const organisationName = localStorage.getItem("organizationName")
  const deletedByRef = localStorage.getItem("role");
  const [validated, setValidated] = useState(false);
  const survivorList = useSelector((state) => state.survivorList);
  const diaryStatusList = useSelector((state) => state.diaryStatusList);

  const [selected, setSelected] = useState([]);
  const [addNextData, setAddNextData] = useState({});
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const nextPlanList = useSelector((state) => state.nextPlanList);
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [messagType, setMessagType] = useState("");

  const [customError, setCustomError] = useState({ name: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [loader,setLoader] = useState(false)
  const[deleteId,setDeleteId] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [nextPlanList]);

  useEffect(() => {
    dispatch(getNextPlanList(deletedById && deletedById));
    dispatch(getSurvivorList(deletedById && deletedById))
    dispatch(getDiaryStatusList());
  }, [props]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const gotToEdit = (id) => {
    getDiaryDetails(id)
    
  };


  //console.log(diaryStatusList,"diaryStatusList")

  const getDiaryDetails = (id) => {
    //console.log(id);
    axios
      .get(api + "/detail/" + id, axiosConfig)
      .then((response) => {
        //console.log(response, "daaaaa");
        if (response.data && response.data.error === false) {
          const { data } = response;
          setAddNextData(data.data);
          setModalRescueShow(true);
    
        }
      })
      .catch((error) => {
        //console.log(error, "user details error");
      });
  };


  const onCancel = () => {
    setModalRescueShow(false);
    setActiveClass(false);
    setAddNextData({})
    setValidated(false);
  };
  const onAddHandle = () => {
    setModalRescueShow(true);
    setActiveClass(false);
    setSelectedData({});
    setAddNextData({});
    setSelectedProduct5(null)
  };

  const changeLogFunc = () => {
    let type = "diary";
    dispatch(getChangeLog(type, deletedById));
    props.history.push("/change-log");
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = (id) => {
   setDeleteId(id)
      setShowAlert(true);
    
  };
  const [deleteLoader, setDeleteLoader] = useState(false);

  const onDeleteFunction = () => {
    let body = {
      deleted_by: deletedById && deletedById,
      deleted_by_ref: "users",
    };
    setDeleteLoader(true)
    axios
        .patch(api + "/delete/" + deleteId, body, axiosConfig)
      .then((response) => {
        setDeleteLoader(false)
        handleClick();
        setMessagType("success")
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({});
          setDeleteId('')
          dispatch(getNextPlanList(deletedById));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        setDeleteLoader(false)
        ////console.log(error, "partner error");
      });
  };

  useEffect(()=>{
    if(addNextData && addNextData.to_do){
      setCustomError({name: "",message: ""})
    }else if(addNextData && addNextData.plan_date){
      setCustomError({name: "",message: ""})
    }else if(addNextData && addNextData.plan_for){
      setCustomError({name: "",message: ""})
    }else if(addNextData && addNextData.select){
      setCustomError({name: "",message: ""})
    }else if(addNextData && addNextData.stakeholder_participants){
      setCustomError({name: "",message: ""})
    }else if(addNextData && addNextData.stakeholdder_type){
      setCustomError({name: "",message: ""})
    }else if(addNextData && addNextData.status){
      setCustomError({name: "",message: ""})
    }else if(addNextData && addNextData.outcome){
      setCustomError({name: "",message: ""})
    }else if(addNextData && addNextData.next_followUp_date){
      setCustomError({name: "",message: ""})
    }else if(addNextData && addNextData.next_followUp_action){
      setCustomError({name: "",message: ""})
    }
    else{
      setCustomError({name: "",message: ""})
    }
  },[addNextData])
  ///// API CAL ADD AND UPDATE NEXT PLAN //////

  const addSurvivorNextPlanFunc = (e) => {
    e.preventDefault();
    let pattern = /[0-9\s]{0,}[a-zA-Z]{2,}/g

    if(addNextData && !addNextData.to_do){
      setCustomError({name: "to_do",message: "Please enter To-Do"})
    }else if(!pattern.test(addNextData.to_do)){
      setCustomError({name: "to_do",message: "Please enter valid To-Do "})
    }
    else if(addNextData && !addNextData.plan_date){
      setCustomError({name: "plan_date",message: "Please select Plan Date"})
    }else if(addNextData && !addNextData.plan_for){
      setCustomError({name: "plan_for",message: "Please enter Plan For"})
    }else if(addNextData && !addNextData.select){
      setCustomError({name: "select",message: "Please select Module"})
    }
    // else if(addNextData && !addNextData.type){
    //   setCustomError({name: "type",message: "Please select Type"})
    // }
    else if(addNextData && !addNextData.stakeholder_participants){
      setCustomError({name: "stakeholder_participants",message: "Please enter Stakeholder/Participants"})
    } else if(!pattern.test(addNextData.stakeholder_participants)){
      setCustomError({name: "stakeholder_participants",message: "Please enter valid Stakeholder/Participants"})
    }
    
    else if(addNextData && !addNextData.stakeholdder_type){
      setCustomError({name: "stakeholdder_type",message: "Please select Stakeholder Type"})
    }else if(addNextData && !addNextData.status){
      setCustomError({name: "status",message: "Please select Status"})
    }else if(addNextData && !addNextData.outcome){
      setCustomError({name: "outcome",message: "Please enter Outcome"})
    }else if(!pattern.test(addNextData.outcome)){
      setCustomError({name: "outcome",message: "Please enter valid Outcome"})
    }

    else if(addNextData && !addNextData.next_followUp_date){
      setCustomError({name: "next_followUp_date",message: "Please select Next FollowUp date"})
    }else if(addNextData && !addNextData.next_followUp_action){
      setCustomError({name: "next_followUp_action",message: "Please enter Next FollowUp Action"})
    }else if(!pattern.test(addNextData.next_followUp_action)){
      setCustomError({name: "next_followUp_action",message: "Please enter valid Next FollowUp Action"})
    }
    else{
      setCustomError({name: "",message: ""})
    const addData = {
      ...addNextData,
      "type": "Own",
      user: deletedById && deletedById,
    };
    const updateData = {
      ...addNextData,
      "type": "Own",
      user: deletedById && deletedById,
    };

    if (addNextData && addNextData._id) {
      setLoader(true)
      axios
        .patch(api + "/update/" + addNextData._id, updateData, axiosConfig)
        .then((res) => {
          //console.log(res);
          handleClick();
          setUpdateMessage(res && res.data.message);
          setMessagType("success")
          setValidated(false);
          setLoader(false)
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            setAddNextData({});
            //console.log(data, res);
            dispatch(getNextPlanList(deletedById && deletedById));
            setSelectedProduct5(null)
            setSelectedData({})
            setActiveClass(false);
            setModalRescueShow(false);

          }
        })
        .catch((error) => {
          setLoader(false)
          //console.log(error);
        });
    } else {
      setLoader(true)
      axios
        .post(api + "/create", addData, axiosConfig)
        .then((res) => {
          //console.log(res);
          handleClick();
          setValidated(false);
          setMessagType("success")
          setUpdateMessage(res && res.data.message);
          setLoader(false)
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            //console.log(data, res);
             
            setAddNextData({});
            dispatch(getNextPlanList(deletedById && deletedById));
         setSelectedProduct5(null)
         setSelectedData({})
            setModalRescueShow(false);
          }
        })
        .catch((error) => {
          setLoader(false)
          //console.log(error);
        });
    }
  }
  };

  /////////////// for csv function ////

  const downloadCsvFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });

    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };
  const formatDate = (value) => {
    ////console.log(value, "value");
    // return value.toLocaleDateString('en-US', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric',
    // });
    return moment(value).format("DD-MMM-YYYY");
  };

  const exportToCsv = (e) => {
    //console.log(e, "e");
    e.preventDefault();

    // Headers for each column
    let headers = [
      "Id,Planned Date,Plan Type,For,Status/Is Closed,To Do,MOde Of Meeting,Next Followup Action,Next Followup Date,Outcome,Reminder,Select,Stakeholdder Type,Stakeholder Participants,Survivor",
    ];

    // Convert users data to a csv
    let usersCsv = nextPlanList.reduce((acc, user) => {
      const {
        _id,
        plan_date,
        type,
        plan_for,
        status,
        to_do,
        mode_of_meeting,
        next_followUp_action,
        next_followUp_date,
        outcome,
        remind_before_day_planed_date,
        select,
        stakeholdder_type,
        stakeholder_participants,
        survivor,
      } = user;
      acc.push(
        [
          _id,
          formatDate(plan_date),
          type,
          plan_for,
          status,
          to_do,
          mode_of_meeting,
          next_followUp_action,
          formatDate(next_followUp_date),
          outcome,
          remind_before_day_planed_date,
          select,
          stakeholdder_type,
          stakeholder_participants,
          survivor,
        ].join(",")
      );
      return acc;
    }, []);

    downloadCsvFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "nextPlanList.csv",
      fileType: "text/csv",
    });
  };

  const planDateChangeHandler = (e) => {
    setAddNextData({
      ...addNextData,
      [e.target.name]: e.target.value,
    });
  };

  const nextFollowDateChangeHandel = (e) => {
    setAddNextData({
      ...addNextData,
      [e.target.name]: e.target.value,
    });
  };
  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("SURVIVOR DETAILS", 22, 10);

    //  // add content
    doc.setFontSize(10);
    doc.text("SURVIVOR NAME:", 22, 20);
    doc.text(survivorDetails?.survivor_name, 60, 20);
    doc.text("SURVIVOR ID", 22, 40);
    doc.text(survivorDetails?.survivor_id, 60, 40);

    doc.setFontSize(20);
    doc.text("SURVIVOR NEXT PLAN LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "MEETING MODE",
      "FOLLOWUP ACTION",
      "FOLLOWUP DATE",
      "OUTCOME",
      "PLANNED DATE",
      "PLAN TYPE",
      "FOR",
      "STATUS",
      "TO DO",
      "REMIND BEFORE",
      "SELECT",
      "STAKE HOLDER TYPE",
      "PARTICIPANTS",
      "CREATED AT",
    ];
    const name = "my_diary-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    debugger;
    nextPlanList?.forEach((item) => {
      const temp = [
        item.mode_of_meeting,
        item.next_followUp_action,
        moment(item.next_followUp_date).format("DD/MM/YYYY"),
        item.outcome,
        moment(item.plan_date).format("DD/MM/YYYY"),
        item.type,
        item.plan_for,
        item.status,
        item.to_do,
        item.remind_before_day_planed_date,
        item.select,
        item.stakeholdder_type,
        item.stakeholder_participants,
        moment(item.createdAt).format("DD/MM/YYYY"),
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
    doc.save(name);
  };
  return (
    <>
      <Topbar />
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
              <h2 className="page_title">Organization Name: <span>{organisationName && organisationName}</span></h2>
            </div>
            {/* <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>My Diary</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div> */}
          </div>
          {/* <div className="topcartbar white_box_shadow">
            <SurvivorTopCard survivorDetails={survivorDetails} />
          </div> */}
          <div className="white_box_shadow vieweditdeleteMargin40 survivors_table_wrap position-relative">
            <div className="vieweditdelete">
              <Dropdown className="me-1">
                <Dropdown.Toggle variant="border" className="shadow-0">
                  Action
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={downloadPdf}>
                    Download PDF
                  </Dropdown.Item>
                  <Dropdown.Item onClick={(e) => exportToCsv(e)}>
                    Export CSV
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => changeLogFunc()}>
                    Change Log
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "add_btn view_btn" }}
                title="Add"
              >
                <span onClick={() => onAddHandle()}>
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              {/* <MDBTooltip
                tag="a"
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <span onClick={() => gotToEdit()}>
                  <i className="fal fa-pencil"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{ className: "delete_btn" }}
                title="Delete"
              >
                <span onClick={() => onDeleteChangeFunc()}>
                  <i className="fal fa-trash-alt"></i>
                </span>
              </MDBTooltip> */}
            </div>
            {/* <div className="table-responsive big-mobile-responsive">
              <NextPlanDataTable
                nextPlanList={nextPlanList}
                onSelectRow={onSelectRow}
                selectedProduct5={selectedProduct5}
                isLoading={isLoading}
              />
              
            </div> */}
          </div>

          <div className="mydairyList">
            {nextPlanList && nextPlanList.length > 0 && nextPlanList.map((item)=>{
              return(

            <div className="mydairyList_item">
              <div className="mydairyList_item_left">
                <div className="mydairyDate">
                  <span className="dairyDate">{item && item.plan_date &&
                   moment(item.plan_date).format("DD")}</span>
                  <span className="dairyMonth">{item && item.plan_date &&
                   moment(item.plan_date).format("MMMM")}</span>
                  <span className="dairyYear">{item && item.plan_date &&
                   moment(item.plan_date).format("YYYY")}</span>
                </div>
              </div>
              <div className="mydairyList_item_right">
                <span className="dairyspan">{item && item.type}</span>
                <h3>To Do - {item && item.to_do ? item.to_do  : "Not defined"} </h3> 
                {/* <li><span>To Do -</span>{item && item.to_do ? item.to_do  : "Not defined"}</li> <br/> */}
                <ul>
                
                  <li><span>Survivor Name -</span>{item && item.survivor ? item.survivor.survivor_name : "Not defined"}</li>
                  <li><span>Gender -</span>{item && item.survivor ? item.survivor.gender : "Not defined" }</li>
                </ul>
                <div className="mydairyAddress">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                 State : {item && item.survivor ? item.survivor.state && item.survivor.state.name:"Not defined"}, Village : {item && item.survivor ? item.survivor.village_name :"Not defined"},  P.S-{item && item.survivor ? item.survivor.police_station && item.survivor.police_station.name: "Not defined"}<br/> Dist : {item && item.survivor ? item.survivor.district && item.survivor.district.name:"Not defined"}, Block : {item && item.survivor ? item.survivor.block && item.survivor.block.name:"Not defined"}
                </div>
                <div className="mydairy_btns">
                  <MDBTooltip
                    tag="a"
                    wrapperProps={{ className: "edit_btn" }}
                    title="Edit"
                  >
                    <span onClick={()=> gotToEdit(item._id)}>
                      <i className="fal fa-pencil"></i>
                    </span>
                  </MDBTooltip>
                  <MDBTooltip
                    tag="a"
                    wrapperProps={{ className: "delete_btn" }}
                    title="Delete"
                  >
                    <span onClick={()=> onDeleteChangeFunc(item._id)}>
                      <i className="fal fa-trash-alt"></i>
                    </span>
                  </MDBTooltip>
                </div>
              </div>
            </div>
            )})}
            
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalRescueShow}
        onHide={setModalRescueShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {addNextData && addNextData._id ? "Update" : "Add"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form 
            // noValidate validated={validated} onSubmit={handleSubmit}
            >
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    To do <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    
                    name="to_do"
                    type="text"
                    defaultValue={
                      addNextData && addNextData.to_do && addNextData.to_do
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z 0-9 _ \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                 {customError.name == "to_do" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Survivor <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    
                    name="survivor"
                    value={
                      addNextData &&
                      addNextData.survivor &&
                      addNextData.survivor._id
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {survivorList && survivorList.length > 0 && survivorList.map((item)=>{
                       return(
                        <option value={item && item._id}>{item && item.survivor_name}</option>
                       )
                    })}
                  
                    
                  </Form.Select>
                  {customError.name == "plan_for" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Plan date <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <DatePicker 
                    required
                    message={"Please Select Plan date"}
                    data={addNextData &&
                      addNextData.plan_date}
                    name="plan_date"
                    datePickerChange={planDateChangeHandler}
                  /> */}
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={addNextData  && addNextData.plan_date ? moment(addNextData.plan_date).format("DD-MMM-YYYY") :null}
                        
                      />
                    {customError.name == "plan_date" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                      <InputGroup.Text>
                        <Form.Control
                          name={"plan_date"}
                          // value={data && moment(data).format("YYYY-MM-DD")}
                          className="dateBtn"
                          type="date"
                          required
                          onChange={planDateChangeHandler}
                          placeholder=""
                          // max={moment().format("YYYY-MM-DD")}
                          min={ moment(new Date()).format("YYYY-MM-DD")}
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Plan for <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    
                    name="plan_for"
                    value={
                      addNextData &&
                      addNextData.plan_for &&
                      addNextData.plan_for
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="Social Worker">Social Worker</option>
                    <option value="Lawyer">Lawyer</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                  {customError.name == "plan_for" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                {/* <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Plan Type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="type"
                    
                    value={addNextData && addNextData.type && addNextData.type}
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="System">System</option>
                    <option value="Own">Own</option>
                   
                  </Form.Select>
                  {customError.name == "type" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group> */}
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Select <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="select"
                    
                    value={
                      addNextData && addNextData.select && addNextData.select
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="PC">PC</option>
                    <option value="VC">VC</option>
                    <option value="Rehab">Rehab</option>
                    <option value="AdvocacyTraining">Advocacy Training</option>
                    <option value="FIR">FIR</option>
                    <option value="ChargeSheet">ChargeSheet</option>
                    <option value="Investigation">Investigation</option>
                  </Form.Select>
                  {customError.name == "select" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Remind before (N) days of planned date
                  </Form.Label>
                  <Form.Control
                    defaultValue={
                      addNextData &&
                      addNextData.remind_before_day_planed_date &&
                      addNextData.remind_before_day_planed_date
                    }
                    name="remind_before_day_planed_date"
                    type="text"
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Mode of meeting</Form.Label>
                  <Form.Select
                    name="mode_of_meeting"
                    value={
                      addNextData &&
                      addNextData.mode_of_meeting &&
                      addNextData.mode_of_meeting
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Default select</option>
                    <option value="Personal Visit">Personal Visit</option>
                    <option value="Online">Online</option>
                    <option value="Phone call">Phone call</option>
                  </Form.Select>
                </Form.Group>
                {/* <Form.Group as={Col} md="6" className="mb-3">
                                    <Form.Label>Survivor</Form.Label>
                                    <MultiSelect
                                        name="survivor"
                                        options={options}
                                        value={selected}
                                        hasSelectAll={false}
                                        disableSearch={true}
                                        onChange={setSelected}
                                        labelledBy={"Select"}
                                        className={"accusedMultiselect-box multiselectbox_span"}
                                        overrideStrings={{
                                            selectSomeItems: "Select columns to view",
                                            allItemsAreSelected: "All Items are Selected",
                                            selectAll: "Select All",
                                            search: "Search",
                                        }}
                                    />
                                </Form.Group> */}

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Stakeholder Type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="stakeholdder_type"
                    
                    value={
                      addNextData &&
                      addNextData.stakeholdder_type &&
                      addNextData.stakeholdder_type
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="KAMO">KAMO</option>
                    <option value="Other NGO">Other NGO</option>
                    <option value="Other Tafteesh partner">
                      Other Tafteesh Partner
                    </option>
                    <option value="Survivor">Survivor</option>
                    <option value="Survivor family">Survivor Family</option>
                    <option value="Duty Bearer">Duty Bearer</option>
                  </Form.Select>
                  {customError.name == "stakeholdder_type" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Stakeholders/Participants{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>

                  <Form.Control
                    type="text"
                    
                    defaultValue={
                      addNextData &&
                      addNextData.stakeholder_participants &&
                      addNextData.stakeholder_participants
                    }
                    name="stakeholder_participants"
                    placeholder="Enter the Reason"
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z 0-9 _ \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                  {customError.name == "stakeholder_participants" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                  {/* <Form.Select>
                                        <option hidden={true}>Default select</option>
                                        <option>Rank Officer</option>
                                        <option>Duty Bearer</option>
                                    </Form.Select> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Status <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="status"
                    
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addNextData && addNextData.status && addNextData.status
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {diaryStatusList && diaryStatusList.length >0 && diaryStatusList.map((item)=>{
                      return(
                        <option value={item && item.name}>{item && item.name}</option>
                      )
                    })}
                   
                  </Form.Select>
                  {customError.name == "status" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    Outcome <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="4"
                    
                    defaultValue={
                      addNextData && addNextData.outcome && addNextData.outcome
                    }
                    name="outcome"
                    placeholder="Enter the Reason"
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z 0-9 _ \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                  {customError.name == "outcome" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Next Followup date <span className="requiredStar">*</span>
                  </Form.Label>
                  
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                     disabled={addNextData && addNextData.status =="Completed" ? true : false}
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={addNextData  && addNextData.next_followUp_date ? moment(addNextData.next_followUp_date).format("DD-MMM-YYYY") :null}
                        
                      />
                     {customError.name == "next_followUp_date" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                      <InputGroup.Text>
                        <Form.Control
                          name={"next_followUp_date"}
                          className="dateBtn"
                          type="date"
                          disabled={addNextData && addNextData.status =="Completed" ? true : false}
                          onChange={nextFollowDateChangeHandel}
                          placeholder=""
                          min={moment().format("YYYY-MM-DD")}
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Next Followup Action <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    
                    defaultValue={
                      addNextData &&
                      addNextData.next_followUp_action &&
                      addNextData.next_followUp_action
                    }
                    name="next_followUp_action"
                    type="text"
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z 0-9 _ \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                   {customError.name == "next_followUp_action" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} xs="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => onCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                  disabled={loader == true? true : false}
                    onClick={addSurvivorNextPlanFunc}
                    className="submit_btn shadow-0"
                  >
                      {loader && loader === true ? (
                      <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Form.Group>
              </Row>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      {showAlert === true && (
        <AlertComponent
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
          deleteLoader={deleteLoader}
        />
      )}
    </>
  );
};

export default SurvivorsNextPlan;
