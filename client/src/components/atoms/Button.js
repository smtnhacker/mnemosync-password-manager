import styled from 'styled-components'

const ButtonStyled = styled.button`
    box-sizing: border-box;
    width: 300px;
    padding: 8px;
    margin: 4px;
    text-align: center;
    background-color: rgba(0,0,0,0);
    color: white;
    border-radius: 5px;
    border-color: white;
    font-size: clamp(1rem, 16px, 2rem);
    
    &:hover {
        border-color: #01BAEF;
        color: #01BAEF;
        cursor: pointer;
    }
    
    &:active {
        color: #007c9f;
        cursor: pointer;
    }`;

function Button({ children, onClick }) {
    return (
        <ButtonStyled onClick={onClick} >
                {children}
        </ButtonStyled>
    )
}

export default Button