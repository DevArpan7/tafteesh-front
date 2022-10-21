import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import {
  getCitDimensionList,
  // deleteCitDimension,
  getCITVersionList,
  getCitDimensionAllList,
} from "../../redux/action";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import moment from "moment";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import AlertComponent from "../../components/AlertComponent";
import CitDimensionDataTable from "./CitDimensionDataTable";

const CitDimension = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const citDimensionList = useSelector((state) => state.citDimensionList);
  const [addShgData, setAddShgData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/cit-dimension";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const citVersionList = useSelector((state) => state.citVersionList);
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [citName, setCitName] = useState("");
  const [citVersion, setCitVersion] = useState("");
  const [loader, setLoader] = useState(false);
  const[alertMessage,setAlertMessage] = useState('')
  const[alertFlag,setAlertFlag] = useState('')
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [messagType, setMessagType] = useState("");

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one CIT Dimension");
      setAlertFlag('alert')
    } else {
      setAlertMessage("");
      setAlertFlag('')
      setShowAlert(true);
    }
  };

  // const onDeleteFunction = () => {
  //   dispatch(deleteCitDimension(selectedData._id));
  //   setShowAlert(false);
  // };


  const [deleteLoader, setDeleteLoader] = useState(false);

  const onDeleteFunction = () => {
    let config = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    //console.log(config,"config")
    setDeleteLoader(true)
    axios
      .patch(api + "/delete/" + selectedData._id, config)
      .then((response) => {
       
        setDeleteLoader(false)

        if (response.data && response.data.error === false) {
          const { data } = response;
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success")
          setSelectedData({});
          dispatch(getCitDimensionAllList());
          setShowAlert(false);
        }else{
        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("error")
        }
      })
      .catch((error) => {
      setDeleteLoader(false)

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
    setSelectedProduct5(item)
    }else{
      setSelectedData({});
      setActiveClass(false);
      setSelectedProduct5(null)
  
    }
  };
  useEffect(() => {
    dispatch(getCITVersionList());
    // dispatch(getCitDimensionList());
    dispatch(getCitDimensionAllList());
  }, [props]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [citDimensionList]);
  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one CIT Dimension");
      setAlertFlag('alert')
    } else {
      setModalAddShow(true);
      setAlertMessage('')
      setAlertFlag('')
      setAddShgData(selectedData);
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setAddShgData({});
    setSelectedData({});
    setSelectedProduct5(null)
  };

  useEffect(() => {
    //console.log(fieldData, "fieldData");
    if (addShgData && addShgData.name) {
      setCitName(false);
      setFieldData({ field: "name", message: "" });
    } else if (addShgData && addShgData.cit_version) {
      setCitVersion(false);
      setFieldData({ field: "cit_version", message: "" });
    } else {
    }
    setFieldData({ field: "", message: "" });
  }, [addShgData]);
  ///// add shg api cll function /////
  const onHandleChange = (e) => {
    setAddShgData({
      ...addShgData,
      [e.target.name]: e.target.value.trim(),
    });
  };
  const addShgFunc = (e) => {
    e.preventDefault();
    let pattern = /[0-9 - / _ ? \s]{0,}[a-zA-Z]{2,}/g

    if (addShgData && !addShgData.name) {
      setFieldData({
        field: "name",
        message: "Please enter Name",
      });
      setCitName(true);
    }else if(!pattern.test(addShgData.name)){
      setFieldData({
        field: "name",
        message: "Please enter valid Name",
      });
      setCitName(true);
    }
     else if (addShgData && !addShgData.cit_version) {
      setFieldData({
        field: "cit_version",
        message: "Please select CIT Version",
      });
      setCitVersion(true);
      setCitName(false);
    } else {
      setFieldData({ field: "", message: "" });
      setCitName(false);
      setCitVersion(false);

      var body = addShgData;

      if (addShgData && addShgData._id) {
        setLoader(true);
        axios
          .patch(api + "/update/" + addShgData._id, body, axiosConfig)
          .then((response) => {
            //console.log(response);
          
            setLoader(false);

            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("success")
              // dispatch(getCITVersionList());
              dispatch(getCitDimensionAllList());
              setModalAddShow(false);
              // setAddShgData({});

              // setSelectedData({});
              setActiveClass(false);
            }else{
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("error")
            }
          })
          .catch((error) => {
            setLoader(false);

            //console.log(error, "cit add error");
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
              // dispatch(getCITVersionList());
              dispatch(getCitDimensionAllList());
              setModalAddShow(false);
              // setAddShgData({});
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
    let headers = ["Id,CITDimension,CIT Version,CreatedAt"];

    // Convert users data to a csv
    let usersCsv = citDimensionList.reduce((acc, user) => {
      const { _id, name,cit_version, createdAt } = user;
      acc.push([_id,name,cit_version && cit_version.name, moment(createdAt).format("DD-MMM-YYYY")].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "citDimension.csv",
      fileType: "text/csv",
    });
  };

  ///////////// import CSV file  function ////
  const [file, setFile] = useState();
  const [importCSVdata, setImportCSVdata] = useState([]);
  const fileReader = new FileReader();
  const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
  const [sampleArr, setSampleArr] = useState([{ name: "Mental Issue",cit_version:"62cd0a6bb72a013c9eef50bd" }]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };

  const downloadSampleCsv = (e) => {
    let headers = ["CITDimension,CITVersion"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { name,cit_version } = user;
      acc.push([name,cit_version].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "citDimension.csv",
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
      setShowAlert(true);
      setAlertMessage("Please upload a .csv File");
      setAlertFlag('alert')
    }
  };
  useEffect(() => {
    let obj = {};
    //console.log(importCSVdata, "importCSVdata");
    importCSVdata &&
      importCSVdata.length > 0 &&
      importCSVdata.map((item) => {
        return (
          (obj = { name: item && item.CITDimension,cit_version: item&& item.CITVersion }),
          //console.log(obj, "obj"),
          axios
            .post(api + "/create", obj, axiosConfig)
            .then((response) => {
              //console.log(response);
              handleClick();
              setUpdateMessage(response && response.data.message);
              if (response.data && response.data.error === false) {
                const { data } = response;
                dispatch(getCITVersionList());
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
    doc.text("CIT DIMENSION DETAILS", 22, 10);
    const survivorColumns = ["CIT DIMENSION","CIT VERSION", "CREATED AT"];
    const name = "cit-dimension-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    citDimensionList?.forEach((item) => {
      const temp = [item.name, item.cit_version && item.cit_version.name, moment(item.createdAt).format("DD-MMM-YYYY")];
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
              <h2 className="page_title">CIT Dimension List</h2>
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

            <CitDimensionDataTable
            selectedProduct5={selectedProduct5}
              citDimensionList={
                citDimensionList &&
                citDimensionList.length > 0 &&
                citDimensionList
              }
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
              {addShgData && addShgData._id
                ? "Update CIT Dimension"
                : "Add CIT Dimension"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form>
                <Row>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Name </Form.Label>
                    <Form.Control
                      defaultValue={
                        addShgData && addShgData.name && addShgData.name
                      }
                      type="text"
                      placeholder=""
                      name="name"
                      onChange={onHandleChange}
                      onKeyPress={(e) => {
                        if (!/[a-z A-Z _ / ? - \s ]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                    />
                     {fieldData.field == "name" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>CIT Version </Form.Label>
                    <Form.Select
                      name="cit_version"
                      value={
                        addShgData &&
                        addShgData.cit_version &&
                        addShgData.cit_version._id
                      }
                      onChange={(e) =>
                        setAddShgData({
                          ...addShgData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={"true"}>Default select</option>
                      {citVersionList &&
                        citVersionList.length > 0 &&
                        citVersionList.map((item) => {
                          return (
                            <option value={item._id}>
                              {item && item.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                    {fieldData.field == "cit_version" && (
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
                      onClick={addShgFunc}
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

export default CitDimension;
