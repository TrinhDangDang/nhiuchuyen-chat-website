import React, {useState, useEffect} from 'react';
// import { useGetConversationsQuery } from './messagesApiSlice';
import Conversations from './Conversations';
import useAuth from '../../hooks/useAuth';
import { useGetUsersQuery } from '../users/usersApiSlice';
import { useDispatch } from 'react-redux';
import { selectOnlineUsers, setSelectedFriend } from '../../app/chatSlice';
import { useSelector } from 'react-redux';

const ContactPanel = () => {

    const dispatch = useDispatch()
    const onlineUsers = useSelector(selectOnlineUsers)
    
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetUsersQuery(undefined, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    // const {
    //     data: conversations,
    //     isLoading: isConversationsLoading,
    //     isSuccess: isConversationsSuccess,
    //     isError: isConversationsError,
    //     error: conversationsError,
    // } = useGetConversationsQuery(undefined, {pollingInterval: 60000, refetchOnFocus: true, refetchOnMountOrArgChange: true,})
    // const [onlineUsers, setOnlineUsers] = useState([])

    // useEffect(() => {
    //     if (socket) {
    //         const handleOnlineUsers = (data) => {
    //             setOnlineUsers(data);
    //         };
    
    //         socket.on("onlineUsers", handleOnlineUsers);
    //         console.log("ONLINE USERS",onlineUsers)
    //         // Cleanup listener on component unmount
    //         return () => {
    //             socket.off("onlineUsers", handleOnlineUsers);
    //         };
    //     }
    // }, [socket]);

    const {userId} = useAuth()

    let content;
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users ? users.ids.map((id) => users.entities[id]).filter((user)=> user.id !== userId && user.username.toLowerCase().includes(searchQuery.toLowerCase())): []

    // const changeConversation = (value) => {
    //     changeChatRecipient(value)
    // }
    
    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    } else if (isSuccess) {
        content = (
                searchQuery &&
                <ul className='friends'>
                    {filteredUsers.map((user) => (
                        <li className="friend" key={user.id} onClick={() => {dispatch(setSelectedFriend(user)); setSearchQuery("")}}>{user.profilePic? <img className="profilePic" src={user.profilePic} alt="User Profile"/>: <img className="profilePic" src="https://api.dicebear.com/9.x/thumbs/svg?seed=Emery" alt="User Profile"/> } {user.fullname? user.fullname :user.username} {onlineUsers.includes(user.id)? "🟢":""}</li>
                    ))}
                </ul>
        );
    }

    return (
        <div className='contact_panel'>
            <input className='usersSearch' type="text" placeholder="👀 Search users..." value={searchQuery} onChange={(e) =>setSearchQuery(e.target.value)}></input>
            {content}
            <p>recent conversations:</p>
            {/* <Conversations changeConversation = {changeConversation} users={users} onlineUsers={onlineUsers}/> */}
            <Conversations/>
        </div>
    );
};

export default ContactPanel;
