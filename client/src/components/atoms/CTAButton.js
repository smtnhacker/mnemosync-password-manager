import styled from "styled-components"

import { THEME } from "../../constants"

const Wrapper = styled.button`
    position: fixed;
    width: 60px;
    height: 60px;
    right: 32px;
    bottom: 68px;
    border: none;
    color: white;
    border-radius: 30px;
    background-color: ${THEME.PRIMARY};

    &:hover, &:active {
        border-color: #01BAEF;
    }
`


const CTAButton = props => {

    return (
        <Wrapper {...props}>
            {props.children}
        </Wrapper>        
    )
}

export default CTAButton