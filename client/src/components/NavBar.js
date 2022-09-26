import styled from 'styled-components'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'

import userContext from '../util/userContext'
import './styles/NavBar.css'
import { THEME } from '../constants'

const NavButton = styled.button`
    box-sizing: border-box;
    height: 30px;
    background-color: rgba(0,0,0,0);
    color: white;
    font-size: 16px;
    padding: 4px 50px;
    margin: 0px 10px;
    border: none;
    border-radius: 5px;

    &:hover {
        cursor: pointer;
        font-size: 17px;
        color: ${THEME.PRIMARY};
    }

    &:active {
        color: white;
        background-color: ${THEME.PRIMARY_DARKER};
    }
`

const NavBar = ({ logged }) => {
    const navigate = useNavigate()
    const user = useContext(userContext)

    const handleLogout = e => {
        e.preventDefault()
        delete axios.defaults.headers.common['XSRF-TOKEN'];
        user.deleteUser()
        navigate('/')
    }

    return (
        <div className="container">
            <div className="upper-nav">
                <div className="logo" onClick={()=>navigate("/")}>mnemosync</div>
                <div className="utils">
                    {logged ? 
                        <NavButton onClick={handleLogout}>Logout</NavButton> : 
                        <>
                            <NavButton onClick={()=>navigate("/login")}>Login</NavButton>
                            <NavButton onClick={()=>navigate("/signup")}>Signup</NavButton>
                        </>}
                </div>
            </div>
            {
                logged && 
                <div className="lower-nav">
                    <ul>
                        <li><NavButton onClick={()=>navigate("/home/")}>Dashboard</NavButton></li>
                        <li><NavButton onClick={()=>navigate("/home/practice")}>Practice</NavButton></li>
                        <li><NavButton onClick={()=>navigate("/home/entries")}>Entries</NavButton></li>
                    </ul>
                </div>
            }
        </div>
    )
}

export default NavBar