import React, { useState, useRef, useEffect } from 'react';
import { useGetMessagesQuery} from './messagesApiSlice';
import useAuth from '../../hooks/useAuth';
import { useSelector } from 'react-redux';
import { selectSelectedFriend } from '../../app/chatSlice';



const Messages = ({ /* friendId, */ avatar,/*  socket */ }) => {
    

    const friendId = useSelector(selectSelectedFriend)
    const {
        data: messages,
        isLoading: isMessagesLoading,
        isSuccess: isMessagesSuccess,
        isError: isMessagesError,
        error: messagesError,
        isFetching: isMessagesFetching,
    } = useGetMessagesQuery(friendId, {
        refetchOnMountOrArgChange:true,
    });

    const [texts, setTexts] = useState({ ids: [], entities: {} })
    const [text, setText] = useState("")
    const {userId} = useAuth()
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const socket = useSelector((state) => state.chat.socket)

    // Reset texts and set loading state when switching conversations
    useEffect(() => {
        setTexts({ ids: [], entities: {} });
        setIsLoadingMessages(true);
    }, [friendId]);

    // Update texts when messages are successfully fetched
    useEffect(() => {
        if (isMessagesSuccess && messages) {
            setTexts(messages);
            setIsLoadingMessages(false); // Mark as loaded
        }
    }, [isMessagesSuccess, messages]);
   

    useEffect(() => {
        if (socket) {
            const handleMessageReceived = (data) => {
                const {_id, message, senderId} = data
                if (senderId === friendId){
                setTexts((prev) => {
                    const updatedEntities = {...prev.entities, [_id]:data}
                    const updatedIds = prev.ids.includes(_id)? prev.ids: [...prev.ids, _id]
                    return {
                        ids: updatedIds,
                        entities: updatedEntities
                    }
                })
            }
            };
    
            socket.on("newMessage", handleMessageReceived);
    
            // Cleanup listener on component unmount
            return () => {
                socket.off("newMessage", handleMessageReceived);
            };
        }
    }, [socket, friendId]);

    
    const sendText = (e) => {
        e.preventDefault()
        const tempId = new Date().getTime(); // Temporary unique ID (can also use UUID)
        const newMessage = {
            _id: tempId, // Temporary ID
            senderId: userId, // Assuming `userId` is available from `useAuth` or props
            receiverId: friendId,
            message: text,
        };

        // Update the `texts` state with the new message
        setTexts((prev) => {
            const updatedEntities = { ...prev.entities, [tempId]: newMessage };
            const updatedIds = [...(prev.ids || []), tempId];
            return {
                ids: updatedIds,
                entities: updatedEntities,
            };
        });
        socket.emit("message", { receiverId: friendId, message: text });

        // Clear the input field
        setText("");

    }

    // const [sendMessage, {
    //     isLoading: isSending,
    //     isSuccess: isSendSuccess,
    //     isError: isSendError,
    //     error: sendError,
    // }] = useSendMessageMutation();
    const messagesContainerRef = useRef(null);

    // Scroll to the bottom when messages are loaded or updated
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [texts.ids]); // Triggered whenever messages change



    // const handleSendMessage = async (e) => {
    //     e.preventDefault();
    //     try {
    //         await sendMessage({ message: messageText, receiverId: friendId });
    //         setMessageText(''); // Clear the input field after sending
    //     } catch (error) {
    //         console.error("Failed to send message:", error);
    //     }
    // };

    let content;

if (isMessagesLoading || isMessagesFetching || isLoadingMessages) {
    content = <p>Loading messages...</p>;
} else if (isMessagesError) {
    content = <p>Error loading messages: {messagesError?.message}</p>;
} else if (isMessagesSuccess && messages) {
    const ids = texts.ids || [];
    const messagesList = ids.length
        ? ids.map((messageId) => {
              const message = texts.entities[messageId];
              const isSentByFriend = message.receiverId === friendId;
              return (
                  <div
                      key={messageId}
                      className={isSentByFriend ? "messageTo" : "messageFrom"}
                  >
                      {!isSentByFriend && (
                          <img className="avatar" src={avatar} alt="avatar in chat" />
                      )}
                      {message.message}
                  </div>
              );
          })
        : <p>No messages found.</p>;
    content = messagesList;
}


    return (
        <div className="messages_and_textbox">
            <div
                className="messages_container"
                ref={messagesContainerRef} // Attach the ref to the container
            >
                {content}
            </div>
            <form
                className="sendForm"
                onSubmit={sendText}
            >
                <input
                    className="chat_input"
                    type="text"
                    placeholder="Enter message here"
                    aria-label="Message input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button className="send_button">Send</button>
            </form>
        </div>
    );
};

export default Messages;
