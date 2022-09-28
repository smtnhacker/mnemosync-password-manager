import axios from "axios";
import { useState } from "react";

import API_ENDPOINT from '../config'

const useUser = () => {
    const [userID, setUserID] = useState();
    
    const getUser = async () => {
        const res = await axios.get(`${API_ENDPOINT}/api/users`, { withCredentials: true });
        if(res.data !== 'No User') {
            setUserID(res.data);
        } else {
            console.log('no user found')
            setUserID()
        }
    }

    const deleteUser = () => {
        axios.get(`${API_ENDPOINT}/api/logout`, { withCredentials: true })
            .then(() => setUserID())
    }

    return [userID, getUser, deleteUser]
}

export default useUser