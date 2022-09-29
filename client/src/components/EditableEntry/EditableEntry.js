import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import MediaQuery from 'react-responsive'

import { encrypt, decrypt  } from '../../util/security';
import authContext from '../../util/authContext';
import API_ENDPOINT from "../../config"

import LargeItemEdit from './LargeItemEdit';
import LargeItemView from './LargeItemView';
import SmallItemView from './SmallItemView';
import SmallItemEdit from './SmallItemEdit';

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
                decrypt(passhash, auth.key, key_info.salt, key_info.iv, key_info.authTag)
                    .then(decoded => {
                        setPassword(decoded);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.log(err);
                        setLoading(false);
                        setError(true);
                    })
            }, 300);
        }
    }, [mode, auth.key])

    const handleEdit = e => {
        setMode(1);
    }

    const handleDelete = e => {
        axios.delete(`${API_ENDPOINT}/api/entry/${entry_id}`, { withCredentials: true })
            .then(() => console.log('Deleted!'))
        onDelete(entry_id)
    }

    const handleSubmit = async (e) => {
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
                                            await encrypt(e.target.password.value, auth.key, salt, iv) : 
                                            { encrypted: '', authTag: null }
            
            const newEntry = {}
            if (e.target.sitename.value) newEntry.sitename = e.target.sitename.value;
            if (e.target.username.value) newEntry.username = e.target.username.value;
            if (e.target.password.value) {
                newEntry.password = e.target.password.value;
                newEntry.authtag = authTag;
                newEntry.passhash = encrypted;
            }
            
            axios.put(`${API_ENDPOINT}/api/entry/update_detail`, {
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

        } catch (err) {
            console.log(err)
            setMode(0);
        }

    }

    if(mode === 0) {
        // view mode
        const viewProps = {
            sitename: sitename,
            username: username,
            onEdit: handleEdit,
            onDelete: handleDelete
        }
        return (
            <>
                <MediaQuery minWidth={650}>
                    <LargeItemView {...viewProps} />
                </MediaQuery>
                <MediaQuery maxWidth={649}>
                    <SmallItemView {...viewProps} />
                </MediaQuery>
            </>
        )
    }
    else {
        // edit mode
        const editProps = {
            onSubmit: handleSubmit,
            sitename: sitename,
            username: username,
            password: password,
            loading: loading,
            error: error
        }
        return (
            <>
                <MediaQuery minWidth={650}>
                    <LargeItemEdit {...editProps} />
                </MediaQuery>
                <MediaQuery maxWidth={649}>
                    <SmallItemEdit {...editProps} />
                </MediaQuery>
            </>
        )
    }
}

export default EditableEntry