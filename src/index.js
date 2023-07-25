import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
  <ChatContextProvider>
    <React.StrictMode>
      <ChakraProvider toastOptions={{ defaultOptions: { position: 'bottom' } }}>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  </ChatContextProvider>
  </AuthContextProvider>
);
