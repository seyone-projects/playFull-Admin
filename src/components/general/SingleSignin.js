import React from 'react'
import { useState } from 'react';
import { Link, redirect } from 'react-router-dom';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { isValidMobileNumber } from '../../help/validate';
import { Helmet } from 'react-helmet';
import { GetRedirectUrl } from '../../service/UserService';

export default function Login() {

  const { setIsLoading, setAppError, setAppErrorMessage, setAppErrorTitle, setAppErrorMode } = useGlobalContext();

  //create two useState variables mobile and password
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");


  const makeLogin = async () => {

    if (mobile === "") {
      setAppError(true);
      setAppErrorMessage("Mobile are required");
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
      const response = await GetRedirectUrl(mobile);      
      if (response.status === 200) 
      {               
        setAppError(true);
        setAppErrorTitle("Action Response");        
        setAppErrorMessage(response.message || "Redirect");
        setAppErrorMode("success");
        window.location.href = response.redirectUrl;     
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
        <title>Single Sign In | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col col-md-4'>
            <h4 className='mt-5 text-center login-title'> Single Sign In </h4>
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
                    <button type="submit" className='btn btn-success-app' onClick={makeLogin}>Submit</button>
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