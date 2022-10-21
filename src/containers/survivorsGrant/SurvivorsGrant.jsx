import React, { useState, useEffect } from "react";
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
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { MDBAccordion, MDBAccordionItem } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import queryString from "query-string";

import { NavLink, useHistory } from "react-router-dom";
import {
  getSurvivorDetails,
  getGrantList,
  // getCourtList,
  // getMortgageList,
  getSurvivaLGrantList,
  getModulesChangeLog,
  getGrantStatusList,
  // getGrantList
} from "../../redux/action";

import "./survivorsgrant.css";
import moment from "moment";
import GrantDataTable from "./GrantDataTable";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";
import { gotoSurvivorArchive } from "../../utils/helper";

const SurvivorsGrant = (props) => {
  const [modalGrantShow, setModalGrantShow] = useState(false);
  const [modalUtilizationShow, setModalUtilizationShow] = useState(false);
  const [modalInstallmentShow, setModalInstallmentShow] = useState(false);
  const [modalEscalationShow, setModalEscalationShow] = useState(false);
  const [addGrantData, setAddGrantData] = useState({});
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const grantList = useSelector((state) => state.grantList);
  const survivalGrantList = useSelector((state) => state.survivalGrantList);
  const grantStatusList = useSelector((state) => state.grantStatusList);

  const [addUtilizationData, setAddUtilizationData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [selectFile, setSelectFile] = useState("");
  const [addInstallmentData, setAddInstallmentData] = useState({});
  const [addEscalationData, setAddEscalationData] = useState({});
  const [addEscalationArr, setaddEscalationArr] = useState([]);
  const [addUtilizationArr, setAddUtilizationArr] = useState([]);
  const [addInstArr, setAddInstArr] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [erorMessage, setErorMessage] = useState("");

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const [validated, setValidated] = useState(false);
  const [validatedUtil, setValidatedUtil] = useState(false);
  const [validatedescal, setValidatedescal] = useState(false);
  const [validatedInstl, setValidatedInstl] = useState(false);
  const [alertFlag, setAlertFlag] = useState("");
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [customError, setCustomError] = useState({ name: "", message: "" });
  const [messagType, setMessagType] = useState("");

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
  const [activeClass, setActiveClass] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const currentModule = localStorage.getItem("currentModule");
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));

  useEffect(() => {
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
  }, [props]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [survivalGrantList]);

  const changeLogFunc = () => {
    let type = "grant";
    dispatch(getModulesChangeLog(type, deletedById, props.location.state));
    props.history.push("/change-log");
  };

  useEffect(() => {
    if (props.location.state) {
      dispatch(getSurvivorDetails(props.location.state));
      dispatch(getSurvivaLGrantList(props.location.state));
    }
    dispatch(getGrantList());
    // dispatch(getCourtList());
    // dispatch(getMortgageList());
    dispatch(getGrantStatusList());
  }, [props]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValidated(false);
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

  const onGrnameSelect = (e) => {
   
    let defaultGrantValue = grantList &&
    grantList.length > 0 &&
    grantList.filter(n => n._id == e.target.value && n)
    getGrantPurposeByGrant(e.target.value);
// setAutoFieldValueByGrantname(defaultGrantValue)
    // console.log(defaultGrantValue,"defaultGrantValue")
    setAddGrantData({
      ...addGrantData,
      approved_amount: defaultGrantValue[0].amount,
      installment_number: defaultGrantValue[0].installment_number, 
      [e.target.name]: e.target.value,
    });
  };

  const [purposeList, setPurposeList] = useState([]);
  ///////// api call for get purpose of grant ///
  const getGrantPurposeByGrant = (id) => {
    axios
      .get(api + "/purpose-of-grant/list/" + id, axiosConfig)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;
          setPurposeList(data.data);
        }
      })
      .catch((error) => {});
  };

  const getGrantdetails = (id) => {
    axios
      .get(api + "/survival-grant/detail/" + id, axiosConfig)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;
          setShowAlert(false);
          setModalUtilizationShow(false);
          setModalInstallmentShow(false);
          setModalEscalationShow(false);
          setSelectedData(data.data);
        }
      })
      .catch((error) => {});
  };

  const gotoAddGrant = () => {
    setSelectedData({});
    setAddGrantData({});
    setModalGrantShow(true);
    setSelectedProduct5(null);
  };
  const ongotoEditGrant = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Grant !!");
      setAlertFlag("alert");
    } else {
      setModalGrantShow(true);
      setAddGrantData(selectedData);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
    setUtilisationDelete('')
    setInstalDelete('')
    setEscalDelete('');
    setDeleteFlag('');
    
  }


  const [utilisationDelete, setUtilisationDelete] = useState("");
  const [instalDelete, setInstalDelete] = useState("");
  const [escalDelete, setEscalDelete] = useState("");

  const [deleteFlag, setDeleteFlag] = useState("");

  const onSelectVcEscal = (id, flag) => {

    if (flag == "util") {
      setUtilisationDelete(id);
    } else if (flag == "instal") {
      setInstalDelete(id);
    } else if (flag == "escal") {
      setEscalDelete(id);
    }
  };

const onDeleteGrantEscal=(flag)=>{
  
  setDeleteFlag(flag);
  if(!escalDelete){
    setShowAlert(true);
    setAlertMessage("Please select one Escalation !!");
    setAlertFlag("alert");
  } else {
    setShowAlert(true);
    setAlertMessage("");
    setAlertFlag("");
  
  }
}
const onDeleteGrantIntsall=(flag)=>{
  setDeleteFlag(flag);
  if(!instalDelete){
    setShowAlert(true);
    setAlertMessage("Please select one Instalment !!");
    setAlertFlag("alert");
  } else {
    setShowAlert(true);
    setAlertMessage("");
    setAlertFlag("");
  
  }
}

const onDeleteGrantUtil=(flag)=>{
  setDeleteFlag(flag);
  if(!utilisationDelete){
    setShowAlert(true);
    setAlertMessage("Please select one Utilization !!");
    setAlertFlag("alert");
  } else {
    setShowAlert(true);
    setAlertMessage("");
    setAlertFlag("");
  
  }
}

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Income !!");
      setAlertFlag("alert");
      setDeleteFlag('')
    } else {
      setShowAlert(true);
      setAlertMessage("");
      setAlertFlag("");
    }
  };
  const [deleteLoader, setDeleteLoader] = useState(false);

  const onDeleteFunction = () => {

    let refId = deleteFlag =="installments" ? instalDelete : deleteFlag =="utilization_plans" ? utilisationDelete : deleteFlag =="escalations" && escalDelete
    if(deleteFlag !==''){

    let body = {
      type: deleteFlag,
      refId:  refId,
      userId: deletedById && deletedById,
      userType: "users",
    };
    setDeleteLoader(true);
    axios
      .patch(
        api + "/survival-grant/delete-escalation-installment-utilization/" + selectedData._id,
        body,
        axiosConfig
      )
      .then((response) => {
        setDeleteLoader(false);
       
        setShowAlert(false);
        if (response.data && response.data.error === false) {
          const { data } = response;
          handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("success")
          dispatch(getGrantdetails(selectedData._id));

          dispatch(getSurvivaLGrantList(props.location.state));
          setErorMessage("");
          setUtilisationDelete('');
          setDeleteFlag('');
          setInstalDelete('');
          setEscalDelete('');
          

        }
        else{
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("error")
        }
      })
      .catch((error) => {
        setDeleteLoader(false);

        ////console.log(error, "partner error");
      });

    }
    else{


    let body = {
      deleted_by: deletedById && deletedById,
      deleted_by_ref: "users",
    };
    setDeleteLoader(true);
    axios
      .patch(
        api + "/survival-grant/delete/" + selectedData._id,
        body,
        axiosConfig
      )
      .then((response) => {
        setDeleteLoader(false);

        if (response.data && response.data.error === false) {
          const { data } = response;

        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("success")
        dispatch(
          getSurvivaLGrantList(props.location && props.location.state)
        );
          setSelectedData({});
         
          setShowAlert(false);
          setErorMessage("");
        }else{

        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("error")
        }

      })
      .catch((error) => {
        setDeleteLoader(false);

        ////console.log(error, "partner error");
      });
    }
  };

  useEffect(() => {
    if (
      addGrantData &&
      addGrantData.name_of_grant_compensation &&
      addGrantData.name_of_grant_compensation._id
    ) {
      setAddGrantData({
        ...addGrantData,
        purpose_of_grant_id:
          addGrantData &&
          addGrantData.name_of_grant_compensation &&
          addGrantData.name_of_grant_compensation.purpose_of_grant_id,
      });
    } else {
      let purpose = grantList.filter(
        (x) => x._id === addGrantData.name_of_grant_compensation
      );
      setAddGrantData({
        ...addGrantData,
        purpose_of_grant_id:
          purpose.length > 0 ? purpose[0].purpose_of_grant_id : null,
      });

      //console.log(purpose, "purpose");
    }
  }, [addGrantData && addGrantData.name_of_grant_compensation]);

  //////////// for UTILIZATION /////START//////////
  const gotoAddUtilize = () => {
    if (selectedData && !selectedData._id) {
      // alert("Please select one Grant");
      setShowAlert(true);
      setAlertMessage("Please select one Grant !!");
      setAlertFlag("alert");
    } else {
      setModalUtilizationShow(true);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  /////////////////END///////////////////////////

  ///////// for INSTALLMENT////START///////////////

  const gotoAddInstallment = () => {
    //////// delete function call //////////
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Grant !!");
      setAlertFlag("alert");
    } else {
      setModalInstallmentShow(true);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
    if (
      selectedData &&
      selectedData.installments &&
      selectedData.installments.length > 0
    ) {
      setAddInstArr([...addInstArr, selectedData.installments]);
    }
  };

  useEffect(() => {
    //console.log(addInstallmentData, "addInstallmentData");
    if (addInstallmentData.estimated_date && addInstallmentData.amount) {
      setAddInstArr([...addInstArr, addInstallmentData]);
    }
  }, [addInstallmentData]);

  /////////////////END////////////////////////////////////////////////

  const gotoAddEscalation = () => {
    if (selectedData && !selectedData._id) {
      // alert("Please select one Grant");
      setShowAlert(true);
      setAlertMessage("Please select one Grant !!");
      setAlertFlag("alert");
    } else {
      setModalEscalationShow(true);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  //console.log(addGrantData, "addGrantData");

  /////////////////////file upload function/////////////////////////
  const onDocumentChange = (e, flag) => {
    let data = e.target.files[0];
    setSelectFile(e.target.files[0]);
    storeFile(data, flag);
  };

  const storeFile = (file, flag) => {
    //console.log(file, flag, "flaggg");
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
          if (flag === true) {
            setAddEscalationData({
              ...addEscalationData,
              reference_document:
                "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
            });
          } else {
            setAddGrantData({
              ...addGrantData,
              reference_document:
                "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
            });
          }
        }
        else{
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("error")
          if (flag === true) {
          setAddEscalationData({
            ...addEscalationData,
            reference_document:'',
          });
        }
        else{
          setAddGrantData({
            ...addGrantData,
            reference_document:'',
          });
        }
      }
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  const [resultFile, setResultFile] = useState("");
  const onResultDocumentChange = (e) => {
    //console.log(e, e.target.files[0]);
    let data = e.target.files[0];
    setResultFile(e.target.files[0]);
    storeResultFile(data);
  };
  const storeResultFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        "https://tafteesh-staging-node.herokuapp.com/api/file/upload",
        formData,
        axiosConfig
      )
      .then(function (response) {
        //console.log("successfully uploaded", response);
        if (response && response.data.error === false) {
          const { data } = response;

          setAddGrantData({
            ...addGrantData,
            reference_result_document:
              "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
          });
        }else{
        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("error")
        setAddGrantData({
          ...addGrantData,
          reference_result_document:""
        });
      }
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  useEffect(() => {
    if (addGrantData && addGrantData.name_of_grant_compensation) {
      setCustomError({
        name: "name_of_grant_compensation",
        message: "",
      });
    } else if (addGrantData && addGrantData.applied_on) {
      setCustomError({
        name: "applied_on",
        message: "",
      });
      // setAppliedDateErr(false)
    } else if (addGrantData && addGrantData.application_number) {
      setCustomError({
        name: "application_number",
        message: "",
      });
    } else if (addGrantData && addGrantData.amount_requested) {
      setCustomError({
        name: "amount_requested",
        message: "",
      });
    } else if (addGrantData && addGrantData.reference_document) {
      setCustomError({
        name: "reference_document",
        message: "",
      });
    } else if (addGrantData && addGrantData.reason_for_escalation) {
      setCustomError({
        name: "reason_for_escalation",
        message: "",
      });
    } else {
      setCustomError({ name: "", message: "" });
    }
  }, [addGrantData]);

  const addGrantFunc = (e) => {
    e.preventDefault();
    if (addGrantData && !addGrantData.name_of_grant_compensation) {
      setCustomError({
        name: "name_of_grant_compensation",
        message: "Please Select Name of Grant",
      });
    } else if (addGrantData && !addGrantData.applied_on) {
      setCustomError({
        name: "applied_on",
        message: "Please select Applied date",
      });
      // setAppliedDateErr(true)
    } else if (addGrantData && !addGrantData.application_number) {
      setCustomError({
        name: "application_number",
        message: "Please select Application Number",
      });
    } else if (addGrantData && !addGrantData.amount_requested) {
      setCustomError({
        name: "amount_requested",
        message: "Please select Amount Requested",
      });
    } else if (addGrantData && !addGrantData.reference_document) {
      setCustomError({
        name: "reference_document",
        message: "Please select Reference Document",
      });
    } else if (addGrantData && !addGrantData.reason_for_escalation) {
      setCustomError({
        name: "reason_for_escalation",
        message: "Please enter Reason for Escalation",
      });
    } else {
      var addData = {
        ...addGrantData,
        survivor: props.location && props.location.state,
      };
      var updateData = {
        ...addGrantData,
        survivor: props.location && props.location.state,
        user_id: deletedById && deletedById,
      };

      if (selectedData && selectedData._id) {
        setButtonLoader(true);
        axios
          .patch(
            api + "/survival-grant/update/" + selectedData._id,
            updateData,
            axiosConfig
          )
          .then((response) => {
            //console.log(response);
            setValidated(false);

            setButtonLoader(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
            setMessagType("success")
              dispatch(getSurvivaLGrantList(props.location.state));
              setAddInstallmentData({});
              setAddUtilizationData({});
              setAddGrantData({});
              // setSelectedData({});
              setAddEscalationData({});
              setModalGrantShow(false);
              setModalUtilizationShow(false);
              setModalInstallmentShow(false);
              setModalEscalationShow(false);
            }else{
              handleClick();
              setUpdateMessage(response && response.data.message);
            setMessagType("error")
            }
          })
          .catch((error) => {
            setButtonLoader(false);
            //console.log(error, "fir add error");
          });
      } else {
        setButtonLoader(true);
        axios
          .post(api + "/survival-grant/create", addData, axiosConfig)
          .then((response) => {
            //console.log(response);
           
          setValidated(false);

            setButtonLoader(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              handleClick();
              setUpdateMessage(response && response.data.message);
            setMessagType("success")
              setAddGrantData({});
              dispatch(getSurvivaLGrantList(props.location.state));
              setModalGrantShow(false);
            }else{
              handleClick();
              setUpdateMessage(response && response.data.message);
            setMessagType("error")
            }
          })
          .catch((error) => {
            setButtonLoader(false);
            //console.log(error, "grant add error");
          });
      }
    }
  };

  const onUtilCancel = () => {
    setAddUtilizationData({});
    setModalUtilizationShow(false);
    setValidatedUtil(false);
  };

  const onInstalCancel = () => {
    setAddInstallmentData({});
    setModalInstallmentShow(false);
    setValidatedInstl(false);
  };

  const onEscalCancel = () => {
    setAddEscalationData({});
    setModalEscalationShow(false);
    setValidatedescal(false);
  };

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  const [installLoad, setInstallLoad] = useState(false);
  ////// API CALL FOR ADD INSTALMET FUNCTION ///////

  useEffect(() => {
    if (addInstallmentData && addInstallmentData.estimated_date) {
      setCustomError({
        name: "estimated_date",
        message: "",
      });
    }
    if (addInstallmentData && addInstallmentData.amount) {
      setCustomError({
        name: "amount",
        message: "",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
    }
  }, [addInstallmentData]);

  const addGrantInstFunc = (e) => {
    e.preventDefault();
    if (addInstallmentData && !addInstallmentData.estimated_date) {
      setCustomError({
        name: "estimated_date",
        message: "Please enter Estimated date",
      });
    } else if (addInstallmentData && !addInstallmentData.amount) {
      setCustomError({
        name: "amount",
        message: "Please enter Amount",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });

      let addData = {};

      addData = {
        installment: [addInstallmentData],
        survivor: props.location && props.location.state,
      };

      //console.log(addData, "addData");
      setInstallLoad(true);
      axios
        .patch(
          api +
            "/survival-grant/add-escalation-installment-utilization/" +
            selectedData._id,
          addData,
          axiosConfig
        )
        .then((response) => {
          //console.log(response);
         
          setValidatedUtil(false);
          setValidatedInstl(false);
          setValidatedescal(false);
          setInstallLoad(false);

          if (response.data && response.data.error === false) {
            const { data } = response;
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("success")
            dispatch(getGrantdetails(selectedData._id));

            dispatch(getSurvivaLGrantList(props.location.state));
            setAddInstallmentData({});
            setAddUtilizationData({});
            setAddGrantData({});
            // setSelectedData({});
            setAddEscalationData({});
            setModalGrantShow(false);
            setModalUtilizationShow(false);
            setModalInstallmentShow(false);
            setModalEscalationShow(false);
          }else{
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("error")
  
          }
        })
        .catch((error) => {
          //console.log(error, "fir add error");
          setInstallLoad(false);
        });
    }
  };

  useEffect(() => {
    if (addUtilizationData && addUtilizationData.amount) {
      setCustomError({
        name: "amount",
        message: "",
      });
    } else if (addUtilizationData && addUtilizationData.description) {
      setCustomError({
        name: "description",
        message: "",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
    }
  }, [addUtilizationData]);

  /////////// for util /////////////
  const addGrantUtilFunc = (e) => {
    e.preventDefault();

    if (addUtilizationData && !addUtilizationData.description) {
      setCustomError({
        name: "description",
        message: "Please enter Description",
      });
    } else if (addUtilizationData && !addUtilizationData.amount) {
      setCustomError({
        name: "amount",
        message: "Please enter Amount",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });

      let addData = {};

      addData = {
        utilization: [addUtilizationData],
        survivor: props.location && props.location.state,
      };

      //console.log(addData, "addData");
      setInstallLoad(true);
      axios
        .patch(
          api +
            "/survival-grant/add-escalation-installment-utilization/" +
            selectedData._id,
          addData,
          axiosConfig
        )
        .then((response) => {
          //console.log(response);
         
          setValidatedUtil(false);
          setValidatedInstl(false);
          setValidatedescal(false);
          setInstallLoad(false);

          if (response.data && response.data.error === false) {
            const { data } = response;
            handleClick();
            setMessagType("success")
            setUpdateMessage(response && response.data.message);
            dispatch(getSurvivaLGrantList(props.location.state));
            dispatch(getGrantdetails(selectedData._id));
            setAddInstallmentData({});
            setAddUtilizationData({});
            setAddGrantData({});
            // setSelectedData({});
            setAddEscalationData({});
            setModalGrantShow(false);
            setModalUtilizationShow(false);
            setModalInstallmentShow(false);
            setModalEscalationShow(false);
          }else{
            handleClick();
            setMessagType("error")
            setUpdateMessage(response && response.data.message);
          }
        })
        .catch((error) => {
          //console.log(error, "fir add error");
          setInstallLoad(false);
        });
    }
  };

  useEffect(() => {
    if (addEscalationData && addEscalationData.application_number) {
      setCustomError({
        name: "application_number",
        message: "",
      });
    } else if (addEscalationData && addEscalationData.amount_requested) {
      setCustomError({
        name: "amount_requested",
        message: "",
      });
    } else if (addEscalationData && addEscalationData.reference_document) {
      setCustomError({
        name: "reference_document",
        message: "",
      });
    } else if (addEscalationData && addEscalationData.reason_for_escalation) {
      setCustomError({
        name: "reason_for_escalation",
        message: "",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
    }
  }, [addEscalationData]);

  const addGrantEscalFunc = (e) => {
    e.preventDefault();

    if (addEscalationData && !addEscalationData.application_number) {
      setCustomError({
        name: "application_number",
        message: "Please enter Application number",
      });
    } else if (addEscalationData && !addEscalationData.amount_requested) {
      setCustomError({
        name: "amount_requested",
        message: "Please enter Requested Amount",
      });
    } else if (addEscalationData && !addEscalationData.reference_document) {
      setCustomError({
        name: "reference_document",
        message: "Please enter Reference Document",
      });
    } else if (addEscalationData && !addEscalationData.reason_for_escalation) {
      setCustomError({
        name: "reason_for_escalation",
        message: "Please enter Reason for escalation",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
      let addData = {};

      addData = {
        escalation: [addEscalationData],
        survivor: props.location && props.location.state,
      };

      //console.log(addData, "addData");
      setInstallLoad(true);
      axios
        .patch(
          api +
            "/survival-grant/add-escalation-installment-utilization/" +
            selectedData._id,
          addData,
          axiosConfig
        )
        .then((response) => {
          //console.log(response);
          setValidatedUtil(false);
          setValidatedInstl(false);
          setValidatedescal(false);
          setInstallLoad(false);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success")
          if (response.data && response.data.error === false) {
            const { data } = response;
           
            dispatch(getSurvivaLGrantList(props.location.state));
            dispatch(getGrantdetails(selectedData._id));
            setAddInstallmentData({});
            setAddUtilizationData({});
            setAddGrantData({});
            // setSelectedData({});
            setAddEscalationData({});
            setModalGrantShow(false);
            setModalUtilizationShow(false);
            setModalInstallmentShow(false);
            setModalEscalationShow(false);
          }
          // else{
          //   handleClick();
          //   setUpdateMessage(response && response.data.message);
          //   setMessagType("success")
          // }
        })
        .catch((error) => {
          //console.log(error, "fir add error");
          setInstallLoad(false);
        });
    }
  };

  const grandAppliedDateHandel = (e) => {
    setAddGrantData({
      ...addGrantData,
      [e.target.name]: e.target.value,
    });
  };

  const grandreceivedDateHandel = (e) => {
    setAddGrantData({
      ...addGrantData,
      [e.target.name]: e.target.value,
    });
  };

  const estimatedDateChangeHandel = (e) => {
    setAddInstallmentData({
      ...addInstallmentData,
      [e.target.name]: e.target.value,
    });
  };

  const escalaOnDateChangeHandel = (e) => {
    setAddEscalationData({
      ...addEscalationData,
      [e.target.name]: e.target.value,
    });
  };
  let url = props.location.search;
  let getId = queryString.parse(url, { parseNumbers: true });

  //console.log(getId, "getId");
  const history = useHistory();

  const gotoArchiveList = (e) => {
    //console.log(props.location.state, "props.location.state");
    gotoSurvivorArchive(e, "grant", props.location.state, history);
  };
  const escalaRecivedOnDate = (e) => {
    setAddEscalationData({
      ...addEscalationData,
      [e.target.name]: e.target.value,
    });
  };
  //console.log(survivalGrantList, "granttttttttttttt");
  const formatDate = (value) => {
    return moment(value).format("DD-MMM-YYYY");
  };
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

  //console.log(survivalGrantList,"survivalGrantList")
  let exportData = [];
  survivalGrantList &&
    survivalGrantList.length > 0 &&
    survivalGrantList.map((x) => {
      exportData.push({
        amountRequested: x.amount_requested && x.amount_requested,
        applicationNumber: x.application_number,
        appliedOn: formatDate(x.applied_on),
        approvedAmount: x && x.approved_amount,
        createdAt: formatDate(x.createdAt),
        installment_number: x.installment_number,
        reason_for_escalation: x.reason_for_escalation,
        received_on: formatDate(x.received_on),
        refDoc: x.reference_document,
        refResultDoc: x.reference_result_document,
        status: x.status,
        grantCompensationAmount:
          x.name_of_grant_compensation && x.name_of_grant_compensation.amount,
        grantCompensationName:
          x.name_of_grant_compensation && x.name_of_grant_compensation.name,
        purposeOfGrant: x.purpose_of_grant_id && x.purpose_of_grant_id.name,
        grantCompensationInstallment:
          x.name_of_grant_compensation &&
          x.name_of_grant_compensation.installment_number,
        escalation: x.escalation,
        receivedAmtsofar: x.received_amount_so_far,
        survivor: survivorDetails && survivorDetails.survivor_name,
        createdAt: formatDate(x.createdAt),
      });
    });
  let exportutilData = [];
  selectedData &&
    selectedData.utilization_plans &&
    selectedData.utilization_plans.length > 0 &&
    selectedData.utilization_plans.map((x) => {
      exportutilData.push({
        amountRequested:
          selectedData.amount_requested && selectedData.amount_requested,
        applicationNumber:
          selectedData.application_number && selectedData.application_number,
        appliedOn: selectedData && formatDate(selectedData.applied_on),
        approvedAmount: selectedData && selectedData.approved_amount,
        utilizationPlanAmount: x.amount && x.amount,
        utilizationPlanDesc: x.description && x.description,
        survivor: survivorDetails && survivorDetails.survivor_name,
        status: selectedData.status,
        createdAt: formatDate(selectedData.createdAt),
      });
    });
  let exportinstallData = [];
  selectedData &&
    selectedData.installments &&
    selectedData.installments.length > 0 &&
    selectedData.installments.map((x) => {
      exportinstallData.push({
        amountRequested:
          selectedData.amount_requested && selectedData.amount_requested,
        applicationNumber:
          selectedData.application_number && selectedData.application_number,
        appliedOn: selectedData && formatDate(selectedData.applied_on),
        approvedAmount: selectedData && selectedData.approved_amount,
        installMentAmount: x.amount && x.amount,
        installMentDate: x.estimated_date && formatDate(x.estimated_date),
        installment: x.installment && x.installment,
        survivor: survivorDetails && survivorDetails.survivor_name,
        status: selectedData.status,
        createdAt: formatDate(selectedData.createdAt),
      });
    });

  let exportescalData = [];
  selectedData &&
    selectedData.escalations &&
    selectedData.escalations.length > 0 &&
    selectedData.escalations.map((x) => {
      exportescalData.push({
        applicationNumber: x.application_number && x.application_number,
        survivor: survivorDetails && survivorDetails.survivor_name,
        appliedOn: selectedData && formatDate(selectedData.applied_on),
        escalationAmountRequested: x.amount_requested && x.amount_requested,
        escalatedOn: x.escalated_on && formatDate(x.escalated_on),
        escalatedTo: x.escalated_to && x.escalated_to,
        escalationAmountreceived: x.received_on && formatDate(x.received_on),
        escalation: x.escalation && x.escalation,
        reasonforescalation: x.reason_for_escalation && x.reason_for_escalation,
        status: x.status,
        createdAt: formatDate(selectedData.createdAt),
      });
    });

  const exportToCsv = (e) => {
    e.preventDefault();

    // Headers for each column
    let headers = [
      "Amt Requested,Application No,Applied On,Amt Approved,Installment No,Name Of Grant Compensation,Purpose Of Grant,Grant Compensation Amt,Compensation Installment No,Reason For Escalation,Reference Doc,Reference Result Doc,Status,Survivor,Escalation,createdAt",
    ];

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const {
        amountRequested,
        applicationNumber,
        appliedOn,
        approvedAmount,
        installment_number,
        grantCompensationName,
        purposeOfGrant,
        grantCompensationAmount,
        grantCompensationInstallment,
        reason_for_escalation,
        refDoc,
        reference_result_document,
        status,
        survivor,
        escalation,
        createdAt,
      } = user;
      acc.push(
        [
          amountRequested,
          applicationNumber,
          appliedOn,
          approvedAmount,
          installment_number,
          grantCompensationName,
          purposeOfGrant,
          grantCompensationAmount,
          grantCompensationInstallment,
          reason_for_escalation,
          refDoc,
          reference_result_document,
          status,
          survivor,
          escalation,
          createdAt,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "grantList.csv",
      fileType: "text/csv",
    });
  };

  const exportutilToCsv = (e) => {
    e.preventDefault();
    if (selectedData && !selectedData._id) {
      // alert("Please select one Grant");
      setShowAlert(true);
      setAlertMessage("Please select one Grant !!");
      setAlertFlag("alert");
    } else {
      // Headers for each column
      let headers = [
        "Amt Rqstd,App No,Applied On,Amt Approved,Status,Srvr,Utilization Amount,Utilization Desc, createdAt",
      ];

      // Convert users data to a csv
      let usersCsv = exportutilData.reduce((acc, user) => {
        const {
          amountRequested,
          applicationNumber,
          appliedOn,
          approvedAmount,
          status,
          survivor,
          utilizationPlanAmount,
          utilizationPlanDesc,
          createdAt,
        } = user;
        acc.push(
          [
            amountRequested,
            applicationNumber,
            appliedOn,
            approvedAmount,
            status,
            survivor,
            utilizationPlanAmount,
            utilizationPlanDesc,
            createdAt,
          ].join(",")
        );
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...usersCsv].join("\n"),
        fileName: "grantUtilizationList.csv",
        fileType: "text/csv",
      });
    }
  };

  const exportInstlToCsv = (e) => {
    e.preventDefault();
    if (selectedData && !selectedData._id) {
      // alert("Please select one Grant");
      setShowAlert(true);
      setAlertMessage("Please select one Grant !!");
      setAlertFlag("alert");
    } else {
      // Headers for each column
      let headers = [
        "Amt Rqstd,App No,Applied On,Amt Approved,Status,Srvr,Insatllment Amount,Installment Date,Installment,createdAt",
      ];

      // Convert users data to a csv
      let usersCsv = exportinstallData.reduce((acc, user) => {
        const {
          amountRequested,
          applicationNumber,
          appliedOn,
          approvedAmount,
          status,
          survivor,
          installMentAmount,
          installMentDate,
          installment,
          createdAt,
        } = user;
        acc.push(
          [
            amountRequested,
            applicationNumber,
            appliedOn,
            approvedAmount,
            status,
            survivor,
            installMentAmount,
            installMentDate,
            installment,
            createdAt,
          ].join(",")
        );
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...usersCsv].join("\n"),
        fileName: "grantInstallmentList.csv",
        fileType: "text/csv",
      });
    }
  };

  const exportEscalToCsv = (e) => {
    e.preventDefault();
    if (selectedData && !selectedData._id) {
      // alert("Please select one Grant");
      setShowAlert(true);
      setAlertMessage("Please select one Grant !!");
      setAlertFlag("alert");
    } else {
      // Headers for each column
      let headers = [
        "App No,Escalation Amt Rqstd,Srvr,Applied On,Escalated On,Escalated To,Escalation Received On,Escalation,Reason for Escalation,Status,createdAt",
      ];

      // Convert users data to a csv
      let usersCsv = exportescalData.reduce((acc, user) => {
        const {
          applicationNumber,
          escalationAmountRequested,
          survivor,
          appliedOn,
          escalatedOn,
          escalatedTo,
          escalationAmountreceived,
          escalation,
          reasonforescalation,
          status,
          createdAt,
        } = user;
        acc.push(
          [
            applicationNumber,
            escalationAmountRequested,
            survivor,
            appliedOn,
            escalatedOn,
            escalatedTo,
            escalationAmountreceived,
            escalation,
            reasonforescalation,
            status,
            createdAt,
          ].join(",")
        );
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...usersCsv].join("\n"),
        fileName: "grantEscalationList.csv",
        fileType: "text/csv",
      });
    }
  };

  ////////////download Grant pdf////////////////
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
    doc.text("SURVIVOR GRANT LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "Amt Rqstd",
      "App No",
      "Applied On",
      "Amt Approved",
      "Name Of Grant Cmpnsn",
      "Purpose Of Grant",
      "Installment No",
      "Grant Cmpnsn Amt",
      "Cmpnsn Instllmnt No",
      "Rsn For Escalation",
      "Status",
      "Srvr",
      "Escalation",
      "createdAt",
    ];
    const name = "survivor-grant-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [
        item.amountRequested,
        item.applicationNumber,
        item.appliedOn,
        item.approvedAmount,
        item.grantCompensationName,
        item.purposeOfGrant,
        item.installment_number,
        item.grantCompensationAmount,
        item.grantCompensationInstallment,
        item.reason_for_escalation,
        item.status,
        item.survivor,
        item.escalation,
        item.createdAt,
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
    doc.save(name);
  };
  ////////////download Grant Util pdf////////////////
  const downloadUtilPdf = () => {
    if (selectedData && !selectedData._id) {
      // alert("Please select one Grant");
      setShowAlert(true);
      setAlertMessage("Please select one Grant !!");
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
      doc.text("SURVIVOR GRANT UTILIZATION LIST", 22, 60);
      doc.setFontSize(10);
      const survivorColumns = [
        "Amt Rqstd",
        "App No",
        "Applied On",
        "Amt Approved",
        "Status",
        "Srvr",
        "Utilization Amount",
        "Utilization Desc",
        "createdAt",
      ];
      const name =
        "survivor-grant-utilization-list" + new Date().toISOString() + ".pdf";
      let goalsRows = [];
      exportutilData?.forEach((item) => {
        const temp = [
          item.amountRequested,
          item.applicationNumber,
          item.appliedOn,
          item.approvedAmount,
          item.status,
          item.survivor,
          item.utilizationPlanAmount,
          item.utilizationPlanDesc,
          item.createdAt,
        ];
        goalsRows.push(temp);
      });
      doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
      doc.save(name);
    }
  };
  ////////////download Grant Installment pdf////////////////
  const downloadInstalPdf = () => {
    if (selectedData && !selectedData._id) {
      // alert("Please select one Grant");
      setShowAlert(true);
      setAlertMessage("Please select one Grant !!");
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
      doc.text("SURVIVOR GRANT INSTALLMENT LIST", 22, 60);
      doc.setFontSize(10);
      const survivorColumns = [
        "Amt Rqstd",
        "App No",
        "Applied On",
        "Amt Approved",
        "Status",
        "Srvr",
        "Insatllment Amount",
        "Installment Date",
        "Installment",
        "createdAt",
      ];
      const name =
        "survivor-grant-installment-list" + new Date().toISOString() + ".pdf";
      let goalsRows = [];
      exportinstallData?.forEach((item) => {
        const temp = [
          item.amountRequested,
          item.applicationNumber,
          item.appliedOn,
          item.approvedAmount,
          item.status,
          item.survivor,
          item.installMentAmount,
          item.installMentDate,
          item.installment,
          item.createdAt,
        ];
        goalsRows.push(temp);
      });
      doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
      doc.save(name);
    }
  };

  ////////////download Grant escalation pdf////////////////
  const downloadEscalPdf = () => {
    if (selectedData && !selectedData._id) {
      // alert("Please select one Grant");
      setShowAlert(true);
      setAlertMessage("Please select one Grant !!");
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
      doc.text("SURVIVOR GRANT ESCALATION LIST", 22, 60);
      doc.setFontSize(10);
      const survivorColumns = [
        "App No",
        "Escalation Amt Rqstd",
        "Srvr",
        "Applied On",
        "Escalated On",
        "Escalated To",
        "Escalation Received On",
        "Escalation",
        "Reason for Escalation",
        "Status",
        "createdAt",
      ];
      const name =
        "survivor-grant-escalation-list" + new Date().toISOString() + ".pdf";
      let goalsRows = [];
      exportescalData?.forEach((item) => {
        const temp = [
          item.applicationNumber,
          item.escalationAmountRequested,
          item.survivor,
          item.appliedOn,
          item.escalatedOn,
          item.escalatedTo,
          item.escalationAmountreceived,
          item.escalation,
          item.reasonforescalation,
          item.status,
          item.createdAt,
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
              <h2 className="page_title">Grant</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Grant</MDBBreadcrumbItem>
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
                    {currentModule &&
                      JSON.parse(currentModule).can_edit == true && (
                        <Dropdown.Item onClick={() => gotoAddUtilize()}>
                          Utilization Plan
                        </Dropdown.Item>
                      )}{" "}
                    {currentModule &&
                      JSON.parse(currentModule).can_edit == true && (
                        <Dropdown.Item onClick={() => gotoAddInstallment()}>
                          Installments
                        </Dropdown.Item>
                      )}{" "}
                    {currentModule &&
                      JSON.parse(currentModule).can_edit == true && (
                        <Dropdown.Item onClick={() => gotoAddEscalation()}>
                          Escalation
                        </Dropdown.Item>
                      )}
                    <Dropdown.Item onClick={(e) => exportToCsv(e)}>
                      Export Grant CSV
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => exportutilToCsv(e)}>
                      Export Utilization CSV
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => exportInstlToCsv(e)}>
                      Export Insatllment CSV
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => exportEscalToCsv(e)}>
                      Export Escalation CSV
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => downloadPdf()}>
                      Download Grant PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => downloadUtilPdf()}>
                      Download Utilization PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => downloadInstalPdf()}>
                      Download Insatllment PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => downloadEscalPdf()}>
                      Download Escalation PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => changeLogFunc()}>
                      Change Log
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
                  <span onClick={() => gotoAddGrant()}>
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
                  <span onClick={() => ongotoEditGrant()}>
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
            {currentModule &&
              JSON.parse(currentModule).can_view == true &&
              selectedData &&
              selectedData.approved_amount && (
                <h4 className="mb-4 small_heading">
                  Total grant/compensation (Approved / Received so far):
                  {selectedData && numberFormat(selectedData.approved_amount)}/
                  {selectedData &&
                    numberFormat(selectedData.received_amount_so_far)}
                </h4>
              )}
            {currentModule && JSON.parse(currentModule).can_view == true && (
              <div className="table-responsive medium-mobile-responsive">
                <GrantDataTable
                  survivalGrantList={
                    survivalGrantList &&
                    survivalGrantList.length > 0 &&
                    survivalGrantList
                  }
                  selectedProduct5={selectedProduct5}
                  onSelectRow={onSelectRow}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
          {selectedData &&
            selectedData.utilization_plans &&
            selectedData.utilization_plans.length > 0 && (
              <div className="white_box_shadow vieweditdeleteMargin survivors_table_wrap position-relative">
                <MDBAccordion flush initialActive={1}>
                  <MDBAccordionItem
                    className="tableAccordionWrap"
                    collapseId={1}
                    headerTitle="Utilization Plan"
                  >
                    <div className="vieweditdelete">
                      <MDBTooltip
                        tag="button"
                        wrapperProps={{ className: "add_btn view_btn" }}
                        title="Add"
                      >
                        <span onClick={() => setModalUtilizationShow(true)}>
                          <i className="fal fa-plus-circle"></i>
                        </span>
                      </MDBTooltip>
                      {/* <MDBTooltip tag="a" wrapperProps={{ href: '/#', className: "edit_btn" }} title='Edit'>
                                            <i className="fal fa-pencil"></i>
                                        </MDBTooltip> */}
                      <MDBTooltip
                        tag="a"
                        wrapperProps={{ className: "delete_btn" }}
                        title="Delete"
                      >
                        <i onClick={()=> onDeleteGrantUtil("utilization_plans")} className="fal fa-trash-alt"></i>
                      </MDBTooltip>
                    </div>
                    <table className="table table-borderless mb-0">
                      <thead>
                        <tr>
                          <th width="60%">Utilization</th>
                          <th width="40%">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedData &&
                          selectedData.utilization_plans &&
                          selectedData.utilization_plans.length > 0 &&
                          selectedData.utilization_plans?.map((item) => {
                            return (
                              <> 
                              {item.is_deleted == false &&
                              <tr
                                className={[
                                  item._id === utilisationDelete && "current",
                                ]}
                                onClick={() =>
                                  onSelectVcEscal(item._id, "util")
                                }
                              >
                                <td>
                                  {item && item.description && item.description}
                                </td>
                                <td>
                                  {item &&
                                    item.amount &&
                                    numberFormat(item.amount)}
                                </td>{" "}
                              </tr>
                              }

                              </>
                            );
                          })}
                      </tbody>
                    </table>
                  </MDBAccordionItem>
                </MDBAccordion>
              </div>
            )}
          {selectedData &&
            selectedData.installments &&
            selectedData.installments.length > 0 && (
              <div className="white_box_shadow vieweditdeleteMargin survivors_table_wrap position-relative">
                <MDBAccordion flush initialActive={1}>
                  <MDBAccordionItem
                    className="tableAccordionWrap"
                    collapseId={1}
                    headerTitle="Installments"
                  >
                    <div className="vieweditdelete">
                      <MDBTooltip
                        tag="button"
                        wrapperProps={{ className: "add_btn view_btn" }}
                        title="Add"
                      >
                        <span onClick={() => gotoAddInstallment()}>
                          <i className="fal fa-plus-circle"></i>
                        </span>
                      </MDBTooltip>
                      {/* <MDBTooltip tag="a" wrapperProps={{ href: '/#', className: "edit_btn" }} title='Edit'>
                                            <i className="fal fa-pencil"></i>
                                        </MDBTooltip> */}
                      <MDBTooltip
                        tag="a"
                        wrapperProps={{ className: "delete_btn" }}
                        title="Delete"
                      >
                        <i onClick={()=> onDeleteGrantIntsall("installments")} className="fal fa-trash-alt"></i>
                      </MDBTooltip>
                    </div>
                    <table className="table table-borderless mb-0">
                      <thead>
                        <tr>
                          <th width="15%">Installment</th>
                          <th width="40%">Estimated Date</th>
                          <th width="20%">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedData &&
                          selectedData.installments &&
                          selectedData.installments.length > 0 &&
                          selectedData.installments?.map((item) => {
                            return (
                              <> 
                              {item.is_deleted == false &&
                              <tr
                                className={[
                                  item._id === instalDelete && "current",
                                ]}
                                onClick={() =>
                                  onSelectVcEscal(item._id, "instal")
                                }
                              >
                                <td>
                                  {item && item.installment && item.installment}
                                </td>
                                <td>
                                  {item &&
                                    item.estimated_date &&
                                    moment(item.estimated_date).format(
                                      "DD-MMM-YYYY"
                                    )}
                                </td>
                                <td>
                                  {item &&
                                    item.amount &&
                                    numberFormat(item.amount)}
                                </td>
                              </tr>
                          }
                          </>
                            );
                          })}
                      </tbody>
                    </table>
                  </MDBAccordionItem>
                </MDBAccordion>
              </div>
            )}

          {selectedData &&
            selectedData.escalations &&
            selectedData.escalations.length > 0 && (
              <div className="white_box_shadow vieweditdeleteMargin survivors_table_wrap position-relative">
                <MDBAccordion flush initialActive={1}>
                  <MDBAccordionItem
                    className="tableAccordionWrap"
                    collapseId={1}
                    headerTitle="Escalation"
                  >
                    <div className="vieweditdelete">
                      <MDBTooltip
                        tag="button"
                        wrapperProps={{ className: "add_btn view_btn" }}
                        title="Add"
                      >
                        <span onClick={() => setModalEscalationShow(true)}>
                          <i className="fal fa-plus-circle"></i>
                        </span>
                      </MDBTooltip>
                      {/* <MDBTooltip tag="a" wrapperProps={{ href: '/#', className: "edit_btn" }} title='Edit'>
                                            <i className="fal fa-pencil"></i>
                                        </MDBTooltip> */}
                      <MDBTooltip
                        tag="a"
                        wrapperProps={{ className: "delete_btn" }}
                        title="Delete"
                      >
                        <i onClick={()=>onDeleteGrantEscal("escalations")} className="fal fa-trash-alt"></i>
                      </MDBTooltip>
                    </div>
                    <div className="table-responsive medium-mobile-responsive">
                      <table className="table table-borderless mb-0">
                        <thead>
                          <tr>
                            <th width="10%">Sr#</th>
                            <th width="15%">Application no.</th>
                            <th width="18%">Escalated to</th>
                            <th width="18%">Escalated on (date)</th>
                            <th width="18%">Ref.Document</th>
                            <th width="18%">Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedData &&
                            selectedData.escalations &&
                            selectedData.escalations.length > 0 &&
                            selectedData.escalations.map((item, index) => {
                              // console.log(item,"escalations11111")
                              let idx = index + 1;
                              return (
                                <> 
                                {item.is_deleted == false &&
                                <tr
                                  className={[
                                    item._id === escalDelete && "current",
                                  ]}
                                  onClick={() =>
                                    onSelectVcEscal(item._id, "escal")
                                  }
                                >
                                  <td>{idx && idx}</td>
                                  <td>
                                    {item &&
                                      item.application_number &&
                                      item.application_number}
                                  </td>
                                  <td>
                                    {item &&
                                      item.escalated_to &&
                                      item.escalated_to}
                                  </td>
                                  <td>
                                    {item &&
                                      item.escalated_on &&
                                      moment(item.escalated_on).format(
                                        "DD-MMM-YYYY"
                                      )}
                                  </td>
                                  <td>
                                    <a
                                      className="download"
                                      href={
                                        item &&
                                        item.reference_document &&
                                        item.reference_document
                                      }
                                    >
                                      {item &&
                                        item.reference_document &&
                                        item.reference_document
                                          .split("/")
                                          .pop()}
                                    </a>
                                  </td>
                                  <td>
                                    {item &&
                                      item.reason_for_escalation &&
                                      item.reason_for_escalation}
                                  </td>
                                </tr>
                            }
                            </>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </MDBAccordionItem>
                </MDBAccordion>
              </div>
            )}
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalGrantShow}
        onHide={setModalGrantShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedData && selectedData._id ? "Update Grant" : "Add Grant"}
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
                    Name of grant/compensation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="name_of_grant_compensation"
                    onChange={(e) => onGrnameSelect(e)}
                    value={
                      addGrantData &&
                      addGrantData.name_of_grant_compensation &&
                      addGrantData.name_of_grant_compensation._id
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {grantList &&
                      grantList.length > 0 &&
                      grantList?.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "name_of_grant_compensation" &&
                    customError.message !== "" && (
                      <small className="mt-4 mb-2 text-danger">
                        {customError && customError.message}
                      </small>
                    )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Applied on <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <DatePicker
                    name="applied_on"
                    data={addGrantData && addGrantData.applied_on}
                    // message={"Please Add Date"}
                    datePickerChange={grandAppliedDateHandel}
                  />
                  */}
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addGrantData && addGrantData.applied_on
                            ? moment(addGrantData.applied_on).format(
                                "DD-MMM-YYYY"
                              )
                            : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"applied_on"}
                          className="dateBtn"
                          type="date"
                          onChange={grandAppliedDateHandel}
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
                  {customError.name == "applied_on" &&
                    customError.message !== "" && (
                      <small className="mt-4 mb-2 text-danger">
                        {customError && customError.message}
                      </small>
                    )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Purpose of grant</Form.Label>
                  {/* <Form.Control
                    name="purpose_of_grant"
                    disabled={true}
                    value={
                      addGrantData &&
                      addGrantData.purpose_of_grant &&
                      addGrantData.purpose_of_grant
                    }
                  /> */}

                  <Form.Select
                    name="purpose_of_grant_id"
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addGrantData &&
                      addGrantData.purpose_of_grant &&
                      addGrantData.purpose_of_grant_id._id
                    }
                  >
                    <option hidden={true}>Please select</option>
                    {purposeList &&
                      purposeList.length > 0 &&
                      purposeList?.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application Number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    name="application_number"
                    type="text"
                    defaultValue={
                      addGrantData && addGrantData.application_number
                    }
                    onKeyPress={(e) => {
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
                  <Form.Label>
                    Amount requested <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      onChange={(e) =>
                        setAddGrantData({
                          ...addGrantData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      name="amount_requested"
                      type="text"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                      defaultValue={
                        addGrantData && addGrantData.amount_requested
                      }
                    />
                  </InputGroup>
                  {customError.name == "amount_requested" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addGrantData && addGrantData.status && addGrantData.status
                    }
                  >
                    <option hidden={true} value="">
                      Please select
                    </option>
                    {grantStatusList &&
                      grantStatusList.length > 0 &&
                      grantStatusList.map((item) => {
                        return (
                          <option value={item && item.name}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reference document <span className="requiredStar">*</span>
                  </Form.Label>
                  <div className="fileuploadForm">
                    <input
                      onChange={(e) => onDocumentChange(e, false)}
                      type="file"
                    />
                    {addGrantData.reference_document ? (
                      <span>
                        {""}
                        {addGrantData &&
                          addGrantData.reference_document &&
                          addGrantData.reference_document.split("_").pop()}
                      </span>
                    ) : (
                      <span>Choose File</span>
                    )}
                  </div>

                 
                  {customError.name == "reference_document" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                 
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Approved Amount</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      name="approved_amount"
                      type="text"
                      onChange={(e) =>
                        setAddGrantData({
                          ...addGrantData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                      disabled={true}
                      defaultValue={
                        addGrantData && addGrantData.approved_amount
                      }
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Received On</Form.Label>
                  {/* <DatePicker
                    name="received_on"
                    data={addGrantData && addGrantData.received_on}
                    message={"Please Add Date"}
                    datePickerChange={grandreceivedDateHandel}
                  /> */}
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addGrantData && addGrantData.received_on
                            ? moment(addGrantData.received_on).format(
                                "DD-MMM-YYYY"
                              )
                            : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"received_on"}
                          className="dateBtn"
                          type="date"
                          onChange={grandreceivedDateHandel}
                          placeholder=""
                          max={moment().format("YYYY-MM-DD")}
                          min={
                            addGrantData &&
                            addGrantData.applied_on &&
                            moment(addGrantData.applied_on).format("YYYY-MM-DD")
                          }
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Received Amount So far</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="received_amount_so_far"
                      onChange={(e) =>
                        setAddGrantData({
                          ...addGrantData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                      defaultValue={
                        addGrantData && addGrantData.received_amount_so_far
                      }
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Reference result document </Form.Label>
                  <div className="fileuploadForm">
                    <input
                      onChange={(e) => onResultDocumentChange(e)}
                      type="file"
                    />
                    {addGrantData.reference_result_document ? (
                      <span>
                        {""}
                        {addGrantData &&
                          addGrantData.reference_result_document &&
                          addGrantData.reference_result_document.split("_").pop()}
                      </span>
                    ) : (
                      <span>Choose File</span>
                    )}
                  </div>
                  
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Installment Number </Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    name="installment_number"
                    disabled={true}
                    type="text"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    defaultValue={
                      addGrantData && addGrantData.installment_number
                    }
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalation </Form.Label>
                  <Form.Select
                    name="escalation"
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={addGrantData && addGrantData.escalation}
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    Reason for escalation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    name="reason_for_escalation"
                    type="text"
                    as="textarea"
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    defaultValue={
                      addGrantData && addGrantData.reason_for_escalation
                    }
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
                    onClick={() => setModalGrantShow(false)}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    onClick={addGrantFunc}
                    disabled={buttonLoader == true ? true : false}
                    className="submit_btn shadow-0"
                  >
                    {buttonLoader && buttonLoader === true ? (
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
        show={modalUtilizationShow}
        onHide={setModalUtilizationShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Utilization
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form
            // noValidate
            // validated={validatedUtil}
            // onSubmit={(e) => handleSubmitutil(e, "util")}
            >
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Description<span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    name="description"
                    type="text"
                    onChange={(e) =>
                      setAddUtilizationData({
                        ...addUtilizationData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z 0-9 _ \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                  {customError.name == "description" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Amount<span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      onChange={(e) =>
                        setAddUtilizationData({
                          ...addUtilizationData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                      type="text"
                      name="amount"
                    />
                  </InputGroup>

                  {customError.name == "amount" && (
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
                    onClick={() => onUtilCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    disabled={
                      installLoad && installLoad === true ? true : false
                    }
                    onClick={(e) => addGrantUtilFunc(e)}
                    className="submit_btn shadow-0"
                  >
                    {installLoad && installLoad === true ? (
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
        show={modalInstallmentShow}
        onHide={setModalInstallmentShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Installment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form
            // noValidate
            // validated={validatedInstl}
            // onSubmit={(e) => handleSubmitutil(e, "instal")}
            >
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Installment #</Form.Label>
                  <Form.Control
                    name="installment"
                    onChange={(e) =>
                      setAddInstallmentData({
                        ...addInstallmentData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
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
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Estimated date <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <DatePicker
                    data={
                      addInstallmentData && addInstallmentData.estimated_date
                    }
                    required
                    name="estimated_date"
                    datePickerChange={estimatedDateChangeHandel}
                    message={"Please enter Estimated date"}
                    // data={}
                  /> */}
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addInstallmentData &&
                          addInstallmentData.estimated_date
                            ? moment(addInstallmentData.estimated_date).format(
                                "DD-MMM-YYYY"
                              )
                            : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"estimated_date"}
                          className="dateBtn"
                          type="date"
                          onChange={estimatedDateChangeHandel}
                          placeholder=""
                          max={moment().format("YYYY-MM-DD")}
                          min={
                            selectedData &&
                            selectedData.applied_on &&
                            moment(selectedData.applied_on).format("YYYY-MM-DD")
                          }
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                  {customError.name == "estimated_date" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    Amount<span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      onChange={(e) =>
                        setAddInstallmentData({
                          ...addInstallmentData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                      type="text"
                      name="amount"
                    />
                  </InputGroup>
                  {customError.name == "amount" && (
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
                    onClick={() => onInstalCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    disabled={installLoad === true ? true : false}
                    onClick={(e) => addGrantInstFunc(e)}
                    className="submit_btn shadow-0"
                  >
                    {installLoad && installLoad === true ? (
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
        show={modalEscalationShow}
        onHide={setModalEscalationShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Escalation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form
            // noValidate
            // validated={validatedescal}
            // onSubmit={(e) => handleSubmitutil(e, "escal")}
            >
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalated to</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    type="text"
                    name="escalated_to"
                    onKeyPress={(e) => {
                      if (!/[a-z A-Z \s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalated on (date)</Form.Label>
                  {/* <DatePicker
                    name="escalated_on"
                    datePickerChange={escalaOnDateChangeHandel}
                    data={addEscalationData && addEscalationData.escalated_on}
                  /> */}
                  <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addEscalationData && addEscalationData.escalated_on
                            ? moment(addEscalationData.escalated_on).format(
                                "DD-MMM-YYYY"
                              )
                            : null
                        }
                        disabled={true}
                      />

                      <InputGroup.Text>
                        <Form.Control
                          name={"escalated_on"}
                          className="dateBtn"
                          type="date"
                          onChange={escalaOnDateChangeHandel}
                          placeholder=""
                          max={moment().format("YYYY-MM-DD")}
                          min={
                            selectedData &&
                            selectedData.createdAt &&
                            moment(selectedData.createdAt).format("YYYY-MM-DD")
                          }
                        />
                        <i class="far fa-calendar-alt"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application Number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    type="text"
                    name="application_number"
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
                  <Form.Label>
                    Amount requested <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      onChange={(e) =>
                        setAddEscalationData({
                          ...addEscalationData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      type="text"
                      name="amount_requested"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                    />
                  </InputGroup>
                  {customError.name == "amount_requested" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    {grantStatusList &&
                      grantStatusList.length > 0 &&
                      grantStatusList.map((item) => {
                        return (
                          <option value={item && item.name}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reference document <span className="requiredStar">*</span>
                  </Form.Label>

                  <div className="fileuploadForm">
                    <input
                     onChange={(e) => onDocumentChange(e, true)}
                      type="file"
                    />
                    {addEscalationData.reference_document ? (
                      <span>
                        {""}
                        {addEscalationData &&
                          addEscalationData.reference_document &&
                          addEscalationData.reference_document.split("_").pop()}
                      </span>
                    ) : (
                      <span>Choose File</span>
                    )}
                  </div>
                  {/* <Form.Control
                    type="file"
                    name="file"
                    size="lg"
                    accept="image/png,image/jpeg,application/pdf,application/docx,application/doc"
                    onChange={(e) => onDocumentChange(e, true)}
                  /> */}
                  {customError.name == "reference_document" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Received On</Form.Label>
                  <DatePicker
                    name="received_on"
                    datePickerChange={escalaRecivedOnDate}
                    data={addEscalationData && addEscalationData.received_on}
                  />
                  {/* <Form.Control
                    type="date"
                    name="received_on"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Received On"
                  /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Received Amount</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="received_amount"
                      onChange={(e) =>
                        setAddEscalationData({
                          ...addEscalationData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Reference result document </Form.Label>
                  <Form.Select
                    name="reference_result_document"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value="approval">Approval</option>
                    <option value="rejection">Rejection</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Installment Number</Form.Label>
                  <Form.Control
                    name="installement_number"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
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
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalation</Form.Label>
                  <Form.Select
                    name="escalation"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Plea se select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    Reason for Escalation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="4"
                    name="reason_for_escalation"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    placeholder="Reason for Escalation"
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
                    onClick={() => onEscalCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    disabled={
                      installLoad && installLoad === true ? true : false
                    }
                    onClick={(e) => addGrantEscalFunc(e)}
                    className="submit_btn shadow-0"
                  >
                    {installLoad && installLoad === true ? (
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
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
          alertMessage={alertMessage}
          alertFlag={alertFlag}
          deleteLoader={deleteLoader}
        />
      )}
    </>
  );
};

export default SurvivorsGrant;
