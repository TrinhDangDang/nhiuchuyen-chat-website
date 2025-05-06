// Chat.js
import React, { useState } from "react";
import ProfilePanel from "./ProfilePanel";
import ContactPanel from "./ContactPanel";
import MessagePanel from "./MessagePanel";
import FriendProfilePanel from "./FriendProfilePanel";
import { motion } from "framer-motion";

const Chat = () => {
  const [showFriendProfile, setShowFriendProfile] = useState(true);

  return (
    <div className="h-screen w-full flex bg-gradient-to-tr from-indigo-50 to-white overflow-hidden">
      {/* Profile Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="hidden md:block w-1/5 bg-white/80 backdrop-blur-md shadow-lg border-r"
      >
        <ProfilePanel />
      </motion.aside>

      {/* Contact List */}
      <motion.aside
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="w-1/3 md:w-1/5 bg-white/80 backdrop-blur-md shadow-lg border-r"
      >
        <ContactPanel />
      </motion.aside>

      {/* Messages */}
      <motion.main
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={`h-full transition-all duration-300 ease-in-out ${
          showFriendProfile ? "w-2/3 md:w-2/5" : "w-full md:w-4/5"
        } bg-white/90 backdrop-blur-md shadow-xl`}
      >
        <MessagePanel
          showFriendProfile={showFriendProfile}
          setShowFriendProfile={setShowFriendProfile}
        />
      </motion.main>

      {/* Friend Info */}
      {showFriendProfile && (
        <motion.aside
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="hidden md:block w-1/5 bg-white/80 backdrop-blur-md shadow-lg border-l"
        >
          <FriendProfilePanel />
        </motion.aside>
      )}
    </div>
  );
};

export default Chat;
