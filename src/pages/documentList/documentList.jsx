import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { getMasterDocList, getAuthorityList } from "../../redux/action";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Dropdown from "react-bootstrap/Dropdown";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import moment from "moment";
import AlertComponent from "../../components/AlertComponent";
import DocumentListDataTable from "./DocumentListDataTable";

const DocumentList = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [messagType, setMessagType] = useState("");

  const [addShgData, setAddShgData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/document";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [documentList, setDocumentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertFlag, setAlertFlag] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const masterDocList = useSelector((state)=> state.masterDocList)
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSelectRow = (item) => {
    if (item !== null) {
      setSelectedProduct5(item)
    setSelectedData(item);
    setActiveClass(true);
    } else{
      setSelectedData({});
      setActiveClass(false);
      setSelectedProduct5(null);
  
    }
  };

  useEffect(() => {
    dispatch(getMasterDocList());
  }, [props]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [masterDocList]);
  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
    setAddShgData({});
    setFieldData({ field: "", message: "" });
    // setSelectedData({})
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Document");
      setAlertFlag('alert');
    } else {
      setModalAddShow(true);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag('');
      setAddShgData(selectedData);
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setAddShgData({});
    setSelectedData({});
  };

  /////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Document");
      setAlertFlag('alert');
    } else {
      setShowAlert(true);
      setAlertMessage("");
      setAlertFlag('');
    }
  };
  const [deleteLoader, setDeleteLoader] = useState(false);


  const onDeleteFunction = () => {
    setDeleteLoader(true)
    axios
      .patch(api + "/delete/" + selectedData._id,axiosConfig)
      .then((response) => {
       
        setDeleteLoader(false)
        if (response.data && response.data.error === false) {
          const { data } = response;
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success")
          setSelectedData({});
          // fetchAllDocumentList();
          dispatch(getMasterDocList())
          setShowAlert(false);
          seterrorMessage("");
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

  useEffect(() => {
    if (addShgData && addShgData.name) {
      setFieldData({ field: "name", message: "" });
    } else if (addShgData && addShgData.is_required) {
      setFieldData({ field: "is_required", message: "" });
    } else {
    }
  }, [addShgData]);

  ///// add shg api cll function /////

  const addShgFunc = (e) => {
    e.preventDefault();
    let pattern = /[0-9\s]{0,}[a-zA-Z]{2,}/g

    if (addShgData && !addShgData.name) {
      setFieldData({
        field: "name",
        message: "Please enter name",
      });
    }else if(!pattern.test(addShgData.name)){
      setFieldData({
        field: "name",
        message: "Please enter valid name",
      });
    }
     else if (addShgData && !addShgData.is_required) {
      setFieldData({
        field: "is_required",
        message: "Please select Requirement",
      });
    } else {
      setFieldData({ field: "", message: "" });

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
              // fetchAllDocumentList();
              dispatch(getMasterDocList())
              setModalAddShow(false);
              setAddShgData({});
              // setSelectedProduct5(null);
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
            //console.log(error, "shg add error");
          });
      } else {
        // setIsSUbmit(!isSUbmit)
        // seterrorMessage(validate(addShgData))
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
              // fetchAllDocumentList();
              dispatch(getMasterDocList())
              setModalAddShow(false);
              setAddShgData({});
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
  //console.log(documentList, "doclist",masterDocList);

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
    let headers = ["Name,Is Required,CreatedAt"];

    // Convert users data to a csv
    let usersCsv = masterDocList.reduce((acc, user) => {
      const { name, is_required, createdAt } = user;
      acc.push([name,is_required == true ? "Yes": "No",moment(createdAt).format("DD-MMM-YYYY")].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "documentList.csv",
      fileType: "text/csv",
    });
  };

  ///////////// import CSV file  function ////
  const [file, setFile] = useState();
  const [importCSVdata, setImportCSVdata] = useState([]);
  const fileReader = new FileReader();
  const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
  const [sampleArr, setSampleArr] = useState([{ name: "Psychiametric test",is_required:true }]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };

  const downloadSampleCsv = (e) => {
    let headers = ["DocumentName,Is_required"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { name,is_required } = user;
      acc.push([name,is_required].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "documentList.csv",
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
          (obj = { name: item && item.DocumentName,is_required:item && item.Is_required }),
          //console.log(obj, "obj"),
          axios
            .post(api + "/create", obj, axiosConfig)
            .then((response) => {
              //console.log(response);
              handleClick();
              setUpdateMessage(response && response.data.message);
              if (response.data && response.data.error === false) {
                const { data } = response;
                // fetchAllDocumentList();
                dispatch(getMasterDocList())
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

  // for form validation/////////
  const [formErrors, setFormErrors] = useState({});
  const [isSUbmit, setIsSUbmit] = useState(false);

  
  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("SECTION DETAILS", 22, 10);
    const survivorColumns = ["NAME", "IS REQUIRED", "CREATED AT"];
    const name = "Section-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    masterDocList?.forEach((item) => {
      const temp = [
        item.name,
        item.is_required == true ? "Yes": "No",
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
              <h2 className="page_title">Document List</h2>
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
            <DocumentListDataTable
              documentList={
                masterDocList && masterDocList.length > 0 && masterDocList
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
              {addShgData && addShgData._id
                ? "Update Document Type"
                : "Add Document Type"}
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
                      onChange={(e) =>
                        setAddShgData({
                          ...addShgData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      onKeyPress={(e) => {
                        if (!/[A-Z a-z 0-9 _ \s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                    />
                    {/* {errorMessage ? <small className='mt-4 mb-2 text-danger'>{errorMessage.name}</small> : <></>} */}
                    {fieldData.field == "name" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Required?</Form.Label>
                    <Form.Select
                      name="is_required"
                      value={
                        addShgData &&
                        addShgData.is_required &&
                        addShgData.is_required
                      }
                      onChange={(e) =>
                        setAddShgData({
                          ...addShgData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={true} value="">
                        Please select
                      </option>

                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Form.Select>
                    {/* {errorMessage ? <small className='mt-4 mb-2 text-danger'>{errorMessage.is_required}</small> : <></>} */}
                    {fieldData.field == "is_required" && (
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

export default DocumentList;
