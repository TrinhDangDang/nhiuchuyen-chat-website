// Chat.js
import React, { useState } from "react";
import ProfilePanel from "./ProfilePanel";
import ContactPanel from "./ContactPanel";
import MessagePanel from "./MessagePanel";
import FriendProfilePanel from "./FriendProfilePanel";

const Chat = () => {
  const [showFriendProfile, setShowFriendProfile] = useState(true);

  return (
    <div className="h-screen w-full flex bg-gradient-to-tr from-indigo-50 to-white overflow-hidden">
      {/* Profile Sidebar */}
      <aside className="hidden md:block w-1/5 bg-white shadow-inner border-r">
        <ProfilePanel />
      </aside>

      {/* Contact List */}
      <aside className="w-1/3 md:w-1/5 bg-white shadow-inner border-r">
        <ContactPanel />
      </aside>

      {/* Messages */}
      <main
        className={`h-full transition-all duration-300 ease-in-out ${
          showFriendProfile ? "w-2/3 md:w-2/5" : "w-full md:w-4/5"
        } bg-white`}
      >
        <MessagePanel
          showFriendProfile={showFriendProfile}
          setShowFriendProfile={setShowFriendProfile}
        />
      </main>

      {/* Friend Info */}
      {showFriendProfile && (
        <aside className="hidden md:block w-1/5 bg-white shadow-inner border-l">
          <FriendProfilePanel />
        </aside>
      )}
    </div>
  );
};

export default Chat;
