
import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import './MenubarStyles.css';
import { ListBox } from 'primereact/listbox';
import { useNavigate } from 'react-router-dom';

export const MenubarComponent = () => {
    const items = [
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out'
        }
    ];
    const [openMenuOptions, setOpenMenuOptions] = useState(false);
    const [selectedMenuOption, setSelectedMenuOption] = useState(null);
    const USER = localStorage.getItem('LOGGED_IN_USER')
    const menuOptions = [
        { label: 'Logout', value: 'logout', icon: 'pi-fw pi-sign-out' },
    ];

    const menuTemplate = (option: any) => {
        return (
            <div className="flex align-items-center">
                <i className={`pi ${option.icon}`} />
                <div className='ml-2'>{option.label}</div>
            </div>
        );
    }

    const onOptionSelect = (event: any) => {
        setSelectedMenuOption(event.value)
        if (event.value === 'logout') {
            localStorage.removeItem('LOGGED_IN_USER');
            window.location.reload();
        }

    }

    const end = (
        <div className='flex align-items-center'>
            <p style={{ "marginRight": "50px" }}> Last Login time: Apr 10, 22 05:45:PM </p>
            <p className='user-name'>{USER}</p>
            <img className='ml-2 mr-2 user-photo cursor-pointer relative' src='https://startbootstrap.github.io/startbootstrap-sb-admin-2/img/undraw_profile.svg' onClick={() => setOpenMenuOptions(!openMenuOptions)}></img>
            {openMenuOptions && (
                <ListBox className='override-listbox' value={selectedMenuOption} options={menuOptions} onChange={(e) => onOptionSelect(e)} itemTemplate={menuTemplate} />
            )}
        </div>
    );
    const start = (<h2>Welcome {USER}!</h2>)

    return (
        <div>
            <div className="card">
                <Menubar start={start} end={end} className="override-menu" />
            </div>
        </div>
    );
}
