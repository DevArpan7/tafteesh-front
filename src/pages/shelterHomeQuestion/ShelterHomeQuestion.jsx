import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { getShelterQuestionList } from "../../redux/action";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import Dropdown from "react-bootstrap/Dropdown";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import moment from "moment";
import AlertComponent from "../../components/AlertComponent";
import ShelterHomeQuesDataTable from "./ShelterHomeQuesDataTable";

const ShelterHomeQuestion = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Act");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const authorityList = useSelector((state) => state.authorityList);
  const shelterQuestionList = useSelector((state) => state.shelterQuestionList);
  //console.log(shelterQuestionList, "shelterQuestionList");

  const [addShgData, setAddShgData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/shelter-home-question";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  // const [shelterQuestionList, setshelterQuestionList] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
  const[alertMessage,setAlertMessage] = useState('')
  const[alertFlag,setAlertFlag] = useState('')
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [messagType, setMessagType] = useState("");

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSelectRow = (item) => {
    if(item !==null){
    setSelectedData(item);
    setSelectedProduct5(item)
    setActiveClass(true);
    } else{
      setSelectedData({});
      setSelectedProduct5(null)
      setActiveClass(false);
  
    }
  };
  // //console.log(shelterQuestionList,'ssssssssssssssssss')
  //get all act list

  // const fetchAllshelterQuestionList = () => {
  //     var axios = require('axios');

  //     var config = {
  //         method: 'get',
  //         url: `${api}/list`,
  //         headers: {}
  //     };

  //     axios(config)
  //         .then(function (response) {
  //             // //console.log(JSON.stringify(response.data));
  //             // //console.log(response.data.data,'data')
  //             // //console.log(response.data.error)
  //             if (response.data.error == false) {
  //                 let arrTemp = []
  //                 setshelterQuestionList(response.data.data);
  //             }
  //             // //console.log(response,'shelterQuestionList response')
  //         })
  //         .catch(function (error) {
  //             //console.log(error);
  //         });
  // }

  useEffect(() => {
    dispatch(getShelterQuestionList());
  }, [props]);
 
  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
    // setAddShgData({});
    // setSelectedData({})
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      // alert("Please select one Act !!");
      setShowAlert(true);
      setAlertMessage("Please select one Act !!");
      setAlertFlag('alert')
    } else {
      setModalAddShow(true);
      setAddShgData(selectedData);
      setModalTitle("Upadate Shelter Home Question");
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
      setAlertMessage("Please select one Shelter Home Question !!");
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
          setSelectedData({});
          dispatch(getShelterQuestionList());
          handleClick();
          setMessagType("success")
          setUpdateMessage(response && response.data.message);
          setShowAlert(false);
          seterrorMessage("");
        }else{
          handleClick();
          setMessagType("error")
          setUpdateMessage(response && response.data.message);
        }
      })
      .catch((error) => {
        setDeleteLoader(false)

        ////console.log(error, "partner error");
      });
  };

  useEffect(() => {
    if (addShgData && addShgData.question) {
      setFieldData({ field: "question", message: "" });
    } else {
      setFieldData({ field: "", message: "" });
    }
  }, [addShgData]);

  ///// add shg api cll function /////

  const addShgFunc = (e) => {
    e.preventDefault();
    let pattern = /[0-9\s]{0,}[a-zA-Z]{2,}/g

    var body = addShgData;
    if (addShgData && !addShgData.question) {
      setFieldData({
        field: "question",
        message: "Please enter question",
      });
    } else if (!pattern.test(addShgData.question)) {
      setFieldData({
        field: "question",
        message: "Please enter valid question",
      });
    }
      else {
      setFieldData({ field: "", message: "" });
      if (addShgData && addShgData._id) {
        // setModalTitle('Update Act')
        setLoader(true);
        axios
          .patch(api + "/update/" + addShgData._id, body, axiosConfig)
          .then((response) => {
            //console.log(response);
           
            setLoader(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              dispatch(getShelterQuestionList())
              handleClick();
              setMessagType("success")
              setUpdateMessage(response && response.data.message);
              setModalAddShow(false);
              setAddShgData({});

              // setSelectedData({});
              setActiveClass(false);
            }else{
              handleClick();
              setMessagType("error")
              setUpdateMessage(response && response.data.message);
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
              dispatch(getShelterQuestionList());
              handleClick();
              setMessagType("success")
              setUpdateMessage(response && response.data.message);
              setModalAddShow(false);
              setAddShgData({});
            }else{
              handleClick();
              setMessagType("error")
              setUpdateMessage(response && response.data.message);
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
    let headers = ["Id,Question,CreatedAt"];

    // Convert users data to a csv
    let usersCsv = shelterQuestionList.reduce((acc, user) => {
      const { _id,question, createdAt } = user;
      acc.push([_id,question, moment(createdAt).format("DD-MMM-YYYY")].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "shelterQuestionList.csv",
      fileType: "text/csv",
    });
  };

  ///////////// import CSV file  function ////
  const [file, setFile] = useState();
  const [importCSVdata, setImportCSVdata] = useState([]);
  const fileReader = new FileReader();
  const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
  const [sampleArr, setSampleArr] = useState([{ question: "ITPC" }]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };

  const downloadSampleCsv = (e) => {
    let headers = ["question"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { question } = user;
      acc.push([question].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "shelterQuestionList.csv",
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
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [shelterQuestionList]);
  useEffect(() => {
    let obj = {};
    //console.log(importCSVdata, "importCSVdata");
    importCSVdata &&
      importCSVdata.length > 0 &&
      importCSVdata.map((item) => {
        return (
          (obj = { question: item && item.question }),
          //console.log(obj, "obj"),
          axios
            .post(api + "/create", obj, axiosConfig)
            .then((response) => {
              //console.log(response);
              handleClick();
              setUpdateMessage(response && response.data.message);
              if (response.data && response.data.error === false) {
                const { data } = response;
                dispatch(getShelterQuestionList());
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
  // const [formErrors, setFormErrors] = useState({});
  const [isSUbmit, setIsSUbmit] = useState(false);


  useEffect(() => {
    //console.log(isSUbmit);
    //console.log(errorMessage);
  }, [isSUbmit]);
  // //console.log(shelterQuestionList,'shelterQuestionList data')

  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("SHELTER HOME QUESTION LIST", 22, 10);
    const survivorColumns = ["QUESTION", "CREATED AT"];
    const name = "ShelterQuestion-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    shelterQuestionList?.forEach((item) => {
      const temp = [item.question, moment(item.createdAt).format("DD-MMM-YYYY")];
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
              <h2 className="page_title">Shelter Home Questions List</h2>
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
            <ShelterHomeQuesDataTable
              authorityList={shelterQuestionList && shelterQuestionList.length > 0 && shelterQuestionList}
              onSelectRow={onSelectRow}
              isLoading={isLoading}
              selectedProduct5={selectedProduct5}
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
              { addShgData && addShgData._id ? "Update Question": "Add Question"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form>
                <Row>
                  <Form.Group className="form-group" as={Col} md="12">
                    <Form.Label>Question </Form.Label>
                    <Form.Control
                      defaultValue={
                        addShgData && addShgData.question && addShgData.question
                      }
                      type="text"
                      placeholder=""
                      name="question"
                      onChange={(e) =>
                        setAddShgData({
                          ...addShgData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      onKeyPress={(e) => {
                        if (!/[a-z A-Z 0-9 \s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                    />
                    {fieldData.field == "question" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  {/* <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Act Type</Form.Label>
                                        <Form.Select name='authority_type'
                                            value={addShgData && addShgData.authority_type && addShgData.authority_type}
                                            onChange={(e) => setAddShgData({
                                                ...addShgData,
                                                [e.target.name]: e.target.value
                                            })}>
                                            <option hidden={true}>Please select</option>
                                            {authorityTypeList && authorityTypeList.length > 0 && authorityTypeList.map((item) => {
                                                return (
                                                    <option value={item && item._id}>{item && item.name}</option>

                                                )
                                            })}

                                        </Form.Select>
                                    </Form.Group> */}
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

export default ShelterHomeQuestion;
