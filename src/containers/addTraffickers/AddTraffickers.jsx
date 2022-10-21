import React, { useEffect, useState, useRef } from "react";
import { Form, Row, Col } from "react-bootstrap";
// import { KamoTopbar } from "../../components";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { findAncestor, goToTraffickerView } from "../../utils/helper";
import { MultiSelect } from "react-multi-select-component";
import "./addtraffickers.css";
import { Topbar, SurvivorTopCard } from "../../components";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBTooltip,
  MDBBtn,
} from "mdb-react-ui-kit";
import {
  // getSurvivorDetails,
  getSurvivorTraffickerList,
  getModulesChangeLog,
} from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NotificationPage from "../../components/NotificationPage";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import TraffickersDataTableList from "./TraffickersDataTableList";
import AlertComponent from "../../components/AlertComponent";
// import { FormatColorReset } from '@mui/icons-material';
import queryString from "query-string";

const AddTraffickers = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [userId, setUserId] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [addTraffickerData, setAddTraffickerData] = useState({});
  const survivorTraffickerList = useSelector(
    (state) => state.survivorTraffickerList
  );
  const mastertraffickerData = useSelector((state) => state.mastertraffickerData);

  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const loguserId = localStorage.getItem("userId");
  const formRef = useRef(null);
  const survivorDetails = useSelector((state) => state.survivorDetails);

  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const dispatch = useDispatch();
  const [messagType, setMessagType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
  const [alertFlag, setAlertFlag] = useState("");
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const currentModule = localStorage.getItem("currentModule");
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));
  const [multipleTraffArr, setMultipleTraffArr] = useState([]);
  const [selected, setSelected] = useState([]);
  const [oneTraffickerDetailsArr, setOneTraffickerDetailsArr] = useState([]);
  const [addOneTraffickerLocation, setAddOneTraffickerLocation] = useState({});
  const [pageLoader, setPageLoader] = useState(true);
  const [deleteLoader, setDeleteLoader] = useState(false);

  let url = props.location.search;
  let getId = queryString.parse(url, { parseNumbers: true });

  const [saArray, setSaArray] = useState([]);
  const [daArray, setDaArray] = useState([]);
  const [transitArray, setTransitArray] = useState([]);
  const [customError, setCustomError] = useState({ name: "", message: "" });

  useEffect(() => {
    setTimeout(() => {
      setPageLoader(false);
    }, 1000);
  }, [survivorTraffickerList]);

  useEffect(() => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "trafficker" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));
  }, [props]);

  useEffect(() => {
    dispatch(getSurvivorTraffickerList(getId && getId.survivorId));
  }, [props]);

  const changeLogFunc = () => {
    let type = "trafficker";
    dispatch(getModulesChangeLog(type,loguserId,getId.survivorId))
    props.history.push("/change-log");
  };


  const removeSelection = () => {
    setActiveClass(false);
    setUserId("");
    setAddTraffickerData({});
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // setModalAddShow(false);
  };

  const onCancel = () => {
    setModalAddShow(false);
    setSelectedProduct5(null);
    setSelected([]);
    setOneTraffickerDetailsArr([]);
    setAddOneTraffickerLocation({});
  };

  /**
   * make array for multple select trafficker
   */

  useEffect(() => {
    const options = [];
    let obj = { label: "", value: "" };
    mastertraffickerData &&
    mastertraffickerData.length > 0 &&
    mastertraffickerData.map((item) => {
        return (
          (obj = {
            label: item.trafficker_name + " - " + item.residential_address,
            value: item._id,
          }),
          options.push(obj),
          // //console.log(options, obj, "options, obj"),
          setMultipleTraffArr(options)
        );
      });
  }, [mastertraffickerData]);

  /**
   * make trafficker details array /////
   */
  useEffect(() => {
    // //console.log(selected, "selectedselectedselected");
    let arr = [];
    selected &&
      selected.length > 0 &&
      selected.map((data) => {
        return arr.push(data.value);
        // , //console.log(arr, "arr");
      });
    setOneTraffickerDetailsArr(arr);
  }, [selected]);

  useEffect(() => {
    let saarrData = [];
    let daarrData = [];
    let transitarrData = [];

    survivorTraffickerList &&
      survivorTraffickerList.trafficker &&
      survivorTraffickerList.trafficker.length > 0 &&
      survivorTraffickerList.trafficker.filter((item) => {
        return (
          item &&
            item.location == "sa" &&
            item.trafficker_details &&
            item.trafficker_details.length > 0 &&
            item.trafficker_details.map((trans) => {
              return saarrData.push(trans._id);
            }),
          item &&
            item.location == "da" &&
            item.trafficker_details &&
            item.trafficker_details.length > 0 &&
            item.trafficker_details.map((trans) => {
              return daarrData.push(trans._id);
            }),
          item &&
            item.location == "transit" &&
            item.trafficker_details &&
            item.trafficker_details.length > 0 &&
            item.trafficker_details.map((trans) => {
              return transitarrData.push(trans._id);
            })
        );
      });

    setSaArray(saarrData);
    setDaArray(daarrData);
    setTransitArray(transitarrData);
    // traffickerDetails();
  }, [survivorTraffickerList]);

  const onDeleteSection = (e, loc, value, index) => {
    // //console.log(sectionArr, value, "vvvvvvvvvv");
    e.preventDefault();
    var saarray1 = [...saArray]; // make a separate copy of the array
    var daarray2 = [...daArray]; // make a separate copy of the array
    var transitarray3 = [...transitArray]; // make a separate copy of the array
    if (loc == "sa") {
      saarray1.splice(index, 1);
      // //console.log(saarray1);
      setSaArray(saarray1);
      traffickerDelete(loc, saarray1);
    }
    if (loc == "da") {
      daarray2.splice(index, 1);
      // //console.log(daarray2);
      setDaArray(daarray2);
      traffickerDelete(loc, daarray2);
    }
    if (loc == "transit") {
      transitarray3.splice(index, 1);
      // //console.log(transitarray3);
      setTransitArray(transitarray3);
      traffickerDelete(loc, transitarray3);
    }
  };

  

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  /* api call for trafficker delete */

  const traffickerDelete = (loc, array) => {
    let body = {
      location: loc,
      traffickers: array,
    };
    // //console.log(saArray,daArray,transitArray,"transitArray")
    // //console.log(body,"deletebody")
    setDeleteLoader(true);
    axios
      .patch(
        api +
          "/survival-trafficker/delete-trafficker/" +
          survivorTraffickerList._id,
        body,
        axiosConfig
      )
      .then((response) => {
        setDeleteLoader(false);
        // //console.log(response, "daaaaa");
        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("success");
        if (response.data && response.data.error === false) {
          const { data } = response;
          dispatch(getSurvivorTraffickerList(getId && getId.survivorId));
          setTransitArray([]);
          setDaArray([]);
          setSaArray([]);
        }
      })
      .catch((error) => {
        //console.log(error, "user details error");
        setDeleteLoader(false);
      });
  };

  const onAddoneTraffObjFunc = (e) => {
    // //console.log(e);
    e.preventDefault();
    addUserFunc(e);
    formRef.current.reset();
  };

  useEffect(() => {
    if (oneTraffickerDetailsArr && oneTraffickerDetailsArr.length > 0) {
      setCustomError({
        name: "traffickers",
        message: "",
      });
    }
  }, [oneTraffickerDetailsArr]);
  useEffect(() => {
    if (addOneTraffickerLocation && addOneTraffickerLocation.location) {
      setCustomError({
        name: "location",
        message: "",
      });
    }
  }, [addOneTraffickerLocation]);

  const addUserFunc = (e) => {
    e.preventDefault();
    if (oneTraffickerDetailsArr && oneTraffickerDetailsArr.length == 0) {
      setCustomError({
        name: "traffickers",
        message: "Please select Trafficker",
      });
    } else if (addOneTraffickerLocation && !addOneTraffickerLocation.location) {
      setCustomError({
        name: "location",
        message: "Please select Location",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
      var body = {
        ...addOneTraffickerLocation,
        traffickers: oneTraffickerDetailsArr,
        survivor: getId.survivorId,
        user: loguserId,
      };
      
      // //console.log(body, "objectData");
      if (userId) {
        setLoader(true);
        axios
          .patch(
            api + "/survival-trafficker/update/" + userId,
            body,
            axiosConfig
          )
          .then((res) => {
            // //console.log(res);
            setLoader(false);
            handleClick();
            setUpdateMessage(res && res.data.message);
            setMessagType("success");
            if (res && res.data && res.data.error == false) {
              const { data } = res;

              // //console.log(data, res);
              formRef.current.reset();

              dispatch(getSurvivorTraffickerList(getId && getId.survivorId));
              setSelected([]);
              setOneTraffickerDetailsArr([]);
              setAddOneTraffickerLocation({});
              // setModalAddShow(false);
            } else {
              handleClick();
              setUpdateMessage(res && res.data.data.message);
              setMessagType("error");
            }
          })
          .catch((error) => {
            setLoader(false);
            handleClick();
            setUpdateMessage(error && error.message);
            setMessagType("error");
            //console.log(error);
          });
      } else {
        setLoader(true);
        axios
          .post(api + "/survival-trafficker/create", body, axiosConfig)
          .then((res) => {
            // //console.log(res);
            handleClick();
            setMessagType("success");
            setUpdateMessage(res && res.data.message);
            setLoader(false);
            formRef.current.reset();

            if (res && res.data && res.data.error == false) {
              const { data } = res;
              // //console.log(data, res);
              dispatch(getSurvivorTraffickerList(getId && getId.survivorId));
              setSelected([]);
              setOneTraffickerDetailsArr([]);
              setAddOneTraffickerLocation({});
              // setModalAddShow(false);
            } else {
              handleClick();
              setMessagType("error");

              setUpdateMessage(res && res.data.message);
            }
          })
          .catch((error) => {
            setLoader(false);
            handleClick();
            setUpdateMessage(error && error.message);
            setMessagType("error");
            //console.log(error);
          });
      }
    }
  };

  //////////////// for csv function ////

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
      "Trafficker Id,Trafficker Name,Residential Address,Location",
    ];

    // Convert users data to a csv
    let usersCsv = survivorTraffickerList.reduce((acc, user) => {
      const { trafficker_id, trafficker_name, residential_address, location } =
        user;
      acc.push(
        [trafficker_id, trafficker_name, residential_address, location].join(
          ","
        )
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "trafficker.csv",
      fileType: "text/csv",
    });
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
              <h2 className="page_title">Traffickers List</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Traffickers</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topcartbar white_box_shadow">
            <SurvivorTopCard survivorDetails={survivorDetails} />
          </div>
          <div className="white_box_shadow_20 survivors_table_wrap vieweditdeleteMargin position-relative">
            <div className="vieweditdelete">
              <Dropdown align="end">
                {/* <Dropdown.Toggle variant="border" className="shadow-0" id="download-dropdown">
                                    Download List
                                </Dropdown.Toggle> */}

                <Dropdown.Menu>
                  <Dropdown.Item onClick={exportToCsv}>CSV</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown className="me-1">
                <Dropdown.Toggle variant="border" className="shadow-0">
                  Action
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {/* <Dropdown.Item>Download PDF</Dropdown.Item>
                  <Dropdown.Item>Export To CSV</Dropdown.Item> */}
                  <Dropdown.Item onClick={() => changeLogFunc()}>Change Log</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {currentModule && JSON.parse(currentModule).can_edit == true && (
                <MDBTooltip
                  tag="button"
                  wrapperProps={{ className: "view_btn add_btn" }}
                  title="Add"
                >
                  <span
                    onClick={() => {
                      setModalAddShow(true);
                      removeSelection();
                    }}
                  >
                    <i className="fal fa-plus-circle"></i>
                  </span>
                </MDBTooltip>
              )}
            </div>
            {pageLoader === true ? (
              <div className="text-center">
                <div class="spinner-border smallSpinnerWidth text-info text-center"></div>
              </div>
            ) : (
              <div className="">
                <div className="survivors_table_wrap trafficker_add_table position-relative mb-5">
                  <h4 class="mb-3 small_heading">Trafficker at source</h4>
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="40%">Name</th>
                        <th width="40%">Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {survivorTraffickerList &&
                      survivorTraffickerList.trafficker &&
                      survivorTraffickerList.trafficker.length > 0 ? (
                        survivorTraffickerList.trafficker.map((item) => {

                          return (
                            item.location == "sa" &&
                            item.trafficker_details &&
                            item.trafficker_details.length > 0 &&
                            item.trafficker_details.map((traff, index) => {
                              return (
                                <tr>
                                  <td>{traff && traff.trafficker_name}</td>
                                  <td> {traff && traff.residential_address}</td>
                                  <td className="text-end">
                                    <button
                                      onClick={(e) =>
                                        onDeleteSection(
                                          e,
                                          "sa",
                                          traff._id,
                                          index
                                        )
                                      }
                                      className="traffickerdelete_btn"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="feather feather-trash-2"
                                      >
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line
                                          x1="10"
                                          y1="11"
                                          x2="10"
                                          y2="17"
                                        ></line>
                                        <line
                                          x1="14"
                                          y1="11"
                                          x2="14"
                                          y2="17"
                                        ></line>
                                      </svg>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          );
                        })
                      ) : (
                        <td colSpan={3}>No data found !!</td>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="survivors_table_wrap trafficker_add_table position-relative mb-5">
                  <h4 class="mb-3 small_heading">Trafficker at Destination</h4>
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="40%">Name</th>
                        <th width="40%">Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {survivorTraffickerList &&
                      survivorTraffickerList.trafficker &&
                      survivorTraffickerList.trafficker.length > 0 ? (
                        survivorTraffickerList.trafficker.map((item) => {
                          return (
                            item &&
                            item.location == "da" &&
                            item.trafficker_details &&
                            item.trafficker_details.length > 0 &&
                            item.trafficker_details.map((traffDa, index) => {
                              return (
                                <tr>
                                  <td>{traffDa && traffDa.trafficker_name}</td>
                                  <td>
                                    {traffDa && traffDa.residential_address}
                                  </td>
                                  <td className="text-end">
                                    <button
                                      onClick={(e) =>
                                        onDeleteSection(
                                          e,
                                          "da",
                                          traffDa._id,
                                          index
                                        )
                                      }
                                      className="traffickerdelete_btn"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="feather feather-trash-2"
                                      >
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line
                                          x1="10"
                                          y1="11"
                                          x2="10"
                                          y2="17"
                                        ></line>
                                        <line
                                          x1="14"
                                          y1="11"
                                          x2="14"
                                          y2="17"
                                        ></line>
                                      </svg>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          );
                        })
                      ) : (
                        <td colSpan={3}>No data found !!</td>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="survivors_table_wrap trafficker_add_table position-relative">
                  <h4 class="mb-3 small_heading">Trafficker at Transit</h4>
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="40%">Name</th>
                        <th width="40%">Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {survivorTraffickerList &&
                      survivorTraffickerList.trafficker &&
                      survivorTraffickerList.trafficker.length > 0 ? (
                        survivorTraffickerList.trafficker.map((item) => {
                          // //console.log(item, "item");

                          return (
                            item &&
                            item.location == "transit" &&
                            item.trafficker_details &&
                            item.trafficker_details.length > 0 &&
                            item.trafficker_details.map((trans, index) => {
                              return (
                                <tr>
                                  <td>{trans && trans.trafficker_name}</td>
                                  <td>{trans && trans.residential_address}</td>
                                  <td className="text-end">
                                    <button
                                      onClick={(e) =>
                                        onDeleteSection(
                                          e,
                                          "transit",
                                          trans._id,
                                          index
                                        )
                                      }
                                      className="traffickerdelete_btn"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="feather feather-trash-2"
                                      >
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line
                                          x1="10"
                                          y1="11"
                                          x2="10"
                                          y2="17"
                                        ></line>
                                        <line
                                          x1="14"
                                          y1="11"
                                          x2="14"
                                          y2="17"
                                        ></line>
                                      </svg>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          );
                        })
                      ) : (
                        <td colSpan={3}>No data found !!</td>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <Modal
          className="addFormModal"
          show={modalAddShow}
          onHide={setModalAddShow}
          size="lg"
          aria-labelledby="reason-modal"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {addTraffickerData && addTraffickerData._id
                ? "Update Traffickers"
                : "Add Traffickers"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form ref={formRef}>
                <Row>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Name of the trafficker</Form.Label>
                    <MultiSelect
                      options={multipleTraffArr}
                      value={selected}
                      hasSelectAll={false}
                      disableSearch={true}
                      onChange={setSelected}
                      labelledBy={"Select"}
                      className={"survivorMultiselect-box multiselectbox_span"}
                      overrideStrings={{
                        selectSomeItems: "Select columns to view",
                        allItemsAreSelected: "All Items are Selected",
                        selectAll: "Select All",
                        search: "Search",
                      }}
                    />
                    {customError.name == "traffickers" && (
                      <small className="mt-4 mb-2 text-danger">
                        {customError && customError.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Select Location</Form.Label>
                    <Form.Select
                      name="location"
                      onChange={(e) => {
                        setAddOneTraffickerLocation({
                          [e.target.name]: e.target.value,
                        });
                      }}
                    >
                      <option hidden={true} value="">
                        Select Option
                      </option>
                      <option value="sa">SA</option>
                      <option value="da">DA</option>
                      <option value="transit">Transit</option>
                    </Form.Select>
                    {customError.name == "location" && (
                      <small className="mt-4 mb-2 text-danger">
                        {customError && customError.message}
                      </small>
                    )}
                  </Form.Group>
                </Row>

                <Row className="justify-content-end mb-4">
                  <Form.Group as={Col} md="auto" className="mb-3">
                    <Button
                      type="submit"
                      disabled={loader == true ? true : false}
                      className="addbtn addbtn_blue shadow-0"
                      onClick={(e) => onAddoneTraffObjFunc(e)}
                    >
                      {loader && loader === true ? (
                        <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                      ) : (
                        "Add Trafficker"
                      )}
                    </Button>
                  </Form.Group>
                </Row>
                {survivorTraffickerList &&
                  survivorTraffickerList.trafficker &&
                  survivorTraffickerList.trafficker.length > 0 &&
                  survivorTraffickerList.trafficker.map((item) => {
                    // //console.log(item, "item");

                    return (
                      item.location == "sa" &&
                      item.trafficker_details &&
                      item.trafficker_details.length > 0 && (
                        <div className="survivors_table_wrap trafficker_add_table position-relative mb-4">
                          <h4 class="mb-3 small_heading">
                            Trafficker at source
                          </h4>
                          <table className="table table-borderless mb-0">
                            <thead>
                              <tr>
                                <th width="40%">Name</th>
                                <th width="40%">Address</th>
                                <th width="20%"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {survivorTraffickerList &&
                              survivorTraffickerList.trafficker &&
                              survivorTraffickerList.trafficker.length > 0 ? (
                                survivorTraffickerList.trafficker.map(
                                  (item) => {
                                    // //console.log(item, "item");

                                    return (
                                      item.location == "sa" &&
                                      item.trafficker_details &&
                                      item.trafficker_details.length > 0 &&
                                      item.trafficker_details.map(
                                        (traff, index) => {
                                        
                                          return (
                                            <tr>
                                              <td>
                                                {traff && traff.trafficker_name}
                                              </td>
                                              <td>
                                                {" "}
                                                {traff &&
                                                  traff.residential_address}
                                              </td>
                                              <td className="text-end">
                                                <button
                                                  onClick={(e) =>
                                                    onDeleteSection(
                                                      e,
                                                      "sa",
                                                      traff._id,
                                                      index
                                                    )
                                                  }
                                                  className="traffickerdelete_btn"
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    class="feather feather-trash-2"
                                                  >
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line
                                                      x1="10"
                                                      y1="11"
                                                      x2="10"
                                                      y2="17"
                                                    ></line>
                                                    <line
                                                      x1="14"
                                                      y1="11"
                                                      x2="14"
                                                      y2="17"
                                                    ></line>
                                                  </svg>
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )
                                    );
                                  }
                                )
                              ) : (
                                <td colSpan={3}>No data found !!</td>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )
                    );
                  })}
                {survivorTraffickerList &&
                  survivorTraffickerList.trafficker &&
                  survivorTraffickerList.trafficker.length > 0 &&
                  survivorTraffickerList.trafficker.map((item) => {
                    return (
                      item &&
                      item.location == "da" &&
                      item.trafficker_details &&
                      item.trafficker_details.length > 0 && (
                        <div className="survivors_table_wrap trafficker_add_table position-relative mb-4">
                          <h4 class="mb-3 small_heading">
                            Trafficker at Destination
                          </h4>
                          <table className="table table-borderless mb-0">
                            <thead>
                              <tr>
                                <th width="40%">Name</th>
                                <th width="40%">Address</th>
                                <th width="20%"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {survivorTraffickerList &&
                              survivorTraffickerList.trafficker &&
                              survivorTraffickerList.trafficker.length > 0 ? (
                                survivorTraffickerList.trafficker.map(
                                  (item) => {
                                    return (
                                      item &&
                                      item.location == "da" &&
                                      item.trafficker_details &&
                                      item.trafficker_details.length > 0 &&
                                      item.trafficker_details.map(
                                        (traffDa, index) => {
                                          return (
                                            <tr>
                                              <td>
                                                {traffDa &&
                                                  traffDa.trafficker_name}
                                              </td>
                                              <td>
                                                {traffDa &&
                                                  traffDa.residential_address}
                                              </td>
                                              <td className="text-end">
                                                <button
                                                  onClick={(e) =>
                                                    onDeleteSection(
                                                      e,
                                                      "da",
                                                      traffDa._id,
                                                      index
                                                    )
                                                  }
                                                  className="traffickerdelete_btn"
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    class="feather feather-trash-2"
                                                  >
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line
                                                      x1="10"
                                                      y1="11"
                                                      x2="10"
                                                      y2="17"
                                                    ></line>
                                                    <line
                                                      x1="14"
                                                      y1="11"
                                                      x2="14"
                                                      y2="17"
                                                    ></line>
                                                  </svg>
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )
                                    );
                                  }
                                )
                              ) : (
                                <td colSpan={3}>No data found !!</td>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )
                    );
                  })}
                {survivorTraffickerList &&
                  survivorTraffickerList.trafficker &&
                  survivorTraffickerList.trafficker.length > 0 &&
                  survivorTraffickerList.trafficker.map((item) => {
                    // //console.log(item, "item");

                    return (
                      item &&
                      item.location == "transit" &&
                      item.trafficker_details &&
                      item.trafficker_details.length > 0 && (
                        <div className="survivors_table_wrap trafficker_add_table position-relative mb-4">
                          <h4 class="mb-3 small_heading">
                            Trafficker at Transit
                          </h4>
                          <table className="table table-borderless mb-0">
                            <thead>
                              <tr>
                                <th width="40%">Name</th>
                                <th width="40%">Address</th>
                                <th width="20%"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {survivorTraffickerList &&
                              survivorTraffickerList.trafficker &&
                              survivorTraffickerList.trafficker.length > 0 ? (
                                survivorTraffickerList.trafficker.map(
                                  (item) => {
                                    // //console.log(item, "item");

                                    return (
                                      item &&
                                      item.location == "transit" &&
                                      item.trafficker_details &&
                                      item.trafficker_details.length > 0 &&
                                      item.trafficker_details.map(
                                        (trans, index) => {
                                          return (
                                            <tr>
                                              <td>
                                                {trans && trans.trafficker_name}
                                              </td>
                                              <td>
                                                {trans &&
                                                  trans.residential_address}
                                              </td>
                                              <td className="text-end">
                                                <button
                                                  onClick={(e) =>
                                                    onDeleteSection(
                                                      e,
                                                      "transit",
                                                      trans._id,
                                                      index
                                                    )
                                                  }
                                                  className="traffickerdelete_btn"
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    class="feather feather-trash-2"
                                                  >
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line
                                                      x1="10"
                                                      y1="11"
                                                      x2="10"
                                                      y2="17"
                                                    ></line>
                                                    <line
                                                      x1="14"
                                                      y1="11"
                                                      x2="14"
                                                      y2="17"
                                                    ></line>
                                                  </svg>
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )
                                    );
                                  }
                                )
                              ) : (
                                <td colSpan={3}>No data found !!</td>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )
                    );
                  })}

                <Row className="justify-content-between">
                  <Form.Group as={Col} xs="auto">
                    <MDBBtn
                      type="button"
                      className="shadow-0 cancle_btn"
                      color="danger"
                      onClick={() => onCancel()}
                    >
                      Close
                    </MDBBtn>
                  </Form.Group>
                  {/* <Form.Group as={Col} xs="auto">
                    <Button
                      type="submit"
                      // disabled={resultLoad}
                      disabled={loader == true ? true : false}
                      onClick={(e) => addUserFunc(e)}
                      className="submit_btn shadow-0"
                    >
                      {loader && loader === true ? (
                        <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </Form.Group> */}
                </Row>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
      </main>
      {showAlert === true && (
        <AlertComponent
          alertMessage={alertMessage}
          showAlert={showAlert}
          alertFlag={alertFlag}
          handleCloseAlert={handleCloseAlert}
          deleteLoader={deleteLoader}
          // onDeleteFunction={onDeleteFunction}
        />
      )}
    </>
  );
};

export default AddTraffickers;

{
  /* <Modal className="addFormModal" show={modalAddShow} onHide={setModalAddShow} size="lg" aria-labelledby="reason-modal" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Traffickers
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="site_form_wraper">
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <NotificationPage
                                    handleClose={handleClose}
                                    open={open}
                                    message={updateMessage}
                                />
                                <Row>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Name <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                            defaultValue={addTraffickerData && addTraffickerData.trafficker_name}
                                            name='trafficker_name'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            type="text"
                                            placeholder=""
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Age <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                            defaultValue={addTraffickerData && addTraffickerData.age}
                                            name='age'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            type="number"
                                            placeholder=""
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="form-group">
                                        <Form.Label>Gender <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Select
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            name='gender'
                                            value={addTraffickerData && addTraffickerData.gender}
                                        >
                                            <option hidden="true">Open this select menu</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="transgender">Transgender</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="form-group">
                                        <Form.Label>Photo </Form.Label>
                                        <Form.Control
                                            onChange={handleFileInput}
                                            type="file"
                                            name="file"
                                            size="lg"
                                        />

                                        {pictureArr && pictureArr.map((pic) => {
                                            return (
                                                <div style={{fontSize: "12px"}}> 
                                                    {pic && pic.split('/').pop()}

                                                </div>
                                            )
                                        })}


                                    </Form.Group>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>ID Mark </Form.Label>
                                        <Form.Control
                                            defaultValue={addTraffickerData && addTraffickerData.identification_mark}
                                            name='identification_mark'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            type="text"
                                            placeholder=""
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Is Trafficker ?</Form.Label>
                                        <Form.Select name="is_trafficker"
                                            value={addTraffickerData && addTraffickerData.is_trafficker && addTraffickerData.is_trafficker}
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })}>
                                            <option hidden={true}>Default select</option>
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                        </Form.Select>
                                    </Form.Group>
                                    {/* <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Alias </Form.Label>
                                        <Form.Control
                                            defaultValue={addTraffickerData && addTraffickerData.alias}
                                            name='alias'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            type="text"
                                            placeholder=""
                                        />
                                    </Form.Group> ---commentend

                                    <Form.Group as={Col} md="12" className="form-group">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows="4"
                                            defaultValue={addTraffickerData && addTraffickerData.residential_address}
                                            name='residential_address'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            placeholder="Enter Address"
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="justify-content-between">
                                    <Form.Group as={Col} md="auto">
                                        <MDBBtn type='button' className="shadow-0 cancle_btn" color='danger'
                                            onClick={() => onCancel()}>Close</MDBBtn>
                                    </Form.Group>
                                    <Form.Group as={Col} md="auto">
                                        <Button type="submit"
                                            disabled={addTraffickerData && !addTraffickerData.trafficker_name ? true :
                                                !addTraffickerData.gender ? true : !addTraffickerData.age ? true :
                                                    false}
                                            className="submit_btn shadow-0" onClick={addUserFunc} >Submit</Button>
                                    </Form.Group>
                                </Row>
                            </Form>
                        </div>
                    </Modal.Body>
                </Modal> */
}
