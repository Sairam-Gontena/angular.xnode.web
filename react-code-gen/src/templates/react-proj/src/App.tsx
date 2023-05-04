import './App.css';
import { useEffect, useState } from 'react';
import Page from './pages/CommonPage';
import MenuBar from './components/Menu';
import {Login} from './pages/Login'

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { getJSONData } from './util/Util'

const App = () => {
  const token = localStorage.getItem('LOGGED_IN_USER');

  let [options, setOptions] = useState<any[]>([])
  useEffect(() => {
    getJSONData("menu.json").then(resp => { setOptions(resp.data) }).catch(e => {
      console.log(e, 'excp');
    });
  }, []);

  return (
    <>
    {!token ? <Login></Login> :
    <div className="App">
      <MenuBar options={options}></MenuBar>
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
    </div>}</>
  );
}

export default App;
