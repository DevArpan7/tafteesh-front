import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import {
  getAuthorityTypeList,
  getAuthorityList,
  getActList,
  getSectionList,
} from "../../redux/action";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import Dropdown from "react-bootstrap/Dropdown";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import moment from "moment";
import AlertComponent from "../../components/AlertComponent";
import SectionListDataTable from "./SectionListDataTable";
// import { useForm } from "react-hook-form";

const SectionList = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Section");
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const authorityTypeList = useSelector((state) => state.authorityTypeList);
  const authorityList = useSelector((state) => state.authorityList);
  const actList = useSelector((state) => state.actList);
  const sectionList = useSelector((state) => state.sectionList);
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  // const [sectionList,setSectionList]=useState([])
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [addShgData, setAddShgData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/section";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const formRef = useRef(null);
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
  // //console.log(authorityList,"authorityList")
  // //console.log(actList,'actlistttttttttttttttttttttttt')
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
      setSelectedData({});
      setActiveClass(false);
      setSelectedProduct5(null);
    }
  };
  useEffect(() => {
    dispatch(getSectionList());
    dispatch(getActList());
  }, [props]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [sectionList]);
  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
    setAddShgData({});
    // setSelectedData({})
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Section");
      setAlertFlag("alert");
    } else {
      setModalTitle("Update Section");
      setModalAddShow(true);
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
      setAlertMessage("Please select one Section");
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
          setSelectedProduct5(null);
          dispatch(getSectionList());
          setShowAlert(false);
          setErorMessage("");
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

  // const {register,handleSubmit,formState: { errors }, } = useForm();

  useEffect(() => {
    if (addShgData && addShgData.number) {
      setFieldData({ field: "number", message: "" });
    } else if (addShgData && addShgData.act) {
      setFieldData({ field: "act", message: "" });
    } else {
      setFieldData({ field: "", message: "" });
    }
  }, [addShgData]);
  ///// add shg api cll function /////

  const addShgFunc = (e) => {
    //console.log(e);
    e.preventDefault();
    if (addShgData && !addShgData.number) {
      setFieldData({
        field: "number",
        message: "Please enter Number",
      });
    } else if (addShgData && !addShgData.act) {
      setFieldData({
        field: "act",
        message: "Please select Act",
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
              setMessagType("success");
              dispatch(getSectionList());
              setModalAddShow(false);
              setSelectedProduct5(null);
              setAddShgData({});
              formRef.current.reset();
              // setSelectedData({});
              setActiveClass(false);
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
              setMessagType("success");
              dispatch(getSectionList());
              setModalAddShow(false);
              // setAddStateData({})
              formRef.current.reset();
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

  //console.log(sectionList, "sectionnnnnnnnnnnnnnnnnnnnnnnnn");

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
  let exportData = [];
  const exportToCsv = (e) => {
    e.preventDefault();

    // Headers for each column
    let headers = ["Section,Act,CreatedAt"];

    sectionList.map((x) => {
      exportData.push({
        section: x.number,
        act: x.act.name,
        createdAt: moment(x.createdAt).format("DD-MMM-YYYY"),
      });
    });
    //console.log(exportData, "exportdaaaaaaaaaaaaaaaa");
    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const { section, act, createdAt } = user;
      acc.push([section, act, createdAt].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "sectionList.csv",
      fileType: "text/csv",
    });
  };
  // //console.log(sectionList,'sectionssssssssss')
  ///////////// import CSV file  function ////
  const [file, setFile] = useState();
  const [importCSVdata, setImportCSVdata] = useState([]);
  const fileReader = new FileReader();
  const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
  const [sampleArr, setSampleArr] = useState([
    { Act: "62b5b87c8d6ffd0f4aa485e0", Number: "100" },
  ]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };

  const downloadSampleCsv = (e) => {
    let headers = ["Act,Number"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { Act, Number } = user;
      acc.push([Act, Number].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "SectionList.csv",
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
          (obj = { act: item && item.Act, number: item && item.Number }),
          //console.log(obj, "obj"),
          axios
            .post(api + "/create", obj, axiosConfig)
            .then((response) => {
              //console.log(response);

              if (response.data && response.data.error === false) {
                const { data } = response;
                handleClick();
                setUpdateMessage(response && response.data.message);
                setMessagType("success");
                dispatch(getSectionList());
                setImportCSVdata([]);
                setFile();
                setImportCsvOpenModel(false);
              } else {
                handleClick();
                setUpdateMessage(response && response.data.message);
                setMessagType("error");
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
    doc.text("SECTION DETAILS", 22, 10);
    const survivorColumns = ["SECTION", "ACT", "CREATED AT"];
    const name = "Section-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    sectionList?.forEach((item) => {
      const temp = [
        item.number,
        item.act.name,
        moment(item.createdAt).format("DD-MMM-YYYY"),
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
    doc.save(name);
  };
  if (addShgData) {
    //console.log(addShgData?.act?.name, "actname");
  }
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
              <h2 className="page_title">Section List</h2>
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

            <SectionListDataTable
              authorityList={
                sectionList && sectionList.length > 0 && sectionList
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
              {addShgData && addShgData._id ? "Update Section" : "Add Section"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form
              // onSubmit={handleSubmit(addShgFunc)}  ref={formRef}
              >
                <Row>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Number </Form.Label>
                    <Form.Control
                      defaultValue={
                        addShgData && addShgData.number && addShgData.number
                      }
                      type="text"
                      placeholder=""
                      name="number"
                      onChange={(e) =>
                        setAddShgData({
                          ...addShgData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                      onKeyPress={(e) => {
                        if (!/[a-z A-Z 0-9 \s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}

                      // onKeyPress={(e) => {
                      //   if (!/[a-z A-Z 0-9 _ \s]/.test(e.key)) {
                      //     e.preventDefault();
                      //   }
                      // }}
                      // {...register("number", { required: true})}
                    />
                    {fieldData.field == "number" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Act</Form.Label>
                    <Form.Select
                      name="act"
                      value={addShgData && addShgData?.act?._id}
                      onChange={(e) =>
                        setAddShgData({
                          ...addShgData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      // {...register("act", { required: true})}
                    >
                      <option value="" hidden={true}>
                        Please select
                      </option>
                      {actList &&
                        actList.length > 0 &&
                        actList.map((item) => {
                          return (
                            <option value={item && item._id}>
                              {item && item.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                    {fieldData.field == "act" && (
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

export default SectionList;
