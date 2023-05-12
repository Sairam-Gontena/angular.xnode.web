import React from 'react';
import X from '../../assets/x.svg';
import NODE from '../../assets/node.svg';
import DP from '../../assets/dp.svg';

const AppHeader = () => {
    return (
        <div className="grid m-0 relative h-full">
            <div className="col-12 p-0">
                <div className="mini-header-wrapper flex pl-4 pr-4">
                    <div className="w-9  flex justify-content-start flex-wrap">
                        <div class="flex align-items-center ml-4">
                            <img src={NODE} alt="" />
                            <img src={X} alt="" />
                        </div>
                        <div class="flex flex-wrap column-gap-4 ml-8">
                            <div class=" flex align-items-center justify-content-center text-xs pointer">File</div>
                            <div class=" flex align-items-center justify-content-center text-xs pointer">Edit</div>
                            <div class=" flex align-items-center justify-content-center text-xs pointer">View</div>
                            <div class=" flex align-items-center justify-content-center text-xs pointer">Project</div>
                            <div class=" flex align-items-center justify-content-center text-xs pointer">Run</div>
                            <div class=" flex align-items-center justify-content-center text-xs pointer">Version Control</div>
                            <div class=" flex align-items-center justify-content-center text-xs pointer">Language</div>
                            <div class=" flex align-items-center justify-content-center text-xs pointer">Help</div>
                        </div>
                    </div>
                    <div className="w-3 flex justify-content-end ">
                        <div class="flex flex-wrap column-gap-2 ">
                            <img src={DP} alt="dp" />
                            <div class=" flex align-items-center justify-content-center text-xs pointer">Reymond Nelson</div>
                            <div class=" flex align-items-center justify-content-center text-xs pointer">
                                <i className="pi pi-angle-down" style={{ color: 'slateblue' }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AppHeader;