import styled from "styled-components"

import { THEME } from "../../constants"

const Wrapper = styled.input`
    min-width: 40ch;
    margin: 10px;
    padding: 5px;
    border-radius: 10px;
    outline: solid 1px white;
    background-color: rgba(0,0,0,0);
    color: white;
    font-size: 0.75em;

    &:focus {
        outline: solid 1px ${THEME.PRIMARY};
    }

    &:invalid:required {
        outline: solid 1px red;
    }
`

const TextInput = props => {
    return <Wrapper autoComplete="off" {...props}>{props.children}</Wrapper>
}

export default TextInput