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
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col } from "react-bootstrap";
import "./survivorlawyers.css";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import {
  getSurvivorLawyersList,
  getSurvivorDetails,
  getLawyersListByCatId,
  getModulesChangeLog,
} from "../../redux/action";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import LoanDataTable from "./LawyerDataTable";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";
import { gotoSurvivorArchive } from "../../utils/helper";
import { InputGroup } from "react-bootstrap";

const SurvivorsLawyers = (props) => {
  const [modalNewloanLogShow, setModalNewloanLogShow] = useState(false);
  const [modalPaidlogShow, setModalPaidlogShow] = useState(false);
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const survivalLoanList = useSelector((state) => state.survivalLoanList);
  const survivorLawyersList = useSelector((state) => state.survivorLawyersList);
  const mortgageList = useSelector((state) => state.mortgageList);
  const masterLawyerCategoryList = useSelector((state) => state.masterLawyerCategoryList);
  const lawyersListByCatId = useSelector((state) => state.lawyersListByCatId);
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedProduct5, setSelectedProduct5] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [validated, setValidated] = useState(false);

  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [selectFile, setSelectFile] = useState("");
  const [pictureData, setPictureData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [addLoanData, setAddLoanData] = useState({});
  const [addPaidLogData, setAddPaidLogData] = useState({});
  const [mortArr, setMortArr] = useState([]);

  const [selected, setSelected] = useState([]);

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const [messagType, setMessagType] = useState("");
  const currentModule = localStorage.getItem("currentModule");
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));
  const [resultLoad, setResultLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [survivorLawyersList]);

  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };

  const changeLogFunc = () => {
    let type = "lawyer";
    dispatch(getModulesChangeLog(type, deletedById, props.location.state));
    props.history.push("/change-log");
  };

  useEffect(() => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "lawyer" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));
  }, [props]);

  useEffect(() => {
    if (props.location.state) {
      dispatch(getSurvivorLawyersList(props.location.state));
      dispatch(getSurvivorDetails(props.location.state));
    }
  }, [props]);

  useEffect(() => {
    const options = [];
    let obj = { label: "", value: "" };
    mortgageList &&
      mortgageList.length > 0 &&
      mortgageList.map((mort) => {
        return (
          (obj = { label: mort.name, value: mort._id }),
          options.push(obj),
          //console.log(options, obj, "options, obj"),
          setMortArr(options)
        );
      });
  }, [mortgageList]);

  //console.log(mortArr, "mortarr");

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
      setSelectedProduct5(item);
    } else {
      setSelectedData({});
      setActiveClass(false);
      setSelectedProduct5(null);
    }
  };

  ////// go to add loan ///

  const gotoAddLoan = () => {
    setModalNewloanLogShow(true);
    setAddLoanData({});
    setSelectedData({});
  };

  ///// go to edit loan ///
  const gotoEditLoan = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Lawyer");
      setAlertFlag("alert");
    } else {
      setModalNewloanLogShow(true);
      setAddLoanData(selectedData);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Lawyer");
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
      .patch(api + "/survivor-lawyer/delete/" + selectedData._id, body,axiosConfig)
      .then((response) => {
        setDeleteLoader(false);
        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("success");
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(
            getSurvivorLawyersList(props.location && props.location.state)
          );
          setShowAlert(false);
          setSelectedProduct5(null);

          setErorMessage("");
        }
      })
      .catch((error) => {
        setDeleteLoader(false);
        handleClick();
        setUpdateMessage(error && error.message);
        setMessagType("error");
      });
  };

  /////////////////////file upload function/////////////////////////
  const onDocumentChange = (e) => {
    //console.log(e, e.target.files[0]);
    let data = e.target.files[0];
    setSelectFile(e.target.files[0]);
    storeFile(data);
  };

  const storeFile = (file) => {
    //console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        "https://tafteesh-staging-node.herokuapp.com/api/file/upload",
        formData,
        axiosConfig
      )
      .then(function (response) {
        //console.log("successfully uploaded", response);
        if (response && response.data.error === false) {
          const { data } = response;
          //console.log(data.data.filePath, "file path");
          setAddLoanData({
            ...addLoanData,
            reference_document: {
              name: file && file.name,
              file: "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
            },
          });
          // setPictureData(data.data.filePath)
          // //console.log(addLoanData, pictureData);
        }
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  useEffect(() => {
    let arr = [];
    selected &&
      selected.length > 0 &&
      selected.map((data) => {
        return (
          arr.push(data.value),
          //console.log(arr, "arr"),
          setAddLoanData({
            ...addLoanData,
            mortgage: arr,
          })
        );
      });
  }, [selected]);

  useEffect(() => {
    if (addLoanData && addLoanData.type && addLoanData.type._id) {
      dispatch(getLawyersListByCatId(addLoanData.type));
    } else if (addLoanData && addLoanData.type) {
      dispatch(getLawyersListByCatId(addLoanData.type));
    }
  }, [addLoanData]);


  const [customError, setCustomError] = useState({ name: "", message: "" });

  useEffect(() => {
    if (addLoanData && addLoanData.source) {
      setCustomError({
        name: "source",
        message: "",
      });
    } else if (addLoanData && addLoanData.type) {
      setCustomError({
        name: "type",
        message: "",
      });
    } else if (addLoanData && addLoanData.name) {
      setCustomError({
        name: "name",
        message: "",
      });
    } else if (addLoanData && addLoanData.isleading) {
      setCustomError({
        name: "isleading",
        message: "",
      });
    } else if (addLoanData && addLoanData.from_date) {
      setCustomError({
        name: "from_date",
        message: "",
      });
    } else if (addLoanData && addLoanData.to_date) {
      setCustomError({
        name: "to_date",
        message: "",
      });
    } else if (addLoanData && addLoanData.leading_at) {
      setCustomError({
        name: "leading_at",
        message: "",
      });
    } else if (addLoanData && addLoanData.updated_notes) {
      setCustomError({
        name: "updated_notes",
        message: "",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
    }
  }, [addLoanData]);
  //////////// add loan api call function /////////////
  const addLoanFunc = (e) => {
    e.preventDefault();

    if (addLoanData && !addLoanData.source) {
      setCustomError({
        name: "source",
        message: "Please select source",
      });
    } else if (addLoanData && !addLoanData.type) {
      setCustomError({
        name: "type",
        message: "Please select Type",
      });
    } else if (addLoanData && !addLoanData.name) {
      setCustomError({
        name: "name",
        message: "Please select Lawyer's Name",
      });
    } else if (addLoanData && !addLoanData.isleading) {
      setCustomError({
        name: "isleading",
        message: "Please select is leading",
      });
    } else if (addLoanData && !addLoanData.from_date) {
      setCustomError({
        name: "from_date",
        message: "Please select From Date",
      });
    } else if (addLoanData && !addLoanData.to_date) {
      setCustomError({
        name: "to_date",
        message: "Please select To Date",
      });
    } else if (addLoanData && !addLoanData.leading_at) {
      setCustomError({
        name: "leading_at",
        message: "Please select Leading at",
      });
    } else if (addLoanData && addLoanData._id && !addLoanData.updated_notes) {
      setCustomError({
        name: "updated_notes",
        message: "Please enter Updated notes",
      });
    } else {
      let addData = {
        survivor: props.location && props.location.state,
        ...addLoanData,
      };
      var updateData = {
        ...addLoanData,
        survivor: props.location && props.location.state,
        user_id: deletedById && deletedById,
      };

      if (addLoanData && addLoanData._id) {
        setResultLoad(true);
        axios
          .patch(
            api + "/survivor-lawyer/update/" + addLoanData._id,
            updateData,
            axiosConfig
          )
          .then((response) => {
            //console.log(response);
            setResultLoad(false);
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("success");
            setValidated(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              dispatch(getSurvivorLawyersList(props.location.state));
              setModalNewloanLogShow(false);
              setModalPaidlogShow(false);
              setActiveClass(false);
              setAddLoanData({});
              setAddPaidLogData({});
              setSelectedProduct5(null);
            } else {
              handleClick();
              setUpdateMessage(response && response.data.message);
            }
          })
          .catch((error) => {
            //console.log(error, "error");
            handleClick();
            setUpdateMessage(error && error.message);
            setMessagType("error");
            setResultLoad(false);
          });
      } else {
        setResultLoad(true);
        axios
          .post(api + "/survivor-lawyer/create", addData, axiosConfig)
          .then((response) => {
            //console.log(response);
            setResultLoad(false);
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("success");
            setValidated(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              dispatch(getSurvivorLawyersList(props.location.state));
              setModalNewloanLogShow(false);
              setSelectedProduct5(null);

              setAddLoanData({});
            } else {
              handleClick();
              setUpdateMessage(response && response.data.message);
            }
          })
          .catch((error) => {
            setResultLoad(false);
            //console.log(error, "error");
            handleClick();
            setUpdateMessage(error && error.message);
            setMessagType("error");
          });
      }
    }
  };

  //export csv function///

  const formatDate = (value) => {
    return moment(value).format("DD-MMM-YYYY");
  };

  let exportData = [];
  survivorLawyersList.map((x, index) => {
    exportData.push({
      from_date: formatDate(x.from_date),
      to_date: formatDate(x.to_date),
      isleading: x.isleading,
      name: x.name.name,
      source: x.source,
      survivor: survivorDetails.survivor_name,
      type: x.type.name,
      createdAt: formatDate(x.createdAt),
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
      "FromDate,ToDate,IsLeading,Lawyer's Name,Source,Survivor,Type,createdAt",
    ];

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const {
        from_date,
        to_date,
        isleading,
        name,
        source,
        survivor,
        type,
        createdAt,
      } = user;
      acc.push(
        [
          from_date,
          to_date,
          isleading,
          name,
          source.toUpperCase(),
          survivor,
          type,
          createdAt,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "lawyersList.csv",
      fileType: "text/csv",
    });
  };

  const onChangeDateHandler = (e) => {
    setAddLoanData({
      ...addLoanData,
      [e.target.name]: e.target.value,
    });
  };

  /////////download pdf////////////////

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
    doc.text("SURVIVOR LAWYER LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "From Date",
      "To Date",
      "Is Leading",
      "Lawyer's Name",
      "Source",
      "Survivor",
      "Type",
      "created At",
    ];
    const name = "survivor-lawyer-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [
        item.from_date,
        item.to_date,
        item.isleading,
        item.name,
        item.source.toUpperCase(),
        item.survivor,
        item.type,
        item.createdAt,
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
    doc.save(name);
  };

  const history = useHistory();

  let url = props.location.search;
  const gotoArchiveList = (e) => {
    gotoSurvivorArchive(e, "lawyer", props.location.state, history);
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
              <h2 className="page_title">Lawyers</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Lawyers</MDBBreadcrumbItem>
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
                    <Dropdown.Item onClick={exportToCsv}>
                      Export to CSV
                    </Dropdown.Item>
                    <Dropdown.Item onClick={downloadPdf}>
                      Download PDF
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
                  <span onClick={() => gotoAddLoan()}>
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
                  <span onClick={() => gotoEditLoan()}>
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
                <LoanDataTable
                  survivorLawyersList={
                    survivorLawyersList &&
                    survivorLawyersList.length > 0 &&
                    survivorLawyersList
                  }
                  selectedProduct5={selectedProduct5}
                  onSelectRow={onSelectRow}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalNewloanLogShow}
        onHide={setModalNewloanLogShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
        backdrop={"static"}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedData && selectedData._id
              ? "Update Lawyers"
              : "Add Lawyers"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form
            //  noValidate validated={validated} onSubmit={handleSubmit}
            >
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Source <span className="requiredStar">*</span>
                  </Form.Label>

                  <Form.Select
                    name="source"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addLoanData && addLoanData.source && addLoanData.source
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>

                    <option value={"sa"}>{"SA"}</option>
                    <option value={"da"}>{"DA"}</option>
                  </Form.Select>
                  {customError.name == "source" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="type"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addLoanData && addLoanData.type && addLoanData.type._id
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterLawyerCategoryList &&
                      masterLawyerCategoryList.length > 0 &&
                      masterLawyerCategoryList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "type" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Name
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="name"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addLoanData && addLoanData.name && addLoanData.name._id
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {lawyersListByCatId &&
                      lawyersListByCatId.length > 0 &&
                      lawyersListByCatId.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "name" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Is Leading <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="isleading"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addLoanData &&
                      addLoanData.isleading &&
                      addLoanData.isleading
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>

                    <option value={true}>{"Yes"}</option>
                    <option value={false}>{"No"}</option>
                  </Form.Select>
                  {customError.name == "isleading" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    From date <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <DatePicker
                    // message={"Please enter  To date"}
                    name="from_date"
                    datePickerChange={onChangeDateHandler}
                    data={addLoanData && addLoanData.from_date}
                  /> */}

<>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addLoanData && addLoanData.from_date
                            ? moment(addLoanData.from_date).format("DD-MMM-YYYY")
                            : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"from_date"}
                          className="dateBtn"
                          type="date"
                          onChange={onChangeDateHandler}
                          placeholder=""
                          // max={moment().format("YYYY-MM-DD")}
                          min={
                            survivorDetails &&
                            survivorDetails.date_of_trafficking &&
                            moment(survivorDetails.date_of_trafficking).format("YYYY-MM-DD")
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
                    To date <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <DatePicker
                    required
                    message={"Please enter  To date "}
                    name="to_date"
                    datePickerChange={onChangeDateHandler}
                    data={addLoanData && addLoanData.to_date}
                  /> */}
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addLoanData && addLoanData.to_date
                            ? moment(addLoanData.to_date).format("DD-MMM-YYYY")
                            : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"to_date"}
                          className="dateBtn"
                          type="date"
                          onChange={onChangeDateHandler}
                          placeholder=""
                          // max={moment().format("YYYY-MM-DD")}
                          min={
                            addLoanData &&
                            addLoanData.from_date &&
                            moment(addLoanData.from_date).format("YYYY-MM-DD")
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
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Leading at <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="leading_at"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    value={
                      addLoanData &&
                      addLoanData.leading_at &&
                      addLoanData.leading_at
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value={"vc"}>VC</option>
                    <option value={"pc"}>PC</option>
                    <option value={"both"}>Both</option>
                  </Form.Select>
                  {customError.name == "leading_at" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                {addLoanData && addLoanData._id &&
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    updated notes <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    defaultValue={
                      addLoanData &&
                      addLoanData.updated_notes &&
                      addLoanData.updated_notes
                    }
                    name="updated_notes"
                    type="text"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                  />
                  {customError.name == "updated_notes" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
}
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => setModalNewloanLogShow(false)}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    disabled={resultLoad === true ? true : false}
                    onClick={addLoanFunc}
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

export default SurvivorsLawyers;
