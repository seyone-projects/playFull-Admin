import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from './../../GlobalContext';
import config from '../../config';

function NavAvatar() {
  const {
    isLoading, setIsLoading,
    isAppError, setAppError,
    appErrorMessage, setAppErrorMessage,
    appErrorTitle, setAppErrorTitle,
    appErrorMode, setAppErrorMode,
    appUser, setAppUser,
    isLogin, setIsLogin,
    isLogoutRequest, setIsLogoutRequest
  } = useGlobalContext();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("oojwt");
    setIsLogin(false);
    setAppUser(null);
    setIsLogoutRequest(true); // if used anywhere else
    navigate('/login');
  };

  return (
    <>
      <li className='nav-item dropdown pe-3'>
        <Link className='nav-link nav-profile d-flex align-items-center pe-0' to='#' data-bs-toggle="dropdown">
          <img
            src={`${config.imageBasePath}/users/${appUser?._id}.${appUser?.image}`}
            alt={appUser?.username}
            className='rounded-circle'
          />        
          <span className='d-none d-md-block dropdown-toggle ps-2'>{appUser?.username}</span>
        </Link>

        <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow profile'>
          <li className='dropdown-header'>
            <h6>{appUser?.mobile}</h6>
            <span>{appUser?.role && (appUser.role[0].toUpperCase() + appUser.role.slice(1))}</span>
          </li>
          <li><hr className='dropdown-divider' /></li>

          <li>
            <Link className='dropdown-item d-flex align-items-center' to='/myprofile'>
              <i className='bi bi-person'></i>
              <span>My Profile</span>
            </Link>
          </li>
          <li><hr className='dropdown-divider' /></li>

          <li>
            <Link className='dropdown-item d-flex align-items-center' to='/mypassword'>
              <i className='bi bi-key'></i>
              <span>My Password</span>
            </Link>
          </li>
          <li><hr className='dropdown-divider' /></li>
          <li><hr className='dropdown-divider' /></li>

          <li>
            <Link
              className='dropdown-item d-flex align-items-center'
              onClick={handleLogout}
            >
              <i className='bi bi-lock'></i>
              <span>Sign Out</span>
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
}

export default NavAvatar;
