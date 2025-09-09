import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { useParams } from 'react-router-dom';
import { GetUserById, UpdateMemberPassword } from '../../service/UserService';

export default function MyPassword() {

  const {
    isLoading,
    setIsLoading,
    setAppError,
    setAppErrorMessage,
    setAppErrorTitle,
    setAppErrorMode
  } = useGlobalContext();


  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchUserById = async () => {
    try {
      setIsLoading(true);
      var response = await GetUserById(id);
      if (response.status === 200) {
        setUser(response.user);
        setRole(response.user.role);
        setName(response.user.username);
        setMobile(response.user.mobile);
      }
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to load data");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (event) => {
    event.preventDefault();

    //new password is required
    if (!newPassword) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Please enter a new password");
      setAppErrorMode("error");
      return;
    }
    //confirm password is required
    if (!confirmPassword) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Please enter a confirm password");
      setAppErrorMode("error");
      return;
    }

    //confirm password is same as new password
    if (newPassword !== confirmPassword) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("New password and confirm password do not match");
      setAppErrorMode("error");
      return;
    }
    setIsLoading(true);

    try {
      const response = await UpdateMemberPassword(id, newPassword);
      if (response.status === 200) {
        setAppError(true);
        setAppErrorTitle("Action Response");
        setAppErrorMessage(response.message || "User Successfully Added");
        setAppErrorMode("success");
        if (role === "student") {
          window.location.href = "/user/student/list";
        } else if (role === "trainer") {
          window.location.href = "/user/trainer/list";
        }
      } else {
        setAppError(true);
        setAppErrorTitle("Error");
        setAppErrorMessage(response.message || "Action failed. Please try again.");
        setAppErrorMode("error");
      }
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Something went wrong. Please try again.");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) {
      fetchUserById();
    }
  }, [id]);

  return (
    <>
      <Helmet>
        <title>Member Password Update | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            {role === "student" ? (
              <h1>Update Student Password</h1>
            ) : (
              <h1>Update Trainer Password</h1>
            )}
            <span>
              <Link to="/">Dashboard</Link> /{" "}
              {role === "student" ? (
                <Link to="/user/student/list">Student List</Link>
              ) : (
                <Link to="/user/trainer/list">Trainer List</Link>
              )}{" "}
              / Update Password
            </span>
          </div>
          <div className='page-content'>
            <div className="portal">
              <div className='portal-body'>
                <div className='form'>
                  <div className='row'>
                    <div className='col-12'>
                      <div className='mb-3'>
                        {role === "student" ? (
                          <h5>Student Name : {name} [  Mobile : {mobile} ] </h5>
                        ) : (
                          <h5>Trainer Name : {name}  [  Mobile : {mobile} ] </h5>
                        )}
                      </div>
                    </div>
                    <form onSubmit={saveUser} encType='multipart/form-data'>
                      <div className='row'>
                        <div className='col-lg-4 col-md-4 col-sm-6 col-12'>
                          <div className="mb-3 position-relative">
                            <label className="form-label">New Password</label>
                            <input
                              className='form-control pe-5'
                              type={showPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <i
                              className={`ri-${showPassword ? 'eye-off-line' : 'eye-line'} position-absolute`}
                              style={{ top: '38px', right: '15px', cursor: 'pointer' }}
                              onClick={() => setShowPassword(!showPassword)}
                            ></i>
                          </div>
                        </div>

                        <div className='col-lg-4 col-md-4 col-sm-6 col-12'>
                          <div className="mb-3 position-relative">
                            <label className="form-label">Re-type New Password</label>
                            <input
                              className='form-control pe-5'
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <i
                              className={`ri-${showConfirmPassword ? 'eye-off-line' : 'eye-line'} position-absolute`}
                              style={{ top: '38px', right: '15px', cursor: 'pointer' }}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            ></i>
                          </div>
                        </div>

                      </div>
                      <div className='clearfix'></div>
                      <div className='col-12 text-end'>
                        <div className="mb-3">
                          <button type='reset' className='btn btn-danger btn-md'> <i class="ri-reset-right-line"></i> Reset </button>
                          &nbsp;&nbsp;
                          <button type='submit' className='btn btn-success-app btn-md'> <i class="ri-check-fill"></i> Update Password </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}