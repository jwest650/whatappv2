import { Button } from "@mui/material";
import Head from "next/head";
import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { Container, LoginContainer, Logo } from "../styles/logincss";
import Image from "next/image";
import logo from "../assets/icon-1844471_1920.png";
const Login = () => {
    const signIn = async () => {
        try {
            let result = await signInWithPopup(auth, provider);
            console.log(result);
        } catch (error) {
            alert(error);
        }
    };
    return (
        <Container>
            <Head>Login</Head>

            <LoginContainer>
                <Image src={logo} alt="logo" width={200} height={200} />
                <Button variant="outlined" onClick={signIn}>
                    Sign in with google
                </Button>
            </LoginContainer>
        </Container>
    );
};

export default Login;
