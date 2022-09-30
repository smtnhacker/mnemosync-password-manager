import axios from 'axios'
import { useState, useEffect } from 'react'

import API_ENDPOINT from '../config'
import { THEME } from '../constants'

const Stats = props => {
    const [entryCount, setEntryCount] = useState()

    useEffect(() => {
        axios.get(`${API_ENDPOINT}/api/entry/count_due`, { withCredentials: true})
            .then(res => setEntryCount(res.data))
    })

    return (
        <div>
            <h1>Welcome!</h1>You have <span style={{ color: THEME.PRIMARY }}>{entryCount}</span> password{parseInt(entryCount) > 1 && 's'} to practice today.
        </div>
    )
}

export default Stats