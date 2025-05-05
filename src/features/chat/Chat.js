import React from "react";
import ProfilePanel from "./ProfilePanel";
import ContactPanel from "./ContactPanel";
import MessagePanel from "./MessagePanel";
import { useState } from "react";
import FriendProfilePanel from "./FriendProfilePanel";

const Chat = () => {
  const [showFriendProfile, setShowFriendProfile] = useState(true);
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
      <div
        className={`h-full border-r border-gray-300 bg-white ${
          showFriendProfile ? "w-2/3 md:w-2/5" : "w-full md:w-4/5"
        }`}
      >
        <MessagePanel
          showFriendProfile={showFriendProfile}
          setShowFriendProfile={setShowFriendProfile}
        />
      </div>

      {/* Friend Profile */}
      {showFriendProfile && (
        <div className="hidden md:block w-1/5 bg-white border-l border-gray-300">
          <FriendProfilePanel />
        </div>
      )}
    </div>
  );
};

export default Chat;
