import React from "react";
import './Header.css';

const Header = () => {
    return (
        <div className="header-wrapper flex">
            <div className="w-9  flex justify-content-start flex-wrap">
                <div class="flex align-items-center ml-4">Hi Good Morning</div>
                {/* <div class="flex align-items-center">2</div>
                <div class="flex align-items-center">3</div> */}
            </div>
            <div className="w-3">
                {/* 4 */}
            </div>
        </div>
    )
};

export default Header;