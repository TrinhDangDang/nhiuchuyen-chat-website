import React, { useState } from "react";
import Conversations from "./Conversations";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectOnlineUsers, setSelectedFriend } from "../../app/chatSlice";
import SearchInput from "./SearchInput";

const ContactPanel = () => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector(selectOnlineUsers);
  const { userId } = useAuth();

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

  const filteredUsers = users
    ? users.ids
        .map((id) => users.entities[id])
        .filter(
          (user) =>
            user.id !== userId &&
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
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
  } else if (isSuccess && searchQuery) {
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
      {/* Header with title and New Chat button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
        <button
          className="text-sm px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          onClick={() => alert("New conversation modal goes here")}
        >
          New Chat
        </button>
      </div>

      {/* Search */}
      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* User search results OR fallback to conversation list */}
      {searchQuery ? content : <Conversations />}
    </div>
  );
};

export default ContactPanel;
