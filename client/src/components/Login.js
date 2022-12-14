import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import userContext from '../util/userContext';
import authContext from '../util/authContext';
import API_ENDPOINT from '../config'

import Card from './atoms/Card'
import TextInput from './atoms/TextInput';
import FormGroup from './atoms/FormGroup';
import Label from './atoms/Label';
import PrimaryButton from './atoms/PrimaryButton';
import SecondaryButton from './atoms/SecondaryButton';

function Login({ loginSuccessRedirect }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // add a context for user session
    
    const navigate = useNavigate();
    const user = useContext(userContext);
    const auth = useContext(authContext);

    useEffect(() => {
        if(user.userID) {
            console.log('Already logged in. Redirecting...')
            navigate(loginSuccessRedirect, { replace: true });
        }
    })

    const handleSubmit = async (e, getUser) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_ENDPOINT}/api/login`, {
                username: username,
                password: password
            }, {withCredentials: true});
            
            console.dir(res.data);
            axios.defaults.headers.common['XSRF-TOKEN'] = res.data.token;
            getUser();
            auth.setKey(password);
            navigate(loginSuccessRedirect);
        } catch (err) {
            if (err.response) {
                console.dir(err.response)
            }
        }
    }

    return (
        <userContext.Consumer>
            {({userID, getUser}) => (
            <div style={{
                display: "flex",
                justifyContent: "center"
            }}>
                <Card>
                    <form onSubmit={e => handleSubmit(e, getUser)} >
                        <h3>login</h3>
                        <FormGroup>
                            <Label hidden>username</Label> 
                            <TextInput 
                                type="text"  
                                id="userInput" 
                                name="username"
                                value={username}
                                placeholder="Username"
                                required
                                onChange={(e) => setUsername(e.target.value)}    
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label hidden>password</Label> 
                            <TextInput 
                                type="password"  
                                id="passInput" 
                                name="password"
                                value={password}
                                placeholder= "Password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormGroup>
                        <PrimaryButton width="30ch" type="submit">Login</PrimaryButton>
                        <SecondaryButton padding="6px" fontSize="0.6em" onClick={() => navigate('/signup')}>
                            I'm new here
                        </SecondaryButton>
                    </form>
                </Card>
            </div>
            )}
        </userContext.Consumer>
    )
}

export default Login;