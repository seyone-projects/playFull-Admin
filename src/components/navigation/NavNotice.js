import React from 'react'
import { Link } from 'react-router-dom';

function NavNotice() {
  return (
    <>
        <li className='nav-item dropdown d-none'>
            <Link className='nav-link nav-icon' to='#' data-bs-toggle="dropdown">
                <i className='bi bi-bell'></i>
                <span className='badge bg-primary badge-number'>4</span>
            </Link>
            <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications'>
                <li className='dropdown-header'>
                    You have 4 new notifications
                    <Link to='#'>
                        <span className='badge rounded-pill bg-primary p-2 ms-2'>
                            View All
                        </span>
                    </Link>
                </li>
                <li>
                    <hr className='dropdown-divider'></hr>
                </li>
                <li className='notification-item'>
                    <i className='bi bi-exclamation-circle text-warning'></i>
                    <div>
                        <h4>New Order No. 243</h4>
                        <p>From Mr.Ashok Raj</p>
                        <p>30 min. age</p>
                    </div>
                </li>
                <li>
                    <hr className='dropdown-divider'></hr>
                </li>
                <li className='notification-item'>
                    <i className='bi bi-exclamation-circle text-warning'></i>
                    <div>
                        <h4>New Order No. 243</h4>
                        <p>From Mr.Ashok Raj</p>
                        <p>30 min. age</p>
                    </div>
                </li>
                <li>
                    <hr className='dropdown-divider'></hr>
                </li>
                <li className='notification-item'>
                    <i className='bi bi-exclamation-circle text-warning'></i>
                    <div>
                        <h4>New Order No. 243</h4>
                        <p>From Mr.Ashok Raj</p>
                        <p>30 min. age</p>
                    </div>
                </li>
            </ul>
        </li>
    </>
  )
}

export default NavNotice;