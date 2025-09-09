import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { isValidMobileNumber } from '../../help/validate';
import { UserLogin } from '../../service/UserService';
import { Helmet } from 'react-helmet';

export default function Login() {

  const { setIsLoading, setAppError, setAppErrorMessage, setAppErrorTitle, setAppErrorMode } = useGlobalContext();

  //create two useState variables mobile and password
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");


  const makeLogin = async () => {

    if (mobile === "" || password === "") {
      setAppError(true);
      setAppErrorMessage("Mobile and Password are required");
      setAppErrorTitle("Form Validation Error");
      setAppErrorMode("error");
      return;
    }
    else if (isValidMobileNumber(mobile) === false) {
      setAppError(true);
      setAppErrorMessage("Please enter valid 10 digit mobile number");
      setAppErrorTitle("Form Validation Error");
      setAppErrorMode("error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await UserLogin(mobile, password);
      if (response.status === 200) 
      {
        const role = response.role; 
        if (role === "admin") 
        {         
          setAppError(true);
          setAppErrorTitle("Action Response");
          setAppErrorMessage(response.message || "Login success");
          setAppErrorMode("success");
          window.location.reload();
        }
      }
      else {
        setAppError(true);
        setAppErrorTitle("Error");
        setAppErrorMessage(response.message || "Invalid login details");
        setAppErrorMode("error");
      }
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to login. Please try again.");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col col-md-4'>
            <h4 className='mt-5 text-center login-title'> Admin Panel</h4>
            <div className='login'>
              <div className='logo-image-container'>
                <img src={config.logo} alt="Playful Pencil" />
              </div>
              <div className="login-form">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label >Mobile</label>
                    <input className='form-control' type="number" id="mobile" name="mobile"  value={mobile} onChange={(e) => setMobile(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label >Password</label>
                    <input className='form-control' type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <button type="submit" className='btn btn-success-app' onClick={makeLogin}>Login</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}