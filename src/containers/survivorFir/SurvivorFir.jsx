import React, { useState, useEffect, useRef } from "react";
import { Topbar, SurvivorTopCard } from "../../components";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
import { NavLink, useHistory } from "react-router-dom";
import {
  findAncestor,
  gotoSurvivorArchive,
  goToSurvivorInvest,
} from "../../utils/helper";
// import { NavLink, useHistory } from "react-router-dom";

import {
  getSurvivorDetails,
  getFirList,
  getModulesChangeLog,
  getSectionByActId,
} from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NotificationPage from "../../components/NotificationPage";
import moment from "moment";
import { reset } from "react-tabs/lib/helpers/uuid";
import AlertComponent from "../../components/AlertComponent";
import FirDataTable from "./FirDataTable";
import DatePicker from "../../components/DatePicker";
import queryString from "query-string";
import { InputGroup } from "react-bootstrap";

const SurvivorFir = (props) => {
  const [modalFirShow, setModalFirShow] = useState(false);
  const [addFirData, setAddFirData] = useState({});
  const [accusedObj, setAccusedObj] = useState({});
  const dispatch = useDispatch();
  const masterActList = useSelector((state) => state.masterActList);
  const masterDataTraffickerList = useSelector(
    (state) => state.masterDataTraffickerList
  );
  const sectionByActId = useSelector((state) => state.sectionByActId);
  const firList = useSelector((state) => state.firList);
  const [firObj, setFirObj] = useState({});
  const [accusedArr, setAccusedArr] = useState([]);
  const [showAccusedArr, setShowAccusedArr] = useState([]);
  const [sectionArr, setSectionArr] = useState([]);
  const masterPoliceStationList = useSelector(
    (state) => state.masterPoliceStationList
  );
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const [sectionObj, setSectionObj] = useState({});
  const survivorActionDetails = useSelector(
    (state) => state.survivorActionDetails
  );
  const currentModule = localStorage.getItem("currentModule");
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));

  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [resultLoad2, setResultLoad2] = useState(false);
  const [modalInactiveShow, setmodalInactiveShow] = useState(false);
  const [reason, setReason] = useState({});

  const [validated, setValidated] = useState(false);
  const [validatedaccus, setValidatedaccus] = useState(false);
  const [validatedSec, setValidatedSec] = useState(false);
  const [activeClass, setActiveClass] = useState(false);
  const [firData, setFirData] = useState({});
  const formRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const [erorMessage, setErorMessage] = useState("");
  const [survivorId, setSurvivorId] = useState("");
  const [resultLoad, setResultLoad] = useState(false);
  const [bodyAccuseObj, setbodyAccuseObj] = useState({});
  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [messagType, setMessagType] = useState("");
  const history = useHistory();
  const [finalAccues, setFinalAccues] = useState([]);
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [customError, setCustomError] = useState({ name: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [notesCustom, setNotesCustome] = useState({ field: "", message: "" });
  let url = props.location.search;
  let getId = queryString.parse(url, { parseNumbers: true });

  // console.log(masterPoliceStationList, "masterPoliceStationList");
  const gotoArchiveList = (e) => {
    gotoSurvivorArchive(e, "fir", getId.survivorId, history);
  };
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // initFilters1();
  }, [firList]);

  const handleShow = () => {
    //console.log("select");
    setShowAlert(true);
  };

  /////// get chargesheet details API ///
  const firDetails = (id) => {
    axios
      .get(api + "/survival-fir/detail/" + id, axiosConfig)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;
          setFirData(data.data);
        }
      })
      .catch((error) => {});
  };

  const changeLogFunc = () => {
    let type = "fir";
    dispatch(getModulesChangeLog(type, deletedById, getId.survivorId));
    props.history.push("/change-log");
  };

  const handleCloseAlert = () => {
    setAlertMessage("");
    setAlertFlag("");
    setShowAlert(false);
  };
  const onSelectRow = (data) => {
    //console.log(data, "firData");
    if (data !== null) {
      setActiveClass(true);
      setFirData(data);
      setAddFirData(data);
      scrollToView(data);
      setSelectedProduct5(data);
      localStorage.setItem("firNumber", data && data.fir && data.fir.number);
      localStorage.setItem("firDate", data && data.fir && data.fir.date);
      localStorage.setItem("firSource", data && data.location);
    } else {
      setActiveClass(false);
      setFirData({});
      setAddFirData({});
      scrollToView({});
      setSelectedProduct5(null);
      localStorage.removeItem("firNumber");
      localStorage.removeItem("firDate");
      localStorage.removeItem("firSource");
    }
  };

  const scrollToView = (data) => {
    if (data && data.accused && data.accused.length > 0) {
      // const el = document.getElementById("list_goal_pdf_view");
      // window.scrollTo(0, el.offsetTop - 50);
      // } else {
      const el = document.getElementById("section-list");
      window.scrollTo(0, el.offsetTop);
    }
  };
  const onShowModel = (e) => {
    setModalFirShow(true);
    setAddFirData({});
    setFirData({});
    setAddFirData({});
    setFinalAccues([]);
    setShowAccusedArr([]);
    setFirObj({});
    setSelectedProduct5(null);
    setSectionArr([]);
  };
  // useEffect(() => {
  // setSurvivorId(getId.survivorId);
  // }, [getId.survivorId]);

  useEffect(() => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "fir" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));
  }, [props]);

  const gotoInvestigation = (e) => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "investigation" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (!firData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one FIR !!");
      setAlertFlag("alert");
    } else {
      let object = { survivorId: getId.survivorId, firId: firData._id };
      goToSurvivorInvest(e, object, history);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (firData && !firData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one FIR !!");
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
      .patch(api + "/survival-fir/delete/" + firData._id, body, axiosConfig)
      .then((response) => {
       
        if (response.data && response.data.error === false) {
          const { data } = response;
          handleClick();
          setMessagType("success");
          setDeleteLoader(false);
          localStorage.removeItem("firNumber");
          localStorage.removeItem("firDate");
          localStorage.removeItem("firSource");
          setUpdateMessage(response && response.data.message);
          dispatch(getFirList(getId.survivorId));
          setShowAlert(false);
          setErorMessage("");
        }else{
          handleClick();
          setMessagType("error");
          setDeleteLoader(false);
          // setUpdateMessage(response && response.data.message);
        }
      })
      .catch((error) => {
        handleClick();
        setUpdateMessage(error && error.message);
        setMessagType("error");
        setDeleteLoader(false);
        
      });
  };

  const onShowEditModel = (e) => {
    if (firData && !firData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one FIR !!");
      setAlertFlag("alert");
    } else {
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
      localStorage.removeItem("firNumber");
      localStorage.removeItem("firDate");
      localStorage.removeItem("firSource");
      setModalFirShow(true);
      // setAddFirData(firData);

      let accusedObj = {};
      let arr = [];
      let obj1 = {};
      let showArr1 = [];

      firData &&
        firData.accused &&
        firData.accused.length > 0 &&
        firData.accused.map((item) => {
          return (
            (accusedObj = {
              name: item.name && item.name._id,
              accused_type: item.accused_type,
              is_deleted: item && item.is_deleted,
            }),
            (obj1 = {
              trafficker_name:
                item &&
                item.name &&
                item.name.trafficker_name &&
                item.name.trafficker_name,
              name: item && item.name && item.name._id && item.name._id,
              accused_type: item && item.accused_type && item.accused_type,
              is_deleted: item && item.is_deleted,
              accusedId: item && item._id,
            }),
            showArr1.push({ ...obj1 }),
            arr.push(accusedObj)
          );
        });

      /////// set data to show in modal //////////

      setShowAccusedArr(showArr1);
      setAccusedArr(arr);
      setSectionArr(firData && firData.section);
    }
  };

  useEffect(() => {
    dispatch(getFirList(getId.survivorId));
    dispatch(getSurvivorDetails(getId.survivorId));
  }, [getId.survivorId]);

  //////// on fir change function ////
  const onFirNumberChange = (e) => {
    setFirObj({
      ...firObj,
      [e.target.name]: e.target.value.trim(),
    });
  };

  useEffect(() => {
    //console.log(firObj, addFirData, "addFirData");
    setFirObj({
      ...firObj,
      number:
        firObj && firObj.number
          ? firObj.number
          : addFirData && addFirData.fir && addFirData.fir.number,
      date:
        firObj && firObj.date
          ? firObj.date
          : addFirData && addFirData.fir && addFirData.fir.date,
    });
  }, [firData]);

  const onCancel = () => {
    localStorage.removeItem("firNumber");
    localStorage.removeItem("firDate");
    localStorage.removeItem("firSource");
    setShowAccusedArr([]);
    setSectionObj({});
    setAccusedObj({});
    setSectionArr([]);
    setAccusedArr([]);
    setAddFirData({});
    setFirData({});
    setFirObj({});
    setSelectedProduct5(null);
    setModalFirShow(false);
    setActiveClass(false);
    setValidatedaccus(false);
    setValidatedSec(false);
    setValidated(false);
  };

  useEffect(() => {
    setAddFirData({
      ...addFirData,
      fir: firObj,
    });
  }, [firObj]);

  const handleClick = () => {
    setOpen(true);
    // setFinalAccues([])
  };

  const handleClose = () => {
    setOpen(false);
    setValidatedaccus(false);
    setValidatedSec(false);
    setValidated(false);
    setFinalAccues([]);
  };
  ////// on accused change function ////

  const onAccusesChange = (e) => {
    setAccusedObj({
      ...accusedObj,
      [e.target.name]: e.target.value,
    });
  };

  const onAddAccused = (e) => {
    e.preventDefault();
    formRef.current.reset();

    if (accusedObj && !accusedObj.name) {
      setCustomError({
        name: "name",
        message: "Please select Accused",
      });
    } else if (accusedObj && !accusedObj.accused_type) {
      setCustomError({
        name: "accused_type",
        message: "Please select Type of Accused !",
      });
    } else {
      if (accusedObj.name && accusedObj.accused_type) {
        let data =
          showAccusedArr &&
          showAccusedArr.length > 0 &&
          showAccusedArr.find((e) => e.name == accusedObj.name);
        if (data) {
          setShowAccusedArr(showAccusedArr);
          setAccusedArr(accusedArr);
        } else {
          if (accusedObj.name) {
            let trfname =
              masterDataTraffickerList &&
              masterDataTraffickerList.data &&
              masterDataTraffickerList.data.length > 0 &&
              masterDataTraffickerList.data.find(
                (x) => x._id == accusedObj.name
              );
            if (trfname) {
              accusedObj.trafficker_name = trfname.trafficker_name;
              setShowAccusedArr([...showAccusedArr, accusedObj]);
            }
          } else {
            setShowAccusedArr([...showAccusedArr, accusedObj]);
          }
          setAccusedArr([...accusedArr, accusedObj]);
        }
      }
    }
    // setAccusedObj({});
  };

  const [deleteaccusReason, setDeleteaccusReason] = useState({});
  const [accusNotemodalShow, setAccusNotemodalShow] = useState(false);
  const [accusedDeleteId, setAccusedDeleteId] = useState("");

  ///// for accus not included model open ////
  const onDeleteAccuse = (e, value, accusedId, data) => {
    if (addFirData && addFirData._id) {
      setAccusedDeleteId(accusedId);
      setAccusNotemodalShow(true);
    } else {
      var array = [...showAccusedArr]; // make a separate copy of the array
      array.splice(value, 1);
      setAccusedArr(array);
      setShowAccusedArr(array);
    }
  };
  /////// open accuse delete model in add form //////
  useEffect(() => {
    if (deleteaccusReason && deleteaccusReason.notes) {
      setNotesCustome({ field: "notes", message: "" });
    } else {
      setNotesCustome({ field: "", message: "" });
    }
  }, [deleteaccusReason]);

  // console.log(showAccusedArr, "showAccusedArr", accusedArr);

  //// fro accused not included delete modal function ////
  const onAccusNotIncludedDelete = (e) => {
    e.preventDefault();

    if (!deleteaccusReason.notes) {
      setNotesCustome({ field: "notes", message: "Please enter notes" });
    } else {
      setNotesCustome({ field: "", message: "" });

      var arr = [...showAccusedArr];
      let obj1 = {};
      let newArr1 = [];
      arr &&
        arr.length > 0 &&
        arr.map((x, idx) => {
          if (x.accusedId == accusedDeleteId) {
            obj1 = {
              trafficker_name: x && x.trafficker_name,
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
      setAccusedArr(newArr1);
      setShowAccusedArr(newArr1);
      setDeleteaccusReason({});
      setAccusNotemodalShow(false);
    }
  };

  useEffect(() => {
    let arr = [];
    let obj = {};

    masterDataTraffickerList &&
      masterDataTraffickerList.data &&
      masterDataTraffickerList.data.length > 0 &&
      masterDataTraffickerList.data.filter((item) => {
        return (
          showAccusedArr &&
          showAccusedArr.length > 0 &&
          showAccusedArr.map((x) => {
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
    setFinalAccues(arr);
  }, [showAccusedArr]);

  useEffect(() => {
    setAddFirData({
      ...addFirData,
      accused: accusedArr,
    });
  }, [accusedArr]);

  const onSectionChange = (e) => {
    setSectionObj({
      ...sectionObj,
      [e.target.name]: e.target.value,
    });
    // dispatch(getSectionByActId(e.target.value));
  };

  const onSectionNumberChange = (e) => {
    setSectionObj({
      ...sectionObj,
      [e.target.name]: e.target.value,
    });
    dispatch(getSectionByActId(e.target.value));
  };

  const onDeleteSection = (value) => {
    var array = [...sectionArr]; // make a separate copy of the array
    array.splice(value, 1);
    setSectionArr(array);
  };

  const onSectionSubmit = (e) => {
    e.preventDefault();

    if (sectionObj && !sectionObj.section_type) {
      setCustomError({
        name: "section_type",
        message: "Please select Section Type",
      });
    } else if (sectionObj && !sectionObj.section_number) {
      setCustomError({
        name: "section_number",
        message: "Please select Section Number !",
      });
    } else if (sectionObj && !sectionObj.date_of_section_when_added_to_fir) {
      setCustomError({
        name: "date_of_section_when_added_to_fir",
        message: "Please select Date!",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
      if (sectionObj.section_type) {
        setSectionArr([...sectionArr, sectionObj]);
      }
      formRef.current.reset();
      setSectionObj({});
    }
  };

  useEffect(() => {
    setAddFirData({
      ...addFirData,
      section: sectionArr,
    });
  }, [sectionArr]);

  const onHandleChange = (e) => {
    setAddFirData({
      ...addFirData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  useEffect(() => {
    // console.log(addFirData, "addFirData");

    if (addFirData && addFirData.location) {
      setCustomError({
        name: "location",
        message: "",
      });
    } else if (addFirData && addFirData.policeStation) {
      setCustomError({
        name: "policeStation",
        message: "",
      });
    } else if (addFirData && addFirData.name_of_defacto_complainer) {
      setCustomError({
        name: "name_of_defacto_complainer",
        message: "",
      });
    } else if (addFirData && addFirData.relation_with_defacto_complainer) {
      setCustomError({
        name: "relation_with_defacto_complainer",
        message: "",
      });
    } else if (addFirData && addFirData.gd_number) {
      setCustomError({
        name: "gd_number",
        message: "",
      });
    } else if (addFirData && addFirData.issue_mention_in_gd) {
      setCustomError({
        name: "issue_mention_in_gd",
        message: "",
      });
    } else if (addFirData && addFirData.fir) {
      setCustomError({
        name: "number",
        message: "",
      });
    } else if (addFirData && addFirData.fir && addFirData.fir.number) {
      setCustomError({
        name: "number",
        message: "",
      });
    } else if (addFirData && addFirData.fir && addFirData.fir.date) {
      setCustomError({
        name: "date",
        message: "",
      });
    } else if (addFirData && addFirData.issues_in_fir) {
      setCustomError({
        name: "issues_in_fir",
        message: "",
      });
    } else if (accusedObj && accusedObj.name) {
      setCustomError({
        name: "name",
        message: "",
      });
    } else if (accusedObj && accusedObj.accused_type) {
      setCustomError({
        name: "accused_type",
        message: "",
      });
    } else if (addFirData && addFirData.accused) {
      setCustomError({
        name: "name",
        message: "",
      });
    } else if (addFirData && addFirData.section) {
      setCustomError({
        name: "section_type",
        message: "",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
    }
  }, [addFirData]);

  const onAddFirFunc = (e) => {
    e.preventDefault();
    // var format = /[!@#$%^&*()_+\-=\[\]0-9{};':"\\|,.<>\/?]+/;
    let pattern = /[0-9\s]{0,}[a-zA-Z]{2,}/g;
    if (addFirData && !addFirData.location) {
      setCustomError({
        name: "location",
        message: "Please select Location",
      });
    } else if (addFirData && !addFirData.policeStation) {
      setCustomError({
        name: "policeStation",
        message: "Please select Police Station",
      });
    } else if (addFirData && !addFirData.name_of_defacto_complainer) {
      setCustomError({
        name: "name_of_defacto_complainer",
        message: "Please enter name of Defacto Complainer",
      });
    } else if (addFirData && !addFirData.relation_with_defacto_complainer) {
      setCustomError({
        name: "relation_with_defacto_complainer",
        message: "Please enter name Relation with Defacto Complainer",
      });
    } else if (addFirData && !addFirData.gd_number) {
      setCustomError({
        name: "gd_number",
        message: "Please enter GD Number",
      });
    } else if (addFirData && !addFirData.issue_mention_in_gd) {
      setCustomError({
        name: "issue_mention_in_gd",
        message: "Please enter Issue mention in GD",
      });
    } else if (!pattern.test(addFirData && addFirData.issue_mention_in_gd)) {
      setCustomError({
        name: "issue_mention_in_gd",
        message: "Please enter valid Issue mention in GD",
      });
    } else if (addFirData && !addFirData.fir) {
      setCustomError({
        name: "number",
        message: "Please enter FIR Number",
      });
    } else if (addFirData && addFirData.fir && !addFirData.fir.number) {
      setCustomError({
        name: "number",
        message: "Please enter FIR Number",
      });
    } else if (addFirData && addFirData.fir && !addFirData.fir.date) {
      setCustomError({
        name: "date",
        message: "Please enter Date of FIR",
      });
    } else if (addFirData && !addFirData.issues_in_fir) {
      setCustomError({
        name: "issues_in_fir",
        message: "Please enter Issue in FIR",
      });
    } else if (!pattern.test(addFirData && addFirData.issues_in_fir)) {
      setCustomError({
        name: "issues_in_fir",
        message: "Please enter valid Issue in FIR",
      });
    } else if (addFirData && !addFirData.accused) {
      if (accusedObj && !accusedObj.name) {
        setCustomError({
          name: "name",
          message: "Please select Accused Name",
        });
      } else if (accusedObj && !accusedObj.accused_type) {
        setCustomError({
          name: "accused_type",
          message: "Please select Accused Type",
        });
      } else {
        setCustomError({
          name: "accused_type",
          message: "Please Add Accused !",
        });
      }
    } else if (
      (addFirData && !addFirData.section) ||
      !addFirData.section.length > 0
    ) {
      if (sectionObj && !sectionObj.section_type) {
        setCustomError({
          name: "section_type",
          message: "Please select Section Type",
        });
      } else if (sectionObj && !sectionObj.section_number) {
        setCustomError({
          name: "section_number",
          message: "Please select Section Number",
        });
      } else if (sectionObj && !sectionObj.date_of_section_when_added_to_fir) {
        setCustomError({
          name: "date_of_section_when_added_to_fir",
          message: "Please select Date",
        });
      } else {
        setCustomError({
          name: "notes",
          message: "Please Add Section",
        });
      }
    } else {
      let updateData = {
        user_id: deletedById && deletedById,
        ...addFirData,
        survivor: getId.survivorId,
      };
      let addData = {
        ...addFirData,
        survivor: getId.survivorId,
      };
      if (firData && firData._id) {
        setResultLoad(true);
        axios
          .patch(
            api + "/survival-fir/update/" + firData._id,
            updateData,
            axiosConfig
          )
          .then((response) => {
            //console.log(response);

            setValidated(false);
            setValidatedaccus(false);
            setResultLoad(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("success");
              localStorage.setItem(
                "firNumber",
                data.result && data.result.fir && data.result.fir.number
              );
              localStorage.setItem(
                "firDate",
                data.result && data.result.fir && data.result.fir.date
              );
              localStorage.setItem(
                "firSource",
                data.result && data.result.location
              );
              dispatch(getFirList(getId.survivorId));
              firDetails(firData._id);
              // dispatch({ type: "FIR_LIST", data: data.result });
              setShowAccusedArr([]);
              setSectionObj({});
              setAccusedObj({});
              setSectionArr([]);
              setAccusedArr([]);
              setAddFirData({});
              setFirObj({});
              // setFirData({});
              // setActiveClass(false);
              setModalFirShow(false);
            } else {
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("error");
            }
          })
          .catch((error) => {
            //console.log(error, "fir add error");
            handleClick();
            setUpdateMessage(error && error.message);
            setMessagType("error");
            setResultLoad(false);
          });
      } else {
        setResultLoad(true);
        axios
          .post(api + "/survival-fir/create", addData, axiosConfig)
          .then((response) => {
            //console.log(response);

            setValidated(false);
            setValidatedaccus(false);
            setResultLoad(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("success");

              dispatch({ type: "USERS_LIST", data: data.data });
              dispatch(getFirList(getId.survivorId));
              setModalFirShow(false);
              setAddFirData({});
              setShowAccusedArr([]);
              setSectionArr([]);
              setShowAccusedArr([]);
              setSectionObj({});
              setAccusedObj({});
              setFirObj({});
              setAccusedArr([]);
            } else {
              handleClick();
              setUpdateMessage(response && response.data.message);
              setMessagType("error");
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

  /////// delete accused function /////
  const gotoReasonModal = (data) => {
    setmodalInactiveShow(true);
    setAccusedDeleteId(data);
  };
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
            "/survival-fir/delete-accused/" +
            firData._id +
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

            firDetails(firData._id);
            dispatch(getFirList(getId.survivorId));

            setmodalInactiveShow(false);
            setAccusedDeleteId("");
            setReason({});
          } else {
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

  const onChangeDateHandler = (e) => {
    setAddFirData({
      ...addFirData,
      [e.target.name]: e.target.value,
    });
  };
  //export csv function///

  //console.log(firList.data, "firrrrrrrrrrrrrr");
  let exportData = [];
  firList &&
    firList.data &&
    firList.data.length > 0 &&
    firList.data.map((x, index) => {
      exportData.push({
        date:
          x && x.fir && x.fir.date && moment(x.fir.date).format("DD-MMM-YYYY"),
        firNumber: x.fir && x.fir.number,
        gd_number: x.gd_number,
        issue_mention_in_gd: x.issue_mention_in_gd,
        location: x.location,
        survivor: survivorDetails && survivorDetails.survivor_name,
        createdAt: moment(x.createdAt).format("DD-MMM-YYYY"),
        policeStation: x.policeStation && x.policeStation.name,
      });
    });

  //// make accused array  for csv export/////
  let exportAccusedData = [];
  firData &&
    firData.accused &&
    firData.accused.length > 0 &&
    firData.accused.map((x, index) => {
      exportAccusedData.push({
        accusedType: x && x.accused_type,
        nameOfAccused: x.name?.trafficker_name,
      });
    });
  //// make section array  for csv export/////
  let exportSectionData = [];
  firData &&
    firData.section &&
    firData.section.length > 0 &&
    firData.section.map((x, index) => {
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

  let sectionData = [];
  firList &&
    firList.data &&
    firList.data.length > 0 &&
    firList.data.map((x) => {
      x.section &&
        x.section.length > 0 &&
        x.section.map((y) => {
          sectionData.push(y);
        });
    });
  //console.log(sectionData, "cccccccccccccccccccccc");
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
  const exportToCsvFir = (e) => {
    e.preventDefault();

    // Headers for each column
    let headers = [
      "FIR Date,Fir Number,GD NUmber,Issue Mention in GD,Location,Survivor,Police Station,CreatedAt",
    ];

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const {
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
          date,
          firNumber,
          gd_number,
          issue_mention_in_gd,
          location,
          survivor,
          policeStation,
          createdAt,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "firList.csv",
      fileType: "text/csv",
    });
  };

  const exportToCsvAcc = (e) => {
    e.preventDefault();
    if (firData && !firData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one FIR !!");
      setAlertFlag("alert");
    } else {
      // Headers for each column
      let headers = ["Type Of Accused,Name of Accused"];

      let usersCsv = exportAccusedData.reduce((acc, user) => {
        const { accusedType, nameOfAccused } = user;
        acc.push([accusedType, nameOfAccused].join(","));
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...usersCsv].join("\n"),
        fileName: "accusedList.csv",
        fileType: "text/csv",
      });
    }
  };

  const exportToCsvSec = (e) => {
    e.preventDefault();
    if (firData && !firData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one FIR !!");
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

  ///// PDF for FIR ///////////
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
    doc.text("SURVIVOR FIR LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "FIR Date",
      "Fir Number",
      "GD NUmber",
      "Issue Mention in GD",
      "Location",
      "Survivor",
      "Police Station",
      "CreatedAt",
    ];
    const name = "survivor-fir-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [
        item.date,
        item.firNumber,
        item.gd_number,
        item.issue_mention_in_gd,
        item.location,
        item.survivor,
        item.policeStation,
        item.createdA,
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
    doc.save(name);
  };

  ///// PDF for fir Accused /////

  const downloadaccusePdf = () => {
    if (firData && !firData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one FIR !!");
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
      doc.text("SURVIVOR ACCUSED LIST", 22, 60);
      doc.setFontSize(10);
      const survivorColumns = ["Type Of Accused", "Name of Accused"];
      const name = "survivor-Accused-list" + new Date().toISOString() + ".pdf";
      let goalsRows = [];
      exportAccusedData?.forEach((item) => {
        const temp = [item.accusedType, item.nameOfAccused];
        goalsRows.push(temp);
      });
      doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
      doc.save(name);
    }
  };

  ///// PDF for fir section /////
  const downloadSectionPdf = () => {
    if (firData && !firData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one FIR !!");
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
      doc.text("FIR SECTION LIST", 22, 60);
      doc.setFontSize(10);
      const survivorColumns = [
        "Section Type",
        "Section Number",
        "Date Of Section",
        "Section Notes",
      ];
      const name = "survivor-Section-list" + new Date().toISOString() + ".pdf";
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
          message={updateMessage}
          type={messagType}
        />
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">FIR</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>FIR</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topcartbar white_box_shadow">
            <SurvivorTopCard survivorDetails={survivorDetails} />
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            <div className="vieweditdelete">
              {currentModule && JSON.parse(currentModule).can_view == true && (
                <Dropdown className="me-1">
                  <Dropdown.Toggle variant="border" className="shadow-0">
                    Action
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {userAccessData &&
                      userAccessData.length > 0 &&
                      userAccessData.map((access) => {
                        return (
                          access.module &&
                          access.module.name.toLowerCase() == "investigation" &&
                          access.can_view == true && (
                            <Dropdown.Item
                              onClick={(e) => gotoInvestigation(e)}
                            >
                              Investigation
                            </Dropdown.Item>
                          )
                        );
                      })}

                    <Dropdown.Item onClick={downloadPdf}>
                      Download FIR PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={downloadaccusePdf}>
                      Download Accused PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={downloadSectionPdf}>
                      Download Section PDF
                    </Dropdown.Item>

                    <Dropdown.Item onClick={exportToCsvFir}>
                      FIR Export to CSV
                    </Dropdown.Item>
                    <Dropdown.Item onClick={exportToCsvAcc}>
                      Accused Export to CSV
                    </Dropdown.Item>
                    <Dropdown.Item onClick={exportToCsvSec}>
                      Section Export to CSV
                    </Dropdown.Item>
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
                  <span onClick={() => onShowModel()}>
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
                  <span onClick={() => onShowEditModel()}>
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
              <FirDataTable
                firList={
                  firList &&
                  firList.data &&
                  firList.data.length > 0 &&
                  firList.data
                }
                selectedProduct5={selectedProduct5}
                isLoading={isLoading}
                onSelectRow={onSelectRow}
              />
            )}

            {firData && firData.accused && firData.accused.length > 0 && (
              <div>
                <h4 className="mt-4 pt-2 pb-1 mb-4 small_heading">
                  List of Accused
                </h4>
                <table className="table table-borderless mb-5">
                  <thead>
                    <tr>
                      <th width="12%">Name of accused</th>
                      <th width="10%">Type of accused</th>
                      <th width="10%">Added on</th>
                      <th width="20%">Notes</th>
                      <th width="20%">Action to remove accused - with notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {firData &&
                      firData.accused &&
                      firData.accused.length > 0 &&
                      firData.accused.map((item) => {
                        return (
                          <tr>
                            {/* {item && item.name && item.name.trafficker_name && ( */}
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
                              <td>
                                {firData &&
                                  firData.createdAt &&
                                  moment(firData.createdAt).format(
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
                            {/* ) */}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
            <div id="section-list">
              {firData && firData.section && firData.section.length > 0 && (
                <>
                  <h4 className="mt-4 pt-2 pb-1 mb-4 small_heading">Section</h4>
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="10%">Type</th>
                        <th width="10%">Section</th>
                        {/* <th width="15%">Supplimentary FIR Number</th> */}
                        <th width="15%">Notes</th>
                        {/* <th width="20%">Action to remove accused - with notes</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {firData &&
                        firData.section &&
                        firData.section.length > 0 &&
                        firData.section.map((item) => {
                          return (
                            <tr>
                              {item && item.section_type && (
                                <>
                                  <td>
                                    {item && item.section_type.toUpperCase()}
                                  </td>
                                  <td>{item && item.section_number}</td>
                                  {/* <td>{"NA"}</td> */}
                                  <td>{item && item.notes}</td>
                                  {/* <td>{"need discuss"}</td> */}
                                </>
                              )}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalFirShow}
        onHide={onCancel}
        size="lg"
        aria-labelledby="reason-modal"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {firData && firData.location ? "Update" : "Add"} FIR
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form
            //  noValidate validated={validated} onSubmit={handleSubmit}
            >
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    source/Destination <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="location"
                    // required
                    value={addFirData && addFirData.location}
                    onChange={(e) =>
                      setAddFirData({
                        ...addFirData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Default select
                    </option>
                    <option value="sa">{"SA"}</option>
                    <option value="da"> {"DA"}</option>
                  </Form.Select>
                  {customError.name == "location" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                  {/* <Form.Control.Feedback type="invalid">
                    Please select Source/Destination
                  </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Police station <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    // required
                    value={
                      addFirData &&
                      addFirData.policeStation &&
                      addFirData.policeStation._id
                    }
                    name="policeStation"
                    onChange={(e) =>
                      setAddFirData({
                        ...addFirData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value="" hidden={true}>
                      Please select
                    </option>
                    {masterPoliceStationList &&
                      masterPoliceStationList.data &&
                      masterPoliceStationList.data.length > 0 &&
                      masterPoliceStationList.data.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "policeStation" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                  {/* <Form.Control.Feedback type="invalid">
                    Please select Police station
                  </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Name of Defacto complainer at{" "}
                    {addFirData &&
                    addFirData.location &&
                    addFirData.location === "sa"
                      ? "SA"
                      : addFirData &&
                        addFirData.location &&
                        addFirData.location === "da" &&
                        "DA"}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    // required
                    name="name_of_defacto_complainer"
                    type="text"
                    defaultValue={
                      addFirData && addFirData.name_of_defacto_complainer
                    }
                    // onChange={(e) =>
                    //   setAddFirData({
                    //     ...addFirData,
                    //     [e.target.name]: e.target.value,
                    //   })
                    // }
                    onChange={onHandleChange}
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                    }}
                  />{" "}
                  {customError.name == "name_of_defacto_complainer" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                  {/* <Form.Control.Feedback type="invalid">
                    Please enter Name of Defacto complainer at{" "}
                    {addFirData &&
                    addFirData.location &&
                    addFirData.location === "sa"
                      ? "SA"
                      : addFirData && addFirData.location === "da" && "DA"}
                  </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Relationship with Defacto complainer at{" "}
                    {addFirData &&
                    addFirData.location &&
                    addFirData.location === "sa"
                      ? "SA"
                      : addFirData && addFirData.location === "da" && "DA"}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    // required
                    defaultValue={
                      addFirData && addFirData.relation_with_defacto_complainer
                    }
                    name="relation_with_defacto_complainer"
                    type="text"
                    // onChange={(e) =>
                    //   setAddFirData({
                    //     ...addFirData,
                    //     [e.target.name]: e.target.value,
                    //   })
                    // }
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                    }}
                    onChange={onHandleChange}
                  />
                  {customError.name == "relation_with_defacto_complainer" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                  {/* <Form.Control.Feedback type="invalid">
                    Please enter Relationship with Defacto complainer at{" "}
                    {addFirData &&
                    addFirData.location &&
                    addFirData.location === "sa"
                      ? "SA"
                      : addFirData && addFirData.location === "da" && "DA"}
                  </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="4" className="mb-3">
                  <Form.Label>
                    GD Number at{" "}
                    {addFirData &&
                    addFirData.location &&
                    addFirData.location === "sa"
                      ? "SA"
                      : addFirData && addFirData.location === "da" && "DA"}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    // required
                    name="gd_number"
                    type="text"
                    defaultValue={
                      addFirData && addFirData.gd_number && addFirData.gd_number
                    }
                    onChange={onHandleChange}
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z 0-9 /\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                    }}
                  />

                  {customError.name == "gd_number" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                  {/* <Form.Control.Feedback type="invalid">
                    Please enter GD Number at{" "}
                    {addFirData &&
                    addFirData.location &&
                    addFirData.location === "sa"
                      ? "SA"
                      : addFirData && addFirData.location === "da" && "DA"}
                  </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="4" className="mb-3">
                  <Form.Label>Date of GD</Form.Label>

                  {/* <DatePicker
                    // message={"Please enter date of Rescue."}
                    name="date_of_gd"
                    datePickerChange={onChangeDateHandler}
                    data={addFirData && addFirData.date_of_gd}
                  /> */}
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addFirData && addFirData.date_of_gd
                            ? moment(addFirData.date_of_gd).format(
                                "DD-MMM-YYYY"
                              )
                            : null
                        }
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"date_of_gd"}
                          className="dateBtn"
                          type="date"
                          onChange={onChangeDateHandler}
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
                </Form.Group>
                <Form.Group as={Col} md="4" className="mb-3">
                  <Form.Label>
                    Issue mentioned <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    // required
                    defaultValue={addFirData && addFirData.issue_mention_in_gd}
                    name="issue_mention_in_gd"
                    type="text"
                    onChange={onHandleChange}
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z 0-9 \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                    }}
                  />
                  {customError.name == "issue_mention_in_gd" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                  {/* <Form.Control.Feedback type="invalid">
                    Please enter Issue mentioned
                  </Form.Control.Feedback> */}
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    FIR Number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    // required
                    type="text"
                    defaultValue={
                      addFirData && addFirData.fir && addFirData.fir.number
                    }
                    name="number"
                    onChange={onFirNumberChange}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
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
                    Date of FIR <span className="requiredStar">*</span>
                  </Form.Label>

                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addFirData && addFirData.fir && addFirData.fir.date
                            ? moment(addFirData.fir.date).format("DD-MMM-YYYY")
                            : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"date"}
                          className="dateBtn"
                          type="date"
                          onChange={onFirNumberChange}
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
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    Issues in FIR <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    // required
                    name="issues_in_fir"
                    defaultValue={
                      addFirData &&
                      addFirData.issues_in_fir &&
                      addFirData.issues_in_fir
                    }
                    type="text"
                    onChange={onHandleChange}
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                    }}
                  />
                  {customError.name == "issues_in_fir" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>

                <Form.Group as={Col} md="12" className="mb-3">
                  <Form
                    ref={formRef}
                    // noValidate validated={validatedSec} onSubmit={handleSubmitAccus}
                  >
                    <Row className="justify-content-between">
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Name of Accused </Form.Label>

                        <Form.Select
                          // required
                          onChange={(e) => onAccusesChange(e)}
                          name="name"
                        >
                          <option value={""} hidden={true}>
                            Please select
                          </option>
                          {masterDataTraffickerList &&
                            masterDataTraffickerList.data &&
                            masterDataTraffickerList.data.length > 0 &&
                            masterDataTraffickerList.data.map((item) => {
                              return (
                                <option value={item._id}>
                                  {item.trafficker_name}
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
                        <Form.Label>Type of accused </Form.Label>
                        <Form.Select
                          required
                          onChange={(e) => onAccusesChange(e)}
                          name="accused_type"
                        >
                          <option value={""} hidden={true}>
                            Please select
                          </option>
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
                          // disabled={
                          //   !accusedObj.name
                          //     ? true
                          //     : !accusedObj.accused_type
                          //     ? true
                          //     : false
                          // }
                          type="submit"
                          onClick={(e) => onAddAccused(e)}
                          className="addbtn addbtn_blue shadow-0"
                        >
                          Add Accused
                        </Button>
                      </Form.Group>
                    </Row>
                    {showAccusedArr && showAccusedArr.length > 0 && (
                      <div className="white_box_shadow_20 survivors_table_wrap position-relative mb-4">
                        <h4 class="mb-4 small_heading">Add Accused</h4>
                        <table className="table table-borderless mb-0">
                          <thead>
                            <tr>
                              <th width="12%">Name of Accused </th>
                              <th width="10%">Type of accused </th>
                              <th width="4%"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {showAccusedArr &&
                              showAccusedArr.length > 0 &&
                              showAccusedArr.map((item, index) => {
                                return (
                                  <tr>
                                    {/* {item && item.name && ( */}
                                    <>
                                      <td>{item && item.trafficker_name}</td>
                                      <td>
                                        {item &&
                                          item.accused_type.toUpperCase()}
                                      </td>
                                      <td>
                                        {item && item.is_deleted != true && (
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
                                                style={{ color: "red" }}
                                                className="fal fa-trash-alt"
                                              ></i>
                                            </span>
                                          </MDBTooltip>
                                        )}
                                      </td>
                                    </>
                                    {/* )} */}
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Form>
                </Form.Group>

                <Form.Group as={Col} md="12" className="mb-3">
                  <Form
                    ref={formRef}
                    // noValidate validated={validatedSec} onSubmit={handleSubmitSec}
                  >
                    <Row>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Type of section</Form.Label>
                        <Form.Select
                          // required
                          onChange={onSectionNumberChange}
                          name="section_type"
                        >
                          <option hidden={true} value="">
                            Please select
                          </option>
                          {masterActList &&
                            masterActList.data &&
                            masterActList.data.length > 0 &&
                            masterActList.data.map((item) => {
                              return (
                                <option value={item && item.name}>
                                  {item && item.name}{" "}
                                </option>
                              );
                            })}
                          {/* <option value="itpc">ITPC </option> */}
                        </Form.Select>
                        {customError.name == "section_type" && (
                          <small className="mt-4 mb-2 text-danger">
                            {customError && customError.message}
                          </small>
                        )}
                        {/* <Form.Control.Feedback type="invalid">
                          Please select Type of section
                        </Form.Control.Feedback> */}
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Section</Form.Label>
                        <Form.Select
                          // required
                          onChange={onSectionChange}
                          name="section_number"
                        >
                          <option value="" hidden={true}>
                            Please select
                          </option>
                          {sectionByActId &&
                            sectionByActId.length > 0 &&
                            sectionByActId.map((item) => {
                              return (
                                <option value={item && item.number}>
                                  {item && item.number}
                                </option>
                              );
                            })}
                        </Form.Select>
                        {customError.name == "section_number" && (
                          <small className="mt-4 mb-2 text-danger">
                            {customError && customError.message}
                          </small>
                        )}
                        {/* <Form.Control.Feedback type="invalid">
                          Please select Section number
                        </Form.Control.Feedback> */}
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Date of section when added to FIR
                        </Form.Label>
                        {/* <DatePicker
                          name="date_of_section_when_added_to_fir"
                          datePickerChange={onSectionChange}
                          data={
                            sectionObj &&
                            sectionObj.date_of_section_when_added_to_fir
                          }
                        /> */}

                        <>
                          <InputGroup className="date_box">
                            <span className="hidebox"></span>
                            <Form.Control
                              type="text"
                              placeholder="DD-MMM-YYYY"
                              value={
                                sectionObj &&
                                sectionObj.date_of_section_when_added_to_fir
                                  ? moment(
                                      sectionObj.date_of_section_when_added_to_fir
                                    ).format("DD-MMM-YYYY")
                                  : null
                              }
                              disabled={true}
                            />

                            <InputGroup.Text>
                              <Form.Control
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
                          onChange={onSectionChange}
                          name="notes"
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[a-z A-Z 0-9 , . \s]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                          }}
                        />
                        {customError.name == "notes" && (
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
                          onClick={onSectionSubmit}
                          className="addbtn addbtn_blue shadow-0"
                          // disabled={
                          //   !sectionObj.section_number
                          //     ? true
                          //     : !sectionObj.date_of_section_when_added_to_fir
                          //     ? true
                          //     : false
                          // }
                        >
                          Add Section
                        </Button>
                      </Form.Group>
                    </Row>
                    {sectionArr && sectionArr.length > 0 && (
                      <div className="white_box_shadow_20 survivors_table_wrap position-relative mb-4">
                        <h4 class="mb-4 small_heading">Add Section</h4>
                        <table className="table table-borderless mb-0">
                          <thead>
                            <tr>
                              <th width="12%">Type of section</th>
                              <th width="10%">Section</th>
                              <th width="12%">
                                Date of section <span>when added to FIR</span>
                              </th>
                              <th width="10%">Notes</th>
                              <th width="10%"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {sectionArr &&
                              sectionArr.length > 0 &&
                              sectionArr.map((item, index) => {
                                return (
                                  <tr>
                                    <td>
                                      {item && item.section_type.toUpperCase()}
                                    </td>
                                    <td>{item && item.section_number}</td>
                                    <td>
                                      {item &&
                                        moment(
                                          item.date_of_section_when_added_to_fir
                                        ).format("DD-MMM-YYYY")}
                                    </td>
                                    <td>{item && item.notes}</td>
                                    <td>
                                      {" "}
                                      <MDBTooltip
                                        tag="a"
                                        wrapperProps={{
                                          className: "delete_btn",
                                        }}
                                        title="Delete"
                                      >
                                        <span
                                          onClick={() => onDeleteSection(index)}
                                        >
                                          <i
                                            style={{ color: "red" }}
                                            className="fal fa-trash-alt"
                                          ></i>
                                        </span>
                                      </MDBTooltip>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
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
                    onClick={() => onCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    disabled={resultLoad === true ? true : false}
                    onClick={(e) => onAddFirFunc(e)}
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
          alertFlag={alertFlag}
          alertMessage={alertMessage}
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
          deleteLoader={deleteLoader}
        />
      )}
    </>
  );
};

export default SurvivorFir;
