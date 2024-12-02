import { useNavigate, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'

const NOTES_REGEX = /^\/dash\/posts(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
    const {isAdmin } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    // console.log(isSuccess)

    const onNewPostClicked = () => navigate('/dash/posts/new')
    const onNewUserClicked = () => navigate('/dash/users/new')
    const onPostsClicked = () => navigate('/dash/posts')
    const onUsersClicked = () => navigate('/dash/users')
    const onSettingClicked = () => navigate('/dash')
    const onTitleClicked = () => navigate('/dash/about')
    const handleLogout = async () => {
        try {
            const result = await sendLogout();
            console.log("Logout success:", result);  // This should log if logout is successful
            navigate("/")
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    
    

    let newPostButton = null
    if (NOTES_REGEX.test(pathname)) {
        newPostButton = (
            <button
                className="icon-button"
                title="New Post"
                onClick={onNewPostClicked}
            >
                ✍🏽
            </button>
        )
    }

    let newUserButton = null
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <button
                className="icon-button"
                title="New User"
                onClick={onNewUserClicked}
            >
                ➕
            </button>
        )
    }

    let userButton = null
    if (isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <button
                    className="icon-button"
                    title="Users"
                    onClick={onUsersClicked}
                >
                    👥
                </button>
            )
        }
    }

    let postsButton = null
    if (!NOTES_REGEX.test(pathname) && pathname.includes('/dash')) {
        postsButton = (
            <button
                className="icon-button"
                title="Posts"
                onClick={onPostsClicked}
            >
                📝
            </button>
        )
    }

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={handleLogout}
        >
            🔓
        </button>
    )

    
    const settingButton = (
            <button
                className="icon-button"
                title="setting"
                onClick={onSettingClicked}
            >
                ⚙️
            </button>
        )

    const errClass = isError ? "errmsg" : "offscreen"

    let buttonContent
    if (isLoading) {
        buttonContent = <PulseLoader color={"#FFF"} />
    } else {
        buttonContent = (
            <>
                {settingButton}
                {newPostButton}
                {postsButton}
                <h1 className="dash-header__title" onClick={onTitleClicked} title='about Trinh'>Trinh Dang</h1>
                {newUserButton}
                {userButton}
                {logoutButton}
            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <header className="dash-header">
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
            </header>
        </>
    )

    return content
}
export default DashHeader