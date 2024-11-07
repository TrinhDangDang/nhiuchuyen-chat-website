
import { useNavigate, useLocation } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectPostById } from './postsApiSlice';
import useAuth from '../../hooks/useAuth';

const Post = ({ postId }) => {
    const NOTES_REGEX = /^\/dash\/posts(\/)?$/;
    const { pathname } = useLocation();

    const post = useSelector(state => selectPostById(state, postId));
    const navigate = useNavigate();

    const { userId, isAdmin } = useAuth(); // Retrieve current user's ID and admin status

    if (post) {
        const created = new Date(post.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
        const updated = new Date(post.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

        const handleEdit = () => navigate(`/dash/posts/${postId}`);
        const showUpdated = post.updatedAt && post.updatedAt !== post.createdAt;

        // Authorization check: allow editing if user is the creator or is an admin
        const canEdit = isAdmin || post.user === userId;

        let editPostIcon = null;
        if (NOTES_REGEX.test(pathname) && canEdit) {
            editPostIcon = (
                <button className="icon-button" onClick={handleEdit} title='edit'>
                    ✍🏽
                </button>
            );
        }

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
                    {editPostIcon}
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default Post;
