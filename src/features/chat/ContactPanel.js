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
import { useSocket } from "./SocketContext"; // 👈 make sure you’re using your socket here

const ContactPanel = () => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector(selectOnlineUsers);
  const { userId } = useAuth();
  const socket = useSocket(); // 👈 Grab socket from context

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
    content = <p className="text-gray-500 mt-4">Loading...</p>;
  } else if (isError) {
    content = (
      <p className="text-red-500 mt-4">
        {error?.data?.message || "Error loading users."}
      </p>
    );
  } else if (searchQuery && isSuccess) {
    content = filteredUsers.length ? (
      <ul className="space-y-2 mt-4">
        {filteredUsers.map((user) => (
          <li
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            key={user.id}
            onClick={() => {
              dispatch(setSelectedFriend(user.id));
              setSearchQuery("");
            }}
          >
            <img
              className="w-10 h-10 rounded-full"
              src={
                user.profilePic ||
                "https://api.dicebear.com/9.x/thumbs/svg?seed=Emery"
              }
              alt="User Profile"
            />
            <span className="text-gray-800 font-medium truncate">
              {user.fullname || user.username}
            </span>
            {onlineUsers.includes(user.id) && (
              <span className="text-green-500 text-sm">●</span>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-500 mt-4">
        No users found matching your search.
      </p>
    );
  }

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 p-4 overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
      </div>

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {searchQuery ? content : <Conversations />}
    </div>
  );
};

export default ContactPanel;
