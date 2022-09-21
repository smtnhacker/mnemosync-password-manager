import axios from "axios";
import { useNavigate } from "react-router-dom";

import { encrypt } from "../util/security"

import TextInput from "./atoms/TextInput";
import PrimaryButton from "./atoms/PrimaryButton";
import SecondaryButton from "./atoms/SecondaryButton";

function AddEntries() {
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sitename = e.target.sitename.value;
        const username = e.target.username.value;
        const plainPassword = e.target.password.value;
        const password = encrypt(plainPassword);
        
        // validate input
        
        try {
            const res = await axios.post('http://localhost:8000/api/entry/new', {
                sitename: sitename,
                username: username,
                password: password
            }, { withCredentials: true });

            if (res.statusText === 'OK') {
                const newEntry = await res.data
                alert(`Created entry ${JSON.stringify(newEntry)}`)
            }
        } catch(error) {
            alert('Something went wrong. Entry not made :(')
            console.log(error);
        }

        e.target.reset();
    }

    const handleCancel = e => {
        e.preventDefault()
        navigate('../entries')
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h3>Add Entry</h3>
                <div className="form-entry">
                    <label hidden>Site Name: </label>
                    <TextInput type="text" id="sitename" name="sitename" placeholder="Site" />
                </div>
                <div className="form-entry">
                    <label hidden>Username: </label>
                    <TextInput type="text" id="username" name="username" placeholder="Username" />
                </div>
                <div className="form-entry">
                    <label hidden>Password: </label>
                    <TextInput type="password" id="password" name="password" placeholder="Password" />
                </div>
                <PrimaryButton type="submit">Create</PrimaryButton>
                <SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
            </form>
        </div>
    )
}

export default AddEntries