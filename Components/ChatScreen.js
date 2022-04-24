import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import styled from "styled-components";
import { Avatar, IconButton } from "@mui/material";
import {
    MdAttachFile,
    MdMoreVert,
    MdOutlineInsertEmoticon,
} from "react-icons/md";
import { useCollection } from "react-firebase-hooks/firestore";
import {
    addDoc,
    collection,
    doc,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import Message from "./Message";
import { IoMdMic } from "react-icons/io";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

const ChatScreen = ({ chat, messages }) => {
    const [input, setinput] = useState("");
    const [user] = useAuthState(auth);
    const router = useRouter();
    const ref = doc(db, "chats", router.query.id);
    const [messageSnap] = useCollection(
        query(collection(ref, "messages"), orderBy("timestamp", "asc"))
    );
    const [recipientSnap] = useCollection(
        query(
            collection(db, "users"),
            where("email", "==", getRecipientEmail(chat?.users, user))
        )
    );

    const showMessages = () => {
        if (messageSnap) {
            return messageSnap.docs.map((message) => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map((message) => {
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}
                />;
            });
        }
    };
    const scrollref = useRef(null);
    const scrollToBtn = () => {
        scrollref.current.scrollIntoView({
            behaviour: "smooth",
            block: "start",
        });
    };
    const sendMessage = async (e) => {
        e.preventDefault();
        await updateDoc(
            doc(db, "users", user.uid),
            {
                lastSeen: serverTimestamp(),
            },
            { merge: true }
        );

        await addDoc(
            collection(doc(db, "chats", router.query.id), "messages"),
            {
                timestamp: serverTimestamp(),
                message: input,
                user: user.email,
                photoURL: user.photoURL,
            }
        );

        setinput("");
        scrollToBtn();
    };
    const recipientEmail = getRecipientEmail(chat.users, user);
    const recipient = recipientSnap?.doc?.[0]?.data();

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}
                <HeaderInfo>
                    <h3>{recipientEmail}</h3>
                    {recipientSnap ? (
                        <p>
                            Last Active:{" "}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo
                                    datetime={recipient?.lastSeen?.toDate()}
                                />
                            ) : (
                                "unavailable"
                            )}
                        </p>
                    ) : (
                        <p>loadng last active ..</p>
                    )}
                </HeaderInfo>
                <HeaderIcon>
                    <IconButton>
                        <MdAttachFile />
                    </IconButton>
                    <IconButton>
                        <MdMoreVert />
                    </IconButton>
                </HeaderIcon>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndMessage ref={scrollref}></EndMessage>
            </MessageContainer>

            <InputContainer>
                <MdOutlineInsertEmoticon />
                <Input
                    value={input}
                    onChange={(e) => setinput(e.target.value)}
                />
                <button
                    type="submit"
                    hidden
                    onClick={sendMessage}
                    disabled={!input}
                >
                    send
                </button>
                <IoMdMic />
            </InputContainer>
        </Container>
    );
};

export default ChatScreen;

const Container = styled.div``;
const InputContainer = styled.form`
    display: flex;
    align-items: center;
    background-color: white;
    padding: 10px;
    position: sticky;
    bottom: 0;
`;
const Input = styled.input`
    flex: 1;
    background-color: whitesmoke;
    position: sticky;
    bottom: 0;
    outline: 0;
    border: none;
    padding: 10px;
    margin: 0 15px;
`;
const MessageContainer = styled.div`
    min-height: 90vh;
    padding: 10px;
    background-color: #e5dfd9;
`;
const EndMessage = styled.div`
    margin-bottom: 50px;
`;

const Header = styled.div`
    position: sticky;
    top: 0;
    height: 80px;
    background-color: white;
    display: flex;
    align-items: center;
    padding: 11px;
    z-index: 100;
    border-bottom: 1px solid whitesmoke;
`;
const HeaderInfo = styled.div`
    margin-left: 15px;
    flex: 1;
    line-height: 10px;
    > h3 {
        margin-bottom: 3px;
    }
    > p {
        font-size: 14px;
        color: gray;
    }
`;
const HeaderIcon = styled.div``;
