import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import {
  getPoliceStationList,
  getBlockList,
  getStateList,
  getDistrictList,
} from "../../redux/action";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import Dropdown from "react-bootstrap/Dropdown";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";

import PoliceStationsDataTable from "./PoliceStationsDataTable";
import AlertComponent from "../../components/AlertComponent";

const PoliceStations = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [messagType, setMessagType] = useState("");

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const blockList = useSelector((state) => state.blockList);
  const stateList = useSelector((state) => state.stateList);
  const districtList = useSelector((state) => state.districtList);
  const policeStationList = useSelector((state) => state.policeStationList);
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");

  const [addBlockData, setAddBlockData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/police-station";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);

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

  useEffect(() => {
    dispatch(getPoliceStationList());
    dispatch(getStateList());
  }, [props]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [policeStationList]);

  useEffect(() => {
    if (addBlockData && addBlockData.stateId && addBlockData.stateId._id) {
      dispatch(getDistrictList(addBlockData.stateId._id));
    } else {
      if (addBlockData.stateId) {
        dispatch(getDistrictList(addBlockData.stateId));
      }
    }
  }, [addBlockData.stateId]);

  useEffect(() => {
    if (
      addBlockData &&
      addBlockData.stateId &&
      addBlockData.stateId._id &&
      addBlockData.districtId &&
      addBlockData.districtId._id
    ) {
      dispatch(
        getBlockList(addBlockData.stateId._id, addBlockData.districtId._id)
      );
    } else {
      if (addBlockData.stateId && addBlockData.districtId) {
        dispatch(getBlockList(addBlockData.stateId, addBlockData.districtId));
      }
    }
  }, [addBlockData.stateId, addBlockData.districtId]);

  ////// on cancel button function /////
  const onCancel = () => {
    setModalAddShow(false);
    setAddBlockData({});
    setFieldData({
      field: "",
      message: "",
    });
    // setSelectedData({})
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Police Station");
      setAlertFlag("alert");
    } else {
      setModalAddShow(true);
      setAddBlockData(selectedData);
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setAddBlockData({});
    setSelectedData({});
    setSelectedProduct5(null);
  };
  /////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Police Station");
      setAlertFlag("alert");
    } else {
      setShowAlert(true);
      setAlertMessage("");
      setAlertFlag("");
    }
  };
  const [deleteLoader, setDeleteLoader] = useState(false);

  const onDeleteFunction = () => {
    setDeleteLoader(true);
    axios
      .patch(api + "/delete/" + selectedData._id, axiosConfig)
      .then((response) => {
        setDeleteLoader(false);

        if (response.data && response.data.error === false) {
          const { data } = response;
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success");
          setSelectedData({});
          dispatch(getPoliceStationList());
          setShowAlert(false);
          setSelectedProduct5(null);

          setErorMessage("");
        } else {
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success");
        }
      })
      .catch((error) => {
        setDeleteLoader(false);

        ////console.log(error, "partner error");
      });
  };

  useEffect(() => {
    if (addBlockData && addBlockData.name) {
      setFieldData({ field: "name", message: "" });
    } else if (addBlockData && addBlockData.stateId) {
      setFieldData({ field: "stateId", message: "" });
    } else if (addBlockData && addBlockData.districtId) {
      setFieldData({ field: "districtId", message: "" });
    } else if (addBlockData && addBlockData.blockId) {
      setFieldData({ field: "blockId", message: "" });
    } else {
      setFieldData({ field: "", message: "" });
    }
  }, [addBlockData]);
  ///// add Organisation api cll function /////

  const addBlockFunc = (e) => {
    e.preventDefault();
    let pattern = /[0-9\s]{0,}[a-zA-Z]{2,}/g;

    if (addBlockData && !addBlockData.name) {
      setFieldData({ field: "name", message: "Please enter Name" });
    } else if (!pattern.test(addBlockData.name)) {
      setFieldData({ field: "name", message: "Please enter valid Name" });
    } else if (addBlockData && !addBlockData.stateId) {
      setFieldData({ field: "stateId", message: "Please select State Name" });
    } else if (addBlockData && !addBlockData.districtId) {
      setFieldData({
        field: "districtId",
        message: "Please select District Name",
      });
    } else if (addBlockData && !addBlockData.blockId) {
      setFieldData({
        field: "blockId",
        message: "Please select Block Name",
      });
    } else {
      setFieldData({
        field: "",
        message: "",
      });
      var body = addBlockData;

      if (addBlockData && addBlockData._id) {
        setLoader(true);
        axios
          .patch(api + "/update/" + addBlockData._id, body, axiosConfig)
          .then((response) => {
            //console.log(response);

            setLoader(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("success");
              dispatch(getPoliceStationList());
              setAddBlockData({});
              // setSelectedProduct5(null);

              // setSelectedData({});
              setActiveClass(false);
              setModalAddShow(false);
            } else {
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("error");
            }
          })
          .catch((error) => {
            setLoader(false);
            //console.log(error, "shg add error");
          });
      } else {
        setLoader(true);
        axios
          .post(api + "/create", body, axiosConfig)
          .then((response) => {
            //console.log(response);
            
            setLoader(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("success")
              dispatch(getPoliceStationList());
              setAddBlockData({});
              setModalAddShow(false);
            }else{
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("error")
            }
          })
          .catch((error) => {
            setLoader(false);
            //console.log(error, "shg add error");
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
    let headers = ["Id,PoliceStation,State,District,Block,CreatedAt"];

    // Convert users data to a csv
    let usersCsv = policeStationList.reduce((acc, user) => {
      const { _id, name, stateId, districtId, blockId, createdAt } = user;
      acc.push(
        [
          _id,
          name,
          stateId && stateId.name,
          districtId && districtId.name,
          blockId && blockId.name,
          moment(createdAt).format("DD-MMM-YYYY"),
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "policestationList.csv",
      fileType: "text/csv",
    });
  };

  ///////////// import CSV file  function ////
  const [file, setFile] = useState();
  const [importCSVdata, setImportCSVdata] = useState([]);
  const fileReader = new FileReader();
  const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
  const [sampleArr, setSampleArr] = useState([
    {
      name: "Andal",
      stateId: "62a9a7c3c05c6a1059f92eb0",
      districtId: "62a9e0bd700081c79aaf47e6",
      blockId: "62a9e52f700081c79aaf480d",
    },
  ]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };

  const downloadSampleCsv = (e) => {
    e.preventDefault();
    let headers = ["PoliceStation,State,District,Block"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { name, stateId, districtId, blockId } = user;
      acc.push([name, stateId, districtId, blockId].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "policestationList.csv",
      fileType: "text/csv",
    });
  };
  const handleOnChange = (e) => {
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      setFile(inputFile);
    }
  };

  const handleOnSubmit = (e) => {
    //console.log(e, file);
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        //console.log(event, "event");
        const csvOutput = event.target.result;
        //console.log(csvOutput, "csvOutput");
        const csv = Papa.parse(csvOutput, { header: true });
        const parsedData = csv?.data;
        //console.log(parsedData, "parsedData");
        setImportCSVdata(parsedData);
      };

      fileReader.readAsText(file);
    } else {
      alert("Please upload a .csv File");
    }
  };
  useEffect(() => {
    let obj = {};
    //console.log(importCSVdata, "importCSVdata");
    importCSVdata &&
      importCSVdata.length > 0 &&
      importCSVdata.map((item) => {
        return (
          (obj = {
            name: item && item.PoliceStation,
            stateId: item && item.State,
            districtId: item && item.District,
            blockId: item && item.Block,
          }),
          //console.log(obj, "obj"),
          axios
            .post(api + "/create", obj, axiosConfig)
            .then((response) => {
              //console.log(response);
              handleClick();
              setUpdateMessage(response && response.data.message);
              if (response.data && response.data.error === false) {
                const { data } = response;
                dispatch(getPoliceStationList());
                setImportCSVdata([]);
                setFile();
                setImportCsvOpenModel(false);
              }
            })
            .catch((error) => {
              //console.log(error, "shg add error");
            })
        );
      });
  }, [importCSVdata]);

  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("POLICE STATION DETAILS", 22, 10);
    const survivorColumns = [
      "POLICE STATION NAME",
      "STATE",
      "DISTRICT",
      "BLOCK",
      "CREATED AT",
    ];
    const name = "police-station-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    policeStationList?.forEach((item) => {
      const temp = [
        item.name,
        item.stateId && item.stateId.name,
        item.districtId && item.districtId.name,
        item.blockId && item.blockId.name,
        moment(item.createdAt).format("DD-MMM-YYYY"),
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
    doc.save(name);
  };

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
              <h2 className="page_title">Police Station List</h2>
            </div>
          </div>
          <div className="white_box_shadow_20 survivors_table_wrap vieweditdeleteMargin40 position-relative">
            <div className="vieweditdelete">
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="border"
                  className="shadow-0"
                  id="download-dropdown"
                >
                  Download List
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={downloadPdf}>
                    Download PDF
                  </Dropdown.Item>
                  <Dropdown.Item onClick={exportToCsv}>
                    Export CSV
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => onImportCsv()}>
                    Import CSV
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "view_btn add_btn" }}
                title="Add"
              >
                <span onClick={() => ongotoAdd()}>
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag={"a"}
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <span onClick={() => ongotoEdit()}>
                  <i className="fal fa-pencil"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "delete_btn" }}
                title="Delete"
              >
                <span onClick={() => onDeleteChangeFunc()}>
                  <i className="fal fa-trash-alt"></i>
                </span>
              </MDBTooltip>
            </div>
            <PoliceStationsDataTable
              policeStationList={
                policeStationList &&
                policeStationList.length > 0 &&
                policeStationList
              }
              selectedProduct5={selectedProduct5}
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />
            {/* <div className="table-responsive">
                            <table className="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th width="33.33%">Name </th>
                                        <th width="33.33%">createdAt</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {policeStationList && policeStationList.length > 0 ? policeStationList.map((item) => {
                                        return (
                                            <tr className={[item._id === selectedData._id && activeClass === true && 'current']}
                                                onClick={() => onSelectRow(item)}>
                                                <td>{item && item.name && item.name}</td>
                                                <td>{item && item.createdAt && moment(item.createdAt).format("DD/MM/YYYY")}</td>
                                            </tr>
                                        )
                                    })
                                        :
                                        <tr>
                                            <td className="text-center" colSpan={2}>
                                                <b>NO Data Found !!</b>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div> */}
          </div>
        </div>
        {importCsvOpenModel === true && (
          <Modal
            show={importCsvOpenModel}
            onHide={onImportCsv}
            size="md"
            aria-labelledby="reason-modal"
            className="addFormModal"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Select File
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="site_form_wraper">
                <CsvImportPage
                  downloadSampleCsv={downloadSampleCsv}
                  handleOnChange={handleOnChange}
                  handleOnSubmit={handleOnSubmit}
                />
              </div>
            </Modal.Body>
          </Modal>
        )}
        <Modal
          className="addFormModal"
          show={modalAddShow}
          onHide={setModalAddShow}
          size="lg"
          aria-labelledby="reason-modal"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {addBlockData && addBlockData._id
                ? "Update Police Station"
                : "Add Police Station"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form>
                <Row>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Name </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      defaultValue={
                        addBlockData && addBlockData.name && addBlockData.name
                      }
                      name="name"
                      onChange={(e) =>
                        setAddBlockData({
                          ...addBlockData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      onKeyPress={(e) => {
                        if (!/[a-z A-Z 0-9 _ \s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                    />{" "}
                    {fieldData.field == "name" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>State </Form.Label>
                    <Form.Select
                      name="stateId"
                      value={
                        addBlockData &&
                        addBlockData.stateId &&
                        addBlockData.stateId._id
                      }
                      onChange={(e) =>
                        setAddBlockData({
                          ...addBlockData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={"true"} value="">
                        Default select
                      </option>
                      {stateList &&
                        stateList.length > 0 &&
                        stateList.map((item) => {
                          return (
                            <option value={item._id}>
                              {item && item.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                    {fieldData.field == "stateId" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>District </Form.Label>
                    <Form.Select
                      name="districtId"
                      value={
                        addBlockData &&
                        addBlockData.districtId &&
                        addBlockData.districtId._id
                      }
                      onChange={(e) =>
                        setAddBlockData({
                          ...addBlockData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={"true"} value="">
                        Default select
                      </option>
                      {districtList &&
                        districtList.length > 0 &&
                        districtList.map((item) => {
                          return (
                            <option value={item._id}>
                              {item && item.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                    {fieldData.field == "districtId" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Block </Form.Label>
                    <Form.Select
                      name="blockId"
                      value={
                        addBlockData &&
                        addBlockData.blockId &&
                        addBlockData.blockId._id
                      }
                      onChange={(e) =>
                        setAddBlockData({
                          ...addBlockData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={"true"} value="">
                        Default select
                      </option>
                      {blockList &&
                        blockList.length > 0 &&
                        blockList.map((item) => {
                          return (
                            <option value={item._id}>
                              {item && item.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                    {fieldData.field == "blockId" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
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
                      Close
                    </MDBBtn>
                  </Form.Group>
                  <Form.Group as={Col} xs="auto">
                    <Button
                      type="submit"
                      disabled={loader == true ? true : false}
                      onClick={addBlockFunc}
                      className="submit_btn shadow-0"
                    >
                      {" "}
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
      </main>
      {showAlert === true && (
        <AlertComponent
          alertMessage={alertMessage}
          alertFlag={alertFlag}
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
          deleteLoader={deleteLoader}
        />
      )}
    </>
  );
};

export default PoliceStations;
