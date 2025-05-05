import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedFriend } from "../../app/chatSlice";
import { useGetUsersQuery, selectUsersData } from "../users/usersApiSlice";
import { useGetMessagesQuery } from "./messagesApiSlice";
import useAuth from "../../hooks/useAuth";
import { useSocket } from "./SocketContext";

const MessagePanel = ({ showFriendProfile, setShowFriendProfile }) => {
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="p-4 bg-white border-b shadow flex items-center gap-3">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={pic}
          alt={fullname}
        />
        <div className="flex-1">
          <h2 className="text-md font-semibold text-gray-800">{fullname}</h2>
          <p className="text-xs text-green-500">Online</p>
        </div>
        <button
          onClick={() => setShowFriendProfile((prev) => !prev)}
          className="text-sm text-indigo-600 hover:underline"
        >
          {showFriendProfile ? "Hide Info" : "View Info"}
        </button>
      </header>

      {/* Messages */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto space-y-4 px-4 py-6 bg-gradient-to-b from-white to-indigo-50"
        >
          {texts.ids.length > 0 ? (
            texts.ids.map((id) => {
              const msg = texts.entities[id];
              const isMe = msg.senderId === userId;

              return (
                <div
                  key={id}
                  className={`flex ${
                    isMe ? "justify-end" : "justify-start"
                  } transition-all`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-xl shadow text-sm ${
                      isMe
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
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

        {/* Input */}
        <form
          onSubmit={sendText}
          className="flex gap-3 items-center border-t p-4 bg-white"
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
            className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagePanel;
