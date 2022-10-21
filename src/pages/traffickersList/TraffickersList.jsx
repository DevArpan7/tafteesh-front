import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import {
  findAncestor,
  goToTraffickerView,
  goToTraffickerAction,
} from "../../utils/helper";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import { getTraffickerList } from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NotificationPage from "../../components/NotificationPage";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import TraffickersDataTableList from "./TraffickersDataTableList";
import AlertComponent from "../../components/AlertComponent";
import TraffickerActionList from "./TraffickerActionList";
// import { FormatColorReset } from '@mui/icons-material';

const TraffickersList = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [userId, setUserId] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [addTraffickerData, setAddTraffickerData] = useState({});
  const [addSourceData, setAddSourceData] = useState({});
  const [addDestinationData, setAddDestinationData] = useState({});
  const [resultLoad, setResultLoad] = useState(false);
  const traffickerList = useSelector((state) => state.traffickerList);
  const history = useHistory();
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const loguserId = localStorage.getItem("userId");
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const dispatch = useDispatch();
  const [fileSelect, setFileSelect] = useState([]);
  const [pictureData, setPictureData] = useState({});
  const [pictureArr, setPictureArr] = useState([]);

  const [trafficimage, setTrafficimage] = useState();
  const [messagType, setMessagType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
  const [alertFlag, setAlertFlag] = useState("");
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getTraffickerList());

    // dispatch(getTraffickerActionData());
  }, [props]);

  //console.log(traffickerList,"traffickerList")

  const gotoActionList = (e, flag) => {
    if (!userId) {
      setShowAlert(true);
      setAlertMessage("Please select one Trafficker");
      setAlertFlag("alert");
    } else {
      goToTraffickerAction(e, userId, flag, history);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  const onHandleChange = (e) => {
    setAddTraffickerData({
      ...addTraffickerData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [traffickerList]);

  const onSelectRow = (data) => {
    // //console.log(data, "traficId");
    if (data !== null) {
      setActiveClass(true);
      setSelectedProduct5(data);
      setUserId(data._id);
    } else {
      setActiveClass(false);
      setSelectedProduct5(null);
      setUserId("");
    }
  };
  const gotoEdit = () => {
    if (!userId) {
      setShowAlert(true);
      setAlertMessage("Please select a Trafficker");
      setAlertFlag("alert");
    } else {
      setModalAddShow(true);
      getTraffickerDetails(userId);
      setPictureArr([]);
      setFileSelect([]);
      setPictureData({});
    }
  };

  const gotoView = (e) => {
    if (!userId) {
      setShowAlert(true);
      setAlertMessage("Please select a trafficker");
      setAlertFlag("alert");
    } else {
      goToTraffickerView(e, userId, history);
    }
  };

  const removeSelection = () => {
    setActiveClass(false);
    setUserId("");
    setAddTraffickerData({});
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // setModalAddShow(false);
    // setPictureData({});
    // setAddTraffickerData({});
    // setAddDestinationData({});
    // setAddSourceData({});
  };

  const onCancel = () => {
    setModalAddShow(false);
    setPictureData({});
    // setAddTraffickerData({});
    setSelectedProduct5(null);
    setAddDestinationData({});
    setAddSourceData({});
    setPictureArr([]);
    setFileSelect([]);
    setPictureData({});
  };

  /////////////////////file upload function/////////////////////////
  const handleFileInput = (e) => {
    console.log(e, e.target.files[0]);
    let data = e.target.files[0];
    if (
      (e.target.files.length > 0 && e.target.files[0].type == "image/png") ||
      e.target.files[0].type == "image/jpg" ||
      e.target.files[0].type == "image/jpeg"
    ) {
      setFileSelect([...fileSelect, e.target.files[0]]);
    }
    storeFile(data);
  };


  const [imageLoader,setImageLoader]= useState(false)
  const storeFile = (file) => {
    //console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    setImageLoader(true)
    axios
      .post(
        "https://tafteesh-staging-node.herokuapp.com/api/file/upload",
        formData,
        axiosConfig
      )
      .then(function (response) {
        setImageLoader(false)
        //console.log("successfully uploaded", response);
        if (response && response.data.error === false) {
          const { data } = response;

          if (
            (data &&
              data.data &&
              data.data.file &&
              data.data.file.mimetype == "image/png") ||
            data.data.file.mimetype == "image/jpg" ||
            data.data.file.mimetype == "image/jpeg"
          ) {
            setPictureData(data.data);
            let image = `https://tafteesh-staging-node.herokuapp.com/${
              data.data && data.data.filePath
            }`;
            if (data.data && data.data.filePath !== undefined) {
              setPictureArr([...pictureArr, image]);
            }
          } else {
            handleClick();
            setUpdateMessage("upload only png,jpg,jpeg format");
            setMessagType("error");
          }

        } else {
          handleClick();
          setUpdateMessage("upload only png,jpg,jpeg format");
          setMessagType("error");
        }
      })
      .catch((err) => {
        setImageLoader(false)

        //console.log(err);
      });
  };

  // useEffect(() => {
  //   //console.log(fileSelect, "fileSelect");
  //   let image = `https://tafteesh-staging-node.herokuapp.com/${
  //     pictureData && pictureData.filePath
  //   }`;
  //   if (pictureData && pictureData.filePath !== undefined) {
  //     setPictureArr([...pictureArr, image]);
  //   }
  // }, [pictureData && pictureData.filePath]);

  useEffect(() => {
    if (
      addTraffickerData &&
      addTraffickerData.image &&
      addTraffickerData.image.length > 0
    ) {
      setPictureArr(addTraffickerData && addTraffickerData.image);
    }
  }, [addTraffickerData && addTraffickerData._id]);

  //console.log(pictureArr, "pictureArr");
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  /* api call for trafficker detail */
  useEffect(() => {
    if (userId) {
      getTraffickerDetails(userId);
      traffickerActionDetails(userId);
    }
  }, [userId]);

  const [detailsLoader, setDetailsLoader] = useState(false);
  /////////// trafficker details API call ////////////
  const traffickerActionDetails = (id) => {
    // console.log(id, "userId");

    if (id) {
      setDetailsLoader(true);
      axios
        .get(api + "/survival-trafficker/action-list/" + id, axiosConfig)
        .then((response) => {
          //console.log(response, "daaaaa");

          if (response.data && response.data.error === false) {
            const { data } = response;
            setDetailsLoader(false);
          }
        })
        .catch((error) => {
          //console.log(error, "user details error");
          setDetailsLoader(false);
        });
    }
  };

  const getTraffickerDetails = (id) => {
    //console.log(id);
    axios
      .get(api + "/trafficker-profile/detail/" + id, axiosConfig)
      .then((response) => {
        //console.log(response, "daaaaa");
        if (response.data && response.data.error === false) {
          const { data } = response;
          setAddTraffickerData(data.data);

          setAddDestinationData(
            data.data && data.data.destination && data.data.destination
          );
          setAddSourceData(
            data.data && data.data.sourceArea && data.data.sourceArea
          );
        }
      })
      .catch((error) => {
        //console.log(error, "user details error");
      });
  };
  useEffect(() => {
    setAddTraffickerData({
      ...addTraffickerData,
      destination: addDestinationData,
    });
  }, [addDestinationData]);
  useEffect(() => {
    setAddTraffickerData({
      ...addTraffickerData,
      sourceArea: addSourceData,
    });
  }, [addSourceData]);

  useEffect(() => {
    if (addTraffickerData && addTraffickerData.trafficker_name) {
      setFieldData({ field: "trafficker_name", message: "" });
    } else if (addTraffickerData && addTraffickerData.gender) {
      setFieldData({ field: "gender", message: "" });
    } else if (addTraffickerData && addTraffickerData.age) {
      setFieldData({ field: "age", message: "" });
    }
    // else if (addTraffickerData && addTraffickerData.relation_with_survivor) {
    //   setFieldData({ field: "relation_with_survivor", message: "" });
    // }
    else if (addTraffickerData && addTraffickerData.identification_mark) {
      setFieldData({ field: "identification_mark", message: "" });
    } else {
      setFieldData({ field: "", message: "" });
    }
  }, [addTraffickerData]);

  const addUserFunc = (e) => {
    e.preventDefault();

    if (addTraffickerData && !addTraffickerData.trafficker_name) {
      setFieldData({ field: "trafficker_name", message: "Please enter Name" });
    } else if (addTraffickerData && !addTraffickerData.gender) {
      setFieldData({ field: "gender", message: "Please select Gender" });
    } else if (addTraffickerData && !addTraffickerData.age) {
      setFieldData({
        field: "age",
        message: "Please enter Age",
      });
    } else if (addTraffickerData && !addTraffickerData.identification_mark) {
      setFieldData({
        field: "identification_mark",
        message: "Please write Identification Mark",
      });
    } else {
      setFieldData({
        field: "",
        message: "",
      });

      var objData = {
        ...addTraffickerData,
        image: pictureArr && pictureArr,

        // "photograph": pictureArr
      };
      var body = objData;
      if (userId) {
        setLoader(true);
        axios
          .patch(
            api + "/trafficker-profile/update/" + userId,
            body,
            axiosConfig
          )
          .then((res) => {
            console.log(res);
            setLoader(false);

            // setResultLoad(FormatColorReset)
            if (res && res.data && res.data.error == false) {
              const { data } = res;
              handleClick();
              setUpdateMessage(res && res.data.message);
              setMessagType("success");
              //console.log(data, res);
              dispatch(getTraffickerList());
              // setPictureData({})
              setTrafficimage({});
              // setAddTraffickerData({})
              setPictureArr([]);
              setPictureData({});
              setFileSelect([]);
              setModalAddShow(false);
            } else {
              handleClick();
              setUpdateMessage(res && res.data.message);
              setMessagType("error");
            }
          })
          .catch((error) => {
            setLoader(false);
            handleClick();
            setUpdateMessage(error && error.message);
            setMessagType("error");
            //console.log(error);
          });
      } else {
        setLoader(true);
        axios
          .post(api + "/trafficker-profile/create", body, axiosConfig)
          .then((res) => {
            // console.log(res);

            setLoader(false);
            if (res && res.data && res.data.error == false) {
              const { data } = res;
              handleClick();
              setMessagType("success");
              setUpdateMessage(res && res.data.message);
              //console.log(data, res);
              dispatch(getTraffickerList());
              setTrafficimage({});
              // setAddTraffickerData({})
              setPictureArr([]);
              setPictureData({});
              setFileSelect([]);
              setModalAddShow(false);
            } else {
              handleClick();
              setMessagType("error");
              setUpdateMessage(res && res.data.message);
            }
          })
          .catch((error) => {
            setLoader(false);
            handleClick();
            setUpdateMessage(error && error.message);
            setMessagType("error");
            //console.log(error);
          });
      }
    }
  };

  /////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (!userId) {
      setShowAlert(true);
      setAlertMessage("Please select a trafficker");
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
      .patch(api + "/trafficker-profile/delete/" + userId, axiosConfig)
      .then((response) => {
        setDeleteLoader(false);
        if (response.data && response.data.error === false) {
          const { data } = response;
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success");
          setUserId("");
          dispatch(getTraffickerList());
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

  // csv download
  const exportToCsv = (e) => {
    e.preventDefault();

    // Headers for each column
    let headers = [
      "ID, Trafficker Name, Gender, Identification Mark, Residential Address, Survivor Count,Is Trafficker",
    ];

    // Convert users data to a csv
    let usersCsv = traffickerList.reduce((acc, user) => {
      const {
        _id,
        trafficker_name,
        gender,
        identification_mark,
        residential_address,
        survivor_count,
        is_trafficker,
      } = user;
      acc.push(
        [
          _id,
          trafficker_name,
          gender,
          identification_mark,
          residential_address,
          survivor_count,
          is_trafficker ? "YES" : "NO",
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "traffickers.csv",
      fileType: "text/csv",
    });
  };

  //// pdf download /////
  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(20);
    doc.text("TRAFFICKER LIST", 22, 60);
    doc.setFontSize(10);
    const traffickerColumns = [
      "ID",
      "NAME",
      "GENDER",
      "RESD. ADDR.",
      "IS TRAFFICKER",
    ];
    const name = "trafficker-list" + new Date().toISOString() + ".pdf";
    let traffickerRows = [];
    traffickerList?.forEach((item) => {
      const temp = [
        item._id,
        item.trafficker_name,
        item.gender,
        item.residential_address,
        item.is_trafficker ? "YES" : "NO",
      ];
      traffickerRows.push(temp);
      console.log("traffickerRows", traffickerRows);
    });
    doc.autoTable(traffickerColumns, traffickerRows, {
      startY: 75,
      startX: 22,
    });
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
              <h2 className="page_title">Traffickers List</h2>
            </div>
          </div>
          <div className="white_box_shadow_20 survivors_table_wrap vieweditdeleteMargin40 position-relative">
            <div className="vieweditdelete">
              <Dropdown align="end">
                <Dropdown.Menu>
                  <Dropdown.Item onClick={exportToCsv}>CSV</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown className="me-1">
                <Dropdown.Toggle variant="border" className="shadow-0">
                  Action
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={exportToCsv}>
                    Download CSV
                  </Dropdown.Item>
                  <Dropdown.Item onClick={downloadPdf}>
                    Download PDF
                  </Dropdown.Item>
                  <Dropdown.Item onClick={(e) => gotoActionList(e, "survivor")}>
                    Survivors
                  </Dropdown.Item>
                  <Dropdown.Item onClick={(e) => gotoActionList(e, "images")}>
                    Image
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => gotoActionList(e, "chargesheet")}
                  >
                    ChargeSheet
                  </Dropdown.Item>
                  <Dropdown.Item onClick={(e) => gotoActionList(e, "fir")}>
                    FIR
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "view_btn add_btn" }}
                title="Add"
              >
                <span
                  onClick={() => {
                    setModalAddShow(true);
                    removeSelection();
                  }}
                >
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag={"a"}
                wrapperProps={{ className: "view_btn add_btn" }}
                title="View"
              >
                <span onClick={(e) => gotoView(e)}>
                  <i className="fal fa-eye"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag={"a"}
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <span
                  onClick={() => {
                    gotoEdit();
                  }}
                >
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
            <TraffickersDataTableList
              traffickerList={
                traffickerList && traffickerList.length > 0 && traffickerList
              }
              selectedProduct5={selectedProduct5}
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />
          </div>
        </div>

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
              {addTraffickerData && addTraffickerData._id
                ? "Update Traffickers"
                : "Add Traffickers"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form>
                <Row>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>
                      Name of Trafficker / Accused{" "}
                      <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      name="trafficker_name"
                      defaultValue={
                        addTraffickerData &&
                        addTraffickerData.trafficker_name &&
                        addTraffickerData.trafficker_name
                      }
                      type="text"
                      placeholder=""
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
                    {fieldData.field == "trafficker_name" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="form-group">
                    <Form.Label>
                      Gender <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Select
                      onChange={(e) =>
                        setAddTraffickerData({
                          ...addTraffickerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      name="gender"
                      value={
                        addTraffickerData &&
                        addTraffickerData.gender &&
                        addTraffickerData.gender
                      }
                    >
                      <option value={""} hidden="true">
                        Open this select menu
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="transgender">Transgender</option>
                      {/* <option value="others">Others</option> */}
                    </Form.Select>
                    {fieldData.field == "gender" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>
                      Age<span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      name="age"
                      type="text"
                      placeholder=""
                      onChange={onHandleChange}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                      defaultValue={
                        addTraffickerData &&
                        addTraffickerData.age &&
                        addTraffickerData.age
                      }
                    />
                    {fieldData.field == "age" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="6" className="form-group">
                    <Form.Label>Residential address</Form.Label>
                    <Form.Control
                      // onChange={(e) =>
                      //   setAddTraffickerData({
                      //     ...addTraffickerData,
                      //     [e.target.name]: e.target.value,
                      //   })
                      // }
                      onChange={onHandleChange}
                      onKeyPress={(e) => {
                        if (!/[a-z A-Z 0-9 /\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                      name="residential_address"
                      type="text"
                      placeholder=""
                      defaultValue={
                        addTraffickerData &&
                        addTraffickerData.residential_address &&
                        addTraffickerData.residential_address
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="6" className="form-group">
                    <Form.Label>
                      Identification Mark{" "}
                      <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      name="identification_mark"
                      type="text"
                      placeholder=""
                      // onChange={(e) =>
                      //   setAddTraffickerData({
                      //     ...addTraffickerData,
                      //     [e.target.name]: e.target.value,
                      //   })
                      // }
                      onChange={onHandleChange}
                      onKeyPress={(e) => {
                        if (!/[a-z A-Z \s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                      defaultValue={
                        addTraffickerData &&
                        addTraffickerData.identification_mark &&
                        addTraffickerData.identification_mark
                      }
                    />
                    {fieldData.field == "identification_mark" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  {/* <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      onChange={handleFileInput}
                      type="file"
                      multiple
                      name="file"
                      size="lg"
                      // defaultValue={addDocumentData && addDocumentData.file && addDocumentData.file}
                    />
                   {addTraffickerData && addTraffickerData.image && addTraffickerData.image.length > 0 && 
                    addTraffickerData.image.map((item)=>{
                    return(
                      <img
                      src={
                        item
                          && item
                         
                      }
                      alt=""
                    />
                    )
                  })
                    }
                  {fileSelect && fileSelect.length > 0 &&
                  fileSelect.map((item)=>{
                    return(
                      <img
                      src={
                        item
                          && URL.createObjectURL(item)
                      }
                      alt=""
                    />
                    )
                  })
                
} */}
                  <Form.Group
                    className="form-group"
                    as={Col}
                    md="6"
                    controlId="formFileSm"
                  >
                    <Form.Label>Upload Photo</Form.Label>
                    <div className="profileUpload fileUpload">
                      <Form.Control
                        onChange={(e) => handleFileInput(e, "picture")}
                        name="image"
                        type="file"
                        // multiple
                        accept="image/png,image/jpeg,application/pdf,application/docx,application/doc"
                      />
                      {addTraffickerData &&
                        addTraffickerData.image &&
                        addTraffickerData.image.length > 0 &&
                        addTraffickerData.image.map((item) => {
                          return <img src={item} alt="" />;
                        })}
                      <div className="profileUploadText fileUploadText">
                        {fileSelect && fileSelect.length > 0 ? (
                          fileSelect.map((item) => {
                            // console.log(item,"itemitem")
                            return (
                              <img
                                src={item && URL.createObjectURL(item)}
                                alt=""
                              />
                            );
                          })
                        ) : (
                          <div className="profileUploadTextInner">
                            Upload Photo
                            <span>Choose a file</span>
                          </div>
                        )}
                      </div>

                      <div className="profileUploadText fileUploadText">
                        {(fileSelect && fileSelect.length == 0) ||
                          (addTraffickerData &&
                            addTraffickerData.image &&
                            addTraffickerData.image.length > 0 && (
                              <div className="profileUploadTextInner">
                                Upload Photo
                                <span>Choose a file</span>
                              </div>
                            ))}
                      </div>
                    </div>
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
                      // disabled={resultLoad}
                      disabled={imageLoader ==true ? true : loader == true ? true : false}
                      onClick={(e) => addUserFunc(e)}
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
          showAlert={showAlert}
          alertFlag={alertFlag}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
          deleteLoader={deleteLoader}
        />
      )}
    </>
  );
};

export default TraffickersList;
