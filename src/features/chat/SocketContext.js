import React, {createContext, useContext, useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { selectCurrentToken } from '../auth/authSlice'
import { useRefreshMutation } from '../auth/authApiSlice'

const SocketContext = createContext(null)

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const token = useSelector(selectCurrentToken)
    const [refresh] = useRefreshMutation()

    useEffect(() => {
        let newSocket;

        const initializeSocket = async () => {
            try {
                let accessToken = token
                
                if(!token){
                    console.log("Access token missing or expired. Refreshing...")
                    const response = await refresh().unwrap()
                    accessToken = response.accessToken
                } 
                newSocket = io("https://api.trinhdangdang.com",{
                    auth: {token: accessToken}
                })

                setSocket(newSocket)

            }catch(err){
                console.error('Error connecting to Socket.IO')
            }
        }
        initializeSocket()
        return () => {
            if(newSocket){
                newSocket.disconnect()}
        }
    }, [token, refresh])

    // useEffect(() => {
    //     let timeout;
    
    //     const refreshTokenPeriodically = async () => {
    //         try {
    //             if (socket && socket.connected) {
    //                 // Refresh the token
    //                 const response = await refresh().unwrap();
    //                 const newToken = response.accessToken;
    
    //                 // Send the updated token to the server
    //                 socket.emit('updateToken', { token: newToken }, (serverResponse) => {
    //                     if (serverResponse.success) {
    //                         console.log('Token updated successfully:', newToken);
    //                     } else {
    //                         console.error('Token update failed:', serverResponse.message);
    //                     }
    //                 });
    //             } else {
    //                 console.warn('Socket not connected. Skipping token update.');
    //             }
    //         } catch (err) {
    //             console.error('Error refreshing token:', err);
    //             // Handle persistent errors (e.g., prompt re-login)
    //         } finally {
    //             // Schedule the next refresh
    //             timeout = setTimeout(refreshTokenPeriodically, 15 * 60 * 1000); // 15 minutes
    //         }
    //     };
    
    //     // Start the periodic token refresh
    //     timeout = setTimeout(refreshTokenPeriodically, 15 * 60 * 1000);
    
    //     // Cleanup on unmount or dependency change
    //     return () => {
    //         clearTimeout(timeout);
    //     };
    // }, [socket, refresh]);

    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}


