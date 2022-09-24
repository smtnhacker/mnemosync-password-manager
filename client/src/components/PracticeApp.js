import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

import { decrypt } from '../util/security'
import authContext from '../util/authContext'

import './styles/PracticeApp.css'
import TextInput from './atoms/TextInput'
import FormGroup from './atoms/FormGroup'
import PrimaryButton from './atoms/PrimaryButton'

const updateEntry = async (entry) => {
    await axios.put(`http://localhost:8000/api/practice/finish-card/`, {
        ...entry
    });
}

function PracticeApp() {
    const [entries, setEntries] = useState('');
    const [retries, setRetries] = useState(2);
    const auth = useContext(authContext);

    const processEntries = entry => {
        // also get the password
        const password = decrypt(entry.passhash, auth.key, entry.salt, entry.iv, entry.authtag);
        if(entry.entry_detail_id) {
            return {...entry, password: password, left: 1};
        }
        else {
            return {...entry, password: password, left: 3};
        }
    }

    useEffect(() => {
        const getEntries = async () => {
            try{
                const res = await axios.get('http://localhost:8000/api/practice/start-practice',
                {withCredentials: true});
                return res.data;
            } catch (err) {
                console.log(err);
                return 'error';
            }
        }
        getEntries().then(res => setEntries(res.map(processEntries)));
    }, [])

    useEffect(() => console.log('updated entries!', entries), [entries]);

    if(entries === '') return <div>Loading...</div>
    if(entries.length === 0) return <div>Finished practice!</div>

    const handleSubmit = e => {
        e.preventDefault();

        // validate password
        const curEntry = entries[0];
        const inputPass = e.target[0].value;
        const newEntries = entries.slice(1);
        e.target.reset();

        if(inputPass !== curEntry.password) {
            alert('Wrong password!');
            if(retries === 0) {
                alert(`Password is ${curEntry.password}`);
                newEntries.push(curEntry);
                setEntries(newEntries);
                setRetries(2);
            }
            else {
                setRetries(retries-1);
            }
            return;
        }
        else {
            const newEntry = {
                ...curEntry,
                left: curEntry.left - 1
            };
            if(newEntry.left === 0) {
                updateEntry(curEntry);
                setEntries(newEntries);
                setRetries(2);
            }
            else {
                newEntries.push(newEntry);
                setEntries(newEntries);
                setRetries(2);
            }
        }

    }

    return (
        <div className="practice-container">
            <h3>Site: {entries[0].sitename}</h3>
            <h3>Username: {entries[0].username}</h3>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <label hidden>Password: </label>
                    <TextInput className="input-password" type="password" name="password" placeholder="Password" />
                </FormGroup>
                <PrimaryButton 
                    fontSize="0.8em" 
                    width="300px" 
                    type="submit"
                    padding="6px 12px"
                >Submit</PrimaryButton>
            </form>
        </div>
    )
}

export default PracticeApp