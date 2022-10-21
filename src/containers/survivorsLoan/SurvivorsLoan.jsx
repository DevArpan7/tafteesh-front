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
import "./survivorloan.css";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import {
  getSurvaivalLoanList,
  getSurvivorDetails,
  // getMortgageList,
  getModulesChangeLog,
  getLoanPurposeList,
  getWhereListe,
} from "../../redux/action";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import LoanDataTable from "./LoanDataTable";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";
import { gotoSurvivorArchive } from "../../utils/helper";
import queryString from "query-string";

const SurvivorsLoan = (props) => {
  const [modalNewloanLogShow, setModalNewloanLogShow] = useState(false);
  const [modalPaidlogShow, setModalPaidlogShow] = useState(false);
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const survivalLoanList = useSelector((state) => state.survivalLoanList);
  const loanPurposeList = useSelector((state) => state.loanPurposeList);
  const whereList = useSelector((state) => state.whereList);
  const [modalInactiveShow, setmodalInactiveShow] = useState(false);
  // const mortgageList = useSelector((state) => state.mortgageList);
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [selectFile, setSelectFile] = useState("");
  const [pictureData, setPictureData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [addLoanData, setAddLoanData] = useState({});
  const [addPaidLogData, setAddPaidLogData] = useState({});
  const [mortArr, setMortArr] = useState([]);
  const [reason, setReason] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");

  const [validated, setValidated] = useState(false);
  const [validatedPaidlog, setValidatedPaidlog] = useState(false);
  const [messagType, setMessagType] = useState("");
  const [paidLoader, setPaidLoader] = useState(false);
  const [paidLogDeleteId, setPaidLogDeleteId] = useState("");
  const [selected, setSelected] = useState([]);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [customError, setCustomError] = useState({ name: "", message: "" });

  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };

  const [isLoading, setIsLoading] = useState(true);

  const currentModule = localStorage.getItem("currentModule");
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  useEffect(() => {
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
  }, [props]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [survivalLoanList]);

  useEffect(() => {
    if (props.location.state) {
      dispatch(getSurvaivalLoanList(props.location.state));
      dispatch(getSurvivorDetails(props.location.state));
      // dispatch(getMortgageList());
      dispatch(getLoanPurposeList());
      dispatch(getWhereListe());
    }
  }, [props]);

  useEffect(() => {
    const options = [];
    let obj = {};
    survivalLoanList && survivalLoanList.masterMortgageData &&
    survivalLoanList.masterMortgageData.length > 0 &&
    survivalLoanList.masterMortgageData.map((mort) => {
        return (
          (obj = { label: mort.name, value: mort._id }),
          options.push(obj),
          setMortArr(options)
        );
      });
  }, [ survivalLoanList && survivalLoanList.masterMortgageData]);

  useEffect(() => {
    if (
      selectedData &&
      selectedData.mortgage &&
      selectedData.mortgage.length > 0
    ) {
      const options = [];
      selectedData &&
        selectedData.mortgage.length > 0 &&
        selectedData.mortgage.map((arr) => {
          return (
            mortArr &&
            mortArr.length > 0 &&
            mortArr.map((mort) => {
              return (
                arr === mort.value && options.push(mort)
                // data = options.filter(x => options.filter(y=> y.value !== x.value)),
                //console.log(options, " edit option")
              );
            })
          );
        });

      setSelected(options);
    }
  }, [selectedData && selectedData.mortgage]);

  //console.log(selected, "selected");

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Loan");
      setAlertFlag("alert");
    } else {
      setShowAlert(true);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  //////// ON PAID LOG DELETE CLICK FUNCTION ////
  const onDeletePaidlogFunc = (paidLogId) => {
    setPaidLogDeleteId(paidLogId);
    setShowAlert(true);
    setAlertMessage("");
    setAlertFlag("");
  };

  const onDeletePaidlogFunction = () => {
    let body = {
      user_id: deletedById,
    };
    setDeleteLoader(true);
    axios
      .patch(
        api +
          "/survival-loan/delete-paid-log/" +
          selectedData._id +
          "/" +
          paidLogDeleteId,
        body,
        axiosConfig
      )
      .then((response) => {
        setDeleteLoader(false);
        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("success");
        if (response.data && response.data.error === false) {
          const { data } = response;
          loanDetails(selectedData._id)
          dispatch(
            getSurvaivalLoanList(props.location && props.location.state)
          );
          setPaidLogDeleteId("");
          setShowAlert(false);
          setErorMessage("");
          // setSelectedData({});
          // setSelectedProduct5(null);
        }
      })
      .catch((error) => {
        setDeleteLoader(false);
        handleClick();
        setUpdateMessage(error && error.message);
        setMessagType("error");
      });
  };

  const onDeleteFunction = () => {
    let body = {
      deleted_by: deletedById && deletedById,
      deleted_by_ref: "users",
    };
    if (paidLogDeleteId !== "") {
      onDeletePaidlogFunction();
    } else {
      setDeleteLoader(true);
      axios
        .patch(
          api + "/survival-loan/delete/" + selectedData._id,
          body,
          axiosConfig
        )
        .then((response) => {
          setDeleteLoader(false);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success");
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(
              getSurvaivalLoanList(props.location && props.location.state)
            );
            setShowAlert(false);
            setErorMessage("");
            setSelectedData({});
            setSelectedProduct5(null);
          }
        })
        .catch((error) => {
          setDeleteLoader(false);
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
        });
    }
  };

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

  /////// get loan details API ///
  const loanDetails = (id) => {
    axios
      .get(api + "/survival-loan/detail/" + id, axiosConfig)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData(data.data);
        }
      })
      .catch((error) => {});
  };

  ////// go to add loan ///

  const gotoAddLoan = () => {
    setModalNewloanLogShow(true);
    setSelectedProduct5(null);
    setSelectedData({});
    setAddLoanData({});
    setSelected([]);
  };

  ///// go to edit loan ///
  const gotoEditLoan = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Loan");
      setAlertFlag("alert");
    } else {
      setModalNewloanLogShow(true);
      setAddLoanData(selectedData);
      setShowAlert(false);
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  ///// add paid log ///
  const gotoAddPaidLog = () => {
    if (!selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one loan to add paid log");
      setAlertFlag("alert");
    } else {
      setModalPaidlogShow(true);
      setAddLoanData(selectedData);
      setShowAlert(false);
      setAddPaidLogData({});
      setAlertMessage("");
      setAlertFlag("");
    }
  };

  // console.log(paidLogActiveClass,"paidLogActiveClass")
  //// go to edit paid log function /////
  const gotToEdit = (data) => {
    setModalPaidlogShow(true);
    setAddPaidLogData(data);
    setShowAlert(false);
    setAlertMessage("");
    setAlertFlag("");
  };

  const asOfDateChangeHandel = (e) => {
    setAddPaidLogData({
      ...addPaidLogData,
      [e.target.name]: e.target.value,
    });
  };

  /////////////////////file upload function/////////////////////////
  const onDocumentChange = (e) => {
    //console.log(e, e.target.files[0]);
    let data = e.target.files[0];
    setSelectFile(e.target.files[0]);
    storeFile(data);
  };

  const storeFile = (file) => {
    //console.log(file);
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
          setAddLoanData({
            ...addLoanData,
            reference_document: {
              name: file && file.name,
              file: "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
            },
          });
        
        }
        else{
          handleClick();
          setUpdateMessage(response.data.data.message);
          setMessagType("error");
          setAddLoanData({
            ...addLoanData,
            reference_document: {},
          });
        }
      })
      .catch((err) => {
        //console.log(err);
      });
  };


  useEffect(() => {
    let arr = [];
    selected &&
      selected.length > 0 &&
      selected.map((data) => {
        return (
          arr.push(data.value),
          //console.log(arr, "arr"),
          setAddLoanData({
            ...addLoanData,
            mortgage: arr,
          })
        );
      });
  }, [selected]);

  //// EDIT AND DELETE PAID LOG FUNCTION ////
  const addPaidLog = (e) => {
    e.preventDefault();

    let body = {
      ...addPaidLogData,
      user_id: deletedById,
    };
    if (addPaidLogData && !addPaidLogData.total_paid) {
      setCustomError({
        name: "total_paid",
        message: "Please Total paid amount",
      });
    } else if (addPaidLogData && !addPaidLogData.as_of_date) {
      setCustomError({
        name: "as_of_date",
        message: "Please select as of Date",
      });
    } else {
      if (addPaidLogData._id) {
        setPaidLoader(true);
        axios
          .patch(
            api +
              "/survival-loan/edit-paid-log/" +
              selectedData._id +
              "/" +
              addPaidLogData._id,
            body,
            axiosConfig
          )
          .then((response) => {
            //console.log(response);
            setPaidLoader(false);
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("success");
            if (response.data && response.data.error === false) {
              const { data } = response;
              loanDetails(selectedData._id)
              dispatch(getSurvaivalLoanList(props.location.state));
              setAddPaidLogData({});
              setModalPaidlogShow(false);
            } else {
              handleClick();
              setUpdateMessage(response && response.data.message);
            }
          })
          .catch((error) => {
            //console.log(error, "error");
            setPaidLoader(false);

            handleClick();
            setUpdateMessage(error && error.message);
            setMessagType("error");
          });
      } else {
        setPaidLoader(true);
        axios
          .patch(
            api + "/survival-loan/add-paid-log/" + selectedData._id,
            addPaidLogData,
            axiosConfig
          )
          .then((response) => {
            //console.log(response);
            setPaidLoader(false);
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessagType("success");
            if (response.data && response.data.error === false) {
              const { data } = response;
              loanDetails(selectedData._id)
              dispatch(getSurvaivalLoanList(props.location.state));
              setActiveClass(false);
              // setSelectedData({});
              setAddLoanData({});
              setAddPaidLogData({});
              setModalPaidlogShow(false);
              // setSelectedProduct5(null);
            } else {
              handleClick();
              setUpdateMessage(response && response.data.message);
            }
            setValidatedPaidlog(false);
          })
          .catch((error) => {
            //console.log(error, "error");
            setPaidLoader(false);

            handleClick();
            setUpdateMessage(error && error.message);
            setMessagType("error");
          });
      }
    }
  };

  const changeLogFunc = () => {
    let type = "loan";
    dispatch(getModulesChangeLog(type, deletedById, props.location.state));
    props.history.push("/change-log");
  };

  // const handleSubmit = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     if (addLoanData && addLoanData._id) {
  //       setValidated(false);
  //       addLoanFunc(event);
  //     } else {
  //       event.preventDefault();
  //       event.stopPropagation();
  //     }
  //   } else {
  //     addLoanFunc(event);
  //   }
  //   setValidated(true);
  // };
  const [resultLoad, setResultLoad] = useState(false);



  useEffect(() => {
    if (addLoanData && addLoanData.loan_Where) {
      setCustomError({
        name: "loan_Where",
        message: "",
      });
    } else if (addLoanData  && addLoanData.amount) {
      setCustomError({
        name: "amount",
        message: "",
      });
    } else if (addLoanData  && addLoanData.rate) {
      setCustomError({
        name: "rate",
        message: "",
      });
    } else if (addLoanData  && addLoanData.loan_purpose) {
      setCustomError({
        name: "loan_purpose",
        message: "",
      });
    } else if (addLoanData  && addLoanData.tenure) {
      setCustomError({
        name: "tenure",
        message: "",
      });
    } else if (addLoanData  && addLoanData.repayment_per_month) {
      setCustomError({
        name: "repayment_per_month",
        message: "",
      });
    } else if (addLoanData  && addLoanData.total_paid_amount) {
      setCustomError({
        name: "total_paid_amount",
        message: "",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });
    }
  }, [addLoanData ]);


  //////////// add loan api call function /////////////
  const addLoanFunc = (e) => {
e.preventDefault()
    if (addLoanData && !addLoanData.loan_Where) {
      setCustomError({
        name: "loan_Where",
        message: "Please Select Where",
      });
    } else if (addLoanData  && !addLoanData.amount) {
      setCustomError({
        name: "amount",
        message: "Please enter Amount",
      });
    } else if (addLoanData  && !addLoanData.rate) {
      setCustomError({
        name: "rate",
        message: "Please enter Rate",
      });
    } else if (addLoanData  && !addLoanData.loan_purpose) {
      setCustomError({
        name: "loan_purpose",
        message: "Please select Loan Purpose",
      });
    } else if (addLoanData  && !addLoanData.tenure) {
      setCustomError({
        name: "tenure",
        message: "Please enter Tenure",
      });
    } else if (addLoanData  && !addLoanData.repayment_per_month) {
      setCustomError({
        name: "repayment_per_month",
        message: "Please enter Repayment per month",
      });
    } else if (addLoanData  && !addLoanData.total_paid_amount) {
      setCustomError({
        name: "total_paid_amount",
        message: "Please enter Total paid amount",
      });
    } else {
      setCustomError({
        name: "",
        message: "",
      });

    e.preventDefault();
    let updateData = {
      survivor: props.location && props.location.state,
      ...addLoanData,
      // paid_log: [addPaidLogData],
      user_id: deletedById && deletedById,
    };
    let body = {
      survivor: props.location && props.location.state,
      ...addLoanData,
    };

    // var body =
    // addLoanData && addLoanData._id ? updateData : addData;

    if (addLoanData && addLoanData._id) {
      setResultLoad(true);
      axios
        .patch(
          api + "/survival-loan/update/" + addLoanData._id,
          updateData,
          axiosConfig
        )
        .then((response) => {
          //console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success");
          setValidated(false);
          setValidatedPaidlog(false);
          setResultLoad(false);

          if (response.data && response.data.error === false) {
            const { data } = response;
            loanDetails(addLoanData._id)
            dispatch(getSurvaivalLoanList(props.location.state));
            setModalNewloanLogShow(false);
            setActiveClass(false);
            // setSelectedData({});
            setAddLoanData({});
            setAddPaidLogData({});
            // setSelectedData({});
            // setSelectedProduct5(null);
          } else {
            handleClick();
            setUpdateMessage(response && response.data.message);
          }
        })
        .catch((error) => {
          //console.log(error, "error");
          setResultLoad(false);

          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
        });
    } else {
      setResultLoad(true);

      axios
        .post(api + "/survival-loan/create", body, axiosConfig)
        .then((response) => {
          //console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success");
          setValidated(false);
          setValidatedPaidlog(false);
          setResultLoad(false);

          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvaivalLoanList(props.location.state));
            setModalNewloanLogShow(false);
            setAddLoanData({});
          } else {
            handleClick();
            setUpdateMessage(response && response.data.message);
          }
        })
        .catch((error) => {
          //console.log(error, "error");
          setResultLoad(false);

          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
        });
    }
  }
  };

  const receivedOnDateHandel = (e) => {
    setAddLoanData({
      ...addLoanData,
      [e.target.name]: e.target.value,
    });
  };

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  //export csv function///

  //console.log(survivalLoanList, "firrrrrrrrrrrrrr");
  const formatDate = (value) => {
    return moment(value).format("DD-MMM-YYYY");
  };

  ///archive

  let url = props.location.search;
  let getId = queryString.parse(url, { parseNumbers: true });

  //console.log(getId, "getId");
  const history = useHistory();

  const gotoArchiveList = (e) => {
    //console.log(props.location.state, "props.location.state");
    gotoSurvivorArchive(e, "loan", props.location.state, history);
  };

  let exportData = [];
  survivalLoanList?.data?.map((x, index) => {
    exportData.push({
      _id: x._id,
      amount: x.amount,
      purpose: x.loan_purpose && x.loan_purpose.name,
      rate: x.rate,
      rate_of_interest_mode: x.rate_of_interest_mode,
      received_on: formatDate(x.received_on),
      repayment_per_month: x.repayment_per_month,
      survivor: survivorDetails && survivorDetails.survivor_id,
      tenure: x.tenure,
      total_paid_amount: x.total_paid_amount,
      where: x.loan_Where && x.loan_Where.name,
      mortgage: x.mortgage,
      paidLogTotalPaid: x.paid_log?.map((y) => {
        return y.total_paid;
      }),
      paidLogDate: x.paid_log?.map((y) => {
        return formatDate(y.as_of_date);
      }),
      paidLogId: x.paid_log?.map((y) => {
        return y._id;
      }),
      createdAt: formatDate(x.createdAt),
    });
  });

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
      "Id,Amount,Mortgage,Total Paid Amount,Paid Log Date,Total Paid,Paid Log Id,Purpose,Rate, Rate of Interest Mode,Received On,Repayment Per Month,Survivor,Tenure,Where,Created At",
    ];

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const {
        _id,
        amount,
        mortgage,
        total_paid_amount,
        paidLogDate,
        paidLogTotalPaid,
        paidLogId,
        purpose,
        rate,
        rate_of_interest_mode,
        received_on,
        repayment_per_month,
        survivor,
        tenure,
        where,
        createdAt,
      } = user;
      acc.push(
        [
          _id,
          amount,
          mortgage,
          total_paid_amount,
          paidLogDate,
          paidLogTotalPaid,
          paidLogId,
          purpose,
          rate,
          rate_of_interest_mode,
          received_on,
          repayment_per_month,
          survivor,
          tenure,
          where,
          createdAt,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "loanList.csv",
      fileType: "text/csv",
    });
  };

  /////////download pdf////////////////

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
    doc.text("SURVIVOR LOAN LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "Amt",
      "Date",
      "Paid",
      "Purpose",
      "Rate",
      "Interest Mode",
      "Received On",
      "Repayment/Month",
      "Survivor",
      "Tenure",
      "Total Paid",
      "Where",
      "CreatedAt",
    ];
    const name = "survivor-loan-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [
        item.amount,
        item.paidLogDate,
        item.paidLogTotalPaid,
        item.purpose,
        item.rate,
        item.rate_of_interest_mode,
        item.received_on,
        item.repayment_per_month,
        item.survivor,
        item.tenure,
        item.total_paid_amount,
        item.where,
        item.createdAt,
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
              <h2 className="page_title">Loan</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Loan</MDBBreadcrumbItem>
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
                    <Dropdown.Item onClick={exportToCsv}>
                      Export CSV
                    </Dropdown.Item>
                    <Dropdown.Item onClick={downloadPdf}>
                      Download PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => changeLogFunc()}>
                      Change Log
                    </Dropdown.Item>
                    {currentModule &&
                      JSON.parse(currentModule).can_edit == true && (
                        <Dropdown.Item onClick={() => gotoAddPaidLog()}>
                          Paid Log
                        </Dropdown.Item>
                      )}
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
                  <span onClick={() => gotoAddLoan()}>
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
                  <span onClick={() => gotoEditLoan()}>
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
              survivalLoanList &&
              survivalLoanList.totalLoan && (
                <h4 className="mb-4 small_heading">
                  Total Outstanding Loan Amount :{" "}
                  {survivalLoanList && numberFormat(survivalLoanList.totalLoan)}
                </h4>
              )}
            {currentModule && JSON.parse(currentModule).can_view == true && (
              <div className="table-responsive big-mobile-responsive">
                <LoanDataTable
                  survivalLoanList={
                    survivalLoanList &&
                    survivalLoanList.data &&
                    survivalLoanList.data.length > 0 &&
                    survivalLoanList.data
                  }
                  selectedProduct5={selectedProduct5}
                  isLoading={isLoading}
                  onSelectRow={onSelectRow}
                  selectedData={selectedData}
                />
              </div>
            )}
          </div>
          {selectedData &&
            selectedData.paid_log &&
            selectedData.paid_log.length > 0 && (
              <div
                id="paidlogBox"
                className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative"
              >
                <h4 className="mb-4 small_heading">Paid Log List </h4>

                <div className="table-responsive small-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th>Paid Summary#</th>
                        <th>Total Paid</th>
                        <th>As of Date</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedData &&
                        selectedData.paid_log &&
                        selectedData.paid_log.length > 0 &&
                        selectedData.paid_log.map((item, idx) => {
                          let index = idx + 1;
                          return (
                            item.is_deleted !== true && (
                              <tr>
                                <td>{index && index}</td>
                                <td>{item && item.total_paid}</td>
                                <td>
                                  {item &&
                                    moment(item.as_of_date).format(
                                      "DD-MMM-YYYY"
                                    )}
                                </td>
                                <td>
                                  <div className="mydairy_btns position-static justify-content-end">
                                    <MDBTooltip
                                      tag="a"
                                      wrapperProps={{ className: "edit_btn" }}
                                      title="Edit"
                                    >
                                      <span onClick={() => gotToEdit(item)}>
                                        <i className="fal fa-pencil"></i>
                                      </span>
                                    </MDBTooltip>
                                    <MDBTooltip
                                      tag="a"
                                      wrapperProps={{ className: "delete_btn" }}
                                      title="Delete"
                                    >
                                      <span
                                        onClick={() =>
                                          onDeletePaidlogFunc(item._id)
                                        }
                                      >
                                        <i className="fal fa-trash-alt"></i>
                                      </span>
                                    </MDBTooltip>
                                  </div>
                                </td>
                              </tr>
                            )
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalNewloanLogShow}
        onHide={setModalNewloanLogShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
        backdrop={"static"}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {" "}
            {selectedData && selectedData._id ? "Update Loan" : "Add Loan"}
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
                    Where <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    
                    name="loan_Where"
                    value={
                      addLoanData &&
                      addLoanData.loan_Where &&
                      addLoanData.loan_Where._id
                    }
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {whereList &&
                      whereList.length > 0 &&
                      whereList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "loan_Where" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Amount <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      
                      defaultValue={
                        addLoanData && addLoanData.amount && addLoanData.amount
                      }
                      name="amount"
                      type="text"
                      onChange={(e) =>
                        setAddLoanData({
                          ...addLoanData,
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
                  {customError.name == "amount" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Rate <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    
                    defaultValue={
                      addLoanData && addLoanData.rate && addLoanData.rate
                    }
                    name="rate"
                    type="text"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
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
                 {customError.name == "rate" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Purpose <span className="requiredStar">*</span>
                  </Form.Label>

                  {/* <Form.Control
                    required
                    name="purpose"
                    defaultValue={
                      addLoanData && addLoanData.purpose && addLoanData.purpose
                    }
                    type="text"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                  /> */}
                  <Form.Select
                    name="loan_purpose"
                    value={
                      addLoanData &&
                      addLoanData.loan_purpose &&
                      addLoanData.loan_purpose._id
                    }
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    {loanPurposeList &&
                      loanPurposeList.length > 0 &&
                      loanPurposeList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {customError.name == "loan_purpose" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Rate of interest mode</Form.Label>
                  <Form.Select
                    name="rate_of_interest_mode"
                    value={
                      addLoanData &&
                      addLoanData.rate_of_interest_mode &&
                      addLoanData.rate_of_interest_mode
                    }
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly"> Weekly</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Rate of interest mode
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Received On</Form.Label>
                  {/* <DatePicker
                    name="received_on"
                    data={addLoanData && addLoanData.received_on}
                    datePickerChange={receivedOnDateHandel}
                  /> */}
                   <>
                    <InputGroup className="date_box">
                      <span className="hidebox"></span>
                      <Form.Control
                        type="text"
                        placeholder="DD-MMM-YYYY"
                        value={
                          addLoanData && addLoanData.received_on
                            ? moment(addLoanData.received_on).format(
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
                          onChange={receivedOnDateHandel}
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
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Tenure <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    
                    defaultValue={
                      addLoanData && addLoanData.tenure && addLoanData.tenure
                    }
                    name="tenure"
                    type="text"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
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
                  {customError.name == "tenure" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Mortgage</Form.Label>
                  <MultiSelect
                    options={mortArr}
                    value={selected}
                    hasSelectAll={false}
                    disableSearch={true}
                    onChange={setSelected}
                    labelledBy={"Select"}
                    className={"survivorMultiselect-box multiselectbox_span"}
                    overrideStrings={{
                      selectSomeItems: "Select columns to view",
                      allItemsAreSelected: "All Items are Selected",
                      selectAll: "Select All",
                      search: "Search",
                    }}
                  />

                
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Repayment (Per Month){" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      
                      defaultValue={
                        addLoanData &&
                        addLoanData.repayment_per_month &&
                        addLoanData.repayment_per_month
                      }
                      type="text"
                      name="repayment_per_month"
                      onChange={(e) =>
                        setAddLoanData({
                          ...addLoanData,
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

                  {customError.name == "repayment_per_month" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Total Paid Amount <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      
                      defaultValue={
                        addLoanData &&
                        addLoanData.total_paid_amount &&
                        addLoanData.total_paid_amount
                      }
                      disabled={addLoanData && addLoanData._id ? true : false}
                      name="total_paid_amount"
                      type="text"
                      onChange={(e) =>
                        setAddLoanData({
                          ...addLoanData,
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

                  {customError.name == "total_paid_amount" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Refference Document</Form.Label>
                  <div className="fileuploadForm">
                    <input
                      onChange={(e) => onDocumentChange(e)}
                      type="file"
                    />
                    {addLoanData.reference_document && addLoanData.reference_document.name ? (
                      <span>
                        {""}
                        {addLoanData &&
                          addLoanData.reference_document &&
                          addLoanData.reference_document.name.split("_").pop()}
                      </span>
                    ) : (
                      <span>Choose File</span>
                    )}
                  </div>

                </Form.Group>
                
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} xs="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => setModalNewloanLogShow(false)}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    className="submit_btn shadow-0"
                    disabled={resultLoad === true ? true : false}
                    onClick={addLoanFunc}
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
        show={modalPaidlogShow}
        onHide={setModalPaidlogShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {addPaidLogData && addPaidLogData._id
              ? "Update Paid Log for Loan"
              : "Add paid log for Loan"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form
            // noValidate
            // validated={validatedPaidlog}
            // onSubmit={handleSubmitPaidLog}
            >
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Total Paid</Form.Label>
                  <Form.Control
                    required
                    defaultValue={addPaidLogData && addPaidLogData.total_paid}
                    onChange={(e) =>
                      setAddPaidLogData({
                        ...addPaidLogData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    name="total_paid"
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
                  {customError.name == "total_paid" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>As of Date</Form.Label>
                  <DatePicker
                    name="as_of_date"
                    data={addPaidLogData && addPaidLogData.as_of_date}
                    datePickerChange={asOfDateChangeHandel}
                    // message={"Please enter As of Date"}
                  />
                  {customError.name == "as_of_date" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => setModalPaidlogShow(false)}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    onClick={addPaidLog}
                    className="submit_btn shadow-0"
                    disabled={paidLoader === true ? true : false}
                  >
                    {paidLoader && paidLoader === true ? (
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

export default SurvivorsLoan;
