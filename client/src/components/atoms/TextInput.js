import React from "react"
import styled from "styled-components"

import { THEME } from "../../constants"

const Wrapper = styled.input`
    min-width: 30ch;
    margin: 10px;
    padding: 12px 24px;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0,0);
    outline: solid 1px #777;
    background-color: rgba(0,0,0,0);
    color: white;
    font-size: 0.7em;

    &::placeholder {
        font-size: 0.8em;
    }

    &:focus {
        outline: solid 1px ${THEME.PRIMARY};
    }

    &:invalid:required {
        outline: solid 1px red;
    }
`

const TextInput = (props, ref) => {
    return <Wrapper autoComplete="off" ref={ref} {...props}>{props.children}</Wrapper>
}

export default React.forwardRef(TextInput)