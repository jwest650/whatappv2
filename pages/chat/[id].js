import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
} from "firebase/firestore";
import Head from "next/head";
import React from "react";
import styled from "styled-components";
import ChatScreen from "../../Components/ChatScreen";
import Sidebar from "../../Components/Sidebar";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
const Chat = ({ chat, messages }) => {
    const [user] = useAuthState(auth);
    console.log(messages, chat);

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    );
};

export default Chat;
export async function getServerSideProps(context) {
    const ref = doc(db, "chats", context.query.id);
    const chatRef = await getDoc(ref);

    const messageRef = await getDocs(
        query(collection(ref, "messages"), orderBy("timestamp", "asc"))
    );

    const messages = messageRef.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        .map((message) => ({
            ...message,
            timestamp: message.timestamp.toDate().getTime(),
        }));

    const chat = {
        id: chatRef.id,
        ...chatRef.data(),
    };
    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat,
        }, // will be passed to the page component as props
    };
}

const Container = styled.div`
    display: flex;
`;
const ChatContainer = styled.div`
    flex: 1;
    height: 100vh;
    overflow: scroll;
    scrollbar-width: none;
`;
