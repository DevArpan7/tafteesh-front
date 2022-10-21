import React, { useState, useEffect, useRef } from "react";
import { Topbar, SurvivorTopCard } from "../../components";

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
import { MultiSelect } from "react-multi-select-component";
import "./survivorchargesheet.css";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import {
  getSurvivorDetails,
  getFirList,
  getTraffickerList,
  getChargeSheetList,
  getChargeSheetListByFirIdandInvestId,
  getModulesChangeLog,
  getSectionByActId,
} from "../../redux/action";
import moment from "moment";
import queryString from "query-string";
import AlertComponent from "../../components/AlertComponent";
import ChargesheetDataTable from "./ChargesheetDataTable";
import DatePicker from "../../components/DatePicker";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { gotoSurvivorArchive } from "../../utils/helper";
import { InputGroup } from "react-bootstrap";

const SurvivorChargesheet = (props) => {
  const [modalChargesheetShow, setModalChargesheetShow] = useState(false);
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [modalInactiveShow, setmodalInactiveShow] = useState(false);

  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const survivorActionDetails = useSelector(
    (state) => state.survivorActionDetails
  );
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [resultLoad2, setResultLoad2] = useState(false);

  // const masterTraffickerData = useSelector(
  //   (state) => state.masterTraffickerData
  // );

  const mastertraffickerDataforSurv = useSelector(
    (state) => state.mastertraffickerDataforSurv
  );
  const chargeSheetList = useSelector((state) => state.chargeSheetList);
  const firList = useSelector((state) => state.firList);
  const [finalAccues, setFinalAccues] = useState([]);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [addChargeSheetData, setAddChargeSheetData] = useState({});
  const [chargeSheetObj, setCahrgeSheetObj] = useState({});
  const [accusedincludedArr, setAccusedincludedArr] = useState([]);
  const [sendAccusedincludedArr, setSendAccusedincludedArr] = useState([]);
  const [accusedNotIncludedObj, setAccusedNotIncludedObj] = useState({});
  const [accusedNotIncludedArr, setAccusedNotIncludedArr] = useState([]);
  const [sectionArrbyFir, setSectionArrbyFir] = useState([]);
  const [addSectionObj, setAddSectionObj] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [updateChargeSheetData, setUpdateChargeSheetData] = useState({});
  const [selectedFir, setSelectedFir] = useState({});
  const [sendaccusedNotincludedArr, setSendAccusedNotincludedArr] = useState(
    {}
  );
  var firSource = localStorage.getItem("firSource");

  const formRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [resultLoad, setResultLoad] = useState(false);
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [validated, setValidated] = useState(false);

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");

  const [isLoading, setIsLoading] = useState(true);
  const [messagType, setMessagType] = useState("");

  const history = useHistory();
  const search = useLocation().search;
  const survivorId = new URLSearchParams(search).get("survivorId");
  const firId = new URLSearchParams(search).get("firId");
  const investId = new URLSearchParams(search).get("investigationId");
  const [firArr, setFirArr] = useState([]);
  const [reason, setReason] = useState({});

  const masterActData = useSelector((state) => state.masterActData);
  const sectionByActId = useSelector((state) => state.sectionByActId);
  const currentModule = localStorage.getItem("currentModule");
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));
  // var firNumber = (localStorage.getItem("firNumber"));
  // var firDate = (localStorage.getItem("firDate"));
  const [firObj, setFirObj] = useState({
    number: localStorage.getItem("firNumber"),
    date: localStorage.getItem("firDate"),
  });
  const [notesCustom, setNotesCustome] = useState({ field: "", message: "" });
  const [notemodalShow, setnotemodalShow] = useState(false);
  const [deleteReason, setDeleteReason] = useState({});
  const [customError, setCustomError] = useState({ name: "", message: "" });
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [chargeSheetList]);

  ///// open delete note modal //////

  const [accusedDeleteId, setAccusedDeleteId] = useState("");
  const [accuDeleteId, setAccuDeleteId] = useState("");

// console.log(mastertraffickerDataforSurv,"mastertraffickerDataforSurv")


  /////// get chargesheet details API ///
  const chargeSheetDetails = (id) => {
    axios
      .get(api + "/survival-chargesheet/detail/" + id, axiosConfig)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData(data.data);
        }
      })
      .catch((error) => {});
  };

  const changeLogFunc = () => {
    let type = "chargesheet";
    dispatch(getModulesChangeLog(type, deletedById, survivorId));
    props.history.push("/change-log");
  };

  useEffect(() => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "chargesheet" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));
  }, [props]);

  useEffect(() => {
    if (survivorId) {
      dispatch(getFirList(survivorId));
    }
  }, [survivorId]);
  useEffect(() => {
    //console.log(props.location, "location");
    dispatch(getSurvivorDetails(survivorId));

    if (investId && investId) {
      dispatch(
        getChargeSheetListByFirIdandInvestId(survivorId, firId, investId)
      );
    } else {
      dispatch(getChargeSheetList(survivorId));
    }
  }, [survivorId]);

  const gotSupplimentaryChargeSheet = () => {
    //console.log(selectedData);
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one ChargeSheet !!");
      setAlertFlag("alert");
    } else {
      props.history.push({
        pathname: "/survivor-supplimentary-chargesheet",
        state: selectedData._id,
        investId: selectedData,
        firId: props.location.firId,
        flag: "fromInvest",
      });
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  useEffect(() => {
    //console.log( SurvivorFirData, " SurvivorFirData");

    let data =
      firList &&
      firList.data &&
      firList.data.length > 0 &&
      firList.data.filter((x) => x._id === firId && x);
    setFirArr(data);
  }, [firList]);

  /////// notification open function //////
  const handleClick = () => {
    setOpen(true);
  };
  ////// notification close function ///////
  const handleClose = () => {
    setOpen(false);
    // setFinalAccues([]);
  };

  //// on celect row function /////
  const onSelectRow = (e) => {
    //console.log(e);
    if (e !== null) {
      setSelectedData(e);
      scrollToView(e);
      setActiveClass(true);
      setSelectedProduct5(e);
    } else {
      setSelectedData({});
      scrollToView({});
      setActiveClass(false);
      setSelectedProduct5(null);
    }
  };

  ///archieve items
  let url = props.location.search;
  let getId = queryString.parse(url, { parseNumbers: true });

  //console.log(getId, "getId");
  const gotoArchiveList = (e) => {
    gotoSurvivorArchive(e, "chargesheet", getId.survivorId, history);
  };

  const scrollToView = (data) => {
    if (data && data.section && data.section > 0) {
      //   const el = document.getElementById("list_goal_pdf_view");
      //   window.scrollTo(0, el.offsetTop - 50);
      // } else {
      const el = document.getElementById("section-list");
      window.scrollTo(0, el.offsetTop);
    }
  };
  // add charge sheet modal open/////
  const gotoAdd = () => {
    setValidated(false);
    setModalChargesheetShow(true);
    // setFinalAccues([]);
    setSelectedData({});
    setUpdateChargeSheetData({});
    setSelectedProduct5(null);
    setAddChargeSheetData({});
    setCahrgeSheetObj({});
    setAccusedNotIncludedArr([]);
    setSectionArrbyFir([]);
    dispatch(getFirList(survivorId));
  };

  /////// go to edit modal open function//////

  const gotoEdit = (e) => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one ChargeSheet !!");
      setAlertFlag("alert");
    } else {
      setModalChargesheetShow(true);
      setUpdateChargeSheetData(selectedData);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one ChargeSheet !!");
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
    setDeleteLoader(true);
    axios
      .patch(
        api + "/survival-chargesheet/delete/" + selectedData._id,
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
          dispatch(
            getChargeSheetListByFirIdandInvestId(survivorId, firId, investId)
          );
          setShowAlert(false);
          setErorMessage("");
          setSelectedData({});
          setSelectedProduct5(null);
        }else{
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("error");
        }
      })
      .catch((error) => {
        handleClick();
        setDeleteLoader(false);
        setUpdateMessage(error && error.message);
        setMessagType("error");
      });
  };

  useEffect(() => {
    let arr = [];
    let obj = {};

    // let filterdata =
    mastertraffickerDataforSurv &&
      mastertraffickerDataforSurv.length > 0 &&
      mastertraffickerDataforSurv.filter((item) => {
        return (
          accusedNotIncludedArr &&
          accusedNotIncludedArr.length > 0 &&
          accusedNotIncludedArr.map((x) => {
            return (
              (obj = {
                name: x.name === item._id && item.trafficker_name,
                accused_type: x.name === item._id && x.accused_type,
              }),
              arr.push(obj)
            );
          })
        );
      });
    //console.log(arr, obj, "aaaaaaaa");

    setFinalAccues(arr);
  }, [accusedNotIncludedObj]);

  ///////// on cancel button function ///////
  const onCancel = (e) => {
    setAddChargeSheetData({});
    // setAccusedNotIncludedArr([]);
    setAccusedNotIncludedObj({});
    // setAccusedincludedArr([]);
    setCahrgeSheetObj({});
    // setSectionArrbyFir([]);
    // setUpdateChargeSheetData({});
    setModalChargesheetShow(false);
    setActiveClass(false);
    // setFirObj({});
    // setSelectedData({})
    //  setAccusedNotIncludedArr([]);

    // setSendAccusedincludedArr([])
  };

  /////// onchange function of charge sheet date and charge sheet number ////
  const onChargeSheetChange = (e) => {
    //console.log(e);
    setCahrgeSheetObj({
      ...chargeSheetObj,
      [e.target.name]: e.target.value.trim(),
    });
  };
  //console.log(chargeSheetObj, "chargeSheetObj");

  ////// set by default accused from FIR /////////////

  useEffect(() => {
    console.log(firArr, "firArrfirArr");
    let selectedFirArr =
      firArr && firArr.length > 0 && firArr.filter((ele) => ele._id === firId);
    //console.log("selectedFir", selectedFirArr);

    let arr = [];
    let obj = {};
    let showArr = [];
    let showObj = {};

    ////// set data for accused /////////
    selectedFirArr[0] &&
      selectedFirArr[0].accused &&
      selectedFirArr[0].accused.length > 0 &&
      selectedFirArr[0].accused.map((x) => {
        //console.log(x, "x");
        return (
          (obj = {
            name: x && x.name && x.name._id,
            accused_type: x && x.accused_type && x.accused_type,
          }),
          (showObj = {
            name:
              x && x.name && x.name.trafficker_name && x.name.trafficker_name,
            accused_type: x && x.accused_type && x.accused_type,
            is_deleted: x && x.is_deleted,
            accusedId: x && x.name._id,
          }),
          arr.push({ ...obj }),
          showArr.push({ ...showObj })
        );
      });

    /////// set data to show in modal //////////

    setAccusedincludedArr(showArr);
    setSendAccusedincludedArr(arr);

    ////// set data for section /////////

    let sectionObj = {};
    let sectionArr = [];
    selectedFirArr[0] &&
      selectedFirArr[0].section &&
      selectedFirArr[0].section.length > 0 &&
      selectedFirArr[0].section.map((x) => {
        //console.log(x, "x");
        return (
          (sectionObj = {
            section_type: x && x.section_type && x.section_type,
            section_number: x && x.section_number && x.section_number,
            date_of_section_when_added_to_fir:
              x &&
              x.date_of_section_when_added_to_fir &&
              x.date_of_section_when_added_to_fir,
            notes: x && x.notes && x.notes,
          }),
          sectionArr.push({ ...sectionObj }),
          console.log(sectionArr, "sectionArrsectionArr")
        );
      });

    /////// set data in state //////////

    setSectionArrbyFir(sectionArr);
  }, [firArr]);

  console.log(sectionArrbyFir, "sectionArrbyFir");

  //////////// set data for update charge sheet ////////////

  useEffect(() => {
    //console.log(updateChargeSheetData, "updateChargeSheetData");
    setAddChargeSheetData({
      location:
        updateChargeSheetData &&
        updateChargeSheetData.location &&
        updateChargeSheetData.location,
      type_of_violation:
        updateChargeSheetData &&
        updateChargeSheetData.type_of_violation &&
        updateChargeSheetData.type_of_violation,
    });
    setCahrgeSheetObj({
      number:
        updateChargeSheetData &&
        updateChargeSheetData.charge_sheet &&
        updateChargeSheetData.charge_sheet.number &&
        updateChargeSheetData.charge_sheet.number,
      date:
        updateChargeSheetData &&
        updateChargeSheetData.charge_sheet &&
        updateChargeSheetData.charge_sheet.date &&
        updateChargeSheetData.charge_sheet.date,
    });
    // setSelectedFir(updateChargeSheetData && updateChargeSheetData);

    // setFirData(selectedFir[0]);
    let arr = [];
    let obj = {};
    let showArr = [];
    let showObj = {};

    ////// set data for accused included /////////
    updateChargeSheetData &&
      updateChargeSheetData.accused_included &&
      updateChargeSheetData.accused_included.length > 0 &&
      updateChargeSheetData.accused_included.map((x) => {
        //console.log(x, "x");
        return (
          (obj = {
            name: x && x.name && x.name._id,
            accused_type: x && x.accused_type && x.accused_type,
            is_deleted: x && x.is_deleted,
          }),
          (showObj = {
            name:
              x && x.name && x.name.trafficker_name && x.name.trafficker_name,
            accused_type: x && x.accused_type && x.accused_type,
            is_deleted: x && x.is_deleted,
            accusedId: x && x.name._id,
          }),
          arr.push({ ...obj }),
          showArr.push({ ...showObj })
        );
      });

    /////// set data to show in modal //////////

    setAccusedincludedArr(showArr);
    setSendAccusedincludedArr(arr);

    ////// set data for accused not included /////////

    let arr1 = [];
    let obj1 = {};
    let showArr1 = [];
    let showObj1 = {};

    updateChargeSheetData &&
      updateChargeSheetData.accused_not_included &&
      updateChargeSheetData.accused_not_included.length > 0 &&
      updateChargeSheetData.accused_not_included.map((x) => {
        return (
          (obj1 = {
            name: x && x.name && x.name._id,
            accused_type: x && x.accused_type && x.accused_type,
            is_deleted: x && x.is_deleted,
            accusedId: x && x._id,
          }),
          (showObj1 = {
            name:
              x && x.name && x.name.trafficker_name && x.name.trafficker_name,
            accused_type: x && x.accused_type && x.accused_type,
            is_deleted: x && x.is_deleted,
            accusedId: x && x._id,
          }),
          arr1.push({ ...obj1 }),
          showArr1.push({ ...showObj1 })
        );
      });

    /////// set data to show in modal //////////

    setAccusedNotIncludedArr(showArr1);

    setSendAccusedNotincludedArr(arr1);

    /////// set data in state //////////

    setSectionArrbyFir(
      updateChargeSheetData &&
        updateChargeSheetData.section &&
        updateChargeSheetData.section
    );
  }, [updateChargeSheetData]);

  //console.log(accusedNotIncludedArr,sendaccusedNotincludedArr, "firObj",accusedincludedArr,sendAccusedincludedArr);

  ////// onchange function for add accused not included ////////

  const onAccusedChange = (e) => {
    //console.log(e);
    setAccusedNotIncludedObj({
      ...accusedNotIncludedObj,
      [e.target.name]: e.target.value,
      is_deleted: false,
    });
  };
  //////accused submit button function /////
  const onSubmitAccused = (e) => {
    //console.log(accusedNotIncludedObj, "accusedNotIncludedObj");
    e.preventDefault();
    if (accusedNotIncludedObj && !accusedNotIncludedObj.name) {
      setCustomError({
        name: "name",
        message: "Please select Accused",
      });
    } else if (accusedNotIncludedObj && !accusedNotIncludedObj.accused_type) {
      setCustomError({
        name: "accused_type",
        message: "Please select Type of Accused !",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
    if (accusedNotIncludedObj.name && accusedNotIncludedObj.accused_type) {
      let data =
        sendaccusedNotincludedArr &&
        sendaccusedNotincludedArr.length > 0 &&
        sendaccusedNotincludedArr.find(
          (e) => e.name == accusedNotIncludedObj.name
        );
      if (data) {
        setSendAccusedNotincludedArr(sendaccusedNotincludedArr);
        setAccusedNotIncludedArr(accusedNotIncludedArr);
      } else {
        if (accusedNotIncludedObj.name) {
          let trfname =
            mastertraffickerDataforSurv &&
            mastertraffickerDataforSurv.length > 0 &&
            mastertraffickerDataforSurv.find(
              (x) => x._id == accusedNotIncludedObj.name
            );
          if (trfname) {
            accusedNotIncludedObj.trafficker_name = trfname.trafficker_name;
            setSendAccusedNotincludedArr([
              ...sendaccusedNotincludedArr,
              accusedNotIncludedObj,
            ]);
          }
        } else {
          setSendAccusedNotincludedArr([
            ...sendaccusedNotincludedArr,
            accusedNotIncludedObj,
          ]);
        }
        setAccusedNotIncludedArr([
          ...accusedNotIncludedArr,
          accusedNotIncludedObj,
        ]);
      }
    }

    formRef.current.reset();
    setAccusedNotIncludedObj({});
  }
  };

  // console.log(sendaccusedNotincludedArr, "sendaccusedNotincludedArr");

  ////// onchange function for add section////////

  const onSectionChange = (e) => {
    //console.log(e);
    setAddSectionObj({
      ...addSectionObj,
      [e.target.name]: e.target.value.trim(),
    });
    // dispatch(getSectionByActId(e.target.value));
  };
  // //console.log(accusedNotIncludedArr,"accusedNotIncludedArraccusedNotIncludedArr")

  const onSectionChangeSection = (e) => {
    setAddSectionObj({
      ...addSectionObj,
      [e.target.name]: e.target.value,
    });
    dispatch(getSectionByActId(e.target.value));
  };

  const onSectionNumberChange = (e) => {
    setAddSectionObj({
      ...addSectionObj,
      [e.target.name]: e.target.value,
    });
    // dispatch(getSectionByActId(e.target.value))
  };
  ///////section submit button function ////
  const onSubmitASection = (e) => {
    e.preventDefault();
    if (addSectionObj && !addSectionObj.section_type) {
      setCustomError({
        name: "section_type",
        message: "Please select Section Type",
      });
    } else if (addSectionObj && !addSectionObj.section_number) {
      setCustomError({
        name: "section_number",
        message: "Please select Section Number !",
      });
    } else if (addSectionObj && !addSectionObj.date_of_section_when_added_to_fir) {
      setCustomError({
        name: "date_of_section_when_added_to_fir",
        message: "Please select Date!",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });//console.log(addSectionObj, "add");

    if (addSectionObj.section_type) {
      setSectionArrbyFir([...sectionArrbyFir, addSectionObj]);
    } else {
      //console.log("no data added");
    }
    formRef.current.reset();
    setAddSectionObj({});
  }
  };

  // const handleSubmit = (event) => {
   
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     if (updateChargeSheetData && updateChargeSheetData._id) {
  //       setValidated(false);
  //       addChargeSheetFunc(event);
  //     } else {
  //       event.preventDefault();
  //       event.stopPropagation();
  //     }
  //   } else {
  //     addChargeSheetFunc(event);
  //   }
  //   setValidated(true);
  // };

  useEffect(()=>{
    if (chargeSheetObj && chargeSheetObj.number) {
      setCustomError({
        name: "number",
        message: "",
      });
    } else if (chargeSheetObj && chargeSheetObj.date) {
      setCustomError({
        name: "date",
        message: "",
      });
    }else if(addChargeSheetData && addChargeSheetData.type_of_violation){
      setCustomError({
        name: "type_of_violation",
        message: "",
      });
    }
else{
  setCustomError({
    name: "",
    message: "",
  });
}
  },[chargeSheetObj || addChargeSheetData])

  //////// add charge sheet api call function //////

  const addChargeSheetFunc = (e) => {
    let pattern = /[0-9\s]{0,}[a-zA-Z]{2,}/g

    e.preventDefault();
    const tempData = {
      survivor: survivorId,
      ...addChargeSheetData,
      charge_sheet: chargeSheetObj,
      fir: firId,
      accused_included: sendAccusedincludedArr,
      accused_not_included: sendaccusedNotincludedArr,
      section: sectionArrbyFir,
      investigation: investId,
      location: firSource,
    };
    const updateData = {
      survivor: survivorId,
      ...addChargeSheetData,
      charge_sheet: chargeSheetObj,
      fir: firId,
      accused_included: sendAccusedincludedArr,
      accused_not_included: sendaccusedNotincludedArr,
      section: sectionArrbyFir,
      location: firSource,
      investigation: investId,
      user_id: deletedById,
    };

    if (updateChargeSheetData && updateChargeSheetData._id) {
      setResultLoad(true);
      axios
        .patch(
          api + "/survival-chargesheet/update/" + updateChargeSheetData._id,
          updateData,
          axiosConfig
        )
        .then((res) => {
          //console.log(res);
        
          setValidated(false);
          setResultLoad(false);
          if (res && res.data && res.data.error == false) {
            const { data } = res;

            handleClick();
            setUpdateMessage(res && res.data.message);
            setMessagType("success");
            chargeSheetDetails(selectedData._id);

            //console.log(data, res);
            dispatch(
              getChargeSheetListByFirIdandInvestId(survivorId, firId, investId)
            );
            // dispatch({ type: "CHARGE_SHEET_LIST", data: data.result });
            setModalChargesheetShow(false);
            setAddChargeSheetData({});
            setAccusedDeleteId("");
            setReason({});
            setCahrgeSheetObj({});
            // setSectionArrbyFir([]);
            setActiveClass(false);
            setUpdateChargeSheetData({});
            // setFirObj({});
          }else{
            handleClick();
            setUpdateMessage(res && res.data.message);
            setMessagType("error");
          }
        })
        .catch((error) => {
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
          setResultLoad(false);
        });
    } else {
      if (chargeSheetObj && !chargeSheetObj.number) {
        setCustomError({
          name: "number",
          message: "Please enter Chargesheet number",
        });
      } else if (chargeSheetObj && !chargeSheetObj.date) {
        setCustomError({
          name: "date",
          message: "Please enter Chargesheet date",
        });
      }else if(addChargeSheetData && !addChargeSheetData.type_of_violation){
        setCustomError({
          name: "type_of_violation",
          message: "Please enter Type of voilation",
        });
      } else if (!pattern.test(addChargeSheetData && addChargeSheetData.type_of_violation)){
        setCustomError({
          name: "type_of_violation",
          message: "Please enter valid Type of voilation",
        });
      }
else{
      setResultLoad(true);
      axios
        .post(api + "/survival-chargesheet/create", tempData, axiosConfig)
        .then((res) => {
          //console.log(res);
          setValidated(false);
          setResultLoad(false);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
          handleClick();
          setMessagType("success");
          setUpdateMessage(res && res.data.message);

            //console.log(data, res);
            dispatch(
              getChargeSheetListByFirIdandInvestId(survivorId, firId, investId)
            );
            dispatch({ type: "CHARGE_SHEET_LIST", data: data.data });
            setModalChargesheetShow(false);
            setAddChargeSheetData({});
            setAccusedNotIncludedArr([]);
            setCahrgeSheetObj({});
            setSectionArrbyFir([]);
            setActiveClass(false);
            setAccusedDeleteId("");
            setReason({});
          }else{
            handleClick();
            setMessagType("error");
            setUpdateMessage(res && res.data.message);
          }
        })
        .catch((error) => {
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
          setResultLoad(false);
        });
    }
  }
  };

  //// for list delete modal open
  const gotoReasonModal = (data) => {
    setmodalInactiveShow(true);
    setAccusedDeleteId(data);
  };

  ///// for form delete modal open //////
  const gotoDeleteReasonModal = (e, value, accusedId, data) => {
    setnotemodalShow(true);
    setAccusedDeleteId(data);
    setAccusedDeleteId(accusedId);
    setdeleteIndex(value);
  };

  const [deleteIndex, setdeleteIndex] = useState("");
  const [deletedData, setDeletedData] = useState({});

  useEffect(() => {
    if (deleteReason && deleteReason.notes) {
      setNotesCustome({ field: "notes", message: "" });
    } else {
      setNotesCustome({ field: "", message: "" });
    }
  }, [deleteReason]);

  const onDeleteAccusIncluded = (e) => {
    e.preventDefault();
    if (!deleteReason.notes) {
      setNotesCustome({ field: "notes", message: "Please enter notes" });
    } else {
      setNotesCustome({ field: "", message: "" });
      var arr = [...accusedincludedArr];
      let obj1 = {};
      let newArr1 = [];

      arr &&
        arr.length > 0 &&
        arr.map((x, idx) => {
          if (x.accusedId == accusedDeleteId) {
            obj1 = {
              name: x && x.name,
              accusedId: x.accusedId,
              accused_type: x && x.accused_type && x.accused_type,
              is_deleted: true,
              notes: deleteReason && deleteReason.notes,
            };
            newArr1.push(obj1);
          } else {
            newArr1.push(x);
          }
        });

      setAccusedincludedArr(newArr1);

      var accus = [...sendAccusedincludedArr];
      var newAccus = [];
      accus &&
        accus.length > 0 &&
        accus.map((x, idx) => {
          console.log(x.name, accusedDeleteId);
          if (x.name == accusedDeleteId) {
            obj1 = {
              name: x && x.name,
              accused_type: x && x.accused_type && x.accused_type,
              is_deleted: true,
              notes: deleteReason && deleteReason.notes,
            };
            newAccus.push(obj1);
          } else {
            newAccus.push(x);
          }
        });

      setSendAccusedincludedArr(newAccus);
      setnotemodalShow(false);
    }
  };

  // console.log(accusedincludedArr,"accusedincludedArr",sendAccusedincludedArr)

  const [accusNotInclmodalShow, setaccusNotInclmodalShow] = useState(false);
  const [deleteaccusReason, setDeleteaccusReason] = useState({});
  const [accusNotemodalShow, setAccusNotemodalShow] = useState(false);
  ///// for accus not included model open ////
  const onDeleteAccuse = (e, value, accusedId, data) => {
    if (selectedData && selectedData._id) {
      setAccusedDeleteId(accusedId);
      setdeleteIndex(value);
      setDeletedData(data);
      accusNotInclmodalShow(true);
    } else {
      var array = [...finalAccues]; // make a separate copy of the array

      array.splice(value, 1);
      setFinalAccues(array);

      var array1 = [...sendaccusedNotincludedArr]; // make a separate copy of the array

      array1.splice(value, 1);
      setSendAccusedNotincludedArr(array1);

      var accus2 = [...accusedNotIncludedArr];
      accus2.splice(value, 1);

      setAccusedNotIncludedArr(accus2);
    }
  };

  useEffect(() => {
    if (deleteaccusReason && deleteaccusReason.notes) {
      setNotesCustome({ field: "notes", message: "" });
    } else {
      setNotesCustome({ field: "", message: "" });
    }
  }, [deleteaccusReason]);

  //// fro accused not included delete modal function ////
  const onAccusNotIncludedDelete = (e) => {
    e.preventDefault();

    if (!deleteaccusReason.notes) {
      setNotesCustome({ field: "notes", message: "Please enter notes" });
    } else {
      setNotesCustome({ field: "", message: "" });
      // setResultLoad2(true);

      // else {
      var arr = [...accusedNotIncludedArr];
      let obj1 = {};
      let newArr1 = [];

      arr &&
        arr.length > 0 &&
        arr.map((x, idx) => {
          if (x.accusedId == accusedDeleteId) {
            obj1 = {
              name: x && x.name,
              accusedId: x.accusedId,
              accused_type: x && x.accused_type && x.accused_type,
              is_deleted: true,
              notes: deleteaccusReason && deleteaccusReason.notes,
            };
            newArr1.push(obj1);
          } else {
            newArr1.push(x);
          }
        });

      setAccusedNotIncludedArr(newArr1);

      var accus = [...sendaccusedNotincludedArr];
      var newAccus = [];
      accus &&
        accus.length > 0 &&
        accus.map((x, idx) => {
          console.log(x.name, accusedDeleteId);
          if (x.name == accusedDeleteId) {
            obj1 = {
              name: x && x.name,
              accused_type: x && x.accused_type && x.accused_type,
              is_deleted: true,
              notes: deleteaccusReason && deleteaccusReason.notes,
            };
            newAccus.push(obj1);
          } else {
            newAccus.push(x);
          }
        });

      setSendAccusedNotincludedArr(newAccus);
      setAccusNotemodalShow(false);
    }
  };

  useEffect(() => {
    if (reason && reason.notes) {
      setNotesCustome({ field: "notes", message: "" });
    } else {
      setNotesCustome({ field: "", message: "" });
    }
  }, [reason]);

  //////// delete accused note from list function /////
  const deleteAccuseNoteFunc = (e) => {
    e.preventDefault();

    let body = {
      ...reason,
      user_id: deletedById,
    };
    if (!reason.notes) {
      setNotesCustome({ field: "notes", message: "Please enter notes" });
    } else {
      setNotesCustome({ field: "", message: "" });
      setResultLoad2(true);

      axios
        .patch(
          api +
            "/survival-chargesheet/delete-accused/" +
            selectedData._id +
            "/" +
            accusedDeleteId,
          body,
          axiosConfig
        )
        .then((res) => {
         
          setResultLoad2(false);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            handleClick();
            setMessagType("success");
          setUpdateMessage(res && res.data.message);

            chargeSheetDetails(selectedData._id);

            dispatch(
              getChargeSheetListByFirIdandInvestId(survivorId, firId, investId)
            );
            setmodalInactiveShow(false);
            setAccusedDeleteId("");
            setReason({});
          }else{
            handleClick();
            setMessagType("error");
          setUpdateMessage(res && res.data.message);

          }
        })
        .catch((error) => {
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
          setResultLoad2(false);
        });
    }
  };
  // };
  //export csv function///

  //console.log(chargeSheetList,'firrrrrrrrrrrrrr')

  let exportData = [];
  chargeSheetList &&
    chargeSheetList.length > 0 &&
    chargeSheetList.map((x, index) => {
      exportData = [
        {
          chargesheetDate: moment(x.charge_sheet.date).format("DD-MMM-YYYY"),
          chargesheetNumber: x.charge_sheet.number,
          date: moment(x.fir.fir.date).format("DD-MMM-YYYY"),
          firNumber: x.fir.fir.number,
          gd_number: x.fir.gd_number,
          issue_mention_in_gd: x.fir.issue_mention_in_gd,
          location: x.fir.location,
          survivor: survivorDetails.survivor_name,
          fircreatedAt: moment(x.fir.createdAt).format("DD-MMM-YYYY"),
          policeStation: x.fir.policeStation.name,
          createdAt: moment(x.createdAt).format("DD-MMM-YYYY"),
        },
      ];
    });

  //// make accused array  for csv export/////
  let exportAccusedincldData = [];
  selectedData &&
    selectedData.accused_included &&
    selectedData.accused_included.length > 0 &&
    selectedData.accused_included.map((x, index) => {
      exportAccusedincldData.push({
        accusedType: x && x.accused_type,
        nameOfAccused: x.name?.trafficker_name,
      });
    });

  //// make accused not included array  for csv export/////
  let exportAccusedNtIncldedData = [];
  selectedData &&
    selectedData.accused_not_included &&
    selectedData.accused_not_included.length > 0 &&
    selectedData.accused_not_included.map((x, index) => {
      exportAccusedNtIncldedData.push({
        accusedType: x && x.accused_type,
        nameOfAccused: x && x.name?.trafficker_name,
      });
    });
  //// make section array  for csv export/////
  let exportSectionData = [];
  selectedData &&
    selectedData.section &&
    selectedData.section.length > 0 &&
    selectedData.section.map((x, index) => {
      exportSectionData.push({
        sectionType: x && x.section_type,
        sectionNumber: x.section_number,
        dateOfSection:
          x &&
          x.date_of_section_when_added_to_fir &&
          moment(x.date_of_section_when_added_to_fir).format("DD-MMM-YYYY"),

        sectionNote: x && x.notes && x.notes,
      });
    });

  //console.log(exportAccusedNtIncldedData,"selectedData")

  //  //console.log(exportData,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
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
      "Chargesheet Date,Chargesheet Number,Date,FIR Number,GD Number,Issue,Location,Survivor,PolicStation,CreatedAt",
    ];

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const {
        chargesheetDate,
        chargesheetNumber,
        date,
        firNumber,
        gd_number,
        issue_mention_in_gd,
        location,
        survivor,
        policeStation,
        createdAt,
      } = user;
      acc.push(
        [
          chargesheetDate,
          chargesheetNumber,
          date,
          firNumber,
          gd_number,
          issue_mention_in_gd,
          location.toUpperCase(),
          survivor,
          policeStation,
          createdAt,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "chargesheetList.csv",
      fileType: "text/csv",
    });
  };

  const exporAccusedincldedtToCsv = (e) => {
    e.preventDefault();
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one ChargeSheet !!");
      setAlertFlag("alert");
    } else {
      // Headers for each column
      let headers = ["Name Of Accused,Accused Type"];

      // Convert users data to a csv
      let usersCsv = exportAccusedincldData.reduce((acc, user) => {
        const { nameOfAccused, accusedType } = user;
        acc.push([nameOfAccused, accusedType.toUpperCase()].join(","));
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...usersCsv].join("\n"),
        fileName: "accusedIncludedList.csv",
        fileType: "text/csv",
      });
    }
  };

  const exporAccusednotincldedtToCsv = (e) => {
    e.preventDefault();
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one ChargeSheet !!");
      setAlertFlag("alert");
    } else {
      // Headers for each column
      let headers = ["Name Of Accused,Accused Type"];

      // Convert users data to a csv
      let usersCsv = exportAccusedNtIncldedData.reduce((acc, user) => {
        const { nameOfAccused, accusedType } = user;
        acc.push([nameOfAccused, accusedType.toUpperCase()].join(","));
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...usersCsv].join("\n"),
        fileName: "accusedNotIncludedList.csv",
        fileType: "text/csv",
      });
    }
  };

  const exportToCsvSec = (e) => {
    e.preventDefault();
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one ChargeSheet !!");
      setAlertFlag("alert");
    } else {
      // Headers for each column
      let headers = [
        "Section Type,Section Number,Date Of Section,Section Notes",
      ];

      let usersCsv = exportSectionData.reduce((acc, user) => {
        const { sectionType, sectionNumber, dateOfSection, sectionNote } = user;
        acc.push(
          [sectionType, sectionNumber, dateOfSection, sectionNote].join(",")
        );
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...usersCsv].join("\n"),
        fileName: "sectionList.csv",
        fileType: "text/csv",
      });
    }
  };

  /////pdf download////////////////

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
    doc.text("SURVIVOR CHARGESHEET LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "Chrgsheet Date",
      "Chrgsheet No",
      "Date",
      "FIR No",
      "Gd No",
      "Issue",
      "Location",
      "Survivor",
      "PolicStation",
      "DateOfSection",
      "CreatedAt",
    ];

    const name =
      "survivor-chargesheet-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [
        item.chargesheetDate,
        item.chargesheetNumber,
        item.date,
        item.firNumber,
        item.gd_number,
        item.issue_mention_in_gd,
        item.location.toUpperCase(),
        item.survivor,
        item.policeStation,
        item.dateofsection,
        item.createdAt,
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
    doc.save(name);
  };

  /////pdf download////////////////

  const downloadAccuseincldedPdf = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one ChargeSheet !!");
      setAlertFlag("alert");
    } else {
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
      doc.text("ACCUSED INCLUDED IN CHARGESHEET LIST", 22, 60);
      doc.setFontSize(10);
      const survivorColumns = ["Name Of Accused", "Accused Type"];

      const name =
        "accused-not-included-in-chargesheet-list" +
        new Date().toISOString() +
        ".pdf";
      let goalsRows = [];
      exportAccusedincldData?.forEach((item) => {
        const temp = [item.nameOfAccused, item.accusedType.toUpperCase()];
        goalsRows.push(temp);
      });
      doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
      doc.save(name);
    }
  };

  /////pdf download////////////////

  const downloadAccuseNotincldedPdf = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one ChargeSheet !!");
      setAlertFlag("alert");
    } else {
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
      doc.text(" ACCUSED NOT INCLUDED IN CHARGESHEET LIST", 22, 60);
      doc.setFontSize(10);
      const survivorColumns = ["Name Of Accused", "Accused Type"];

      const name =
        "accused-not-included-in-chargesheet-list" +
        new Date().toISOString() +
        ".pdf";
      let goalsRows = [];
      exportAccusedNtIncldedData?.forEach((item) => {
        const temp = [item.nameOfAccused, item.accusedType.toUpperCase()];
        goalsRows.push(temp);
      });
      doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
      doc.save(name);
    }
  };

  /////pdf download////////////////

  const downloadSectionPdf = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one ChargeSheet !!");
      setAlertFlag("alert");
    } else {
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
      doc.text("SECTION IN CHARGESHEET LIST", 22, 60);
      doc.setFontSize(10);
      const survivorColumns = [
        "Section Number",
        "Section Type",
        "Section Notes",
      ];

      const name =
        "section-in-chargesheet-list" + new Date().toISOString() + ".pdf";
      let goalsRows = [];
      exportSectionData?.forEach((item) => {
        const temp = [
          item.sectionType,
          item.sectionNumber,
          item.dateOfSection,
          item.sectionNote,
        ];
        goalsRows.push(temp);
      });
      doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
      doc.save(name);
    }
  };

  return (
    <>
      <Topbar />
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
              <h2 className="page_title">Chargesheet</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Chargesheet</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topcartbar white_box_shadow">
            <SurvivorTopCard survivorDetails={survivorDetails} />
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            {firId && investId ? (
              <div className="vieweditdelete">
                {currentModule && JSON.parse(currentModule).can_view == true && (
                  <Dropdown className="me-1">
                    <Dropdown.Toggle variant="border" className="shadow-0">
                      Action
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => downloadPdf()}>
                        Download PDF
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => downloadAccuseincldedPdf()}>
                        Download Accused Included PDF
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => downloadAccuseNotincldedPdf()}
                      >
                        Download Accused Not Included PDF
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => downloadSectionPdf()}>
                        Download Section PDF
                      </Dropdown.Item>
                      <Dropdown.Item onClick={exportToCsv}>
                        Export To CSV
                      </Dropdown.Item>
                      <Dropdown.Item onClick={exporAccusedincldedtToCsv}>
                        Export Accused Included To CSV
                      </Dropdown.Item>
                      <Dropdown.Item onClick={exporAccusednotincldedtToCsv}>
                        Export Accused Not Included To CSV
                      </Dropdown.Item>
                      <Dropdown.Item onClick={exportToCsvSec}>
                        Export Section To CSV
                      </Dropdown.Item>
                      {currentModule &&
                        JSON.parse(currentModule).can_edit == true && (
                          <Dropdown.Item
                            onClick={() => gotSupplimentaryChargeSheet()}
                          >
                            Supplimentary Chargesheet
                          </Dropdown.Item>
                        )}
                      <Dropdown.Item onClick={() => changeLogFunc()}>
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
                    <span onClick={() => gotoAdd()}>
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
                    <span onClick={(e) => gotoEdit(e)}>
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
            ) : (
              <></>
            )}
            {currentModule && JSON.parse(currentModule).can_view == true && (
              <ChargesheetDataTable
                selectedProduct5={selectedProduct5}
                chargeSheetList={
                  chargeSheetList &&
                  chargeSheetList.length > 0 &&
                  chargeSheetList
                }
                isLoading={isLoading}
                onSelectRow={onSelectRow}
              />
            )}
            {/* <div className="table-responsive big-mobile-responsive">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th width="12%">Location</th>
                    <th width="15%">Charge Sheet No</th>
                    <th width="15%">Charge sheet date</th>
                  </tr>
                </thead>
                <tbody>
                  {chargeSheetList && chargeSheetList.length > 0 ? (
                    chargeSheetList.map((item) => {
                      return (
                        <tr
                          className={[
                            item._id === selectedData._id &&
                              activeClass === true &&
                              "current",
                          ]}
                          onClick={() => onSelectRow(item)}
                        >
                          <td>{item && item.location && item.location}</td>
                          <td>
                            {item &&
                              item.charge_sheet &&
                              item.charge_sheet.number &&
                              item.charge_sheet.number}
                          </td>
                          <td>
                            {item &&
                              item.charge_sheet &&
                              item.charge_sheet.date &&
                              moment(item.charge_sheet.date).format(
                                "DD/MM/YYYY"
                              )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={3}>
                        <b>NO Data Found !!</b>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div> */}
            {selectedData &&
              selectedData.accused_included &&
              selectedData.accused_included.length > 0 && (
                <>
                  <h4 className="mt-4 pt-2 pb-1 mb-4 small_heading">
                    List of accused in FIR
                  </h4>
                  <div className="table-responsive big-mobile-responsive">
                    <table className="table table-borderless mb-0">
                      <thead>
                        <tr>
                          <th width="12%">Name of accused</th>
                          <th width="10%">Type of accused</th>
                          <th width="12%">Added on</th>
                          <th width="15%">Notes</th>
                          <th width="15%">
                            Action to remove accused - with notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedData &&
                          selectedData.accused_included &&
                          selectedData.accused_included.length > 0 &&
                          selectedData.accused_included.map((item) => {
                            return (
                              <tr>
                                {item &&
                                  item.name &&
                                  item.name.trafficker_name && (
                                    <>
                                      <td>
                                        {item &&
                                          item.name &&
                                          item.name.trafficker_name &&
                                          item.name.trafficker_name.toUpperCase()}
                                      </td>
                                      <td>
                                        {item &&
                                          item &&
                                          item.accused_type &&
                                          item.accused_type.toUpperCase()}
                                      </td>
                                      <td>
                                        {selectedData &&
                                          selectedData.createdAt &&
                                          moment(selectedData.createdAt).format(
                                            "DD-MMM-YYYY"
                                          )}
                                      </td>
                                      <td>{item && item.notes}</td>
                                      <td>
                                        {item && item.is_deleted == false && (
                                          <div className="mydairy_btns position-static justify-content-center">
                                            <MDBTooltip
                                              tag="a"
                                              wrapperProps={{
                                                className: "delete_btn",
                                              }}
                                              title="Delete"
                                            >
                                              <span
                                                onClick={() =>
                                                  gotoReasonModal(item._id)
                                                }
                                              >
                                                <i className="fal fa-trash-alt"></i>
                                              </span>
                                            </MDBTooltip>
                                          </div>
                                        )}
                                      </td>
                                    </>
                                  )}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            {selectedData &&
              selectedData.accused_not_included &&
              selectedData.accused_not_included.length > 0 && (
                <>
                  <h4 className="mt-4 pt-2 pb-1 mb-4 small_heading">
                    List of accused not in FIR
                  </h4>
                  <div className="table-responsive big-mobile-responsive mb30">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th width="12%">Name of accused</th>
                          <th width="12%">Type of accused</th>
                          <th width="20%">Notes</th>
                          <th width="20%">
                            Action to remove accused - with notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedData &&
                          selectedData.accused_not_included &&
                          selectedData.accused_not_included.length > 0 &&
                          selectedData.accused_not_included.map((item) => {
                            return (
                              <tr>
                                {item &&
                                  item.name &&
                                  item.name.trafficker_name && (
                                    <>
                                      <td>
                                        {item &&
                                          item.name &&
                                          item.name.trafficker_name.toUpperCase()}
                                      </td>
                                      <td>
                                        {item &&
                                          item.accused_type &&
                                          item.accused_type.toUpperCase()}
                                      </td>
                                      <td>{item && item.notes}</td>
                                      <td>
                                        {item && item.is_deleted == false && (
                                          <div className="mydairy_btns position-static justify-content-center">
                                            <MDBTooltip
                                              tag="a"
                                              wrapperProps={{
                                                className: "delete_btn",
                                              }}
                                              title="Delete"
                                            >
                                              <span
                                                onClick={() =>
                                                  gotoReasonModal(item._id)
                                                }
                                              >
                                                <i className="fal fa-trash-alt"></i>
                                              </span>
                                            </MDBTooltip>
                                          </div>
                                        )}
                                      </td>
                                    </>
                                  )}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            <div id="section-list">
              {selectedData &&
                selectedData.section &&
                selectedData.section.length > 0 && (
                  <>
                    <h4 className="mt-4 pt-2 pb-1 mb-4 small_heading">
                      Section
                    </h4>
                    <div className="table-responsive big-mobile-responsive">
                      <table className="table table-borderless mb-0">
                        <thead>
                          <tr>
                            <th width="12%">Type</th>
                            <th width="10%">Section</th>
                            <th width="15%">
                              Date of section <span>(When added to fir)</span>
                            </th>
                            {/* <th width="15%">Date of section <span>(When removed from chargesheet)</span></th> */}
                            <th width="20%">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedData &&
                            selectedData.section &&
                            selectedData.section.length > 0 &&
                            selectedData.section.map((item) => {
                              return (
                                <tr>
                                  <td>
                                    {item.section_type && item.section_type}
                                  </td>
                                  <td>
                                    {item.section_number && item.section_number}
                                  </td>
                                  <td>
                                    {item.date_of_section_when_added_to_fir &&
                                      moment(
                                        item.date_of_section_when_added_to_fir
                                      ).format("DD-MMM-YYYY")}
                                  </td>
                                  <td>{item.notes && item.notes}</td>
                                  {/* <td>{item.section_type && item.section_type}</td> */}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalChargesheetShow}
        onHide={setModalChargesheetShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedData && selectedData._id
              ? "Update Chargesheet"
              : "Add Chargesheet"}
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
                    source/destination <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="location"
                    disabled={true}
                    defaultValue={firSource && firSource.toUpperCase()}
                    // onChange={(e) =>
                    //   setAddChargeSheetData({
                    //     ...addChargeSheetData,
                    //     [e.target.name]: e.target.value,
                    //   })
                    // }
                  />
                  {/* <option value={""} hidden={true}>
                      Select location
                    </option>
                    <option value="sa">SA</option>
                    <option value="da">DA</option>
                  </Form.Select> */}
                  <Form.Control.Feedback type="invalid">
                    Please select Location
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Charge Sheet No <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    
                    defaultValue={
                      chargeSheetObj &&
                      chargeSheetObj.number &&
                      chargeSheetObj.number
                    }
                    onChange={onChargeSheetChange}
                    name="number"
                    type="text"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                    {customError.name == "number" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Charge sheet date <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <DatePicker
                    required
                    message={"Please enter Charge sheet date"}
                    name="date"
                    datePickerChange={onChargeSheetChange}
                    data={chargeSheetObj && chargeSheetObj.date}
                  /> */}
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          chargeSheetObj && chargeSheetObj.date
                            ? moment(chargeSheetObj.date).format("DD-MMM-YYYY")
                            : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          
                          name={"date"}
                          className="dateBtn"
                          type="date"
                          onChange={onChargeSheetChange}
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
                  {customError.name == "date" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Type of violation identified{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    
                    name="type_of_violation"
                    defaultValue={
                      addChargeSheetData &&
                      addChargeSheetData.type_of_violation &&
                      addChargeSheetData.type_of_violation
                    }
                    type="text"
                    onChange={(e) =>
                      setAddChargeSheetData({
                        ...addChargeSheetData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z 0-9\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                 {customError.name == "type_of_violation" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    FIR Number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="number"
                    disabled={true}
                    // onChange={onFirNumberChange}
                    // value={firObj && firObj._id && firObj._id}
                    defaultValue={firObj && firObj.number}
                  />

                  <Form.Control.Feedback type="invalid">
                    Please select FIR Number
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Date of FIR</Form.Label>
                  <Form.Control
                    type="text"
                    name="date"
                    disabled={true}
                    defaultValue={
                      firObj &&
                      firObj.date &&
                      moment(firObj.date).format("DD-MMM-YYYY")
                    }
                    placeholder="Date of FIR"
                  />
                </Form.Group>

                <Form.Group as={Col} md="12" className="mb-3">
                  <Form ref={formRef}>
                    <Row className="justify-content-between">
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Name of Accused{" "}
                          {/* <span className="requiredStar">*</span> */}
                        </Form.Label>
                        <Form.Select
                          onChange={(e) => onAccusedChange(e)}
                          name="name"
                        >
                          <option hidden={true}>Select accused</option>
                          {mastertraffickerDataforSurv &&
                            mastertraffickerDataforSurv.length > 0 &&
                            mastertraffickerDataforSurv.map((item) => {
                              return (
                                <option value={item && item._id && item._id}>
                                  {item &&
                                    item.trafficker_name &&
                                    item.trafficker_name}
                                </option>
                              );
                            })}
                        </Form.Select>
                        {customError.name == "name" && (
                          <small className="mt-4 mb-2 text-danger">
                            {customError && customError.message}
                          </small>
                        )}
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Type of accused (initial){" "}
                          {/* <span className="requiredStar">*</span> */}
                        </Form.Label>
                        <Form.Select
                          onChange={(e) => onAccusedChange(e)}
                          name="accused_type"
                        >
                          <option value={''} hidden={true}>Select accused type</option>
                          <option value="sa">SA</option>
                          <option value="da">DA</option>
                          <option value="transit">Transit</option>
                        </Form.Select>
                        {customError.name == "accused_type" && (
                          <small className="mt-4 mb-2 text-danger">
                            {customError && customError.message}
                          </small>
                        )}
                      </Form.Group>
                    </Row>
                    <Row className="justify-content-end">
                      <Form.Group as={Col} md="auto" className="mb-3">
                        <Button
                          type="submit"
                          onClick={(e) => onSubmitAccused(e)}
                          className="addbtn addbtn_blue shadow-0"
                        >
                          Add Accused
                        </Button>
                      </Form.Group>
                    </Row>
                    {accusedNotIncludedArr && accusedNotIncludedArr.length > 0 && (
                      <>
                        <div className="white_box_shadow_20 survivors_table_wrap position-relative mb-4">
                          <h4 className="mb-4 small_heading">
                            List of accused not in FIR
                          </h4>
                          <div className="table-responsive big-mobile-responsive">
                            <table className="table table-borderless mb-0">
                              <thead>
                                <tr>
                                  <th width="12%">Accused name</th>
                                  <th width="10%">Accused Type</th>
                                  <th width="4%"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  // accusedNotIncludedArr &&
                                  //   accusedNotIncludedArr.length > 0 &&
                                  accusedNotIncludedArr &&
                                    accusedNotIncludedArr.length > 0 &&
                                    accusedNotIncludedArr.map((item, index) => {
                                      return (
                                        <tr>
                                          {item && item.name && (
                                            <>
                                              <td>
                                                {item.trafficker_name
                                                  ? item.trafficker_name
                                                  : item.name}
                                              </td>
                                              <td>
                                                {item.accused_type &&
                                                  item.accused_type.toUpperCase()}
                                              </td>
                                              <td>
                                                {item &&
                                                  item.is_deleted == false && (
                                                    <MDBTooltip
                                                      tag="a"
                                                      wrapperProps={{
                                                        className: "delete_btn",
                                                      }}
                                                      title="Delete"
                                                    >
                                                      <span
                                                        onClick={(e) =>
                                                          onDeleteAccuse(
                                                            e,
                                                            index,
                                                            item.accusedId,
                                                            item
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          style={{
                                                            color: "red",
                                                          }}
                                                          className="fal fa-trash-alt"
                                                        ></i>
                                                      </span>
                                                    </MDBTooltip>
                                                  )}
                                              </td>
                                            </>
                                          )}
                                        </tr>
                                      );
                                    })
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                    {accusedincludedArr && accusedincludedArr.length > 0 && (
                      <>
                        <div className="white_box_shadow_20 survivors_table_wrap position-relative mb-4">
                          <h4 className="mb-4 small_heading">
                            List of accused in FIR
                          </h4>
                          <div className="table-responsive big-mobile-responsive">
                            <table className="table table-borderless mb-0">
                              <thead>
                                <tr>
                                  <th width="12%">Accused name</th>
                                  <th width="10%">Accused Type</th>
                                  <th width="4%"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {accusedincludedArr &&
                                  accusedincludedArr.length > 0 &&
                                  accusedincludedArr.map((item, index) => {
                                    //console.log(item, "item");

                                    return (
                                      <tr>
                                        {item && item.name && (
                                          <>
                                            <td>{item.name && item.name}</td>
                                            <td>
                                              {item.accused_type &&
                                                item.accused_type.toUpperCase()}
                                            </td>
                                            <td>
                                              {item &&
                                                item.is_deleted == false && (
                                                  <MDBTooltip
                                                    tag="a"
                                                    wrapperProps={{
                                                      className: "delete_btn",
                                                    }}
                                                    title="Delete"
                                                  >
                                                    <span
                                                      onClick={(e) =>
                                                        gotoDeleteReasonModal(
                                                          e,
                                                          index,
                                                          item.accusedId,
                                                          item
                                                        )
                                                      }
                                                    >
                                                      <i
                                                        style={{ color: "red" }}
                                                        className="fal fa-trash-alt"
                                                      ></i>
                                                    </span>
                                                  </MDBTooltip>
                                                )}
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </Form>
                </Form.Group>

                <Form.Group as={Col} md="12" className="mb-3">
                  <Form ref={formRef}>
                    <Row>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Type of section{" "}
                          {/* <span className="requiredStar">*</span> */}
                        </Form.Label>
                        <Form.Select
                          name="section_type"
                          onChange={onSectionChangeSection}
                        >
                          <option value={''} hidden={true}>Select section type</option>
                          {masterActData &&
                            masterActData.length > 0 &&
                            masterActData.map((item) => {
                              return (
                                <option value={item && item.name}>
                                  {item && item.name}{" "}
                                </option>
                              );
                            })}
                          {/* <option value="ipc">IPC </option>
                          <option value="itpc">ITPC </option> */}
                        </Form.Select>
                        {customError.name == "section_type" && (
                          <small className="mt-4 mb-2 text-danger">
                            {customError && customError.message}
                          </small>
                        )}
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Section
                          {/* <span className="requiredStar">*</span> */}
                        </Form.Label>
                        <Form.Select
                          name="section_number"
                          onChange={onSectionNumberChange}
                        >
                          <option value={''} hidden={true}>Default select</option>
                          {sectionByActId &&
                            sectionByActId.length > 0 &&
                            sectionByActId.map((item) => {
                              return (
                                <option value={item && item.number}>
                                  {item && item.number}{" "}
                                </option>
                              );
                            })}
                        </Form.Select>
                        {customError.name == "section_number" && (
                          <small className="mt-4 mb-2 text-danger">
                            {customError && customError.message}
                          </small>
                        )}
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Date of section when added to FIR{" "}
                          {/* <span className="requiredStar">*</span> */}
                        </Form.Label>
                        {/* <DatePicker
                          // message={'Please enter Charge sheet date'}
                          name="date_of_section_when_added_to_fir"
                          datePickerChange={onSectionChange}
                          data={
                            addSectionObj &&
                            addSectionObj.date_of_section_when_added_to_fir
                          }
                        /> */}

                        <>
                          <InputGroup className="date_box">
                            <span className="hidebox"></span>
                            <Form.Control
                              type="text"
                              placeholder="DD-MMM-YYYY"
                              value={
                                addSectionObj &&
                                addSectionObj.date_of_section_when_added_to_fir
                                  ? moment(
                                      addSectionObj.date_of_section_when_added_to_fir
                                    ).format("DD-MMM-YYYY")
                                  : null
                              }
                              disabled={true}
                            />

                            <InputGroup.Text>
                              <Form.Control
                                required
                                name={"date_of_section_when_added_to_fir"}
                                className="dateBtn"
                                type="date"
                                onChange={onSectionChange}
                                placeholder=""
                                max={moment().format("YYYY-MM-DD")}
                                min={
                                  survivorDetails &&
                                  survivorDetails.date_of_trafficking &&
                                  moment(
                                    survivorDetails.date_of_trafficking
                                  ).format("YYYY-MM-DD")
                                }
                              />
                              <i class="far fa-calendar-alt"></i>
                            </InputGroup.Text>
                          </InputGroup>
                        </>
                        {customError.name ==
                          "date_of_section_when_added_to_fir" && (
                          <small className="mt-4 mb-2 text-danger">
                            {customError && customError.message}
                          </small>
                        )}
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                          type="text"
                          name="notes"
                          onChange={onSectionChange}
                          onKeyPress={(e) => {
                            if (!/[a-z A-Z 0-9 \s]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onPaste={(e)=> {
                            e.preventDefault();
                          }}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="justify-content-end">
                      <Form.Group as={Col} md="auto" className="mb-3">
                        <Button
                          type="submit"
                          onClick={(e) => onSubmitASection(e)}
                          className="addbtn addbtn_blue shadow-0"
                        >
                          Add Section
                        </Button>
                      </Form.Group>
                    </Row>
                    {sectionArrbyFir && sectionArrbyFir.length > 0 && (
                      <>
                        <h4 className="mt-4 pt-2 pb-1 mb-4 small_heading">
                          List of Section
                        </h4>

                        <div className="table-responsive big-mobile-responsive">
                          <table className="table table-borderless mb-0">
                            <thead>
                              <tr>
                                <th width="12%">Type of section</th>
                                <th width="10%">Section</th>
                                <th width="12%">
                                  Date of section when added to FIR
                                </th>
                                <th width="10%">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sectionArrbyFir &&
                                sectionArrbyFir.length > 0 &&
                                sectionArrbyFir.map((item) => {
                                  return (
                                    <tr>
                                      {item && item.section_type && (
                                        <>
                                          <td>
                                            {item &&
                                              item.section_type &&
                                              item.section_type.toUpperCase()}
                                          </td>
                                          <td>
                                            {item &&
                                              item.section_number &&
                                              item.section_number}
                                          </td>
                                          <td>
                                            {item &&
                                              moment(
                                                item.date_of_section_when_added_to_fir
                                              ).format("DD-MMM-YYYY")}
                                          </td>
                                          <td>{item && item.notes}</td>
                                        </>
                                      )}
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </Form>
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} xs="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={(e) => onCancel(e)}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    disabled={resultLoad === true ? true : false}
                    // disabled={
                    //   addChargeSheetData && !addChargeSheetData.location
                    //     ? true
                    //     : !addChargeSheetData.type_of_violation
                    //     ? true
                    //     : chargeSheetObj && !chargeSheetObj.number
                    //     ? true
                    //     : !chargeSheetObj.date
                    //     ? true
                    //     : firObj && !firObj.number
                    //     ? true
                    //     : false
                    // }
                    onClick={(e) => addChargeSheetFunc(e)}
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
        dialogClassName={"inactivemodal"}
        show={accusNotemodalShow}
        onHide={setAccusNotemodalShow}
        size="md"
        backdrop="static"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-box">
            <Form>
              <Form.Group className="mb-3" controlId="validationCustom01">
                <Form.Control
                  as="textarea"
                  rows="4"
                  name="notes"
                  onChange={(e) =>
                    setDeleteaccusReason({
                      ...deleteaccusReason,
                      [e.target.name]: e.target.value.trim(),
                    })
                  }
                  placeholder="Enter the Note"
                  onKeyPress={(e) => {
                    if (!/[a-z A-Z 0-9 , . _ \s]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e)=> {
                    e.preventDefault();
                  }}
                />
                {notesCustom.field == "notes" && (
                  <small className="mt-4 mb-2 text-danger">
                    {notesCustom && notesCustom.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group className="text-end">
                <Button
                  className="submit_btn shadow-0"
                  disabled={resultLoad2 === true ? true : false}
                  onClick={(e) => onAccusNotIncludedDelete(e)}
                  variant="primary"
                  type="submit"
                >
                  {resultLoad2 && resultLoad2 === true ? (
                    <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        dialogClassName={"inactivemodal"}
        show={notemodalShow}
        onHide={setnotemodalShow}
        size="md"
        backdrop="static"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-box">
            <Form>
              <Form.Group className="mb-3" controlId="validationCustom01">
                <Form.Control
                  as="textarea"
                  rows="4"
                  name="notes"
                  onChange={(e) =>
                    setDeleteReason({
                      ...deleteReason,
                      [e.target.name]: e.target.value.trim(),
                    })
                  }
                  onKeyPress={(e) => {
                    if (!/[a-z A-Z 0-9\s]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e)=> {
                    e.preventDefault();
                  }}
                  placeholder="Enter the Note"
                />
                {notesCustom.field == "notes" && (
                  <small className="mt-4 mb-2 text-danger">
                    {notesCustom && notesCustom.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group className="text-end">
                <Button
                  className="submit_btn shadow-0"
                  disabled={resultLoad2 === true ? true : false}
                  onClick={(e) => onDeleteAccusIncluded(e)}
                  variant="primary"
                  type="submit"
                >
                  {resultLoad2 && resultLoad2 === true ? (
                    <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        dialogClassName={"inactivemodal"}
        show={modalInactiveShow}
        onHide={setmodalInactiveShow}
        size="md"
        backdrop="static"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-box">
            <Form>
              <Form.Group className="mb-3" controlId="validationCustom01">
                <Form.Control
                  as="textarea"
                  rows="4"
                  name="notes"
                  onChange={(e) =>
                    setReason({
                      ...reason,
                      [e.target.name]: e.target.value.trim(),
                    })
                  }
                  onKeyPress={(e) => {
                    if (!/[a-z A-Z 0-9 , . \s]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e)=> {
                    e.preventDefault();
                  }}
                  placeholder="Enter the Note"
                />
                {notesCustom.field == "notes" && (
                  <small className="mt-4 mb-2 text-danger">
                    {notesCustom && notesCustom.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group className="text-end">
                <Button
                  className="submit_btn shadow-0"
                  disabled={resultLoad2 === true ? true : false}
                  onClick={(e) => deleteAccuseNoteFunc(e)}
                  variant="primary"
                  type="submit"
                >
                  {resultLoad2 && resultLoad2 === true ? (
                    <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      {showAlert === true && (
        <AlertComponent
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
          deleteLoader={deleteLoader}
          alertMessage={alertMessage}
          alertFlag={alertFlag}
        />
      )}
    </>
  );
};

export default SurvivorChargesheet;
