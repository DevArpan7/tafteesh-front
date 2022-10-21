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
import queryString from "query-string";
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import {
  getSurvivorDetails,
  getSurvivalIncomeList,
  getModulesChangeLog,
  getIncomeTypeList,

} from "../../redux/action";
import moment from "moment";
import IncomeDataTable from "./IncomeDataTable";
import AlertComponent from "../../components/AlertComponent";
import { gotoSurvivorArchive } from "../../utils/helper";

const SurvivorsIncome = (props) => {
  const [modalIncomShow, setModalIncomShow] = useState(false);
  const [addIncomeData, setAddIncomeData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const [validated, setValidated] = useState(false);

  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const incomeTypeList =  useSelector((state) => state.incomeTypeList);
  const incomeList = useSelector((state) => state.incomeList);
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

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
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [messagType, setMessagType] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const currentModule = localStorage.getItem("currentModule");
  var userAccessData = JSON.parse(localStorage.getItem("userAccess"));

  useEffect(() => {
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
  }, [props]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [incomeList]);

  useEffect(() => {
    if (props.location.state) {
      dispatch(getSurvivorDetails(props.location.state));
      dispatch(getSurvivalIncomeList(props.location.state));
      dispatch(getIncomeTypeList())
    }
  }, [props]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValidated(false);
    setOpen(false);
  };

  const onCancel = () => {
    setModalIncomShow(false);
    setValidated(false);
  };


///// api call function for mode of earning by income type//////
  const onTypeSelect = (e) => {
    setAddIncomeData({
      ...addIncomeData,
      [e.target.name]: e.target.value,
    })
    getModeofEarningByType(e.target.value);
  };

  const [modeofEarningList, setModeofEarningList] = useState([]);
  ///////// api call for get purpose of grant ///
  const getModeofEarningByType = (id) => {
    axios
      .get(api + "/mode-of-earning/list/" + id, axiosConfig)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;
          setModeofEarningList(data.data);
        }
      })
      .catch((error) => {});
  };


  const gotoAdd = () => {
    setSelectedData({});
    setActiveClass(false);
    setModalIncomShow(true);
    setAddIncomeData({});
    setSelectedProduct5(null)

  };
  const gotoEdit = () => {

    if(!selectedData._id){
      setShowAlert(true);
      setAlertMessage("Please select one Income");
      setAlertFlag("alert");
    }else{
    setModalIncomShow(true);
    setAddIncomeData(selectedData);
    setShowAlert(false);
    setAlertMessage("");
    setAlertFlag("");
    }
  };
  const onSelectRow = (item) => {
    if(item !==null){
    setSelectedData(item);
    setActiveClass(true);
    setSelectedProduct5(item)
    }else{
      setSelectedData({});
      setSelectedProduct5(null)
      setActiveClass(false);
  
    }
  };

  const changeLogFunc = () => {
    let type = "income";
    dispatch(getModulesChangeLog(type,deletedById,props.location.state));
    props.history.push("/change-log");
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      setShowAlert(true);
      setAlertMessage("Please select one Income");
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
    setDeleteLoader(true)
    axios
      .patch(api + "/survival-income/delete/" + selectedData._id, body,axiosConfig)
      .then((response) => {
        setDeleteLoader(false)
        handleClick();
        setMessagType("success")
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({});
      setSelectedProduct5(null)

          dispatch(
            getSurvivalIncomeList(props.location && props.location.state)
          );
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        setDeleteLoader(false)

        ////console.log(error, "partner error");
      });
  };
 

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);



    
  const [customError, setCustomError] = useState({ name: "", message: "" });
  const [resultLoad, setResultLoad] = useState(false);

  useEffect(() => {
   if(addIncomeData && addIncomeData.income_type) {
      setCustomError({
        name: "income_type",
        message: "",
      });
    }else if(addIncomeData && addIncomeData.income_mode) {
      setCustomError({
        name: "income_mode",
        message: "",
      });
    }else if(addIncomeData && addIncomeData.amount) {
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
  }, [addIncomeData]);
  /////// add income api call function //////
  const addIncomeFunc = (e) => {
    e.preventDefault();
     if(addIncomeData && !addIncomeData.income_type) {
      setCustomError({
        name: "income_type",
        message: "Please select Type of Income",
      });
    }else if(addIncomeData && !addIncomeData.income_mode) {
      setCustomError({
        name: "income_mode",
        message: "Please select Income mode",
      });
    } else if(addIncomeData && !addIncomeData.amount) {
      setCustomError({
        name: "amount",
        message: "Please enter Amount",
      });
    }
     else {
      setCustomError({
        name: "",
        message: "",
      });
    
    var addData = {
      ...addIncomeData,
      survivor: props.location && props.location.state,
    };
    var updateData = {
      ...addIncomeData,
      survivor: props.location && props.location.state,
      user_id: deletedById && deletedById,
    };
    if (addIncomeData && addIncomeData._id) {
      setResultLoad(true);
      axios
        .patch(
          api + "/survival-income/update/" + addIncomeData._id,
          updateData,
          axiosConfig
        )
        .then((response) => {
          //console.log(response);
          handleClick();
        setMessagType("success")

          setValidated(false);
          setResultLoad(false);
          setUpdateMessage(response && response.data.message);
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvivalIncomeList(props.location.state));
            setAddIncomeData({});

            setModalIncomShow(false);
            setActiveClass(false);
          } else {
            handleClick();
            setUpdateMessage(response && response.data.message);
          }
        })
        .catch((error) => {
          //console.log(error, "error");
          handleClick();
          setUpdateMessage(error && error.message);
          setResultLoad(false);
          
        });
    } else {
      setResultLoad(true);
      axios
        .post(api + "/survival-income/create", addData, axiosConfig)
        .then((response) => {
          //console.log(response);
          handleClick();
          setValidated(false);
          setResultLoad(false);
          setMessagType("success")

          setUpdateMessage(response && response.data.message);
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvivalIncomeList(props.location.state));
            setAddIncomeData({});
            setModalIncomShow(false);
      setSelectedProduct5(null)

            setActiveClass(false);
          }
        })
        .catch((error) => {
          //console.log(error, "error");
          handleClick();
          setUpdateMessage(error && error.message);
          setResultLoad(false);

        });
    }
  }
  };
  //console.log(incomeList, "incomeeeeeeeeeeeeeeeeeee");

  //export csv function///

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

  //archive

  let url = props.location.search;
  let getId = queryString.parse(url, { parseNumbers: true });

  //console.log(getId, "getId");
  const history = useHistory();

  const gotoArchiveList = (e) => {
    //console.log(props.location.state, "props.location.state");
    gotoSurvivorArchive(e, "income", props.location.state, history);
  };


  
  const exportToCsv = (e) => {
    e.preventDefault();

    // Headers for each column
    let headers = [" Id,Amount,Mode Of Earning,Source,Survivor,Type,createdAt"];

    // Convert users data to a csv
    let usersCsv = incomeList.data.reduce((acc, user) => {
      const {
        _id,
        amount,
        income_mode,
        source,
        survivor,
        income_type,
        createdAt,
      } = user;
      acc.push(
        [
          _id,
          amount,
          income_mode && income_mode.name,
          source,
          survivorDetails && survivorDetails.survivor_name,
          income_type && income_type.name,
          formatDate(createdAt),
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "incomeList.csv",
      fileType: "text/csv",
    });
  };

  ////////////download pdf////////////////
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
    doc.text("SURVIVOR INCOME LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "Id",
      "Amount",
      "Mode Of Earning",
      "Source",
      "Survivor",
      "Type",
      "Created At",
    ];
    const name = "survivor-Income-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    incomeList.data?.forEach((item) => {
      const temp = [
        item._id,
        item.amount,
        item.income_mode && item.income_mode.name,
        item.source,
        survivorDetails && survivorDetails.survivor_name,
        item.income_type && item.income_type.name,
        formatDate(item.createdAt),
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
              <h2 className="page_title">Income</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Income</MDBBreadcrumbItem>
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
                    <Dropdown.Item onClick={downloadPdf}>
                      Download PDF
                    </Dropdown.Item>
                    <Dropdown.Item onClick={exportToCsv}>
                      Export CSV
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => changeLogFunc()}>
                      Change Log
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => gotoArchiveList(e)}>
                      Archive List
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
              {currentModule &&
                JSON.parse(currentModule).can_edit == true && 
                  <MDBTooltip
                    tag="button"
                    wrapperProps={{ className: "add_btn view_btn" }}
                    title="Add"
                  >
                    <span onClick={() => gotoAdd()}>
                      <i className="fal fa-plus-circle"></i>
                    </span>
                  </MDBTooltip>
                 } 
                  
                  {currentModule && JSON.parse(currentModule).can_edit == true && 
                  <MDBTooltip
                    tag="a"
                    wrapperProps={{ className: "edit_btn" }}
                    title="Edit"
                  >
                    <span onClick={() => gotoEdit()}>
                      <i className="fal fa-pencil"></i>
                    </span>
                  </MDBTooltip>
                }
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
            {currentModule && JSON.parse(currentModule).can_view == true &&
            incomeList && incomeList.totalIncome && (
              <h4 className="mb-4 small_heading">
                Total Family Income (Monthly) :{" "}
                {incomeList && numberFormat(incomeList.totalIncome)}
              </h4>
            )}
            
            {currentModule && JSON.parse(currentModule).can_view == true && (
              <div className="table-responsive medium-mobile-responsive">
                <IncomeDataTable
                selectedProduct5={selectedProduct5}
                  incomeList={
                    incomeList &&
                    incomeList.data &&
                    incomeList.data.length > 0 &&
                    incomeList.data
                  }
                  onSelectRow={onSelectRow}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalIncomShow}
        onHide={setModalIncomShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
        backdrop={"static"}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           {addIncomeData && addIncomeData._id ? "Update Income" : "Add Income"} 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form 
            >
              <Row>
              <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Type  <span className="requiredStar">*</span></Form.Label>
                  <Form.Select
                    name="income_type"
                    value={
                      addIncomeData && addIncomeData.income_type && addIncomeData.income_type._id
                    }
                    onChange={(e) =>
                      onTypeSelect(e)
                    }
                  >
                    <option value={''} hidden={true}>Default select</option>
                    {incomeTypeList && incomeTypeList.length>0 && incomeTypeList.map((item)=>{
                      return(
                        <option value={item && item._id}>{item && item.name}</option>
                      )
                    })}
                  </Form.Select>
                  {customError.name == "income_type" && (
                    <small className="mt-4 mb-2 text-danger">
                      {customError && customError.message}
                    </small>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Mode of earning  <span className="requiredStar">*</span></Form.Label>
                  <Form.Select
                    name="income_mode"
                    value={
                      addIncomeData &&
                      addIncomeData.income_mode &&
                      addIncomeData.income_mode._id
                    }
                    onChange={(e) =>
                      setAddIncomeData({
                        ...addIncomeData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Default select</option>
                    {modeofEarningList && modeofEarningList.length > 0 && modeofEarningList.map((item)=>{
                      return(
                        <option value={item && item._id}>{item && item.name}</option>

                      )
                    })}
                  </Form.Select>
                  {customError.name == "income_mode" && (
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
                        addIncomeData &&
                        addIncomeData.amount &&
                        addIncomeData.amount
                      }
                      onChange={(e) =>
                        setAddIncomeData({
                          ...addIncomeData,
                          [e.target.name]: e.target.value.trim(),
                        })
                      }
                      name="amount"
                      type="text"
                      onKeyPress={(e) =>{
                        if (!/[0-9\s]/.test(e.key)) {
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
                  <Form.Label>Source</Form.Label>
                  <Form.Control
                    name="source"
                    value={
                      addIncomeData &&
                      addIncomeData.source &&
                      addIncomeData.source
                    }
                    onChange={(e) =>
                      setAddIncomeData({
                        ...addIncomeData,
                        [e.target.name]: e.target.value.trim(),
                      })
                    }
                    onKeyPress={(e) =>{
                      if (!/[a-zA-Z\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e)=> {
                      e.preventDefault();
                    }}
                  />
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

                    // disabled={
                    //   addIncomeData && !addIncomeData.amount ? true : false
                    // }
                    onClick={addIncomeFunc}
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
      {showAlert === true && (
        <AlertComponent
        alertFlag={alertFlag}
        alertMessage={alertMessage}
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          deleteLoader={deleteLoader}
          onDeleteFunction={onDeleteFunction}
        />
      )}
    </>
  );
};

export default SurvivorsIncome;
