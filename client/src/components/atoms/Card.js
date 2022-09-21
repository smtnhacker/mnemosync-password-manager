import styled from 'styled-components'

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 90px 50px;
    margin: 20px;
    border-radius: 10px;
    background: rgb(20,28,36);
    background: linear-gradient(21deg, rgba(20,28,36,1) 0%, rgba(10,21,42,1) 100%);
`

const Card = (props) => {
    return (
        <CardContainer>
            {props.children}
        </CardContainer>
    )
}

export default Card