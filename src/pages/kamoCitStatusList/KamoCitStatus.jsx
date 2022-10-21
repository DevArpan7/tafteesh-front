import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { getCitStatusList, deleteCollective } from "../../redux/action";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import moment from "moment";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import AlertComponent from "../../components/AlertComponent";
import CitStatusDataTable from "./CitStatusDataTable";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
const KamoCitStatus = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const citStatusList = useSelector((state) => state.citStatusList);
  const [addCollectiveData, setAddCollectiveData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/cit-status";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [messagType, setMessagType] = useState("");

  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [alertFlag, setAlertFlag] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Status");
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
          dispatch(getCitStatusList());
          setShowAlert(false);
          setSelectedProduct5(null);
        } else {
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("error");
        }
      })
      .catch((error) => {
        setDeleteLoader(false);

        ////console.log(error, "partner error");
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
      setSelectedProduct5(item);
    } else {
      setSelectedData({});
      setSelectedProduct5(null);
      setActiveClass(false);
    }
  };
  useEffect(() => {
    dispatch(getCitStatusList());
  }, [props]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [citStatusList]);
  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
    setAddCollectiveData({});
    setFieldData({ field: "", message: "" });
    // setSelectedData({});
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Status");
      setAlertFlag("alert");
      // alert("Please select one Status");
    } else {
      setModalAddShow(true);
      setAddCollectiveData(selectedData);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setAddCollectiveData({});
    setSelectedData({});
    setSelectedProduct5(null);
  };

  useEffect(() => {
    if (addCollectiveData && addCollectiveData.name) {
      setFieldData({ field: "name", message: "" });
    } else {
    }
  }, [addCollectiveData]);

  ///// add shg api cll function /////

  const addCollectiveFunc = (e) => {
    e.preventDefault();
    if (addCollectiveData && !addCollectiveData.name) {
      setFieldData({
        field: "name",
        message: "Please enter Status",
      });
    } else {
      setFieldData({ field: "", message: "" });
      var body = addCollectiveData;

      if (addCollectiveData && addCollectiveData._id) {
        setLoader(true);
        axios
          .patch(api + "/update/" + addCollectiveData._id, body, axiosConfig)
          .then((response) => {
            //console.log(response);

            setLoader(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("success");
              dispatch(getCitStatusList());
              setModalAddShow(false);
              // setSelectedData({});
              setActiveClass(false);
              setAddCollectiveData({});
              // setSelectedProduct5(null)
            } else {
            }
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("error");
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
              setMessagType("success");
              dispatch(getCitStatusList());
              setModalAddShow(false);
              setAddCollectiveData({});
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
    let headers = ["Id,CIT Status, CreatedAt"];

    // Convert users data to a csv
    let usersCsv = citStatusList.reduce((acc, user) => {
      const { _id, name, createdAt } = user;
      acc.push([_id, name, moment(createdAt).format("DD-MMM-YYYY")].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "citStatusList.csv",
      fileType: "text/csv",
    });
  };

  ///////////// import CSV file  function ////
  const [file, setFile] = useState();
  const [importCSVdata, setImportCSVdata] = useState([]);
  const fileReader = new FileReader();
  const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
  const [sampleArr, setSampleArr] = useState([{ name: "Ongoing" }]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };
  const downloadSampleCsv = (e) => {
    let headers = ["CITStatus"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { name } = user;
      acc.push([name].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "citStatusList.csv",
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
          (obj = { name: item && item.CITStatus }),
          //console.log(obj, "obj"),
          axios
            .post(api + "/create", obj, axiosConfig)
            .then((response) => {
              //console.log(response);
              handleClick();
              setUpdateMessage(response && response.data.message);
              if (response.data && response.data.error === false) {
                const { data } = response;
                dispatch(getCitStatusList());
                setModalAddShow(false);
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
    doc.text("CIT STATUS DETAILS", 22, 10);
    const survivorColumns = ["CIT STATUS", "CREATED AT"];
    const name = "cit-status-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    citStatusList?.forEach((item) => {
      const temp = [item.name, moment(item.createdAt).format("DD-MMM-YYYY")];
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
          message={updateMessage}
          type={messagType}
        />
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">CIT Status List</h2>
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
            <CitStatusDataTable
              citStatusList={
                citStatusList && citStatusList.length > 0 && citStatusList
              }
              selectedProduct5={selectedProduct5}
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />
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
              {addCollectiveData && addCollectiveData._id
                ? "Update Status"
                : "Add Status"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form>
                <Row>
                  <Form.Group className="form-group" as={Col} md="12">
                    <Form.Label>Name </Form.Label>
                    <Form.Control
                      defaultValue={
                        addCollectiveData &&
                        addCollectiveData.name &&
                        addCollectiveData.name
                      }
                      type="text"
                      placeholder=""
                      name="name"
                      onChange={(e) =>
                        setAddCollectiveData({
                          ...addCollectiveData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z\s]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                    />
                    {fieldData.field == "name" && (
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
                      onClick={addCollectiveFunc}
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

export default KamoCitStatus;
