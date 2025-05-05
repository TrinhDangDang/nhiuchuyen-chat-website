import React, { useState } from "react";
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
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState("light");
  const [prompt, setPrompt] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

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
          Authorization: `Bearer YOUR_API_KEY`,
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
    <div className="h-full p-6 flex flex-col bg-white/60 backdrop-blur-md overflow-y-auto">
      <div className="flex flex-col items-center mb-4">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 mb-4 shadow-lg">
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

        {/* Avatar Generation */}
        {isEditing && (
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Generate Avatar with AI
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. neon samurai"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={generateAvatar}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Generate
              </button>
            </div>
          </div>
        )}

        {/* Name & Status */}
        {isEditing ? (
          <>
            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-lg font-semibold mb-2 border px-2 py-1 rounded w-full text-center"
            />
            <input
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              className="text-sm text-gray-500 border px-2 py-1 rounded w-full text-center mb-4"
            />
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-1">
              {currentUser.fullname || currentUser.username}
            </h2>
            <p className="text-sm text-gray-500 mb-4">🟢 Available</p>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col space-y-2 text-sm">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="text-green-600 hover:underline text-left"
          >
            ✅ Save Changes
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="text-indigo-600 hover:underline text-left"
          >
            ✏️ Edit Profile
          </button>
        )}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-indigo-600 hover:underline text-left"
        >
          {showSettings ? "🔽 Hide Settings" : "⚙️ Settings"}
        </button>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:underline text-left"
        >
          🚪 Logout
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-5 pt-4 border-t border-gray-300 text-sm space-y-4">
          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Change Password
            </label>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            <button
              onClick={handlePasswordChange}
              className="mt-2 text-blue-600 hover:underline"
            >
              Update Password
            </button>
          </div>

          {/* Theme */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
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
