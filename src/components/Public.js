// import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import Nav from './Nav'


const Public = () => {
    const content = (
        <section className="public">
            <Nav/>
            <Outlet/>
        </section>

    )
    return content
}
export default Public