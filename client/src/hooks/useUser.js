import axios from "axios";
import { useState } from "react";

const useUser = () => {
    const [userID, setUserID] = useState();
    
    const getUser = async () => {
        const res = await axios.get('http://localhost:8000/api/users', { withCredentials: true });
        if(res.data !== 'No User') {
            setUserID(res.data);
        } else {
            console.log('no user found')
            setUserID()
        }
    }

    const deleteUser = () => {
        axios.get('http://localhost:8000/logout', { withCredentials: true })
            .then(() => setUserID())
    }

    return [userID, getUser, deleteUser]
}

export default useUser