import axios from 'axios';
import { useState, useEffect } from 'react';
import { 
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import authContext from './util/authContext';
import userContext from './util/userContext';
import useUser from './hooks/useUser';
import API_ENDPOINT from './config'

import App from './App';
import Landing from './components/Landing';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Main from './components/Main';
import Stats from './components/Stats';
import PasswordModal from './components/PasswordModal';

const ProtectedPage = ({ hasAccess, children }) => {
    if (!hasAccess) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

const RoutingWrapper = () => {
    const [userID, getUser, deleteUser] = useUser();
    const [key, setKey] = useState()
    const [token, setToken] = useState()
    // const channelKey = useHandshake([])

    const obtainToken = () => {
        if (!token) {
            axios.get(`${API_ENDPOINT}/api/security/token`, { withCredentials: true })
                .then(res => {
                    setToken(res.data.token)
                    axios.defaults.headers.common['XSRF-TOKEN'] = res.data.token
                    console.log("Token obtained", res.data.token)
                })
        } else {
            axios.defaults.headers.common['XSRF-TOKEN'] = token
        }
    }

    const deleteToken = () => {
        if (token) {
            delete axios.defaults.headers.common['XSRF-TOKEN']
            setToken(null);
        }
    }

    useEffect(() => {
        getUser();
        obtainToken();
    }, [])

    useEffect(() => {
        console.log('UserID:', userID);
    }, [userID])

    const userState = {
        userID: userID,
        getUser: getUser,
        deleteUser: deleteUser,
    };

    const authState = {
        key: key,
        setKey: setKey,
        token: token,
        setToken: obtainToken,
        deleteToken: deleteToken
    }
    console.dir(authState)

    return (
        <authContext.Provider value={authState}>
            <userContext.Provider value={userState}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App />}>
                            <Route index element={<Landing />} />
                            <Route path="login" element={<Login loginSuccessRedirect={'/home'} />} />
                            <Route path="signup" element={<SignUp signupSuccessRedirect={'/login'} />} />
                            <Route path="home" element={
                                <ProtectedPage hasAccess={!!userID}>
                                    {authState.key ? <Dashboard /> : <PasswordModal onSubmit={key => setKey(key)}/>}
                                </ProtectedPage>
                            } >
                                <Route index element={<Stats />} />
                                <Route path=":mode" element={<Main />} />
                            </Route>
                            <Route path="*" element={<p>Page does not exist</p>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </userContext.Provider>
        </authContext.Provider>
   ) 
}

export default RoutingWrapper