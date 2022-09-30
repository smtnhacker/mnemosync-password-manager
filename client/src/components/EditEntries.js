import axios from 'axios'
import styled from "styled-components"
import React, { useState, useEffect } from 'react'
import MediaQuery from 'react-responsive'
import { IoAddSharp } from 'react-icons/io5'

import API_ENDPOINT from '../config'

import { THEME } from '../constants'
import LargeEntriesView from './EntriesView/LargeEntriesView'
import SmallEntriesView from './EntriesView/SmallEntriesView'
import CTAButton from './atoms/CTAButton'

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
    }, []);

    useEffect(() => console.log('Got entries:', entries), [entries])

    const handleDelete = entry_id => {
        console.log("should delete", entry_id)
        setEntries(prev => prev.filter(entry => entry.entry_id !== entry_id))
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

    const entriesViewProps = {
        entries: entries,
        onDelete: handleDelete,
        onChange: handleEntryChange
    }

    return (
        <>
            <MediaQuery minWidth={650}>
                <LargeEntriesView {...entriesViewProps} />
                <Button onClick={onNew}>+</Button>
            </MediaQuery>
            <MediaQuery maxWidth={649}>
                <SmallEntriesView {...entriesViewProps} />
                <CTAButton onClick={onNew}>
                    <IoAddSharp size="2.5em" />
                </CTAButton>
            </MediaQuery>
        </>
    )
}

export default EditEntries