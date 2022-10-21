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
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import moment from "moment";
import {
  getSurvivorDetails,
  getSurvivalVcList,
  getVcEscalationList,
  getAuthorityByAuthorityType,
  getVcEscalation2List,
  getModulesChangeLog,
  getVcEscResultList,
  // get masterVCStatusData,
  getVcResultList,
} from "../../redux/action";
import alertImg from "../../assets/img/alertPopupimg.png";
import DataTableVcFilter from "./DataTableVcFilter";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { gotoSurvivorArchive } from "../../utils/helper";
import TestTable from "./TestTable";
import { FlashOnRounded } from "@material-ui/icons";
const SurvivorVictimCompensation = (props) => {
  //  // console.log(props, "props");
  const [modalVCShow, setModalVCShow] = useState(false);
  const [modalVCEscalationFShow, setModalVCEscalationFShow] = useState(false);
  const dispatch = useDispatch();
  const masterSurvivorLawyersData = useSelector(
    (state) => state.masterSurvivorLawyersData
  );
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const masterAuthorityTypeData = useSelector(
    (state) => state.masterAuthorityTypeData
  );
  const vcEscalationList = useSelector((state) => state.vcEscalationList);
  const survivalVcList = useSelector((state) => state.survivalVcList);
  const vcEscalation2List = useSelector((state) => state.vcEscalation2List);
  const vcResultList = useSelector((state) => state.vcResultList);
  const multipleVcEscalation2List = useSelector(
    (state) => state.multipleVcEscalation2List
  );
  const masterVCStatusData = useSelector((state) => state.masterVCStatusData);
  const vcEscResultList = useSelector((state) => state.vcEscResultList);
  const [resultLoad, setResultLoad] = useState(false);
  const authorityListByAuthType = useSelector(
    (state) => state.authorityListByAuthType
  );
  const [escalSelectedData, setEscalSelectedData] = useState({});
  const [paramFlag, setParamFlag] = useState("");
  const [escalActiveClass, setEscalActiveClass] = useState(false);
  const [addVcEscalationData, setAddVcEscalationData] = useState({});
  const [addVcEscalation2Data, setAddVcEscalation2Data] = useState({});
  const [selectedProduct5, setSelectedProduct5] = useState(null);

  const [fileSelect, setFileSelect] = useState("");
  const [pictureData, setPictureData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const [customError, setCustomError] = useState({ name: "", message: "" });

  const [addVcData, setAddVcData] = useState({});
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
  const [modalVCEscalation2FShow, setModalVCEscalation2FShow] = useState(false);
  // const handleCloseAlert = () => setShowAlert(false);
  //   const handleShow = () => setShowAlert(true);
  const [open, setOpen] = useState(false);
  const [appliedAtId, setAppliedAtId] = useState("");
  const [escalActive2Class, setEscalActive2Class] = useState(false);
  const [escalSelected2Data, setEscalSelected2Data] = useState({});

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");

  const [validated, setValidated] = useState(false);
  const [validatedEscal1, setValidatedEscal1] = useState(false);
  const [validatedEscal2, setValidatedEscal2] = useState(false);
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [erorMessage, setErorMessage] = useState("");
  const [esclFlag, setEsclFlag] = useState("");
  const [errText, setErrText] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [messageType, setMessagType] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const currentModule = localStorage.getItem("currentModule");
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));

  const [escArr2, setEscArr2] = useState([]);

  const [selectDisable, setSelectDisable] = useState(false);

  useEffect(() => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "vc" && item
      );
    }

    obj = arrdata[0];
    //  // console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));
    dispatch(getVcResultList());
    // dispatch(get masterVCStatusData());
    dispatch(getVcEscResultList());
  }, [props]);

  // console.log(masterSurvivorLawyersData,"masterSurvivorLawyersData")

  useEffect(() => {
    // console.log(survivalVcList, "survivalVcList");
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [survivalVcList]);

  const handleShow = () => {
    //  // console.log("select");
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setAlertMessage("");
    setAlertFlag("");
    setShowAlert(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //archieve items
  const history = useHistory();

  let url = props.location.search;
  const gotoArchiveList = (e) => {
    gotoSurvivorArchive(e, "vc", props.location.state, history);
  };
  const onSelectRow = (item) => {
    //  // console.log(item, "iteeeeem");
    if (item !== null) {
      setSelectedData(item);
      setActiveClass(true);
      setSelectedProduct5(item);
    } else {
      setSelectedData({});
      setActiveClass(false);
      setSelectedProduct5(null);
    }

    dispatch({
      type: "MULTIPLE_VC_ESCALATION_2_LIST",
      data: [],
    });
    dispatch({
      type: "VC_ESCALATION_2_LIST",
      data: [],
    });
    if (
      item &&
      item.escalation &&
      item.escalation === true &&
      item.totalEscalation === 0
    ) {
      setAlertFlag("add");
      setAlertMessage("Escalation marked YES, Would you like add ?");
      handleShow();
    } else {
      setShowAlert(false);
    }
  };

  useEffect(() => {
    //  // console.log(multipleVcEscalation2List, "multipleVcEscalation2List");

    setEscArr2(multipleVcEscalation2List);
  }, [multipleVcEscalation2List]);

  const onGotoAddVc = () => {
    setModalVCShow(true);
    // setSelectedData({});
    setAddVcEscalation2Data({});
    setEscalSelected2Data({});
    setModalVCEscalation2FShow(false);
    // setAddVcData({});
    setPictureData({});

    setParamFlag("");
  };

  const onAppliedAtChangeAtVC = (e) => {
    setAddVcData({
      ...addVcData,
      [e.target.name]: e.target.value,
    });
    dispatch(getAuthorityByAuthorityType(e.target.value));
  };
  useEffect(() => {
    if (appliedAtId) {
      dispatch(getAuthorityByAuthorityType(appliedAtId));
    }
  }, [appliedAtId]);

  const onGotoEditVc = (e) => {
    if (selectedData && !selectedData._id) {
      setAlertFlag("alert");
      setAlertMessage("Please select one VC");
      setShowAlert(true);
    } else {
      setShowAlert(false);
      setAlertFlag("");
      setAlertMessage("");
      setParamFlag(e);
      setModalVCShow(true);
      setAddVcData(selectedData);
    }
  };

  const onCancel = () => {
    setModalVCShow(false);
    setAddVcData({});
    // setActiveClass(false);
    setPictureData({});
    setSelectedData({});
    setParamFlag("");
  };

  const changeLogFunc = (flag) => {
    dispatch(getModulesChangeLog(flag, deletedById, props.location.state));
    props.history.push("/change-log");
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setAlertFlag("alert");
      setAlertMessage("Please select one VC");
      setShowAlert(true);
    } else {
      setShowAlert(true);
      setAlertFlag("");
      setAlertMessage("");
    }
  };
  //////// delete function call //////////
  const onDeleteChangeEscalFunc = (flag) => {
    setEsclFlag(flag);
    if (escalSelectedData && !escalSelectedData._id) {
      setShowAlert(true);
      setAlertFlag("alert");
      setAlertMessage("Please select one VC escalation");
    } else {
      setShowAlert(true);
      setAlertFlag("");
      setAlertMessage("");
    }
  };

  // console.log(vcEscalationList, "vcEscalationList");

  const getVcEscalation2ListLocal = (vcId, escalId) => {
    // return (dispatch) => {
    axios
      .get(api + "/vc-escalation/list-2/" + vcId + "/" + escalId, axiosConfig)
      .then((response) => {
        // console.log(response, "vcEscalation2List local");
        if (response.data && response.data.error === false) {
          const { data } = response;
          if (data.data && data.data.length > 0) {
            var arr = [...escArr2];
            // console.log("arr1", arr);
            arr.push(data.data);
            // console.log("arr2", arr);

            dispatch({
              type: "MULTIPLE_VC_ESCALATION_2_LIST",
              data: arr,
            });
          }
          // else{
          //   dispatch({
          //     type: "MULTIPLE_VC_ESCALATION_2_LIST",
          //     data: [],
          //   });
          // }
        }
      })
      .catch((error) => {
        // console.log(error, "vc escalation error");
      });
    // };
  };
  const [deleteLoader, setDeleteLoader] = useState(false);

  // console.log(authorityListByAuthType, "authorityListByAuthType");
  const onDeleteFunction = () => {
    let body = {
      deleted_by: deletedById && deletedById,
      deleted_by_ref: "users",
    };
    if (esclFlag === "escal") {
      setDeleteLoader(true);
      axios
        .patch(
          api + "/vc-escalation/delete/" + escalSelectedData._id,
          body,
          axiosConfig
        )
        .then((response) => {
          setDeleteLoader(false);

          setEscalSelectedData({});
          if (response.data && response.data.error === false) {
            const { data } = response;
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("success");
            setEsclFlag("");
            dispatch(
              getVcEscalation2List(
                selectedData && selectedData._id,
                escalSelectedData && escalSelectedData._id
              )
            );
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

          // // console.log(error, "partner error");
        });
    } else {
      setDeleteLoader(true);

      axios
        .patch(
          api + "/survival-vc/delete/" + selectedData._id,
          body,
          axiosConfig
        )
        .then((response) => {
          setDeleteLoader(false);

          if (response.data && response.data.error === false) {
            const { data } = response;

            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("success");

            setSelectedData({});
            dispatch(getSurvivalVcList(props.location && props.location.state));
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

          // // console.log(error, "partner error");
        });
    }
  };

  const onVcEscalationCancel = () => {
    setModalVCEscalationFShow(false);
    setAddVcEscalationData({});
    setEscalSelectedData({});
    setEscalActiveClass(false);
    setParamFlag("");
  };

  const onSelectVcEscal = (data) => {
    //  // console.log(data, "data");
    setUniqueId(data.unique_id);
    setEscalSelectedData(data);
    setEscalActiveClass(true);
    dispatch(getVcEscalation2List(data && data.survivor_vc, data._id));
    setAddVcEscalation2Data({});
    setEscalSelected2Data({});
    setModalVCEscalation2FShow(false);
    setAddVcData({});
    setPictureData({});

    setParamFlag("");
    setShowAlert(false);
  };

  //// for escalation 1 ///////////
  const onAddVcEscalation = (e) => {
    //  // console.log(e, "eeeeeeeeee");
    // console.log(selectedData,"gotoAddVcEsc")
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertFlag("alert");
      setAlertMessage("Please Select one VC to add Escalation !!");
    } else if (selectedData && selectedData.status == "Concluded") {
      // alert("You are not allowed to add Escalation for this VC!!");
      setAlertFlag("concluded");
      setAlertMessage("Can not Add Escalation 2 for Concluded VC Escalation");
      handleShow();
    } else {
      handleCloseAlert();

      setAddVcEscalationData({
        ...addVcEscalationData,
        lawyer: selectedData && selectedData.lawyer && selectedData.lawyer._id,
        source: selectedData && selectedData.source,
        status: selectedData && selectedData.status,
        escalated_at: selectedData && selectedData.applied_at,
      });
      setModalVCEscalationFShow(true);
      setEscalActiveClass(false);
    }
  };

  // console.log()
  //// for escalation 1 ///////////
  const oneditVcEscalation = (e) => {
    setParamFlag(e);

    if (!escalSelectedData._id) {
      setShowAlert(true);
      setAlertFlag("alert");
      setAlertMessage("Please select one escalation !!");
    } else if (
      escalSelectedData.status &&
      escalSelectedData.status === "Conculded"
    ) {
      // alert("You are not allowed to edit this Escalation !!");
      setAlertFlag("concluded");
      setAlertMessage("Can not Add Escalation for Concluded VC");
      handleShow();
    } else {
      setModalVCEscalationFShow(true);
      setAddVcEscalationData(escalSelectedData);
    }
  };

  //// for escalation 2 ///////////
  const onSelectVcEscal2 = (e, data) => {
    //  // console.log(data, "daaaa");
    setEscalSelected2Data(data);
    setEscalSelectedData(data);
    getVcEscalation2ListLocal(data && data.survivor_vc, data && data._id);
  };

  const onSelectVcEscalMulti = (data) => {
    //  // console.log(data, "daaaa");
    setEscalSelected2Data(data);
    setEscalSelectedData(data);
  };

  const onAddSubVcEscalation2 = () => {
    setModalVCEscalation2FShow(true);
  };
  const onAddVcEscalation2 = (e) => {
    //  // console.log(e, "eeeeeeeeee");
    if (escalSelectedData && !escalSelectedData._id) {
      setShowAlert(true);
      setAlertFlag("alert");
      setAlertMessage("Please Select one Escalation to add Escalation 2 !!");
    } else if (
      escalSelectedData &&
      escalSelectedData.status &&
      escalSelectedData.status === "Conculded"
    ) {
      setShowAlert(true);
      setAlertFlag("alert");
      setAlertMessage(
        "You are not allowed to add Escalation 2 for this Escalation!!"
      );
    } else {
      setModalVCEscalation2FShow(true);
      setAddVcEscalation2Data({
        lawyer:
          escalSelectedData &&
          escalSelectedData.lawyer &&
          escalSelectedData.lawyer,
        source: escalSelectedData && escalSelectedData.source,
      });
      setEscalActiveClass(false);
    }
  };

  //  // console.log(addVcEscalationData, "setAddVcEscalationData");

  //// for escalation 2 ///////////

  const onVcEscalation2Cancel = () => {
    setModalVCEscalation2FShow(false);
    setAddVcEscalation2Data({});
  };

  useEffect(() => {
    dispatch(getSurvivorDetails(props.location.state));
    dispatch(getSurvivalVcList(props.location.state));
    // dispatch(getAuthorityList());
  }, [props]);

  ////////////// get vc eacalation list by vc ////////////////////

  ////// to split "_" and make camel case function ////////
  function capitalize(str) {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  }

  useEffect(() => {
    if (selectedData && selectedData._id) {
      dispatch(getVcEscalationList(selectedData && selectedData._id));
    }
    // else{

    // }
  }, [selectedData]);

  ///////////// set authority value by autority type in authoruty field /////////////////

  useEffect(() => {
    if (selectedData && selectedData.applied_at) {
      setAppliedAtId(selectedData && selectedData.applied_at._id);
    } else if (addVcData && addVcData.applied_at) {
      setAppliedAtId(addVcData && addVcData.applied_at);
    }
  }, [addVcData]);

  useEffect(() => {
    if (
      addVcEscalationData &&
      addVcEscalationData.escalated_at &&
      addVcEscalationData.escalated_at._id
    ) {
      dispatch(
        getAuthorityByAuthorityType(addVcEscalationData.escalated_at._id)
      );
    } else if (addVcEscalationData && addVcEscalationData.escalated_at) {
      dispatch(getAuthorityByAuthorityType(addVcEscalationData.escalated_at));
    }
  }, [addVcEscalationData.escalated_at]);
  ////////////// set deaful value in video confrencig field for  Vc ////////

  useEffect(() => {
    if (addVcData && addVcData.source === "sa") {
      setAddVcData({
        ...addVcData,
        video_conferencing: false,
      });
    }
  }, [addVcData && addVcData.source]);

  /////////////// for  VC escalation /////
  useEffect(() => {
    if (addVcEscalationData && addVcEscalationData.source === "sa") {
      setAddVcEscalationData({
        ...addVcEscalationData,
        video_conferencing: false,
      });
    }
  }, [addVcEscalationData && addVcEscalationData.source]);

  //////////// set DIFFERENCE BETWEEN AMOUNT CLAIMED AND REWARDED(₹): for VC /////

  useEffect(() => {
    let firstAmount = addVcData.amount_claimed;
    let awardedAmout = addVcData.amount_awarded;
    let finalAmount = Math.abs(firstAmount - awardedAmout);
    setAddVcData({
      ...addVcData,
      difference_between_amount_claim_reward: finalAmount,
    });
  }, [addVcData.amount_claimed && addVcData.amount_awarded]);

  /////////// for VC escalation //////
  useEffect(() => {
    let firstAmount = addVcEscalationData.amount_claimed;
    let awardedAmout = addVcEscalationData.amount_awarded;
    let finalAmount = Math.abs(firstAmount - awardedAmout);
    setAddVcEscalationData({
      ...addVcEscalationData,
      difference_between_amount_claim_reward: finalAmount,
    });
  }, [
    addVcEscalationData.amount_claimed && addVcEscalationData.amount_awarded,
  ]);

  useEffect(() => {
    let firstAmount = addVcEscalation2Data.amount_claimed;
    let awardedAmout = addVcEscalation2Data.amount_awarded;
    let finalAmount = Math.abs(firstAmount - awardedAmout);
    setAddVcEscalation2Data({
      ...addVcEscalation2Data,
      difference_between_amount_claim_reward: finalAmount,
    });
  }, [
    addVcEscalation2Data.amount_claimed && addVcEscalation2Data.amount_awarded,
  ]);

  useEffect(() => {
    if (
      Number(addVcData.amount_received_in_bank) >
      Number(addVcData.amount_awarded)
    ) {
      setErrText("Please enter correct Amount");
    } else {
      setErrText("");
    }
    //  // console.log(addVcData, "addVcData");
  }, [addVcData.amount_received_in_bank]);

  useEffect(() => {
    if (
      Number(addVcEscalationData.amount_received_in_bank) >
      Number(addVcEscalationData.amount_awarded)
    ) {
      setErrText("Please enter correct Amount");
    } else {
      setErrText("");
    }
  }, [addVcEscalationData.amount_received_in_bank]);

  useEffect(() => {
    if (
      Number(addVcEscalation2Data.amount_received_in_bank) >
      Number(addVcEscalation2Data.amount_awarded)
    ) {
      setErrText("Please enter correct Amount");
    } else {
      setErrText("");
    }
  }, [addVcEscalation2Data.amount_received_in_bank]);

  /////////////////////file upload function/////////////////////////
  const handleFileInput = (e, flag) => {
    let data = e.target.files[0];

    setFileSelect(e.target.files[0]);
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
        // console.log("successfully uploaded", response);
        if (response && response.data.error === false) {
          const { data } = response;
          if (flag == "vc") {
            setAddVcData({
              ...addVcData,
              vc_application:
                "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
            });
          } else if (flag == "escal") {
            setAddVcEscalationData({
              ...addVcEscalationData,
              vc_application:
                "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
            });
          } else if (flag == "escal2") {
            setAddVcEscalation2Data({
              ...addVcEscalation2Data,
              vc_application:
                "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
            });
          }
          setPictureData(data.data.filePath);
          // console.log(pictureData);
        } else {
          if (flag == "vc") {
            setAddVcData({
              ...addVcData,
              vc_application: "",
            });
          } else if (flag == "escal2") {
            setAddVcEscalation2Data({
              ...addVcEscalation2Data,
              vc_application: "",
            });
          } else {
            setAddVcEscalationData({
              ...addVcEscalationData,
              vc_application: "",
            });
          }
          handleClick();
          setUpdateMessage(response && response.data && response.data.data.message);
          setMessagType("error");
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const currencyFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  // const handleSubmit = (event) => {
  //   // console.log(event, "habdleSubmit");
  //   // const {form}= event.target
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     if (addVcData && addVcData._id) {
  //       addVcFunc(event);
  //     } else {
  //       event.preventDefault();
  //       event.stopPropagation();
  //     }
  //   } else {
  //     addVcFunc(event);
  //   }
  //   setValidated(true);
  // };

  useEffect(() => {
    if (addVcData && addVcData.status) {
      setCustomError({
        name: "status",
        message: "",
      });
    } else if (addVcData && addVcData.source) {
      setCustomError({
        name: "source",
        message: "",
      });
      // setAppliedDateErr(false)
    } else if (addVcData && addVcData.lawyer) {
      setCustomError({
        name: "lawyer",
        message: "",
      });
    } else if (addVcData && addVcData.applied_at) {
      setCustomError({
        name: "applied_at",
        message: "",
      });
    } else if (addVcData && addVcData.authority) {
      setCustomError({
        name: "authority",
        message: "",
      });
    } else if (addVcData && addVcData.applied_date) {
      setCustomError({
        name: "applied_date",
        message: "",
      });
    } else if (addVcData && addVcData.application_number) {
      setCustomError({
        name: "application_number",
        message: "",
      });
    } else if (addVcData && addVcData.amount_claimed) {
      setCustomError({
        name: "amount_claimed",
        message: "",
      });
    } else if (addVcData && addVcData.result) {
      setCustomError({
        name: "result",
        message: "",
      });
    } else if (addVcData && addVcData.reason_for_escalation) {
      setCustomError({
        name: "reason_for_escalation",
        message: "",
      });
    } else {
      setCustomError({ name: "", message: "" });
    }
  }, [addVcData]);

  ///////////// add vc api call function /////////

  const addVcFunc = (e) => {
    e.preventDefault();
    let pattern = /[0-9\s]{1,}[a-zA-Z]{0,}/g
    if (addVcData && !addVcData.status) {
      setCustomError({
        name: "status",
        message: "Please select Status",
      });
    } else if (addVcData && !addVcData.source) {
      setCustomError({
        name: "source",
        message: "Please select Source",
      });
      // setAppliedDateErr(false)
    } else if (addVcData && !addVcData.lawyer) {
      setCustomError({
        name: "lawyer",
        message: "Please select Lawyer",
      });
    } else if (addVcData && !addVcData.applied_at) {
      setCustomError({
        name: "applied_at",
        message: "Please select Applied at",
      });
    } else if (addVcData && !addVcData.authority) {
      setCustomError({
        name: "authority",
        message: "Please select Authority",
      });
    } else if (addVcData && !addVcData.applied_date) {
      setCustomError({
        name: "applied_date",
        message: "Please select Date",
      });
    } else if (addVcData && !addVcData.application_number) {
      setCustomError({
        name: "application_number",
        message: "Please enter Application number",
      });
    } else if(!pattern.test(addVcData && addVcData.application_number)){
      setCustomError({
        name: "application_number",
        message: "Please enter valid Application number",
      });
    }
     else if (addVcData && !addVcData.amount_claimed) {
      setCustomError({
        name: "amount_claimed",
        message: "Please enter Claimed Amount ",
      });
    } else if (addVcData && !addVcData.result) {
      setCustomError({
        name: "result",
        message: "Please select Result",
      });
    } else if (addVcData && !addVcData.reason_for_escalation) {
      setCustomError({
        name: "reason_for_escalation",
        message: "Please select Escalation Reason",
      });
    } else {
      setCustomError({ name: "", message: "" });
      // console.warn(pictureData, profile);
      var body = {
        ...addVcData,
        survivor: props.location.state,
      };
      var updateData = {
        ...addVcData,
        survivor: props.location.state,
        user_id: deletedById && deletedById,
      };
      // console.log("body", body);
      if (addVcData && addVcData._id) {
        setResultLoad(true);
        axios
          .patch(
            api + "/survival-vc/update/" + addVcData._id,
            updateData,
            axiosConfig
          )
          .then((response) => {
            // console.log(response);

            setValidated(false);
            setResultLoad(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("success");
              dispatch(getSurvivalVcList(props.location.state));
              setModalVCShow(false);
              setAddVcData({});
              // setActiveClass(false);
              setAddVcEscalationData({});
              // setSelectedData({});
              setParamFlag("");
            } else {
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("error");
            }
          })
          .catch((error) => {
            setResultLoad(false);

            // console.log(error, "fir add error");
          });
      } else {
        setResultLoad(true);

        axios
          .post(api + "/survival-vc/create", body, axiosConfig)
          .then((res) => {
            // console.log(res);

            setResultLoad(false);
            setValidated(false);

            if (res && res.data && res.data.error == false) {
              const { data } = res;
              handleClick();
              setUpdateMessage(res && res.data.message);
              setMessagType("success");
              dispatch(getSurvivalVcList(props.location.state));
              setModalVCShow(false);
              setAddVcData({});
              setPictureData({});
              // setActiveClass(false);
              setAddVcEscalationData({});
              // setSelectedData({});
              setParamFlag("");
            } else {
              handleClick();
              setUpdateMessage(res && res.data.message);
              setMessagType("error");
            }
          })
          .catch((error) => {
            setResultLoad(false);

            // console.log(error);
            // setUpdateMessage(error && error.message)
          });
      }
    }
  };

  useEffect(() => {
    if (addVcEscalationData && addVcEscalationData.status) {
      setCustomError({
        name: "status",
        message: "",
      });
    } else if (addVcEscalationData && addVcEscalationData.source) {
      setCustomError({
        name: "source",
        message: "",
      });
      // setAppliedDateErr(false)
    } else if (addVcEscalationData && addVcEscalationData.lawyer) {
      setCustomError({
        name: "lawyer",
        message: "",
      });
    } else if (addVcEscalationData && addVcEscalationData.escalated_at) {
      setCustomError({
        name: "escalated_at",
        message: "",
      });
    } else if (addVcEscalationData && addVcEscalationData.authority) {
      setCustomError({
        name: "authority",
        message: "",
      });
    } else if (addVcEscalationData && addVcEscalationData.applied_date) {
      setCustomError({
        name: "applied_date",
        message: "",
      });
    } else if (addVcEscalationData && addVcEscalationData.application_number) {
      setCustomError({
        name: "application_number",
        message: "",
      });
    } else if (addVcEscalationData && addVcEscalationData.amount_claimed) {
      setCustomError({
        name: "amount_claimed",
        message: "",
      });
    } else if (addVcEscalationData && addVcEscalationData.result) {
      setCustomError({
        name: "result",
        message: "",
      });
    } else if (
      addVcEscalationData &&
      addVcEscalationData.reason_for_escalation
    ) {
      setCustomError({
        name: "reason_for_escalation",
        message: "",
      });
    } else {
      setCustomError({ name: "", message: "" });
    }
  }, [addVcEscalationData]);

  ////////////// API CALL FUCTION FOR ADD AND UPDATE VC ESCALATION ////////
  const addVcEscalationFunc = (e) => {
    e.preventDefault();
    let pattern = /[0-9\s]{1,}[a-zA-Z]{0,}/g
    if (addVcEscalationData && !addVcEscalationData.status) {
      setCustomError({
        name: "status",
        message: "Please select Status ",
      });
    } else if (addVcEscalationData && !addVcEscalationData.source) {
      setCustomError({
        name: "source",
        message: "Please select Source ",
      });
      // setAppliedDateErr(false)
    } else if (addVcEscalationData && !addVcEscalationData.lawyer) {
      setCustomError({
        name: "lawyer",
        message: "Please select Lawyer ",
      });
    } else if (addVcEscalationData && !addVcEscalationData.escalated_at) {
      setCustomError({
        name: "escalated_at",
        message: "Please select Escalated At",
      });
    } else if (addVcEscalationData && !addVcEscalationData.authority) {
      setCustomError({
        name: "authority",
        message: "Please select Authority",
      });
    } else if (addVcEscalationData && !addVcEscalationData.applied_date) {
      setCustomError({
        name: "applied_date",
        message: "Please select Date",
      });
    } else if (addVcEscalationData && !addVcEscalationData.application_number) {
      setCustomError({
        name: "application_number",
        message: "Please enter Application number",
      });
    }else if(!pattern.test(addVcEscalationData && addVcEscalationData.application_number)){
      setCustomError({
        name: "application_number",
        message: "Please enter valid Application number",
      });
    } else if (addVcEscalationData && !addVcEscalationData.amount_claimed) {
      setCustomError({
        name: "amount_claimed",
        message: "Please enter Amount Claimed",
      });
    } else if (addVcEscalationData && !addVcEscalationData.result) {
      setCustomError({
        name: "result",
        message: "Please select Result ",
      });
    } else if (
      addVcEscalationData &&
      !addVcEscalationData.reason_for_escalation
    ) {
      setCustomError({
        name: "reason_for_escalation",
        message: "Please select Reason for Escalation",
      });
    } else {
      setCustomError({ name: "", message: "" });

      var updateData = {
        ...addVcEscalationData,
        flag: true,
        survivor: props.location.state,
        survivor_vc: selectedData && selectedData._id,
        user_id: deletedById && deletedById,
      };
      var addData = {
        ...addVcEscalationData,
        flag: true,
        survivor: props.location.state,
        survivor_vc: selectedData && selectedData._id,
      };
      console.warn(addData, "addData", updateData, "updateData");

      if (addVcEscalationData && addVcEscalationData._id) {
        setResultLoad(true);

        axios
          .patch(
            api + "/vc-escalation/update/" + addVcEscalationData._id,
            updateData,
            axiosConfig
          )
          .then((response) => {
            // console.log(response);

            setValidatedEscal1(false);
            setResultLoad(false);

            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("success");
              // dispatch(getSurvivalVcList(props.location.state));
              dispatch(getVcEscalationList(selectedData && selectedData._id));
              setSelectedData({});
              setModalVCEscalationFShow(false);
              // setAddVcData({});
              // setActiveClass(false);
              setAddVcEscalationData({});
              // setEscalActiveClass(false);
              // setEscalSelectedData({});
              setParamFlag("");
            } else {
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("error");
            }
          })
          .catch((error) => {
            setResultLoad(false);

            // console.log(error, "fir add error");
          });
      } else {
        setResultLoad(true);

        axios
          .post(api + "/vc-escalation/create", addData, axiosConfig)
          .then((res) => {
            // console.log(res);

            setValidatedEscal1(false);
            setResultLoad(false);

            dispatch(getVcEscalationList(selectedData && selectedData._id));
            if (res && res.data && res.data.error === false) {
              const { data } = res;
              handleClick();
              setUpdateMessage(res && res.data.message);
              setMessagType("success");
              dispatch(getSurvivalVcList(props.location.state));

              setModalVCEscalationFShow(false);
              // setAddVcData({});
              setPictureData({});
              // setActiveClass(false);
              setAddVcEscalationData({});
              // setEscalActiveClass(false);
              // setEscalSelectedData({});
              setParamFlag("");
            } else {
              handleClick();
              setUpdateMessage(res && res.data.message);
              setMessagType("error");
            }
          })
          .catch((error) => {
            // console.log(error);
            setResultLoad(false);

            // setUpdateMessage(error && error.message)
          });
      }
    }
  };

  const onescalation2DateHandel = (e) => {
    setAddVcEscalation2Data({
      ...addVcEscalation2Data,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (addVcEscalation2Data && addVcEscalation2Data.status) {
      setCustomError({
        name: "status",
        message: "",
      });
    } else if (addVcEscalation2Data && addVcEscalation2Data.source) {
      setCustomError({
        name: "source",
        message: "",
      });
      // setAppliedDateErr(false)
    } else if (addVcEscalation2Data && addVcEscalation2Data.lawyer) {
      setCustomError({
        name: "lawyer",
        message: "",
      });
    } else if (addVcEscalation2Data && addVcEscalation2Data.escalated_at) {
      setCustomError({
        name: "escalated_at",
        message: "",
      });
    } else if (addVcEscalation2Data && addVcEscalation2Data.authority) {
      setCustomError({
        name: "authority",
        message: "",
      });
    } else if (addVcEscalationData && addVcEscalationData.applied_date) {
      setCustomError({
        name: "applied_date",
        message: "",
      });
    } else if (addVcEscalationData && addVcEscalationData.application_number) {
      setCustomError({
        name: "application_number",
        message: "",
      });
    } else if (addVcEscalation2Data && addVcEscalation2Data.amount_claimed) {
      setCustomError({
        name: "amount_claimed",
        message: "",
      });
    } else if (addVcEscalation2Data && addVcEscalation2Data.result) {
      setCustomError({
        name: "result",
        message: "",
      });
    } else if (
      addVcEscalation2Data &&
      addVcEscalation2Data.reason_for_escalation
    ) {
      setCustomError({
        name: "reason_for_escalation",
        message: "",
      });
    } else {
      setCustomError({ name: "", message: "" });
    }
  }, [addVcEscalation2Data]);
  ////////////// API CALL FUNCTION FOR ADD AND UPDATE VC ESCALATION ////////
  const addVcEscalation2Func = (e) => {
    // console.log(e, "eee");
    e.preventDefault();
    let pattern = /[0-9\s]{1,}[a-zA-Z]{0,}/g
    if (addVcEscalation2Data && !addVcEscalation2Data.status) {
      setCustomError({
        name: "status",
        message: "Please select Status ",
      });
    } else if (addVcEscalation2Data && !addVcEscalation2Data.source) {
      setCustomError({
        name: "source",
        message: "Please select Source ",
      });
      // setAppliedDateErr(false)
    } else if (addVcEscalation2Data && !addVcEscalation2Data.lawyer) {
      setCustomError({
        name: "lawyer",
        message: "Please select Lawyer ",
      });
    } else if (addVcEscalation2Data && !addVcEscalation2Data.escalated_at) {
      setCustomError({
        name: "escalated_at",
        message: "Please select Escalated At",
      });
    } else if (addVcEscalation2Data && !addVcEscalation2Data.authority) {
      setCustomError({
        name: "authority",
        message: "Please select Authority",
      });
    } else if (addVcEscalation2Data && !addVcEscalation2Data.applied_date) {
      setCustomError({
        name: "applied_date",
        message: "Please select Date",
      });
    } else if (
      addVcEscalation2Data &&
      !addVcEscalation2Data.application_number
    ) {
      setCustomError({
        name: "application_number",
        message: "Please enter Application number",
      });
    }else if(!pattern.test( addVcEscalation2Data && addVcEscalation2Data.application_number)){
      setCustomError({
        name: "application_number",
        message: "Please enter valid Application number",
      });
    }
     else if (addVcEscalation2Data && !addVcEscalation2Data.amount_claimed) {
      setCustomError({
        name: "amount_claimed",
        message: "Please enter Amount Claimed",
      });
    } else if (addVcEscalation2Data && !addVcEscalation2Data.result) {
      setCustomError({
        name: "result",
        message: "Please select Result ",
      });
    } else if (
      addVcEscalation2Data &&
      !addVcEscalation2Data.reason_for_escalation
    ) {
      setCustomError({
        name: "reason_for_escalation",
        message: "Please select Reason for Escalation",
      });
    } else {
      setCustomError({ name: "", message: "" });

      var body = {
        ...addVcEscalation2Data,
        flag: false,
        survivor: props.location.state,
        survivor_vc: selectedData && selectedData._id,
        survivor_vc_escalation: escalSelectedData && escalSelectedData._id,
      };
      // console.log("body", body);
      setResultLoad(true);

      axios
        .post(api + "/vc-escalation/create", body, axiosConfig)
        .then((res) => {
          // console.log(res);

          setValidatedEscal2(false);
          setResultLoad(false);
          dispatch(getVcEscalationList(selectedData && selectedData._id));
          if (res && res.data && res.data.error === false) {
            const { data } = res;
            handleClick();
            setUpdateMessage(res && res.data.message);
            setMessagType("success");
            dispatch(getSurvivalVcList(props.location.state));
            getVcEscalation2ListLocal(
              selectedData && selectedData._id,
              escalSelectedData && escalSelectedData._id
            );
            setAddVcEscalation2Data({});
            setEscalSelected2Data({});
            setModalVCEscalation2FShow(false);
            setAddVcData({});
            setPictureData({});

            setParamFlag("");
          } else {
            handleClick();
            setUpdateMessage(res && res.data.message);
            setMessagType("error");
          }
        })
        .catch((error) => {
          setResultLoad(false);

          // console.log(error);
        });
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
  // console.log(survivalVcList, "survivalVc");

  const exportToCsv = (e) => {
    // console.log(e, "e");
    e.preventDefault();
    let headers = [
      "Id,Amount Awarded,Amount Claimed,Amount Received In Bank,Amount Received at Bank Date,Application Number,Applied At,Applied Date,Authority,Date Of Order,Difference Betwwen aount claim and reward,Escalation,Lawyer,Reason For Escalation,Result,Source,Status,Survivor,Total Escalation,Unique Id,Video Conferencing,Created At",
    ];
    let exportData = [];
    {
      survivalVcList.map((x) => {
        exportData.push({
          _id: x && x._id,
          AmountAwarded: x.amount_awarded,
          AmountClaimed: x.amount_claimed,
          AmountReceivedInBank: x.amount_received_in_bank,
          amount_received_in_bank_date: moment(
            x.amount_received_in_bank_date
          ).format("DD-MMM-YYYY"),
          application_number: x.application_number,
          applied_at: x && x.applied_at && x.applied_at.name,
          applied_date: moment(x.applied_date).format("DD-MMM-YYYY"),
          authority: x.authority,
          date_of_order: moment(x.date_of_order).format("DD-MMM-YYYY"),
          difference_between_amount_claim_reward:
            x.difference_between_amount_claim_reward,
          escalation: x.escalation ? "YES" : "NO",
          lawyer: x && x.lawyer && x.lawyer.name,
          reason_for_escalation: x.reason_for_escalation,
          result: x.result,
          source: x.source,
          status: x.status,
          survivor: x.survivor && x.survivor.name,
          totalEscalation: x.totalEscalation,
          uniqueid: x.unique_id,
          videoCon: x.video_conferencing ? "YES" : "NO",
          createdAt: moment(x.createdAt).format("DD-MMM-YYYY"),
        });
      });
    }
    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const {
        _id,
        AmountAwarded,
        AmountClaimed,
        AmountReceivedInBank,
        amount_received_in_bank_date,
        application_number,
        applied_at,
        applied_date,
        authority,
        date_of_order,
        difference_between_amount_claim_reward,
        escalation,
        lawyer,
        reason_for_escalation,
        result,
        source,
        status,
        survivor,
        totalEscalation,
        uniqueid,
        videoCon,
        createdAt,
      } = user;
      acc.push(
        [
          _id,
          AmountAwarded,
          AmountClaimed,
          AmountReceivedInBank,
          amount_received_in_bank_date,
          application_number,
          applied_at,
          applied_date,
          authority,
          date_of_order,
          difference_between_amount_claim_reward,
          escalation,
          lawyer,
          reason_for_escalation,
          result,
          source,
          status,
          survivor,
          totalEscalation,
          uniqueid,
          videoCon,
          createdAt,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "survivalVcList.csv",
      fileType: "text/csv",
    });
  };

  const applicationDateHandel = (e) => {
    setAddVcData({
      ...addVcData,
      [e.target.name]: e.target.value,
    });
  };

  const dateOfOrderHandel = (e) => {
    setAddVcData({
      ...addVcData,
      [e.target.name]: e.target.value,
    });
  };

  const amountReceivedHandler = (e) => {
    setAddVcData({
      ...addVcData,
      [e.target.name]: e.target.value,
    });
  };

  const escalaApplicationDateHandel = (e) => {
    setAddVcEscalationData({
      ...addVcEscalationData,
      [e.target.name]: e.target.value,
    });
  };
  const escalDateFirstHandel = (e) => {
    setAddVcEscalationData({
      ...addVcEscalationData,
      [e.target.name]: e.target.value,
    });
  };

  const escalAmountReceivedDateHandel = (e) => {
    setAddVcEscalationData({
      ...addVcEscalationData,
      [e.target.name]: e.target.value,
    });
  };

  ////////////// for PDF ////////////

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
    doc.text("SURVIVOR VICTIM COMPENSATION LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "SOURCE",
      "APPL. DT.",
      "STATUS",
      "FIRST AWRD.",
      "AWRD. DT.",
      "AMT. CLAIMED",
      "AMT. RCVD. IN BANK",
      "AMT. DIFFERENCE",
      "RESULT",
    ];
    const name = "survivor-vc-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    survivalVcList?.forEach((item) => {
      const temp = [
        item.source.toUpperCase(),
        moment(item.applied_date).format("DD-MMM-YYYY"),
        item.status && item.status,
        item.amount_awarded,
        moment(item.amount_received_in_bank_date).format("DD-MMM-YYYY"),
        item.amount_claimed,
        item.amount_received_in_bank,
        item.difference_between_amount_claim_reward,
        item.escalation,
        // item.reason_for_escalation,
        item.result,
        // item.video_conferencing,
        // item.totalEscalation,
        // item.lawyer?.name,
        // moment(item.createdAt).format("DD-MMM-YYYY"),
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
          type={messageType}
          message={updateMessage}
        />
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">Victim Compensation</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>VC</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topProcedural Correctioncartbar topcartbar white_box_shadow">
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
                    <Dropdown.Item onClick={exportToCsv}>
                      Download CSV
                    </Dropdown.Item>
                    <Dropdown.Item onClick={downloadPdf}>
                      Download PDF
                    </Dropdown.Item>
                    {currentModule &&
                      JSON.parse(currentModule).can_edit == true && (
                        <Dropdown.Item
                          as="button"
                          onClick={(e) => onAddVcEscalation(e)}
                        >
                          Add Escalation
                        </Dropdown.Item>
                      )}
                    <Dropdown.Item onClick={() => changeLogFunc("vc")}>
                      Change Log
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => gotoArchiveList(e)}>
                      Archive Items
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
                  <span onClick={() => onGotoAddVc()}>
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
                  <span onClick={() => onGotoEditVc("edit")}>
                    <i className="fal fa-pencil"></i>
                  </span>
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
                <DataTableVcFilter
                  survivalVcList={
                    survivalVcList &&
                    survivalVcList.length > 0 &&
                    survivalVcList
                  }
                  survivorName={
                    survivorDetails &&
                    survivorDetails.survivor_name &&
                    survivorDetails.survivor_name
                  }
                  isLoading={isLoading}
                  onSelectRow={onSelectRow}
                  selectedProduct5={selectedProduct5}
                />
              </div>
            )}
          </div>
          {vcEscalationList && vcEscalationList.length > 0 && (
            <>
              <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
                <div className="vieweditdelete">
                  <MDBTooltip
                    tag="button"
                    wrapperProps={{ className: "add_btn view_btn" }}
                    title="Add Escalation 2"
                  >
                    <span onClick={() => onAddVcEscalation2()}>
                      <i className="fal fa-plus-circle"></i>
                    </span>
                  </MDBTooltip>
                  <MDBTooltip
                    tag="a"
                    wrapperProps={{ className: "edit_btn" }}
                    title="Edit"
                  >
                    <span onClick={() => oneditVcEscalation("edit")}>
                      <i className="fal fa-pencil"></i>
                    </span>
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
                  Escalation 1 Of {selectedData && selectedData.unique_id}
                </h4>
                <div className="table-responsive big-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="16.66%">Id</th>
                        <th width="16.66%">Source</th>
                        <th width="16.66%">Applied date</th>
                        <th width="16.66%">application number</th>
                        <th width="16.66%">Amount claimed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vcEscalationList && vcEscalationList.length > 0 ? (
                        vcEscalationList.map((item) => {
                          return (
                            <tr
                              className={[
                                item._id === escalSelectedData._id &&
                                  escalActiveClass === true &&
                                  "current",
                              ]}
                              onClick={() => onSelectVcEscal(item)}
                            >
                              <td>
                                {item && item.unique_id && item.unique_id}
                              </td>
                              <td>
                                {item &&
                                  item.source &&
                                  item.source.toUpperCase()}
                              </td>
                              <td>
                                {item &&
                                  item.applied_date &&
                                  moment(item.applied_date).format(
                                    "DD-MMM-YYYY"
                                  )}
                              </td>
                              <td>
                                {item &&
                                  item.application_number &&
                                  item.application_number}
                              </td>
                              <td>
                                {/* {item.amount_claimed && "INR"}{" "} */}
                                {item &&
                                  item.amount_claimed &&
                                  currencyFormat(item.amount_claimed)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td>No Data Found !!!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {vcEscalation2List && vcEscalation2List.length > 0 && (
            <>
              <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
                <div className="vieweditdelete">
                  <MDBTooltip
                    tag="button"
                    wrapperProps={{ className: "add_btn view_btn" }}
                    title="Add Escalation for this Escalation"
                  >
                    <span onClick={() => onAddSubVcEscalation2()}>
                      <i className="fal fa-plus-circle"></i>
                    </span>
                  </MDBTooltip>
                </div>
                <h4 className="mb-4 small_heading">
                  Escalation 2 Of {uniqueId && uniqueId}
                </h4>
                <div className="table-responsive big-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="16.66%">Source</th>
                        <th width="16.66%">Applied date</th>
                        <th width="16.66%">application number</th>
                        <th width="16.66%">Amount claimed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vcEscalation2List && vcEscalation2List.length > 0 ? (
                        vcEscalation2List.map((item) => {
                          return (
                            <tr
                              className={[
                                // item &&
                                //   item._id === escalSelected2Data._id &&
                                selectDisable === true && "current",
                              ]}
                              onClick={(e) => {
                                if (!selectDisable) {
                                  onSelectVcEscal2(e, item);
                                  setSelectDisable(true);
                                }
                              }}
                            >
                              <td>
                                {item &&
                                  item.source &&
                                  item.source.toUpperCase()}
                              </td>
                              <td>
                                {item &&
                                  item.applied_date &&
                                  moment(item.applied_date).format(
                                    "DD-MMM-YYYY"
                                  )}
                              </td>
                              <td>
                                {item &&
                                  item.application_number &&
                                  item.application_number}
                              </td>
                              <td>
                                {item &&
                                  item.amount_claimed &&
                                  currencyFormat(item.amount_claimed)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td>No Data Found !!!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {multipleVcEscalation2List &&
            multipleVcEscalation2List.length > 0 &&
            multipleVcEscalation2List.map((e, index) => {
              let indexNo = index + 3;
              return (
                e &&
                e.length > 0 && (
                  <div id="children-panle">
                    <TestTable
                      data={e}
                      indexNo={indexNo}
                      escalSelectedData={escalSelectedData}
                      currencyFormat={currencyFormat}
                      onSelectVcEscal2={onSelectVcEscalMulti}
                      vcEscalation2ListFunc={getVcEscalation2ListLocal}
                      onAddSubVcEscalation2={onAddSubVcEscalation2}
                    />
                  </div>
                )
              );
            })}
        </div>
      </main>

      {/* vc modal */}
      <Modal
        className="addFormModal"
        show={modalVCShow}
        onHide={setModalVCShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
        backdrop={"static"}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {paramFlag === "edit"
              ? "Update Victim Compensation"
              : "Add Victim Compensation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form
            // noValidate validated={validated} onSubmit={handleSubmit}
            >
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Status <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={addVcData && addVcData.status}
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterVCStatusData &&
                      masterVCStatusData.length > 0 &&
                      masterVCStatusData.map((item) => {
                        return (
                          <option value={item && item.name}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "status" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Source <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    value={addVcData && addVcData.source && addVcData.source}
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="source"
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
                    Lawyer <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="lawyer"
                    value={
                      addVcData && addVcData.lawyer && addVcData.lawyer._id
                    }
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterSurvivorLawyersData &&
                      masterSurvivorLawyersData.length > 0 &&
                      masterSurvivorLawyersData.map((item) => {
                        return (
                          <option value={item && item.name && item.name._id}>
                            {item && item.name && item.name.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "lawyer" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Applied At <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="applied_at"
                    value={
                      addVcData &&
                      addVcData.applied_at &&
                      addVcData.applied_at._id
                    }
                    onChange={(e) => onAppliedAtChangeAtVC(e)}
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterAuthorityTypeData &&
                      masterAuthorityTypeData.length > 0 &&
                      masterAuthorityTypeData.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name && capitalize(item.name)}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "applied_at" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Authority <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="authority"
                    value={addVcData && addVcData.authority}
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {authorityListByAuthType &&
                      authorityListByAuthType.length > 0 &&
                      authorityListByAuthType.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {" "}
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "authority" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application Date <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <DatePicker
                    required
                    name="applied_date"
                    datePickerChange={applicationDateHandel}
                    data={addVcData && addVcData.applied_date}
                    message={"Please select Application Date"}
                  />
                  */}
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addVcData && addVcData.applied_date
                            ? moment(addVcData.applied_date).format(
                                "DD-MMM-YYYY"
                              )
                            : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"applied_date"}
                          className="dateBtn"
                          type="date"
                          onChange={applicationDateHandel}
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
                  {customError.name == "applied_date" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application Number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    name="application_number"
                    defaultValue={
                      addVcData &&
                      addVcData.application_number &&
                      addVcData.application_number
                    }
                    type="text"
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
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
                  {customError.name == "application_number" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Video Conferncing</Form.Label>
                  <Form.Select
                    disabled={
                      addVcData && addVcData.source === "sa" ? true : false
                    }
                    value={
                      addVcData &&
                      addVcData.video_conferencing &&
                      addVcData.video_conferencing
                    }
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="video_conferencing"
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Amount Claimed <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      name="amount_claimed"
                      defaultValue={
                        addVcData &&
                        addVcData.amount_claimed &&
                        addVcData.amount_claimed
                      }
                      type="text"
                      onChange={(e) =>
                        setAddVcData({
                          ...addVcData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                    />
                  </InputGroup>
                  {customError.name == "amount_claimed" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                {addVcData &&
                  addVcData.status &&
                  addVcData.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>Amount Awarded</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="text"
                          defaultValue={
                            addVcData &&
                            addVcData.amount_awarded &&
                            addVcData.amount_awarded
                          }
                          onChange={(e) =>
                            setAddVcData({
                              ...addVcData,
                              [e.target.name]: e.target.value.trim(),
                            })
                          }
                          name="amount_awarded"
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(e)=> {
                            e.preventDefault();
                          }}
                        />
                      </InputGroup>
                    </Form.Group>
                  )}

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>VC Application</Form.Label>

                  <div className="fileuploadForm">
                    <input
                      onChange={(e) => handleFileInput(e, "vc")}
                      type="file"
                    />
                    {addVcData.vc_application ? (
                      <span>
                        {""}
                        {addVcData &&
                          addVcData.vc_application &&
                          addVcData.vc_application.split("_").pop()}
                      </span>
                    ) : (
                      <span>Choose File</span>
                    )}
                  </div>
                  {/* <Form.Control
                    onChange={handleFileInput}
                    type="file"
                    name="file"
                    size="lg"
                    accept="image/png,image/jpeg,application/pdf,application/docx,application/doc"
                  /> */}
                </Form.Group>
                {addVcData &&
                  addVcData.status &&
                  addVcData.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>Date of Order</Form.Label>
                      <DatePicker
                        name="date_of_order"
                        data={addVcData && addVcData.date_of_order}
                        datePickerChange={dateOfOrderHandel}
                      />
                    </Form.Group>
                  )}
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Result <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="result"
                    defaultValue={
                      addVcData && addVcData.result && addVcData.result
                    }
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {vcResultList &&
                      vcResultList.length > 0 &&
                      vcResultList.map((item) => {
                        return (
                          <option value={item && item.name}>
                            {item && item.name}
                          </option>
                        );
                      })}
                    {/* <option value="awarded">Awarded</option>
                    <option value="rejected">Rejected</option>
                    <option value="awaiting">Awaiting</option> */}
                  </Form.Select>
                  {customError.name == "result" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                {addVcData &&
                  addVcData.status &&
                  addVcData.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>Amount received in bank A/C</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="text"
                          defaultValue={
                            addVcData &&
                            addVcData.amount_received_in_bank &&
                            addVcData.amount_received_in_bank
                          }
                          onChange={(e) =>
                            setAddVcData({
                              ...addVcData,
                              [e.target.name]: e.target.value.trim(),
                            })
                          }
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(e)=> {
                            e.preventDefault();
                          }}
                          name="amount_received_in_bank"
                        />
                      </InputGroup>

                      <p style={{ color: "red", fontSize: 12 }}>
                        {errText && errText}
                      </p>
                    </Form.Group>
                  )}
                {addVcData &&
                  addVcData.status &&
                  addVcData.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label> Amount recevied in bank date </Form.Label>
                      <DatePicker
                        name="amount_received_in_bank_date"
                        data={
                          addVcData && addVcData.amount_received_in_bank_date
                        }
                        datePickerChange={amountReceivedHandler}
                      />
                      {/* <Form.Control
                    name="amount_received_in_bank_date"
                    value={
                      addVcData &&
                      addVcData.amount_received_in_bank_date &&
                      moment(addVcData.amount_received_in_bank_date).format(
                        "YYYY-MM-DD"
                      )
                    }
                    type="date"
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  /> */}
                    </Form.Group>
                  )}
                {addVcData &&
                  addVcData.status &&
                  addVcData.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Difference Between Amount Claimed And Rewarded(₹):
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          name="difference_between_amount_claim_reward"
                          value={
                            addVcData && addVcData.amount_awarded
                              ? addVcData.difference_between_amount_claim_reward
                              : addVcData.amount_awarded !== "" && null
                          }
                          type="text"
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(e)=> {
                            e.preventDefault();
                          }}
                          disabled={true}
                        />
                      </InputGroup>
                    </Form.Group>
                  )}

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalation</Form.Label>
                  <Form.Select
                    name="escalation"
                    value={
                      addVcData && addVcData.escalation && addVcData.escalation
                    }
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reason for escalation (For Yes as well as No)
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    name="reason_for_escalation"
                    defaultValue={
                      addVcData &&
                      addVcData.reason_for_escalation &&
                      addVcData.reason_for_escalation
                    }
                    type="text"
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e)=>{
                      if (!/[a-z A-Z 0-9 \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                  {customError.name == "reason_for_escalation" && (
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
                    disabled={resultLoad && resultLoad === true ? true : false}
                    onClick={(e) => addVcFunc(e)}
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

      {/* vc escalatiion modal */}
      <Modal
        className="addFormModal"
        show={modalVCEscalationFShow}
        onHide={setModalVCEscalationFShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
        backdrop={"static"}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {paramFlag === "edit" ? "Update Escalation" : "Add Escalation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form
            // noValidate
            // validated={validatedEscal1}
            // onSubmit={handleSubmitEscal1}
            >
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Status <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.status &&
                      addVcEscalationData.status
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterVCStatusData &&
                      masterVCStatusData.length > 0 &&
                      masterVCStatusData.map((item) => {
                        return (
                          <option value={item && item.name}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "status" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Source <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="source"
                    value={addVcEscalationData && addVcEscalationData.source}
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
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
                    Lawyer <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="lawyer"
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.lawyer &&
                      addVcEscalationData.lawyer
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterSurvivorLawyersData &&
                      masterSurvivorLawyersData.length > 0 &&
                      masterSurvivorLawyersData.map((item) => {
                        return (
                          <option value={item && item.name && item.name._id}>
                            {item && item.name && item.name.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "lawyer" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalated At <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="escalated_at"
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.escalated_at &&
                      addVcEscalationData.escalated_at._id
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterAuthorityTypeData &&
                      masterAuthorityTypeData.length > 0 &&
                      masterAuthorityTypeData.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name && capitalize(item.name)}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "escalated_at" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Authority <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="authority"
                    value={addVcEscalationData && addVcEscalationData.authority}
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {authorityListByAuthType &&
                      authorityListByAuthType.length > 0 &&
                      authorityListByAuthType.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {" "}
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "authority" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application date <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <DatePicker
                    name="applied_date"
                    required
                    data={
                      addVcEscalationData && addVcEscalationData.applied_date
                    }
                    message={"Please enter Application date"}
                    datePickerChange={escalaApplicationDateHandel}
                  /> */}
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addVcEscalationData &&
                          addVcEscalationData.applied_date
                            ? moment(addVcEscalationData.applied_date).format(
                                "DD-MMM-YYYY"
                              )
                            : null
                        }
                        disabled={true}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select date
                      </Form.Control.Feedback>

                      <InputGroup.Text>
                        <Form.Control
                          name={"applied_date"}
                          className="dateBtn"
                          type="date"
                          onChange={escalaApplicationDateHandel}
                          placeholder=""
                          max={moment().format("YYYY-MM-DD")}
                          min={
                            selectedData &&
                            selectedData.applied_date &&
                            moment(selectedData.applied_date).format(
                              "YYYY-MM-DD"
                            )
                          }
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                  {customError.name == "applied_date" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="application_number"
                    defaultValue={
                      addVcEscalationData &&
                      addVcEscalationData.application_number &&
                      addVcEscalationData.application_number
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e)=>{
                      if (!/[a-z A-Z 0-9 _ \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                  {customError.name == "application_number" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Video Conferncing</Form.Label>
                  <Form.Select
                    name="video_conferencing"
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.video_conferencing &&
                      addVcEscalationData.video_conferencing
                    }
                    disabled={
                      addVcEscalationData && addVcEscalationData.source === "sa"
                        ? true
                        : false
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Amount Claimed <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="amount_claimed"
                      defaultValue={
                        addVcEscalationData &&
                        addVcEscalationData.amount_claimed &&
                        addVcEscalationData.amount_claimed
                      }
                      onChange={(e) =>
                        setAddVcEscalationData({
                          ...addVcEscalationData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                    />
                  </InputGroup>
                  {customError.name == "amount_claimed" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                {addVcEscalationData &&
                  addVcEscalationData.status &&
                  addVcEscalationData.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>Amount Awarded </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="amount_awarded"
                          defaultValue={
                            addVcEscalationData &&
                            addVcEscalationData.amount_awarded &&
                            addVcEscalationData.amount_awarded
                          }
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(e)=> {
                            e.preventDefault();
                          }}
                          onChange={(e) =>
                            setAddVcEscalationData({
                              ...addVcEscalationData,
                              [e.target.name]: e.target.value.trim(),
                            })
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  )}
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>VC application</Form.Label>

                  <div className="fileuploadForm">
                    <input
                      onChange={(e) => handleFileInput(e, "escal")}
                      type="file"
                    />
                    {addVcEscalationData.vc_application ? (
                      <span>
                        {""}
                        {addVcEscalationData &&
                          addVcEscalationData.vc_application &&
                          addVcEscalationData.vc_application.split("_").pop()}
                      </span>
                    ) : (
                      <span>Choose File</span>
                    )}
                  </div>
                  {/* <Form.Control
                    type="file"
                    name="file"
                    size="lg"
                    onChange={handleFileInput}
                    accept="image/png,image/jpeg,application/pdf,application/docx,application/doc"
                  /> */}
                </Form.Group>
                {addVcEscalationData &&
                  addVcEscalationData.status &&
                  addVcEscalationData.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>Date of first order</Form.Label>
                      <DatePicker
                        name="date_of_order"
                        datePickerChange={escalDateFirstHandel}
                        data={
                          addVcEscalationData &&
                          addVcEscalationData.date_of_order
                        }
                      />
                    </Form.Group>
                  )}
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Result <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="result"
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.result &&
                      addVcEscalationData.result
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value="" hidden={true}>
                      Please Select
                    </option>
                    {vcEscResultList &&
                      vcEscResultList.length > 0 &&
                      vcEscResultList.map((item) => {
                        return (
                          <option value={item && item.name}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "result" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                {addVcEscalationData &&
                  addVcEscalationData.status &&
                  addVcEscalationData.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>Amount received in bank A/C</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="amount_received_in_bank"
                          defaultValue={
                            addVcEscalationData &&
                            addVcEscalationData.amount_received_in_bank &&
                            addVcEscalationData.amount_received_in_bank
                          }
                          onChange={(e) =>
                            setAddVcEscalationData({
                              ...addVcEscalationData,
                              [e.target.name]: e.target.value.trim(),
                            })
                          }
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(e)=> {
                            e.preventDefault();
                          }}
                        />
                      </InputGroup>

                      <p style={{ color: "red", fontSize: 12 }}>
                        {errText && errText}
                      </p>
                    </Form.Group>
                  )}
                {addVcEscalationData &&
                  addVcEscalationData.status &&
                  addVcEscalationData.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>Amount received in Bank Date</Form.Label>
                      <DatePicker
                        name="amount_received_in_bank_date"
                        datePickerChange={escalAmountReceivedDateHandel}
                        data={
                          addVcEscalationData &&
                          addVcEscalationData.amount_received_in_bank_date &&
                          addVcEscalationData.amount_received_in_bank_date
                        }
                      />
                      {/* <Form.Control
                    type="date"
                    name="amount_received_in_bank_date"
                    defaultValue={
                      addVcEscalationData &&
                      addVcEscalationData.amount_received_in_bank_date &&
                      addVcEscalationData.amount_received_in_bank_date
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Date of first order"
                  /> */}
                    </Form.Group>
                  )}
                {addVcEscalationData &&
                  addVcEscalationData.status &&
                  addVcEscalationData.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Difference between amount claimed and rewarded
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          // type="text"
                          name="difference_between_amount_claim_reward"
                          value={
                            addVcEscalationData &&
                            addVcEscalationData.amount_awarded
                              ? addVcEscalationData.difference_between_amount_claim_reward
                              : addVcEscalationData.amount_awarded !== "" &&
                                null
                          }
                          type="text"
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(e)=> {
                            e.preventDefault();
                          }}
                          disabled={true}
                        />
                      </InputGroup>
                    </Form.Group>
                  )}
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalation</Form.Label>
                  <Form.Select
                    name="escalation"
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.escalation &&
                      addVcEscalationData.escalation
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reason For escalation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="reason_for_escalation"
                    defaultValue={
                      addVcEscalationData &&
                      addVcEscalationData.reason_for_escalation &&
                      addVcEscalationData.reason_for_escalation
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e)=>{
                      if (!/[a-z A-Z 0-9 \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                  {customError.name == "reason_for_escalation" && (
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
                    onClick={() => onVcEscalationCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    onClick={(e) => addVcEscalationFunc(e)}
                    className="submit_btn shadow-0"
                    disabled={resultLoad && resultLoad === true ? true : false}
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

      {/* vc second escaltion modal */}
      <Modal
        className="addFormModal"
        show={modalVCEscalation2FShow}
        onHide={setModalVCEscalation2FShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
        backdrop={"static"}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Escalation 2
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form
            // noValidate
            // validated={validatedEscal2}
            // onSubmit={handleSubmitEscal2}
            >
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Status <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.status &&
                      addVcEscalation2Data.status
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterVCStatusData &&
                      masterVCStatusData.length > 0 &&
                      masterVCStatusData.map((item) => {
                        return (
                          <option value={item && item.name}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "status" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Source <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="source"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.source &&
                      addVcEscalation2Data.source
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
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
                    Lawyer <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="lawyer"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.lawyer &&
                      addVcEscalation2Data.lawyer
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value hidden={true}>
                      Please select
                    </option>
                    {masterSurvivorLawyersData &&
                      masterSurvivorLawyersData.length > 0 &&
                      masterSurvivorLawyersData.map((item) => {
                        return (
                          <option value={item && item.name && item.name._id}>
                            {item && item.name && item.name.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "lawyer" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalated At <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="escalated_at"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.escalated_at &&
                      addVcEscalation2Data.escalated_at._id
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {masterAuthorityTypeData &&
                      masterAuthorityTypeData.length > 0 &&
                      masterAuthorityTypeData.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && capitalize(item.name)}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "escalated_at" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Authority <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="authority"
                    value={
                      addVcEscalation2Data && addVcEscalation2Data.authority
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {authorityListByAuthType &&
                      authorityListByAuthType.length > 0 &&
                      authorityListByAuthType.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {" "}
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "authority" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application date <span className="requiredStar">*</span>
                  </Form.Label>

                  {/* <DatePicker
                    required
                    name="applied_date"
                    datePickerChange={onescalation2DateHandel}
                    data={
                      addVcEscalation2Data && addVcEscalation2Data.applied_date
                    }
                    message={"Please select Application Date"}
                  /> */}
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addVcEscalation2Data &&
                          addVcEscalation2Data.applied_date
                            ? moment(addVcEscalation2Data.applied_date).format(
                                "DD-MMM-YYYY"
                              )
                            : null
                        }
                        disabled={true}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select date
                      </Form.Control.Feedback>
                      <InputGroup.Text>
                        <Form.Control
                          name={"applied_date"}
                          className="dateBtn"
                          type="date"
                          onChange={onescalation2DateHandel}
                          placeholder=""
                          max={moment().format("YYYY-MM-DD")}
                          min={
                            selectedData &&
                            selectedData.applied_date &&
                            moment(selectedData.applied_date).format(
                              "YYYY-MM-DD"
                            )
                          }
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                  {customError.name == "applied_date" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="application_number"
                    defaultValue={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.application_number &&
                      addVcEscalation2Data.application_number
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e)=>{
                      if (!/[a-z A-Z 0-9 \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                  {customError.name == "application_number" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Video Conferncing</Form.Label>
                  <Form.Select
                    name="video_conferencing"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.video_conferencing === "true"
                        ? true
                        : false
                    }
                    disabled={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.source === "sa"
                        ? true
                        : false
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Amount Claimed <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="amount_claimed"
                    defaultValue={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.amount_claimed &&
                      addVcEscalation2Data.amount_claimed
                    }
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                  />
                  {customError.name == "amount_claimed" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                {addVcEscalation2Data &&
                  addVcEscalation2Data.status &&
                  addVcEscalation2Data.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>Amount Awarded </Form.Label>
                      <Form.Control
                        type="text"
                        name="amount_awarded"
                        defaultValue={
                          addVcEscalation2Data &&
                          addVcEscalation2Data.amount_awarded &&
                          addVcEscalation2Data.amount_awarded
                        }
                        onChange={(e) =>
                          setAddVcEscalation2Data({
                            ...addVcEscalation2Data,
                            [e.target.name]: e.target.value.trim(),
                          })
                        }
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onPaste={(e)=> {
                          e.preventDefault();
                        }}
                      />
                    </Form.Group>
                  )}
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>VC application</Form.Label>

                  <div className="fileuploadForm">
                    <input
                      onChange={(e) => handleFileInput(e, "escal2")}
                      type="file"
                    />
                    {addVcEscalation2Data.vc_application ? (
                      <span>
                        {""}
                        {addVcEscalation2Data &&
                          addVcEscalation2Data.vc_application &&
                          addVcEscalation2Data.vc_application.split("_").pop()}
                      </span>
                    ) : (
                      <span>Choose File</span>
                    )}
                  </div>

                  {/* <Form.Control
                    type="file"
                    // required
                    name="file"
                    size="lg"
                    onChange={handleFileInput}
                    accept="image/png,image/jpeg,application/pdf,application/docx,application/doc"
                  /> */}
                </Form.Group>
                {addVcEscalation2Data &&
                  addVcEscalation2Data.status &&
                  addVcEscalation2Data.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>Date of first order</Form.Label>
                      <DatePicker
                        name="date_of_order"
                        datePickerChange={onescalation2DateHandel}
                        data={
                          addVcEscalation2Data &&
                          addVcEscalation2Data.date_of_order
                        }
                      />
                    </Form.Group>
                  )}
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Result <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="result"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.result &&
                      addVcEscalation2Data.result
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please Select
                    </option>
                    {vcEscResultList &&
                      vcEscResultList.length > 0 &&
                      vcEscResultList.map((item) => {
                        return (
                          <option value={item && item.name}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "result" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                {addVcEscalation2Data &&
                  addVcEscalation2Data.status &&
                  addVcEscalation2Data.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>Amount received in bank A/C</Form.Label>
                      <Form.Control
                        type="text"
                        name="amount_received_in_bank"
                        defaultValue={
                          addVcEscalation2Data &&
                          addVcEscalation2Data.amount_received_in_bank &&
                          addVcEscalation2Data.amount_received_in_bank
                        }
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onPaste={(e)=> {
                          e.preventDefault();
                        }}
                        onChange={(e) =>
                          setAddVcEscalation2Data({
                            ...addVcEscalation2Data,
                            [e.target.name]: e.target.value.trim(),
                          })
                        }
                      />
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errText && errText}
                      </p>
                    </Form.Group>
                  )}
                {addVcEscalation2Data &&
                  addVcEscalation2Data.status &&
                  addVcEscalation2Data.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>Amount received in Bank Date</Form.Label>
                      {/* <Form.Control
                    type="date"
                    name="amount_received_in_bank_date"
                    defaultValue={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.amount_received_in_bank_date &&
                      addVcEscalation2Data.amount_received_in_bank_date
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Date of first order"
                  /> */}
                      <DatePicker
                        name="amount_received_in_bank_date"
                        datePickerChange={onescalation2DateHandel}
                        data={
                          addVcEscalation2Data &&
                          addVcEscalation2Data.amount_received_in_bank_date
                        }
                      />
                    </Form.Group>
                  )}
                {addVcEscalation2Data &&
                  addVcEscalation2Data.status &&
                  addVcEscalation2Data.status != "Applied" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Difference between amount claimed and rewarded
                      </Form.Label>
                      <Form.Control
                        // type="text"
                        name="difference_between_amount_claim_reward"
                        value={
                          addVcEscalation2Data &&
                          addVcEscalation2Data.amount_awarded
                            ? addVcEscalation2Data.difference_between_amount_claim_reward
                            : addVcEscalation2Data.amount_awarded !== "" && null
                        }
                        type="text"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        disabled={true}
                        onPaste={(e)=> {
                          e.preventDefault();
                        }}
                      />
                    </Form.Group>
                  )}
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalation</Form.Label>
                  <Form.Select
                    name="escalation"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.escalation &&
                      addVcEscalation2Data.escalation
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reason For escalation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="reason_for_escalation"
                    defaultValue={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.reason_for_escalation &&
                      addVcEscalation2Data.reason_for_escalation
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e)=>{
                      if (!/[a-z A-Z 0-9 \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                  {customError.name == "reason_for_escalation" && (
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
                    onClick={() => onVcEscalation2Cancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    className="submit_btn shadow-0"
                    disabled={resultLoad && resultLoad === true ? true : false}
                    onClick={addVcEscalation2Func}
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
      {/* {showAlert == true && (
        <Modal
          show={showAlert}
          onHide={handleCloseAlert}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <div className="alertTextBox">
              <div className="alertTextBoxImg">
                <img src={alertImg} alt="" />
              </div>
              <h4>Please select a Survivor to Edit</h4>
              <Button variant="secondary" onClick={handleCloseAlert}>
                Close
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )} */}
      {showAlert === true && (
        <AlertComponent
          alertFlag={alertFlag}
          alertMessage={alertMessage}
          goToAddEscal={onAddVcEscalation}
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
          deleteLoader={deleteLoader}
        />
      )}
    </>
  );
};

export default SurvivorVictimCompensation;

{
  /* <Modal className="addFormModal" show={modalVCEscalationSShow} onHide={setModalVCEscalationSShow} size="lg" aria-labelledby="reason-modal" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Escalation 2
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="site_form_wraper">
                    <Form>
                        <Row>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Source</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                    <option>DA</option>
                                    <option>SA</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Lawyer</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Escalated At</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                    <option>SLSA</option>
                                    <option>DLSA</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Authority</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Applied date</Form.Label>
                                <Form.Control type="date" name="applieddate" placeholder="Applied date" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Application number</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Amount Claimed </Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Video Conferncing</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>VC application</Form.Label>
                                <Form.Control
                                    type="file"
                                    required
                                    name="file"
                                    size="lg"
                                />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Date of first oder</Form.Label>
                                <Form.Control type="date" name="dob" placeholder="Date of first oder" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Result</Form.Label>
                                <Form.Select>
                                    <option hidde={true}>Please Select</option>
                                    <option>Awarded</option>
                                    <option>Rejected</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Amount Awarded </Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Amount received in bank A/C</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Amount received in Bank Date</Form.Label>
                                <Form.Control type="date" name="dob" placeholder="Date of first oder" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Difference between amount claimed and rewarded</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Escalation</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Reason For escalation</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>status</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                    <option value={"Applied"}>Applied</option>
                                    <option value={"Awarded"}>Awarded</option>
                                    <option value={"Rejected"}>Rejected</option>
                                    <option value={"Escalated"}>Escalated</option>
                                    <option value={"Concluded"}>Concluded</option>
                                </Form.Select>
                            </Form.Group>                            
                        </Row>
                        <Row className="justify-content-between">
                            <Form.Group as={Col} md="auto">
                                <MDBBtn type="button" className="shadow-0 cancle_btn" color='danger' onClick={() => setModalVCEscalationSShow(false)}>Cancel</MDBBtn>
                            </Form.Group>
                            <Form.Group as={Col} md="auto">
                                <Button type="submit" className="submit_btn shadow-0">Submit</Button>
                            </Form.Group>
                        </Row>
                    </Form>
                </div>
            </Modal.Body>
        </Modal> */
}
