import React, { useState, useEffect } from "react";
import { Topbar, SurvivorTopCardExtra } from "../../components";

import { Link } from "react-router-dom";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBTooltip,
  MDBBtn,
} from "mdb-react-ui-kit";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col } from "react-bootstrap";
import { MDBAccordion, MDBAccordionItem } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { InputGroup } from "react-bootstrap";

import {
  getSurvivorPcList,
  getSurvivorDetails,
  getPcEscalationList,
  getModulesChangeLog,
  getPcEscResultList,
} from "../../redux/action";
import moment from "moment";
import DataTablePcFilter from "./DataTablePcFilter";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";
import { gotoSurvivorArchive } from "../../utils/helper";

const SurvivorProceduralCorrection = (props) => {
  const [modalPCShow, setModalPCShow] = useState(false);
  const [modalPCEscalationShow, setModalPCEscalationShow] = useState(false);
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const survivorPcList = useSelector((state) => state.survivorPcList);
  const [addPcData, setAddPcData] = useState({});
  const [addPcEscalationData, setAddPcEscalationData] = useState({});
  const masterPcWhyList = useSelector((state) => state.masterPcWhyList);
  const masterPcCurrentStatusList = useSelector(
    (state) => state.masterPcCurrentStatusList
  );
  const masterResOfProsecutionList = useSelector(
    (state) => state.masterResOfProsecutionList
  );
  const [resultLoad2, setResultLoad2] = useState(false);
  const [resultLoad, setResultLoad] = useState(false);
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [messageType, setMessageType] = useState("");

  const masterDocumentTypeData = useSelector(
    (state) => state.masterDocumentTypeData
  );
  const escalatedtTypeList = useSelector((state) => state.escalatedtTypeList);
  const masterPcResultData = useSelector((state) => state.masterPcResultData);
  const pcEscResultList = useSelector((state) => state.pcEscResultList);

  const escalatedResonList = useSelector((state) => state.escalatedResonList);
  const pcEscalationList = useSelector((state) => state.pcEscalationList);
  const masterSurvivorFirData = useSelector(
    (state) => state.masterSurvivorFirData
  );
  const masterSurvivorInvestigationData = useSelector(
    (state) => state.masterSurvivorInvestigationData
  );
  const masterSurvivorChargesheetData = useSelector(
    (state) => state.masterSurvivorChargesheetData
  );

  const masterSurvivrCourtData = useSelector(
    (state) => state.masterSurvivrCourtData
  );
  const [pcEscSelected, setPcEscalSelected] = useState({});
  const [activePcEscalClass, setActivePcEscalClass] = useState(false);
  const [modalInactiveShow, setmodalInactiveShow] = useState(false);
  const [docId, setDocId] = useState("");
  const [reason, setReason] = useState({});
  const masterSurvivorLawyersData = useSelector(
    (state) => state.masterSurvivorLawyersData
  );
  const [esclFlag, setEsclFlag] = useState("");
  const [validated, setValidated] = useState(false);
  const [validatedEscal1, setValidatedEscal1] = useState(false);
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const [messagType, setMessagType] = useState("");

  const [pcDocDetails, setPcDocDetails] = useState({});
  const currentModule = localStorage.getItem("currentModule");
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));
  const [pcDetailsLoader, setPcDetailsLoader] = useState(false);
  useEffect(() => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "pc" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));
  }, [props]);

  const handleShow = () => {
    //console.log("select");
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setAlertMessage("");
    setAlertFlag("");
    setShowAlert(false);
  };
  useEffect(() => {
    if (props.location.state) {
      dispatch(getSurvivorPcList(props.location.state));
      dispatch(getSurvivorDetails(props.location.state));
    }
  }, [props]);
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [selectedData, setSelectedData] = useState({});
  const [activeClass, setActiveClass] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [customError, setCustomError] = useState({ name: "", message: "" });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [survivorPcList]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onSelectRow = (item) => {
    // //console.log(item, "item");
    if (item !== null) {
      pcDetailsFunction(item);
      setSelectedData(item);
      setSelectedProduct5(item);
      setActiveClass(true);
      if (
        item &&
        item.escalation_required &&
        item.escalation_required === true
      ) {
        setAlertFlag("add");
        setAlertMessage("Escalation marked YES, Would you like add ?");
        handleShow();
      } else {
        setShowAlert(false);
      }
    } else {
      pcDetailsFunction({});
      setSelectedData({});
      setSelectedProduct5(null);
      setActiveClass(false);
    }
  };
  const onGotoAddPc = () => {
    setModalPCShow(true);
    setSelectedData({});
    setAddPcData({});
    setSelectedData({});
    setSelectedProduct5(null);
  };

  const onGotoEditPc = () => {
    if (!selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one PC to edit");
      setAlertFlag("alert");
    } else {
      setModalPCShow(true);
      setAddPcData(selectedData);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  const onCancel = () => {
    setModalPCShow(false);
    setAddPcData({});
    setActiveClass(false);
  };

  const onSelectedPcEscal = (item) => {
    setPcEscalSelected(item);
    setActivePcEscalClass(true);
  };

  /////////// pc details API call function ////////////

  const pcDetailsFunction = (data) => {
    setPcDetailsLoader(true);
    axios
      .get(api + "/survival-pc/detail/" + data._id, axiosConfig)
      .then((response) => {
        setPcDetailsLoader(false);
        if (response.data && response.data.error === false) {
          const { data } = response;
          // //console.log(data,"pc details")
          setPcDocDetails(data.docdetails);
        }
      })
      .catch((error) => {
        setPcDetailsLoader(false);
        // //console.log(error, "details error");
      });
  };

  //console.log(pcDocDetails, "pcDocDetails");

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one PC");
      setAlertFlag("alert");
    } else {
      setShowAlert(true);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  //////// delete function call //////////
  const onDeleteChangeEscalFunc = (flag) => {
    setEsclFlag(flag);
    if (pcEscSelected && !pcEscSelected._id) {
      setShowAlert(true);
      setAlertMessage("Please select one PC escalation");
      setAlertFlag("alert");
    } else {
      setShowAlert(true);
      setAlertMessage("");
      setAlertFlag("");
    }
  };
  const [deleteLoader, setDeleteLoader] = useState(false);

  const onDeleteFunction = () => {
    let body = {
      deleted_by: deletedById && deletedById,
      deleted_by_ref: "users",
    };
    // addPcEscalationData
    if (esclFlag === "escal") {
      setDeleteLoader(true);
      axios
        .patch(
          api + "/pc-escalation/delete/" + pcEscSelected._id,
          body,
          axiosConfig
        )
        .then((response) => {
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessageType("success")
          setPcEscalSelected({});
          setDeleteLoader(false);
          if (response.data && response.data.error === false) {
            const { data } = response;
            setEsclFlag("");
            dispatch(getPcEscalationList(selectedData && selectedData._id));
            setShowAlert(false);
            setErorMessage("");
          }
        })
        .catch((error) => {
          setDeleteLoader(false);

          ////console.log(error, "partner error");
        });
    } else {
      setDeleteLoader(true);

      axios
        .patch(
          api + "/survival-pc/delete/" + selectedData._id,
          body,
          axiosConfig
        )
        .then((response) => {
          setDeleteLoader(false);

          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessageType("success")

          if (response.data && response.data.error === false) {
            const { data } = response;
            setSelectedData({});
            dispatch(getSurvivorPcList(props.location && props.location.state));
            setShowAlert(false);
            setErorMessage("");
          }
        })
        .catch((error) => {
          setDeleteLoader(false);

          ////console.log(error, "partner error");
        });
    }
  };

  //console.log(addPcEscalationData, "addPcEscalationData");
  const onGotoAddPcEscalation = () => {
    if (selectedData && selectedData._id) {
      setShowAlert(false);
      setModalPCEscalationShow(true);
      setAddPcEscalationData({
        ...addPcEscalationData,
        source: selectedData && selectedData.source,
        pc_started_date: selectedData && selectedData.started_date,
        current_status:
          selectedData &&
          selectedData.current_status &&
          selectedData.current_status._id,
      });
      dispatch(getPcEscResultList());
      // setAddPcEscalationData({});
    } else {
      setShowAlert(true);
      setAlertMessage("Please select One PC to add Escalation !!");
      setAlertFlag("alert");
    }
  };

  // useEffect(() => {
  //   setAddPcEscalationData({
  //     ...addPcEscalationData,
  //    "sa": selectedData && selectedData.sa,
  //    "pc_started_date":  selectedData && selectedData.started_date,
  //    "current_status":selectedData && selectedData.current_status &&
  //    selectedData.current_status._id
  //   });
  // }, [selectedData&& selectedData]);

  const onGotoEditPcEscalation = () => {
    if (pcEscSelected && !pcEscSelected._id) {
      alert("Please select One Escalation to edit");
    } else {
      setModalPCEscalationShow(true);
      setAddPcEscalationData(pcEscSelected);
      dispatch(getPcEscResultList());
    }
  };

  const onVcEscalationCancel = () => {
    setModalPCEscalationShow(false);
    setAddPcEscalationData({});
  };

  const changeLogFunc = () => {
    let type = "pc";
    dispatch(getModulesChangeLog(type, deletedById, props.location.state));
    props.history.push("/change-log");
  };

  useEffect(() => {
    if (selectedData && selectedData._id) {
      dispatch(getPcEscalationList(selectedData && selectedData._id));
    }
  }, [selectedData && selectedData._id]);

  useEffect(() => {
    ////console.log(addPcData, "addPcData");
  }, [addPcData]);

  /////////////////////file upload function/////////////////////////
  const handleFileInput = (e, flag) => {
    // console.log(e.target.files)
    let data = e.target.files[0];

    storeFile(data, flag);
  };

  const storeFile = (file, flag) => {
    // console.log(file, "file");
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        "https://tafteesh-staging-node.herokuapp.com/api/file/upload",
        formData,
        axiosConfig
      )
      .then(function (response) {
        if (response && response.data.error === false) {
          const { data } = response;
          // console.log(data, "dataaa");
          if (flag == "escal") {
            setAddPcEscalationData({
              ...addPcEscalationData,
              document_url:
                "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
            });
          } else {
            setAddPcData({
              ...addPcData,
              document_url:
                "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
            });
          }
        } else {
          if (flag == "escal") {
            handleClick();
            setUpdateMessage(response.data.data.message);
            setMessagType("error");
            setAddPcEscalationData({
              ...addPcEscalationData,
              document_url: "",
            });
          } else {
            handleClick();
            setUpdateMessage(response.data.data.message);
            setMessagType("error");
            setAddPcData({
              ...addPcData,
              document_url: "",
            });
          }
        }
      })
      .catch((err) => {
        //console.log(err, "err");
        handleClick();
        setUpdateMessage(err.data.message);
        setMessagType("error");
      });
  };

  // console.log(addPcEscalationData,"addPcEscalationData")

  useEffect(() => {
    if (addPcData && addPcData.source) {
      setCustomError({
        name: "source",
        message: "",
      });
    } else if (addPcData && addPcData.started_date) {
      setCustomError({
        name: "started_date",
        message: "",
      });
      // setAppliedDateErr(false)
    } else if (addPcData && addPcData.why) {
      setCustomError({
        name: "why",
        message: "",
      });
    } else if (addPcData && addPcData.court) {
      setCustomError({
        name: "court",
        message: "",
      });
    } else if (addPcData && addPcData.current_status) {
      setCustomError({
        name: "current_status",
        message: "",
      });
    } else if (addPcData && addPcData.result_of_prosecution) {
      setCustomError({
        name: "result_of_prosecution",
        message: "",
      });
    } else if (addPcData && addPcData.document_type) {
      setCustomError({
        name: "document_type",
        message: "",
      });
    } else if (addPcData && addPcData.result_of_pc) {
      setCustomError({
        name: "result_of_pc",
        message: "",
      });
    } else if (addPcData && addPcData.escalation_required) {
      setCustomError({
        name: "escalation_required",
        message: "",
      });
    } else if (addPcData && addPcData.escalation_type) {
      setCustomError({
        name: "escalation_type",
        message: "",
      });
    } else if (addPcData && addPcData.escalation_reason) {
      setCustomError({
        name: "escalation_reason",
        message: "",
      });
    } else {
      setCustomError({ name: "", message: "" });
    }
  }, [addPcData]);

  ///////////// add pc api call function /////////

  const addPcFunc = (e) => {
    e.preventDefault();
    if (addPcData && !addPcData.source) {
      setCustomError({
        name: "source",
        message: "Please select Source",
      });
    } else if (addPcData && !addPcData.started_date) {
      setCustomError({
        name: "started_date",
        message: "Please select Date",
      });
      // setAppliedDateErr(false)
    } else if (addPcData && !addPcData.why) {
      setCustomError({
        name: "why",
        message: "Please select Why",
      });
    } else if (addPcData && !addPcData.court) {
      setCustomError({
        name: "court",
        message: "Please select Court",
      });
    } else if (addPcData && !addPcData.current_status) {
      setCustomError({
        name: "current_status",
        message: "Please select Current Status",
      });
    } else if (addPcData && !addPcData.result_of_prosecution) {
      setCustomError({
        name: "result_of_prosecution",
        message: "Please select Result of prosecution",
      });
    } else if (addPcData && !addPcData.document_type) {
      setCustomError({
        name: "document_type",
        message: "Please select Document Type",
      });
    } else if (addPcData && !addPcData.result_of_pc) {
      setCustomError({
        name: "result_of_pc",
        message: " Please select Result of PC",
      });
    } else if (addPcData && !addPcData.escalation_required) {
      setCustomError({
        name: "escalation_required",
        message: "Please select Escalated Required",
      });
    } else if (addPcData && !addPcData.escalation_type) {
      setCustomError({
        name: "escalation_type",
        message: "Please select Escalated type",
      });
    } else if (addPcData && !addPcData.escalation_reason) {
      setCustomError({
        name: "escalation_reason",
        message: "Please select Escalation Reason",
      });
    } else {
      setCustomError({ name: "", message: "" });
      let updateData = {
        user_id: deletedById && deletedById,
        ...addPcData,
        survivor: props.location && props.location.state,
      };
      let addData = {
        ...addPcData,
        survivor: props.location && props.location.state,
      };

      //console.log("body", addPcData);
      if (addPcData && addPcData._id) {
        setResultLoad(true);
        axios
          .patch(
            api + "/survival-pc/update/" + addPcData._id,
            updateData,
            axiosConfig
          )
          .then((response) => {
            ////console.log(response);
            setResultLoad(false);
            setValidated(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("success");
  
              dispatch(getSurvivorPcList(props.location.state));
              setModalPCShow(false);
              setAddPcData({});
              // setActiveClass(false);
              // setAddPcEscalationData({})
            }else{
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("error");
  
            }
          })
          .catch((error) => {
            setResultLoad(false);

            ////console.log(error, "fir add error");
          });
      } else {
        setResultLoad(true);

        axios
          .post(api + "/survival-pc/create", addData, axiosConfig)
          .then((res) => {
            //console.log(res);
          
            setValidated(false);
            setResultLoad(false);

            setUpdateMessage(res && res.data.message);
            if (res && res.data && res.data.error == false) {
              const { data } = res;
              handleClick();
              setMessagType("success");
              setUpdateMessage(res && res.data.message);
              dispatch(getSurvivorPcList(props.location.state));
              setModalPCShow(false);
              setAddPcData({});
              // setActiveClass(false);
              setAddPcEscalationData({});
            }else{
              handleClick();
              setUpdateMessage(res && res.data.message);
              setMessagType("error");
            }
          })
          .catch((error) => {
            setResultLoad(false);
          });
      }
    }
  };

  useEffect(() => {
    if (addPcEscalationData && addPcEscalationData.current_status) {
      setCustomError({
        name: "current_status",
        message: "",
      });
    } else if (addPcEscalationData && addPcEscalationData.escalted_type) {
      setCustomError({
        name: "escalted_type",
        message: "",
      });
      // setAppliedDateErr(false)
    } else if (
      addPcEscalationData &&
      addPcEscalationData.reason_for_writ_appeal_contemt
    ) {
      setCustomError({
        name: "reason_for_writ_appeal_contemt",
        message: "",
      });
    } else if (addPcEscalationData && addPcEscalationData.document_type) {
      setCustomError({
        name: "document_type",
        message: "",
      });
    } else if (
      addPcEscalationData &&
      addPcEscalationData.result_of_escalation
    ) {
      setCustomError({
        name: "result_of_escalation",
        message: "",
      });
    } else if (addPcEscalationData && addPcEscalationData.what_is_concluded) {
      setCustomError({
        name: "what_is_concluded",
        message: "",
      });
    } else if (addPcEscalationData && addPcEscalationData.escalation_required) {
      setCustomError({
        name: "escalation_required",
        message: "",
      });
    } else if (addPcEscalationData && addPcEscalationData.escalation_reason) {
      setCustomError({
        name: "escalation_reason",
        message: "",
      });
    } else {
      setCustomError({ name: "", message: "" });
    }
  }, [addPcEscalationData]);

  ////////////// API CALL FUCTION FOR ADD AND UPDATE PC ESCALATION ////////
  const addPcEscalationFunc = (e) => {
    e.preventDefault();
    // console.warn(pictureData, profile);

    if (addPcEscalationData && !addPcEscalationData.current_status) {
      setCustomError({
        name: "current_status",
        message: "Please select Current Status",
      });
    } else if (addPcEscalationData && !addPcEscalationData.escalted_type) {
      setCustomError({
        name: "escalted_type",
        message: "Please select Escalated type",
      });
      // setAppliedDateErr(false)
    } else if (
      addPcEscalationData &&
      !addPcEscalationData.reason_for_writ_appeal_contemt
    ) {
      setCustomError({
        name: "reason_for_writ_appeal_contemt",
        message: "Please enter Reason for WRIT/Appeal/Contempt",
      });
    } else if (addPcEscalationData && !addPcEscalationData.document_type) {
      setCustomError({
        name: "document_type",
        message: "Please select Document Type",
      });
    } else if (
      addPcEscalationData &&
      !addPcEscalationData.result_of_escalation
    ) {
      setCustomError({
        name: "result_of_escalation",
        message: "Please select Result of Escalation",
      });
    } else if (addPcEscalationData && !addPcEscalationData.what_is_concluded) {
      setCustomError({
        name: "what_is_concluded",
        message: "Please select What is concluded",
      });
    } else if (
      addPcEscalationData &&
      !addPcEscalationData.escalation_required
    ) {
      setCustomError({
        name: "escalation_required",
        message: "Please select Escalation Required",
      });
    } else if (addPcEscalationData && !addPcEscalationData.escalation_reason) {
      setCustomError({
        name: "escalation_reason",
        message: "Please select Escalation Reason",
      });
    } else {
      setCustomError({ name: "", message: "" });
      var body = {
        ...addPcEscalationData,
        survivor: props.location.state,
        survivor_pc: selectedData && selectedData._id,
      };
      ////console.log("body", body);
      if (addPcEscalationData && addPcEscalationData._id) {
        setResultLoad2(true);

        axios
          .patch(
            api + "/pc-escalation/update/" + addPcEscalationData._id,
            body,
            axiosConfig
          )
          .then((response) => {
            ////console.log(response);
          
            setValidatedEscal1(false);
            setResultLoad2(false);

            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("success");
              dispatch(getSurvivorPcList(props.location.state));
              dispatch(getPcEscalationList(selectedData && selectedData._id));
              setModalPCEscalationShow(false);
              // setAddPcData({});
              // setActiveClass(false);
              setAddPcEscalationData({});
            }else{
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("error");
            }
          })
          .catch((error) => {
            setResultLoad2(false);

            ////console.log(error, "fir add error");
          });
      } else {
        setResultLoad2(true);
        axios
          .post(api + "/pc-escalation/create", body, axiosConfig)
          .then((res) => {
            ////console.log(res);
          
            setValidatedEscal1(false);
            setResultLoad2(false);
         
            if (res && res.data && res.data.error == false) {
            
              const { data } = res;
              handleClick();
              setMessagType("success");
              setUpdateMessage(res && res.data.message);
              dispatch(getSurvivorPcList(props.location.state));
              setModalPCEscalationShow(false);
            dispatch(getPcEscalationList(selectedData && selectedData._id));

              // setAddPcData({});
              // setActiveClass(false);
              setAddPcEscalationData({});
            }else{}
            handleClick();
            setMessagType("error");
            setUpdateMessage(res && res.data.message);
          })
          .catch((error) => {
            setResultLoad2(false);

            ////console.log(error);
            // setUpdateMessage(error && error.message)
          });
      }
    }
  };

  const downloadFile = ({ data, fileName, fileType }) => {
    ////console.log(data, fileName, fileType);
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

  //////////////// for csv function ////

  const downloadCsvFile = ({ data, fileName, fileType }) => {
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
  {
    survivorPcList.map((x) => {
      exportData.push({
        _id: x._id,
        survivor: x.survivor,
        source: x.source,
        doc_path: x.doc_path,
        doc_ref: x.doc_ref,
        started_date: x.started_date,
        why: x.why.name,
        court: x.court.name,
        current_status: x.current_status.name,
        result_of_prosecution: x.result_of_prosecution.name,
        document_type: x.document_type.name,
        document_url: x.document_url,
        result_of_pc: x.result_of_pc,
        escalation_required: x.escalation_required,
        escalation_type: x.escalation_type.name,
        escalation_reason: x.escalation_reason.name,
      });
    });
  }
  const exportToCsv = (e) => {
    ////console.log(e, "e");
    e.preventDefault();

    // Headers for each column
    let headers = [
      "Id,Survivor,Source,DocPath,DocRef,StartedDate,Why,Court,CurrentSTatus,ResultOfPresecution,DocumentType,DocumentUrl,ResultOfPc,EscalationRequired,EscalationType,EscalationReason",
    ];

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const {
        _id,
        survivor,
        source,
        doc_path,
        doc_ref,
        started_date,
        why,
        court,
        current_status,
        result_of_prosecution,
        document_type,
        document_url,
        result_of_pc,
        escalation_required,
        escalation_type,
        escalation_reason,
      } = user;
      acc.push(
        [
          _id,
          survivor,
          source.toUpperCase(),
          doc_path,
          doc_ref,
          moment(started_date).format("DD-MMM-YYYY"),
          why,
          court,
          current_status,
          result_of_prosecution,
          document_type,
          document_url,
          result_of_pc,
          escalation_required,
          escalation_type,
          escalation_reason,
        ].join(",")
      );
      return acc;
    }, []);

    downloadCsvFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "survivorPcList.csv",
      fileType: "text/csv",
    });
  };

  const startedDateHandler = (e) => {
    setAddPcData({
      ...addPcData,
      [e.target.name]: e.target.value,
    });
  };

  const escalaDateHandler = (e) => {
    console.log(e.target.name ,e.target.value,"dsf")
    setAddPcEscalationData({
      ...addPcEscalationData,
      [e.target.name]: e.target.value,
    });
  };

  const fileDateHandler = (e) => [
    setAddPcEscalationData({
      ...addPcEscalationData,
      [e.target.name]: e.target.value,
    }),
  ];
  //archieve items
  const history = useHistory();

  let url = props.location.search;
  const gotoArchiveList = (e) => {
    gotoSurvivorArchive(e, "pc", props.location.state, history);
  };
  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("SURVIVOR DETAILS", 22, 10);

    //  // add content
    doc.setFontSize(10);
    doc.text("SURVIVOR NAME:", 22, 20);
    doc.text(survivorDetails?.survivor_name, 60, 20);
    doc.text("SURVIVOR ID", 22, 40);
    doc.text(survivorDetails?.survivor_id, 60, 40);

    doc.setFontSize(20);
    doc.text("SURVIVOR PROCEDURAL CORRECTION LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "Id",
      "Survivor",
      "Source",
      "DocPath",
      "DocRef",
      "StartedDate",
      "Why",
      "Court",
      "CurrentSTatus",
      "ResultOfPresecution",
      "DocumentType",
      "DocumentUrl",
      "ResultOfPc",
      "EscalationRequired",
      "EscalationType",
      "EscalationReason",
    ];
    const name = "survivor-pc-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [
        item._id,
        item.survivor,
        item.source.toUpperCase(),
        item.doc_path,
        item.doc_ref,
        moment(item.started_date).format("DD-MMM-YYYY"),
        item.why,
        item.court,
        item.current_status,
        item.result_of_prosecution,
        item.document_type,
        item.document_url,
        item.result_of_pc,
        item.escalation_required,
        item.escalation_type,
        item.escalation_reason,
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
    doc.save(name);
  };

  return (
    <>
      <Topbar />
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
              <h2 className="page_title">Procedural Correction</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>PC</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topProcedural topcartbar Correctioncartbar white_box_shadow">
            <SurvivorTopCardExtra survivorDetails={survivorDetails} />
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            <div className="vieweditdelete">
              {currentModule && JSON.parse(currentModule).can_view == true && (
                <Dropdown className="me-1">
                  <Dropdown.Toggle variant="border" className="shadow-0">
                    Action
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={(e) => exportToCsv(e)}>
                      Download CSV
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => downloadPdf(e)}>
                      Download PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => changeLogFunc()}>
                      Change Log
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => onGotoAddPcEscalation()}
                    >
                      Add Escalation
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => gotoArchiveList(e)}>
                      Archive Item
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
              {currentModule && JSON.parse(currentModule).can_edit == true && (
                <MDBTooltip
                  tag="button"
                  wrapperProps={{ className: "add_btn view_btn" }}
                  title="Add"
                >
                  <span onClick={() => onGotoAddPc()}>
                    <i className="fal fa-plus-circle"></i>
                  </span>
                </MDBTooltip>
              )}
              {currentModule && JSON.parse(currentModule).can_edit == true && (
                <MDBTooltip
                  tag="a"
                  wrapperProps={{ className: "edit_btn" }}
                  title="Edit"
                >
                  <sapn onClick={() => onGotoEditPc()}>
                    <i className="fal fa-pencil"></i>
                  </sapn>
                </MDBTooltip>
              )}
              {currentModule && JSON.parse(currentModule).can_delete == true && (
                <MDBTooltip
                  tag="a"
                  wrapperProps={{ className: "delete_btn" }}
                  title="Delete"
                >
                  <span onClick={() => onDeleteChangeFunc()}>
                    <i className="fal fa-trash-alt"></i>
                  </span>
                </MDBTooltip>
              )}
            </div>
            {currentModule && JSON.parse(currentModule).can_view == true && (
              <div className="table-responsive big-mobile-responsive">
                <DataTablePcFilter
                  survivorPcList={
                    survivorPcList &&
                    survivorPcList.length > 0 &&
                    survivorPcList
                  }
                  selectedProduct5={selectedProduct5}
                  survivorName={
                    survivorDetails &&
                    survivorDetails.survivor_name &&
                    survivorDetails.survivor_name
                  }
                  isLoading={isLoading}
                  onSelectRow={onSelectRow}
                />
              </div>
            )}
          </div>
          {pcEscalationList && pcEscalationList.length > 0 && (
            <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
              <div className="vieweditdelete">
                <MDBTooltip
                  tag="button"
                  wrapperProps={{ className: "add_btn view_btn" }}
                  title="Add"
                >
                  <span onClick={() => onGotoAddPcEscalation()}>
                    <i className="fal fa-plus-circle"></i>
                  </span>
                </MDBTooltip>
                <MDBTooltip
                  tag="a"
                  wrapperProps={{ className: "edit_btn" }}
                  title="Edit"
                >
                  <sapn onClick={() => onGotoEditPcEscalation()}>
                    <i className="fal fa-pencil"></i>
                  </sapn>
                </MDBTooltip>
                <MDBTooltip
                  tag="a"
                  wrapperProps={{ className: "delete_btn" }}
                  title="Delete"
                >
                  <span onClick={() => onDeleteChangeEscalFunc("escal")}>
                    <i className="fal fa-trash-alt"></i>
                  </span>
                </MDBTooltip>
              </div>
              <h4 className="mb-4 small_heading">
                Escalation Of {selectedData && selectedData.unique_id}
              </h4>

              <div className="table-responsive big-mobile-responsive">
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr>
                      <th width="16.66%">Source</th>
                      <th width="16.66%">PC Started Date</th>
                      <th width="16.66%">Escalated type</th>
                      <th width="16.66%">Date of Escalation</th>
                      <th width="16.66%">Registration number</th>
                      <th width="16.66%">Date of file</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pcEscalationList && pcEscalationList.length > 0 ? (
                      pcEscalationList.map((item) => {
                        return (
                          <tr
                            className={[
                              item._id === pcEscSelected._id &&
                                activePcEscalClass === true &&
                                "current",
                            ]}
                            onClick={() => onSelectedPcEscal(item)}
                          >
                            <td>
                              {item && item.source && item.source.toUpperCase()}
                            </td>
                            <td>
                              {item &&
                                item.pc_started_date &&
                                moment(item.pc_started_date).format(
                                  "DD-MMM-YYYY"
                                )}
                            </td>
                            <td>
                              {item &&
                                item.escalted_type &&
                                item.escalted_type.name}
                            </td>
                            <td>
                              {item &&
                                item.date_of_escalation &&
                                moment(item.date_of_escalation).format(
                                  "DD-MMM-YYYY"
                                )}
                            </td>
                            <td>
                              {item &&
                                item.registration_number &&
                                item.registration_number}
                            </td>
                            <td>
                              {item &&
                                item.date_of_file &&
                                moment(item.date_of_file).format("DD-MMM-YYYY")}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="text-center" colSpan={6}>
                          <b>NO Data Found !!</b>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {pcDetailsLoader && pcDetailsLoader === true ? (
            <div className="text-center">
              <div class="spinner-border smallSpinnerWidth text-info text-center"></div>
            </div>
          ) : (
            pcDocDetails &&
            pcDocDetails.docData && (
              <div className="white_box_shadow mt-4 survivors_table_wrap position-relative">
                <MDBAccordion
                  flush
                  // initialActive={1}
                >
                  <MDBAccordionItem
                    className="tableAccordionWrap tableAccordionWrap-uppercase"
                    collapseId={1}
                    headerTitle="List of Documents"
                  >
                    {pcDocDetails &&
                      pcDocDetails.docData &&
                      pcDocDetails.docData.document_data &&
                      pcDocDetails.docData.document_data.length > 0 && (
                        <>
                          <h6 className="mb-3">{"Survivor Documents"}</h6>
                          <div className="table-responsive big-mobile-responsive mb-5">
                            <table className="table table-borderless mb-0">
                              <thead>
                                <tr>
                                  <th width="20%">Type</th>
                                  <th width="20%">Document</th>
                                  <th width="30%">Download</th>
                                  <th width="20%"> Uploaded Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pcDocDetails &&
                                pcDocDetails.docData &&
                                pcDocDetails.docData.document_data &&
                                pcDocDetails.docData.document_data.length >
                                  0 ? (
                                  pcDocDetails.docData.document_data.map(
                                    (item) => {
                                      return (
                                        <tr>
                                          <td>
                                            {item &&
                                              item.document_type &&
                                              item.document_type.name.toUpperCase()}
                                          </td>
                                          <td>
                                            {item &&
                                              item.file &&
                                              item.file.split("_").pop()}
                                          </td>
                                          {/* <td>18-03-2022</td> */}
                                          <td>
                                            <a
                                              href={
                                                item && item.file && item.file
                                              }
                                              target={
                                                item &&
                                                item.file &&
                                                item.file === ""
                                                  ? ""
                                                  : "_blank"
                                              }
                                            >
                                              {" "}
                                              {item && item.file && item.file}
                                            </a>
                                          </td>
                                          <td>
                                            {item &&
                                              item.createdAt &&
                                              moment(item.createdAt).format(
                                                "DD-MMM-YYYY"
                                              )}
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )
                                ) : (
                                  <tr>
                                    <td className="text-center" colSpan={5}>
                                      <b>NO Data Found !!</b>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                    {pcDocDetails &&
                      pcDocDetails.SurvivorPcData &&
                      pcDocDetails.SurvivorPcData.pc_data && (
                        <>
                          <h6 className="mb-3">{"Survivor PC Documents"}</h6>
                          <div className="table-responsive big-mobile-responsive mb-5">
                            <table className="table table-borderless mb-0">
                              <thead>
                                <tr>
                                  <th width="20%">File Name</th>
                                  <th width="30%">Download</th>
                                  <th width="20%"> Uploaded Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    {pcDocDetails &&
                                      pcDocDetails.SurvivorPcData &&
                                      pcDocDetails.SurvivorPcData.pc_data
                                        .split("_")
                                        .pop()}
                                  </td>
                                  <td>
                                    {pcDocDetails &&
                                      pcDocDetails.SurvivorPcData &&
                                      pcDocDetails.SurvivorPcData.pc_data}
                                  </td>
                                  <td>
                                    <a
                                      href={
                                        pcDocDetails &&
                                        pcDocDetails.SurvivorPcData &&
                                        pcDocDetails.SurvivorPcData.pc_data
                                      }
                                      target={
                                        pcDocDetails &&
                                        pcDocDetails.SurvivorPcData &&
                                        pcDocDetails.SurvivorPcData.pc_data &&
                                        "_blank"
                                      }
                                    >
                                      {" "}
                                      {pcDocDetails &&
                                        pcDocDetails.SurvivorPcData &&
                                        pcDocDetails.SurvivorPcData.pc_data}
                                    </a>
                                  </td>
                                  <td>
                                    {pcDocDetails &&
                                      pcDocDetails.createdAt &&
                                      moment(pcDocDetails.createdAt).format(
                                        "DD-MMM-YYYY"
                                      )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                    {pcDocDetails &&
                      pcDocDetails.grantData &&
                      pcDocDetails.grantData.grant_data &&
                      pcDocDetails.grantData.grant_data.length > 0 && (
                        <>
                          <h6 className="mb-3">{"Survivor Grant Documents"}</h6>
                          <div className="table-responsive big-mobile-responsive mb-0">
                            <table className="table table-borderless mb-0">
                              <thead>
                                <tr>
                                  <th width="30%">File Name</th>
                                  <th width="30%">Download</th>
                                  <th width="20%"> Uploaded Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pcDocDetails &&
                                  pcDocDetails.grantData &&
                                  pcDocDetails.grantData.grant_data &&
                                  pcDocDetails.grantData.grant_data.length >
                                    0 &&
                                  pcDocDetails.grantData.grant_data.map(
                                    (item) => {
                                      return (
                                        <tr>
                                          <td>
                                            {item &&
                                              item.reference_document
                                                .split("_")
                                                .pop()}
                                          </td>
                                          <td>
                                            <a
                                              href={
                                                item &&
                                                item.reference_document &&
                                                item.reference_document
                                              }
                                              target={
                                                item &&
                                                item.reference_document &&
                                                item.reference_document === ""
                                                  ? ""
                                                  : "_blank"
                                              }
                                            >
                                              {" "}
                                              {item &&
                                                item.reference_document &&
                                                item.reference_document}
                                            </a>
                                          </td>

                                          <td>
                                            {item &&
                                              item.createdAt &&
                                              moment(item.createdAt).format(
                                                "DD-MMM-YYYY"
                                              )}
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                    {pcDocDetails &&
                      pcDocDetails.loanData &&
                      pcDocDetails.loanData.loan_data &&
                      pcDocDetails.loanData.loan_data.length > 0 && (
                        <>
                          <h6>{"Survivor Loan  Documents"}</h6>
                          <div className="table-responsive big-mobile-responsive mb-0">
                            <table className="table table-borderless mb-0">
                              <thead>
                                <tr>
                                  <th width="30%">File Name</th>
                                  <th width="30%">Download</th>
                                  <th width="20%"> Uploaded Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pcDocDetails &&
                                  pcDocDetails.loanData &&
                                  pcDocDetails.loanData.loan_data &&
                                  pcDocDetails.loanData.loan_data.length > 0 &&
                                  pcDocDetails.loanData.loan_data.map(
                                    (item) => {
                                      return (
                                        <tr>
                                          <td>
                                            {item &&
                                              item.reference_document &&
                                              item.reference_document.name}
                                          </td>

                                          <td>
                                            <a
                                              href={item && item}
                                              target={
                                                item &&
                                                item.reference_document &&
                                                item.reference_document.file &&
                                                "_blank"
                                              }
                                            >
                                              {" "}
                                              {item &&
                                                item.reference_document &&
                                                item.reference_document.file}
                                            </a>
                                          </td>
                                          <td>
                                            {item &&
                                              item.createdAt &&
                                              moment(item.createdAt).format(
                                                "DD-MMM-YYYY"
                                              )}
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                  </MDBAccordionItem>
                </MDBAccordion>
              </div>
            )
          )}

          <div className="white_box_shadow mt-4 survivors_table_wrap position-relative">
            <MDBAccordion
              flush
              // initialActive={1}
            >
              <MDBAccordionItem
                className="tableAccordionWrap tableAccordionWrap-uppercase"
                collapseId={1}
                headerTitle="List of fir"
              >
                <div className="table-responsive big-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="15%">Source</th>
                        <th>FIR Number</th>
                        <th>FIR Date</th>
                        {/* <th>Sections</th>
                                                <th width="24%">Accused</th> */}
                        <th width="14%">Police Station</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterSurvivorFirData &&
                      masterSurvivorFirData.length > 0 ? (
                        masterSurvivorFirData.map((item) => {
                          return (
                            <tr>
                              <td>
                                {item &&
                                  item.location &&
                                  item.location.toUpperCase()}
                              </td>
                              <td>
                                {item &&
                                  item.fir &&
                                  item.fir.number &&
                                  item.fir.number}
                              </td>
                              <td>
                                {item &&
                                  item.fir &&
                                  item.fir.date &&
                                  moment(item.fir.date).format("DD-MMM-YYYY")}
                              </td>
                              {/* <td></td>
                                                <td>{item && item.location && item.location}</td> */}
                              <td>
                                {item &&
                                  item.policeStation &&
                                  item.policeStation.name &&
                                  item.policeStation.name}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="text-center" colSpan={4}>
                            <b>NO Data Found !!</b>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </MDBAccordionItem>
            </MDBAccordion>
          </div>

          <div className="white_box_shadow mt-4 survivors_table_wrap position-relative">
            <MDBAccordion
              flush
              // initialActive={1}
            >
              <MDBAccordionItem
                className="tableAccordionWrap tableAccordionWrap-uppercase"
                collapseId={1}
                headerTitle="List of Lawyers for PC (Readonly) for a particulr survivor"
              >
                <div className="table-responsive big-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="15%">Source</th>
                        <th>Lawyer</th>
                        <th>Type</th>
                        <th>Is Leading</th>
                        <th width="12%">From Date</th>
                        <th width="12%">To Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterSurvivorLawyersData &&
                      masterSurvivorLawyersData.length > 0 ? (
                        masterSurvivorLawyersData.map((item) => {
                          return (
                            <tr>
                              <td>
                                {item.source && item.source.toUpperCase()}
                              </td>
                              <td>{item.name && item.name.name}</td>
                              <td>{item.type && item.type.name}</td>
                              <td>
                                {item.isleading && item.isleading === true
                                  ? "Yes"
                                  : "No"}
                              </td>
                              <td>
                                {item.from_date &&
                                  moment(item.from_date).format("DD-MMM-YYYY")}
                              </td>
                              <td>
                                {item.to_date &&
                                  moment(item.to_date).format("DD-MMM-YYYY")}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="text-center" colSpan={6}>
                            <b>NO Data Found !!</b>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </MDBAccordionItem>
            </MDBAccordion>
          </div>

          <div className="white_box_shadow mt-4 survivors_table_wrap position-relative">
            <MDBAccordion
              flush
              // initialActive={1}
            >
              <MDBAccordionItem
                className="tableAccordionWrap tableAccordionWrap-uppercase"
                collapseId={1}
                headerTitle="List of Investigation for a particulr survivor"
              >
                <div className="table-responsive big-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="15%">Source</th>
                        <th>Investigation Agency type</th>
                        <th>Agency name</th>
                        <th>Officer Rank</th>
                        <th>investigation status</th>
                        <th>investigation result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterSurvivorInvestigationData &&
                      masterSurvivorInvestigationData.length > 0 ? (
                        masterSurvivorInvestigationData.map((item) => {
                          return (
                            <tr>
                              <td>
                                {item &&
                                  item.source &&
                                  item.source.toUpperCase()}
                              </td>
                              <td>
                                {item &&
                                  item.inv_agency_type &&
                                  item.inv_agency_type.name}
                              </td>
                              <td>
                                {item &&
                                  item.inv_agency_name &&
                                  item.inv_agency_name.name}
                              </td>
                              <td>
                                {item &&
                                  item.rank_of_inv_officer &&
                                  item.rank_of_inv_officer}
                              </td>
                              <td>
                                {item &&
                                  item.status_of_investigation &&
                                  item.status_of_investigation}
                              </td>
                              <td>
                                {item &&
                                  item.result_of_inv &&
                                  item.result_of_inv}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="text-center" colSpan={6}>
                            <b>NO Data Found !!</b>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </MDBAccordionItem>
            </MDBAccordion>
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalPCShow}
        onHide={setModalPCShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {addPcData && addPcData._id
              ? "Update Procedural Correction"
              : "Add Procedural Correction"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Source <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="source"
                    value={addPcData && addPcData.source && addPcData.source}
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="da">DA</option>
                    <option value="sa">SA</option>
                  </Form.Select>
                  {customError.name == "source" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Started Date <span className="requiredStar">*</span>
                  </Form.Label>

                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addPcData && addPcData.started_date
                            ? moment(addPcData.started_date).format(
                                "DD-MMM-YYYY"
                              )
                            : null
                        }
                        disabled={true}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select Date
                      </Form.Control.Feedback>
                      <InputGroup.Text>
                        <Form.Control
                          name={"started_date"}
                          className="dateBtn"
                          type="date"
                          onChange={startedDateHandler}
                          placeholder=""
                          max={moment().format("YYYY-MM-DD")}
                          min={
                            survivorDetails &&
                            survivorDetails.date_of_trafficking &&
                            moment(survivorDetails.date_of_trafficking).format(
                              "YYYY-MM-DD"
                            )
                          }
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                  {customError.name == "started_date" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Why? <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="why"
                    value={addPcData && addPcData.why && addPcData.why._id}
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterPcWhyList &&
                      masterPcWhyList.length > 0 &&
                      masterPcWhyList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name.toUpperCase()}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "why" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Court <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="court"
                    value={addPcData && addPcData.court && addPcData.court._id}
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterSurvivrCourtData &&
                      masterSurvivrCourtData.length > 0 &&
                      masterSurvivrCourtData.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "court" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Current Status <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="current_status"
                    value={
                      addPcData &&
                      addPcData.current_status &&
                      addPcData.current_status._id
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterPcCurrentStatusList &&
                      masterPcCurrentStatusList.length > 0 &&
                      masterPcCurrentStatusList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name.toUpperCase()}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "current_status" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Result of prosecution{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="result_of_prosecution"
                    value={
                      addPcData &&
                      addPcData.result_of_prosecution &&
                      addPcData.result_of_prosecution._id
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterResOfProsecutionList &&
                      masterResOfProsecutionList.length > 0 &&
                      masterResOfProsecutionList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "result_of_prosecution" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Document Type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="document_type"
                    value={
                      addPcData &&
                      addPcData.document_type &&
                      addPcData.document_type._id
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterDocumentTypeData &&
                      masterDocumentTypeData.length > 0 &&
                      masterDocumentTypeData.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "document_type" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Document</Form.Label>

                  <div className="fileuploadForm">
                    <input
                      onChange={(e) => handleFileInput(e, "pc")}
                      type="file"
                    />
                    {addPcData.document_url ? (
                      <span>
                        {""}
                        {addPcData &&
                          addPcData.document_url &&
                          addPcData.document_url.split("_").pop()}
                      </span>
                    ) : (
                      <span>Choose File</span>
                    )}
                  </div>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Result of PC <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="result_of_pc"
                    value={
                      addPcData &&
                      addPcData.result_of_pc &&
                      addPcData.result_of_pc
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterPcResultData &&
                      masterPcResultData.length > 0 &&
                      masterPcResultData.map((item) => {
                        return (
                          <option value={item && item.name}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "result_of_pc" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reference FIR/Investigation/Chragesheet Type{" "}
                  </Form.Label>
                  <Form.Select
                    name="doc_ref"
                    value={addPcData && addPcData.doc_ref}
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="survivorFirs">Survivor FIR</option>
                    <option value="survivorInvestigations">
                      Survivor Investigation
                    </option>
                    <option value="survivorChargeSheets">
                      Survivor ChargeSheet
                    </option>
                  </Form.Select>
                </Form.Group>
                {addPcData && !addPcData.doc_ref && (
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Reference Number</Form.Label>
                    <Form.Select>
                      <option hidden={true}>Please select</option>
                    </Form.Select>
                  </Form.Group>
                )}
                {addPcData &&
                  addPcData.doc_ref &&
                  addPcData.doc_ref === "survivorFirs" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Reference{" "}
                        {addPcData &&
                          addPcData.doc_ref &&
                          addPcData.doc_ref === "survivorFirs" &&
                          "FIR"}{" "}
                        Number
                      </Form.Label>
                      <Form.Select
                        name="doc_path"
                        value={
                          addPcData && addPcData.doc_path && addPcData.doc_path
                        }
                        onChange={(e) =>
                          setAddPcData({
                            ...addPcData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option hidden={true}>Please select</option>
                        {masterSurvivorFirData &&
                          masterSurvivorFirData.length > 0 &&
                          masterSurvivorFirData.map((item) => {
                            ////console.log(item);

                            return (
                              <option value={item._id}>
                                {item && item.fir && item.fir.number}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                  )}{" "}
                {addPcData && addPcData.doc_ref === "survivorInvestigations" && (
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>
                      Reference{" "}
                      {addPcData &&
                        addPcData.doc_ref &&
                        addPcData.doc_ref === "survivorInvestigations" &&
                        "Investigation"}{" "}
                      Numebr
                    </Form.Label>
                    <Form.Select
                      name="doc_path"
                      value={
                        addPcData && addPcData.doc_path && addPcData.doc_path
                      }
                      onChange={(e) =>
                        setAddPcData({
                          ...addPcData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={true}>Please select</option>

                      {masterSurvivorInvestigationData &&
                        masterSurvivorInvestigationData.length > 0 &&
                        masterSurvivorInvestigationData.map((item) => {
                          //console.log(item, "return");
                          return (
                            <option value={item._id}>
                              {item &&
                                item.name_of_agency +
                                  "/" +
                                  item.name_of_inv_officer}
                            </option>
                          );
                        })}
                    </Form.Select>
                  </Form.Group>
                )}
                {addPcData &&
                  addPcData.doc_ref &&
                  addPcData.doc_ref === "survivorChargeSheets" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Reference{" "}
                        {addPcData &&
                          addPcData.doc_ref &&
                          addPcData.doc_ref === "survivorChargeSheets" &&
                          "ChargeSheet"}{" "}
                        Number
                      </Form.Label>
                      <Form.Select
                        name="doc_path"
                        value={
                          addPcData && addPcData.doc_path && addPcData.doc_path
                        }
                        onChange={(e) =>
                          setAddPcData({
                            ...addPcData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option hidden={true}>Please select</option>

                        {masterSurvivorChargesheetData &&
                          masterSurvivorChargesheetData.length > 0 &&
                          masterSurvivorChargesheetData.map((item) => {
                            return (
                              <option value={item & item._id}>
                                {item &&
                                  item.charge_sheet &&
                                  item.charge_sheet.number}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                  )}
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalation Required <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="escalation_required"
                    value={
                      addPcData &&
                      addPcData.escalation_required &&
                      addPcData.escalation_required
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                  {customError.name == "escalation_required" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalated type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    value={
                      addPcData &&
                      addPcData.escalation_type &&
                      addPcData.escalation_type._id
                    }
                    name="escalation_type"
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {escalatedtTypeList &&
                      escalatedtTypeList.length > 0 &&
                      escalatedtTypeList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "escalation_type" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalation Reason <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="escalation_reason"
                    value={
                      addPcData &&
                      addPcData.escalation_reason &&
                      addPcData.escalation_reason._id
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {escalatedResonList &&
                      escalatedResonList.length > 0 &&
                      escalatedResonList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "escalation_reason" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
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
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    disabled={resultLoad === true ? true : false}
                    onClick={addPcFunc}
                    className="submit_btn shadow-0"
                  >
                    {resultLoad && resultLoad === true ? (
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

      <Modal
        className="addFormModal"
        show={modalPCEscalationShow}
        onHide={setModalPCEscalationShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {addPcEscalationData && addPcEscalationData._id
              ? "Update Escalation"
              : "Add Escalation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Source</Form.Label>
                  <Form.Select
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.source &&
                      addPcEscalationData.source
                    }
                    disabled={true}
                    name="source"
                  >
                    <option hidden={true}>Please select</option>
                    <option value="da">DA</option>
                    <option value="sa">SA</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>PC Started Date</Form.Label>
                  <Form.Control
                    // type="date"

                    value={
                      addPcEscalationData &&
                      addPcEscalationData.pc_started_date &&
                      moment(addPcEscalationData.pc_started_date).format(
                        "DD-MMM-YYYY"
                      )
                    }
                    disabled={true}
                    name="pc_started_date"
                    placeholder="PC Started Date"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Current Status <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    value={
                      addPcEscalationData && addPcEscalationData.current_status
                    }
                    disabled={true}
                    name="current_status"
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterPcCurrentStatusList &&
                      masterPcCurrentStatusList.length > 0 &&
                      masterPcCurrentStatusList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "current_status" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalated type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="escalted_type"
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.escalted_type &&
                      addPcEscalationData.escalted_type._id
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {escalatedtTypeList &&
                      escalatedtTypeList.length > 0 &&
                      escalatedtTypeList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "escalted_type" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Date of Escalation</Form.Label>

                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addPcEscalationData &&
                          addPcEscalationData.date_of_escalation
                            ? moment(
                                addPcEscalationData.date_of_escalation
                              ).format("DD-MMM-YYYY")
                            : null
                        }
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"date_of_escalation"}
                          className="dateBtn"
                          type="date"
                          onChange={escalaDateHandler}
                          placeholder=""
                          max={moment().format("YYYY-MM-DD")}
                          min={
                            selectedData &&
                            selectedData.started_date &&
                            moment(selectedData.started_date).format(
                              "YYYY-MM-DD"
                            )
                          }
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Registration number</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={
                      addPcEscalationData &&
                      addPcEscalationData.registration_number &&
                      addPcEscalationData.registration_number
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="registration_number"
                    placeholder=""
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Date of file</Form.Label>
                  {/* <DatePicker
                    name="date_of_file"
                    datePickerChange={fileDateHandler}
                    data={
                      addPcEscalationData && addPcEscalationData.date_of_file
                    }
                  /> */}
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addPcEscalationData &&
                          addPcEscalationData.date_of_file
                            ? moment(addPcEscalationData.date_of_file).format(
                                "DD-MMM-YYYY"
                              )
                            : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"date_of_file"}
                          className="dateBtn"
                          type="date"
                          onChange={fileDateHandler}
                          placeholder=""
                          max={moment().format("YYYY-MM-DD")}
                          min={
                            selectedData &&
                            selectedData.started_date &&
                            moment(selectedData.started_date).format(
                              "YYYY-MM-DD"
                            )
                          }
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reason for
                    <span className="requiredStar">*</span>
                  </Form.Label>

                  <Form.Select
                    defaultValue={
                      addPcEscalationData &&
                      addPcEscalationData.reason_for_writ_appeal_contemt &&
                      addPcEscalationData.reason_for_writ_appeal_contemt
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="reason_for_writ_appeal_contemt"
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="WRIT">WRIT</option>
                    <option value="Appeal">Appeal</option>
                    <option value="Contempt">Contempt</option>
                  </Form.Select>
                  {customError.name == "reason_for_writ_appeal_contemt" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Status of{" "}
                    {addPcEscalationData &&
                      addPcEscalationData.reason_for_writ_appeal_contemt &&
                      addPcEscalationData.reason_for_writ_appeal_contemt}
                  </Form.Label>
                  <Form.Select
                    defaultValue={
                      addPcEscalationData &&
                      addPcEscalationData.status_of_writ_appeal_contempt &&
                      addPcEscalationData.status_of_writ_appeal_contempt
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="status_of_writ_appeal_contempt"
                  >
                    <option hidden={true}>Please select</option>
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Document Type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.document_type &&
                      addPcEscalationData.document_type._id
                    }
                    name="document_type"
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterDocumentTypeData &&
                      masterDocumentTypeData.length > 0 &&
                      masterDocumentTypeData.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "document_type" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Document</Form.Label>

                  <div className="fileuploadForm">
                    <input
                      onChange={(e) => handleFileInput(e, "escal")}
                      type="file"
                    />
                    {addPcEscalationData.document_url ? (
                      <span>
                        {""}
                        {addPcEscalationData &&
                          addPcEscalationData.document_url &&
                          addPcEscalationData.document_url.split("_").pop()}
                      </span>
                    ) : (
                      <span>Choose File</span>
                    )}
                  </div>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Result of Escalation <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.result_of_escalation &&
                      addPcEscalationData.result_of_escalation
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="result_of_escalation"
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {pcEscResultList &&
                      pcEscResultList.length > 0 &&
                      pcEscResultList.map((item) => {
                        return (
                          <option value={item && item.name}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "result_of_escalation" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Reference Type </Form.Label>
                  <Form.Select
                    name="doc_ref"
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.doc_ref &&
                      addPcEscalationData.doc_ref
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value="survivorFirs">Survivor Fir</option>
                    <option value="survivorInvestigations">
                      Survivor Investigation
                    </option>
                    <option value="survivorChargeSheets">
                      Survivor ChargeSheet
                    </option>
                  </Form.Select>
                </Form.Group>
                {addPcEscalationData && !addPcEscalationData.doc_ref && (
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Reference Number</Form.Label>
                    <Form.Select>
                      <option hidden={true}>Please select</option>
                    </Form.Select>
                  </Form.Group>
                )}
                {addPcEscalationData &&
                  addPcEscalationData.doc_ref &&
                  addPcEscalationData.doc_ref === "survivorFirs" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Reference{" "}
                        {addPcEscalationData &&
                          addPcEscalationData.doc_ref &&
                          addPcEscalationData.doc_ref === "survivorFirs" &&
                          "FIR"}{" "}
                        Number
                      </Form.Label>
                      <Form.Select
                        name="doc_path"
                        value={
                          addPcEscalationData &&
                          addPcEscalationData.doc_path &&
                          addPcEscalationData.doc_path
                        }
                        onChange={(e) =>
                          setAddPcEscalationData({
                            ...addPcEscalationData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option hidden={true}>Please select</option>
                        {masterSurvivorFirData &&
                          masterSurvivorFirData.length > 0 &&
                          masterSurvivorFirData.map((item) => {
                            ////console.log(item);

                            return (
                              <option value={item._id}>
                                {item && item.fir && item.fir.number}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                  )}{" "}
                {addPcEscalationData &&
                  addPcEscalationData.doc_ref === "survivorInvestigations" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Reference{" "}
                        {addPcEscalationData &&
                          addPcEscalationData.doc_ref &&
                          addPcEscalationData.doc_ref ===
                            "survivorInvestigations" &&
                          "Investigation"}{" "}
                        Numebr
                      </Form.Label>
                      <Form.Select
                        name="doc_path"
                        value={
                          addPcEscalationData &&
                          addPcEscalationData.doc_path &&
                          addPcEscalationData.doc_path
                        }
                        onChange={(e) =>
                          setAddPcEscalationData({
                            ...addPcEscalationData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option hidden={true}>Please select</option>

                        {masterSurvivorInvestigationData &&
                          masterSurvivorInvestigationData.length > 0 &&
                          masterSurvivorInvestigationData.map((item) => {
                            //console.log(item, "invest");
                            return (
                              <option value={item._id}>
                                {item &&
                                  item.name_of_agency +
                                    "/" +
                                    item.name_of_inv_officer}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                  )}
                {addPcEscalationData &&
                  addPcEscalationData.doc_ref &&
                  addPcEscalationData.doc_ref === "survivorChargeSheets" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Reference{" "}
                        {addPcEscalationData &&
                          addPcEscalationData.doc_ref &&
                          addPcEscalationData.doc_ref ===
                            "survivorChargeSheets" &&
                          "ChargeSheet"}{" "}
                        Number
                      </Form.Label>
                      <Form.Select
                        name="doc_path"
                        value={
                          addPcEscalationData &&
                          addPcEscalationData.doc_path &&
                          addPcEscalationData.doc_path
                        }
                        onChange={(e) =>
                          setAddPcEscalationData({
                            ...addPcEscalationData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option hidden={true}>Please select</option>

                        {masterSurvivorChargesheetData &&
                          masterSurvivorChargesheetData.length > 0 &&
                          masterSurvivorChargesheetData.map((item) => {
                            return (
                              <option value={item & item._id}>
                                {item &&
                                  item.charge_sheet &&
                                  item.charge_sheet.number}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                  )}
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    What is concluded <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.what_is_concluded &&
                      addPcEscalationData.what_is_concluded
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="what_is_concluded"
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value={"convicted"}>Convicted</option>
                    <option value={"aquital"}>Aquital</option>
                  </Form.Select>
                  {customError.name == "what_is_concluded" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalation Required <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.escalation_required &&
                      addPcEscalationData.escalation_required
                    }
                    name="escalation_required"
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                  {customError.name == "escalation_required" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalation Reason <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.escalation_reason &&
                      addPcEscalationData.escalation_reason._id
                    }
                    name="escalation_reason"
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {escalatedResonList &&
                      escalatedResonList.length > 0 &&
                      escalatedResonList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "escalation_reason" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
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
                    disabled={
                      resultLoad2 && resultLoad2 === true ? true : false
                    }
                    onClick={() => onVcEscalationCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    className="submit_btn shadow-0"
                    onClick={addPcEscalationFunc}
                  >
                    {resultLoad2 && resultLoad2 === true ? (
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

      {showAlert === true && (
        <AlertComponent
          alertFlag={alertFlag}
          alertMessage={alertMessage}
          showAlert={showAlert}
          goToAddEscal={onGotoAddPcEscalation}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
          deleteLoader={deleteLoader}
        />
      )}
    </>
  );
};

export default SurvivorProceduralCorrection;
