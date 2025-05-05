import React from "react";

const ProfilePanel = () => {
  return (
    <div className="h-full p-4 flex flex-col items-center bg-white">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 overflow-hidden">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Username */}
      <h2 className="text-xl font-semibold mb-2">John Doe</h2>
      <p className="text-sm text-gray-500 mb-6">Online</p>

      {/* Settings or Links */}
      <div className="w-full">
        <button className="w-full text-left text-blue-600 hover:underline mb-2">
          Edit Profile
        </button>
        <button className="w-full text-left text-blue-600 hover:underline mb-2">
          Settings
        </button>
        <button className="w-full text-left text-red-600 hover:underline">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePanel;
