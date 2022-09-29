import styled from "styled-components";

const Wrapper = styled.footer`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 48px;
    bottom: 0;
    font-size: 12px;
`

const Footer = () => {
    return (
        <Wrapper>
            Copyright © 2022 Ron Mikhael Surara. All Rights Reserved
        </Wrapper>
    )
}

export default Footer;