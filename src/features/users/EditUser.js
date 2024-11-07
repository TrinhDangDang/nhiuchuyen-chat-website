import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetUsersQuery, selectUserById } from './usersApiSlice'
import EditUserForm from './EditUserForm'

const EditUser = () => {
    const { id } = useParams()

    // Initiate the query to maintain an active subscription without unnecessary refetching
    const { isLoading, isError, error } = useGetUsersQuery(undefined, {
        pollingInterval: 0,                // Disable polling in EditUser
        refetchOnFocus: false,             // Do not refetch when window gains focus
        refetchOnMountOrArgChange: false,  // Do not refetch on mount or argument change
        keepPreviousData: true,            // Retain previous data during any refetch
    })

    // Select the specific user from the Redux store using the 'id' parameter
    const user = useSelector(state => selectUserById(state, id))

    // Handle loading state only during the initial fetch
    if (isLoading && !user) return <p>Loading...</p>

    // Handle error state
    if (isError) return <p className="errmsg">{error?.data?.message || 'Error loading user data'}</p>

    // Render the EditUserForm if the user exists; otherwise, show a message
    return user ? <EditUserForm user={user} /> : <p>User not found</p>
}

export default EditUser
