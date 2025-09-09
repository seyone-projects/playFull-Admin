import React from 'react'
import { Link } from 'react-router-dom';

function NavMessage() {
  return (
    <>
        <li className='nav-item dropdown d-none'>
            <Link className='nav-link nav-icon' to='#' data-bs-toggle="dropdown">
                <i className='bi bi-chat-left-text'></i>
                <span className='badge bg-success badge-number'>3</span>
            </Link>
            <ul className='dropdown-menu dropdown-menu-end dropdown-menu--arrow messages'>
                <li className='dropdown-header'>
                    You have 3 new messages
                    <Link to="#">
                        <span className='badge rounded-pill bg-primary p-2 ms-2'>
                            View All
                        </span>
                    </Link>
                </li>
                <li>
                    <hr className='dropdown-divider'></hr>
                </li>
                <li className='message-item'>
                    <Link to='#'>
                        <i className='bi bi-envelope text-warning'></i>
                        <div>
                            <h4>Ram Sundar</h4>
                            <p>
                                How to create a new food item in my kitchen
                            </p>
                            <p>1 hr. ago</p>
                        </div>
                    </Link>
                </li>
                <li>
                    <hr className='dropdown-divider'></hr>
                </li>
                <li className='message-item'>
                    <Link to='#'>
                        <i className='bi bi-envelope text-warning'></i>
                        <div>
                            <h4>Ram Sundar</h4>
                            <p>
                                How to create a new food item in my kitchen
                            </p>
                            <p>1 hr. ago</p>
                        </div>
                    </Link>
                </li>
                <li>
                    <hr className='dropdown-divider'></hr>
                </li>
                <li className='message-item'>
                    <Link to='#'>
                        <i className='bi bi-envelope text-warning'></i>
                        <div>
                            <h4>Ram Sundar</h4>
                            <p>
                                How to create a new food item in my kitchen
                            </p>
                            <p>1 hr. ago</p>
                        </div>
                    </Link>
                </li>
            </ul>
        </li>
    </>
  )
}

export default NavMessage;