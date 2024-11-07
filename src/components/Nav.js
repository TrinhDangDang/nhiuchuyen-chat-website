import {useNavigate} from 'react-router-dom';
// import { useEffect} from 'react';

const Nav = () => {
    const navigate = useNavigate();
    const onHomeClicked = () => navigate("/")
    const onPostsClicked = () => navigate("/bulletin")
    const onLoginClicked = () => navigate("/login")
    return (
        <>
        <nav className="Nav">
            <h1 className="dash-header__title" title='About Trinh' onClick={onHomeClicked}>Trinh Dang</h1>
            <ul>
                <li onClick={onHomeClicked}>About</li>
                <li onClick={onPostsClicked} title='posts'>Bulletin</li>
                <li onClick={onLoginClicked}>Login</li>
            </ul>
        </nav>
        </>
    )
}

export default Nav