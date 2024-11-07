import { useState, useEffect } from "react"
import { useUpdatePostMutation, useDeletePostMutation } from "./postsApiSlice"
import { useNavigate } from "react-router-dom"

const EditPostForm = ({ post, users }) => {

    const [updatePost, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdatePostMutation()

    const [deletePost, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeletePostMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(post.title)
    const [text, setText] = useState(post.text)

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            navigate('/dash/posts')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)

    const canSave = [title, text].every(Boolean) && !isLoading

    const onSavePostClicked = async (e) => {
        if (canSave) {
            await updatePost({ id: post.id, title, text })
            navigate('/dash/posts')
        }
    }

    const onDeletePostClicked = async () => {
        await deletePost({ id: post.id })
        navigate('/dash/posts')
    }

    const created = new Date(post.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(post.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })



    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form__input--incomplete" : ''
    const validTextClass = !text ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
        <main className="login">
            <h1>Edit Post #{post.ticket}</h1>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <label className="form__label" htmlFor="post-title">
                    Title:</label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="post-title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form__label" htmlFor="post-text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="post-text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSavePostClicked}
                            disabled={!canSave}
                        >
                            💾
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeletePostClicked}
                        >
                            🗑️
                        </button>
                    </div>
            </form>
            </main>
        </>
    )

    return content
}

export default EditPostForm