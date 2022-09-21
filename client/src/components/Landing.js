import { useNavigate } from "react-router-dom"

import userContext from "../util/userContext"

import PrimaryButton from "./atoms/PrimaryButton"
import SecondaryButton from "./atoms/SecondaryButton"

import { THEME } from '../constants'
import { useContext } from "react"

const Landing = () => {
    const navigate = useNavigate()
    const user = useContext(userContext)

    const handleLogin = e => {
        e.preventDefault();
        navigate("/login")
    }

    const handleSignUp = e => {
        e.preventDefault()
        navigate("/signup")
    }

    const handleLogout = e => {
        e.preventDefault()
        user.deleteUser()
    }

    return (
        <div style={{ paddingTop: "170px" }}>
            <div style={{ margin: "16px" }}>
                <h1 style={{ margin: "8px", fontSize: "3em" }}>mnemosync</h1>
                <subtitle>Download <span style={{ color: THEME.PRIMARY }}>passwords</span> into your brain.</subtitle>
            </div>
            <div class={{ display: "flex" }}>
                {
                    !user.userID ? 
                    <>
                        <PrimaryButton onClick={handleLogin}>Login</PrimaryButton>
                        <SecondaryButton onClick={handleSignUp}>Signup</SecondaryButton>
                    </> :
                    <>
                        <PrimaryButton onClick={() => navigate("/home")}>Go to Dashboard</PrimaryButton>
                        <SecondaryButton onClick={handleLogout}>Logout</SecondaryButton>
                    </>
                }
            </div>
        </div>
    )
}

export default Landing