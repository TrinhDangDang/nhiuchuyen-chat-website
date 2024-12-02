import React from 'react';
import { useGetUsersQuery } from '../users/usersApiSlice';
import Messages from './Messages';
import { useSelector } from 'react-redux';
import { selectSelectedFriend } from '../../app/chatSlice';

const MessagePanel = (/* {selectedFriend, socket} */) => {
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

    const selectedFriend = useSelector(selectSelectedFriend)

    if (!selectedFriend) return (
      <div className='messages_panel'>
      <p>chit chat to not be sad</p>
      </div>)
    // Check if data is available and fallback to username if necessary
    const theUser = isSuccess && users?.entities?.[selectedFriend]
    const fullname = theUser.fullname || theUser.username;
    const profilePic = <img className='profilePic' src={theUser.profilePic || "https://api.dicebear.com/9.x/thumbs/svg?seed=Emery"} alt='profile pic'/>
    const pic = theUser.profilePic || "https://api.dicebear.com/9.x/thumbs/svg?seed=Emery"

    // Handle loading and error states
    
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error?.data?.message || "Failed to load users."}</p>;

    return (
        <div className='messages_panel'>
            <div className='contactOnTopofChat'>{profilePic}  {fullname}</div>
            <Messages /* friendId={selectedFriend}  */avatar={pic} /* socket={socket} *//>
        </div>
    );
};

export default MessagePanel;
