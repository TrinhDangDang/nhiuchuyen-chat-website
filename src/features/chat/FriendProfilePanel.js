import React from "react";
import { useSelector } from "react-redux";
import { selectSelectedFriend } from "../../app/chatSlice";
import { selectUsersData } from "../../app/api/usersApiSlice";
import { motion } from "framer-motion";
import { FiCamera, FiSlash } from "react-icons/fi";

const FriendProfilePanel = () => {
  const selectedFriendId = useSelector(selectSelectedFriend);
  const users = useSelector(selectUsersData);
  const friend = selectedFriendId ? users?.entities?.[selectedFriendId] : null;

  const name = friend?.fullname || friend?.username || "Unknown";
  const profilePic =
    friend?.profilePic || "https://api.dicebear.com/9.x/thumbs/svg?seed=Emery";

  return (
    <main className="min-h-full w-full bg-gradient-to-br from-white via-indigo-50 to-purple-100 p-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg w-full max-w-md p-6"
      >
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md mb-4">
            <img
              src={profilePic}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-1">
            {name}
          </h2>
          <p className="text-sm text-gray-500 mb-4">🕒 Last seen: recently</p>

          <div className="w-full space-y-4 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Status:</span>{" "}
              {friend?.status || "Available"}
            </p>
            <button className="flex items-center gap-2 text-indigo-600 hover:underline hover:text-indigo-800 transition">
              <FiCamera /> View Media
            </button>
            <button className="flex items-center gap-2 text-red-600 hover:underline hover:text-red-800 transition">
              <FiSlash /> Block User
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default FriendProfilePanel;
