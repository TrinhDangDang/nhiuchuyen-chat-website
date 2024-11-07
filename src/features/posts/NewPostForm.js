import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewPostMutation } from "./postsApiSlice"
import useAuth from "../../hooks/useAuth"

const NewPostForm = ({ users }) => {

    const {username} = useAuth();
    // Find the user object based on the username
    const user = users.find(user => user.username === username);
    const userId = user?.id; // Extract userId safely

    const [addNewPost, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewPostMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setText('')
            navigate('/dash/posts')
        }
    }, [isSuccess, navigate])

    const onTitleChanged = (e) => {
        setTitle(e.target.value);
    };
    
    const onTextChanged = e => setText(e.target.value)
     
    
    const canSave = [title, text].every(Boolean) && !isLoading

    const onSavePostClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewPost({user: userId, title, text })
            navigate('/dash/posts')
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form__input--incomplete" : ''
    const validTextClass = !text ? "form__input--incomplete" : ''

    const content = (
        <>  
            <main className="login">
            <h1>New Post</h1>
            <p className={errClass}>{error?.data?.message}</p>
            <form className="form" onSubmit={onSavePostClicked}>
                    
                <label className="form__label" htmlFor="title">
                    Title: </label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label className="form__label" htmlFor="text">
                    Text: </label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />
                <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                           💾
                        </button>
                </div>
            </form>
            </main>
        </>
    )

    return content
}

export default NewPostForm