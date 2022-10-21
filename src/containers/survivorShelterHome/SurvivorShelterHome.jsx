import React, { useState, useEffect } from "react";
import { Topbar, SurvivorTopCard } from "../../components";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBTooltip,
  MDBBtn,
} from "mdb-react-ui-kit";
import { InputGroup } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import {
  getShelterHomeList,
  getSurvivorDetails,
  getShelterQuestionList,
  getModulesChangeLog,
} from "../../redux/action";
import NotificationPage from "../../components/NotificationPage";
import moment from "moment";
import ShelterHomeDataTable from "./ShelterHomeDataTable";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";
import { gotoSurvivorArchive } from "../../utils/helper";

const SurvivorShelterHome = (props) => {
  const [modalShelterHomeShow, setModalShelterHomeShow] = useState(false);
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const shelterHomeList = useSelector((state) => state.shelterHomeList);
  const [addShelterHomeData, setAddShelterHomeData] = useState({});
  const shelterQuestionList = useSelector((state) => state.shelterQuestionList);
  const [journeyObj, setJourneyObj] = useState({});
  const [journeyArr, setJourneyArr] = useState([]);
  const api = "https://tafteesh-staging-node.herokuapp.com/api/shelter-home";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [messagType, setMessagType] = useState("");

  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [validated, setValidated] = useState(false);

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");

  const [resultLoad, setResultLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customError, setCustomError] = useState({ name: "", message: "" });

  const currentModule = localStorage.getItem("currentModule");
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));

  useEffect(() => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "shelter home" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));
  }, [props]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [shelterHomeList]);

  const changeLogFunc = () => {
    let type = "shelter";
    dispatch(getModulesChangeLog(type, deletedById, props.location.state));
    props.history.push("/change-log");
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (props.location.state) {
      dispatch(getShelterHomeList(props.location.state));
      dispatch(getSurvivorDetails(props.location.state));
      dispatch(getShelterQuestionList());
    }
  }, [props]);
  //console.log(shelterQuestionList, "shelterQuestionList");
  //console.log(shelterHomeList, "shelterHOMEList");

  const onJourneyChange = (e, ques, index) => {
    const toUpdate = [...journeyArr];
    if (toUpdate[index]) {
      toUpdate[index][e.target.name] = e.target.value.trim();
      toUpdate[index]["question"] = ques && ques;
    } else {
      toUpdate.push({
        [e.target.name]: e.target.value.trim(),
        question: ques && ques,
      });
    }
    setJourneyArr(toUpdate);
  };


  useEffect(() => {
    //console.log(journeyObj, "journeyObj");
    if (journeyObj && journeyObj.answer && journeyObj.score) {
      setJourneyArr([...journeyArr, journeyObj]);
    }
  }, [journeyObj]);

  const gotoAdd = (e) => {
    setModalShelterHomeShow(true);
    setActiveClass(false);
    setAddShelterHomeData({});
    setJourneyArr([]);
    setSelectedData({});
    setJourneyObj({});
  };
  const gotoEdit = (e) => {
    if (!selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Shelter Home");
      setAlertFlag("alert");
    } else {
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");

      setModalShelterHomeShow(true);
      setAddShelterHomeData({
        source: selectedData && selectedData.source,
        shelter_home: selectedData && selectedData.shelter_home,
        from_date: selectedData && selectedData.from_date,
        to_date: selectedData && selectedData.to_date,
      });

      setJourneyArr(
        selectedData && selectedData.journey && selectedData.journey
      );
    }
  };
  const onCancel = () => {
    setModalShelterHomeShow(false);
    setAddShelterHomeData({});
    setJourneyArr([]);
    setJourneyObj({});
  };
  const onSelectRow = (data) => {
    //console.log(data);
    if (data !== null) {
      setActiveClass(true);
      setSelectedData(data);
    } else {
      setActiveClass(false);
      setSelectedData({});
    }
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one shelter-home");
      setAlertFlag("alert");
      // alert("Please select one shelter-home");
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
      .patch(api + "/delete/" + selectedData._id, body,axiosConfig)
      .then((response) => {
        setDeleteLoader(false);
        handleClick();
        setMessagType("success")
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({});
          dispatch(getShelterHomeList(props.location && props.location.state));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        setDeleteLoader(false);

        ////console.log(error, "partner error");
      });
  };
  // const handleSubmit = (event) => {
  //   //console.log(event, "habdleSubmit");
  //   // const {form}= event.target
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     if (selectedData && selectedData._id) {
  //       addShelterHomeFunc(event);
  //       setValidated(false);
  //     } else {
  //       event.preventDefault();
  //       event.stopPropagation();
  //     }
  //   } else {
  //     addShelterHomeFunc(event);
  //   }
  //   setValidated(true);
  // };
  ///// API CAL ADD AND UPDATE shelter home//////

  useEffect(() => {
    if (addShelterHomeData && addShelterHomeData.source) {
      setCustomError({
        name: "source",
        message: "",
      });
    } else if (addShelterHomeData && addShelterHomeData.shelter_home) {
      setCustomError({
        name: "shelter_home",
        message: "",
      });
    } else if (addShelterHomeData && addShelterHomeData.from_date) {
      setCustomError({
        name: "from_date",
        message: "",
      });
    }else if (addShelterHomeData && addShelterHomeData.to_date) {
      setCustomError({
        name: "to_date",
        message: "",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
    } 

  },[addShelterHomeData])


  const addShelterHomeFunc = (e) => {
    e.preventDefault();
    
    if (addShelterHomeData && !addShelterHomeData.source) {
      setCustomError({
        name: "source",
        message: " Please select Source",
      });
    } else if (addShelterHomeData && !addShelterHomeData.shelter_home) {
      setCustomError({
        name: "shelter_home",
        message: "Please enter Shelter Home",
      });
    } else if (addShelterHomeData && !addShelterHomeData.from_date) {
      setCustomError({
        name: "from_date",
        message: " Please Select From date",
      });
    }else if (addShelterHomeData && !addShelterHomeData.to_date) {
      setCustomError({
        name: "to_date",
        message: "Please Select To date",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });

    let isValid = true;
    if (journeyArr.length > 0) {
      for (let i = 0; i < journeyArr.length; i++) {
        if (journeyArr[i].answer && journeyArr[i].score === undefined) {
          isValid = false;
          break;
        }
      }
    }
    if (!isValid) {
      setShowAlert(true);
      setAlertMessage("please add score for the journey you want to add.");
      setAlertFlag("alert");
      return;
    }
    var addData = {
      ...addShelterHomeData,
      survivor: props.location && props.location.state,
      journey: journeyArr,
    };
    var updateData = {
      ...addShelterHomeData,
      survivor: props.location && props.location.state,
      user_id: deletedById && deletedById,
      journey: journeyArr,
    };

    if (selectedData && selectedData._id) {
      setResultLoad(true);
      axios
        .patch(api + "/update/" + selectedData._id, updateData, axiosConfig)
        .then((res) => {
          //console.log(res);
          handleClick();
          setMessagType("success")
          setAddShelterHomeData({});
          setJourneyArr([]);
          setJourneyObj({});
          setValidated(false);
          setResultLoad(false);
          setUpdateMessage(res && res.data.message);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            //console.log(data, res);
            dispatch(getShelterHomeList(props.location.state));
            setModalShelterHomeShow(false);
          }
        })
        .catch((error) => {
          //console.log(error);
          setResultLoad(false);
        });
    } else {
      setResultLoad(true);
      axios
        .post(api + "/create", addData, axiosConfig)
        .then((res) => {
          //console.log(res);
          handleClick();
          setAddShelterHomeData({});
          setJourneyArr([]);
          setJourneyObj({});
          setValidated(false);
          setResultLoad(false);
          setUpdateMessage(res && res.data.message);
          setMessagType("success")
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            //console.log(data, res);
            dispatch(getShelterHomeList(props.location.state));
            setModalShelterHomeShow(false);
          }
        })
        .catch((error) => {
          setResultLoad(false);
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
    let headers = ["Id,Survivor,Source,Shelter Home,From,To"];

    // Convert users data to a csv
    let usersCsv = shelterHomeList.reduce((acc, user) => {
      const { _id, survivor, source, shelter_home, from_date, to_date } = user;
      acc.push(
        [
          _id,
          survivor,
          source,
          shelter_home,
          formatDate(from_date),
          formatDate(to_date),
        ].join(",")
      );
      return acc;
    }, []);

    downloadCsvFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "shelterHomeList.csv",
      fileType: "text/csv",
    });
  };

  const fromDateChangeHandel = (e) => {
    setAddShelterHomeData({
      ...addShelterHomeData,
      [e.target.name]: e.target.value,
    });
  };
  const toDateChangeHandel = (e) => {
    setAddShelterHomeData({
      ...addShelterHomeData,
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
    doc.text("SHELTER HOME LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "SOURCE",
      "SHELTER HOME",
      "FROM",
      "TO",
      "CREATED AT",
    ];
    const name = "shelter-home-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    shelterHomeList?.forEach((item) => {
      const temp = [
        item.source,
        item.shelter_home,
        moment(item.from_date).format("DD-MMM-YYYY"),
        moment(item.to_date).format("DD-MMM-YYYY"),
        moment(item.createdAt).format("DD-MMM-YYYY"),
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
    doc.save(name);
  };
  const history = useHistory();

  let url = props.location.search;
  const gotoArchiveList = (e) => {
    gotoSurvivorArchive(e, "shelterHome", props.location.state, history);
  };

  return (
    <>
      <Topbar />
      <main className="main_body">
        <NotificationPage
          handleClose={handleClose}
          open={open}
          message={updateMessage}
          type={messagType}
        />

        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">Shelter Home</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Shelter Home</MDBBreadcrumbItem>
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
                      Export PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => exportToCsv(e)}>
                      Export CSV
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
              <div className="table-responsive big-mobile-responsive">
                <ShelterHomeDataTable
                  shelterHomeList={
                    shelterHomeList &&
                    shelterHomeList.length > 0 &&
                    shelterHomeList
                  }
                  onSelectRow={onSelectRow}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
          <>
            {selectedData &&
              selectedData.journey &&
              selectedData.journey.length > 0 && (
                <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
                  <h4 className="mb-4 small_heading">Journey</h4>

                  <div className="table-responsive big-mobile-responsive">
                    <table className="table table-borderless mb-0">
                      <thead>
                        <tr>
                          <th width="15%">Question</th>
                          <th width="15%">Answer</th>
                          <th width="6%">Survivor Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedData &&
                          selectedData.journey &&
                          selectedData.journey.length > 0 &&
                          selectedData.journey.map((item) => {
                            return (
                              <tr>
                                <td>{item && item.question}</td>
                                <td>{item && item.answer}</td>
                                <td>
                                  <button
                                    style={{
                                      padding: "6px 13px",
                                      borderRadius: "5px",
                                      fontWeight: 600,
                                      letterSpacing: "0.5px",
                                      fontSize: "12px",
                                      border: "1px solid #AB9D1A",
                                    }}
                                  >
                                    {item && item.score + "/10"}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalShelterHomeShow}
        onHide={setModalShelterHomeShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
        backdrop={"static"}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Shelter Home
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
                  <Form.Select
                    
                    name="source"
                    value={
                      addShelterHomeData &&
                      addShelterHomeData.source &&
                      addShelterHomeData.source
                    }
                    onChange={(e) =>
                      setAddShelterHomeData({
                        ...addShelterHomeData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Default select
                    </option>
                    <option value="da">DA</option>
                    <option value="sa">SA</option>
                  </Form.Select>
                  {customError.name == "source" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Shelter Home <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    
                    name="shelter_home"
                    type="text"
                    defaultValue={
                      addShelterHomeData &&
                      addShelterHomeData.shelter_home &&
                      addShelterHomeData.shelter_home
                    }
                    onChange={(e) =>
                      setAddShelterHomeData({
                        ...addShelterHomeData,
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
                  />
                  {customError.name == "shelter_home" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    From Date <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <DatePicker
                    required
                    message={"Please select From Date"}
                    name="from_date"
                    data={addShelterHomeData && addShelterHomeData.from_date}
                    datePickerChange={fromDateChangeHandel}
                  /> */}
                   <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={ addShelterHomeData && addShelterHomeData.from_date ? moment(addShelterHomeData.from_date).format("DD-MMM-YYYY") : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"from_date"}
                          className="dateBtn"
                          type="date"
                          onChange={fromDateChangeHandel}
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
                  {customError.name == "from_date" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    To Date <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <DatePicker
                    required
                    message={"Please select To Date"}
                    name="to_date"
                    data={addShelterHomeData && addShelterHomeData.to_date}
                    datePickerChange={toDateChangeHandel}
                  /> */}
                 <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={ addShelterHomeData && addShelterHomeData.to_date ? moment(addShelterHomeData.to_date).format("DD-MMM-YYYY") : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"to_date"}
                          className="dateBtn"
                          type="date"
                          onChange={toDateChangeHandel}
                          placeholder=""
                          max={moment().format("YYYY-MM-DD")}
                          min={
                             addShelterHomeData  &&
                             addShelterHomeData.from_date  &&
                            moment(addShelterHomeData.from_date ).format(
                              "YYYY-MM-DD"
                            )
                          }
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                  {customError.name == "to_date" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <h4 className="modalSectionTitle">Journey</h4>
                  {shelterQuestionList &&
                    shelterQuestionList.length > 0 &&
                    shelterQuestionList.map((ques, index) => {
                      let idx= index+1
                      return (
                        <div className="questionSet" key={index}>
                          <div className="questionSetQ">
                            <div className="row">
                              <div className="col-lg">
                                <h5>Q.{idx}.</h5>
                              </div>
                              <div className="col-lg-10">
                                <h5>
                                  {ques && ques.question && ques.question}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <div className="questionSetA">
                            <div className="row align-items-center">
                              <div className="col-lg">
                                <h5>Ans.</h5>
                              </div>
                              <div className="col-lg-6">
                                <Form.Group>
                                  <Form.Control
                                    type="text"
                                    name="answer"
                                    // onBlur={(e) =>
                                    //   onJourneyChange(e, ques.question)
                                    // }
                                    defaultValue={
                                      journeyArr &&
                                      journeyArr.length > 0 &&
                                      journeyArr[index] !== undefined &&
                                      journeyArr[index].answer
                                        ? journeyArr[index].answer
                                        : null
                                    }
                                    onChange={(e) =>
                                      onJourneyChange(e, ques.question, index)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className="col-lg-3">
                                <Form.Group>
                                  <Form.Select
                                    disabled={
                                      journeyArr &&
                                      journeyArr.length > 0 &&
                                      journeyArr[index] !== undefined &&
                                      journeyArr[index].answer
                                        ? false
                                        : true
                                    }
                                    name="score"
                                    defaultValue={
                                      journeyArr &&
                                      journeyArr.length > 0 &&
                                      journeyArr[index] !== undefined &&
                                      journeyArr[index].score
                                    }
                                    onChange={(e) =>
                                      onJourneyChange(e, ques.question, index)
                                    }
                                  >
                                    <option hidden={true}>Select score</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                  </Form.Select>
                                </Form.Group>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                    disabled={resultLoad == true ? true : false}
                    className="submit_btn shadow-0"
                    onClick={addShelterHomeFunc}
                  >{resultLoad && resultLoad === true ? (
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

export default SurvivorShelterHome;
