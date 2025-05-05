import React from "react";

const FriendProfilePanel = () => {
  return (
    <div className="h-full p-4 flex flex-col items-center bg-white">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
        <img
          src="https://via.placeholder.com/150"
          alt="Friend"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Friend Name */}
      <h2 className="text-xl font-semibold mb-2">Friend's Name</h2>
      <p className="text-sm text-gray-500 mb-6">Last seen: recently</p>

      {/* Additional Info or Actions */}
      <div className="w-full text-left">
        <p className="text-sm text-gray-700 mb-2">Status: Available</p>
        <button className="text-blue-600 hover:underline mb-2">
          View Media
        </button>
        <button className="text-red-600 hover:underline">Block</button>
      </div>
    </div>
  );
};

export default FriendProfilePanel;
