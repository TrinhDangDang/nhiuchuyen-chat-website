import { useGetPostsQuery } from "./postsApiSlice"
import Post from "./Post"

const PostsList = () => {
    const {
        data: posts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery(undefined, {
        pollingInterval: 15000, //useGetPostsQuery every 15 seconds
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = posts

        const postsListContent = ids?.length
            ? ids.map(postId => <Post key={postId} postId={postId} />)
            : null

        content = (
            <div className="posts-list">
                {postsListContent}
            </div>
        )
    }

    return content
}
export default PostsList