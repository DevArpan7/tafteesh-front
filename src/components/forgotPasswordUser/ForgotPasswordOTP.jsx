import React from 'react';
import logo from "../../assets/img/logo.png";
import './forgotpassword.css'
import { useState } from 'react';
import axios from "axios";
import { useHistory } from 'react-router-dom';


const ForgotPasswordOTP = () => {
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
  const [otp, setOtp] = useState(null)
  const history = useHistory();
  const user = localStorage.getItem('emailForChangePassword')
  const email = (JSON.parse(user).user)
  const type= localStorage.getItem('LoginType')
  let url;
  //console.log(type)
  if(type=='admin'){
    url='https://tafteesh-staging-node.herokuapp.com/api/admin/verify-otp'
  }else if(type=='user'){
    url='https://tafteesh-staging-node.herokuapp.com/api/user/verify-otp'
  }
  const verifyOtp = (e) => {
    e.preventDefault();
    if (!otp) {
      setFieldData({ field: "otp", message: "Please enter OTP" })
    } else {
      setLoader(true)
      var config = {
        method: 'post',
        url: 'https://tafteesh-staging-node.herokuapp.com/api/user/verify-otp',
        headers: {},
        data: {
          user: email,
          otp: parseInt(otp)
        }
      };

      axios(config)
        .then(function (response) {
          //console.log(JSON.stringify(response.data));
          if (response.data.error === false) {
            history.push("/forgot-password-user")
            setLoader(false)
          }
        })
        .catch(function (error) {
          //console.log(error);
        });
    }
  }
  return (
    <>
      <section className='login__body'>
        <div className="login__body_left">
          <div className="login__body_left__logo">
            <img src={logo} alt="" />
          </div>
        </div>
        <div className="login__body_box">
          <h2>Forgot Password</h2>
          <p>Enter OTP</p>
          <div className="login_form forgetpassword_form">
            <form action='' onSubmit={verifyOtp}>
              <div className="input-group mb-3">
                <div className="input-group-append">
                  <span className="input-group-text">
                    <i class="fas fa-ellipsis-h"></i>
                  </span>
                </div>
                <input
                  type="text"
                  name="email"
                  placeholder='Enter OTP'
                  onChange={(e) => { setOtp(e.target.value) }}
                />
              </div>
              {fieldData.field == "otp" && (
                <small className="mt-4 mb-2 text-danger">
                  {fieldData && fieldData.message}
                </small>
              )}
              <div className="d-flex justify-content-center login_container">
                <button className="btn login_btn" type='submit' name='button'>
                  {loader && loader === true ? (
                    <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                  ) : (
                    "Submit"
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

export default ForgotPasswordOTP