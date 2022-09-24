import { useContext, useState } from 'react';
import axios from 'axios';

import { encrypt  } from '../util/security';
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

function EditableEntry({ onDelete, entry_id, sitename, username, password, salt, iv, saltID }) {
    const [mode, setMode] = useState(0);
    const auth = useContext(authContext)

    const handleEdit = e => {
        console.log('Clicked edit!')
        setMode(1);
    }

    const handleDelete = e => {
        axios.delete(`http://localhost:8000/api/entry/${entry_id}`)
            .then(() => console.log('Deleted!'))
        onDelete(entry_id)
    }

    const handleSubmit = e => {
        e.preventDefault();
        const { encrypted, authTag } = encrypt(e.target.password.value, auth.key, salt, iv)
        axios.put('http://localhost:8000/api/entry/update_detail', {
            entry_id: entry_id,
            sitename: e.target.sitename.value,
            username: e.target.username.value,
            password: encrypted,
            authTag: authTag,
            saltID: saltID
        });
        setMode(0);
        // should also update the currently shown entries
    }

    if(mode === 0) {
        // view mode
        return (
            <div className='view-container'>
                <p>Site: {sitename}</p>
                <p>Username: {username}</p>
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
                        <TextInput type="text" name="password" placeholder={password} />
                    </div>
                    <TinyPrimaryButton width="430px" type="submit" > Submit </TinyPrimaryButton>
                </form>
            </div>
        )
    }
}

export default EditableEntry