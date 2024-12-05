import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'
import {useSelector} from 'react-redux'
// import { selectCurrentToken } from '../features/auth/authSlice'
// import { useRefreshMutation } from '../features/auth/authApiSlice'
import { useEffect } from 'react'
// import {io} from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { addNotification, selectNotifications, selectOnlineUsers, selectSelectedFriend, setOnlineUsers/* , setSocket */ } from '../app/chatSlice'
import { useSocket } from '../features/chat/SocketContext'
import notificationSound from '../img/mixkit-correct-answer-tone-2870.wav'
import { useLocation } from 'react-router-dom'


const DashLayout = () => {
    // const token = useSelector(selectCurrentToken)
    // const [refresh, {isLoading, isSuccess, isError, error}] = useRefreshMutation()
    const socket = useSocket()
    const recipient = useSelector(selectSelectedFriend)
    const dispatch = useDispatch()
    // const socket = useSelector((state) => state.chat.socket)

    const { pathname } = useLocation()
    // useEffect(() => {
    //     let newSocket
    //     const initializeSocket = async() => {
    //         try {
    //             let accessToken = token
    //             if (!token) {
    //               console.log('Access token missing or expired.Refreshing...')
    //               const response = await refresh().unwrap();
    //               accessToken = response.accessToken;
    //             }
    //             newSocket = io('http://localhost:3500', {
    //               auth: {token: accessToken},
    //             })
    //            dispatch(setSocket(newSocket))
    //           }catch(err) {
    //             console.error('Error connecting to Socket.IO')
    //           } 
    //     }
    //     initializeSocket()
    //     return () => {
    //         return () => { if(newSocket){newSocket.disconnect()}}
    //     }
    // }, [dispatch, token])

    // useEffect(()=> {
    //     let timeout;
    //     const refreshTokenPeriodically = async() => {
    //         try {
    //             if (socket && socket.connected) {
    //               const response = await refresh().unwrap();
    //               const newToken = response.accessToken;
          
    //               socket.emit('updateToken', newToken);
    //               console.log('Token refreshed and sent to server:', newToken);
    //             } else {
    //               console.warn('Socket not connected. Skipping token update.');
    //             }
    //           } catch (err) {
    //             console.error('Error refreshing token:', err);
    //           } finally {
    //             timeout = setTimeout(refreshTokenPeriodically, 15 * 60 * 1000); // 15 minutes
    //           }
    //     };
    //     timeout = setTimeout(refreshTokenPeriodically, 15 * 60 * 1000) //every 15 minutes
    //     return () => clearTimeout(timeout);
    // }, [socket])

    useEffect(() => {
        if (socket) {
            const handleOnlineUsers = (onlineUsers) => {
                dispatch(setOnlineUsers(onlineUsers))
                console.log("online Users",onlineUsers)
            };
    
            socket.on("onlineUsers", handleOnlineUsers);
            
            // Cleanup listener on component unmount
            return () => {
                socket.off("onlineUsers", handleOnlineUsers);
            };
        }
    }, [dispatch, socket]);

    const notifications = useSelector(selectNotifications)
    useEffect(() => {
        if (socket) {
            const handleNotifications = (comingMessage) => {
                const {senderId}  = comingMessage
                console.log("coming message",comingMessage)
                if (!(pathname === "/dash/chat" && senderId === recipient)){
                    dispatch(addNotification(comingMessage))
                    const audio = new Audio(notificationSound);
                    audio.play().catch((err) => console.error("Error playing sound:", err));
                }

            }
            socket.on("newMessage", handleNotifications)
        
            return() => {
                socket.off("newMessage", handleNotifications)
            }
        }
    }, [socket, recipient,dispatch])


    const onlineUsers = useSelector(selectOnlineUsers)
    
    console.log(notifications)
    console.log("Online Users",onlineUsers)

    return (
        <>
            <div className='page-container'>
            <DashHeader />
            <div className={pathname === "/dash/games" ? "dash-container-background" : "dash-container"}>
                <Outlet />
            </div>
            <DashFooter />
            </div>
        </>
    )
}
export default DashLayout