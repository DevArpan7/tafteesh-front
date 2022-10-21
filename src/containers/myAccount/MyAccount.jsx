import React, { useState, useEffect } from "react";
import { Topbar } from "../../components";
import { Button, Form, Row, Col } from "react-bootstrap";
import ChangePassword from "./ChangePassword";

//import { Link } from 'react-router-dom';
import bgTop from "../../assets/img/profiletopimg.jpg";
import user from "../../assets/img/user.jpg";
import axios from "axios";
import NotificationPage from "../../components/NotificationPage";
import "./myaccount.css";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  getStateList,
  getDistrictList,
  getBlockList,
} from "../../redux/action";

import DatePicker from "../../components/DatePicker";
import { Autocomplete } from "@mui/material";

const MyAccount = (props) => {
  const userId = localStorage.getItem("userId");
  const profile = localStorage.getItem("image");
  const [userName, setUserName] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const api = "https://tafteesh-staging-node.herokuapp.com/api/user/";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [pictureData, setPictureData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const stateList = useSelector((state) => state.stateList);
  const districtList = useSelector((state) => state.districtList);
  const blockList = useSelector((state) => state.blockList);
  const [customError, setCustomError] = useState({ name: "", message: "" });
  const [messagType, setMessagType] = useState("");

  const [fileSelect, setFileSelect] = useState("");

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  //console.log(blockList, "blockList");

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  ////// API call function for get user details //////
  const userDetailsFunc = () => {
    axios
      .get(api + "detail/" + userId)
      .then(function (response) {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setUserDetails(data.data);
          setUserName({ fname: data.data.fname, lname: data.data.lname });
        }
      })
      .catch(function (error) {
        //console.log(error);
      });
  };

  useEffect(() => {
    userDetailsFunc();
    dispatch(getStateList());
  }, []);

  const getDistListByState = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
    dispatch(getDistrictList(e.target.value));
  };

  const getBlockListByDist = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
    dispatch(getBlockList(userDetails.state, e.target.value));
  };

  /////////////////////file upload function/////////////////////////
  const handleFileInput = (e) => {
    //console.log(e, e.target.files[0]);
    let data = e.target.files[0];

    setFileSelect(e.target.files[0]);
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

        // console.log(response,"response")
        if (response && response.data.error === false) {
          const { data } = response;
          if (
            (response.data &&
              response.data.data.file &&
              response.data.data.file.mimetype == "image/png") ||
            response.data.data.file.mimetype == "image/jpg" ||
            response.data.data.file.mimetype == "image/jpeg"
          ){
            setUserDetails({
              ...userDetails,
              image: "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
            });
          setPictureData(data.data.filePath);
          //console.log(userDetails, pictureData);
        }else{
          handleClick();
          setMessagType("error");
          setUpdateMessage("upload only png,jpg,jpeg format");
        }
       } else {
          handleClick();
          setMessagType("error");
          setUpdateMessage("upload only png,jpg,jpeg format");
        }
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    //console.log(pictureData);
  }, [pictureData]);

  ///////////// profile update api call function /////////

  const onHandleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]:
        e.target.name != "image" ? e.target.value.trim() : e.target.value,
    });
  };

  const [resultLoader, setResultLoader] = useState(false);

  const updateProfileFunc = () => {
    var format = /[!@#$%^&*()_+\-=\[\]0-9{};':"\\|,.<>\/?]+/;
    console.warn(pictureData, profile);
    var body = userDetails;
    //console.log("body", body)
    if (userDetails && !userDetails.fname) {
      setCustomError({
        name: "fname",
        message: "Please enter First name",
      });
    } else if (
      userDetails &&
      userDetails.fname &&
      format.test(userDetails.fname)
    ) {
      setCustomError({
        name: "fname",
        message: "Please enter valid name",
      });
    } else if (userDetails && !userDetails.lname) {
      setCustomError({
        name: "lname",
        message: "Please enter Last name",
      });
    } else if (
      userDetails &&
      userDetails.lname &&
      format.test(userDetails.lname)
    ) {
      setCustomError({
        name: "lname",
        message: "Please enter valid name",
      });
    } else if (userDetails && !userDetails.pin) {
      setCustomError({ name: "pin", message: "Please enter Pin code" });
      // window.scrollTo(5, el.offsetTop);
    } else if (userDetails && userDetails.pin && userDetails.pin < 99999) {
      setCustomError({ name: "pin", message: "Pin Code is invalid" });
      // window.scrollTo(5, el.offsetTop);
    } else {
      setCustomError({ name: "", message: "" });
      setResultLoader(true);
      axios
        .patch(api + "update-profile/" + userId, body, axiosConfig)
        .then((res) => {
          //console.log(res);
          setResultLoader(false);

          if (res && res.data && res.data.error == false) {
            const { data } = res;
            handleClick();
            //console.log('user updated', data);
            setMessagType("success");
            setUpdateMessage(res && res.data.message);
            localStorage.setItem("fname", data.data.fname);
            localStorage.setItem("lname", data.data.lname);
            localStorage.setItem("image", data.data.image);
            userDetailsFunc();
          } else {
            handleClick();
          }
        })
        .catch((error) => {
          setResultLoader(false);

          //console.log(error);
          // setUpdateMessage(error && error.message)
        });
    }
  };

  const dobChangeHandel = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Topbar />
      <main className="main_body">
        <div className="bodyright">
          <NotificationPage
            handleClose={handleClose}
            open={open}
            message={updateMessage}
            type={messagType}
          />

          <div className="topbg">
            <img src={bgTop} alt="" />
          </div>
          <div className="row accountImage_wrap">
            <div className="col-auto">
              <div className="accountImage">
                <img
                  src={
                    userDetails && userDetails.image ? userDetails.image : user
                  }
                  alt=""
                />
              </div>
            </div>
            <div className="col-auto align-self-end">
              <h3>
                {userName && userName.fname} {userName.lname}
              </h3>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="white_box_shadow_20 myAccount_form">
                <h4 className="pb-2">My Profile</h4>
                <Row>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      name="fname"
                      defaultValue={userDetails && userDetails.fname}
                      // onChange={(e) =>
                      //   setUserDetails({
                      //     ...userDetails,
                      //     [e.target.name]: e.target.value,
                      //   })
                      // }
                      onChange={onHandleChange}
                      type="text"
                    />
                    {customError.name == "fname" && (
                      <small className="mt-4 mb-2 text-danger">
                        {customError && customError.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      name="lname"
                      defaultValue={userDetails && userDetails.lname}
                      // onChange={(e) =>
                      //   setUserDetails({
                      //     ...userDetails,
                      //     [e.target.name]: e.target.value,
                      //   })
                      // }
                      onChange={onHandleChange}
                      type="text"
                    />
                    {customError.name == "lname" && (
                      <small className="mt-4 mb-2 text-danger">
                        {customError && customError.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      defaultValue={userDetails && userDetails.email}
                      disabled={true}
                      type="text"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      // maxLength={13}
                      name="mobile"
                      defaultValue={userDetails && userDetails.mobile}
                      disabled={true}
                      type="text"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <DatePicker
                      name="dob"
                      data={userDetails && userDetails.dob}
                      datePickerChange={dobChangeHandel}
                    />

                    {/* <Stack component="form" noValidate spacing={3}>
                      <TextField
                        id="date"
                        label="Select dob"
                        name="dob"
                        type="date"
                        value={moment(userDetails && userDetails.dob).format(
                          "YYYY-MM-DD"
                        )}
                        sx={{ width: 270 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                    </Stack> */}
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          [e.target.name]: e.target.value,
                        })
                      }
                      name="gender"
                      value={userDetails && userDetails.gender}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                <h4 className="mt-2">Address</h4>
                <Row>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>State name</Form.Label>
                    <Form.Select
                      onChange={getDistListByState}
                      name="state"
                      value={
                        userDetails &&
                        userDetails.state &&
                        userDetails.state.name
                      }
                    >
                      {stateList &&
                        stateList.length > 0 &&
                        stateList.map((data) => {
                          return <option value={data._id}>{data.name}</option>;
                        })}
                      <option
                        hidden="true"
                        defaultValue={
                          userDetails &&
                          userDetails.state &&
                          userDetails.state._id
                        }
                      >
                        {userDetails &&
                          userDetails.state &&
                          userDetails.state.name}
                      </option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>District name</Form.Label>
                    <Form.Select
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          [e.target.name]: e.target.value,
                        })
                      }
                      name="district"
                      value={
                        userDetails &&
                        userDetails.district &&
                        userDetails.district.id
                      }
                    >
                      {districtList &&
                        districtList.length > 0 &&
                        districtList.map((data) => {
                          return <option value={data._id}>{data.name}</option>;
                        })}
                      <option
                        hidden="true"
                        defaultValue={
                          userDetails &&
                          userDetails.district &&
                          userDetails.district.id
                        }
                      >
                        {userDetails &&
                          userDetails.district &&
                          userDetails.district.name}
                      </option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Panchayat / block name</Form.Label>
                    <Form.Select onChange={getBlockListByDist} name="block">
                      {blockList &&
                        blockList.length > 0 &&
                        blockList.map((data) => {
                          return <option value={data._id}>{data.name}</option>;
                        })}
                      <option
                        hidden="true"
                        defaultValue={
                          userDetails &&
                          userDetails.block &&
                          userDetails.block.id
                        }
                      >
                        {userDetails &&
                          userDetails.block &&
                          userDetails.block.name}
                      </option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Pin</Form.Label>
                    <Form.Control
                      name="pin"
                      maxLength={6}
                      defaultValue={userDetails && userDetails.pin}
                      onChange={onHandleChange}
                      type="text"
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onPaste={(e)=> {
                        e.preventDefault();
                      }}
                    />
                    {customError.name == "pin" && (
                      <small className="mt-4 mb-2 text-danger">
                        {customError && customError.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Profile Picture</Form.Label>
                    <div className="profileUpload fileUpload">
                      <Form.Control
                        type="file"
                        name="image"
                        onChange={(e) => handleFileInput(e)}
                        placeholder="Profile image"
                        accept="image/png,image/jpeg,application/pdf,application/docx,application/doc"
                      />
                      <img
                        src={
                          fileSelect ? URL.createObjectURL(fileSelect) : profile
                        }
                        alt=""
                      />
                      <div className="profileUploadText fileUploadText">
                        <div className="profileUploadTextInner">
                          Upload Photo
                          <span>Choose a file</span>
                        </div>
                      </div>
                    </div>
                  </Form.Group>
                </Row>
                <Row className="justify-content-start mt-4">
                  <Form.Group as={Col} md="auto">
                    <Button
                      type="submit"
                      disabled={resultLoader == true ? true : false}
                      onClick={updateProfileFunc}
                      className="submit_btn shadow-0"
                    >
                      {resultLoader && resultLoader === true ? (
                        <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </Form.Group>
                </Row>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="white_box_shadow_20 ChangePassword_box">
                <ChangePassword
                  api={api}
                  token={token}
                  axiosConfig={axiosConfig}
                  userDetailsFunc={userDetailsFunc}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MyAccount;
