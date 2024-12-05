import React from 'react';
import { useGetConversationsQuery } from './messagesApiSlice';
import useAuth from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectNotifications, selectOnlineUsers, selectSelectedFriend, setSelectedFriend } from '../../app/chatSlice';
import { selectUsersData } from '../users/usersApiSlice';


const Conversations = (/* {users} */) => {
    // Fetch conversations data
    const selectedFriend = useSelector(selectSelectedFriend)
    const users = useSelector(selectUsersData)
    console.log(users)
    const {
        data: conversations,
        isLoading: isConversationsLoading,
        isSuccess: isConversationsSuccess,
        isError: isConversationsError,
        error: conversationsError,
    } = useGetConversationsQuery(selectedFriend, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    // Fetch users data
    // const {
    //     data: users,
    //     isLoading: isUsersLoading,
    //     isSuccess: isUsersSuccess,
    //     isError: isUsersError,
    //     error: usersError,
    // } = useGetUsersQuery(undefined, { //first arguments represents input data for the query, getusers doesnt need an input to get the users so its undefined
    //     pollingInterval: 60000,
    //     refetchOnFocus: true,
    //     refetchOnMountOrArgChange: true,
    // });

    const { userId } = useAuth();
    const dispatch = useDispatch()
    const onlineUsers = useSelector(selectOnlineUsers)
    console.log("online users in conversations panel", onlineUsers)
    const notifications = useSelector(selectNotifications)
 

    // const changeRecipient = (value) => {
    //   changeConversation(value)
    // }

    // Prepare list of recipient names
    let recipient;

    if (isConversationsLoading || !users) {
        recipient = <p>Loading conversations...</p>;
    } else if (isConversationsError ) {
        recipient = (
            <p>
                Error: {conversationsError?.message  || 'An error occurred'}
            </p>
        );
    } else if (isConversationsSuccess ) {
        console.log("conversations",conversations)
        const ids = conversations.ids || [];
        recipient = ids.map((id) => {
            const participants = conversations.entities[id].participants;
            const recipientId = participants.filter((participant) => participant !== userId)[0];
            const recipientData = users?.entities[recipientId];
            const recipientName = recipientData?.fullname || recipientData?.username || 'Unknown';
            const recipientPic = recipientData?.profilePic || "https://api.dicebear.com/9.x/thumbs/svg?seed=Emery";
            return (
                <div className={selectedFriend && selectedFriend  === recipientId? "current_conversation":"conversation"} onClick={()=> dispatch(setSelectedFriend(recipientId))/* changeRecipient(recipientId) */} key={id}>
                  <div className='profilePicContainer'><img className='profilePic' src={recipientPic} alt='profilePicture'/> <span className='online_indicator'>{onlineUsers.includes(recipientId)? "🟢":""}</span></div> {recipientName} 
                  {Object.keys(notifications).includes(recipientId)? "◽":""}
                </div>
            );
        });
    } else {
        recipient = <p>No conversations yet.</p>;
    }

    return <div className='conversations'><p>recent conversations:</p>{recipient}</div>;
};

export default Conversations;
