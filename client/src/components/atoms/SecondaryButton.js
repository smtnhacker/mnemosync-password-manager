import styled from "styled-components"

import { THEME } from "../../constants"

const ButtonStyled = styled.button`
    box-sizing: border-box;
    padding: ${props => props.padding ? props.padding : "12px"};
    margin: 12px 6px;
    width: ${props => props.width ? props.width : "200px"};
    background-color: ${THEME.SECONDARY};
    color: white;
    font-weight: bold;
    font-size: ${props => props.fontSize ? props.fontSize : "0.75em"};
    border-radius: 10px;
    border-color: rgba(0,0,0,0);

    &:hover {
        cursor: pointer;
        border-color: #01BAEF;
    }

    &:active {
        background-color: ${THEME.SECONDARY_DARKER};
    }
`

const SecondaryButton = props => {
    return (
        <ButtonStyled {...props} >
            {props.children}
        </ButtonStyled>
    )
} 

export default SecondaryButton