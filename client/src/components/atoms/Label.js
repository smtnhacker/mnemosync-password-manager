import styled from "styled-components"

const Wrapper = styled.label`
    font-size: 0.7em;
`

const Label = props => {
    return <Wrapper {...props}>{props.children}</Wrapper>
}

export default Label