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
    <div className="h-full p-4 flex flex-col items-center bg-white">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
        <img
          src={profilePic}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Friend Name */}
      <h2 className="text-xl font-semibold mb-1 text-center">{name}</h2>
      <p className="text-sm text-gray-500 mb-6">Last seen: recently</p>

      {/* Info and Actions */}
      <div className="w-full text-left">
        <p className="text-sm text-gray-700 mb-4">
          Status: {friend?.status || "Available"}
        </p>
        <button className="text-blue-600 hover:underline mb-2 block">
          View Media
        </button>
        <button className="text-red-600 hover:underline block">Block</button>
      </div>
    </div>
  );
};

export default FriendProfilePanel;
