import axios from 'axios'
import styled from "styled-components"
import React, { useState, useEffect } from 'react'

import API_ENDPOINT from '../config'

import { THEME } from '../constants'
import EditableEntry from './EditableEntry'

const Container = styled.div`
    text-align: left;
    background-color: rgba(0,0,0,0.1);
    padding: 10px 100px;
    width: 70%;
    min-height: 300px;
    max-height: 500px;
    overflow-y: overlay;
`

const Button = styled.button`
    background-color: ${THEME.PRIMARY};
    font-size: 2em;
    font-weight: bolder;
    color: white;
    border-radius: 7px;
    margin: 0px 15px;
    
    &:hover {
        cursor: pointer;
    }

    &:active {
        background-color: ${THEME.PRIMARY_DARKER};
    }
`

function EditEntries({ onNew }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [entries, setEntries] = useState([]);
    const [hasDelete, setHasDelete] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_ENDPOINT}/api/entry/list`, {withCredentials: true})
            .then(res => {
                setEntries(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setError(true);
                setLoading(false);
            })
    }, [hasDelete]);

    useEffect(() => console.log('Got entries:', entries), [entries])

    const handleDelete = entry_id => {
        setHasDelete(entry_id)
    }

    const handleEntryChange = (entry_id, newEntry) => {
        setEntries(prev => {
            return prev.map(entry => {
                if (entry.entry_id === entry_id) {
                    console.log("New Entry")
                    console.dir({...entry, ...newEntry})
                    return { ...entry, ...newEntry }
                } else {
                    return entry;
                }
            })
        })
    }
    console.dir(entries)

    if (loading) return <div>Loading...</div>
    else if (error) return <div>An error occurred :(</div>

    return (
        <>
            <Container>
                {
                entries.length > 0?
                entries.map(entry => {
                    return (
                        <React.Fragment key={entry.entry_id}>
                            <EditableEntry
                                onDelete={handleDelete}
                                entry_id={entry.entry_id}
                                sitename={entry.sitename}
                                username={entry.username}
                                passhash={entry.passhash}
                                key_info={{
                                    salt: entry.salt,
                                    iv: entry.iv,
                                    authTag: entry.authtag
                                }}
                                salt={entry.salt}
                                iv={entry.iv}
                                saltID={entry.salt_id}
                                onUpdate={(newEntry) => handleEntryChange(entry.entry_id, newEntry)}
                            />
                            <hr />
                        </React.Fragment>
                    )
                }) : 
                "There are no passwords yet. You can create some by pressing the + button at the right."
                }
            </Container>
            <Button onClick={onNew}>+</Button>
        </>
    )
}

export default EditEntries