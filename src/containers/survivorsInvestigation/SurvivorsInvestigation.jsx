import React, { useState, useEffect } from "react";
import { Topbar, SurvivorTopCard } from "../../components";

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
import moment from "moment";
import { Button, Form, Row, Col } from "react-bootstrap";
import {
  getFirList,
  getSurvivorDetails,
  getInvestigationList,
  getInvestigationListByFirId,
  getModulesChangeLog,
  getInvestStatusList,
  getAgencyTypeList,
  getInvestResultList,
  getAencyListbyType
  
} from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NotificationPage from "../../components/NotificationPage";
import AlertComponent from "../../components/AlertComponent";
import {
  findAncestor,
  gotoSurvivorArchive,
  goToSurvivorChargeSheet,
  
} from "../../utils/helper";

import InvestigationDataTable from "./InvestigationDataTable";
import { NavLink, useHistory, useLocation } from "react-router-dom";

const SurvivorsInvestigation = (props) => {
  const [modalInvestigationShow, setModalInvestigationShow] = useState(false);
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const investigationList = useSelector((state) => state.investigationList);
  const investigationStatusList = useSelector((state) => state.investigationStatusList);
  const investResultList  = useSelector((state)=> state.investResultList);
  const agencyTypeList  = useSelector((state)=> state.agencyTypeList);
  const agencyListbyType  = useSelector((state)=> state.agencyListbyType);

  const [customError, setCustomError] = useState({ name: "", message: "" });


  const [validated, setValidated] = useState(false);

  const [addInvData, setAddInvData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const currentModule = localStorage.getItem("currentModule");
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));
  var firSource = (localStorage.getItem("firSource"));


  const handleShow = () => setShowAlert(true);
  const [activeClass, setActiveClass] = useState(false);
  // const [survivorId, setSurvivorId] = useState("");
  const [resultLoad, setResultLoad] = useState(false);
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");

  const [messagType, setMessagType] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();
  const search = useLocation().search;
  const survivorId = new URLSearchParams(search).get("survivorId");
  const firId = new URLSearchParams(search).get("firId");
  // let url = props.location.search;
  // let queryValues = queryString.parse(url, { parseNumbers: true });

  const [selectedProduct5, setSelectedProduct5] = useState(null);
  //console.log(survivorId, "getId",investResultList);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // initFilters1();
  }, [investigationList]);

  useEffect(() => {
    // //console.log(props.location,"loctaion");
    dispatch(getSurvivorDetails(survivorId));
    dispatch(getFirList(survivorId));
    if (firId) {
      dispatch(getInvestigationListByFirId(survivorId, firId));
      dispatch(getInvestResultList())
      dispatch(getAgencyTypeList())
    } else {
      dispatch(getInvestigationList(survivorId));
    }
  }, [survivorId]);

  const cancelFun = () => {
    setAddInvData({});
    // setSelectedData({});
    setModalInvestigationShow(false);
  };
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //archieve items
  let url = props.location.search;
  const gotoArchiveList = (e) => {
    gotoSurvivorArchive(e, "investigation", survivorId, history);
  };
  const onSelectRow = (data) => {
    //console.log(data, "datatestdada");
    if(data!==null){
    setActiveClass(true);
    setSelectedData(data);
    setAddInvData(data);
    setSelectedProduct5(data);
    }else{
      setActiveClass(false);
      setSelectedData({});
      setAddInvData({});
      setSelectedProduct5(null);
    }
  };

  const gotoEdit = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Investigation to update !!");
      setAlertFlag("alert");
    } else {
      setModalInvestigationShow(true);
      setAddInvData(selectedData);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  const onSelectAgencyType=(e)=>{
    setAddInvData({
      ...addInvData,
      [e.target.name]: e.target.value,
    })
    dispatch(getAencyListbyType(e.target.value))
  }

  //console.log(addInvData, "addInvData");

  const gotoAdd = () => {
    setSelectedData({});
    setAddInvData({});
    setModalInvestigationShow(true);
    setSelectedProduct5(null);
  };
  //   useEffect(()=>{
  //     setSurvivorId(props.location && props.location.state);
  // },[props.location && props.location.state]);

  useEffect(() => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "investigation" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));
    dispatch(getInvestStatusList());
  }, [props]);

  const gotChargeSheet = (e) => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "chargesheet" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Investigation !!");
      setAlertFlag("alert");
    } else if (
      selectedData &&
      selectedData.status_of_investigation &&  selectedData.status_of_investigation === "Ongoing"
    ) {
      setAlertFlag("alert");
      setAlertMessage("You can't add ChargeSheet for Ongoing Investigation");
      handleShow();
    } else {
      let object = {
        survivorId: survivorId,
        firId: firId,
        investigationId: selectedData && selectedData._id,
      };

      goToSurvivorChargeSheet(e, object, history);
    }
  };
  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Investigation !!");
      setAlertFlag("alert");
    } else {
      setShowAlert(true);
      setAlertMessage("");
      setAlertFlag("");
    }
  };
  const [deleteLoader, setDeleteLoader] = useState(false);

  const onDeleteFunction = () => {
    let body = {
      deleted_by: deletedById && deletedById,
      deleted_by_ref: "users",
    };
    setDeleteLoader(true);
    axios
      .patch(api + "/survival-investigation/delete/" + selectedData._id, body,axiosConfig)
      .then((response) => {
       
        setDeleteLoader(false);

        if (response.data && response.data.error === false) {
          const { data } = response;
          handleClick();
          setMessagType("success");
          setUpdateMessage(response && response.data.message);
          dispatch(getInvestigationListByFirId(survivorId, firId));
          setShowAlert(false);
          setErorMessage("");
        }else{
          handleClick();
          setMessagType("error");
          setUpdateMessage(response && response.data.message);
        }
      })
      .catch((error) => {
        handleClick();
        setUpdateMessage(error && error.message);
        setMessagType("error");
        setDeleteLoader(false);
      });
  };


  const changeLogFunc = () => {
    let type = "investigation";
    dispatch(getModulesChangeLog(type,deletedById,survivorId));
    props.history.push("/change-log");
  };

  console.log(addInvData,"addInvData")
  useEffect(() => {
    if (addInvData  && addInvData.inv_agency_type) {
      setCustomError({
        name: "inv_agency_type",
        message: "",
      });
    } else if (addInvData  && addInvData.inv_agency_name) {
      setCustomError({
        name: "inv_agency_name",
        message: "",
      });
    } else if (addInvData  && addInvData.name_of_inv_officer) {
      setCustomError({
        name: "name_of_inv_officer",
        message: "",
      });
    } else if (addInvData  && addInvData.status_of_investigation) {
      setCustomError({
        name: "status_of_investigation",
        message: "",
      });
    } else if (addInvData  && addInvData.rank_of_inv_officer) {
      setCustomError({
        name: "rank_of_inv_officer",
        message: "",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
    }
  }, [addInvData ]);


  const addInvestigationFunc = (e) => {
    e.preventDefault();
    if (addInvData  && !addInvData.inv_agency_type) {
      setCustomError({
        name: "inv_agency_type",
        message: "Please select Type of Investigation agency",
      });
    } else if (addInvData  && !addInvData.inv_agency_name) {
      setCustomError({
        name: "inv_agency_name",
        message: "Please select Name of agency conducting the investigation",
      });
    } else if (addInvData  && !addInvData.name_of_inv_officer) {
      setCustomError({
        name: "name_of_inv_officer",
        message: " Please select Name of the investigating officer",
      });
    } else if (addInvData  && !addInvData.status_of_investigation) {
      setCustomError({
        name: "status_of_investigation",
        message: " Please select Status of investigation",
      });
    } else if (addInvData  && !addInvData.rank_of_inv_officer) {
      setCustomError({
        name: "rank_of_inv_officer",
        message: " Please enter Rank of the investigating officer",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
    var addData = {
      ...addInvData,
      survivor: survivorId,
      source: firSource,
      ref_fir: firId,
    };
    var updateData = {
      ...addInvData,
      survivor: survivorId,
      source: firSource,
      ref_fir: firId,
      user_id: deletedById && deletedById,
    };
    if (selectedData && selectedData._id) {
      setResultLoad(true);
      axios
        .patch(
          api + "/survival-investigation/update/" + selectedData._id,
          updateData,
          axiosConfig
        )
        .then((response) => {
          //console.log(response);
         
          // setSelectedData({});
          setValidated(false);
          setResultLoad(false);
          if (response.data && response.data.error === false) {
            const { data } = response;
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("success");
            setAddInvData({});
            dispatch(getInvestigationListByFirId(survivorId, firId));
            dispatch({ type: "INVESTIGATION_LIST", data: data.result });
            setModalInvestigationShow(false);
          }else{
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("error");
          }
        })
        .catch((error) => {
          setResultLoad(false);
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
        });
    } else {
      setResultLoad(true);
      axios
        .post(api + "/survival-investigation/create", addData, axiosConfig)
        .then((response) => {
          //console.log(response);
         
          setValidated(false);
          setAddInvData({});
          setResultLoad(false);
          if (response.data && response.data.error === false) {
            const { data } = response;
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("success");
            dispatch(getInvestigationListByFirId(survivorId, firId));
            dispatch({ type: "INVESTIGATION_LIST", data: data.data });
            setModalInvestigationShow(false);
          }else{
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("error");
          }
        })
        .catch((error) => {
          setResultLoad(false);
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
        });
    }
  }
  };

  //export csv function///

  //console.log(investigationList, "firrrrrrrrrrrrrr");
  // //console.log(exportData,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  const downloadFile = ({ data, fileName, fileType }) => {
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
  const exportToCsv = (e) => {
    e.preventDefault();

    // Headers for each column
    let headers = [
      "Name Of Agency,Name Of Investigating Officer,Rank Of Investigating Officer,Fir Refference,Result Of Investigation,Status Of Investigation,Source,Survivor,Type Of Investigation Agency,createdAt",
    ];

    // Convert users data to a csv
    let usersCsv = investigationList.reduce((acc, user) => {
      const {
        inv_agency_name,
        name_of_inv_officer,
        rank_of_inv_officer,
        ref_fir,
        result_of_inv,
        status_of_investigation,
        source,
        survivor,
        inv_agency_type,
        createdAt,
      } = user;
      acc.push(
        [
          inv_agency_name && inv_agency_name.name,
          name_of_inv_officer,
          rank_of_inv_officer,
          ref_fir,
          result_of_inv,
          status_of_investigation,
          source.toUpperCase(),
          survivorDetails && survivorDetails.survivor_name,
          inv_agency_type && inv_agency_type.name,
          moment(createdAt).format("DD-MMM-YYYY"),
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "investigationList.csv",
      fileType: "text/csv",
    });
  };

  //////pdf download////////////////

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
    doc.text("SURVIVOR INVESTIGATION LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "Name Of Agency",
      "Name Of Investigating Officer",
      "Rank Of Investigating Officer",
      "Fir Refference",
      "Result Of Investigation",
      "Status Of Investigation",
      "Source",
      "Survivor",
      "Type Of Investigation Agency",
      "createdAt",
    ];
    const name =
      "survivor-investigation-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    investigationList?.forEach((item) => {
      const temp = [
        item.inv_agency_name && item.inv_agency_name.name,
        item.name_of_inv_officer,
        item.rank_of_inv_officer,
        item.ref_fir,
        item.result_of_inv,
        item.status_of_investigation,
        item.source.toUpperCase(),
        survivorDetails.survivor_name,
        item.inv_agency_type && item.inv_agency_type.name,
        moment(item.createdAt).format("DD-MMM-YYYY"),
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
              <h2 className="page_title">Survivor Investigation</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>
                  Survivor Investigation
                </MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topcartbar white_box_shadow">
            <SurvivorTopCard survivorDetails={survivorDetails} />
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            {survivorId && firId ? (
              <div className="vieweditdelete">
                {currentModule && JSON.parse(currentModule).can_view == true && (
                  <Dropdown className="me-1">
                    <Dropdown.Toggle variant="border" className="shadow-0">
                      Action
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {userAccessData &&
                        userAccessData.length > 0 &&
                        userAccessData.map((access) => {
                          return (
                            access.module &&
                            access.module.name.toLowerCase() == "chargesheet" &&
                            access.can_view == true && (
                              <Dropdown.Item onClick={(e) => gotChargeSheet(e)}>
                                ChargeSheet
                              </Dropdown.Item>
                            )
                          );
                        })}
                      <Dropdown.Item onClick={downloadPdf}>
                        Download PDF
                      </Dropdown.Item>
                      <Dropdown.Item onClick={exportToCsv}>
                        Export To CSV
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => changeLogFunc()}>
                        Change Log
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => gotoArchiveList(e)}>
                        Archive Items
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                {currentModule && JSON.parse(currentModule).can_edit == true && (
                  <MDBTooltip
                    tag="button"
                    wrapperProps={{ className: "add_btn view_btn" }}
                    title="Add"
                  >
                    <span onClick={() => gotoAdd()}>
                      <i className="fal fa-plus-circle"></i>
                    </span>
                  </MDBTooltip>
                )}
                {currentModule && JSON.parse(currentModule).can_edit == true && (
                  <MDBTooltip
                    tag="a"
                    wrapperProps={{ className: "edit_btn" }}
                    title="Edit"
                  >
                    <span onClick={() => gotoEdit()}>
                      <i className="fal fa-pencil"></i>
                    </span>
                  </MDBTooltip>
                )}
                {currentModule && JSON.parse(currentModule).can_delete == true && (
                  <MDBTooltip
                    tag="a"
                    wrapperProps={{ className: "delete_btn" }}
                    title="Delete"
                  >
                    <span onClick={() => onDeleteChangeFunc()}>
                      <i className="fal fa-trash-alt"></i>
                    </span>
                  </MDBTooltip>
                )}
              </div>
            ) : (
              <></>
            )}
            {currentModule && JSON.parse(currentModule).can_view == true && (
              <InvestigationDataTable
                investigationList={investigationList}
                onSelectRow={onSelectRow}
                isLoading={isLoading}
                selectedProduct5={selectedProduct5}
              />
            )}
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalInvestigationShow}
        onHide={setModalInvestigationShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedData && selectedData._id
              ? "Update Investigation"
              : "Add Investigation"}
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
                    Source <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="source"
                    defaultValue={firSource && firSource.toUpperCase()}
                    disabled={true}
                    
                  />
                  
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Type of Investigation agency{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    
                    name="inv_agency_type"
                    value={
                      addInvData &&
                      addInvData.inv_agency_type &&
                      addInvData.inv_agency_type._id
                    }
                    onChange={(e) =>
                    onSelectAgencyType(e)
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {agencyTypeList && agencyTypeList.length > 0 && agencyTypeList.map((item)=>{
                      return(
                        <option value={item && item._id}>{item && item.name}</option>
                      )
                    })}
                  </Form.Select>
                  {customError.name == "inv_agency_type" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Name of agency conducting the investigation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    
                    name="inv_agency_name"
                    value={
                      addInvData &&
                      addInvData.inv_agency_name &&
                      addInvData.inv_agency_name._id
                    }
                    onChange={(e) =>
                      setAddInvData({
                        ...addInvData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {agencyListbyType && agencyListbyType.length > 0&& agencyListbyType.map((item)=>{
                      return(
                        <option value={item && item._id}>{item && item.name}</option>

                      )
                    })}
                  </Form.Select>
                  {customError.name == "inv_agency_name" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Name of the investigating officer{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    
                    name="name_of_inv_officer"
                    defaultValue={
                      addInvData &&
                      addInvData.name_of_inv_officer &&
                      addInvData.name_of_inv_officer
                    }
                    type="text"
                    onChange={(e) =>
                      setAddInvData({
                        ...addInvData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                 {customError.name == "name_of_inv_officer" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Status of investigation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    
                    name="status_of_investigation"
                    value={
                      addInvData &&
                      addInvData.status_of_investigation &&
                      addInvData.status_of_investigation
                    }
                    onChange={(e) =>
                      setAddInvData({
                        ...addInvData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Select
                    </option>
                    {investigationStatusList && investigationStatusList.length > 0 && investigationStatusList.map((item)=>{
                      return(
                        <option value={item && item.name}>{item && item.name}</option>
                      )
                    })}
                   
                  </Form.Select>
                  {customError.name == "status_of_investigation" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Rank of the investigating officer{" "}
                    <span>(Designation or rank)</span>{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    
                    name="rank_of_inv_officer"
                    defaultValue={
                      addInvData &&
                      addInvData.rank_of_inv_officer &&
                      addInvData.rank_of_inv_officer
                    }
                    type="text"
                    onChange={(e) =>
                      setAddInvData({
                        ...addInvData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z 0-9 \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                {customError.name == "rank_of_inv_officer" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>Result of investigation </Form.Label>
                  <Form.Select
                    name="result_of_inv"
                    value={
                      addInvData &&
                      addInvData.result_of_inv &&
                      addInvData.result_of_inv
                    }
                    onChange={(e) =>
                      setAddInvData({
                        ...addInvData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select option</option>
                    {investResultList && investResultList.length > 0&& investResultList.map((item)=>{
                      return(
                        <option value={item && item.name}>{item && item.name}</option>

                      )
                    })}
                   
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} xs="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => cancelFun()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    disabled={resultLoad === true ? true : false}
                   
                    onClick={addInvestigationFunc}
                    className="submit_btn shadow-0"
                  >
                    {resultLoad && resultLoad === true ? (
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
          alertFlag={alertFlag}
          alertMessage={alertMessage}
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
          deleteLoader={deleteLoader}
        />
      )}
    </>
  );
};

export default SurvivorsInvestigation;
