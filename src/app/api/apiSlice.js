import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
     baseUrl: 'https://api.trinhdangdang.com', // https://api.trinhdangdang.com
    credentials: 'include',             //ensures that cookies are included in requests
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token //get token from the auth state
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})


//baseQueryWithReauth is a custom baseQuery function that extends fetchBaseQuery 
const baseQueryWithReauth = async (args, api, extraOptions) => {

    let result = await baseQuery(args, api, extraOptions) //attemp the original request baseQuery 

    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {
            // console.log('New Access Token:', refreshResult.data.accessToken);
            api.dispatch(setCredentials({ ...refreshResult.data }))
            result = await baseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired."
            }
            return refreshResult
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Post', 'User'],
    endpoints: builder => ({})
})