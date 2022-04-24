import { Avatar, Button, IconButton } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { GrMoreVertical } from "react-icons/gr";
import { RiSearchLine } from "react-icons/ri";
import * as EmailValidator from "email-validator";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import Chats from "./Chats";
const Sidebar = () => {
    const [user] = useAuthState(auth);
    const userChatRef = query(
        collection(db, "chats"),
        where("users", "array-contains", user.email)
    );
    const [chatSnapshot] = useCollection(userChatRef);
    const startChat = async () => {
        const input = prompt("enter email addresss you want to chat with");
        if (!input) return null;
        if (
            EmailValidator.validate(input) &&
            !chatAlreadyExist(input) &&
            input !== user.email
        ) {
            console.log(chatAlreadyExist(input));

            const chat = collection(db, "chats");
            await addDoc(chat, {
                users: [user.email, input],
            });
        }
    };

    const chatAlreadyExist = (recipientEmail) =>
        !!chatSnapshot?.docs.find((doc) =>
            doc.data().users.find((chat) => chat === recipientEmail)
        );

    return (
        <Container>
            <Header>
                <UserAvatar
                    src={user?.photoURL}
                    onClick={() => signOut(auth)}
                />
                <IconContainer>
                    <IconButton>
                        <BsFillChatSquareTextFill />
                    </IconButton>
                    <IconButton>
                        <GrMoreVertical />
                    </IconButton>
                </IconContainer>
            </Header>

            <Search>
                <RiSearchLine />
                <SearchInput placeholder="Search chats" />
            </Search>
            <SidebarButton onClick={startChat}>Start a new chat</SidebarButton>
            {chatSnapshot?.docs.map((chat) => (
                <Chats key={chat.id} id={chat.id} users={chat.data().users} />
            ))}
        </Container>
    );
};

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 250px;
    max-width: 300px;
    overflow-y: scroll;
    scrollbar-width: none;
`;
const SidebarButton = styled(Button)`
    width: 100%;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    color: black;
    font-weight: bold;
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    z-index: 1;
    top: 0;
    height: 80px;
    padding: 15px;
    border-bottom: 1px solid whitesmoke;
    background-color: white;
`;
const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.4;
    }
`;
const IconContainer = styled.div``;
const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;
const SearchInput = styled.input`
    outline: none;
    border: none;
    flex: 1;
`;
