import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import MediaQuery from 'react-responsive';

import './App.css';
import userContext from './util/userContext';
import LargeNavBar from './components/NavBar/LargeNavBar';
import Footer from './components/Footer';
import SmallNavBar from './components/NavBar/SmallNavBar';

function App() {
  const user = useContext(userContext);
  const userID = user.userID;
  
  return (
    <div className="App">
      <MediaQuery minWidth={650}>
        <LargeNavBar logged={userID ? true : false} />
      </MediaQuery>
      <MediaQuery maxWidth={649}>
        <SmallNavBar logged={userID ? true : false} />
      </MediaQuery>
      <div className="App-body">
        <Outlet />
      </div>
      <MediaQuery minWidth={650}>
        <Footer />      
      </MediaQuery>
    </div>
  );
}

export default App;
