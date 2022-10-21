import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { getAuthorityTypeList, getAuthorityList } from "../../redux/action";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import Dropdown from "react-bootstrap/Dropdown";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import moment from "moment";
import AuthorityListDataTable from "./AuthorityListDataTable";
import AlertComponent from "../../components/AlertComponent";

const AuthorityList = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const authorityTypeList = useSelector((state) => state.authorityTypeList);
  const authorityList = useSelector((state) => state.authorityList);

  const [addShgData, setAddShgData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/authority";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertFlag, setAlertFlag] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [messagType, setMessagType] = useState("");

  //console.log(authorityList, "authorityList");
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
    } else{
      setSelectedData({});
      setActiveClass(false);
    setSelectedProduct5(null)
  
    }
  };
  useEffect(() => {
    dispatch(getAuthorityTypeList());
    dispatch(getAuthorityList());
  }, [props]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [authorityList]);
  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
    setAddShgData({});
    // setSelectedData({})
    setFieldData({ field: "", message: "" });
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Authority !!");
      setAlertFlag('alert')
    } else {
      setModalAddShow(true);
      setAddShgData(selectedData);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag('')
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setAddShgData({});
    setSelectedData({});
    setSelectedProduct5(null)

  };

  /////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Authority !!");
      setAlertFlag('alert')
    } else {
      setShowAlert(true);
      setAlertMessage("");
      setAlertFlag('')
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
          dispatch(getAuthorityList());
          setShowAlert(false);
    setSelectedProduct5(null)

          setErorMessage("");
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
    //console.log(fieldData, "fieldData");
    if (addShgData && addShgData.name) {
      setFieldData({ field: "name", message: "" });
    } else if (addShgData && addShgData.authority_type) {
      setFieldData({ field: "authority_type", message: "" });
    } else {
      setFieldData({ field: "", message: "" });
    }
    setFieldData({ field: "", message: "" });
  }, [addShgData]);

  ///// add shg api cll function /////

  const addShgFunc = (e) => {
    e.preventDefault();
    if (addShgData && !addShgData.name) {
      setFieldData({
        field: "name",
        message: "Please enter Name",
      });
    } else if (addShgData && !addShgData.authority_type) {
      setFieldData({
        field: "authority_type",
        message: "Please select Authority Type",
      });
    } else {
      setFieldData({ field: "", message: "" });

      var body = addShgData;

      if (addShgData && addShgData._id) {
          setLoader(true)
        axios
          .patch(api + "/update/" + addShgData._id, body, axiosConfig)
          .then((response) => {
            //console.log(response);
           
            setLoader(false)
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("success")
              dispatch(getAuthorityList());
    // setSelectedProduct5(null)

              setModalAddShow(false);
              setAddShgData({});

              // setSelectedData({});
              setActiveClass(false);
            }else{
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("error")
            }
          })
          .catch((error) => {
            setLoader(false)
            //console.log(error, "shg add error");
          });
      } else {
        setLoader(true)
        axios
          .post(api + "/create", body, axiosConfig)
          .then((response) => {
            //console.log(response);
          
            setLoader(false)
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("success")
              dispatch(getAuthorityList());
              setModalAddShow(false);
              setAddShgData({});
            }else{
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("error")
            }
          })
          .catch((error) => {
            setLoader(false)
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
    let headers = ["Id,Authority Name,Authority Type,CreatedAt"];

    // Convert users data to a csv
    let usersCsv = authorityList.data.reduce((acc, user) => {
      const { _id, name,authority_type, createdAt } = user;
      acc.push([_id, name,authority_type && authority_type.name, moment(createdAt).format("DD-MMM-YYYY")].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "authorityList.csv",
      fileType: "text/csv",
    });
  };

 ///////////// import CSV file  function ////
 const [file, setFile] = useState();
 const [importCSVdata, setImportCSVdata] = useState([]);
 const fileReader = new FileReader();
 const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
 const [sampleArr, setSampleArr] = useState([
   { name: "Ariit Das", authority_type: "62a9a7c3c05c6a1059f92eb0" },
 ]);

 const onImportCsv = () => {
   setImportCsvOpenModel(!importCsvOpenModel);
 };

 const downloadSampleCsv = (e) => {
   let headers = ["AuthorityName,AuthorityType"];

   // Convert users data to a csv
   let usersCsv = sampleArr.reduce((acc, user) => {
     const { name, authority_type } = user;
     acc.push([name, authority_type].join(","));
     return acc;
   }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "authorityList.csv",
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
          (obj = { name: item && item.AuthorityName,authority_type: item && item.AuthorityType }),
          //console.log(obj, "obj"),
          axios
            .post(api + "/create", obj, axiosConfig)
            .then((response) => {
              //console.log(response);
              handleClick();
              setUpdateMessage(response && response.data.message);
              if (response.data && response.data.error === false) {
                const { data } = response;
                dispatch(getAuthorityList());
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
    doc.text("AUTHORITY DETAILS", 22, 10);
    const survivorColumns = ["AUTHORITY NAME","AUTHORITY TYPE", "CREATED AT"];
    const name = "authority-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    authorityList.data?.forEach((item) => {
      const temp = [item.name,item.authority_type && item.authority_type.name, moment(item.createdAt).format("DD-MMM-YYYY")];
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
              <h2 className="page_title">Authority List</h2>
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
            <AuthorityListDataTable
              authorityList={
                authorityList &&
                authorityList.data &&
                authorityList.data.length > 0 &&
                authorityList.data
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
                                        <th width="33.33%">CreatedAt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        authorityList && authorityList.isLoading ?
                                        <tr>
                                            <td colSpan={2} className='text-center'>
                                                <div class="spinner-border bigSpinner text-info"></div>
                                            </td>
                                        </tr>
                                    :
                                    
                                    authorityList && authorityList.data && authorityList.data.length > 0 ? authorityList.data.map((item) => {
                                        return (
                                            <tr  className={[item._id === selectedData._id && activeClass === true && 'current']}
                                            onClick={() => onSelectRow(item)}>
                                                <td>{item && item.name && item.name}</td>
                                                <td>{item && item.createdAt && moment(item.createdAt).format("DD/MMM/YYYY")}</td>
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
              {addShgData && addShgData._id
                ? "Update Authority"
                : "Add Authority"}
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
                        if (!/[a-z A-Z\s]/.test(e.key)) {
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
                    <Form.Label>Authority Type</Form.Label>
                    <Form.Select
                      name="authority_type"
                      value={
                        addShgData &&
                        addShgData.authority_type &&
                        addShgData.authority_type._id
                      }
                      onChange={(e) =>
                        setAddShgData({
                          ...addShgData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={true} value="">Please select</option>
                      {authorityTypeList &&
                        authorityTypeList.length > 0 &&
                        authorityTypeList.map((item) => {
                          return (
                            <option value={item && item._id}>
                              {item && item.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                    {fieldData.field == "authority_type" && (
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

export default AuthorityList;
