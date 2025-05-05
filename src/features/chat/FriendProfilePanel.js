import React from "react";
import { useSelector } from "react-redux";
import { selectSelectedFriend } from "../../app/chatSlice";
import { selectUsersData } from "../users/usersApiSlice";

const FriendProfilePanel = () => {
  const selectedFriendId = useSelector(selectSelectedFriend);
  const users = useSelector(selectUsersData);
  const friend = selectedFriendId ? users?.entities?.[selectedFriendId] : null;

  const name = friend?.fullname || friend?.username || "Unknown";
  const profilePic =
    friend?.profilePic || "https://api.dicebear.com/9.x/thumbs/svg?seed=Emery";

  return (
    <div className="h-full w-full p-6 flex flex-col items-center bg-white/60 backdrop-blur-md shadow-inner">
      {/* Avatar */}
      <div className="w-28 h-28 rounded-full bg-gray-200 mb-4 overflow-hidden shadow-md">
        <img
          src={profilePic}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Friend Name */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-1">
        {name}
      </h2>
      <p className="text-sm text-gray-500 mb-6">🕒 Last seen: recently</p>

      {/* Info and Actions */}
      <div className="w-full text-left space-y-4 text-sm">
        <p className="text-gray-700">
          <span className="font-medium">Status:</span>{" "}
          {friend?.status || "Available"}
        </p>
        <button className="w-full text-left text-blue-600 hover:underline hover:text-blue-800 transition">
          📷 View Media
        </button>
        <button className="w-full text-left text-red-600 hover:underline hover:text-red-800 transition">
          🚫 Block User
        </button>
      </div>
    </div>
  );
};

export default FriendProfilePanel;
