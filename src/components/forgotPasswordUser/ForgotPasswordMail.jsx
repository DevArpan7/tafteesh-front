import React from 'react';
import logo from "../../assets/img/logo.png";
import './forgotpassword.css'
import { useState } from 'react';
import axios from "axios";
import { useHistory } from 'react-router-dom';

const ForgotPasswordMail = (e) => {
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState(null)
  const type= localStorage.getItem('LoginType')
  let url;
  if(type=='admin'){
    url='https://tafteesh-staging-node.herokuapp.com/api/admin/forget-password'
  }else if(type=='user'){
    url='https://tafteesh-staging-node.herokuapp.com/api/user/forget-password'
  }
  const history = useHistory();
  const verifyEmail = (e) => {
    e.preventDefault();
    var pattern =  new RegExp (/^([a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,3}$)/)
   
    if (!email) {
      setFieldData({ field: "email", message: "Please enter Email Id" })
    } else if (
      email &&
      !pattern.test(email.user)
    ) {
      setFieldData({ field: "email", message: "Please enter valid email Id." });
    } else {
      setLoader(true)
      axios
        .post("https://tafteesh-staging-node.herokuapp.com/api/user/forget-password", email)
        .then(function (response) {
          //console.log(JSON.stringify(response.data));
          setLoader(false)
          if (response.data.error === false) {
            localStorage.setItem('emailForChangePassword', JSON.stringify(email))
            history.push("/forgot-password-otp-user")
            setEmail(null)
           
          }
        })
        .catch(function (error) {
          setLoader(false)
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
          <h2>Password Recovery</h2>
          <p>Enter Your email to reset</p>
          <div className="login_form forgetpassword_form">
            <form action="">
              <div className="input-group mb-3">
                <div className="input-group-append">
                  <span className="input-group-text">
                    <i className="fal fa-envelope"></i>
                  </span>
                </div>
                <input
                  type="text"
                  name="email"
                  placeholder='Enter Email'
                  onChange={(e) => { setEmail({ user: e.target.value }) }}
                />
              </div>
              {fieldData.field == "email" && (
                <small className="mt-4 mb-2 text-danger">
                  {fieldData && fieldData.message}
                </small>
              )}
              <div className="d-flex justify-content-center login_container">
                <button className="btn login_btn" type="submit"
                  onClick={(e) => { verifyEmail(e) }}
                  name="button">
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

export default ForgotPasswordMail