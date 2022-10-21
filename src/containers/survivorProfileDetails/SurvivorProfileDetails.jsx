import React, { useState, useEffect } from "react";
import { Topbar } from "../../components";
import user from "../../assets/img/user.jpg";
import "./survivorprofiledetails.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import queryString from "query-string";
import AlertComponent from "../../components/AlertComponent";

import {
  getSurvivorDetails,
 
} from "../../redux/action";
import moment from "moment";
import {
  findAncestor,
  goToSurvivorFir,
  goToSurvivorInvestBysurvivor,
  gotoSurvivorChargeBySurv,
} from "../../utils/helper";

const SurvivorProfileDetails = (props) => {
  const [loader, setLoader] = useState(true);
  const survivorActionDetails = useSelector(
    (state) => state.survivorActionDetails
  );
  const survivorDetails = useSelector((state) => state.survivorDetails);

  //console.log(props, "social worker");
  const { data } = props.location;
  const dispatch = useDispatch();
  const history = useHistory();

  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };

  let url = props.location.search;
  let getId = queryString.parse(url, { parseNumbers: true });
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const handleShow = () => setShowAlert(true);
  const [showAlert, setShowAlert] = useState(false);

  //console.log(getId, "getId");

  useEffect(() => {
    if(survivorDetails && survivorDetails._id){
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }
  }, [survivorDetails]);

  useEffect(() => {
    if (getId.survivorId) {
      dispatch(getSurvivorDetails(getId.survivorId));
    }
  }, [getId.survivorId]);

  // useEffect(() => {
  //     //console.log(survivalGrantList, "survivalGrantList");
  // }, [survivalGrantList])

  //// go to document ////
  const handleCloseAlert = () => {
    setAlertMessage("");
    setAlertFlag("");
    setShowAlert(false);
  };
  const gotoDocument = () => {
      //console.log(survivorDetails,"survivorDetails")
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else {
      props.history.push({
        pathname: "/survivor-document",
        state: getId.survivorId,
      });
    }
  };

  const gotRescue = () => {
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else {
    props.history.push({
      pathname: "/survivor-rescue",
      state: getId.survivorId,
    });
}
  };

  const gotVc = () => {
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else {
    props.history.push({ pathname: "/survivor-vc", state: getId.survivorId });
    }
  };

  const goToFir = (e) => {
    //console.log(e, "eeee");
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    }else if (
        survivorActionDetails &&
        survivorActionDetails.rescue &&
        survivorActionDetails.rescue.exist === false
      ) {
        setAlertFlag("alert");
        setAlertMessage(
          "Please Add Rescue First to Take any Action for Survivor"
        );
        handleShow();
      } else {
    goToSurvivorFir(e, getId.survivorId, history);
    }
    // props.history.push({ pathname: "/survivor-fir", state: getId.survivorId })
  };

  const gotoParticipationPage = () => {
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else {
    props.history.push({
      pathname: "/survivor-participation",
      state: getId.survivorId,
    });
}
  };

  const gotChargeSheet = (e) => {
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
        survivorActionDetails &&
        survivorActionDetails.rescue &&
        survivorActionDetails.rescue.exist === false
      ) {
        setAlertFlag("alert");
        setAlertMessage(
          "Please Add Rescue First to Take any Action for Survivor"
        );
        handleShow();
      }else {
    gotoSurvivorChargeBySurv(e, getId.survivorId, history);
    }
    // props.history.push({ pathname: "/survivor-chargesheet", state: getId.survivorId })
  };

  const gotoInvestigation = (e) => {
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else if (
        survivorActionDetails &&
        survivorActionDetails.rescue &&
        survivorActionDetails.rescue.exist === false
      ) {
        setAlertFlag("alert");
        setAlertMessage(
          "Please Add Rescue First to Take any Action for Survivor"
        );
        handleShow();
      }else {
    goToSurvivorInvestBysurvivor(e, getId.survivorId, history);
    }
    // props.history.push({ pathname: "/survivor-investigation", state: getId.survivorId })
  };

  const gotoShelterHome = () => {
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else {
    props.history.push({
      pathname: "/survivor-shelter-home",
      state: getId.survivorId,
    });
}
  };

  const gotoNextPaln = () => {
    props.history.push({ pathname: "/my_diary", state: getId.survivorId });
  };

  const gotoPc = () => {
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else {
    props.history.push({ pathname: "/survivor-pc", state: getId.survivorId });
    }
  };

  const gotoSurvivorLoan = () => {
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else {
    props.history.push({ pathname: "/survivor-loan", state: getId.survivorId });
    }
  };

  const gotoSurvivorIncome = () => {
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else {
    props.history.push({
      pathname: "/survivor-income",
      state: getId.survivorId,
    });
}
  };

  const gotoSurvivorGrant = () => {
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else {
    props.history.push({
      pathname: "/survivor-grant",
      state: getId.survivorId,
    });
}
  };

  const gotoSurvivorCIT = () => {
    if (
        survivorDetails &&
        survivorDetails.status_in_tafteesh &&
        survivorDetails.status_in_tafteesh === "Dropped out"
    ) {
      setAlertFlag("alert");
      setAlertMessage("Can not add any Action for Dropped out Survivor");
      handleShow();
    } else if (survivorDetails && survivorDetails.approval === false) {
      setAlertFlag("alert");
      setAlertMessage("This Survivor is not Approved by the Admin");
      handleShow();
    } else {
    props.history.push({ pathname: "/survivor-cit", state: getId.survivorId });
    }
  };

  return (
    <>
      <Topbar />
      
        <main className="main_body">
          <div className="bodyright">
            <div className="row justify-content-between mb30">
              <div className="col-auto">
                <h2 className="page_title mb-md-0">
                  Profile Details of{" "}
                  {survivorDetails &&
                    survivorDetails.survivor_name &&
                    survivorDetails.survivor_name}{" "}
                  (
                  {survivorDetails &&
                    survivorDetails.survivor_id &&
                    survivorDetails.survivor_id}
                  )
                </h2>
              </div>
              <div className="col-auto">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb topbreadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/dashboard">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="/survivors">Survivors</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Profile Details
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            {loader && loader === true ? (
        <div class="spinner-border bigSpinner text-info text-center"></div>
      ) : (
            <div className="white_box_shadow_20 single_profile_box mb30">
              <div className="single_profile_box_top">
                <div className="single_profile_box_top_left">
                  <img
                    // src={profileImage}
                    src={
                      survivorDetails && survivorDetails.picture
                        ? survivorDetails.picture[survivorDetails.picture.length-1]
                        : user
                    }
                    alt=""
                  />
                </div>
                <div className="single_profile_box_top_right">
                  <h3>
                    {survivorDetails &&
                      survivorDetails.survivor_name &&
                      survivorDetails.survivor_name}
                  </h3>
                  <ul>
                    {survivorDetails && survivorDetails.phone_no && (
                      <li>
                        <strong>Phone No:</strong>
                        {survivorDetails &&
                          survivorDetails.phone_no &&
                          survivorDetails.phone_no}
                      </li>
                    )}
                    {survivorDetails && survivorDetails.survivor_id && (
                      <li>
                        <strong>Organization ID:</strong>
                        {survivorDetails &&
                          survivorDetails.survivor_id &&
                          survivorDetails.survivor_id}
                      </li>
                    )}
                    <li>
                      {survivorDetails &&
                        survivorDetails.state &&
                        survivorDetails.state.name && (
                          <strong>Address:</strong>
                        )}{" "}
                      <span>
                        {survivorDetails && survivorDetails.state && "State:"}{" "}
                        {survivorDetails &&
                          survivorDetails.state &&
                          survivorDetails.state.name &&
                          survivorDetails.state.name}
                      </span>
                      <span>
                        {survivorDetails && survivorDetails.district && "Dist:"}{" "}
                        {survivorDetails &&
                          survivorDetails.district &&
                          survivorDetails.district.name &&
                          survivorDetails.district.name}
                      </span>
                      <span>
                        {survivorDetails && survivorDetails.block && "Block:"}{" "}
                        {survivorDetails &&
                          survivorDetails.block &&
                          survivorDetails.block.name &&
                          survivorDetails.block.name}
                      </span>
                      <span>
                        {survivorDetails &&
                          survivorDetails.pincode &&
                          "Pincode:"}{" "}
                        {survivorDetails &&
                          survivorDetails.pincode &&
                          survivorDetails.pincode}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              {/* <div className="single_profile_box_bottom">
                        <div className="row justify-content-between align-items-end">
                            <div className="col-auto">
                                <div className='fileupload_button'>
                                    <label>Consent Form</label>
                                    <div className='fileupload_buttoninner'>
                                        <input type="file" />
                                        <span>Upload file</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-auto">
                                <button className='btn addbtn shadow-0'>Download</button>
                            </div>
                        </div>
                    </div> */}
            </div>
        )}

            <div className="single_profile_basic_details mb30">
              <h2 className="white_box_title">Basic Details</h2>
              {loader && loader === true ? (
                <div class="spinner-border bigSpinner text-info"></div>
              ) : (
                <div className="white_box_shadow">
                  <div className="survivor_card_bar">
                    <ul>
                      <li>
                        <h6 className="mb-2">Survivor ID</h6>
                        <h5 className="mb-0">
                          {survivorDetails &&
                            survivorDetails.survivor_id &&
                            survivorDetails.survivor_id}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">Name</h6>
                        <h5>
                          {survivorDetails &&
                            survivorDetails.survivor_name &&
                            survivorDetails.survivor_name}{" "}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">Gender</h6>
                        <h5>
                          {survivorDetails &&
                            survivorDetails.gender &&
                            survivorDetails.gender}{" "}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">Date of Trafficking</h6>
                        <h5>
                          {survivorDetails &&
                            survivorDetails.date_of_trafficking &&
                            moment(survivorDetails.date_of_trafficking).format(
                              "DD-MMM-YYYY"
                            )}{" "}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">Rescue?</h6>
                        <h5>
                          {survivorActionDetails &&
                          survivorActionDetails.rescue &&
                          survivorActionDetails.rescue.exist === true
                            ? "Yes"
                            : "No"}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">Procedural Correction </h6>
                        <h5>
                          {survivorActionDetails &&
                          survivorActionDetails.pc &&
                          survivorActionDetails.pc.exist === true
                            ? "Yes"
                            : "No"}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">Victim Compensation</h6>
                        <h5>
                          {survivorActionDetails &&
                          survivorActionDetails.vc &&
                          survivorActionDetails.vc.exist === true
                            ? "Yes"
                            : "No"}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">CIT</h6>
                        <h5>
                          {survivorActionDetails &&
                          survivorActionDetails.cit &&
                          survivorActionDetails.cit.exist === true
                            ? "Yes"
                            : "No"}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">Leadership</h6>
                        <h5>NA</h5>
                      </li>
                      <li>
                        <h6 className="mb-2">Financial Inclusion</h6>
                        <h5>
                          {(survivorActionDetails &&
                            survivorActionDetails.income &&
                            survivorActionDetails.income.exist === true &&
                            "Yes") ||
                          (survivorActionDetails &&
                            survivorActionDetails.loan &&
                            survivorActionDetails.loan.exist === true)
                            ? "Yes"
                            : "No"}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">Status of Tafteesh</h6>
                        <h5>
                          {survivorDetails &&
                            survivorDetails.status_in_tafteesh &&
                            survivorDetails.status_in_tafteesh}{" "}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">Place of rescue</h6>
                        <h5>
                          {survivorActionDetails &&
                            survivorActionDetails.rescue &&
                            survivorActionDetails.rescue.place_of_rescue}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">
                          Months since the survivor got trafficked at SA
                        </h6>
                        <h5>
                          {survivorActionDetails &&
                            survivorActionDetails.trafficking &&
                            survivorActionDetails.trafficking.sinceMonth &&
                            survivorActionDetails.trafficking.sinceMonth}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">
                          Months between when trafficked and when case concluded
                          at SA
                        </h6>
                        <h5>NA</h5>
                      </li>
                      <li>
                        <h6 className="mb-2">
                          Months since the survivor rescued
                        </h6>
                        <h5>
                          {survivorActionDetails &&
                            survivorActionDetails.rescue &&
                            survivorActionDetails.rescue.sinceMonth &&
                            survivorActionDetails.rescue.sinceMonth}
                        </h5>
                      </li>
                      <li>
                        <h6 className="mb-2">
                          Months between when rescued and when case concluded at
                          DA
                        </h6>
                        <h5>NA</h5>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="white_box_shadow_20 survivors_details_table_wrap survivors_table_wrap">
              <div className="table-responsive">
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <td>Surivor Docoments</td>
                      <td>
                        {survivorActionDetails &&
                        survivorActionDetails.document &&
                        survivorActionDetails.document.exist === true ? (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td width="10%">
                        {survivorActionDetails &&
                        survivorActionDetails.document &&
                        survivorActionDetails.document.exist === true ? (
                          <button
                            onClick={() => gotoDocument()}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => gotoDocument()}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Rescue</td>
                      <td>
                        {survivorActionDetails &&
                        survivorActionDetails.rescue &&
                        survivorActionDetails.rescue.exist === true ? (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                        {survivorActionDetails &&
                        survivorActionDetails.rescue &&
                        survivorActionDetails.rescue.exist === true ? (
                          <button
                            onClick={() => gotRescue()}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => gotRescue()}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>FIR</td>
                      <td>
                        {survivorActionDetails &&
                        survivorActionDetails.fir &&
                        survivorActionDetails.fir.exist === true ?  (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.fir &&
                        survivorActionDetails.fir.exist === true ?  (
                          <button
                            onClick={(e) => goToFir(e)}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={(e) => goToFir(e)}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Investigation</td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.investigation &&
                        survivorActionDetails.investigation.exist === true ? (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.investigation &&
                        survivorActionDetails.investigation.exist === true ?  (
                          <button
                            onClick={(e) => gotoInvestigation(e)}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={(e) => gotoInvestigation(e)}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Chargesheet</td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.chargesheet &&
                        survivorActionDetails.chargesheet.exist === true ? (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.chargesheet &&
                        survivorActionDetails.chargesheet.exist === true ? (
                          <button
                            onClick={(e) => gotChargeSheet(e)}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={(e) => gotChargeSheet(e)}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr>
                    
                    {/* <tr>
                      <td>Participation</td>
                      <td>
                        {participationList && participationList.length > 0 ? (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                        {participationList && participationList.length > 0 ? (
                          <button
                            onClick={() => gotoParticipationPage()}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => gotoParticipationPage()}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr> */}
                    <tr>
                      <td>Shelter home</td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.shelterHome &&
                        survivorActionDetails.shelterHome.exist === true ? (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.shelterHome &&
                        survivorActionDetails.shelterHome.exist === true ? (
                          <button
                            onClick={() => gotoShelterHome()}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => gotoShelterHome()}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr>
                    {/* <tr>
                      <td>Next Plan/Action </td>
                      <td>
                        {nextPlanList && nextPlanList.length > 0 ? (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                        {nextPlanList && nextPlanList.length > 0 ? (
                          <button
                            onClick={() => gotoNextPaln()}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => gotoNextPaln()}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr> */}
                    <tr>
                      <td>Victim Compensation</td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.vc &&
                        survivorActionDetails.vc.exist === true ?  (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.vc &&
                        survivorActionDetails.vc.exist === true ?   (
                          <button
                            onClick={() => gotVc()}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => gotVc()}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Procedural Correction</td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.pc &&
                        survivorActionDetails.pc.exist === true ?  (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.pc &&
                        survivorActionDetails.pc.exist === true ?  (
                          <button
                            onClick={() => gotoPc()}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => gotoPc()}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Loan</td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.loan &&
                        survivorActionDetails.loan.exist === true ? (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.loan &&
                        survivorActionDetails.loan.exist === true ?(
                          <button
                            onClick={() => gotoSurvivorLoan()}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => gotoSurvivorLoan()}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Income</td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.income &&
                        survivorActionDetails.income.exist === true ? (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.income &&
                        survivorActionDetails.income.exist === true ?(
                          <button
                            onClick={() => gotoSurvivorIncome()}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => gotoSurvivorIncome()}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Grant</td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.grant &&
                        survivorActionDetails.grant.exist === true ? (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.grant &&
                        survivorActionDetails.grant.exist === true ?  (
                          <button
                            onClick={() => gotoSurvivorGrant()}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => gotoSurvivorGrant()}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>CIT</td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.cit &&
                        survivorActionDetails.cit.exist === true ?  (
                          <div className="availabletext">
                            <i className="far fa-check-circle"></i>
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="unavailabletext">
                            <i className="far fa-times-circle"></i>
                            <span>Unavailable</span>
                          </div>
                        )}
                      </td>
                      <td>
                      {survivorActionDetails &&
                        survivorActionDetails.cit &&
                        survivorActionDetails.cit.exist === true ?  (
                          <button
                            onClick={() => gotoSurvivorCIT()}
                            className="profiledetailsview"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => gotoSurvivorCIT()}
                            className="profiledetailsadd"
                          >
                            Add Now
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
   
         {showAlert === true && (
        <AlertComponent
          alertFlag={alertFlag}
          alertMessage={alertMessage}
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
        />
      )}
    </>
  );
};

export default SurvivorProfileDetails;
