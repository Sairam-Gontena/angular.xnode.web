import React from 'react';
import './SideMenu.css';
import LOGO from '../../assets/logo.svg';

const SideMenu = () => {
    return (
        <div className='side-menu-wrapper text-center'>
            <div className='logo-grid flex justify-content-center flex-wrap'>
                <img src={LOGO} alt="logo" />
            </div>
        </div>
    )
}


export default SideMenu;