import React, { useState, useEffect } from "react";
import Conversations from "./Conversations";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOnlineUsers,
  setSelectedFriend,
  setOnlineUsers,
} from "../../app/chatSlice";
import SearchInput from "./SearchInput";
import { useSocket } from "./SocketContext";
import { FaUserFriends } from "react-icons/fa";

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

    const handleOnlineUsers = (data) => {
      dispatch(setOnlineUsers(data));
    };

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
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
    content = <p className="text-gray-500 mt-4">Loading users...</p>;
  } else if (isError) {
    content = (
      <p className="text-red-500 mt-4">
        {error?.data?.message || "Error loading users."}
      </p>
    );
  } else if (searchQuery && isSuccess) {
    content = filteredUsers.length ? (
      <ul className="space-y-3 mt-4">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            onClick={() => {
              dispatch(setSelectedFriend(user.id));
              setSearchQuery("");
            }}
            className="flex items-center gap-4 p-3 bg-white/70 hover:bg-white/90 rounded-lg shadow cursor-pointer transition-all"
          >
            <div className="relative">
              <img
                src={
                  user.profilePic ||
                  "https://api.dicebear.com/9.x/thumbs/svg?seed=Emery"
                }
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              {onlineUsers.includes(user.id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-ping"></span>
              )}
            </div>
            <div className="flex-1 truncate">
              <p className="font-medium text-gray-800 truncate">
                {user.fullname || user.username}
              </p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-500 mt-4">No users found.</p>
    );
  }

  return (
    <div className="w-full h-full bg-white/60 backdrop-blur-sm border-r border-gray-200 p-4 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaUserFriends className="text-indigo-500" />
          Conversations
        </h2>
      </div>

      {/* Search */}
      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Content */}
      {searchQuery ? content : <Conversations />}
    </div>
  );
};

export default ContactPanel;
