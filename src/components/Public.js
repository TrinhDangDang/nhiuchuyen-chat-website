// import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import Nav from './Nav'


const Public = () => {
    const content = (
        <div className='page-container'>
            <Nav/>
            <Outlet/>
        </div>

    )
    return content
}
export default Public