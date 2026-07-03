import React from 'react'
import { Link } from 'react-router-dom';
import config from '../../config';

export default function Logo() {
    const handleToggleSidebar = () => {
        document.body.classList.toggle('toggle-sidebar');
    }
    return (
        <>
            <div className='d-flex align-items-center justify-content-between'>
                <Link to='#' className='logo d-flex align-items-center'>
                    {/*
                    <span className='d-none d-lg-block'> Oonovoo Admin </span>
                    */}
                    <img src={config.logo} alt="My Logo" />
                    <span className='d-none d-lg-block'> Admin Panel </span>
                </Link>
                <i className='bi bi-list toggle-sidebar-btn' onClick={handleToggleSidebar}>
                </i>
            </div>
        </>
    )
}