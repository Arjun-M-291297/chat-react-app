import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chats from "../components/Chats";
const Home = () => {
  const [loading,setLoading]=useState(false)
  const handleChatClick=(status)=>{
    if(status){
      setLoading(true)
    }
  }
  return (
      <div className="container">
        <Sidebar onChatClick={handleChatClick}/>
        <Chats load={loading}/>
    </div>
  );
};

export default Home;
