import moment from "moment";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../firebase";

const Message = ({ user, message }) => {
    const [userlog] = useAuthState(auth);
    const TypeOf = user === userlog.email ? Sender : Reciever;
    return (
        <Container>
            <TypeOf>
                {message.message}
                <Timestamp>
                    {message.timestamp
                        ? moment(message.timestamp).format("LT")
                        : "..."}
                </Timestamp>
            </TypeOf>
        </Container>
    );
};

export default Message;

const Container = styled.div``;
const MessageElement = styled.p`
    width: fit-content;
    padding: 10px;
    min-width: 60px;
    margin: 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
`;
const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #dcf8c6;
`;

const Reciever = styled(MessageElement)`
    background-color: whitesmoke;
    text-align: left;
`;

const Timestamp = styled.small`
    display: block;
    font-size: 12px;
    align-self: end;
    color: grey;
`;
