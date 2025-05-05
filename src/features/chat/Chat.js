import React from "react";
import ProfilePanel from "./ProfilePanel";
import ContactPanel from "./ContactPanel";
import MessagePanel from "./MessagePanel";
import FriendProfilePanel from "./FriendProfilePanel";

const Chat = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Left - Profile */}
      <div className="hidden md:block w-1/5 h-full border-r border-gray-300 bg-white">
        <ProfilePanel />
      </div>

      {/* Conversations */}
      <div className="w-1/3 md:w-1/5 h-full border-r border-gray-300 bg-white">
        <ContactPanel />
      </div>

      {/* Message Panel */}
      <div className="w-2/3 md:w-2/5 h-full border-r border-gray-300 bg-white">
        <MessagePanel />
      </div>

      {/* Friend Profile */}
      <div className="hidden md:block w-1/5 h-full bg-white">
        <FriendProfilePanel />
      </div>
    </div>
  );
};

export default Chat;
