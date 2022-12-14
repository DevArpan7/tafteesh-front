import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { getPartnerList, deletePartner } from "../../redux/action";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import moment from "moment";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import alertImg from "../../assets/img/alertPopupimg.png";
import AlertComponent from "../../components/AlertComponent";
import PartnersDataTable from "./PartnersDataTable";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
const KamoPartners = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const partnerList = useSelector((state) => state.partnerList);
  const [erorMessage, setErorMessage] = useState("");

  const [addPartnerData, setAddPartnerData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/partner";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const [partnerName, setPartnerName] = useState("");
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [phoneno, setPhoneno] = useState("");
  const [partEmail, setPartEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertFlag, setAlertFlag] = useState("");
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [messagType, setMessagType] = useState("");

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
      setSelectedData([]);
      setActiveClass(false);
      setSelectedProduct5(null);
    }
  };

  useEffect(() => {
    dispatch(getPartnerList());
  }, [props]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [partnerList]);
  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
    // setAddPartnerData({});
    setFieldData({ field: "", message: "" });
    // setSelectedData({});
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one partner");
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
          setMessagType("success");
          setUpdateMessage(response && response.data.message);
          // setUserId("");
          dispatch(getPartnerList());
          setShowAlert(false);
          // setErorMessage("");
          setSelectedData({});
          setSelectedProduct5(null);
        }
      })
      .catch((error) => {
        setDeleteLoader(false);
        ////console.log(error, "partner error");
      });
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      // alert("Please select one partner");
      setShowAlert(true);
      setAlertMessage("Please select one partner");
      setAlertFlag("alert");
    } else {
      setModalAddShow(true);
      setAddPartnerData(selectedData);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setAddPartnerData({});
    setSelectedData({});
    setSelectedProduct5(null);
  };

  useEffect(() => {
    //console.log(addPartnerData, "org data");
  }, [addPartnerData]);

  useEffect(() => {
    //console.log(fieldData, "fieldData");
    if (addPartnerData && addPartnerData.name) {
      setPartnerName(false);
      setFieldData({ field: "name", message: "" });
    } else if (addPartnerData && addPartnerData.phone_no) {
      setPhoneno(false);
      setFieldData({ field: "phone_no", message: "" });
    } else if (addPartnerData && addPartnerData.email) {
      setPartEmail(false);
      setFieldData({ field: "email", message: "" });
    } else {
    }
    setFieldData({ field: "", message: "" });
  }, [addPartnerData]);

  const onHandleChange = (e) => {
    setAddPartnerData({
      ...addPartnerData,
      [e.target.name]: e.target.value.trim(),
    });
  };
  ///// add Organisation api cll function /////

  const addPartnerFunc = (e) => {
    e.preventDefault();
    var pattern = new RegExp(
      /^([a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,3}$)/
    );

    let isValid = true;
    if (addPartnerData && !addPartnerData.name) {
      setFieldData({
        field: "name",
        message: "Please enter Name",
      });
      setPartnerName(true);
    } else if (addPartnerData && !addPartnerData.phone_no) {
      setFieldData({ field: "phone_no", message: "Please enter Phone no" });
      setPhoneno(true);
      setPartnerName(false);
    } else if (addPartnerData && addPartnerData.phone_no < 1000000000) {
      setFieldData({ field: "phone_no", message: "Phone no is invalid" });
      setPhoneno(true);
      setPartnerName(false);
    } else if (addPartnerData && !addPartnerData.email) {
      setFieldData({
        field: "email",
        message: "Please enter Email Id",
      });
      setPartEmail(true);
      setPhoneno(false);
      setPartnerName(false);
    } else if (
      addPartnerData &&
      addPartnerData.email &&
      !pattern.test(addPartnerData.email)
    ) {
      setFieldData({ field: "email", message: "Please enter valid email Id." });

      isValid = false;
      setPartEmail(true);
      setPhoneno(false);
      setPartnerName(false);
    } else {
      setFieldData({ field: "", message: "" });
      setPartEmail(false);
      setPhoneno(false);
      setPartnerName(false);

      var body = addPartnerData;

      if (addPartnerData && addPartnerData._id) {
        setLoader(true);
        axios
          .patch(api + "/update/" + addPartnerData._id, body, axiosConfig)
          .then((response) => {
            //console.log(response);

            setLoader(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setMessagType("success");
              setUpdateMessage(response && response.data.message);
              dispatch(getPartnerList());
              setModalAddShow(false);
              // setSelectedData({});
              setActiveClass(false);
              setErorMessage("");
              setAddPartnerData({});
            } else {
              handleClick();
              setMessagType("error");
              setUpdateMessage(response && response.data.message);
            }
          })
          .catch((error) => {
            setLoader(false);
            //console.log(error, "shg add error");
            handleClick();
            setMessagType("error");
            setUpdateMessage(error.message);
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
              setMessagType("success");
              setUpdateMessage(response && response.data.message);
              dispatch(getPartnerList());
              setModalAddShow(false);
              setAddPartnerData({});
              setErorMessage("");
            } else {
              handleClick();
              setMessagType("error");
              setUpdateMessage(response && response.data.message);
            }
          })
          .catch((error) => {
            setLoader(false);

            handleClick();
            setMessagType("error");
            setUpdateMessage(error.message);
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
    let headers = ["Id,PartnerName,PhoneNo,Email"];

    // Convert users data to a csv
    let usersCsv = partnerList.data.reduce((acc, user) => {
      const { _id, name, phone_no, email } = user;
      acc.push([_id, name, phone_no, email].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "partners.csv",
      fileType: "text/csv",
    });
  };

  ///////////// import CSV file  function ////
  const [file, setFile] = useState();
  const [importCSVdata, setImportCSVdata] = useState([]);
  const fileReader = new FileReader();
  const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
  const [sampleArr, setSampleArr] = useState([]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };
  const downloadSampleCsv = (e) => {
    e.preventDefault();
    let headers = ["PartnerName,PhoneNo,Email"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { name, phone_no, email } = user;
      acc.push([name, phone_no, email].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "partners.csv",
      fileType: "text/csv",
    });
  };

  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("PARTNER DETAILS", 22, 10);
    const survivorColumns = ["PARTNER NAME", "PHONE NO", "EMAIL", "CREATED AT"];
    const name = "partners-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    partnerList.data?.forEach((item) => {
      const temp = [
        item.name,
        item.phone_no,
        item.email,
        moment(item.createdAt).format("DD-MMM-YYYY"),
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
    doc.save(name);
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
      setAlertFlag("alert");
      // alert("Please upload a .csv File");
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
            name: item && item.PartnerName,
            email: item && item.Email,
            phone_no: item && item.PhoneNo,
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
                dispatch(getPartnerList());
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
              <h2 className="page_title">Partners List</h2>
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
            <PartnersDataTable
              partnerList={
                partnerList &&
                partnerList.data &&
                partnerList.data.length > 0 &&
                partnerList.data
              }
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
              {addPartnerData && addPartnerData._id
                ? "Update Partner"
                : "Add Partner"}
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
                        addPartnerData &&
                        addPartnerData.name &&
                        addPartnerData.name
                      }
                      name="name"
                      onChange={onHandleChange}
                      onKeyPress={(e) => {
                        if (!/[a-z A-Z\s]/.test(e.key)) {
                          e.preventDefault();
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
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Phone </Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={10}
                      placeholder=""
                      defaultValue={
                        addPartnerData &&
                        addPartnerData.phone_no &&
                        addPartnerData.phone_no
                      }
                      name="phone_no"
                      onChange={onHandleChange}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                    />
                    {fieldData.field == "phone_no" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="12" className="mb-3">
                    <Form.Label>Email </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder=""
                      defaultValue={
                        addPartnerData &&
                        addPartnerData.email &&
                        addPartnerData.email
                      }
                      name="email"
                      onChange={onHandleChange}
                    />
                    {fieldData.field == "email" && (
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
                      onClick={addPartnerFunc}
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
          deleteLoader={deleteLoader}
          alertFlag={alertFlag}
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
        />
      )}
    </>
  );
};

export default KamoPartners;
