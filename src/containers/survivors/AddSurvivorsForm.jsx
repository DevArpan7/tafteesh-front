import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, Form } from "react-bootstrap";
import profileImage from "../../assets/img/UploadtoCloud.png";
import attachmentImage from "../../assets/img/attachmentIcon.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import { NavLink, useHistory } from "react-router-dom";
import moment from "moment";
import DatePicker from "../../components/DatePicker";
import {
  getStateList,
  getDistrictList,
  getBlockList,
  getShgList,
  getPoliceStationList,
  getCollectivesList,
  getSurvivorStatusList,
} from "../../redux/action";
import { InputGroup } from "react-bootstrap";

import { Autocomplete, TextField } from "@mui/material";
import docFile from "../../assets/img/documentfiles.png";

const AddSurvivorsForm = (props) => {
  const [loader, setLoader] = useState(true);
  const [resultLoad, setResultLoad] = useState(false);
  const [validated, setValidated] = useState(false);
  const [survivorData, setSurvivorData] = useState({});
  const userId = localStorage.getItem("userId");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/survival-profile";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };

  const organizationId = localStorage.getItem("organizationId");
  const history = useHistory();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const stateList = useSelector((state) => state.stateList);
  const districtList = useSelector((state) => state.districtList);
  const blockList = useSelector((state) => state.blockList);
  const shgList = useSelector((state) => state.shgList);
  const collectivesList = useSelector((state) => state.collectivesList);
  const policeStationList = useSelector((state) => state.policeStationList);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [fileSelect, setFileSelect] = useState([]);
  const [pictureData, setPictureData] = useState({});
  const [pictureArr, setPictureArr] = useState();

  const [document, setDocument] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [contentDocs, setContentDocs] = useState({});
  const [errors, setErrors] = useState({});
  const [messagType, setMessagType] = useState("");
  const [customError, setCustomError] = useState({ name: "", message: "" });
  const survivorStatusList = useSelector((state) => state.survivorStatusList);

  console.log(document, "document");
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
    // initFilters1();
  }, [survivorDetails]);
  ////console.log(survivorData,"survivorData");
  useEffect(() => {
    dispatch(getStateList());
    dispatch(getShgList());
    dispatch(getPoliceStationList());
    dispatch(getCollectivesList());
    dispatch(getSurvivorStatusList());
  }, []);

  ////console.log(shgList, "shgList");

  const getDistListByState = (e) => {
    setSurvivorData({
      ...survivorData,
      [e.target.name]: e.target.value,
    });
    if (!errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
    dispatch(getDistrictList(e.target.value));
  };
  useEffect(() => {
    // console.log(survivorDetails,"picture")
    setSurvivorData(survivorDetails);
    setPictureArr(survivorDetails && survivorDetails.picture);
  }, [survivorDetails]);

  // useEffect(() => {
  //   dispatch(getSurvivorDetails(props && props.survivorId))
  // }, [props]);

  useEffect(() => {
    // console.log(survivorDetails,"survivorDetails")
    if (survivorDetails && survivorDetails._id) {
      // setSurvivorData(survivorDetails);
      dispatch(
        getBlockList(
          survivorDetails && survivorDetails.state && survivorDetails.state._id,
          survivorDetails.district && survivorDetails.district._id
        )
      );
      dispatch(
        getDistrictList(
          survivorDetails && survivorDetails.state && survivorDetails.state._id
        )
      );
    }
    // setSurvivorData(survivorDetails);
    // setPictureArr(survivorDetails && survivorDetails.picture);
  }, [survivorDetails]);

  // console.log(document,"document")

  useEffect(() => {
    //console.log(districtList,"districtList")
    if (districtList && districtList.length > 0) {
      dispatch(getBlockList(survivorData.state, survivorData.district));
    } else {
      dispatch({ type: "BLOCK_LIST", data: [] });
    }
  }, [districtList]);

  const getBlockListByDist = (e) => {
    setSurvivorData({
      ...survivorData,
      [e.target.name]: e.target.value,
    });
    if (!errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
    dispatch(getBlockList(survivorData.state, e.target.value));
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValidated(false);
    // setSurvivorData({});
    setOpen(false);
  };

  const onCancelBtn = (e) => {
    // to="/survivors"
    e.preventDefault();
    setValidated(false);
    setSurvivorData({});
    setPictureArr([]);
    setFileSelect([]);
    setPictureData({});
    setCustomError({ name: "", message: "" });
    history.goBack();
  };
  //console.log(survivorData, "survivorData");

  const handleFileInput = (e, flag) => {
    let data = e.target.files[0];
    // if (flag === "picture") {
    //   setFileSelect([...fileSelect, e.target.files[0]]);
    // } else {
    //   setDocument(e.target.files[0]);
    // }
    storeFile(data, flag);
  };

  //////// store file onchange function //////

  const storeFile = (file, flag) => {
    ////console.log(file);
    if (flag === "picture") {
      setFileSelect([...fileSelect, file]);
    } else {
      setDocument(file);
    }
    let arr = pictureArr && pictureArr.length > 0 ? [...pictureArr] : [];
    // console.log(arr,"beforearr")
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        "https://tafteesh-staging-node.herokuapp.com/api/file/upload",
        formData,
        axiosConfig
      )
      .then(function (response) {
        console.log(response, "response");
        if (response && response.data.error === false) {
          const { data } = response;

          if (flag === "picture") {
            if (
              (data &&
                data.data &&
                data.data.file &&
                data.data.file.mimetype == "image/png") ||
              data.data.file.mimetype == "image/jpg" ||
              data.data.file.mimetype == "image/jpeg"
            ) {
              arr.push(
                "https://tafteesh-staging-node.herokuapp.com/" + data.data?.filePath
              );

              // console.log(arr,"arr")
              setPictureArr(arr);

              setPictureData(data.data);
            } else {
              handleClick();
              setUpdateMessage("upload only png,jpg,jpeg format");
              setMessagType("error");
            }
          } else {
            setSurvivorData({
              ...survivorData,
              consent_form: `https://tafteesh-staging-node.herokuapp.com/${data.data?.filePath}`,
            });

            setContentDocs(data.data);
          }

          //console.log("data.data", data.data);
        } else {
          if (flag !== "picture") {
            // setSurvivorData({
            //   ...survivorData,
            //   consent_form: "",
            // });
          }

          handleClick();
          setUpdateMessage(
            response && response.data && response.data.data.message
          );
          setMessagType("error");
        }
      })
      .catch((err) => {
        ////console.log(err);
      });
  };
  // console.log(survivorData, "survivorData");
  /**
   *  this section is not needed
   */
  // useEffect(() => {
  //   //console.log("pictureData && pictureData.filePath", pictureData, pictureData.filePath);
  //   let image = `https://tafteesh-staging-node.herokuapp.com/${
  //     pictureData && pictureData.filePath
  //   }`;
  //   if(pictureData && pictureData.filePath){
  //     //console.log("imageimageimage", image, pictureArr);
  //       setPictureArr([...pictureArr, image]);
  //     //console.log("imageimageimage", image, pictureArr);

  //     // if (pictureArr != undefined) {
  //     // } else {
  //     //   setPictureArr([image]);
  //     // }

  //     // // setPictureArr( prev => {
  //     // //   if (prev != undefined) {
  //     // //     return [...prev, image]
  //     // //   }
  //     // //   return image;
  //     // // } );
  //     // setPictureArr(image);
  //   }
  // }, [pictureData]);

  const onHandleChange = (e) => {
    setSurvivorData({
      ...survivorData,
      [e.target.name]:
        e.target.name != "picture" ? e.target.value.trim() : e.target.value,
    });
  };

  ///// age of now
  const calculate_age = (dob1) => {
    var today = new Date();
    var birthDate = new Date(dob1); // create a date object directly from `dob1` argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    //console.log(age_now);
    setSurvivorData({
      ...survivorData,
      age_now: age_now,
    });
    return age_now;
  };

  useEffect(() => {
    console.log(survivorData, "survivorData");
    calculate_age(survivorData.date_of_birth);
  }, [survivorData && survivorData.date_of_birth]);

  ////////// age when trafficking ////
  const calculateTraffickedage = (date) => {
    var today = new Date(date);
    var birthDate = new Date(survivorData.date_of_birth); // create a date object directly from `dob1` argument
    var age_when_trafficked = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_when_trafficked--;
    }
    //console.log(age_when_trafficked);
    setSurvivorData({
      ...survivorData,
      age_when_trafficked: age_when_trafficked,
    });
    return age_when_trafficked;
  };

  useEffect(() => {
    calculateTraffickedage(survivorData.date_of_trafficking);
  }, [survivorData && survivorData.date_of_trafficking]);

  useEffect(() => {
    if (survivorData && survivorData.survivor_name) {
      setCustomError({
        name: "survivor_name",
        message: "",
      });
    } else if (survivorData && survivorData.gender) {
      setCustomError({ name: "gender", message: "" });
    } else if (survivorData && survivorData.marital_status) {
      setCustomError({
        name: "marital_status",
        message: "",
      });
    } else if (survivorData && survivorData.state) {
      setCustomError({ name: "state", message: "" });
    } else if (survivorData && survivorData.district) {
      setCustomError({ name: "district", message: "" });
    } else if (survivorData && survivorData.block) {
      setCustomError({ name: "block", message: "" });
    } else if (survivorData && survivorData.village_name) {
      setCustomError({
        name: "village_name",
        message: "",
      });
    } else if (survivorData && survivorData.panchayat_name) {
      setCustomError({
        name: "panchayat_name",
        message: "",
      });
    } else if (survivorData && survivorData.date_of_birth) {
      setCustomError({
        name: "date_of_birth",
        message: "",
      });
    } else if (survivorData && survivorData.date_of_trafficking) {
      setCustomError({
        name: "date_of_trafficking",
        message: "",
      });
    } else if (survivorData && survivorData.police_station) {
      setCustomError({
        name: "police_station",
        message: "",
      });
    } else if (survivorData && survivorData.status_in_tafteesh) {
      setCustomError({
        name: "status_in_tafteesh",
        message: "",
      });
    } else if (survivorData && survivorData.notes_for_status_change) {
      setCustomError({
        name: "notes_for_status_change",
        message: "",
      });
    } else if (survivorData && survivorData.phone_no) {
      setCustomError({ name: "phone_no", message: "" });
    } else if (survivorData && survivorData.alternate_contact_No) {
      setCustomError({ name: "alternate_contact_No", message: "" });
    } else if (survivorData && survivorData.pincode) {
      setCustomError({ name: "pincode", message: "" });
    } else if (survivorData && survivorData.consent_form) {
      setCustomError({ name: "consent_form", message: "" });
    } else {
      setCustomError({ name: "", message: "" });
    }
  }, [survivorData]);

  //console.log(pictureArr, "pictureArr");

  //console.log(customError, "customeerr");

  const addSurvivorFunc = (e) => {
    // //console.log(document.getElementById(),"eeeee")

    e.preventDefault();
    // const el = document.getElementById("field-view");
    var format = /[!@#$%^&*()_+\-=\[\]0-9{};':"\\|,.<>\/?]+/;
    var phonPattern = new RegExp("^((\\+91-?)|0)?[0-9]{10}$");
    var pinPattern = new RegExp("^((\\+91-?)|0)?[0-9]{6}$");
    let pattern = /[0-9\s]{0,}[a-zA-Z]{2,}/g
    if (survivorData && !survivorData.survivor_name) {
      setCustomError({
        name: "survivor_name",
        message: "Please enter Survivor name",
      });
      // window.scrollTo(10, el.offsetTop);
    } else if (
      survivorData &&
      survivorData.survivor_name &&
      format.test(survivorData.survivor_name)
    ) {
      setCustomError({
        name: "survivor_name",
        message: "Please enter valid Survivor name",
      });
      // window.scrollTo(10, el.offsetTop);
    } else if (survivorData && !survivorData.gender) {
      setCustomError({ name: "gender", message: "Please select Gender" });
      // window.scrollTo(10, el.offsetTop);
    } else if (survivorData && !survivorData.marital_status) {
      setCustomError({
        name: "marital_status",
        message: "Please select Merital Status",
      });
      // window.scrollTo(10, el.offsetTop);
    } else if (survivorData && !survivorData.state) {
      setCustomError({ name: "state", message: "Please select State" });
      // window.scrollTo(5, el.offsetTop);
    } else if (survivorData && !survivorData.district) {
      setCustomError({ name: "district", message: "Please select District" });
      // window.scrollTo(5, el.offsetTop);
    } else if (survivorData && !survivorData.block) {
      setCustomError({ name: "block", message: "Please select Block" });
      // window.scrollTo(4, el.offsetTop);
    } else if (survivorData && !survivorData.village_name) {
      setCustomError({
        name: "village_name",
        message: "Please enter Village Name",
      });
      // window.scrollTo(4, el.offsetTop);
    } else if (
      !pattern.test(survivorData.village_name)
    ) {
      setCustomError({
        name: "village_name",
        message: "Please enter valid Village Name",
      });
      // window.scrollTo(4, el.offsetTop);
    } else if (survivorData && !survivorData.panchayat_name) {
      setCustomError({
        name: "panchayat_name",
        message: "Please select Panchayat Name",
      });
      // window.scrollTo(4, el.offsetTop);
    } else if (survivorData && !survivorData.date_of_birth) {
      setCustomError({
        name: "date_of_birth",
        message: "Please select Date of Birth",
      });
      // window.scrollTo(4, el.offsetTop);
    } else if (survivorData && !survivorData.date_of_trafficking) {
      setCustomError({
        name: "date_of_trafficking",
        message: "Please select Date of Trafficking",
      });
      // window.scrollTo(4, el.offsetTop);
    } else if (survivorData && !survivorData.police_station) {
      setCustomError({
        name: "police_station",
        message: "Please select Police Station",
      });
      // window.scrollTo(4, el.offsetTop);
    } else if (survivorData && !survivorData.status_in_tafteesh) {
      setCustomError({
        name: "status_in_tafteesh",
        message: "Please select Status in Tafteesh",
      });
      // window.scrollTo(2, el.offsetTop);
    } else if (survivorData && !survivorData.notes_for_status_change) {
      setCustomError({
        name: "notes_for_status_change",
        message: "Please enter Notes for Status Change",
      });
      // window.scrollTo(2, el.offsetTop);
    } else if (
      survivorData &&
      survivorData.notes_for_status_change &&
      format.test(survivorData.notes_for_status_change)
    ) {
      setCustomError({
        name: "notes_for_status_change",
        message: "Please enter valid Status",
      });
      // window.scrollTo(10, el.offsetTop);
    } else if (
      survivorData &&
      survivorData.phone_no &&
      survivorData.phone_no < 1000000000
    ) {
      setCustomError({ name: "phone_no", message: "Phone no. is invalid" });
      // window.scrollTo(8, el.offsetTop);
    } else if (
      survivorData &&
      survivorData.phone_no &&
      !phonPattern.test(survivorData.phone_no)
    ) {
      setCustomError({ name: "phone_no", message: "Phone no. is invalid" });
      // window.scrollTo(8, el.offsetTop);
    } else if (
      survivorData &&
      survivorData.alternate_contact_No &&
      survivorData.alternate_contact_No < 1000000000
    ) {
      setCustomError({
        name: "alternate_contact_No",
        message: "Phone no. is invalid",
      });
      // window.scrollTo(8, el.offsetTop);
    } else if (
      survivorData &&
      survivorData.alternate_contact_No &&
      !phonPattern.test(survivorData.alternate_contact_No)
    ) {
      setCustomError({
        name: "alternate_contact_No",
        message: "Phone no. is invalid",
      });
      // window.scrollTo(8, el.offsetTop);
    } else if (
      survivorData &&
      survivorData.pincode &&
      survivorData.pincode < 99999
    ) {
      setCustomError({ name: "pincode", message: "Pin Code is invalid" });
      // window.scrollTo(5, el.offsetTop);
    } else if (
      survivorData &&
      survivorData.pincode &&
      !pinPattern.test(survivorData.pincode)
    ) {
      setCustomError({ name: "pincode", message: "Pin Code is invalid" });
      // window.scrollTo(5, el.offsetTop);
    } else if (survivorData && !survivorData.consent_form) {
      setCustomError({
        name: "consent_form",
        message: "Consent Form is required",
      });
    } else {
      setCustomError({ name: "", message: "" });
      const tempData = {
        ...survivorData,
        organization: organizationId,
        user_id: userId,
        picture: pictureArr,
        // "picture": `https://tafteesh-staging-node.herokuapp.com/${pictureData && pictureData.filePath}`,
        // consent_form: contentDocs && `https://tafteesh-staging-node.herokuapp.com/${contentDocs.filePath}`,
      };

      //console.log(tempData,"tempData")
      var body = tempData;
      //console.log(survivorData, "body");
      if (tempData.survivor_name) {
        if (props && props.survivorId) {
          setResultLoad(true);
          axios
            .patch(api + "/update/" + props.survivorId, body, axiosConfig)
            .then((res) => {
              //console.log(res);
              setResultLoad(false);
              handleClick();
              setUpdateMessage(res && res.data.message);
              setMessagType("success");

              setValidated(false);

              const { data } = res;

              if (res && res.data && res.data.error == false) {
                setSurvivorData({});
                setPictureArr([]);
                setPictureData({});
                setFileSelect([]);
                dispatch({ type: "SURVIVOR_DETAILS", data: {} });
                dispatch({ type: "SHG_LIST", data: [] });
                ////console.log(data, res);
                dispatch({ type: "SURVIVOR_LIST", data: data });
                // history.goBack();
                history.push("/survivors");
              } else {
                handleClick();
                setUpdateMessage(data.data.message);
                setMessagType("error");
              }
            })
            .catch((error) => {
              ////console.log(error);
              setResultLoad(false);
              handleClick();
              setUpdateMessage(error.message);
              setMessagType("error");
            });
        } else {
          setResultLoad(true);
          axios
            .post(api + "/create", body, axiosConfig)
            .then((res) => {
              // //console.log(res,"res")

              setResultLoad(false);
              const { data } = res;

              if (res && res.data && res.data.error == false) {
                handleClick();
                setUpdateMessage(res && res.data.message);
                setValidated(false);
                setMessagType("success");
                dispatch({ type: "SURVIVOR_LIST", data: data });
                setPictureArr([]);
                setFileSelect([]);
                setPictureData({});
                history.push("/survivors");
              } else {
                handleClick();
                setUpdateMessage(data.data.message);
                setMessagType("error");
              }
            })
            .catch((error) => {
              handleClick();
              setUpdateMessage(error.message);
              setMessagType("error");
              setResultLoad(false);

              ////console.log(error);
            });
        }
      }
    }
  };

  return (
    <>
      {loader && loader === true ? (
        <div className="text-center">
          <div class="spinner-border smallSpinnerWidth text-info text-center"></div>
        </div>
      ) : (
        <Form
          id="field-view"
          // noValidate validated={validated} onSubmit={handleSubmit}
        >
          <NotificationPage
            handleClose={handleClose}
            open={open}
            type={messagType}
            message={updateMessage}
          />
          <div className="white_box_shadow_20 survivorsFormCard mb-4">
            <h3 className="survivorsFormCardHeading">
              Personal Details
              <i className="fal fa-user-circle"></i>
            </h3>
            <Row>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="validationCustom01"
              >
                <Form.Label>
                  Name <span className="requiredStar">*</span>
                </Form.Label>
                <Form.Control
                  // required
                  // isInvalid={!errors.survivor_name}
                  type="text"
                  name="survivor_name"
                  placeholder=""
                  onChange={onHandleChange}
                  defaultValue={
                    survivorData &&
                    survivorData.survivor_name &&
                    survivorData.survivor_name
                  }
                  onKeyPress={(event) => {
                    if (!/[a-zA-Z\s]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                />
                {customError.name == "survivor_name" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="gender"
              >
                <Form.Label>
                  Gender <span className="requiredStar">*</span>
                </Form.Label>

                <Form.Select
                  // required
                  onChange={onHandleChange}
                  name="gender"
                  value={
                    survivorData && survivorData.gender && survivorData.gender
                  }
                >
                  <option hidden="true" value={""}>
                    Open this select menu
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="transgender">Transgender</option>
                </Form.Select>
                {customError.name == "gender" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                type="text"
                controlId="validationCustom03"
              >
                <Form.Label>
                  Marital Status <span className="requiredStar">*</span>
                </Form.Label>
                <Form.Select
                  // required
                  onChange={onHandleChange}
                  name="marital_status"
                  value={
                    survivorData &&
                    survivorData.marital_status &&
                    survivorData.marital_status
                  }
                >
                  <option value={""} hidden={true}>
                    Open this select menu
                  </option>
                  <option value="married">Married</option>
                  <option value="single">Single</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </Form.Select>
                {customError.name == "marital_status" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="validationCustom04"
              >
                <Form.Label>No. Children</Form.Label>
                <Form.Control
                  defaultValue={
                    survivorData &&
                    survivorData.no_of_children &&
                    survivorData.no_of_children
                  }
                  onChange={onHandleChange}
                  type="text"
                  placeholder=""
                  name="no_of_children"
                  maxLength={2}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                />
              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="validationCustom03"
              >
                <Form.Label>No. of family members living together</Form.Label>
                <Form.Control
                  type="text"
                  name="no_of_family_member"
                  defaultValue={
                    survivorData &&
                    survivorData.no_of_family_member &&
                    survivorData.no_of_family_member
                  }
                  placeholder=""
                  maxLength={3}
                  onChange={onHandleChange}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                />
                {/* <Form.Control.Feedback type="invalid">
                Please enter no. of family members living together
              </Form.Control.Feedback> */}
              </Form.Group>
            </Row>
          </div>
          <div className="white_box_shadow_20 survivorsFormCard mb-4">
            <h3 className="survivorsFormCardHeading">
              Contact Info
              <i class="fal fa-mobile-android"></i>
            </h3>
            <Row>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="validationCustom04"
              >
                <Form.Label>Phone No</Form.Label>
                <Form.Control
                  onChange={onHandleChange}
                  defaultValue={
                    survivorData &&
                    survivorData.phone_no &&
                    survivorData.phone_no
                  }
                  type="text"
                  placeholder=""
                  name="phone_no"
                  maxLength={10}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                />
                {customError.name == "phone_no" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="validationCustom04"
              >
                <Form.Label>Alternate contact number</Form.Label>
                <Form.Control
                  maxLength={10}
                  onChange={onHandleChange}
                  type="text"
                  placeholder=""
                  defaultValue={
                    survivorData &&
                    survivorData.alternate_contact_No &&
                    survivorData.alternate_contact_No
                  }
                  name="alternate_contact_No"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                />
                {customError.name == "alternate_contact_No" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
            </Row>
          </div>
          <div className="white_box_shadow_20 survivorsFormCard mb-4">
            <h3 className="survivorsFormCardHeading">
              Address
              <i class="fal fa-map-marker-alt"></i>
            </h3>
            <Row>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="validationCustom04"
              >
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control
                  onChange={onHandleChange}
                  type="text"
                  placeholder=""
                  name="address_Line1"
                  defaultValue={
                    survivorData &&
                    survivorData.address_Line1 &&
                    survivorData.address_Line1
                  }
                />
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>
                  State <span className="requiredStar">*</span>
                </Form.Label>
                <Form.Select
                  // required
                  // isInvalid={survivorData && !survivorData.state && !errors.sate}
                  onChange={getDistListByState}
                  name="state"
                  aria-label="Default select example"
                  value={
                    survivorData && survivorData.state && survivorData.state._id
                  }
                >
                  <option hidden="true" value="">
                    Open this select menu
                  </option>

                  {stateList &&
                    stateList.length > 0 &&
                    stateList.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })}
                </Form.Select>
                {customError.name == "state" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>
                  District <span className="requiredStar">*</span>
                </Form.Label>
                <Form.Select
                  // isInvalid={!!errors.district}
                  // required
                  onChange={getBlockListByDist}
                  name="district"
                  value={
                    survivorData &&
                    survivorData.district &&
                    survivorData.district._id
                  }
                  aria-label="Default select example"
                >
                  <option hidden="true" value={""}>
                    Open this select menu
                  </option>
                  {districtList &&
                    districtList.length > 0 &&
                    districtList.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })}
                </Form.Select>
                {customError.name == "district" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>
                  Block <span className="requiredStar">*</span>
                </Form.Label>
                <Form.Select
                  // isInvalid={!!errors.block}
                  // required
                  onChange={onHandleChange}
                  name="block"
                  value={
                    survivorData && survivorData.block && survivorData.block._id
                  }
                  aria-label="Default select example"
                >
                  <option hidden="true" value={""}>
                    Open this select menu
                  </option>
                  {blockList &&
                    blockList.length > 0 &&
                    blockList.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })}
                </Form.Select>
                {customError.name == "block" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>
                  Village <span className="requiredStar">*</span>
                </Form.Label>
                <Form.Control
                  // required
                  onChange={onHandleChange}
                  name="village_name"
                  type="text"
                  placeholder=""
                  defaultValue={
                    survivorData &&
                    survivorData.village_name &&
                    survivorData.village_name
                  }
                  onKeyPress={(event) => {
                    if (!/[a-z A-Z 0-9 - \s]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
                {customError.name == "village_name" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>
                  Panchayat <span className="requiredStar">*</span>
                </Form.Label>
                <Form.Select
                  // required
                  onChange={onHandleChange}
                  name="panchayat_name"
                  value={
                    survivorData &&
                    survivorData.panchayat_name &&
                    survivorData.panchayat_name
                  }
                  aria-label="Default select example"
                >
                  <option hidden={true} value={""}>
                    Open this select menu
                  </option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
                {customError.name == "panchayat_name" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  defaultValue={
                    survivorData && survivorData.pincode && survivorData.pincode
                  }
                  onChange={onHandleChange}
                  name="pincode"
                  type="text"
                  placeholder=""
                  maxLength={6}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                />
                {customError.name == "pincode" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
            </Row>
          </div>
          <div className="white_box_shadow_20 survivorsFormCard mb-4">
            <h3 className="survivorsFormCardHeading">
              Age
              <i class="fal fa-calendar-alt"></i>
            </h3>
            <Row>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>
                  Date of Birth <span className="requiredStar">*</span>
                </Form.Label>

                <>
                  <InputGroup className="date_box">
                    <span className="hidebox"></span>
                    <Form.Control
                      type="text"
                      placeholder="DD-MMM-YYYY"
                      value={
                        survivorData && survivorData.date_of_birth
                          ? moment(survivorData.date_of_birth).format(
                              "DD-MMM-YYYY"
                            )
                          : null
                      }
                      disabled={true}
                    />

                    <InputGroup.Text>
                      <Form.Control
                        name={"date_of_birth"}
                        className="dateBtn"
                        type="date"
                        onChange={onHandleChange}
                        placeholder=""
                        max={moment().format("YYYY-MM-DD")}
                        // min={
                        //   survivorData && survivorData.date_of_birth && moment(survivorData.date_of_birth).format("YYYY-MM-DD")}
                      />
                      <i class="far fa-calendar-alt"></i>
                    </InputGroup.Text>
                  </InputGroup>
                </>
                {/* <DatePicker
                  datePickerChange={onHandleChange}
                  name="date_of_birth"
                  flag={"survivor"}
                  message={" Please enter date of birth."}
                  data={survivorData && survivorData.date_of_birth}
                /> */}
                {customError.name == "date_of_birth" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>

              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>Age Now </Form.Label>
                <Form.Control
                  defaultValue={
                    survivorData && survivorData.age_now && survivorData.age_now
                  }
                  // onChange={onHandleChange}
                  disabled={true}
                  type="number"
                  placeholder=""
                  name="age_now"
                />
              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="dot"
              >
                <Form.Label>
                  Date of Trafficking <span className="requiredStar">*</span>
                </Form.Label>
                {/* <DatePicker
                  name="date_of_trafficking"
                  datePickerChange={onHandleChange}
                  data={survivorData && survivorData.date_of_trafficking}
                /> */}
                <>
                  <InputGroup className="date_box">
                    <span className="hidebox"></span>
                    <Form.Control
                      type="text"
                      placeholder="DD-MMM-YYYY"
                      value={
                        survivorData && survivorData.date_of_trafficking
                          ? moment(survivorData.date_of_trafficking).format(
                              "DD-MMM-YYYY"
                            )
                          : null
                      }
                      disabled={true}
                    />

                    <InputGroup.Text>
                      <Form.Control
                        name={"date_of_trafficking"}
                        className="dateBtn"
                        type="date"
                        onChange={onHandleChange}
                        placeholder=""
                        max={moment().format("YYYY-MM-DD")}
                        min={
                          survivorData &&
                          survivorData.date_of_birth &&
                          moment(survivorData.date_of_birth).format(
                            "YYYY-MM-DD"
                          )
                        }
                      />
                      <i class="far fa-calendar-alt"></i>
                    </InputGroup.Text>
                  </InputGroup>
                </>
                {customError.name == "date_of_trafficking" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="doj"
              >
                <Form.Label>Age When Trafficked </Form.Label>
                <Form.Control
                  value={survivorData && survivorData.age_when_trafficked}
                  disabled={true}
                  type="number"
                  placeholder=""
                  name="age_when_trafficked"
                />
              </Form.Group>
            </Row>
          </div>

          {/* <Form.Group className="form-group" as={Col} md="6">
            <Form.Label>Age Now </Form.Label>
            <Form.Control
              onChange={onHandleChange}
              type="text"
              placeholder=""
              name="age_now"
            />
          </Form.Group> */}
          <div className="white_box_shadow_20 survivorsFormCard mb-4">
            <h3 className="survivorsFormCardHeading">
              Legal Info
              <i class="fal fa-gavel"></i>
            </h3>
            <Row>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>
                  Police Station <span className="requiredStar">*</span>
                </Form.Label>
                <Form.Select
                  // isInvalid={!!errors.police_station}
                  // required
                  onChange={onHandleChange}
                  value={
                    survivorData &&
                    survivorData.police_station &&
                    survivorData.police_station
                  }
                  name="police_station"
                  aria-label="Default select example"
                >
                  <option hidden="true" value={""}>
                    Open this select menu
                  </option>

                  {policeStationList &&
                    policeStationList.length > 0 &&
                    policeStationList.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })}
                </Form.Select>
                {customError.name == "police_station" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>SHG</Form.Label>
                <Form.Select
                  onChange={onHandleChange}
                  name="shg"
                  value={survivorData && survivorData.shg && survivorData.shg}
                  aria-label="Default select example"
                >
                  <option hidden={true} value={""}>
                    Open this select menu
                  </option>
                  {shgList &&
                    shgList.data &&
                    shgList.data.length > 0 &&
                    shgList.data.map((data) => {
                      return (
                        <option value={data._id}>
                          {data.name.toUpperCase()}
                        </option>
                      );
                    })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>Collectives</Form.Label>
                <Form.Select
                  onChange={onHandleChange}
                  name="collectives"
                  value={
                    survivorData &&
                    survivorData.collectives &&
                    survivorData.collectives
                  }
                  aria-label="Default select example"
                >
                  <option hidden={true}>Open this select menu</option>
                  {collectivesList &&
                    collectivesList.data &&
                    collectivesList.data.length > 0 &&
                    collectivesList.data.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>
                  Status in tafteesh <span className="requiredStar">*</span>
                </Form.Label>

                <Form.Select
                  // isInvalid={!!errors.police_station}
                  // required
                  onChange={onHandleChange}
                  name="status_in_tafteesh"
                  value={
                    survivorData &&
                    survivorData.status_in_tafteesh &&
                    survivorData.status_in_tafteesh
                  }
                  aria-label="Default select example"
                >
                  <option hidden="true" value={""}>
                    Open this select menu
                  </option>
                  {survivorStatusList &&
                    survivorStatusList.length > 0 &&
                    survivorStatusList.map((item) => {
                      return (
                        <option value={item && item.name}>
                          {item && item.name}
                        </option>
                      );
                    })}
                </Form.Select>
                {customError.name == "status_in_tafteesh" && (
                  <small className="mt-4 mb-2 text-danger">
                    {customError && customError.message}
                  </small>
                )}
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>
                  Notes for status change in tafteesh{" "}
                  <span className="requiredStar">*</span>
                </Form.Label>
                <Form.Control
                  // required
                  defaultValue={
                    survivorData &&
                    survivorData.notes_for_status_change &&
                    survivorData.notes_for_status_change
                  }
                  onChange={onHandleChange}
                  type="text"
                  placeholder=""
                  name="notes_for_status_change"
                />
                {/* <Form.Control.Feedback type="invalid">
                  Please enter Notes for status change in tafteesh
                </Form.Control.Feedback> */}
                {customError &&
                  customError.name === "notes_for_status_change" && (
                    <p style={{ color: "red", fontSize: 12 }}>
                      {" "}
                      {customError.message}
                    </p>
                  )}
              </Form.Group>

              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="formFileSm"
              >
                <Form.Label>
                  Consent Form (jpeg, pdf, png, docx)
                  <span className="requiredStar">*</span>
                </Form.Label>
                <div className="attachmentUpload fileUpload">
                  <Form.Control
                    type="file"
                    name="consent_form"
                    accept="image/png,image/jpeg,application/pdf,application/docx,application/doc"
                    onChange={(e) => handleFileInput(e, "consent")}
                  />
                  {document && document.type ? (
                    document.type == "image/jpeg" ||
                    document.type == "image/jpg" ||
                    document.type == "image/png" ? (
                      <img src={URL.createObjectURL(document)} alt="" />
                    ) : (
                      <img src={docFile} alt="" />
                    )
                  ) : (
                    <img src={attachmentImage} alt="" />
                  )}

                  {!document && (
                    <div className="attachmentUploadText fileUploadText">
                      <div className="profileUploadTextInner">
                        Attach a file
                      </div>
                    </div>
                  )}
                </div>
                {customError && customError.name === "consent_form" && (
                  <p style={{ color: "red", fontSize: 12 }}>
                    {" "}
                    {customError.message}
                  </p>
                )}
              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="formFileSm"
              >
                <Form.Label>Upload Photo (jpeg, jpg, png)</Form.Label>
                <div className="profileUpload fileUpload">
                  <Form.Control
                    onChange={(e) => handleFileInput(e, "picture")}
                    name="picture"
                    type="file"
                    accept="image/png,image/jpeg,application/pdf,application/docx,application/doc"
                  />
                  {survivorData &&
                    survivorData.picture &&
                    survivorData.picture.length > 0 &&
                    survivorData.picture.map((item) => {
                      return <img src={item ? item : profileImage} alt="" />;
                    })}
                  {fileSelect &&
                    fileSelect.length > 0 &&
                    fileSelect.map((item) => {
                      return (
                        <img
                          src={item ? URL.createObjectURL(item) : profileImage}
                          alt=""
                        />
                      );
                    })}

                  <div className="profileUploadText fileUploadText">
                    <div className="profileUploadTextInner">
                      Upload Photo
                      <span>Choose a file</span>
                    </div>
                  </div>
                </div>
              </Form.Group>
            </Row>
          </div>

          <Row className="justify-content-between">
            <Form.Group as={Col} xs="auto">
              <Link to="/survivors">
                <button
                  // onClick={onCancelBtn}
                  type="button"
                  className="text-uppercase cancle_btn"
                >
                  Cancel
                </button>
              </Link>
            </Form.Group>
            <Form.Group as={Col} xs="auto">
              <Button
                disabled={resultLoad === true ? true : false}
                onClick={(e) => addSurvivorFunc(e)}
                className="submit_btn text-uppercase"
                type="submit"
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
      )}
    </>
  );
};

export default AddSurvivorsForm;
