import React from "react"
import styled from "styled-components"

import EditableEntry from "../EditableEntry/EditableEntry"

const Container = styled.div`
    text-align: left;
    background-color: rgba(0,0,0,0.1);
    padding: 10px 100px;
    width: 70%;
    min-height: 300px;
    max-height: 500px;
    overflow-y: overlay;
`

const LargeEntriesView = ({ entries, onDelete, onChange }) => {
   return (
        <Container>
                {
                entries.length > 0?
                entries.map(entry => {
                    return (
                        <React.Fragment key={entry.entry_id}>
                            <EditableEntry
                                onDelete={onDelete}
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
                                onUpdate={(newEntry) => onChange(entry.entry_id, newEntry)}
                            />
                            <hr />
                        </React.Fragment>
                    )
                }) : 
                "There are no passwords yet. You can create some by pressing the + button at the right."
                }
            </Container>
   ) 
}

export default LargeEntriesView