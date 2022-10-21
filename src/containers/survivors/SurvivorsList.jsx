import React, { useState, useEffect } from "react";
import { Topbar } from "../../components";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { MDBTooltip } from "mdb-react-ui-kit";
import { MultiSelect } from "react-multi-select-component";
import NotificationPage from "../../components/NotificationPage";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col } from "react-bootstrap";
// import { findAncestor, gotoDetails } from "../Library/Helpers";
import {
  findAncestor,
  goToAdd,
  goToEditSurvivor,
  gotoSurvivorDetails,
  gotoSurvivorArchive,
  goToSurvivorFir,
  goToSurvivorInvestBysurvivor,
  gotoSurvivorChargeBySurv,
  goToTraffickerView,
  goToTraffickerPage,
} from "../../utils/helper";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";
import "./survivors.css";
import addIcon from "../../assets/img/add-icon.png";
import alertImg from "../../assets/img/alertPopupimg.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getSurvivorList,
  getTraffickerList,
  // servivorSearchApi,
  getSurvivorDetails,
  getmoduleList,
  getChangeLog
} from "../../redux/action";
import axios from "axios";
import queryString from "query-string";

import DataTableFilter from "./DataTableFilter";
import moment from "moment";
import AlertComponent from "../../components/AlertComponent";

const Survivors = (props) => {
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  const handleShow = () => setShowAlert(true);
  const [searchData, setSearchData] = useState({});
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const dispatch = useDispatch();
  const survivorList = useSelector((state) => state.survivorList);
  const [activeClass, setActiveClass] = useState(false);
  const [survivorId, setSurvivorId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const survivorActionDetails = useSelector(
    (state) => state.survivorActionDetails
  );
  const moduleList = useSelector((state) => state.moduleList);
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");

  // //console.log(userAccessData, "userAccessData");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };

  let url = props.location.pathname;
  // let getId = queryString.parse(url, { parseNumbers: true });

  //console.log(url);
  useEffect(() => {
    dispatch(getSurvivorList(deletedById));
    dispatch(getmoduleList());
  }, [props]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // initFilters1();
  }, [survivorList]);

  // useEffect(() => {
  //   localStorage.removeItem("currentModule");
  // }, [props]);

  ///////// API call function for survivor search ////////

  useEffect(() => {
    // if (searchData && searchData.searchText !== "") {
    //   dispatch(servivorSearchApi(searchData));
    // } else {
      dispatch(getSurvivorList(deletedById));
    // }
  }, [searchData]);

  // //console.log(searchData, "searchData");

  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [erorMessage, setErorMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [editData, setEditData] = useState({});
  const onSelectRow = (value) => {
    //console.log(value, "value");
    if(value !==null){
    setActiveClass(true);
    setEditData(value);
    setSurvivorId(value._id);
    } else{
      setActiveClass(false);
    setEditData({});
    setSurvivorId('');
    }
  };


  const changeLogFunc = () => {
    let type = "profile";
    dispatch(getChangeLog(type, deletedById));
    props.history.push("/change-log");
  };

  useEffect(() => {
    if(editData && editData._id){
    dispatch(getSurvivorDetails(editData && editData._id));
    }else{
      // console.log("d")
    }
  }, [editData && editData._id]);

  const handleCloseAlert = () => {
    setAlertMessage("");
    setAlertFlag("");
    setShowAlert(false);
  };

  // useEffect(() => {
  //   //console.log(survivorId);
  // }, [survivorId]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData({});
  };
  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (!survivorId) {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else {
      setAlertFlag("");
      setAlertMessage("");
      setShowAlert(true);
    }
  };
  const [deleteLoader, setDeleteLoader] = useState(false);


  const onDeleteFunction = () => {
    let body = {
      deleted_by: deletedById && deletedById,
      deleted_by_ref: "users",
    };
    setDeleteLoader(true)
    axios
      .patch(api + "survival-profile/delete/" + survivorId, body,axiosConfig)
      .then((response) => {
    setDeleteLoader(false)
        handleClick();
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getSurvivorList(deletedById));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
    setDeleteLoader(false)

        ////console.log(error, "partner error");
      });
  };

  const gotoParticipationPage = () => {
    if (!survivorId) {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else {
      props.history.push({
        pathname: "/survivor-participation",
        state: survivorId,
      });
    }
  };
  const goToFir = (e) => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "fir" && item
      );
    }

    obj = arrdata[0];
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (!survivorId) {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    }  else {
      goToSurvivorFir(e, survivorId, history);
      // props.history.push({ pathname: "/survivor-fir", state: survivorId });
    }
  };

  const gotChargeSheet = (e) => {
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

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      gotoSurvivorChargeBySurv(e, survivorId, history);
      // props.history.push({
      //   pathname: "/survivor-chargesheet",
      //   state: survivorId,
      //   flag:"fromSurvivor"
      // });
    }
  };
  const gotoArchiveList = (e) => {
    gotoSurvivorArchive(e, "survivor",' ', history);
  };

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

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      goToSurvivorInvestBysurvivor(e, survivorId, history);
    }
  };
  const gotoDocument = () => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "documents" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    }  else {
      props.history.push({ pathname: "/survivor-document", state: survivorId });
    }
  };
  const gotoLawyerPage = () => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "lawyer" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      props.history.push({ pathname: "/survivor-lawyer", state: survivorId });
    }
  };

  const gotoTraffickerPage = (e) => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "trafficker" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      goToTraffickerPage(e, survivorId, history);
      //   goToTraffickerView()
      //   props.history.push({
      //     pathname: "/survivor-traffickers",
      //     state: survivorId,
      //   });
    }
  };

  const gotRescue = () => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "rescue" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      props.history.push({ pathname: "/survivor-rescue", state: survivorId });
    }
  };
  const gotVc = () => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "vc" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      props.history.push({ pathname: "/survivor-vc", state: survivorId });
    }
  };

  const gotoShelterHome = () => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "shelter home" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      props.history.push({
        pathname: "/survivor-shelter-home",
        state: survivorId,
      });
    }
  };

  const gotoNextPaln = () => {
    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      props.history.push({
        pathname: "/my_diary",
        state: survivorId,
      });
    }
  };
  const gotoPc = () => {
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

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      props.history.push({ pathname: "/survivor-pc", state: survivorId });
    }
  };

  const gotoSurvivorLoan = () => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "loan" && item
      );
    } 

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      props.history.push({ pathname: "/survivor-loan", state: survivorId });
    }
  };

  const gotoSurvivorIncome = () => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "income" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      props.history.push({ pathname: "/survivor-income", state: survivorId });
    }
  };

  const gotoSurvivorGrant = () => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "grant" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      props.history.push({ pathname: "/survivor-grant", state: survivorId });
    }
  };

  const gotoSurvivorCIT = () => {
    let obj = {};
    let arrdata = [];
    if (userAccessData && userAccessData.length > 0) {
      arrdata = userAccessData.filter(
        (item) => item.module.name.toLowerCase() === "cit" && item
      );
    }

    obj = arrdata[0];
    //console.log(obj, "objobj");
    localStorage.setItem("currentModule", JSON.stringify(obj));

    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else if (editData && editData.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
      editData &&
      editData.status_in_tafteesh &&
      editData.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else {
      props.history.push({ pathname: "/survivor-cit", state: survivorId });
    }
  };

  const gotoDetails = (e) => {
    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else {
      gotoSurvivorDetails(e, survivorId, history);
      // props.history.push({ pathname: "/profile-details", state: survivorId });
    }
  };

  const gotoEdit = (e) => {
    if (!survivorId || survivorId === "") {
      setAlertFlag("alert");
      setAlertMessage("Please select one survivor");
      handleShow();
    } else {
      goToEditSurvivor(e, survivorId, history);
      // props.history.push({ pathname: "/add-survivor", state: survivorId });
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
      "Survivor Id,Survivor Name,Gender,Marital Status,Phone Number,Alternate Contact No,Date of Birth,No of Family Member,No of Children,Notes for Status_Change,Panchayat Name,Status in Tafteesh,Village Name, Address Line1, Pincode,Age Now,Age When Trafficked,Picture,Consent Form,Date of Trafficking,CreatedAt ,UpdatedAt",
    ];

    // Convert users data to a csv
    let usersCsv = survivorList.reduce((acc, user) => {
      const {
        survivor_id,
        survivor_name,
        gender,
        marital_status,
        phone_no,
        alternate_contact_No,
        date_of_birth,
        no_of_family_member,
        no_of_children,
        notes_for_status_change,
        panchayat_name,
        status_in_tafteesh,
        village_name,
        address_Line1,
        pincode,
        age_now,
        age_when_trafficked,
        picture,
        consent_form,
        date_of_trafficking,
        createdAt,
        updatedAt,
      } = user;
      acc.push(
        [
          survivor_id,
          survivor_name,
          gender,
          marital_status,
          phone_no,
          alternate_contact_No,
          moment(date_of_birth).format("DD-MMM-YYYY"),
          no_of_family_member,
          no_of_children,
          notes_for_status_change,
          panchayat_name,
          status_in_tafteesh,
          village_name,
          address_Line1,
          pincode,
          age_now,
          age_when_trafficked,
          picture[picture.length-1],
          consent_form,
          moment(date_of_trafficking).format("DD-MMM-YYYY"),
          moment(createdAt).format("DD-MMM-YYYY"),
          moment(updatedAt).format("DD-MMM-YYYY"),
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "survivors.csv",
      fileType: "text/csv",
    });
  };

  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("SURVIVOR DETAILS", 22, 10);

    const survivorColumns = [
      "Survivor Id",
      "Survivor Name",
      "Gender",
      "Marital Status",
      "Phone No",
      //'Alternate Contact No',
      "Date of Birth",
      //'Number of Family Member',
      //'Number of Children',
      //'Notes for Status Change',
      //'Panchayat Name',
      //'Status in Tafteesh',
      "Village Name",
      "Address Line1",
      //'Pincode',
      //'Age Now',
      //'Age When Trafficked',
      //'Picture',
      //'Consent Form',
      //'Date of Trafficking',
      "CreatedAt",
      //'UpdatedAt',
    ];
    const name = "survivor-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    survivorList?.forEach((item) => {
      const temp = [
        item.survivor_id,
        item.survivor_name,
        item.gender,
        item.marital_status,
        item.phone_no,
        //item.alternate_contact_No,
        moment(item.date_of_birth).format("DD-MMM-YYYY"),
        //item.no_of_family_member,
        //item.no_of_children,
        //item.notes_for_status_change,
        //item.panchayat_name,
        //item.status_in_tafteesh,
        item.village_name,
        item.address_Line1,
        //item.pincode,
        //item.age_now,
        //item.age_when_trafficked,
        //item.picture,
        //item.consent_form,
        //moment(item.date_of_trafficking).format('DD-MMM-YYYY'),
        moment(item.createdAt).format("DD-MMM-YYYY"),
        //moment(item.updatedAt).format('DD-MMM-YYYY'),
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
        />
        <div className="bodyright">
          <div className="row justify-content-between mb-4">
            <div className="col-auto">
              <h2 className="page_title">Survivors</h2>
            </div>
            <div className="col-auto">
              <div className="body_right_btn d-flex">
                <div className="body_right_btn_download pe-2">
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      className="shadow-0"
                      id="download-dropdown"
                    >
                      Download List
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => downloadPdf()}>
                        PDF
                      </Dropdown.Item>
                      <Dropdown.Item onClick={exportToCsv}>CSV</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="body_right_btn_action pe-2">
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      // onClick={()=>showAlertFunc()}
                      className="shadow-0"
                      id="acton-dropdown"
                    >
                      Action
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {userAccessData &&
                        userAccessData.length > 0 &&
                        userAccessData.map((item) => {
                          return (
                            item.module &&
                            item.module.name.toLowerCase() == "documents" &&
                            item.can_view == true && (
                              <Dropdown.Item onClick={(e) => gotoDocument(e)}>
                                Documents
                              </Dropdown.Item>
                            )
                          );
                        })}
                      {userAccessData &&
                        userAccessData.length > 0 &&
                        userAccessData.map((item) => {
                          return (
                            item.module &&
                            item.module.name.toLowerCase() == "rescue" &&
                            item.can_view == true && (
                              <Dropdown.Item onClick={(e) => gotRescue(e)}>
                                Rescue
                              </Dropdown.Item>
                            )
                          );
                        })}
                      {userAccessData &&
                        userAccessData.length > 0 &&
                        userAccessData.map((item) => {
                          return (
                            item.module &&
                            item.module.name.toLowerCase() == "fir" &&
                            item.can_view == true && (
                              <Dropdown.Item onClick={(e) => goToFir(e)}>
                                FIR
                              </Dropdown.Item>
                            )
                          );
                        })}
                      {userAccessData &&
                        userAccessData.length > 0 &&
                        userAccessData.map((item) => {
                          return (
                            item.module &&
                            item.module.name.toLowerCase() == "investigation" &&
                            item.can_view == true && (
                              <Dropdown.Item
                                onClick={(e) => gotoInvestigation(e)}
                              >
                                Investigation
                              </Dropdown.Item>
                            )
                          );
                        })}
                      {userAccessData &&
                        userAccessData.length > 0 &&
                        userAccessData.map((item) => {
                          return (
                            item.module &&
                            item.module.name.toLowerCase() == "lawyer" &&
                            item.can_view == true && (
                              <Dropdown.Item onClick={(e) => gotoLawyerPage(e)}>
                                Lawyer
                              </Dropdown.Item>
                            )
                          );
                        })}
                      {userAccessData &&
                        userAccessData.length > 0 &&
                        userAccessData.map((item) => {
                          return (
                            item.module &&
                            item.module.name.toLowerCase() == "trafficker" &&
                            item.can_view == true && (
                              <Dropdown.Item
                                onClick={(e) => gotoTraffickerPage(e)}
                              >
                                Trafficker
                              </Dropdown.Item>
                            )
                          );
                        })}
                      {/* <Dropdown.Item onClick={(e) => gotoParticipationPage(e)}>
                        Participation
                      </Dropdown.Item> */}
                      {userAccessData &&
                        userAccessData.length > 0 &&
                        userAccessData.map((item) => {
                          return (
                            item.module &&
                            item.module.name.toLowerCase() == "chargesheet" &&
                            item.can_view == true && (
                              <Dropdown.Item onClick={(e) => gotChargeSheet(e)}>
                                Chargesheet
                              </Dropdown.Item>
                            )
                          );
                        })}
                      {userAccessData &&
                        userAccessData.length > 0 &&
                        userAccessData.map((item) => {
                          return (
                            item.module &&
                            item.module.name.toLowerCase() == "vc" &&
                            item.can_view == true && (
                              <Dropdown.Item onClick={(e) => gotVc(e)}>
                                VC
                              </Dropdown.Item>
                            )
                          );
                        })}
                      {userAccessData &&
                        userAccessData.length > 0 &&
                        userAccessData.map((item) => {
                          return (
                            item.module &&
                            item.module.name.toLowerCase() == "pc" &&
                            item.can_view == true && (
                              <Dropdown.Item onClick={(e) => gotoPc(e)}>
                                PC
                              </Dropdown.Item>
                            )
                          );
                        })}
                      {userAccessData &&
                        userAccessData.length > 0 &&
                        userAccessData.map((item) => {
                          return (
                            item.module &&
                            item.module.name.toLowerCase() == "shelter home" &&
                            item.can_view == true && (
                              <Dropdown.Item
                                onClick={(e) => gotoShelterHome(e)}
                              >
                                Shelter Home
                              </Dropdown.Item>
                            )
                          );
                        })}
                      {/* <Dropdown.Item onClick={(e) => gotoNextPaln(e)}>
                        Next Plan/Action
                      </Dropdown.Item> */}
                      <DropdownButton
                        id="FinancialInclusionDropdown"
                        className="FinancialInclusionDropdown shadow-0"
                        title="Financial Inclusion"
                      >
                        {userAccessData &&
                          userAccessData.length > 0 &&
                          userAccessData.map((item) => {
                            return (
                              item.module &&
                              item.module.name.toLowerCase() == "loan" &&
                              item.can_view == true && (
                                <Dropdown.Item
                                  onClick={(e) => gotoSurvivorLoan(e)}
                                >
                                  Loan
                                </Dropdown.Item>
                              )
                            );
                          })}

                        {userAccessData &&
                          userAccessData.length > 0 &&
                          userAccessData.map((item) => {
                            return (
                              item.module.name.toLowerCase() == "income" &&
                              item.can_view == true && (
                                <Dropdown.Item
                                  onClick={(e) => gotoSurvivorIncome(e)}
                                >
                                  Income
                                </Dropdown.Item>
                              )
                            );
                          })}
                        {userAccessData &&
                          userAccessData.length > 0 &&
                          userAccessData.map((item) => {
                            return (
                              item.module.name.toLowerCase() == "grant" &&
                              item.can_view == true && (
                                <Dropdown.Item
                                  onClick={(e) => gotoSurvivorGrant(e)}
                                >
                                  Grant
                                </Dropdown.Item>
                              )
                            );
                          })}
                      </DropdownButton>
                      {/* )) ); })} */}
                      {userAccessData &&
                        userAccessData.length > 0 &&
                        userAccessData.map((item) => {
                          return (
                            item.module &&
                            item.module.name.toLowerCase() == "cit" &&
                            item.can_view == true && (
                              <Dropdown.Item
                                onClick={(e) => gotoSurvivorCIT(e)}
                              >
                                CIT
                              </Dropdown.Item>
                            )
                          );
                        })}
                          <Dropdown.Item onClick={(e) => changeLogFunc(e)}>
                        Change Log
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => gotoArchiveList(e)}>
                        Archive List
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                {userAccessData &&
                  userAccessData.length > 0 &&
                  userAccessData.map((item) => {
                    return (
                      item.module &&
                      item.module.name.toLowerCase() == "survivor profile" &&
                      item.can_edit == true && (
                        <div className="body_right_btn_action">
                          <Link
                            // to="/add-survivor"

                            onClick={(e) => goToAdd(e, history)}
                            className="btn addbtn shadow-0"
                          >
                            Add Survivor
                            <img src={addIcon} alt="" />
                          </Link>
                        </div>
                      )
                    );
                  })}
              </div>
            </div>
          </div>
          {/* <div className="row align-items-center multiselectBox_searchBox_wrap"> */}
          {/* <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <MultiSelect
                options={options}
                value={selected}
                hasSelectAll={false}
                disableSearch={true}
                onChange={setSelected}
                labelledBy={"Select"}
                className={"survivorMultiselect-box"}
                overrideStrings={{
                  selectSomeItems: "Select columns to view",
                  allItemsAreSelected: "All Items are Selected",
                  selectAll: "Select All",
                  search: "Search",
                }}
              />
            </div> */}
          {/* <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <div className="search_box">
                <input
                  className="search_box_input form-control"
                  name="searchText"
                  onChange={(e) =>
                    setSearchData({ [e.target.name]: e.target.value })
                  }
                  type="text"
                  placeholder="Search"
                />
              </div>
            </div> */}
          {/* </div> */}
          {/* <div className="white_box_shadow_20 survivors_table_wrap position-relative"> */}
          <div className="white_box_shadow_20 vieweditdeleteMargin position-relative">
            <div className="vieweditdelete">
              {userAccessData &&
                userAccessData.length > 0 &&
                userAccessData.map((item) => {
                  return (
                    item.module &&
                    item.module.name.toLowerCase() == "survivor profile" &&
                    item.can_view == true && (
                      <MDBTooltip
                        tag="a"
                        // onClick={()=> gotoDetails()}
                        wrapperProps={{
                          // to: {pathname:'/profile-details',state:survivorId},
                          className: "view_btn",
                        }}
                        title="View"
                      >
                        <span onClick={(e) => gotoDetails(e)}>
                          <i className="fal fa-eye"></i>
                        </span>
                      </MDBTooltip>
                    )
                  );
                })}{" "}
              {userAccessData &&
                userAccessData.length > 0 &&
                userAccessData.map((item) => {
                  return (
                    item.module &&
                    item.module.name.toLowerCase() == "survivor profile" &&
                    item.can_edit == true && (
                      <MDBTooltip
                        tag="a"
                        wrapperProps={{
                          // to: {pathname:'/add-survivor', state: survivorId},
                          className: "edit_btn",
                        }}
                        title="Edit"
                      >
                        {/* <i className="fal fa-pencil"></i> */}
                        <span onClick={(e) => gotoEdit(e)}>
                          <i className="fal fa-pencil"></i>
                        </span>
                      </MDBTooltip>
                    )
                  );
                })}
              {userAccessData &&
                userAccessData.length > 0 &&
                userAccessData.map((item) => {
                  return (
                    item.module &&
                    item.module.name.toLowerCase() == "survivor profile" &&
                    item.can_delete == true && (
                      <MDBTooltip
                        tag={"a"}
                        wrapperProps={{ className: "delete_btn" }}
                        title="Delete"
                      >
                        <span onClick={() => onDeleteChangeFunc()}>
                          <i className="fal fa-trash-alt"></i>
                        </span>
                      </MDBTooltip>
                    )
                  );
                })}
            </div>
            {/* <div className="table-responsive big-mobile-responsive"> */}
            {userAccessData &&
              userAccessData.length > 0 &&
              userAccessData.map((item) => {
                return (
                  item.module &&
                  item.module.name.toLowerCase() == "survivor profile" &&
                  item.can_view == true && (
                    <DataTableFilter
                      editData={editData}
                      isLoading={isLoading}
                      survivorList={survivorList}
                      onSelectRow={onSelectRow}
                    />
                  )
                );
              })}
          </div>
        </div>
      </main>
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

export default Survivors;
