import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectPostById } from './postsApiSlice'

const Post = ({ postId }) => {

    const post = useSelector(state => selectPostById(state, postId))

    const navigate = useNavigate()

    if (post) {
        const created = new Date(post.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' , hour: '2-digit', minute: '2-digit'})

        const updated = new Date(post.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' , hour: '2-digit', minute: '2-digit' })

        const handleEdit = () => navigate(`/dash/posts/${postId}`)

        const showUpdated = post.updatedAt && post.updatedAt !== post.createdAt;

        return (
            <div className="post-card">
            <div className="post-header">
                <h2>{post.title}</h2>
                <p className="post-owner">By {post.username}</p>
            </div>
            <div className="post-body">
                <p>{post.text}</p>
            </div>
            <div className="post-footer">
                <p>Created: {created}</p>
                {showUpdated && <p>Updated: {updated}</p>}
                <button className="icon-button" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </div>
        </div>
        )

    } else return null
}
export default Post