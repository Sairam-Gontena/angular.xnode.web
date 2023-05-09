import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from "../header/Header";
import './PageBody.css';
import Dashboard from "../../pages/dashboard/Dashboard";
import { getJSONData } from "../../util/Util";
import Page from "../../pages/common-page/CommonPage";
import MenuBar from "../menu/Menu";

const PageBody = () => {
    let [options, setOptions] = useState([])
    useEffect(() => {
        getJSONData("menu.json").then(resp => setOptions(resp.data));
    }, []);
    return (
        <div className="page-body-wrapper">
            <Header />
            {/* <MenuBar options={options}></MenuBar> */}
            <div className="page-content-wrapper">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" caseSensitive={false} element={<Dashboard />} />
                        {
                            options.map(option =>
                                <Route key={option.href} path={option.href} caseSensitive={false} element={<Page entityCode={option.code} path={option.servicePath} />} />
                            )
                        }
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    )
};

export default PageBody;