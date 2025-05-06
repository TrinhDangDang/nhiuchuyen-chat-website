// avatarApiSlice.js
import { apiSlice } from "./apiSlice";

export const avatarApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateAvatar: builder.mutation({
      query: (prompt) => ({
        url: "/avatar/generate",
        method: "POST",
        body: { prompt },
      }),
    }),
    saveAvatar: builder.mutation({
      query: ({ imageUrl, newUserName, newFullName }) => ({
        url: "/avatar/save",
        method: "POST",
        body: { imageUrl, newUserName, newFullName },
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useGenerateAvatarMutation, useSaveAvatarMutation } =
  avatarApiSlice;
