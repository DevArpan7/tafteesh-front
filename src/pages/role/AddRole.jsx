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
  getAuthorityList,
  getRoleList,
  getAccessLitByRoleId,
  getmoduleList,
  getAccessLitByUserId,
} from "../../redux/action";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch"; // import { CustomerService } from '../service/CustomerService';

import Dropdown from "react-bootstrap/Dropdown";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import moment from "moment";
import AlertComponent from "../../components/AlertComponent";
import RoleListDataTable from "./RoleListDataTable";
// import { useForm } from "react-hook-form";

const AddRole = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [accessModalAddShow, setAccessModalAddShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Section");
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const authorityTypeList = useSelector((state) => state.authorityTypeList);
  const authorityList = useSelector((state) => state.authorityList);
  const roleList = useSelector((state) => state.roleList);
  // const roleList = useSelector((state) => state.roleList);
  // const [roleList,setroleList]=useState([])
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const history = useHistory();
  const [roleName, setRoleName] = useState("");
  const [addShgData, setAddShgData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [roleAccessArr, setRoleAccessArr] = useState([]);
  const [showRoleAccessArr, setShowRoleAccessArr] = useState([]);
  const [roleDetails, setRoleDetails] = useState({});
  const [tableLoader, setTableLoader] = useState(true);
  const [rolArr, setRolArr] = useState([]);
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const formRef = useRef(null);
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
  // //console.log(authorityList,"authorityList")
  // //console.log(roleList,'roleListttttttttttttttttttttttt')
  const roleAccessLit = useSelector((state) => state.roleAccessLit);
  const moduleList = useSelector((state) => state.moduleList);
  const [addRoleAccessArr, setAddRoleAccessArr] = useState([]);
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
    dispatch(getRoleList());
    dispatch(getmoduleList());
    // dispatch(getroleList());
  }, [props]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [roleList]);

  useEffect(() => {
    setTimeout(() => {
      setTableLoader(false);
    }, 1000);
    // initFilters1();
  }, [roleAccessLit]);

  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
    setAddRoleAccessArr([]);
    setShowRoleAccessArr([]);
    setRoleAccessArr([]);
    // setAddShgData({});
    // setSelectedData({})
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Role");
      setAlertFlag("alert");
    } else {
      setModalTitle("Update Role");
      setModalAddShow(true);
      setAddShgData(selectedData);
      setAddRoleAccessArr([]);
      setShowRoleAccessArr([]);
      setRoleAccessArr([]);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
      // setRoleDetails(selectedData)
      if (selectedData && selectedData._id) {
        dispatch(getAccessLitByRoleId(selectedData._id));
      }
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setAddShgData({});
    setSelectedData({});
    setSelectedProduct5(null);
    setRoleDetails({});
  };
  /////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Role");
      setAlertFlag("alert");
    } else if (selectedData && selectedData.name.toLowerCase() == "admin") {
      setShowAlert(true);
      setAlertMessage("Can not delete Admin");
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
      .patch(api + "role/delete/" + selectedData._id, axiosConfig)
      .then((response) => {
        setDeleteLoader(false);

        if (response.data && response.data.error === false) {
          const { data } = response;
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success");
          setSelectedData({});
          dispatch(getRoleList());
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
  // useEffect(()=>{
  //   //console.log(addShgData && addShgData.name,"addShgData.name")
  //   roleList && roleList.length>0 && roleList.map((item)=>{
  //     return(
  //       item.name == addShgData.name && setRoleName(item.name)
  //     )
  //   })
  // },[addShgData && addShgData.name])

  useEffect(() => {
    if (addShgData && addShgData.name) {
      setFieldData({ field: "name", message: "" });
    } else if (addShgData && addShgData.reporting_to) {
      setFieldData({ field: "reporting_to", message: "" });
    } else {
      setFieldData({ field: "", message: "" });
    }
  }, [addShgData]);
  ///// add shg api cll function /////

  const addShgFunc = (e) => {
    //console.log(e);
    e.preventDefault();
    let roleNameFilter = "";
    // roleList && roleList.length > 0 && roleList.map((item)=>{
    //   return(
    //     roleNameFilter= item.name.replace(/\s+/g, '').toLowerCase() == addShgData.name.replace(/\s+/g, '').toLowerCase() && item.name
    //   )
    // })
    // //console.log(roleNameFilter,"roleNameFilter")
    if (addShgData && !addShgData.name) {
      setFieldData({
        field: "name",
        message: "Please enter Role",
      });
    }
    // else if(roleNameFilter !== false){
    //   setFieldData({
    //     field: "name",
    //     message: "This Role is already added ",
    //   });
    // }
    else if (addShgData && !addShgData.reporting_to) {
      roleNameFilter = "";
      setFieldData({
        field: "reporting_to",
        message: "Please select Rporting To",
      });
    } else {
      setFieldData({ field: "", message: "" });

      var body = addShgData;

      if (addShgData && addShgData._id) {
        setLoader(true);
        axios
          .patch(api + "role/update/" + addShgData._id, body, axiosConfig)
          .then((response) => {
            //console.log(response);

            setLoader(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setMessagType("success");
              setUpdateMessage(response && response.data.message);
              dispatch(getRoleList());
              roleNameFilter = "";

              setActiveClass(false);
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
            //console.log(error, "role add error");
          });
      } else {
        setLoader(true);
        axios
          .post(api + "role/create", body, axiosConfig)
          .then((response) => {
            //console.log(response);
            setLoader(false);

            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setMessagType("success");

              setUpdateMessage(response && response.data.message);
              setRoleDetails(data.data);
              setAccessModalAddShow(true);
              roleNameFilter = "";
              // dispatch(getRoleList());
              // setModalAddShow(false);
              // setAddShgData(data);
              // formRef.current.reset();
            } else {
              handleClick();
              setMessagType("error");
              setUpdateMessage(response && response.data.message);
            }
          })
          .catch((error) => {
            setLoader(false);
            //console.log(error, "role add error");
          });
      }
    }
  };

  //console.log(roleDetails, "roleDetails");

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
    let headers = ["Id,Name,Reporting To,Reporting To ID,CreatedAt"];

    roleList.map((x) => {
      exportData.push({
        id: x._id,
        name: x.name,
        reporting_to: x.reporting_to && x.reporting_to.name,
        reporting_to_id: x.reporting_to && x.reporting_to._id,
        createdAt: moment(x.createdAt).format("DD-MMM-YYYY"),
      });
    });
    //console.log(exportData, "exportdaaaaaaaaaaaaaaaa");
    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const { id, name, reporting_to, reporting_to_id, createdAt } = user;
      acc.push([id, name, reporting_to, reporting_to_id, createdAt].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "roleList.csv",
      fileType: "text/csv",
    });
  };
  // //console.log(roleList,'sectionssssssssss')
  ///////////// import CSV file  function ////
  const [file, setFile] = useState();
  const [importCSVdata, setImportCSVdata] = useState([]);
  const fileReader = new FileReader();
  const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
  const [sampleArr, setSampleArr] = useState([
    { name: "admin", reporting_to: "62209448782030497a18f162" },
  ]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };

  const downloadSampleCsv = (e) => {
    e.preventDefault();

    let headers = ["Role, Reporting To"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { name, reporting_to } = user;
      acc.push([name, reporting_to].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "roleList.csv",
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
          (obj = { name: item && item.AuthorityName }),
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
              //console.log(error, "role add error");
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
    doc.text("Role List", 22, 10);
    const survivorColumns = ["ROLE", "REPORTING TO", "CREATED AT"];
    const name = "role-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    roleList?.forEach((item) => {
      const temp = [
        item.name,
        item.reporting_to && item.reporting_to.name,
        moment(item.createdAt).format("DD-MMM-YYYY"),
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
    doc.save(name);
  };
  // if (addShgData) {
  //   //console.log(addShgData?.reporting_to?.name, "actname");
  // }

  // useEffect(() => {
  //   if (addShgData && addShgData._id) {
  //     dispatch(getAccessLitByRoleId(addShgData._id));
  //   }
  // }, [addShgData && addShgData._id]);

  //console.log(roleAccessLit, "roleAccessLit");

  // //console.log(userDetails, "userDetails");
  useEffect(() => {
    let sentObj = {};
    let arr = [...roleAccessArr];
    if (
      roleAccessLit &&
      roleAccessLit.access &&
      roleAccessLit.access.length > 0
    ) {
      roleAccessLit &&
        roleAccessLit.access &&
        roleAccessLit.access.length > 0 &&
        roleAccessLit.access.map((item, index) => {
          return (
            (sentObj = {
              module: item.module && item.module._id,
              can_view: item.can_view,
              can_edit: item.can_edit,
              can_delete: item.can_delete,
            }),
            arr.push(sentObj)
            //console.log(arr, "arrrr")
          );
        });

      setRoleAccessArr(arr);
      setShowRoleAccessArr(roleAccessLit && roleAccessLit.access);
    }
  }, [roleAccessLit && roleAccessLit.access]);
  // //console.log(userDetails, "userDetails");

  ///////////// save default Role module list mith all false data //////////
  useEffect(() => {
    let sentObj = {};
    let arr = [...addRoleAccessArr];
    if (roleDetails && roleDetails._id) {
      moduleList &&
        moduleList.length > 0 &&
        moduleList.map((item, index) => {
          return (
            (sentObj = {
              module: item._id,
              can_view: false,
              can_edit: false,
              can_delete: false,
            }),
            arr.push(sentObj)
            //console.log(arr, "arrrr")
          );
        });
      setAddRoleAccessArr(arr);
      // setAddRoleAccessArr(roleAccessLit && roleAccessLit.access);
    }
  }, [roleDetails && roleDetails._id]);

  //console.log(roleAccessArr, "listtttttttttttt");

  const handleChange = (e, modileId, accessType, index) => {
    /////////////// for add access data ///////////////
    const toAdd = [...addRoleAccessArr];
    if (toAdd[index]) {
      toAdd[index]["module"] = modileId;
      if (accessType == "can_view") {
        toAdd[index][accessType] = e.target.checked;
      } else if (accessType == "can_edit") {
        toAdd[index][accessType] = e.target.checked;
      } else if (accessType == "can_delete") {
        toAdd[index][accessType] = e.target.checked;
      }
    }
    setAddRoleAccessArr(toAdd);

    /////// for update access data ///////////////

    const toUpdate = [...roleAccessArr];

    if (toUpdate[index]) {
      toUpdate[index]["module"] = modileId;
      if (accessType == "can_view") {
        toUpdate[index][accessType] = e.target.checked;
      } else if (accessType == "can_edit") {
        toUpdate[index][accessType] = e.target.checked;
      } else if (accessType == "can_delete") {
        toUpdate[index][accessType] = e.target.checked;
      }
    }

    setRoleAccessArr(toUpdate);

    /////// for show access data ///////////////
    let showArr = [...showRoleAccessArr];

    if (showArr[index]) {
      showArr[index][module._id] = modileId;
      if (accessType == "can_view") {
        showArr[index]["can_view"] =
          accessType == "can_view" && e.target.checked;
      } else if (accessType == "can_edit") {
        showArr[index]["can_edit"] =
          accessType == "can_edit" && e.target.checked;
      } else if (accessType == "can_delete") {
        showArr[index]["can_delete"] =
          accessType == "can_delete" && e.target.checked;
      }
    }

    //console.log(roleAccessArr, "roleAccessArr");
    //console.log(toUpdate, "toUpdate");
    //console.log(toAdd, "toAdd");
    //console.log(showArr, "showArr");

    setShowRoleAccessArr(showArr);
  };
  /**
   * @setRoleAccessFunc : API call function for set module access to user
   */
  const setRoleAccessFunc = (e) => {
    e.preventDefault();
    let accessId = roleAccessLit && roleAccessLit._id;
    let updateBody = {
      access: roleAccessArr,
    };
    let body = {
      role: roleDetails && roleDetails._id,
      access: addRoleAccessArr,
    };

    //console.log(accessId, "accessId", updateBody, "updateBody", body, "body");
    if (addShgData && addShgData._id) {
      setLoader(true);
      axios
        .patch(api + "role-module/update/" + accessId, updateBody, axiosConfig)
        .then((res) => {
          //console.log(res);
          setLoader(false);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            setErorMessage("");
            handleClick();
            setMessagType("success");
            setUpdateMessage(res && res.data.message);
            //console.log(data, res);
            setRoleAccessArr([]);
            setAddRoleAccessArr([]);
            setShowRoleAccessArr([]);
            setRoleDetails({});
            dispatch(getRoleList());
            setModalAddShow(false);
            setAccessModalAddShow(false);
          } else {
            handleClick();
            setMessagType("error");
            setUpdateMessage(res && res.data.message);
          }
        })
        .catch((error) => {
          setLoader(false);
          //console.log(error);
          handleClick();
          setMessagType("error");
          setUpdateMessage(error && error.message);
        });
    } else {
      setLoader(true);
      axios
        .post(api + "role-module/create", body, axiosConfig)
        .then((res) => {
          //console.log(res);
          setLoader(false);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            setErorMessage("");
            handleClick();
            setMessagType("success");
            setUpdateMessage(res && res.data.message);
            //console.log(data, res);
            setRoleAccessArr([]);
            setShowRoleAccessArr([]);
            setAddRoleAccessArr([]);
            setRoleDetails({});
            dispatch(getRoleList());
            setModalAddShow(false);
            setAccessModalAddShow(false);
          } else {
            handleClick();
            setMessagType("error");
            setUpdateMessage(res && res.data.message);
          }
        })
        .catch((error) => {
          setLoader(false);
          //console.log(error);
          handleClick();
          setMessagType("error");
          setUpdateMessage(error && error.message);
        });
    }
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
              <h2 className="page_title">Role List</h2>
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

            <RoleListDataTable
              selectedProduct5={selectedProduct5}
              authorityList={roleList && roleList.length > 0 && roleList}
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />
          </div>
        </div>
        {importCsvOpenModel === true && (
          <Modal
            show={importCsvOpenModel}
            onHide={onCancel}
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
        {roleDetails && !roleDetails._id && (
          <Modal
            className="addFormModal"
            show={modalAddShow}
            onHide={setModalAddShow}
            size="lg"
            backdrop="static"
            aria-labelledby="reason-modal"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {addShgData && addShgData._id ? "Update Role" : "Add Role"}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="site_form_wraper">
                <Form>
                  <Row>
                    <Form.Group className="form-group" as={Col} md="6">
                      <Form.Label>Role </Form.Label>
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
                        onPaste={(e) => {
                          e.preventDefault();
                        }}
                        // {...register("number", { required: true})}
                      />
                      {fieldData.field == "name" && (
                        <small className="mt-4 mb-2 text-danger">
                          {fieldData && fieldData.message}
                        </small>
                      )}
                    </Form.Group>
                    <Form.Group className="form-group" as={Col} md="6">
                      <Form.Label>Reporting To</Form.Label>
                      <Form.Select
                        name="reporting_to"
                        value={addShgData && addShgData?.reporting_to?._id}
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
                        {roleList &&
                          roleList.length > 0 &&
                          roleList.map((item) => {
                            return (
                              <option value={item && item._id}>
                                {item && item.name}
                              </option>
                            );
                          })}
                      </Form.Select>
                      {fieldData.field == "reporting_to" && (
                        <small className="mt-4 mb-2 text-danger">
                          {fieldData && fieldData.message}
                        </small>
                      )}
                    </Form.Group>
                  </Row>
                  <Row className="justify-content-between">
                    {addShgData && !addShgData._id && (
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
                    )}
                    <Form.Group as={Col} xs="auto">
                      <Button
                        type="submit"
                        disabled={loader == true ? true : false}
                        onClick={addShgFunc}
                        className="submit_btn shadow-0"
                      >
                        {loader && loader === true ? (
                          <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                        ) : addShgData && addShgData._id ? (
                          "Save"
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </Form.Group>
                  </Row>
                </Form>

                {addShgData && addShgData._id && (
                  <Form id="field-view">
                    {tableLoader && tableLoader === true ? (
                      <div class="spinner-border bigSpinner text-info"></div>
                    ) : (
                      showRoleAccessArr &&
                      showRoleAccessArr.length > 0 && (
                        <div className="white_box_shadow_20 survivorsFormCard mb-4">
                          <Row className="justify-content-between">
                            <h3 className="forminnertitle mb-4">Set Access</h3>
                            <div className="survivors_table_wrap survivors_table_wrap_gap position-relative mb-4">
                              <table className="table table-borderless mb-0">
                                <thead>
                                  <tr>
                                    <th width="40%">List of Survivor</th>
                                    <th width="20%">
                                      <label className="viewhead">View</label>
                                    </th>
                                    <th width="20%">
                                      <label className="edithead">Edit</label>
                                    </th>
                                    <th width="20%">
                                      <label className="deletehead">
                                        Delete
                                      </label>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {showRoleAccessArr &&
                                    showRoleAccessArr.length > 0 &&
                                    showRoleAccessArr.map((item, index) => {
                                      return (
                                        <tr>
                                          <td>
                                            {item &&
                                              item.module &&
                                              item.module.name}
                                          </td>
                                          <td>
                                            <FormControl
                                              component="fieldset"
                                              variant="standard"
                                            >
                                              <FormGroup>
                                                <FormControlLabel
                                                  control={
                                                    <Switch
                                                      checked={item.can_view}
                                                      onChange={(e) =>
                                                        handleChange(
                                                          e,
                                                          item &&
                                                            item.module &&
                                                            item.module._id,
                                                          "can_view",
                                                          index
                                                        )
                                                      }
                                                      inputProps={{
                                                        "aria-label":
                                                          "controlled",
                                                      }}
                                                    />
                                                  }
                                                  label={
                                                    item &&
                                                    item.can_view == true
                                                      ? "Yes"
                                                      : "No"
                                                  }
                                                />
                                              </FormGroup>
                                            </FormControl>
                                          </td>
                                          <td>
                                            <FormControl
                                              component="fieldset"
                                              variant="standard"
                                            >
                                              <FormGroup>
                                                <FormControlLabel
                                                  control={
                                                    <Switch
                                                      checked={item.can_edit}
                                                      onChange={(e) =>
                                                        handleChange(
                                                          e,
                                                          item &&
                                                            item.module &&
                                                            item.module._id,
                                                          "can_edit",
                                                          index
                                                        )
                                                      }
                                                      inputProps={{
                                                        "aria-label":
                                                          "controlled",
                                                      }}
                                                    />
                                                  }
                                                  label={
                                                    item &&
                                                    item.can_edit == true
                                                      ? "Yes"
                                                      : "No"
                                                  }
                                                />
                                              </FormGroup>
                                            </FormControl>
                                          </td>
                                          <td>
                                            <FormControl
                                              component="fieldset"
                                              variant="standard"
                                            >
                                              <FormGroup>
                                                <FormControlLabel
                                                  control={
                                                    <Switch
                                                      checked={item.can_delete}
                                                      onChange={(e) =>
                                                        handleChange(
                                                          e,
                                                          item &&
                                                            item.module &&
                                                            item.module._id,
                                                          "can_delete",
                                                          index
                                                        )
                                                      }
                                                      inputProps={{
                                                        "aria-label":
                                                          "controlled",
                                                      }}
                                                    />
                                                  }
                                                  label={
                                                    item &&
                                                    item.can_delete == true
                                                      ? "Yes"
                                                      : "No"
                                                  }
                                                />
                                              </FormGroup>
                                            </FormControl>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </table>
                            </div>
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
                                  className="submit_btn text-uppercase"
                                  disabled={loader == true ? true : false}
                                  onClick={setRoleAccessFunc}
                                  type="submit"
                                >
                                  {loader && loader === true ? (
                                    <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                                  ) : (
                                    "Confirm"
                                  )}
                                </Button>
                              </Form.Group>
                            </Row>
                            {/* } */}
                          </Row>
                        </div>
                      )
                    )}
                  </Form>
                )}
              </div>
            </Modal.Body>
          </Modal>
        )}
        {roleDetails && roleDetails._id && (
          <Modal
            className="addFormModal"
            show={accessModalAddShow}
            onHide={setAccessModalAddShow}
            size="lg"
            backdrop="static"
            aria-labelledby="reason-modal"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Set Access
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="site_form_wraper">
                <Form id="field-view">
                  {tableLoader && tableLoader === true ? (
                    <div class="spinner-border bigSpinner text-info"></div>
                  ) : (
                    moduleList &&
                    moduleList.length > 0 &&
                    moduleList && (
                      <div className="white_box_shadow_20 survivorsFormCard mb-4">
                        <Row className="justify-content-between">
                          <h3 className="forminnertitle mb-4">Set Access</h3>
                          <div className="survivors_table_wrap survivors_table_wrap_gap position-relative mb-4">
                            <table className="table table-borderless mb-0">
                              <thead>
                                <tr>
                                  <th width="40%">List of Survivor</th>
                                  <th width="20%">
                                    <label className="viewhead">View</label>
                                  </th>
                                  <th width="20%">
                                    <label className="edithead">Edit</label>
                                  </th>
                                  <th width="20%">
                                    <label className="deletehead">Delete</label>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {moduleList &&
                                  moduleList.length > 0 &&
                                  moduleList.map((item, index) => {
                                    return (
                                      <tr>
                                        <td>{item && item.name}</td>
                                        <td>
                                          <FormControl
                                            component="fieldset"
                                            variant="standard"
                                          >
                                            <FormGroup>
                                              <FormControlLabel
                                                control={
                                                  <Switch
                                                    // checked={item.can_view}
                                                    onChange={(e) =>
                                                      handleChange(
                                                        e,
                                                        item._id,
                                                        "can_view",
                                                        index
                                                      )
                                                    }
                                                    inputProps={{
                                                      "aria-label":
                                                        "controlled",
                                                    }}
                                                  />
                                                }
                                                // label={
                                                //   "Yes"
                                                // item && item.can_view == true
                                                //   ? "Yes"
                                                //   : "No"
                                                // }
                                              />
                                            </FormGroup>
                                          </FormControl>
                                        </td>
                                        <td>
                                          <FormControl
                                            component="fieldset"
                                            variant="standard"
                                          >
                                            <FormGroup>
                                              <FormControlLabel
                                                control={
                                                  <Switch
                                                    // checked={item.can_edit}
                                                    onChange={(e) =>
                                                      handleChange(
                                                        e,
                                                        item._id,
                                                        "can_edit",
                                                        index
                                                      )
                                                    }
                                                    inputProps={{
                                                      "aria-label":
                                                        "controlled",
                                                    }}
                                                  />
                                                }
                                                // label={
                                                //   "Yes"
                                                // item && item.can_view == true
                                                //   ? "Yes"
                                                //   : "No"
                                                // }
                                                // label={
                                                //   item && item.can_edit == true
                                                //     ? "Yes"
                                                //     : "No"
                                                // }
                                              />
                                            </FormGroup>
                                          </FormControl>
                                        </td>
                                        <td>
                                          <FormControl
                                            component="fieldset"
                                            variant="standard"
                                          >
                                            <FormGroup>
                                              <FormControlLabel
                                                control={
                                                  <Switch
                                                    // checked={item.can_delete}
                                                    onChange={(e) =>
                                                      handleChange(
                                                        e,
                                                        item._id,
                                                        "can_delete",
                                                        index
                                                      )
                                                    }
                                                    inputProps={{
                                                      "aria-label":
                                                        "controlled",
                                                    }}
                                                  />
                                                }
                                                // label={
                                                //   item && item.can_delete == true
                                                //     ? "Yes"
                                                //     : "No"
                                                // }
                                              />
                                            </FormGroup>
                                          </FormControl>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>

                          <Form.Group as={Col} xs="auto">
                            <Button
                              className="submit_btn text-uppercase"
                              disabled={loader == true ? true : false}
                              onClick={setRoleAccessFunc}
                              type="submit"
                            >
                              {loader && loader === true ? (
                                <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                              ) : (
                                "Confirm"
                              )}
                            </Button>
                          </Form.Group>
                          {/* } */}
                        </Row>
                      </div>
                    )
                  )}
                </Form>
              </div>
            </Modal.Body>
          </Modal>
        )}
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

export default AddRole;
