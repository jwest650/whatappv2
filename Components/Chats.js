import { Avatar } from "@mui/material";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";

const Chats = ({ id, users }) => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const enterChat = () => {
        router.push(`/chat/${id}`);
    };

    const q = query(
        collection(db, "users"),
        where("users", "==", getRecipientEmail(users, user))
    );
    const [recipientSnapshot] = useCollection(q);
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user);
    return (
        <Container onClick={enterChat}>
            {recipient ? (
                <UserAvatar src={recipient?.photoURL} />
            ) : (
                <UserAvatar>{recipientEmail[0]}</UserAvatar>
            )}
            <p>{recipientEmail}</p>
        </Container>
    );
};

export default Chats;
const Container = styled.div`
    display: flex;
    align-items: center;
    word-break: normal;
    cursor: pointer;
    :hover {
        background-color: #e8eaea;
    }
`;
const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;
