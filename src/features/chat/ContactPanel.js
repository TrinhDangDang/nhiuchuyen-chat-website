import React, { useState, useEffect } from "react";
import Conversations from "./Conversations";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../../app/api/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOnlineUsers,
  setSelectedFriend,
  setOnlineUsers,
} from "../../app/chatSlice";
import SearchInput from "./SearchInput";
import { useSocket } from "./SocketContext";
import { FaUserFriends } from "react-icons/fa";
import { motion } from "framer-motion";

const ContactPanel = () => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector(selectOnlineUsers);
  const { userId } = useAuth();
  const socket = useSocket();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!socket) return;
    const handleOnlineUsers = (data) => dispatch(setOnlineUsers(data));
    socket.on("onlineUsers", handleOnlineUsers);
    return () => socket.off("onlineUsers", handleOnlineUsers);
  }, [socket, dispatch]);

  const filteredUsers = users
    ? users.ids
        .map((id) => users.entities[id])
        .filter((user) => {
          const query = searchQuery.toLowerCase();
          return (
            user.id !== userId &&
            (user.username.toLowerCase().includes(query) ||
              user.fullname?.toLowerCase().includes(query))
          );
        })
    : [];

  let content;

  if (isLoading) {
    content = (
      <p className="text-gray-500 mt-4 animate-pulse">Loading users...</p>
    );
  } else if (isError) {
    content = (
      <p className="text-red-500 mt-4">
        {error?.data?.message || "Error loading users."}
      </p>
    );
  } else if (searchQuery && isSuccess) {
    content = filteredUsers.length ? (
      <ul className="space-y-4 mt-4">
        {filteredUsers.map((user) => (
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            key={user.id}
            onClick={() => {
              dispatch(setSelectedFriend(user.id));
              setSearchQuery("");
            }}
            className="flex items-center gap-4 p-3 bg-white hover:bg-indigo-100 rounded-lg shadow cursor-pointer transition"
          >
            <div className="relative">
              <img
                src={
                  user.profilePic ||
                  "https://api.dicebear.com/9.x/thumbs/svg?seed=Emery"
                }
                alt="User"
                className="w-12 h-12 rounded-full object-cover border border-indigo-200"
              />
              {onlineUsers.includes(user.id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </div>
            <div className="flex-1 truncate">
              <p className="text-md font-medium text-gray-800 truncate">
                {user.fullname || user.username}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-500 mt-4">No users found.</p>
    );
  }

  return (
    <aside className="h-full w-full bg-gradient-to-b from-white to-indigo-50 border-r border-gray-200 overflow-y-auto p-6 flex flex-col shadow-xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center justify-between"
      >
        <h2 className="text-2xl font-extrabold text-indigo-700 flex items-center gap-2">
          <FaUserFriends className="text-indigo-500" /> People
        </h2>
      </motion.div>

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 mt-4"
      >
        {searchQuery ? content : <Conversations />}
      </motion.div>
    </aside>
  );
};

export default ContactPanel;
