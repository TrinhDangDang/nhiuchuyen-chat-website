import React, { useRef, useState } from "react";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { useSendLogoutMutation } from "../auth/authApiSlice";
import { useNavigate } from "react-router-dom";

const ProfilePanel = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const {
    data: users,
    isLoading,
    isError,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [sendLogout] = useSendLogoutMutation();

  const currentUser = users?.entities?.[userId];

  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [theme, setTheme] = useState("light");
  const [password, setPassword] = useState("");

  const [previewImage, setPreviewImage] = useState(null);
  const [prompt, setPrompt] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
    setEditedName(currentUser.fullname || currentUser.username);
    setEditedStatus("Available");
  };

  const handleSave = () => {
    console.log("Saving name:", editedName);
    console.log("Saving status:", editedStatus);
    if (previewImage) console.log("New image selected");
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handlePasswordChange = () => {
    console.log("New password:", password);
    setPassword("");
  };

  const generateAvatar = async () => {
    try {
      const res = await fetch("https://api.together.xyz/api/infer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_API_KEY`, // Replace with your secure API key
        },
        body: JSON.stringify({
          prompt,
          model: "black-forest-labs/FLUX.1-schnell-Free",
          steps: 10,
          n: 1,
        }),
      });

      const data = await res.json();
      const base64 = data?.data?.[0]?.b64_json;
      if (base64) {
        setPreviewImage(`data:image/png;base64,${base64}`);
      }
    } catch (err) {
      console.error("Image generation failed", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading...
      </div>
    );
  }

  if (isError || !currentUser) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error loading profile
      </div>
    );
  }

  return (
    <div className="h-full p-4 flex flex-col bg-white overflow-y-auto">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 overflow-hidden relative">
          <img
            src={
              previewImage ||
              currentUser.profilePic ||
              "https://api.dicebear.com/9.x/thumbs/svg?seed=User"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {isEditing && (
          <div className="mb-4 w-full">
            <label className="block text-sm text-gray-700 mb-1">
              Generate Avatar with AI
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. dragon astronaut"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 border px-2 py-1 rounded"
              />
              <button
                type="button"
                onClick={generateAvatar}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Generate
              </button>
            </div>
          </div>
        )}

        {isEditing ? (
          <input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="text-xl font-semibold mb-2 text-center border rounded px-2 py-1"
          />
        ) : (
          <h2 className="text-xl font-semibold mb-2">
            {currentUser.fullname || currentUser.username}
          </h2>
        )}

        {isEditing ? (
          <input
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
            className="text-sm text-gray-500 mb-6 border rounded px-2 py-1"
          />
        ) : (
          <p className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
            Available
          </p>
        )}
      </div>

      <div className="w-full">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="w-full text-left text-green-600 hover:underline mb-2"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="w-full text-left text-blue-600 hover:underline mb-2"
          >
            Edit Profile
          </button>
        )}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full text-left text-blue-600 hover:underline mb-2"
        >
          {showSettings ? "Hide Settings" : "Settings"}
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {showSettings && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-md font-semibold mb-2">Settings</h3>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">
              Change Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="New password"
            />
            <button
              onClick={handlePasswordChange}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Update Password
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Theme Preference
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePanel;
