import React, { useState, useEffect } from "react";
import { Topbar, SurvivorTopCard } from "../../components";

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
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import { NavLink, useHistory } from "react-router-dom";
import {
  getSurvivorDetails,
  getRescueList,
  getModulesChangeLog,
  getCityList,
} from "../../redux/action";
import moment from "moment";
import RescueDataTable from "./RescueDataTable";
import "./survivorsrescue.css";
import AlertComponent from "../../components/AlertComponent";

import DatePicker from "../../components/DatePicker";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { InputGroup } from "react-bootstrap";
import queryString from "query-string";
import { gotoSurvivorArchive } from "../../utils/helper";

const SurvivorsRescue = (props) => {
  const [modalRescueShow, setModalRescueShow] = useState(false);
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const rescueList = useSelector((state) => state.rescueList);
  const [selectedData, setSelectedData] = useState({});
  const masterStateData = useSelector((state) => state.masterStateData);
  const [addRescueData, setAddRescueData] = useState({});
  const [validated, setValidated] = useState(false);
  const [customError, setCustomError] = useState({ name: "", message: "" });
  const [activeClass, setActiveClass] = useState(false);

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const currentModule = localStorage.getItem("currentModule");
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));
  const cityList = useSelector((state) => state.cityList);

  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const dispatch = useDispatch();
  const [survivorId, setSurvivorId] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/survival-rescue";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [messagType, setMessagType] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertFlag, setAlertFlag] = useState("");
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [buttonLoader, setButtonLoader] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // initFilters1();
  }, [rescueList]);

  useEffect(() => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "rescue" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));
  }, [props]);

  useEffect(() => {
    setSurvivorId(props.location && props.location.state);
    //console.log();
    dispatch(getSurvivorDetails(props.location.state));
    dispatch(getRescueList(props.location && props.location.state));
  }, [props]);
  //console.log(masterStateData, "state");
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const history = useHistory();
  let url = props.location.search;
  const gotoArchiveList = (e) => {
    gotoSurvivorArchive(e, "rescue", survivorId, history);
  };
  const onSelectRow = (item) => {
    if(item !==null){
    setSelectedData(item);
    setActiveClass(true);
    setSelectedProduct5(item);
    } else{
      setSelectedData({});
      setActiveClass(false);
      setSelectedProduct5(null);
  
    }
  };
  const gotoAdd = () => {
    setAddRescueData({});
    setModalRescueShow(true);
    setSelectedData({});
    setSelectedProduct5(null);
  };

  const gotoEdit = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Rescue !!");
      setAlertFlag("alert");
    } else {
      setAddRescueData(selectedData);
      setModalRescueShow(true);
    }
  };

  const changeLogFunc = () => {
    let type = "rescue";
    dispatch(getModulesChangeLog(type, deletedById,props.location.state));
    props.history.push("/change-log");
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Rescue !!");
      setAlertFlag("alert");
    } else {
      setShowAlert(true);
      setAlertMessage("");
      setAlertFlag("");
    }
  };
  //console.log(rescueList, "rescueeeeeeeeeeeeeeeeeeeee");

  const [deleteLoader, setDeleteLoader] = useState(false);

  const onDeleteFunction = () => {
    let body = {
      deleted_by: deletedById && deletedById,
      deleted_by_ref: "users",
    };
    setDeleteLoader(true)
    axios
      .patch(api + "/delete/" + selectedData._id, body,axiosConfig)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("success");
        setDeleteLoader(false)
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getRescueList(props.location && props.location.state));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        ////console.log(error, "partner error");
        setDeleteLoader(false)
        handleClick();
        setUpdateMessage(error && error.message);
        setMessagType("error");
      });
  };

  //// age of now
  const calculate_age = (obj) => {
    //console.log(obj, "survivorDetils");
    var birthDate = new Date(survivorDetails && survivorDetails.date_of_birth);
    var today = new Date(obj); // create a date object directly from `dob1` argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    //console.log(age_now);
    setAddRescueData({
      ...addRescueData,
      age_when_rescued: age_now,
    });
    return age_now;
  };
  useEffect(() => {
    if (addRescueData && addRescueData.date_of_rescue) {
      calculate_age(addRescueData.date_of_rescue);
    }
  }, [addRescueData && addRescueData.date_of_rescue]);

  useEffect(() => {
    if (addRescueData && addRescueData.date_of_rescue) {
      setCustomError({
        name: "date_of_rescue",
        message: "",
      });
    } else if (addRescueData && addRescueData.rescue_from_place) {
      setCustomError({
        name: "rescue_from_place",
        message: "",
      });
    } else if (addRescueData && addRescueData.rescue_from_state) {
      setCustomError({
        name: "rescue_from_state",
        message: "",
      });
    } else if (addRescueData && addRescueData.rescue_from_city) {
      setCustomError({
        name: "rescue_from_city",
        message: "",
      });
    } else if (addRescueData && addRescueData.nature_of_the_place_of_rescue) {
      setCustomError({
        name: "nature_of_the_place_of_rescue",
        message: "",
      });
    } else if (addRescueData && addRescueData.rescue_conducted_by) {
      setCustomError({
        name: "rescue_conducted_by",
        message: "",
      });
    } else if (addRescueData && addRescueData.update_notes) {
      setCustomError({
        name: "update_notes",
        message: "",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
    }
  }, [addRescueData]);

  const removeEmptySpaces = (stringVal) => {
    return /\s/g.test(stringVal);
  };

  useEffect(() => {
    if (
      addRescueData &&
      addRescueData.rescue_from_state &&
      addRescueData.rescue_from_state._id
    ) {
      dispatch(getCityList(addRescueData.rescue_from_state._id));
    } else if (addRescueData && addRescueData.rescue_from_state) {
      dispatch(getCityList(addRescueData.rescue_from_state));
    }
  }, [addRescueData && addRescueData.rescue_from_state]);

  // const changestringVal = event => {
  //   const isValid = removeEmptySpaces(event.target.value);
  // };
  //////add rescue API call function ////////////
  const addRescue = (e) => {
    e.preventDefault();
    let pattern = /[0-9\s]{0,}[a-zA-Z]{2,}/g

    if (addRescueData && !addRescueData.date_of_rescue) {
      setCustomError({
        name: "date_of_rescue",
        message: "Please select Date of Rescue",
      });
    } else if (addRescueData && !addRescueData.rescue_from_place) {
      setCustomError({
        name: "rescue_from_place",
        message: "Please enter Rescue Place",
      });
    } else if(!pattern.test(addRescueData && addRescueData.rescue_from_place)){
      setCustomError({
        name: "rescue_from_place",
        message: "Please enter valid Rescue Place",
      });
    }
   
    else if (addRescueData && !addRescueData.rescue_from_state) {
      setCustomError({
        name: "rescue_from_state",
        message: "Please select Rescue State",
      });
    } else if (addRescueData && !addRescueData.rescue_from_city) {
      setCustomError({
        name: "rescue_from_city",
        message: "Please enter Rescue City",
      });
    }  else if (addRescueData && !addRescueData.nature_of_the_place_of_rescue) {
      setCustomError({
        name: "nature_of_the_place_of_rescue",
        message: "Please enter Nature of the Place of Rescue",
      });
    } 
   
    else if (addRescueData && !addRescueData.rescue_conducted_by) {
      setCustomError({
        name: "rescue_conducted_by",
        message: "Please select Rescue Conducted by",
      });
    } else if (addRescueData && !addRescueData.update_notes) {
      setCustomError({
        name: "update_notes",
        message: "Please enter Update Notes",
      });
    } else if(!pattern.test(addRescueData && addRescueData.update_notes)){
      setCustomError({
        name: "update_notes",
        message: "Please enter valid Update Notes",
      });
    }
   else {
      let updateData = {
        ...addRescueData,
        survivor: survivorId && survivorId,
        user_id: deletedById && deletedById,
      };
      let addData = {
        ...addRescueData,
        survivor: survivorId && survivorId,
      };

      //console.log(updateData, "updateData", addData, "addData");
      //console.log(addRescueData, "addRescueData");
      if (addRescueData && addRescueData._id) {
        setButtonLoader(true);
        axios
          .patch(api + "/update/" + addRescueData._id, updateData, axiosConfig)
          .then((res) => {
            //console.log(res);
            handleClick();
            setUpdateMessage(res && res.data.message);
            setMessagType("success");

            setActiveClass(false);

            setButtonLoader(false);
            if (res && res.data && res.data.error == false) {
              const { data } = res;
              setAddRescueData({});
              //console.log(data, res);
              // dispatch({ type: "PARTICIPATION_LIST", data: data });
              dispatch(getRescueList(survivorId));
              setModalRescueShow(false);
            }
          })
          .catch((error) => {
            //console.log(error);
            handleClick();
            setUpdateMessage(error && error.message);
            setMessagType("error");
            setButtonLoader(false);
          });
      } else {
        setButtonLoader(true);
        axios
          .post(api + "/create", addData, axiosConfig)
          .then((res) => {
            //console.log(res);
            handleClick();
            setUpdateMessage(res && res.data.message);
            setValidated(false);
            setActiveClass(false);
            setMessagType("success");
            setButtonLoader(false);
            if (res && res.data && res.data.error == false) {
              const { data } = res;
              setAddRescueData({});
              //console.log(data, res);
              // dispatch({ type: "PARTICIPATION_LIST", data: data });
              dispatch(getRescueList(survivorId));
              setModalRescueShow(false);
            }
          })
          .catch((error) => {
            //console.log(error);
            setButtonLoader(false);
            handleClick();
            setUpdateMessage(error && error.message);
            setMessagType("error");
          });
      }
    }
  };
  const onChangeDateHandler = (e) => {
    setAddRescueData({
      ...addRescueData,
      [e.target.name]: e.target.value.trim(),
    });
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

  let exportData = [];
  rescueList.map((x, index) => {
    exportData.push({
      survivor: survivorDetails && survivorDetails.survivor_name,
      age_when_rescued: x.age_when_rescued,
      date_of_rescue: formatDate(x.date_of_rescue),
      nature_of_the_place_of_rescue: x.nature_of_the_place_of_rescue,
      rescue_conducted_by: x.rescue_conducted_by,
      rescue_from_city: x.rescue_from_city,
      rescue_from_place: x.rescue_from_place,
      rescue_from_state: x.rescue_from_state.name,
      update_notes: x.update_notes,
    });
  });
 
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
      "Surviver,Age when rescued,Date Of Rescue,Natur Of the Place,Conducted By,Rescue City,Rescue Place,Rescue State,Update Notes",
    ];

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const {
        survivor,
        age_when_rescued,
        date_of_rescue,
        nature_of_the_place_of_rescue,
        rescue_conducted_by,
        rescue_from_city,
        rescue_from_place,
        rescue_from_state,
        update_notes,
      } = user;
      acc.push(
        [
          survivor,
          age_when_rescued,
          date_of_rescue,
          nature_of_the_place_of_rescue,
          rescue_conducted_by,
          rescue_from_city,
          rescue_from_place,
          rescue_from_state,
          update_notes,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "RescueList.csv",
      fileType: "text/csv",
    });
  };

  //download pdf function

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
    doc.text("SURVIVOR RESCUE LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "Surviver",
      "Age when rescued",
      "Date Of Rescue",
      "Nature Of the Place",
      "Conducted By",
      "Rescue City",
      "Rescue Place",
      "Rescue State",
      "Update Notes",
    ];
    const name = "survivor-rescue-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [
        item.survivor,
        item.age_when_rescued,
        item.date_of_rescue,
        item.nature_of_the_place_of_rescue,
        item.rescue_conducted_by,
        item.rescue_from_city,
        item.rescue_from_place,
        item.rescue_from_state,
        item.update_notes,
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
              <h2 className="page_title">Survivor Rescue</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Survivor Rescue</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topcartbar white_box_shadow">
            <SurvivorTopCard survivorDetails={survivorDetails} />
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            <div className="vieweditdelete">
              {currentModule && JSON.parse(currentModule).can_view == true && (
                <Dropdown className="me-1">
                  <Dropdown.Toggle variant="border" className="shadow-0">
                    Action
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
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
            {currentModule && JSON.parse(currentModule).can_view == true && (
              <RescueDataTable
                selectedProduct5={selectedProduct5}
                rescueList={rescueList && rescueList.length > 0 && rescueList}
                onSelectRow={onSelectRow}
                isLoading={isLoading}
              />
            )}
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
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedData && !selectedData._id ? 'Add' : 'Update'} Rescue
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form
            // noValidate validated={validated} onSubmit={handleSubmitRes}
            >
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Date of Rescue
                    <span className="requiredStar">*</span>
                  </Form.Label>

                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addRescueData && addRescueData.date_of_rescue
                            ? moment(addRescueData.date_of_rescue).format(
                                "DD-MMM-YYYY"
                              )
                            : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"date_of_rescue"}
                          className="dateBtn"
                          type="date"
                          onChange={onChangeDateHandler}
                          placeholder=""
                          max={moment().format("YYYY-MM-DD")}
                          min={
                            survivorDetails &&
                            survivorDetails.date_of_trafficking &&
                            moment(survivorDetails.date_of_trafficking).format(
                              "YYYY-MM-DD"
                            )
                          }
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                  {customError.name == "date_of_rescue" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Age when rescued
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    defaultValue={
                      addRescueData && addRescueData.age_when_rescued
                    }
                    disabled={true}
                    type="number"
                    name="age_when_rescued"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Rescue from place
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    defaultValue={
                      addRescueData && addRescueData.rescue_from_place
                    }
                    name="rescue_from_place"
                    type="text"
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) =>{
                      if (!/[0-9a-zA-Z\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                  {customError.name == "rescue_from_place" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Rescue from state <span className="requiredStar">*</span>
                  </Form.Label>

                  <Form.Select
                    name="rescue_from_state"
                    value={
                      addRescueData &&
                      addRescueData.rescue_from_state &&
                      addRescueData.rescue_from_state._id
                    }
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                  >
                    <option hidden={true} value="">
                      Default select
                    </option>
                    {masterStateData &&
                      masterStateData.length > 0 &&
                      masterStateData.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "rescue_from_state" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Rescue from city
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <Form.Control
                    defaultValue={
                      addRescueData && addRescueData.rescue_from_city
                    }
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    name="rescue_from_city"
                    type="text"
                  /> */}
                  <Form.Select
                    name="rescue_from_city"
                    value={
                      addRescueData &&
                      addRescueData.rescue_from_city &&
                      addRescueData.rescue_from_city
                    }
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                  >
                    <option hidden={true} value="">
                      Default select
                    </option>
                    {cityList &&
                      cityList.length > 0 &&
                      cityList.map((item) => {
                        return (
                          <option value={item && item.name}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "rescue_from_city" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Nature of the place of rescue{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    defaultValue={
                      addRescueData &&
                      addRescueData.nature_of_the_place_of_rescue
                    }
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) =>{
                      if (!/[a-zA-Z\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                    name="nature_of_the_place_of_rescue"
                    type="text"
                  />
                  {customError.name == "nature_of_the_place_of_rescue" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Who conducted the rescue?{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="rescue_conducted_by"
                    value={addRescueData && addRescueData.rescue_conducted_by}
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true} value={""}>
                      Default select
                    </option>
                    <option value="self">Self</option>
                    <option value="customer">Customer</option>
                    <option value="family">Family</option>
                    <option value="local_police">Local Police</option>
                    <option value="ahtu">AHTU</option>
                    <option value="ngo">NGO</option>
                  </Form.Select>
                  {customError.name == "rescue_conducted_by" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    Update Notes <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="4"
                    name="update_notes"
                    defaultValue={addRescueData && addRescueData.update_notes}
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    placeholder="Enter the Reason"
                  />
                  {customError.name == "update_notes" && (
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
                    onClick={() => setModalRescueShow(false)}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    onClick={addRescue}
                    disabled={buttonLoader == true ? true : false}
                    className="submit_btn shadow-0"
                  >
                    {buttonLoader && buttonLoader === true ? (
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
          alertMessage={alertMessage}
          alertFlag={alertFlag}
          deleteLoader={deleteLoader}
        />
      )}
    </>
  );
};

export default SurvivorsRescue;
