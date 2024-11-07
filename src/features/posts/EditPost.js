import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetPostsQuery, selectPostById } from './postsApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import EditPostForm from './EditPostForm'

const EditPost = () => {
    const { id } = useParams()

    const { isLoading, isError, error } = useGetPostsQuery(undefined, {
        pollingInterval: 0,                // Disable polling in EditUser
        refetchOnFocus: false,             // Do not refetch when window gains focus
        refetchOnMountOrArgChange: false,  // Do not refetch on mount or argument change
        keepPreviousData: true,            // Retain previous data during any refetch
    })
    const post = useSelector(state => selectPostById(state, id))
    const users = useSelector(selectAllUsers)
    
    if (isLoading && !post) return <p>Loading...</p>

    // Handle error state
    if (isError) return <p className="errmsg">{error?.data?.message || 'Error loading post data'}</p>

    // Render the EditUserForm if the user exists; otherwise, show a message
    return post ? <EditPostForm post={post} users={users}/> : <p>Post not found</p>
}
export default EditPost