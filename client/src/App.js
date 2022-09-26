import { Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import './App.css';
import userContext from './util/userContext';
import NavBar from './components/NavBar';

function App() {
  const user = useContext(userContext);
  const userID = user.userID;
  
  return (
    <div className="App">
      <NavBar logged={userID ? true : false} />
      <header className="App-header">
        <Outlet />
      </header>
    </div>
  );
}

export default App;
