import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { IconContext } from 'react-icons'
import { 
    IoHomeSharp, 
    IoAppsSharp, 
    IoKeySharp,
    IoExitSharp,
    IoLogInSharp
} from 'react-icons/io5'
import { FaUserPlus } from 'react-icons/fa'

import userContext from '../../util/userContext'
import authContext from '../../util/authContext'

import './large.css'
import { THEME } from '../../constants'

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
    transition: color 0.3s;

    &:hover {
        cursor: pointer;
        color: ${THEME.PRIMARY};
    }

    &:active {
        color: white;
        background-color: ${THEME.PRIMARY_DARKER};
    }
`

const LargeNavBar = ({ logged }) => {
    const navigate = useNavigate()
    const user = useContext(userContext)
    const auth = useContext(authContext)

    const handleLogout = e => {
        e.preventDefault()
        auth.deleteToken()
        user.deleteUser()
        navigate('/')
    }

    return (
        <nav className="large-container">
            <div className="upper-nav">
                <div className="logo" onClick={()=>navigate("/")}>mnemosync</div>
                <div className="utils">
                    {logged ? 
                        <NavButton onClick={handleLogout}>
                            Logout <IoExitSharp />
                        </NavButton> : 
                        <>
                            <NavButton onClick={()=>navigate("/login")}>
                                Login <IoLogInSharp />
                            </NavButton>
                            <NavButton onClick={()=>navigate("/signup")}>
                                Sign-Up  <FaUserPlus />
                            </NavButton>
                        </>}
                </div>
            </div>
            {
                logged && 
                <div className="lower-nav">
                    <ul>
                        <li><NavButton onClick={()=>navigate("/home/")}>
                            <IoHomeSharp /> Dashboard 
                        </NavButton></li>
                        <li><NavButton onClick={()=>navigate("/home/practice")}>
                            <IoKeySharp /> Practice
                        </NavButton></li>
                        <li><NavButton onClick={()=>navigate("/home/entries")}>
                            <IoAppsSharp /> Entries
                        </NavButton></li>
                    </ul>
                </div>
            }
        </nav>
    )
}

export default LargeNavBar