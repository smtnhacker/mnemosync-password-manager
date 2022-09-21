import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './App.css';
import userContext from './util/userContext';
import useUser from './hooks/useUser';
import useHandshake from './hooks/useHandshake';
import NavBar from './components/NavBar';

function App() {
  const [userID, getUser, deleteUser] = useUser();
  // const channelKey = useHandshake([])

  useEffect(() => {
    getUser();
  }, [])

  useEffect(() => {
    console.log('UserID:', userID);
  }, [userID])

  const userState = {
    userID: userID,
    getUser: getUser,
    deleteUser: deleteUser
  };

  return (
      <userContext.Provider value={userState}>
        <div className="App">
          <NavBar logged={userID ? true : false} />
          <header className="App-header">
            <Outlet />
          </header>
        </div>
      </userContext.Provider>
  );
}

export default App;
