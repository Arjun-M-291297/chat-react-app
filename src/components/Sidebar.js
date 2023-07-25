import { useContext, useEffect, useState } from "react";
import { Input, Spinner, Button } from "@chakra-ui/react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { collection, query, where, getDocs, setDoc, updateDoc, serverTimestamp, getDoc, doc, onSnapshot } from "firebase/firestore";
const Sidebar = ({ onChatClick }) => {
  const { currentUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [searchOn, setSearchOn] = useState(false);
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [chats, setChats] = useState([]);
  const { dispatch } = useContext(ChatContext);
  const { data } = useContext(ChatContext);
  const [loading, setLoading] = useState(true);
  const handleSearch = async (username) => {
    try {
      const q = query(collection(db, "users"), where("displayName", "==", username));
      const querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        setUser(doc.data());
        dispatch({ type: "CHANGE_USER", payload: doc.data() });
        setSearchOn(false)
      });
    } catch (err) {
      setErr(true);
    }
    setLoading(false);
  };
  const handleKey = () => {
      setLoading(true)
      setSearchOn(true)
      handleSearch(username);
  };
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(Object.entries(doc.data()));
        setLoading(false);
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);
  const chatsFiltered = () => {
    let chatsTemp = [];
    chats.forEach((chat) => {
      let obj = chat[1].userInfo;
      obj["lastMessage"] = chat[1]?.lastMessage?.text;
      obj["date"] = chat[1].date;
      chatsTemp.push(obj);
    });
    chatsTemp = chatsTemp.sort((a, b) => b.date - a.date);
    return chatsTemp;
  };
  const handleUserClick = async (name) => {
    await handleSearch(name);
    await handleSelect();
    onChatClick(true);
  };
  const handleSelect = async () => {
    const combinedID = currentUser.uid > data.user.uid ? currentUser.uid + data.user.uid : data.user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedID));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedID), { messages: [] });
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedID + ".userInfo"]: {
            uid: data.user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", data.user.uid), {
          [combinedID + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}
    setUsername("");
  };
  useEffect(() => {
    if (username === '') {
      setSearchOn(false)
    }
  }, [username]);
  const handleUserNameChange =(e) =>{
    setSearchOn(true)
    setUsername(e.target.value)
  }
  return (
    <div className="sidebar-container">
      <div className="sidebar-nav">
        <div className="nav-left">
          <span className="fc-yellow">Chat</span>App.
        </div>
        <div className="nav-right">
          <div className="profile-img">
            <img src={currentUser.photoURL}></img>
          </div>
          <div className="profile-name">{currentUser.displayName}</div>
          <button onClick={() => signOut(auth)}>Logout</button>
        </div>
      </div>
      <div className="sidebar-search">
        <div className="search-user">
          <Input
            type="text"
            placeholder="Find a user"
            _placeholder={{ opacity: 0.4, color: "white" }}
            value={username}
            onChange={handleUserNameChange}
          ></Input>
          <Button onClick={handleKey}>Search</Button>
        </div>
        <div className="user-list">
          {err && <span>Something went wrong</span>}
          {searchOn}
          {username != "" && !searchOn && (
            <div className="user">
              <div className="user-image">
                <img src={user.photoURL}></img>
              </div>
              <div className="user-content" onClick={handleSelect}>
                <div className="user-name">{user.displayName}</div>
                <div className="user-msg">{user.lastMessage}</div>
              </div>
            </div>
          )}
          {!loading &&
            username == "" &&
            chatsFiltered().map((item) => (
              <div className="user">
                <div className="user-image">
                  <img src={item.photoURL}></img>
                </div>
                <div className="user-content" onClick={() => handleUserClick(item.displayName)}>
                  <div className="user-name">{item.displayName}</div>
                  <div className="user-msg">{item.lastMessage}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="container-spinner">{loading && <Spinner size="xl" color="yellow.500" />}</div>
    </div>
  );
};

export default Sidebar;
