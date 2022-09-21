import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import './index.css';
import App from './App';
import Landing from './components/Landing';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Main from './components/Main';
import Stats from './components/Stats';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login loginSuccessRedirect={'/home'} />} />
          <Route path="signup" element={<SignUp signupSuccessRedirect={'/login'} />} />
          <Route path="home" element={<Dashboard />} >
            <Route index element={<Stats />} />
            <Route path=":mode" element={<Main />} />
          </Route>
          <Route path="*" element={<p>Page does not exist</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
