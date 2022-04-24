import styled from "styled-components";

const Container = styled.div`
    display: grid;
    place-items: center;
    background-color: whitesmoke;
    height: 100vh;
`;
const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.3);
`;

export { Container, LoginContainer };
