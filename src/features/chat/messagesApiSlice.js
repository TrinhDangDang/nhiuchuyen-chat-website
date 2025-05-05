import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const conversationsAdapter = createEntityAdapter();

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (receipientId) => `/message/${receipientId}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        const loadedMessages = responseData.map((message) => {
          message.id = message._id; // Normalize MongoDB `_id` to `id`
          return message;
        });
        return messagesAdapter.setAll(initialState, loadedMessages);
      },
      providesTags: (result, error, arg) => {
        //result here is the normalized response data after the query runs successfully, transformed data returned by transformResponse
        if (result?.ids) {
          return [
            { type: "Message", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Message", id })),
          ];
        } else {
          return [{ type: "Message", id: "LIST" }];
        }
      },
    }),

    getConversations: builder.query({
      query: () => `/message/dialogues`,
      transformResponse: (responseData) => {
        const loadedConversations = responseData.map((conversation) => {
          conversation.id = conversation._id;
          return conversation;
        });
        return conversationsAdapter.setAll(
          conversationsAdapter.getInitialState(),
          loadedConversations
        );
      },
      providesTags: (result) =>
        result?.ids
          ? [
              { type: "Conversation", id: "LIST" },
              ...result.ids.map((id) => ({ type: "Conversation", id })),
            ]
          : [{ type: "Conversation", id: "LIST" }],
    }),

    deleteConversations: builder.mutation({
      query: (recipientId) => ({
        url: `/message/conversation/${recipientId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, recipientId) => [
        { type: "Conversation", id: "LIST" },
        { type: "Message", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetConversationsQuery,
  useDeleteConversationsMutation,
} = messagesApiSlice;

export const selectMessagesResult =
  messagesApiSlice.endpoints.getMessages.select();

// Creates memoized selector
const selectMessagesData = createSelector(
  selectMessagesResult,
  (messagesResult) => messagesResult.data ?? initialState // Normalized state object
);

// Generate selectors with `messagesAdapter`
export const {
  selectAll: selectAllMessages,
  selectById: selectMessageById,
  selectIds: selectMessageIds,
} = messagesAdapter.getSelectors((state) => selectMessagesData(state));

// Conversations selectors
export const selectConversationsResult =
  messagesApiSlice.endpoints.getConversations.select();

const selectConversationsData = createSelector(
  selectConversationsResult,
  (conversationsResult) =>
    conversationsResult.data ?? conversationsAdapter.getInitialState()
);

export const {
  selectAll: selectAllConversations,
  selectById: selectConversationById,
  selectIds: selectConversationIds,
} = conversationsAdapter.getSelectors((state) =>
  selectConversationsData(state)
);
