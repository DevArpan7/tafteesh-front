import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { NavLink, useHistory } from "react-router-dom";
import { MDBCheckbox } from "mdb-react-ui-kit";
import { useDispatch } from "react-redux";
import { Button } from 'primereact/button';

import axios from "axios";
// import { __DEV } from "../../isDev";
import NotificationPage from "../NotificationPage";
const AdminLoginForm = (props) => {
  const [loading2, setLoading2] = useState(false);
  const [loader, setLoader] = useState(false);
  const [messagType, setMessagType] = useState("");

  const onLoadingClick2 = () => {
    setLoading2(true);

    setTimeout(() => {
      setLoading2(false);
    }, 2000);
  }
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
  const [conditionCheck, setConditionCheck] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [messageType, setMessageType] = useState({ type: '', logMessage: '' });
  const [updateMessage, setUpdateMessage] = useState('')
  const [fieldData, setFieldData] = useState({ field: "", message: "" });

  const [open, setOpen] = useState(false);
  const token = (localStorage.getItem('accessToken'));

  // useEffect(() => {
  //   if (token) {
  //     history.push("/dashboard")

  //   }

  // }, [token]);

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
    //console.log("userLogin", userLogin);
  };
  const handelSubmit = (e) => {
    e.preventDefault();
    const newLoginRecord = {
      ...userLogin,
      id: new Date().getTime().toString(),
    };
    setRecords([...records, newLoginRecord]);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (userLogin && userLogin.email) {
      setFieldData({ field: "", message: "" })

    } else if (
      userLogin &&
      userLogin.password
    ) {
      setFieldData({ field: "", message: "" });

    } else {
      setFieldData({ field: "", message: "" });
    }
  }, [userLogin])
  ////// API call function for login //////
  const loginFun = () => {
    var pattern = new RegExp (/^([a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,3}$)/)
    
    let isValid = true;
    if (userLogin && !userLogin.email) {
      setFieldData({ field: "email", message: "Please enter Email Id" })

    } else if (
      userLogin &&
      userLogin.email &&
      !pattern.test(userLogin.email)
    ) {
      setFieldData({ field: "email", message: "Please enter valid email Id." });

    } else if (userLogin && !userLogin.password) {
      setFieldData({ field: "password", message: "Please enter Password" })

    }
    else if (userLogin && userLogin.password.length < 6) {
      setFieldData({ field: "password", message: "Password length should be greater than 6 !!" })

    } else {

      setLoader(true)
      axios
        .post("https://tafteesh-staging-node.herokuapp.com/api/admin/login", {
          user: userLogin.email,
          password: userLogin.password,
        })
        .then(function (response) {
          setLoader(false)
          setTimeout(() => {
            setLoading2(false);
          }, 2000);
          const { data } = response;
          //console.log(response, data.message);
        
          if (data.error == false) {
            handleClick()
            setUpdateMessage(data && data.message)
            setMessagType("success")
            if(data.data[0].role.name === "Admin"){
            localStorage.setItem("userRememberMe", JSON.stringify(userLogin.userRememberMe));
            localStorage.setItem('userId', data.data[0]._id);
            localStorage.setItem('accessToken', data.data[1].accessToken);
            localStorage.setItem('refreshToken', data.data[1].refreshToken);
            localStorage.setItem('image', data.data[0].image);
            localStorage.setItem('role', data.data[0].role.name);
            history.push("/admin");
            setLoginData(response.data);
            setUserLogin({ email: "", password: "" });
            setMessageType({ type: '', logMessage: '' });
          }
        }
          else {
            hideModal();
              handleClick();
              setUpdateMessage(data.message);
              setMessagType("error");
            
          }
        })
        .catch(function (error) {
          setLoader(false)
          //console.log(error);
          handleClick();
          setUpdateMessage(error.message);
        });
    }
  };

  return (
    <>
      <div className="login_form">
        <form action="" onSubmit={handelSubmit}>
          <NotificationPage handleClose={handleClose} open={open} message={updateMessage}   type={messagType} />

          <div className="input-group mb-3">
            <div className="input-group-append">
              <span className="input-group-text">
                <i className="fal fa-envelope"></i>
              </span>
            </div>
            <input
              type="text"
              name="email"
              // maxLength={50}
              autoComplete=""
              value={userLogin.email}
              onChange={handelLoginField}
              className="form-control input_user"
              placeholder="username"
            />

          </div>
          {fieldData.field == "email" && (
            <small className="mt-4 mb-2 text-danger">
              {fieldData && fieldData.message}
            </small>
          )}
          <div className="input-group mb-3">
            <div className="input-group-append">
              <span className="input-group-text">
                <i className="fal fa-key-skeleton"></i>
              </span>
            </div>
            <input
              maxLength={8}
              type="password"
              autoComplete=""
              value={userLogin.password}
              onChange={handelLoginField}
              name="password"
              className="form-control input_pass"
              placeholder="password"
            />
          </div>
          {fieldData.field == "password" && (
            <small className="mt-4 mb-2 text-danger">
              {fieldData && fieldData.message}
            </small>
          )}

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
                htmlFor="customControlInline">
                Remember me
              </label>
            </div>
            <div className="forgot_text">
              <NavLink to="/admin-forgot-password-mail" onClick={()=>localStorage.setItem('LoginType','admin')}>Forgot Password?</NavLink>
            </div>
          </div>
          {/* {loginMessage &&
          <p style={{ color: "#a10b0b" }}>{loginMessage}</p>
} */}
          <div className="d-flex justify-content-center login_container">
            <button
              //  disabled={conditionCheck == true ? false : true} 
              loading={loading2}
              onClick={loginFun}
              // onClick={showModal}
              type="submit"
              name="button"
              disabled={loader == true ? true : false}
              // disabled={userLogin && userLogin.email == '' ? true : userLogin.password == '' ? true : false}
              className="btn login_btn">
              {loader && loader === true ? (
                <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
              ) : (
                "Login"
              )}
            </button>
          </div>

        </form>
      </div>

    </>
  );
};

export default AdminLoginForm;
