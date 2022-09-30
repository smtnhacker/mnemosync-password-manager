import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { encrypt } from "../util/security"
import authContext from "../util/authContext";
import API_ENDPOINT from "../config"

import TextInput from "./atoms/TextInput";
import PrimaryButton from "./atoms/PrimaryButton";
import SecondaryButton from "./atoms/SecondaryButton";

function AddEntries() {
    const navigate = useNavigate()
    const auth = useContext(authContext)
    const [status, setStatus] = useState('')
    const inputRef = useRef()

    useEffect(() => {
        inputRef.current.focus()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sitename = e.target.sitename.value;
        const username = e.target.username.value;
        const plainPassword = e.target.password.value;
        const { encrypted, authTag, iv, salt } = await encrypt(plainPassword, auth.key);
        const password = encrypted; 
        
        // validate input
        
        try {
            const res = await axios.post(`${API_ENDPOINT}/api/entry/new`, {
                sitename: sitename,
                username: username,
                password: password,
                authTag: authTag,
                iv: iv,
                salt: salt
            }, { withCredentials: true });

            console.dir(res)
            if (res.status === 200) {
                setStatus('Created entry')
                e.target.reset();
            } else {
                setStatus('Something went wrong')
            }

        } catch(error) {
            alert('Something went wrong. Entry not made :(')
            console.dir(error.response.data);
        }

    }

    const handleCancel = e => {
        e.preventDefault()
        navigate('../entries')
    }

    return (
        <div className="container" style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center" 
        }}>
            <form onSubmit={handleSubmit}>
                <h3>Add Entry</h3>
                <div className="form-entry">
                    <label hidden>Site Name: </label>
                    <TextInput 
                        type="text" 
                        id="sitename" 
                        name="sitename" 
                        placeholder="Site"
                        required
                        ref={inputRef}
                    />
                </div>
                <input type="password" style={{display: "none"}} />
                <div className="form-entry">
                    <label hidden>Username: </label>
                    <TextInput 
                        type="text" 
                        id="username" 
                        name="username" 
                        placeholder="Username" 
                        required
                    />
                </div>
                <div className="form-entry">
                    <label hidden>Password: </label>
                    <TextInput 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Password" 
                        minLength={4}
                        required
                    />
                </div>
                <PrimaryButton type="submit">Create</PrimaryButton>
                <SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
            </form>
            <p>{status}</p>
        </div>
    )
}

export default AddEntries