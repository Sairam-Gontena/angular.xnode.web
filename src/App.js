import './App.css';
import React, { useEffect, useState } from 'react';
import Page from './pages/common-page/CommonPage';
import MenuBar from './components/menu/Menu';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import { getJSONData } from './util/Util'
import Header from './components/header/Header';
import SideMenu from './components/side-menu/SideMenu';
import PageBody from './components/page-body/PageBody';
import Home from './pages/home/Home';

const App = () => {
  let [options, setOptions] = useState([])
  useEffect(() => {
    getJSONData("menu.json").then(resp => setOptions(resp.data));
  }, []);

  return (
    <div className=' w-full'>
      {/* <SideMenu /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" caseSensitive={false} element={<Home />} />
          <Route path="/dashboard" caseSensitive={false} element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      {/* <MenuBar options={options}></MenuBar> */}
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" caseSensitive={false} element={<Dashboard />} />
          {
            options.map(option =>
              <Route key={option.href} path={option.href} caseSensitive={false} element={<Page entityCode={option.code} path={option.servicePath} />} />
            )
          }
        </Routes>
      </BrowserRouter> */}
    </div>
  );
}

export default App;
