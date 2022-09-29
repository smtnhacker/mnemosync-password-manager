import styled from "styled-components"

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.7em;
`

const Loading = props => {
    const status = props.status || "loading..."
    
    return (
        <Wrapper>
            <img alt="Loading" src="/loading.gif" width={50} />
            {status}
        </Wrapper>
    )
}

export default Loading