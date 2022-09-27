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
    }, { withCredentials: true });
}

function PracticeApp() {
    // might need to use useReducer for these...
    const [loading, setLoading] = useState(false);
    const [decoding, setDecoding] = useState(false);
    const [error, setError] = useState(false);
    const [decodeError, setDecodeError] = useState(false);
    const [entries, setEntries] = useState([]);

    const [retries, setRetries] = useState(2);
    const auth = useContext(authContext);

    const processEntries = arr => {
        // also get the password
        if (arr.length) {
            setDecoding(true);
        }
        arr.forEach((entry) => {
            setTimeout(() => {
                // const password = decrypt(entry.passhash, auth.key, entry.salt, entry.iv, entry.authtag);
                setEntries(prev => {
                    if (entry.entry_detail_id) {
                        return [...prev, {...entry, left: 1}];
                    }
                    else {
                        return [...prev, {...entry, left: 3}];
                    }
                })
                setDecoding(false);
            }, 0)
        })
    }

    useEffect(() => {
        const getEntries = async () => {
            setLoading(true);
            setError(false);
            try{
                const res = await axios.get('http://localhost:8000/api/practice/start-practice',
                {withCredentials: true});
                setLoading(false);
                return res.data;
            } catch (err) {
                setError(true);
                setLoading(false);
                throw err;
            }
        }
        getEntries()
            .then(res => processEntries(res))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => console.log('updated entries!', entries), [entries]);

    if (loading) return <div>Fetching passwords...</div>
    else if (decoding) return <div>Decoding encryption...</div>
    else if (decodeError) return <div>Cannot decode password using given key. If the key is wrong, please refresh the page to reenter key.</div>
    else if (error) return <div>Something went wrong :(</div>
    else if(entries.length === 0) return <div>Finished practice!</div>

    const handleSubmit = e => {
        e.preventDefault();

        // validate password
        const curEntry = entries[0];
        const inputPass = e.target[0].value;
        const newEntries = entries.slice(1);
        e.target.reset();

        let password = curEntry.password;

        if (!password) {
            try {
                password = decrypt(
                    curEntry.passhash,
                    auth.key,
                    curEntry.salt,
                    curEntry.iv,
                    curEntry.authtag
                );
                curEntry.password = password
            } catch (err) {
                return setDecodeError(true);
            }
        }


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