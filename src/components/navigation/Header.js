import React from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import Nav from './Nav';

function Header(props) {
    return (
        <>
            <header id="header" className='header fixed-top d-flex align-item-center'>
                <Logo></Logo>
                {/*
                <SearchBar></SearchBar>
                */}
                <Nav></Nav>
            </header>
        </>
    );
}

export default Header;