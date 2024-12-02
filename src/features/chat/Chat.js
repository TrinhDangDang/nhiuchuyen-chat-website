import React from 'react'
import ContactPanel from "./ContactPanel"
import MessagePanel from "./MessagePanel"
// import { useState } from 'react'
// import useAuth from '../../hooks/useAuth'
// import { useSelector } from 'react-redux'
// import { selectCurrentToken } from "../auth/authSlice"
// import { useRefreshMutation } from '../auth/authApiSlice'
// import { useEffect } from 'react'
// import {io} from 'socket.io-client'


const Chat = () => {

  // const [socket, setSocket] = useState(null)
  // const token = useSelector(selectCurrentToken)

  // const [refresh, {isLoading, isSuccess, isError, error}] = useRefreshMutation()
  // const [selectedFriend, setSelectedFriend] = useState(null) //default recipient is the current logged in user

  // useEffect(() => {
  //   let newSocket
  //   const initializeSocket = async () => {
  //     try {
  //       let accessToken = token
  //       if (!token) {
  //         console.log('Access token missing or expired.Refreshing...')
  //         const response = await refresh().unwrap();
  //         accessToken = response.accessToken;
  //       }
  //       newSocket = io('http://localhost:3500', {
  //         auth: {token: accessToken},
  //       })
  //      setSocket(newSocket)
  //     }catch(err) {
  //       console.error('Error connecting to Socket.IO')
  //     } 
  //   }
  //     initializeSocket()
  //     return () => { if (newSocket) {newSocket.disconnect()}}
  //   }, [selectedFriend])

  //   useEffect(() => {
  //     let timeout;
    
  //     const refreshTokenPeriodically = async () => {
  //       try {
  //         if (socket && socket.connected) {
  //           const response = await refresh().unwrap();
  //           const newToken = response.accessToken;
    
  //           socket.emit('updateToken', newToken);
  //           console.log('Token refreshed and sent to server:', newToken);
  //         } else {
  //           console.warn('Socket not connected. Skipping token update.');
  //         }
  //       } catch (err) {
  //         console.error('Error refreshing token:', err);
  //       } finally {
  //         timeout = setTimeout(refreshTokenPeriodically, 15 * 60 * 1000); // 15 minutes
  //       }
  //     };
    
  //     // Start the periodic refresh after 15 minutes
  //     timeout = setTimeout(refreshTokenPeriodically, 15 * 60 * 1000);
    
  //     return () => {
  //       clearTimeout(timeout); // Cleanup timeout on unmount
  //     };
  //   }, [socket, refresh]);
    

  // const handleSelectedFriend = (data) => {
  //   setSelectedFriend(data)
  // }

  return (
    <div className='chat'>
        <ContactPanel/>
        {/* <ContactPanel changeChatRecipient={handleSelectedFriend} socket={socket}/> */}
        {/* <MessagePanel selectedFriend={selectedFriend} socket={socket}/> */}
        <MessagePanel/>
    </div>
  )
}

export default Chat