import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'

const DashLayout = () => {
    return (
        <>
            <div className='page-container'>
            <DashHeader />
            <div className="dash-container">
                <Outlet />
            </div>
            <DashFooter />
            </div>
        </>
    )
}
export default DashLayout