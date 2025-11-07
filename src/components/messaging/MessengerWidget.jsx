import MessengerButton from "./MessengerButton";
import MessengerPopup from "./MessengerPopup";
import ChatWindow from "./ChatWindow";
import { useMessenger } from "../../contexts/MessengerContext";

export default function MessengerWidget() {
  const { openChats } = useMessenger();

  return (
    <>
      <MessengerButton />
      <MessengerPopup />
      
      {/* Render open chat windows */}
      {openChats.map((chat, index) => (
        <ChatWindow
          key={chat.userId}
          userId={chat.userId}
          userName={chat.userName}
          userAvatar={chat.userAvatar}
          index={index}
        />
      ))}
    </>
  );
}
