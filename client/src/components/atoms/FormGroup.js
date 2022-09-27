import styled from "styled-components"

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 8px;

    ${props => props.center ? "align-items: center" : ""}
`

const FormGroup = props => {
    return <Wrapper {...props}>{props.children}</Wrapper>
}

export default FormGroup