import React, { useState, useEffect } from "react";
import {
  useGetUsersQuery,
  useUpdateUserPasswordMutation,
} from "../../app/api/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { useSendLogoutMutation } from "../auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogOut, FiEdit, FiSettings, FiSave } from "react-icons/fi";
import {
  useGenerateAvatarMutation,
  useSaveAvatarMutation,
} from "../../app/api/avatarApiSlice";

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
  const [generateAvatar, { isLoading: isGenerating }] =
    useGenerateAvatarMutation();
  const [saveAvatar, { isLoading: isSaving }] = useSaveAvatarMutation();
  const [updateUserPassword, { isLoading: isUpdatingPassword }] =
    useUpdateUserPasswordMutation();

  const currentUser = users?.entities?.[userId];

  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedFullName, setEditedFullName] = useState("");
  const [theme, setTheme] = useState("light");
  const [prompt, setPrompt] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEditedName(currentUser.username);
      setEditedFullName(currentUser.fullname || "generic name");
    }
  }, [currentUser]);

  const handleSave = async () => {
    const nameToSend = editedName.trim();
    const fullNameToSend = editedFullName.trim() || "Unnamed User";

    try {
      await saveAvatar({
        imageUrl: previewImage || currentUser.profilePic,
        newUserName: nameToSend,
        newFullName: fullNameToSend,
      }).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save avatar and name:", err);
    }
  };

  const handleCancel = () => {
    setEditedName(currentUser.username);
    setEditedFullName(currentUser.fullname || "");
    setPreviewImage(null);
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

  const handleGenerateAvatar = async () => {
    if (!prompt.trim()) return;
    try {
      const result = await generateAvatar(prompt).unwrap();
      if (result.image) {
        setPreviewImage(result.image);
      }
    } catch (err) {
      console.error("Avatar generation failed", err);
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      alert("Both fields are required");
      return;
    }

    try {
      await updateUserPassword({ oldPassword, newPassword }).unwrap();
      alert("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Password update failed:", error);
      alert(error?.data?.message || "Failed to update password");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 animate-pulse">
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
    <main className="min-h-full w-full bg-gradient-to-r from-indigo-100 to-purple-100 p-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg w-full max-w-lg p-6"
      >
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md mb-4">
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

          {isEditing ? (
            <div className="w-full space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  value={editedFullName}
                  onChange={(e) => setEditedFullName(e.target.value)}
                  className="text-base border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-base border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {currentUser.fullname || "random name"}
              </h2>
              <p className="text-sm text-gray-600">@{currentUser.username}</p>
              <p className="text-sm text-green-600 mt-1">🟢 Available</p>
            </>
          )}

          {isEditing && (
            <div className="w-full mt-4">
              <label className="text-sm font-medium text-gray-700">
                Generate Avatar with AI
              </label>
              <div className="flex flex-col items-center gap-2 mt-1">
                <input
                  type="text"
                  placeholder="e.g. cyberpunk dog"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
                <button
                  onClick={handleGenerateAvatar}
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>
          )}

          <div className="w-full mt-6 space-y-2">
            {isEditing ? (
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 text-green-600 hover:underline"
                  disabled={isSaving}
                >
                  <FiSave /> {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-gray-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <FiEdit /> Edit Profile
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <FiSettings /> {showSettings ? "Hide Settings" : "Show Settings"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:underline"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          {showSettings && (
            <div className="mt-5 pt-5 border-t border-gray-300 w-full space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Change Password
                </label>

                <div className="relative mb-2">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full border px-3 py-1 rounded pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-indigo-600"
                  >
                    {showOldPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border px-3 py-1 rounded pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-indigo-600"
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <button
                  onClick={handlePasswordChange}
                  className="text-indigo-600 mt-2 hover:underline"
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Theme Preference
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full border px-3 py-1 rounded"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
};

export default ProfilePanel;
