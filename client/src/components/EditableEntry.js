import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { encrypt, decrypt  } from '../util/security';
import authContext from '../util/authContext';

import './styles/EditableEntries.css';
import TextInput from './atoms/TextInput';
import PrimaryButton from './atoms/PrimaryButton';
import SecondaryButton from './atoms/SecondaryButton';

const TinyPrimaryButton = props => {
    return (
        <PrimaryButton
            fontSize="0.5em" 
            width="100px" 
            padding="6px 12px"
            {...props}>{props.children}</PrimaryButton>
    )
}

const TinySecondaryButton = props => {
    return (
        <SecondaryButton
            fontSize="0.5em" 
            width="100px" 
            padding="6px 12px"
            {...props}>{props.children}</SecondaryButton>
    )
}

function EditableEntry({ onDelete, entry_id, sitename, username, passhash, key_info, salt, iv, saltID, onUpdate }) {
    const auth = useContext(authContext);
    const [mode, setMode] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [password, setPassword] = useState();

    useEffect(() => {
        if (mode === 1 && !password) {
            setLoading(true);
            setTimeout(() => {
                try {
                    const decoded = decrypt(passhash, auth.key, key_info.salt, key_info.iv, key_info.authTag);
                    setPassword(decoded);
                    setLoading(false);
                } catch (err) {
                    setLoading(false);
                    setError(true);
                }
            }, 300);
        }
    }, [mode, auth.key])

    const handleEdit = e => {
        console.log('Clicked edit!')
        setMode(1);
    }

    const handleDelete = e => {
        axios.delete(`http://localhost:8000/api/entry/${entry_id}`, { withCredentials: true })
            .then(() => console.log('Deleted!'))
        onDelete(entry_id)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!e.target.password.value &&
            !e.target.sitename.value &&
            !e.target.username.value) {
                console.log("Nothing changed...");
                setMode(0);
                return;
            }

        try {
            const { encrypted, authTag } = e.target.password.value ? 
                                            encrypt(e.target.password.value, auth.key, salt, iv) : 
                                            { encrypted: '', authTag: null }
            
            const newEntry = {}
            if (e.target.sitename.value) newEntry.sitename = e.target.sitename.value;
            if (e.target.username.value) newEntry.username = e.target.username.value;
            if (e.target.password.value) {
                newEntry.password = e.target.password.value;
                newEntry.authtag = authTag;
                newEntry.passhash = encrypted;
            }
            
            axios.put('http://localhost:8000/api/entry/update_detail', {
                entry_id: entry_id,
                sitename: e.target.sitename.value,
                username: e.target.username.value,
                password: encrypted,
                authTag: authTag,
                saltID: saltID
            }, { withCredentials: true });
    
            setMode(0);
            onUpdate(newEntry)
            if (e.target.password.value) {
                setPassword(e.target.password.value)
            }
            // should also update the currently shown entries

        } catch (err) {
            console.log(err)
            setMode(0);
        }

    }

    if(mode === 0) {
        // view mode
        return (
            <div className='view-container'>
                <p title="Site"><span className="sitename">{sitename}</span></p>
                <p title="Username"><span className="username">{username}</span></p>
                {/* <p>Password: {password}</p> */}
                <TinyPrimaryButton onClick={handleEdit}>Edit</TinyPrimaryButton>
                <TinySecondaryButton onClick={handleDelete}>Delete</TinySecondaryButton>
            </div>
        )
    }
    else {
        // edit mode
        return (
            <div className='edit-container'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Site:</label>
                        <TextInput type="text" name="sitename" placeholder={sitename} />
                    </div>
                    <div>
                        <label>Username:</label>
                        <TextInput type="text" name="username" placeholder={username} />
                    </div>
                    <div>
                        <label>Password:</label>
                        {loading ? 
                            <TextInput name="password" disabled placeholder="Decoding..." /> :
                         error ? 
                            <TextInput name="password" disabled placeholder="Invalid key. Please refresh" /> :
                            <TextInput type="text" name="password" placeholder={password} />}
                    </div>
                    <TinyPrimaryButton width="430px" type="submit" > Submit </TinyPrimaryButton>
                </form>
            </div>
        )
    }
}

export default EditableEntry