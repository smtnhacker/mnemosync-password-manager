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

import userContext from '../../util/userContext'
import authContext from '../../util/authContext'

import './small.css'
import { THEME } from '../../constants'

const NavButton = styled.button`
    box-sizing: border-box;
    height: 30px;
    background-color: rgba(0,0,0,0);
    color: white;
    font-size: 16px;
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

const SmallNavBar = ({ logged }) => {
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
        <nav className="small-container">
            <div className="top-nav">
                <div className="logo" onClick={()=>navigate("/")}>mnemosync</div>
                { logged ? 
                    <IconContext.Provider value={{ style: { fontSize: "1.3em" }}}>
                        <NavButton onClick={handleLogout}><IoExitSharp /></NavButton> 
                    </IconContext.Provider> :
                <>
                    <IconContext.Provider value={{ style: { fontSize: "1.3em" }}}>
                        <NavButton onClick={()=>navigate("/login")}><IoLogInSharp /></NavButton>
                    </IconContext.Provider>
                </>
                }
            </div>
            <div className="bottom-nav">
                <ul>
                    <li>
                        <NavButton onClick={()=>navigate("/home/")}>
                            <IoHomeSharp />
                        </NavButton>
                    </li>
                    <li>
                        <NavButton onClick={()=>navigate("/home/practice")}>
                            <IconContext.Provider value={{ style: { fontSize: "2em" }}}>
                                <div><IoKeySharp /></div>
                            </IconContext.Provider>
                        </NavButton>
                    </li>
                    <li>
                        <NavButton onClick={()=>navigate("/home/entries")}>
                            <IoAppsSharp />
                        </NavButton>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default SmallNavBar