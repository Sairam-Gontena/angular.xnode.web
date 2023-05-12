import React from "react";
import OVERVIEW from '../../assets/overview.svg';
import DESIGN from '../../assets/design.svg';
import PUBLISH from '../../assets/publish.svg';
import SETTINGS from '../../assets/settings.svg';


import './AppSideMenu.css';

const AppSideMenu = () => {
    return (
        <div className='side-menu-wrapper text-center'>
            <div class="flex flex-column ">
                <div class="flex align-items-center justify-content-center menu-item-grid-height ">
                    <div className="flex flex-column">
                        <div>
                            <img src={OVERVIEW} alt="overview" />
                        </div>
                        <div className="menu-label">
                            Overview
                        </div>
                    </div>
                </div>
                <div class="flex align-items-center justify-content-center menu-item-grid-height">
                    <div className="flex flex-column">
                        <div>
                            <img src={OVERVIEW} alt="overview" />
                        </div>
                        <div className="menu-label">
                            Usecase
                        </div>
                    </div>
                </div>
                <div class="flex align-items-center justify-content-center menu-item-grid-height active">
                    <div className="flex flex-column">
                        <div>
                            <img src={DESIGN} alt="overview" />
                        </div>
                        <div className="menu-label">
                            Design
                        </div>
                    </div>
                </div>
                <div class="flex align-items-center justify-content-center menu-item-grid-height">
                    <div className="flex flex-column">
                        <div>
                            <img src={PUBLISH} alt="overview" />
                        </div>
                        <div className="menu-label">
                            Publish
                        </div>
                    </div>
                </div>
                <div class="flex align-items-center justify-content-center menu-item-grid-height">
                    <div className="flex flex-column">
                        <div>
                            <img src={SETTINGS} alt="overview" />
                        </div>
                        <div className="menu-label">
                            Settings
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AppSideMenu;