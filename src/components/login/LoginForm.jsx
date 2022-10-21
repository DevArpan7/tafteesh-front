import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { NavLink, useHistory } from "react-router-dom";
import { MDBCheckbox } from "mdb-react-ui-kit";
import { useDispatch } from "react-redux";
import { Button } from "primereact/button";

import axios from "axios";
// import { __DEV } from "../../isDev";
import NotificationPage from "../NotificationPage";
const LoginForm = (props) => {
  const [loading2, setLoading2] = useState(false);
  // const [loader, setLoader] = useState(false);

  const onLoadingClick2 = () => {
    setLoading2(true);

    setTimeout(() => {
      setLoading2(false);
    }, 2000);
  };
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
    userRememberMe: false
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [loginData, setLoginData] = useState({});
  const history = useHistory();
  const [conditionCheck, setConditionCheck] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("accessToken");
  // var storedColors = JSON.parse(localStorage.getItem("my_colors"))
  // useEffect(() => {
  //   if (token) {
  //     history.push("/dashboard");
  //   }
  // }, [token]);
  const userRememberMe = JSON.parse(localStorage.getItem("userRememberMe"));
  const api = "https://tafteesh-staging-node.herokuapp.com/api/";
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const [messagType, setMessagType] = useState("");

  useEffect(() => {
    if(localStorage.getItem("accessToken")){
      if (token && role && role == "Admin") {
        history.push("/admin")
      } else if (token && role && role == "Social Worker") {
        history.push("/dashboard")
      } else {
        history.push("/")
      }
    }
    else if (userRememberMe == true) {
      //console.log('userRememberMe', userRememberMe);
      if (token && role && role == "Admin") {
        history.push("/admin")
      } else if (token && role && role == "Social Worker") {
        history.push("/dashboard")
      } else {
        history.push("/")
      }
    } else {
      localStorage.clear();
      history.push("/")
    }
  }, [localStorage.getItem("accessToken")]);

  //console.log(loginData, "loginData");
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handelLoginField = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name == 'userRememberMe') {
      value = e.target.checked
    }
    
    setUserLogin({ ...userLogin, [name]: value });
    //console.log("userLoginuserLogin", userLogin);
  };
  const handelSubmit = (e) => {
    e.preventDefault();
    const newLoginRecord = {
      ...userLogin,
      id: new Date().getTime().toString(),
    };
    setRecords([...records, newLoginRecord]);
  };

  const agreedFunc = (e) => {
    //console.log(e.target.checked, "eeee");
    setConditionCheck(e.target.checked);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const showModelFun = () => {
    setIsOpen(true);
  };
  //console.log(isOpen, "isOpen");

  ////// API call function for login //////
  const loginFun = () => {
    if (userLogin && userLogin.password.length < 6) {
      setMessage("Password length should be greater than 6 !!");
    } else {
      localStorage.setItem("userRememberMe", JSON.stringify(userLogin.userRememberMe));
      setLoading2(true);
      axios
        .post("https://tafteesh-staging-node.herokuapp.com/api/user/login", {
          user: userLogin.email,
          password: userLogin.password,
        })
        .then(function (response) {
          setLoading2(false);
          setTimeout(() => {
            setLoading2(false);
          }, 2000);
          const { data } = response;
          // console.log(response, "response");
         
          if (data.error == false) {
            handleClick();
            setUpdateMessage(data && data.message);
            setMessagType("error");

            setLoginData(response.data);
            if (data.terms_and_conditions == true) {
              if (data.data[0].role.name === "Social Worker") {
                localStorage.setItem("userId", data.data[0]._id);
                localStorage.setItem("accessToken", data.data[1].accessToken);
                localStorage.setItem("refreshToken", data.data[1].refreshToken);
                localStorage.setItem("image", data.data[0].image);
                localStorage.setItem("fname", data.data[0].fname);
                localStorage.setItem("lname", data.data[0].lname);
                localStorage.setItem("lastLoginTime", data.data[0].last_login_time);
                localStorage.setItem("role", data.data[0].role.name);
                localStorage.setItem(
                  "organizationName",
                  data.data[0].organization.name
                );
                localStorage.setItem(
                  "organizationId",
                  data.data[0].organization._id
                );
                localStorage.setItem(
                  "userAccess",
                  JSON.stringify(data.userAccess && data.userAccess.access)
                ); //store userAccess
                history.push("/dashboard");
                setUserLogin({ email: "", password: "" });
                setMessageType("");
              } else {
                if(data.data[0].role.name === "Admin"){
                history.push("/admin");
                setUserLogin({ email: "", password: "" });
                setMessageType("");
              }
            }

              // checkConditionFunc(data);
             
            } else {
              setIsOpen(true);
              // setIsOpen(false);
            }
          } else {
            handleClick();
            setUpdateMessage(response && response.data.message);
            setMessageType("error");
          }
        })
        .catch(function (error) {
          setLoading2(true);
          //console.log(error);
            // handleClick();
            // setUpdateMessage(error.response.data.message);
            // setMessagType("error");
          setTimeout(() => {
            setLoading2(false);
          }, 2000);
        });
    }
  };
  let setToken = loginData && loginData.data && loginData.data[1].accessToken;

  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${setToken}`,
    },
  };

  ////// API call function for login //////
  const termsAndConditionFun = () => {
    let body = {
      terms_and_conditions: conditionCheck,
    };
    if (conditionCheck == true) {
      setLoading2(true);
      axios
        .patch(
          "https://tafteesh-staging-node.herokuapp.com/api/user/terms-and-conditions/" +
            loginData.data[0]._id,
          body,
          axiosConfig
        )
        .then(function (response) {
          setLoading2(false);
          setTimeout(() => {
            setLoading2(false);
          }, 2000);
          const { data } = response;
          //console.log(response, "response", data.message);
          // setConditionCheck(false);
          handleClick();
          setUpdateMessage(data && data.message);
          setMessageType("success")
          if (data.error == false) {
            localStorage.setItem("userRememberMe", JSON.stringify(userLogin.userRememberMe));
            localStorage.setItem("userId", loginData.data[0]._id);
            localStorage.setItem("accessToken", loginData.data[1].accessToken);
            localStorage.setItem(
              "refreshToken",
              loginData.data[1].refreshToken
            );
            localStorage.setItem("image", loginData.data[0].image);
            localStorage.setItem("fname", loginData.data[0].fname);
            localStorage.setItem("lname", loginData.data[0].lname);
            localStorage.setItem("role", loginData.data[0].role.name);
            localStorage.setItem("lastLoginTime", loginData.data[0].last_login_time);
            localStorage.setItem(
              "organizationName",
              loginData.data[0].organization.name
            );
            localStorage.setItem(
              "organizationId",
              loginData.data[0].organization._id
            );

            if (loginData.data[0].role.name === "Social Worker") {
              history.push("/dashboard");
              setUserLogin({ email: "", password: "" });
              setMessageType("");
            } else {
              history.push("/admin");
              setUserLogin({ email: "", password: "" });
              setMessageType("");
            }
            setUserLogin({ email: "", password: "" });
            setMessageType("");
          } else {
            hideModal();
          }
        })
        .catch(function (error) {
          setLoading2(true);
          //console.log(error);
          setTimeout(() => {
            setLoading2(false);
          }, 2000);
        });
    } else {
      //console.log("please check");
    }
  };

  // useEffect(() => {
  //   //console.log(messageType, "message Type");
  // }, [messageType]);

  return (
    <>
      <div className="login_form">
        <form action="" onSubmit={handelSubmit}>
          <NotificationPage
            handleClose={handleClose}
            open={open}
            message={updateMessage}
            type={messageType}
          />

          <div className="input-group mb-3">
            <div className="input-group-append">
              <span className="input-group-text">
                <i className="fal fa-envelope"></i>
              </span>
            </div>
            <input
              type="text"
              name="email"
              maxLength={50}
              autoComplete=""
              value={userLogin.email}
              onChange={handelLoginField}
              className="form-control input_user"
              placeholder="username"
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-append">
              <span className="input-group-text">
                <i className="fal fa-key-skeleton"></i>
              </span>
            </div>
            <input
              minLength={6}
              type="password"
              autoComplete=""
              value={userLogin.password}
              onChange={handelLoginField}
              name="password"
              className="form-control input_pass"
              placeholder="password"
            />
          </div>
          {message &&
          userLogin &&
          userLogin.password &&
          userLogin.password.length < 6 ? (
            <p style={{ color: "#a10b0b" }}> {message && message}</p>
          ) : null}
          <div className="form-group form-group__forgot">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customControlInline"
                // checked={}
                value={userLogin.userRememberMe}
                onChange={handelLoginField}
                name="userRememberMe"
              />
              <label
                className="custom-control-label"
                htmlFor="customControlInline"
              >
                Remember me
              </label>
            </div>
            <div className="forgot_text">
              <NavLink to="/user-forgot-password-mail" onClick={()=>localStorage.setItem('LoginType','user')}>Forgot Password?</NavLink>
            </div>
          </div>

          <div className="d-flex justify-content-center login_container">
            <button
              // onClick={showModal}
              onClick={loginFun}
              type="submit"
              name="button"
              loading={loading2}
              disabled={
                userLogin && userLogin.email == ""
                  ? true
                  : userLogin.password == ""
                  ? true
                  : loading2 == true
                  ? true
                  : false
              }
              className="btn login_btn"
            >
              {loading2 && loading2 === true ? (
                <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>

      <Modal
        show={isOpen}
        onHide={hideModal}
        dialogClassName={"nda_modal"}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <h3>Non Disclosure Agreement</h3>
          <p>
            I hereby declare that I would comply with the following four
            matters;
            <br />
            (a) I have read the concept note of Tafteesh MIS;
            <br />
            (b) I have understood the usage of this MIS only for the
            programmatic goals of Tafteesh.
            <br />
            (c) I would not copy/use/share the data I have access to through
            Tafteesh MIS beyond Tafteesh Strategic Plan
            <br />
            and agreed proposal between my organization and Tafteesh.
            <br />
            (d) I would obtain permission from relevant survivor/s and Tafteesh
            Programme Manager in a written form, when a situation arises for me
            to share a part of or the whole of MIS data with those who are
            absolutely beyond the scope of Tafteesh.
          </p>

          <div className="nda_modal_footer">
            <MDBCheckbox
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label="I agreed"
              onClick={(e) => agreedFunc(e)}
            />

            <Button
              className="login_btn"
              label="Ok"
              disabled={conditionCheck == true ? false : true}
              loading={loading2}
              onClick={termsAndConditionFun}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginForm;
