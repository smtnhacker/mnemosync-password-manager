import axios from 'axios'
import { useState, useEffect } from 'react'

const Stats = props => {
    const [entryCount, setEntryCount] = useState()

    useEffect(() => {
        axios.get("http://localhost:8000/api/entry/count_due", { withCredentials: true})
            .then(res => setEntryCount(res.data))
    })

    return (
        <div>
            Welcome! You have {entryCount} password/s to practice today.
        </div>
    )
}

export default Stats