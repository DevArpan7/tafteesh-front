import React from 'react';
import { useState } from 'react';
import logo from "../../assets/img/logo.png";
import './forgotpassword.css'
import axios from "axios";
import { useHistory } from 'react-router-dom';
import NotificationPage from "../NotificationPage";


const ForgotPassword = () => {
  const user = localStorage.getItem('emailForChangePassword')
  const email = (JSON.parse(user).user)
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState()
  const history = useHistory();
  const [newPassword, setNewPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [updateMessage, setUpdateMessage] = useState('')
  const [open, setOpen] = useState(false);
  const [messagType, setMessagType] = useState("");

  const type= localStorage.getItem('LoginType')
  let url;
  if(type=='admin'){
    url='https://tafteesh-staging-node.herokuapp.com/api/admin/reset-password'
  }else if(type=='user'){
    url='https://tafteesh-staging-node.herokuapp.com/api/user/reset-password'
  }
  const handleClose = () => {
    setOpen(false);
  };
  const handleClick = () => {
    setOpen(true);
  };
  const resetPassword = (e) => {
    e.preventDefault();
    if (!newPassword) {
      setFieldData({ field: "new_password", message: "Please enter Password to reset" })
    } else if (!confirmPassword) {
      setFieldData({ field: "confirm_password", message: "Please confirm the new password" })
    } else if (newPassword && newPassword.length < 6) {
      setFieldData({ field: "new_password", message: "Password length should be at least 6 " })
    } else if (newPassword != confirmPassword) {
      setFieldData({ field: "confirm_password", message: "password and confirm password should be same " })
    } else {
      setLoader(true)
      var config = {
        method: 'patch',
        url: 'https://tafteesh-staging-node.herokuapp.com/api/admin/reset-password',
        headers: {},
        data: {
          email: email,
          new_password: newPassword,
          confirm_password: confirmPassword
        }
      };

      axios(config)
        .then(function (response) {
          //console.log(JSON.stringify(response.data));
          if (response.data.error === false) {
            history.push("/adminlogin")
            setLoader(false)
            handleClick()
            setUpdateMessage(response.data.message)
            setMessagType("success")
            // history.push("/#")
            localStorage.removeItem('LoginType')
            localStorage.removeItem('emailForChangePassword')
          }
        })
        .catch(function (error) {
          //console.log(error);
        });
    }
  }
  return (
    <>
      <NotificationPage handleClose={handleClose} open={open} message={updateMessage}    type={messagType}/>
      <section className='login__body'>
        <div className="login__body_left">
          <div className="login__body_left__logo">
            <img src={logo} alt="" />
          </div>
        </div>
        <div className="login__body_box">
          <h2>Forgot Password</h2>
          <p>Enter Your New Password</p>
          <div className="login_form forgetpassword_form">
            <form>
              <div className="input-group mb-3">
                <div className="input-group-append">
                  <span className="input-group-text">
                    <i class="fal fa-key-skeleton"></i>
                  </span>
                </div>
                <input
                  type="password"
                  name=""
                  placeholder='New Password'
                  onChange={(e) => { setNewPassword(e.target.value) }}
                />
              </div>
              {fieldData.field == "new_password" && (
                <small className="mt-4 mb-4 text-danger">
                  {fieldData && fieldData.message}
                </small>
              )}
              <div className="input-group mb-3">
                <div className="input-group-append">
                  <span className="input-group-text">
                    <i class="fal fa-key-skeleton"></i>
                  </span>
                </div>
                <input
                  type="password"
                  name=""
                  placeholder='Confirm Password'
                  onChange={(e) => { setConfirmPassword(e.target.value) }}
                />
              </div>
              {fieldData.field == "confirm_password" && (
                <small className="mt-4 mb-2 text-danger">
                  {fieldData && fieldData.message}
                </small>
              )}
              <div className="d-flex justify-content-center login_container">
                <button className="btn login_btn" type='submit' onClick={(e) => { resetPassword(e) }}>
                  {loader && loader === true ? (
                    <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                  ) : (
                    "Reset"
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className='login__border'>
            <span className='login__border__one'></span>
            <span className='login__border__two'></span>
          </div>
        </div>
        <div className="login__body_right">
        </div>
      </section>
    </>
  )
}

export default ForgotPassword