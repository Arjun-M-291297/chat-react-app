import React, { useContext, useEffect, useState } from "react";
import { Button, Input, Spinner } from "@chakra-ui/react";
import { db } from "../firebase";
import { onSnapshot, doc, updateDoc, arrayUnion, Timestamp, serverTimestamp } from "firebase/firestore";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const Chats = ({ load }) => {
  const [text, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const [chatLoading, setchatLoading] = useState(true);

  const sendMsgHandler = async () => {
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuidv4(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setMessage("");
  };
  useEffect(() => {
    if (load) setchatLoading(load);
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
      setchatLoading(false);
    });
    return () => {
      unsub();
    };
  }, [data.chatId]);
  return (
    <div className="chat-container">
      <div className="chat-nav">
        <div className="chat-user-name">{data.user.displayName}</div>
      </div>
      <div className="chat-screen">
        {!chatLoading && (
          <div className="chats">
            {messages.length > 0 &&
              messages.map((m) => (
                <div className={m.senderId === currentUser.uid ? "outgoing" : "incoming"}>
                  <img src={m.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}></img>
                  <span className="msg">{m?.text}</span>
                </div>
              ))}
            {messages.length==0 && <div className="empty-chat">No Chats to show</div>}
          </div>
        )}
        <div className="send-msg">
          <div className="type-msg">
            <Input placeholder="Type your text" onChange={(e) => setMessage(e.target.value)} value={text}></Input>
          </div>
          <div className="chat-button">
            <Button onClick={sendMsgHandler}>Send</Button>
          </div>
        </div>
        {chatLoading && (
          <div className="chat-spinner">
            <Spinner size="xl" color="yellow.500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
