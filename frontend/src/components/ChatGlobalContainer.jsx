import { useEffect, useRef } from "react";
import { useGlobalChatStore } from "../store/useGlobalChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatGlobalHeader from "./ChatGlobalHeader";
import GlobalMessageInput from "./GlobalMessageInput";
import GlobalMessageSkeleton from "./skeletons/GlobalMessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatGlobalContainer = () => {
  const {
    globalMessages,
    getGlobalMessages,
    isGlobalMessagesLoading,
    subscribeToGlobalMessages,
    unsubscribeFromGlobalMessages,
  } = useGlobalChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getGlobalMessages();
    subscribeToGlobalMessages();

    return () => unsubscribeFromGlobalMessages();
  }, [getGlobalMessages, subscribeToGlobalMessages, unsubscribeFromGlobalMessages]);

  useEffect(() => {
    if (messageEndRef.current && globalMessages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [globalMessages]);

  if (isGlobalMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatGlobalHeader />
        <GlobalMessageSkeleton />
        <GlobalMessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatGlobalHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {globalMessages.map((message) => {
  const isOwnMessage = message.senderId._id === authUser._id;
  const senderName = isOwnMessage ? "Vous" : message.senderId.fullName || "Utilisateur";
  const senderPic = isOwnMessage
    ? authUser.profilePic || "/avatar.png"
    : message.senderId.profilePic || "/avatar.png";

  return (
    <div
      key={message._id}
      className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
      ref={messageEndRef}
    >
      <div className="chat-image avatar">
        <div className="size-10 rounded-full border">
          <img src={senderPic} alt="profile pic" />
        </div>
      </div>

      {/* ✅ Affichage du nom + heure */}
      <div className="chat-header mb-1 font-semibold text-sm">
        {senderName}
        <time className="text-xs opacity-50 ml-2">
          {formatMessageTime(message.createdAt)}
        </time>
      </div>

      <div className="chat-bubble flex flex-col">
        {message.image && (
          <img
            src={message.image}
            alt="Attachment"
            className="sm:max-w-[200px] rounded-md mb-2"
          />
        )}
        {message.text && <p>{message.text}</p>}
      </div>
    </div>
  );
})}

      </div>

      <GlobalMessageInput />
    </div>
  );
};

export default ChatGlobalContainer;
