import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

import FormGroup from "./atoms/FormGroup"
import TextInput from "./atoms/TextInput"
import PrimaryButton from "./atoms/PrimaryButton"
import Label from "./atoms/Label"

const Modal = styled.div`
    box-sizing: border-box;
    margin: 36px 12px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const PasswordModal = ({ onSubmit }) => {
    const [password, setPassword] = useState('')
    const passRef = useRef()

    useEffect(() => {
        passRef.current.focus();
    }, [])

    const handleChange = e => {
        setPassword(e.target.value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        setPassword();
        onSubmit(password);
    }

    return (
        <Modal>
            <div style={{ 
                marginBottom: "12px",
                maxWidth: "1000px"
            }}>
                <h3>Oops! Key was droppped....</h3>
                <p style={{ fontSize: "0.85em" }}>
                    The page was refreshed and the key dropped somewhere. For your safety, we only keep a hashed copy of your key to use in login verification. The actual key used in encryption and decryption, by default, is not stored. If you trust us in saving your key, you can modify it in the settings (once implemented). But for now, in order to encrypt and decrypt passwords. can you enter your key again?
                </p>
            </div>
            <form onSubmit={handleSubmit} style={{display: "flex"}}>
                <FormGroup center>
                    <Label hidden>Password</Label>
                    <TextInput 
                        type="password" 
                        name="password" 
                        placeholder="Password"
                        value={password}
                        onChange={handleChange}
                        ref={passRef}
                    />
                    <PrimaryButton value="submit">Give Key</PrimaryButton>
                </FormGroup>
            </form>
        </Modal>
    )
}

export default PasswordModal