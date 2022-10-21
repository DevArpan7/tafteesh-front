import React from 'react'
import {useHistory } from "react-router-dom";
import App from '../../App';
import { Link } from "react-router-dom";
import './error.css';
import logo from "../../assets/img/color-logo.png";

const Error = () => {
  const token = localStorage.getItem("accessToken");
  const history = useHistory();

  const gotoLogin=()=>{
    //console.log(token,"token")
    history.push("/")
  
  }
 
  return (
    <>
    {token ?
  
    <App/>
    :
    // gotoLogin
      <>
      <div className='error_wrap'>
      {/* <div className="ghost">
        <span className="text">404</span>
        <div className="eye"></div>
        <div className="eye two"></div>
        
        <div className="mouth">
          <div className="tonge"></div>
        </div>
        
        <div className="corner"></div>
        <div className="corner two"></div>
        <div className="corner three"></div>
        <div className="corner four"></div>
        
        <div className="over"></div>
        <div className="over two"></div>
        <div className="over three"></div>
        <div className="over four"></div>
        <div className="shadow"></div>
      </div> */}

      <div className="ghost">
        <div className='logo404'>
          <img src={logo} alt="logo" />
        </div>
        {/* <div className="shadow"></div> */}
      </div>


      <div className="main_error">
        <div className="error">Unauthorized</div>
        <h2>Unauthorized Page</h2>
        <h6>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</h6>
        <Link className="backtohome btn" to="/">Back to Home</Link>
      </div>
      </div>
      </> 
    }
     
    </>
  )
}

export default Error

