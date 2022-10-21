import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import {
  getOrganizationList,
  getStateList,
  deleteOrganisation,
  getCityList,
} from "../../redux/action";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import moment from "moment";
import Papa from "papaparse";
import CsvImportPage from "../../components/CsvImportPage";
import AlertComponent from "../../components/AlertComponent";
import OrganizationsDataTable from "./OrganizationsDataTable";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
const KamoOrganizations = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const organizationList = useSelector((state) => state.organizationList);
  const stateList = useSelector((state) => state.stateList);
  const cityList = useSelector((state) => state.cityList);

  const [addOrgData, setAddOrgData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/organization";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [erorMessage, setErorMessage] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [selectedProduct5, setSelectedProduct5] = useState(null);

  const [partnerName, setPartnerName] = useState("");
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [phoneno, setPhoneno] = useState("");
  const [partEmail, setPartEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertFlag, setAlertFlag] = useState("");
  const [messagType, setMessagType] = useState("");

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Organization");
      setAlertFlag("alert");
    } else {
      setShowAlert(true);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  // const onDeleteFunction = () => {
  //   dispatch(deleteOrganisation(selectedData._id));
  //   setShowAlert(false);
  // };

  // console.log(organizationList,"organizationList")
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
          dispatch(getOrganizationList());
          setShowAlert(false);
          setSelectedProduct5(null);
          // setErorMessage("");
          setSelectedData({});
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
      setSelectedProduct5(item);

      setSelectedData(item);
      setActiveClass(true);
    } else {
      setSelectedData({});
      setSelectedProduct5(null);

      setActiveClass(false);
    }
  };
  useEffect(() => {
    dispatch(getOrganizationList());
    dispatch(getStateList());
  }, [props]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [organizationList]);
  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
    setAddOrgData({});
    setFieldData({ field: "", message: "" });
    // setSelectedData({})
  };

  const onStateChange = (e) => {
    setAddOrgData({
      ...addOrgData,
      [e.target.name]: e.target.value,
    });
    dispatch(getCityList(e.target.value));
  };


  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Organization");
      setAlertFlag("alert");
    } else {
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
      setModalAddShow(true);
      dispatch(getCityList(selectedData && selectedData.state_name && selectedData.state_name._id));
      setAddOrgData(selectedData);
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setAddOrgData({});
    setSelectedData({});
    setSelectedProduct5(null);
  };

  useEffect(() => {
    //console.log(addOrgData, "org data");
  }, [addOrgData]);

  const onHandleChange = (e) => {
    setAddOrgData({
      ...addOrgData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  useEffect(() => {
    //console.log(fieldData, "fieldData");
    if (addOrgData && addOrgData.name) {
      //   setPartnerName(false);
      setFieldData({ field: "name", message: "" });
    } else if (addOrgData && addOrgData.phone) {
      //   setPhoneno(false);
      setFieldData({ field: "phone", message: "" });
    } else if (addOrgData && addOrgData.email) {
      //   setPartEmail(false);
      setFieldData({ field: "email", message: "" });
    } else if (addOrgData && addOrgData.address) {
      //   setPartEmail(false);
      setFieldData({ field: "address", message: "" });
    } else if (addOrgData && addOrgData.city) {
      //   setPartEmail(false);
      setFieldData({ field: "city_name", message: "" });
    } else if (addOrgData && addOrgData.state) {
      //   setPartEmail(false);
      setFieldData({ field: "state_name", message: "" });
    } else if (addOrgData && addOrgData.pin) {
      //   setPartEmail(false);
      setFieldData({ field: "pin", message: "" });
    } else if (addOrgData && addOrgData.contactPersion) {
      //   setPartEmail(false);
      setFieldData({ field: "contactPersion", message: "" });
    } else if (addOrgData && addOrgData.website) {
      //   setPartEmail(false);
      setFieldData({ field: "website", message: "" });
    } else {
    }
    setFieldData({ field: "", message: "" });
  }, [addOrgData]);
  ///// add Organisation api cll function /////

  const addOrgFunc = (e) => {
    e.preventDefault();
    var body = addOrgData;
    var pattern = new RegExp (/^([a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,3}$)/)
    
    let isValid = true;
    if (addOrgData && !addOrgData.name) {
      setFieldData({
        field: "name",
        message: "Please enter Name",
      });
    } else if (addOrgData && !addOrgData.phone) {
      setFieldData({ field: "phone", message: "Please enter Phone no" });
    } else if (addOrgData && addOrgData.phone < 1000000000) {
      setFieldData({ field: "phone", message: "Phone no is invalid" });
    } else if (addOrgData && !addOrgData.email) {
      setFieldData({
        field: "email",
        message: "Please enter Email Id",
      });
    } else if (
      addOrgData &&
      addOrgData.email &&
      !pattern.test(addOrgData.email)
    ) {
      setFieldData({ field: "email", message: "Please enter valid email Id." });

      isValid = false;
    } else if (addOrgData && !addOrgData.address) {
      setFieldData({ field: "address", message: "Please enter address." });
    } else if (addOrgData && !addOrgData.city_name) {
      setFieldData({ field: "city_name", message: "Please enter city." });
    } else if (addOrgData && !addOrgData.state_name) {
      setFieldData({ field: "state_name", message: "Please select State." });
    } else if (addOrgData && !addOrgData.pin) {
      setFieldData({ field: "pin", message: "Please PIN." });
    } else if (addOrgData && addOrgData.pin < 99999) {
      setFieldData({ field: "pin", message: "Invalid PIN. number" });
    } else if (addOrgData && !addOrgData.contactPersion) {
      setFieldData({
        field: "contactPersion",
        message: "Please enter Contact Persion.",
      });
    } else if (addOrgData && !addOrgData.website) {
      setFieldData({ field: "website", message: "Please enter website." });
    } else {
      setFieldData({ field: "", message: "" });

      if (addOrgData && addOrgData._id) {
        setLoader(true);
        axios
          .patch(api + "/update/" + addOrgData._id, body, axiosConfig)
          .then((response) => {
            //console.log(response);
           
            setLoader(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setMessagType("success");
              setUpdateMessage(response && response.data.message);
              dispatch(getOrganizationList());
              setModalAddShow(false);
              // setSelectedData({});
              setActiveClass(false);
              setAddOrgData({});
              setSelectedProduct5(null);

              setErorMessage("");
            } else {
              handleClick();
              setMessagType("error");
              setUpdateMessage(response && response.data.message);
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
              setMessagType("success");
              setUpdateMessage(response && response.data.message);
              dispatch(getOrganizationList());
              setModalAddShow(false);
              setAddOrgData({});
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
            setUpdateMessage(error && error.message);
            //console.log(error, "organization add error");
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
      "Id,OrganizationName,PhoneNo,Email,City,State,Pin,Address,ContactPersion,Website,CreatedAt",
    ];

    // Convert users data to a csv
    let usersCsv = organizationList.data.reduce((acc, user) => {
      const {
        _id,
        name,
        phone,
        email,
        city_name,
        state_name,
        pin,
        address,
        contactPersion,
        website,
        createdAt,
      } = user;
      acc.push(
        [
          _id,
          name,
          phone,
          email,
          city_name && city_name.name,
          state_name && state_name.name,
          pin,
          address,
          contactPersion,
          website,
          moment(createdAt).format("DD-MMM-YYYY"),
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "organization.csv",
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
      name: "User",
      phone: "9876543212",
      email: "user@mail.com",
      city_name: "62a9a7c3c05c6a1059f92eb0",
      state_name: "62a9a7c3c05c6a1059f92eb0",
      pin: "123456",
      contactPersion: "Arpit",
      website: "www.website.com",
      address: "newtown",
    },
  ]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };
  const downloadSampleCsv = (e) => {
    let headers = [
      "OrganizationName,PhoneNo,Email,City,State,Pin,ContactPersion,Website,Address",
    ];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const {
        name,
        phone,
        email,
        city_name,
        state_name,
        pin,
        contactPersion,
        website,
        address,
      } = user;
      acc.push(
        [
          name,
          phone,
          email,
          city_name,
          state_name,
          pin,
          contactPersion,
          website,
          address,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "organization.csv",
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
            name: item && item.OrganizationName,
            phone: item && item.PhoneNo,
            email: item && item.Email,
            city_name: item && item.City,
            state_name: item && item.State,
            pin: item && item.Pin,
            contactPersion: item && item.ContactPersion,
            website: item && item.Website,
            address: item && item.Address,
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
                dispatch(getOrganizationList());
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

  //// download PDF funtion ////
  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("ORGANIZATION DETAILS", 22, 10);
    const survivorColumns = [
      "ORGANIZATION NAME",
      "EMAIL",
      "MOBILE",
      "PIN",
      "CONTACT PERSION",
      "CITY",
      "STATE",
      "ADDRESS",
      "WEBSITE",
      "CREATED AT",
    ];
    const name = "organization-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    organizationList.data?.forEach((item) => {
      const temp = [
        item.name,
        item.email,
        item.phone,
        item.pin,
        item.contactPersion,
        item.city_name && item.city_name.name,
        item.state_name && item.state_name.name,
        item.address,
        item.website,
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
          message={updateMessage}
          type={messagType}
        />

        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">Organizations List</h2>
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
            <OrganizationsDataTable
              organizationList={
                organizationList &&
                organizationList.data &&
                organizationList.data.length > 0 &&
                organizationList.data
              }
              selectedProduct5={selectedProduct5}
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />
            {/* <div className="table-responsive">
                            <table className="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th width="20%">Name </th>
                                        <th width="15%">Phone</th>
                                        <th width="28%">Email</th>
                                        <th width="12%">City</th>
                                        <th width="20%">Contact persion </th>
                                        <th width="12%">State</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {organizationList && organizationList.data && organizationList.data.length > 0 ? organizationList.data.map((item) => {
                                        return (
                                            <tr className={[item._id === selectedData._id && activeClass === true && 'current']}
                                                onClick={() => onSelectRow(item)}>
                                                <td>{item && item.name && item.name}</td>
                                                <td>{item && item.phone && item.phone}</td>
                                                <td>{item && item.email && item.email}</td>
                                                <td>{item && item.city && item.city}</td>
                                                <td>{item && item.contact_persion && item.contact_persion}</td>
                                                <td>{item && item.state && item.state}</td>
                                            </tr>
                                        )
                                    })
                                        :
                                        <tr>
                                           <td className="text-center" colSpan={6}>
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
              {addOrgData && addOrgData._id
                ? "Update Organisation"
                : "Add Organisation"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form>
                <Row>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>
                      Name <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      defaultValue={
                        addOrgData && addOrgData.name && addOrgData.name
                      }
                      type="text"
                      placeholder=""
                      name="name"
                      onChange={onHandleChange}
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
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>
                      Phone <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      maxLength={10}
                      defaultValue={
                        addOrgData && addOrgData.phone && addOrgData.phone
                      }
                      type="text"
                      placeholder=""
                      name="phone"
                      onChange={onHandleChange}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                    />{" "}
                    {fieldData.field == "phone" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="12" className="mb-3">
                    <Form.Label>
                      Email <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      defaultValue={
                        addOrgData && addOrgData.email && addOrgData.email
                      }
                      type="email"
                      placeholder=""
                      name="email"
                      onChange={onHandleChange}
                    />
                    <div
                      className="text-danger"
                      style={{ fontSize: 12, marginTop: 5 }}
                    >
                      {fieldData.field == "email" && (
                        <small className="mt-4 mb-2 text-danger">
                          {fieldData && fieldData.message}
                        </small>
                      )}
                    </div>
                  </Form.Group>

                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>
                      Address <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      defaultValue={
                        addOrgData && addOrgData.address && addOrgData.address
                      }
                      type="text"
                      placeholder=""
                      name="address"
                      onChange={onHandleChange}
                    />{" "}
                    {fieldData.field == "address" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>
                      State name <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Select
                      onChange={(e) => onStateChange(e)}
                      name="state_name"
                      value={
                        addOrgData &&
                        addOrgData.state_name &&
                        addOrgData.state_name._id
                      }
                    >
                      <option hidden={"true"} value="">
                        Please select State{" "}
                      </option>
                      {stateList &&
                        stateList.length > 0 &&
                        stateList.map((data) => {
                          return <option value={data._id}>{data.name}</option>;
                        })}
                    </Form.Select>
                    {fieldData.field == "state_name" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>
                      City <span className="requiredStar">*</span>
                    </Form.Label>

                    <Form.Select
                      onChange={(e) => setAddOrgData({
                        ...addOrgData,
                        [e.target.name]: e.target.value,
                      })}
                      name="city_name"
                      value={
                        addOrgData &&
                        addOrgData.city_name &&
                        addOrgData.city_name._id
                      }
                    >
                      <option hidden={"true"} value="">
                        Please select State{" "}
                      </option>
                      {cityList &&
                        cityList.length > 0 &&
                        cityList.map((data) => {
                          return <option value={data._id}>{data.name}</option>;
                        })}
                    </Form.Select>
                    {fieldData.field == "city_name" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>
                      PIN <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      maxLength={7}
                      defaultValue={
                        addOrgData && addOrgData.pin && addOrgData.pin
                      }
                      type="text"
                      placeholder=""
                      name="pin"
                      onChange={onHandleChange}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                    />{" "}
                    {fieldData.field == "pin" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>
                      Contact Person <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      defaultValue={
                        addOrgData &&
                        addOrgData.contactPersion &&
                        addOrgData.contactPersion
                      }
                      type="text"
                      placeholder=""
                      name="contactPersion"
                      onChange={onHandleChange}
                      onKeyPress={(e) => {
                        if (!/[a-z A-Z\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                    />{" "}
                    {fieldData.field == "contactPersion" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>
                      Website <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      defaultValue={
                        addOrgData && addOrgData.website && addOrgData.website
                      }
                      type="text"
                      placeholder=""
                      name="website"
                      onChange={onHandleChange}
                      // onKeyPress={(e) => {
                      //   if (!/[0-9]/.test(e.key)) {
                      //     e.preventDefault();
                      //   }
                      // }}
                    />
                    {fieldData.field == "website" && (
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
                      onClick={addOrgFunc}
                      disabled={loader == true ? true : false}
                      // disabled={addOrgData && !addOrgData.name ? true : !addOrgData.phone ? true : !addOrgData.email ? true :
                      //  !addOrgData.address ? true : !addOrgData.city ? true : !addOrgData.state ? true : !addOrgData.pin ? true :
                      // !addOrgData.contactPersion ? true : !addOrgData.website ? true : false }
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

export default KamoOrganizations;
