import {Link} from 'react-router-dom';
// import { useEffect} from 'react';

const Nav = () => {

    return (
        <>
        <nav className="Nav">
            <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
                {/* <label htmlFor="search">Search Posts</label> */}
                {/* <input
                    id="search"
                    type="text"
                    placeholder="Search Posts"
                    value={}
                    onChange={(e) => setSearch(e.target.value)}
                /> */}
            </form>
            <h1 className="dash-header__title">TD</h1>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/bulletin">Bullettin</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
        </nav>
        </>
    )
}

export default Nav