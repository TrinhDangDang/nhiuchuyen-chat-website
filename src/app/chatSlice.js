import { createSlice } from "@reduxjs/toolkit";


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        selectedFriend: null, //these are smaller state for each state of the slice? called state keys??
        onlineUsers: [],
        notifications: {},
    },
    reducers: {
        setSelectedFriend: (state, action)=> {
            state.selectedFriend = action.payload;
            if (state.notifications[action.payload]){
                delete state.notifications[action.payload];
            }
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        addNotification: (state, action) => {
            const { senderId: friendId } = action.payload;
            if (state.notifications[friendId]) {
              state.notifications[friendId] += 1;
            } else {
              state.notifications[friendId] = 1;
            }
          },
          // Clear notifications for a specific conversation
          clearNotifications: (state, action) => {
            const friendId = action.payload;
            if (state.notifications[friendId]) {
              delete state.notifications[friendId];
            }
          },
    },
})

export const {
    setSelectedFriend,
    setOnlineUsers,
    addNotification,
    clearNotifications,
  } = chatSlice.actions;

export const selectSelectedFriend = (state) => state.chat.selectedFriend;
export const selectOnlineUsers = (state) => state.chat.onlineUsers;
export const selectNotifications = (state) => state.chat.notifications;

export default chatSlice.reducer