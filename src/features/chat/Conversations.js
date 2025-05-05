import React, { useState } from "react";
import {
  useGetConversationsQuery,
  useDeleteConversationsMutation,
} from "./messagesApiSlice";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNotifications,
  selectOnlineUsers,
  selectSelectedFriend,
  setSelectedFriend,
} from "../../app/chatSlice";
import { selectUsersData } from "../users/usersApiSlice";

const Conversations = () => {
  const [deleteConversation, { isLoading: isDeleting }] =
    useDeleteConversationsMutation();
  const selectedFriend = useSelector(selectSelectedFriend);
  const users = useSelector(selectUsersData);

  const {
    data: conversations,
    isLoading: isConversationsLoading,
    isSuccess: isConversationsSuccess,
    isError: isConversationsError,
    error: conversationsError,
  } = useGetConversationsQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { userId } = useAuth();
  const dispatch = useDispatch();
  const onlineUsers = useSelector(selectOnlineUsers);
  const notifications = useSelector(selectNotifications);

  const [dialog, setDialog] = useState({
    open: false,
    recipientId: null,
    name: "",
  });

  const handleDeleteConversation = (recipientId, name) => {
    setDialog({ open: true, recipientId, name });
  };

  const confirmDelete = async () => {
    try {
      await deleteConversation(dialog.recipientId).unwrap();
      if (selectedFriend === dialog.recipientId) {
        dispatch(setSelectedFriend(null));
      }
      setDialog({ open: false, recipientId: null, name: "" });
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const cancelDelete = () => {
    setDialog({ open: false, recipientId: null, name: "" });
  };

  let content;

  if (isConversationsLoading || !users) {
    content = <p className="text-gray-500">Loading conversations...</p>;
  } else if (isConversationsError) {
    content = (
      <p className="text-red-500">
        Error: {conversationsError?.message || "An error occurred"}
      </p>
    );
  } else if (isConversationsSuccess) {
    const ids = conversations.ids || [];
    content = (
      <ul className="space-y-2">
        {ids.map((id) => {
          const participants = conversations.entities[id].participants;
          const recipientId = participants.find((p) => p !== userId);
          const recipientData = users?.entities[recipientId];
          const recipientName =
            recipientData?.fullname || recipientData?.username || "Unknown";
          const recipientPic =
            recipientData?.profilePic ||
            "https://api.dicebear.com/9.x/thumbs/svg?seed=Emery";

          const isSelected = selectedFriend === recipientId;
          const hasNotification = notifications[recipientId];
          const isOnline = onlineUsers.includes(recipientId);

          return (
            <li
              key={id}
              onClick={() => dispatch(setSelectedFriend(recipientId))}
              className={`group flex items-center p-3 rounded cursor-pointer transition-colors relative ${
                isSelected ? "bg-blue-100" : "bg-white hover:bg-gray-100"
              }`}
            >
              <div className="relative mr-3">
                <img
                  className="w-10 h-10 rounded-full"
                  src={recipientPic}
                  alt="Profile"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{recipientName}</p>
              </div>
              {hasNotification && <span className="text-lg">◽</span>}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConversation(recipientId, recipientName);
                }}
                className="hidden group-hover:block absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                title="Delete conversation"
              >
                🗑
              </button>
            </li>
          );
        })}
      </ul>
    );
  } else {
    content = <p className="text-gray-500">No conversations yet.</p>;
  }

  return (
    <div className="mt-4 relative">
      {content}

      {dialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Delete Conversation</h2>
            <p className="mb-6">
              Are you sure you want to delete your conversation with{" "}
              <span className="font-medium">{dialog.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-1 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversations;
