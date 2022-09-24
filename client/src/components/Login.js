import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import userContext from '../util/userContext';
import authContext from '../util/authContext';

import Card from './atoms/Card'
import TextInput from './atoms/TextInput';
import FormGroup from './atoms/FormGroup';
import Label from './atoms/Label';
import PrimaryButton from './atoms/PrimaryButton';

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
            const res = await axios.post("http://localhost:8000/login", {
                username: username,
                password: password
            }, {withCredentials: true});
            
            alert(res.data.msg);
            getUser();
            auth.setKey(password);
            navigate(loginSuccessRedirect);
        } catch (err) {
            if (err.response) {
                alert(err.response.data.msg)
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
                        <h3>Login</h3>
                        <FormGroup>
                            <Label>Username</Label> 
                            <TextInput 
                                type="text"  
                                id="userInput" 
                                name="username"
                                value={username}
                                required
                                onChange={(e) => setUsername(e.target.value)}    
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Password</Label> 
                            <TextInput 
                                type="password"  
                                id="passInput" 
                                name="password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormGroup>
                        <PrimaryButton type="submit">Login</PrimaryButton>
                    </form>
                </Card>
            </div>
            )}
        </userContext.Consumer>
    )
}

export default Login;