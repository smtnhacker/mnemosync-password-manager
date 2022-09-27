import styled from 'styled-components'

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 32px 64px;
    margin: 20px;
    min-height: 500px;
    max-width: 500px;
    justify-content: center;
    border-radius: 10px;
    background: rgb(20,28,36);
    background: linear-gradient(21deg, rgba(20,28,36,1) 0%, rgba(10,21,42,1) 100%);

    & h3 {
        padding-bottom: 16px;
        border-bottom: 1px solid white;
    }
`

const Card = (props) => {
    return (
        <CardContainer>
            {props.children}
        </CardContainer>
    )
}

export default Card