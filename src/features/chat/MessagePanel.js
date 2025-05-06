import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedFriend } from "../../app/chatSlice";
import { useGetUsersQuery, selectUsersData } from "../../app/api/usersApiSlice";
import { useGetMessagesQuery } from "../../app/api/messagesApiSlice";
import useAuth from "../../hooks/useAuth";
import { useSocket } from "./SocketContext";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";

const MessagePanel = ({
  showFriendProfile,
  setShowFriendProfile,
  setShowContactPanel,
  setShowProfilePanel,
}) => {
  const selectedFriend = useSelector(selectSelectedFriend);
  const users = useSelector(selectUsersData);
  const { userId } = useAuth();
  const socket = useSocket();
  const messagesContainerRef = useRef(null);

  const {
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useGetUsersQuery(undefined);

  const {
    data: messages,
    isLoading: isMessagesLoading,
    isSuccess: isMessagesSuccess,
    isError: isMessagesError,
    error: messagesError,
    isFetching: isMessagesFetching,
  } = useGetMessagesQuery(selectedFriend, {
    refetchOnMountOrArgChange: true,
  });

  const [texts, setTexts] = useState({ ids: [], entities: {} });
  const [text, setText] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const friend = users?.entities?.[selectedFriend];
  const fullname = friend?.fullname || friend?.username || "Unknown User";
  const pic =
    friend?.profilePic || "https://api.dicebear.com/9.x/thumbs/svg?seed=Emery";

  useEffect(() => {
    setTexts({ ids: [], entities: {} });
    setIsLoadingMessages(true);
  }, [selectedFriend]);

  useEffect(() => {
    if (isMessagesError) {
      console.error(messagesError?.data?.message);
      setTexts({ ids: [], entities: {} });
    }
  }, [isMessagesError, messagesError]);

  useEffect(() => {
    if (isMessagesSuccess && messages) {
      setTexts(messages);
      setIsLoadingMessages(false);
    }
  }, [isMessagesSuccess, messages]);

  useEffect(() => {
    if (socket) {
      const handleMessageReceived = (data) => {
        const { _id, message, senderId } = data;
        if (senderId === selectedFriend) {
          setTexts((prev) => {
            const updatedEntities = { ...prev.entities, [_id]: data };
            const updatedIds = prev.ids.includes(_id)
              ? prev.ids
              : [...prev.ids, _id];
            return { ids: updatedIds, entities: updatedEntities };
          });
        }
      };
      socket.on("newMessage", handleMessageReceived);
      return () => socket.off("newMessage", handleMessageReceived);
    }
  }, [socket, selectedFriend]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [texts.ids]);

  const sendText = (e) => {
    e.preventDefault();
    if (text.trim()) {
      const tempId = Date.now();
      const newMessage = {
        _id: tempId,
        senderId: userId,
        receiverId: selectedFriend,
        message: text,
      };
      setTexts((prev) => {
        const updatedEntities = { ...prev.entities, [tempId]: newMessage };
        const updatedIds = [...(prev.ids || []), tempId];
        return { ids: updatedIds, entities: updatedEntities };
      });
      socket.emit("message", { receiverId: selectedFriend, message: text });
      setText("");
    }
  };

  if (!selectedFriend)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-white">
        <p>Select a conversation to begin chatting</p>
      </div>
    );

  if (isUserLoading)
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading user info...</p>
      </div>
    );

  if (isUserError)
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-red-500">
          Error: {userError?.data?.message || "Failed to load users."}
        </p>
      </div>
    );

  if (!friend)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-white">
        <p>User not found.</p>
      </div>
    );

  return (
    <main className="h-full w-full bg-gradient-to-br from-white via-indigo-50 to-purple-100 p-4 flex flex-col">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4 bg-white/80 rounded-xl shadow px-4 py-3 mb-4"
      >
        <img
          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
          src={pic}
          alt={fullname}
        />
        <div className="flex-1">
          <h2 className="font-semibold text-lg text-gray-800">{fullname}</h2>
          <p className="text-xs text-green-500">● Online</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowContactPanel(true)}
            className="text-sm text-indigo-600 hover:underline md:hidden"
          >
            Contacts
          </button>
          <button
            onClick={() => setShowProfilePanel(true)}
            className="text-sm text-indigo-600 hover:underline md:hidden"
          >
            Profile
          </button>
          <button
            onClick={() => setShowFriendProfile((prev) => !prev)}
            className="text-sm text-indigo-600 hover:underline"
          >
            {showFriendProfile ? "Hide Info" : "View Info"}
          </button>
        </div>
      </motion.div>

      {/* Messages List */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto space-y-4 px-2 pb-6"
      >
        {texts.ids.length > 0 ? (
          texts.ids.map((id) => {
            const msg = texts.entities[id];
            const isMe = msg.senderId === userId;

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border"
                  }`}
                >
                  {msg.message}
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-gray-500 italic text-sm text-center">
            {isMessagesLoading || isMessagesFetching || isLoadingMessages
              ? "Loading messages..."
              : `No messages with ${fullname}`}
          </p>
        )}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={sendText}
        className="mt-auto flex gap-3 items-center bg-white/80 border-t border-indigo-100 p-4 rounded-xl shadow-md"
      >
        <input
          className="flex-1 p-2 border rounded-full shadow-sm focus:outline-none focus:ring focus:border-indigo-500"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <FiSend /> Send
        </button>
      </form>
    </main>
  );
};

export default MessagePanel;
