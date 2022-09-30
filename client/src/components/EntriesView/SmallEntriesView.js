import React from "react"
import styled from "styled-components"

import EditableEntry from "../EditableEntry/EditableEntry"

const Container = styled.div`
    position: relative;
    padding: 12px 12px;
    margin-top: 64px;
    width: 100%;
    max-height: calc(100vh - 128px);
    overflow-y: auto;
    z-index: 0;
`

const SmallEntriesView = ({ entries, onDelete, onChange }) => {
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

export default SmallEntriesView