import React, { useState } from "react";
import {
  useGetConversationsQuery,
  useDeleteConversationsMutation,
} from "../../app/api/messagesApiSlice";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNotifications,
  selectOnlineUsers,
  selectSelectedFriend,
  setSelectedFriend,
} from "../../app/chatSlice";
import { selectUsersData } from "../../app/api/usersApiSlice";
import { motion, AnimatePresence } from "framer-motion";

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
    content = (
      <p className="text-gray-500 animate-pulse text-center py-4">
        Loading conversations...
      </p>
    );
  } else if (isConversationsError) {
    content = (
      <p className="text-red-500 text-center py-4">
        Error: {conversationsError?.message || "An error occurred"}
      </p>
    );
  } else if (isConversationsSuccess) {
    const ids = conversations.ids || [];
    content = (
      <ul className="space-y-4 mt-4">
        <AnimatePresence>
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
              <motion.li
                key={id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                onClick={() => dispatch(setSelectedFriend(recipientId))}
                className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer shadow-md transition-all ${
                  isSelected ? "bg-indigo-100" : "bg-white hover:bg-indigo-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      className="w-10 h-10 rounded-full border border-indigo-300"
                      src={recipientPic}
                      alt="Profile"
                    />
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-ping"></span>
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-gray-800 truncate">
                      {recipientName}
                    </p>
                    {hasNotification && (
                      <p className="text-xs text-indigo-600">New message</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(recipientId, recipientName);
                  }}
                  className="hidden group-hover:inline text-red-500 hover:text-red-700 text-sm"
                  title="Delete conversation"
                >
                  🗑
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    );
  } else {
    content = (
      <p className="text-gray-500 text-center py-4">No conversations yet.</p>
    );
  }

  return (
    <div className="mt-4 relative">
      {content}

      <AnimatePresence>
        {dialog.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-xl w-80"
            >
              <h2 className="text-lg font-bold mb-3">Delete Conversation</h2>
              <p className="text-sm mb-5">
                Are you sure you want to delete your conversation with <br />
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Conversations;
