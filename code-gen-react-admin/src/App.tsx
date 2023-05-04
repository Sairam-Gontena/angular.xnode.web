import './App.css';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from './pages/Login';
import ApplicationDetails from './pages/ApplicationDetails';

function App() {
  const token = localStorage.getItem('LOGGED_IN_USER');

  return (
    <div className='App'>
      {!token ? <Login></Login> :
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/app-details" element={<ApplicationDetails />} />
          </Routes>
        </Router>}
    </div>
  );
}

export default App;
