import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';
import AppHeader from './components/app-header/AppHeader';
import AppSideMenu from './components/app-side-menu/AppSideMenu';
import PageBody from './components/page-body/PageBody';

const App = () => {
  return (
    <div className='w-full'>
      <AppHeader />
      <div className='grid col-12 p-0 m-0'>
        <AppSideMenu />
        <PageBody />

      </div>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" caseSensitive={false} element={<Home />} />
          <Route path="/dashboard" caseSensitive={false} element={<Dashboard />} />
        </Routes>
      </BrowserRouter> */}
    </div>
  );
}

export default App;
