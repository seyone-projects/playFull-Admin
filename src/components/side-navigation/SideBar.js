import React from 'react';
//import fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

function SideBar() {
    return (
        <>
            <aside id='sidebar' className='sidebar'>
                <ul className='sidebar-nav' id='sidebar-nav'>
                    <li className='nav-item'>
                        <Link className='nav-link' to='/'>
                            <i className='bi bi-grid'></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link collapsed' data-bs-target="#user-nav" data-bs-toggle="collapse" to='#'>
                            <i className='bi bi-people'></i>
                            <span>Members</span>
                            <i className='bi bi-chevron-down ms-auto'></i>
                        </Link>
                        <ul id='user-nav' className='nav-content collapse' data-bs-parent="#sidebar-nav">
                            <li>
                                <Link to='/user/manage'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>New Member</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/user/trainer/list'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Search Trainer</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/user/student/list'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Search Student</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link collapsed' data-bs-target="#brand-nav" data-bs-toggle="collapse" to='#'>
                            <i className='bi bi-building'></i>
                            <span>Sections</span>
                            <i className='bi bi-chevron-down ms-auto'></i>
                        </Link>
                        <ul id='brand-nav' className='nav-content collapse' data-bs-parent="#sidebar-nav">
                            <li>
                                <Link to='/section/manage'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>New Section</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/section/list'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Search Section</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link collapsed' data-bs-target="#catgory-nav" data-bs-toggle="collapse" to='#'>
                            <i className='bi bi-grid'></i>
                            <span>Categories</span>
                            <i className='bi bi-chevron-down ms-auto'></i>
                        </Link>
                        <ul id='catgory-nav' className='nav-content collapse' data-bs-parent="#sidebar-nav">
                            <li>
                                <Link to='/category/manage'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>New Category</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/category/list'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Search Category</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link collapsed' data-bs-target="#sub-catgory-nav" data-bs-toggle="collapse" to='#'>
                            <i className='bi bi-layers'></i>
                            <span>Sub Categories</span>
                            <i className='bi bi-chevron-down ms-auto'></i>
                        </Link>
                        <ul id='sub-catgory-nav' className='nav-content collapse' data-bs-parent="#sidebar-nav">
                            <li>
                                <Link to='/sub-category/manage'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>New Sub Category</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/sub-category/list'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Search Sub Category</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link collapsed' data-bs-target="#course-nav" data-bs-toggle="collapse" to='#'>
                            <i className="bi bi-journal-bookmark me-2"></i>
                            <span>Courses</span>
                            <i className='bi bi-chevron-down ms-auto'></i>
                        </Link>
                        <ul id='course-nav' className='nav-content collapse' data-bs-parent="#sidebar-nav">
                            <li>
                                <Link to='/course/manage'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>New Course</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/course/list'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Search Course</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link collapsed' data-bs-target="#batch-nav" data-bs-toggle="collapse" to='#'>
                            <i className="bi bi-people me-2"></i>
                            <span>Batches</span>
                            <i className='bi bi-chevron-down ms-auto'></i>
                        </Link>
                        <ul id='batch-nav' className='nav-content collapse' data-bs-parent="#sidebar-nav">
                            <li>
                                <Link to='/batch/manage'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>New Batch</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/batch/list'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Search Batch</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                     <li className='nav-item'>
                        <Link className='nav-link' to='/leave-request/list'>
                            <i className='bi bi-grid'></i>
                            <span>Leave Request</span>
                        </Link>
                    </li>
                    <li className='nav-item d-none'>
                        <Link className='nav-link collapsed' data-bs-target="#reports-nav" data-bs-toggle="collapse" to='#'>
                           <i className="bi bi-clipboard-data me-2"></i>
                            <span>Reports</span>
                            <i className='bi bi-chevron-down ms-auto'></i>
                        </Link>
                        <ul id='reports-nav' className='nav-content collapse' data-bs-parent="#sidebar-nav">
                            <li>
                                <Link to='/report/student/payment/'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Student Payment Reports</span>
                                </Link>
                            </li>                           
                        </ul>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link collapsed' data-bs-target="#paymentreports-nav" data-bs-toggle="collapse" to='#'>
                           <i className="bi bi-cash-coin me-2"></i>
                            <span> Payment Reports</span>
                            <i className='bi bi-chevron-down ms-auto'></i>
                        </Link>
                        <ul id='paymentreports-nav' className='nav-content collapse' data-bs-parent="#sidebar-nav">
                            <li>
                                <Link to='/report/student/collection/payment/'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Collection Reports</span>
                                </Link>
                            </li>  
                            <li>
                                <Link to='/report/student/pending/payment/'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Pending Reports</span>
                                </Link>
                            </li>   
                             <li>
                                <Link to='/report/monthly/payment/'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Monthly Reports</span>
                                </Link>
                            </li>                           
                        </ul>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link collapsed' data-bs-target="#attendancereports-nav" data-bs-toggle="collapse" to='#'>
                           <i className="bi bi-person-check me-2"></i>
                            <span> Attendance Reports</span>
                            <i className='bi bi-chevron-down ms-auto'></i>
                        </Link>
                        <ul id='attendancereports-nav' className='nav-content collapse' data-bs-parent="#sidebar-nav">
                            <li>
                                <Link to='/report/batch/attendance/'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Batch wise Reports</span>
                                </Link>
                            </li>  
                            <li>
                                <Link to='/report/student/attendance/'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Student wise Reports</span>
                                </Link>
                            </li> 
                             <li>
                                <Link to='/report/lessonplanner/attendance/'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Lesson wise Reports</span>
                                </Link>
                            </li>  
                             <li>
                                <Link to='/report/monthly/attendance/'>
                                    <i className='bi bi-arrow-right'></i>
                                    <span>Monthly Reports</span>
                                </Link>
                            </li>                           
                        </ul>
                    </li>
                </ul>
            </aside>
        </>
    )
}

export default SideBar