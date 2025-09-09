import React from 'react'
import NavNotice from './NavNotice';
import NavMessage from './NavMessage';
import NavAvatar from './NavAvatar';

function Nav() {
  return (
    <>
        <nav className='header-nav ms-auto'>
            <ul className='d-flex align-items-center'>
                <NavNotice></NavNotice>
                <NavMessage></NavMessage>
                <NavAvatar></NavAvatar>
            </ul>
        </nav>
    </>
  )
}

export default Nav