import React, { useState, useEffect, useRef } from "react";
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
import { MultiSelect } from "react-multi-select-component";
import "./survivorsupplimentarychargesheet.css";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import { getSectionByActId, getActList } from "../../redux/action";
import moment from "moment";
import AlertComponent from "../../components/AlertComponent";
import SupplimentaryChargesheetDataTable from "./SupplimentaryChargesheetDataTable";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import DatePicker from "../../components/DatePicker";
import { InputGroup } from "react-bootstrap";

const SurvivorSupplimentaryChargesheet = (props) => {
  const [modalChargesheetShow, setModalChargesheetShow] = useState(false);
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [resultLoad, setResultLoad] = useState(false);


  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const traffickerList = useSelector((state) => state.traffickerList);
  const sectionByActId = useSelector((state) => state.sectionByActId);
  const chargeSheetList = useSelector((state) => state.chargeSheetList);
  const actList = useSelector((state) => state.actList);
  const [messagType, setMessagType] = useState("");

  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [addChargeSheetData, setAddChargeSheetData] = useState({});
  const [chargeSheetObj, setCahrgeSheetObj] = useState({});
  const [firObj, setFirObj] = useState({});
  const [accusedincludedArr, setAccusedincludedArr] = useState([]);
  const [accusedNotIncludedObj, setAccusedNotIncludedObj] = useState({});
  const [accusedNotIncludedArr, setAccusedNotIncludedArr] = useState([]);
  const [sectionArrbyFir, setSectionArrbyFir] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const [updateChargeSheetData, setUpdateChargeSheetData] = useState({});

  const formRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [selectedProduct5, setSelectedProduct5] = useState(null);

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const [supplimentaryChargeSheetList, setSupplimentaryChargeSheetList] =
    useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [chargeSheetData, setChargeSheetData] = useState({});

  // console.log(props.location.state,"props")
  /////// get chargesheet details API ///
  const chargeSheetDetails = (id) => {
    axios
      .get(api + "/survival-chargesheet/detail/" + id, axiosConfig)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;
          setChargeSheetData(data.data);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (props.location.state) {
      chargeSheetDetails(props.location.state);
    }
  }, [props.location.state]);

  ////// get all suplymentory chargesheet ////////

  const fetchAllSupplimentaryChargesheetList = (id) => {
    axios
      .get(api + "/supplimentary-chargesheet/list/" + id, axiosConfig)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSupplimentaryChargeSheetList(response.data.data);
          setErorMessage("");
        }
      })
      .catch((error) => {
        setDeleteLoader(false);

        ////console.log(error, "partner error");
      });
  };

  useEffect(() => {
    fetchAllSupplimentaryChargesheetList(props.location.state);
    dispatch(getActList());
  }, [props]);
  /////// notification open function //////
  const handleClick = () => {
    setOpen(true);
  };
  ////// notification close function ///////
  const handleClose = () => {
    setOpen(false);
  };

  //// on celect row function /////
  const onSelectRow = (e) => {
    //console.log(e,"eeeee");
    if (e !== null) {
      setSelectedData(e);
      setActiveClass(true);
      setSelectedProduct5(e);
    } else {
      setSelectedData({});
      setActiveClass(false);
      setSelectedProduct5(null);
    }
  };

  // add charge sheet modal open/////
  const gotoAdd = () => {
    setSelectedData({});
    setUpdateChargeSheetData({});
    setModalChargesheetShow(true);
    setSelectedProduct5(null);
    setSelectedSection()
    setSelectedAct()
    setCahrgeSheetObj({})
    setAddChargeSheetData({})
  };

  /////// go to edit modal open function//////

  const gotoEdit = (e) => {
    // console.log(selectedData,"selectedData")
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Supplimentary ChargeSheet !!");
      setAlertFlag("alert");
    } else {
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
      setModalChargesheetShow(true);
      setUpdateChargeSheetData(selectedData);
      setSelectedSection(selectedData && selectedData.section)
      setSelectedAct(selectedData && selectedData.act)
      setCahrgeSheetObj({date: selectedData && selectedData.date})
      setAddChargeSheetData({supplimentary_chargesheet_number: selectedData && selectedData.supplimentary_chargesheet_number})
      //console.log(selectedData,'selectedddddddddddddddddd')
    }
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Supplimentary ChargeSheet !!");
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
      .patch(
        api + "/supplimentary-chargesheet/delete/" + selectedData._id,
        body
      )
      .then((response) => {
        setDeleteLoader(false);
        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("success")
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({});
          // dispatch(getChargeSheetList(props.location && props.location.state));
          fetchAllSupplimentaryChargesheetList(props.location.state);
          setShowAlert(false);
          setErorMessage("");
          setSelectedProduct5(null);
        }
      })
      .catch((error) => {
        setDeleteLoader(false);
        ////console.log(error, "partner error");
      });
  };

  ///////// on cancel button function ///////
  const onCancel = (e) => {
    setAddChargeSheetData({});
    setAccusedNotIncludedArr([]);
    setAccusedNotIncludedObj({});
    setAccusedincludedArr([]);
    setCahrgeSheetObj({});
    setSectionArrbyFir([]);
    setUpdateChargeSheetData({});
    setModalChargesheetShow(false);
    setActiveClass(false);
    setFirObj({});
    setSelectedProduct5(null);
    setSelectedSection()
    setSelectedAct()
    setCahrgeSheetObj({})
    setAddChargeSheetData({})
  };

  /////// onchange function of charge sheet date and charge sheet number ////
  const onChargeSheetChange = (e) => {
    setCahrgeSheetObj({
      [e.target.name]: e.target.value,
    });
  };

  //////// onchange function of fir number and date select //////
  const [selectedAct, setSelectedAct] = useState();
  const onActChange = (e) => {
    //console.log(e.target.value,'selected actttttttttttttt')
    setSelectedAct(e.target.value);
    dispatch(getSectionByActId(e.target.value));
  };

  useEffect(() => {
    //  //console.log(updateChargeSheetData && updateChargeSheetData.act._id,"updateChargeSheetData")
    if (updateChargeSheetData && updateChargeSheetData.act) {
      dispatch(
        getSectionByActId(
          updateChargeSheetData &&
            updateChargeSheetData.act &&
            updateChargeSheetData.act
        )
      );
      setSelectedSection(
        updateChargeSheetData &&
          updateChargeSheetData.section &&
          updateChargeSheetData.section
      );
    }
  }, [updateChargeSheetData]);
  const [selectedSection, setSelectedSection] = useState();

  const onSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  //////// add charge sheet api call function //////
  const [customError, setCustomError] = useState({ name: "", message: "" });
  // console.log(selectedAct,"selectedAct",selectedSection,"selectedSection",chargeSheetObj,"chargeSheetObj")

  const addChargeSheetFunc = (e) => {
    e.preventDefault();

    if (chargeSheetObj && !chargeSheetObj.date) {
      setCustomError({
        name: "date",
        message: "Please Select date",
      });
    } else if (
      addChargeSheetData &&
      !addChargeSheetData.supplimentary_chargesheet_number
    ) {
      setCustomError({
        name: "supplimentary_chargesheet_number",
        message: "Please enter Supplymentary Chargesheet number",
      });
    } else if (!selectedAct) {
      setCustomError({
        name: "act",
        message: "Please Select Act",
      });
    } else if (!selectedSection) {
      setCustomError({
        name: "section",
        message: "Please Select Section",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
      const tempData = {
        survivor: survivorDetails._id,
        survivor_chargesheet: props.location.state,
        ...addChargeSheetData,
        act: selectedAct,
        section: selectedSection,
        ...chargeSheetObj,
      };

      var body = tempData;
      //console.log(survivorDetails)
      if (updateChargeSheetData && updateChargeSheetData._id) {
        setResultLoad(true)
        axios
          .patch(
            api +
              "/supplimentary-chargesheet/update/" +
              updateChargeSheetData._id,
            body,
            axiosConfig
          )
          .then((res) => {
            //console.log(res);
            handleClick();
            setUpdateMessage(res && res.data.message);
            setResultLoad(false)
            setMessagType("success")
            if (res && res.data && res.data.error == false) {
              const { data } = res;
              //console.log(data, res);
              fetchAllSupplimentaryChargesheetList(props.location.state);
              setModalChargesheetShow(false);
              setAddChargeSheetData({});
              setAccusedNotIncludedArr([]);
              setAccusedincludedArr([]);
              setCahrgeSheetObj({});
              setSectionArrbyFir([]);
              setSelectedSection()
              setSelectedAct()
              setCahrgeSheetObj({})
              setActiveClass(false);
              setFirObj({});
            }
          })
          .catch((error) => {
            setResultLoad(false)
            //console.log(error);
          });
      } else {
        setResultLoad(true)
        axios
          .post(api + "/supplimentary-chargesheet/create", body, axiosConfig)
          .then((res) => {
            //console.log(res);
            handleClick();
            setMessagType("success")
            setResultLoad(false)
            setUpdateMessage(res && res.data.message);
            if (res && res.data && res.data.error == false) {
              const { data } = res;
              //console.log(data, res);
              fetchAllSupplimentaryChargesheetList(props.location.state);
              setModalChargesheetShow(false);
              setAddChargeSheetData({});
              setAccusedNotIncludedArr([]);
              setAccusedincludedArr([]);
              setCahrgeSheetObj({});
              setSectionArrbyFir([]);
              setSelectedSection()
              setSelectedAct()
              setCahrgeSheetObj({})
              setActiveClass(false);
              setFirObj({});
            }
          })
          .catch((error) => {
            setResultLoad(false)
            //console.log(error);
          });
      }
    }
  };

  let exportData = [];
  supplimentaryChargeSheetList &&
    supplimentaryChargeSheetList.length > 0 &&
    supplimentaryChargeSheetList.map((x, index) => {
      exportData = [
        ...exportData,
        {
         
          chargesheet: chargeSheetData && chargeSheetData.charge_sheet && chargeSheetData.charge_sheet.number,
          supplimentarychargesheetDate: x && moment(x.date).format("DD-MMM-YYYYY"),
          supplimentarychargesheetNumber: x && x.supplimentary_chargesheet_number,
          section: x && x.section,
          act: x && x.act,
          createdAt:x && moment(x.createdAt).format("DD-MMM-YYYY"),
        },
      ];
    });
  //  //console.log(exportData,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
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
  //console.log(chargeSheetObj,'chargeSheetObj')
  const exportToCsv = (e) => {
    e.preventDefault();

    // Headers for each column
    let headers = [
      "ChargesheetNumber,Date,SupplimentaryChargesheetNumber,Section,Act,CreatedAt",
    ];

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const {
        
        chargesheet,
        supplimentarychargesheetDate,
        supplimentarychargesheetNumber,
        section,
        act,
        createdAt,
      } = user;
      acc.push(
        [
          
          chargesheet,
          supplimentarychargesheetDate,
          supplimentarychargesheetNumber,
          section,
          act,
          createdAt,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "SupplimentarychargesheetList.csv",
      fileType: "text/csv",
    });
  };

  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(20);
    doc.text("SURVIVOR PROCEDURAL CORRECTION LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "ChargesheetNumber",
      "Date",
      "SupplimentaryChargesheetNumber",
      "Section",
      "Act",
      "CreatedAt",
    ];
    const name =
      "survivor-suplimentarychargesheet-list" +
      new Date().toISOString() +
      ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [
        item.chargesheet,
        item.supplimentarychargesheetDate,
        item.supplimentarychargesheetNumber,
        item.section,
        item.act,
        item.createdAt,
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
              <h2 className="page_title">Supplimentary Chargesheet</h2>
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
                  Supplimentary Chargesheet
                </MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topcartbar white_box_shadow">
            <SurvivorTopCard
              survivorDetails={survivorDetails && survivorDetails}
            />
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            {props &&
            props.location &&
            props.location.flag === "fromSurvivor" ? (
              <></>
            ) : (
              <div className="vieweditdelete">
                <Dropdown className="me-1">
                  <Dropdown.Toggle variant="border" className="shadow-0">
                    Action
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={(e) => downloadPdf(e)}>
                      Download PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={exportToCsv}>
                      Export To CSV
                    </Dropdown.Item>
                    {/* <Dropdown.Item href="/#">Change Log</Dropdown.Item> */}
                  </Dropdown.Menu>
                </Dropdown>
                <MDBTooltip
                  tag="button"
                  wrapperProps={{ className: "add_btn view_btn" }}
                  title="Add"
                >
                  <span onClick={() => gotoAdd()}>
                    <i className="fal fa-plus-circle"></i>
                  </span>
                </MDBTooltip>
                <MDBTooltip
                  tag="a"
                  wrapperProps={{ className: "edit_btn" }}
                  title="Edit"
                >
                  <span onClick={(e) => gotoEdit(e)}>
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
                </MDBTooltip>
              </div>
            )}
            <SupplimentaryChargesheetDataTable
              selectedProduct5={selectedProduct5}
              chargeSheetList={
                supplimentaryChargeSheetList &&
                supplimentaryChargeSheetList.length > 0 &&
                supplimentaryChargeSheetList
              }
              onSelectRow={onSelectRow}
            />
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalChargesheetShow}
        onHide={setModalChargesheetShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {updateChargeSheetData && updateChargeSheetData._id
              ? "Update Supplimentary Chargesheet"
              : "Add Supplimentary Chargesheet"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Date <span className="requiredStar">*</span>
                  </Form.Label>

                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          chargeSheetObj && chargeSheetObj.date
                            ? moment(chargeSheetObj.date).format("DD-MMM-YYYY")
                            : updateChargeSheetData &&
                              updateChargeSheetData.date
                            ? moment(updateChargeSheetData.date).format(
                                "DD-MMM-YYYY"
                              )
                            : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          required
                          name={"date"}
                          className="dateBtn"
                          type="date"
                          onChange={onChargeSheetChange}
                          placeholder=""
                          max={moment().format("YYYY-MM-DD")}
                          min={
                            chargeSheetData &&
                            chargeSheetData.charge_sheet &&
                            chargeSheetData.charge_sheet.date &&
                            moment(chargeSheetData.charge_sheet.date).format(
                              "YYYY-MM-DD"
                            )
                          }
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                  {customError.name == "date" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Supplimentary Chargesheet Number
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    name="supplimentary_chargesheet_number"
                    defaultValue={
                      chargeSheetObj &&
                      chargeSheetObj.supplimentary_chargesheet_number
                        ? chargeSheetObj.supplimentary_chargesheet_number
                        : updateChargeSheetData &&
                          updateChargeSheetData.supplimentary_chargesheet_number
                    }
                    type="text"
                    onKeyPress={(e) =>{
                      if (!/[0-9\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                    onChange={(e) =>
                      setAddChargeSheetData({
                        ...addChargeSheetData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                  />
                  {customError.name == "supplimentary_chargesheet_number" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Act Name <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="act"
                    onChange={onActChange}
                    // value={firObj && firObj._id && firObj._id}
                    value={
                      selectedAct
                        ? selectedAct
                        : updateChargeSheetData &&
                          updateChargeSheetData.act &&
                          updateChargeSheetData.act
                    }
                  >
                    <option value={""} hidden={true}>
                      Select Act
                    </option>
                    {actList &&
                      actList.length > 0 &&
                      actList.map((data) => {
                        return (
                          <option value={data && data.name}>
                            {data && data.name}{" "}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "act" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Section <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="section"
                    onChange={onSectionChange}
                    value={selectedSection}
                  >
                    <option value={""} hidden={true}>
                      Select Section
                    </option>
                    {sectionByActId &&
                      sectionByActId.length > 0 &&
                      sectionByActId.map((data) => {
                        return (
                          <option value={data && data.number}>
                            {data && data.number}{" "}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "section" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={(e) => onCancel(e)}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    onClick={(e) => addChargeSheetFunc(e)}
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
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
          deleteLoader={deleteLoader}
          alertFlag={alertFlag}
          alertMessage={alertMessage}
        />
      )}
    </>
  );
};

export default SurvivorSupplimentaryChargesheet;
