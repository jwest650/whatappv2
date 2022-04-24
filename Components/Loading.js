import React from "react";
import styled from "styled-components";
import { BarLoader } from "react-spinners";
import Image from "next/image";
import logo from "../assets/icon-1844471_1920.png";
const Loading = () => {
    return (
        <Center>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Image src={logo} alt={"logo"} height={200} width={200} />
                <BarLoader height={2} />
            </div>
        </Center>
    );
};

export default Loading;
const Center = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    width: 100%;
`;
