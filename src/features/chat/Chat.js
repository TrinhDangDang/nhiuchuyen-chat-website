import React, { useEffect, useState } from "react";
import ProfilePanel from "./ProfilePanel";
import ContactPanel from "./ContactPanel";
import MessagePanel from "./MessagePanel";
import FriendProfilePanel from "./FriendProfilePanel";
import { motion, AnimatePresence } from "framer-motion";

const Chat = () => {
  const [showFriendProfile, setShowFriendProfile] = useState(false);
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);

  // Auto-close mobile panels when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowContactPanel(false);
        setShowProfilePanel(false);
        setShowFriendProfile(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-full flex bg-gradient-to-tr from-indigo-50 to-white overflow-hidden relative">
      {/* Desktop Profile Sidebar */}
      <aside className="hidden md:block w-1/5 bg-white/80 backdrop-blur-md shadow-lg border-r">
        <ProfilePanel />
      </aside>

      {/* Desktop Contact Sidebar */}
      <aside className="hidden md:block w-1/5 bg-white/80 backdrop-blur-md shadow-lg border-r">
        <ContactPanel />
      </aside>

      {/* Main Message Panel */}
      <main
        className={`h-full transition-all duration-300 ease-in-out ${
          showFriendProfile ? "w-2/3 md:w-2/5" : "w-full md:w-4/5"
        } bg-white/90 backdrop-blur-md shadow-xl`}
      >
        <MessagePanel
          showFriendProfile={showFriendProfile}
          setShowFriendProfile={setShowFriendProfile}
          setShowContactPanel={setShowContactPanel}
          setShowProfilePanel={setShowProfilePanel}
        />
      </main>

      {/* Desktop Friend Info */}
      {showFriendProfile && (
        <aside className="hidden md:block w-1/5 bg-white/80 backdrop-blur-md shadow-lg border-l">
          <FriendProfilePanel />
        </aside>
      )}

      {/* Mobile Contact Panel Overlay */}
      <AnimatePresence>
        {showContactPanel && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-y-0 left-0 z-40 w-4/5 max-w-xs bg-white/90 backdrop-blur-md shadow-lg border-r"
          >
            <ContactPanel />
            <button
              onClick={() => setShowContactPanel(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-sm"
            >
              ✕
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Profile Panel Overlay */}
      <AnimatePresence>
        {showProfilePanel && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-y-0 left-0 z-40 w-4/5 max-w-xs bg-white/90 backdrop-blur-md shadow-lg border-r"
          >
            <ProfilePanel />
            <button
              onClick={() => setShowProfilePanel(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-sm"
            >
              ✕
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Friend Profile Panel Overlay */}
      <AnimatePresence>
        {showFriendProfile && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-y-0 right-0 z-40 w-4/5 max-w-xs bg-white/90 backdrop-blur-md shadow-lg border-l"
          >
            <FriendProfilePanel />
            <button
              onClick={() => setShowFriendProfile(false)}
              className="absolute top-2 left-2 text-gray-600 hover:text-black text-sm"
            >
              ✕
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
