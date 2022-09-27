import { Outlet } from 'react-router-dom';
import { useContext } from 'react';

import './App.css';
import userContext from './util/userContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  const user = useContext(userContext);
  const userID = user.userID;
  
  return (
    <div className="App">
      <NavBar logged={userID ? true : false} />
      <header className="App-header">
        <Outlet />
      </header>
      <Footer />      
    </div>
  );
}

export default App;
