import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'

const Welcome = () => {

    const { username, isAdmin } = useAuth()

    useTitle(`${username}`)


    const [time, setTime] = useState(new Date())
    useEffect(() => {
        // Update the time every second
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    const formattedTime = new Intl.DateTimeFormat('en-US',
        {
            hour: 'numeric',
            minute:'numeric',
            second: 'numeric',
            hour12: true
        }
    ).format(time)

    const content = (
        <section className="welcome">

            <h1 style={{textAlign: "center"}}>Welcome {username}!</h1>

            <p><Link to="/dash/posts">All Posts 👀</Link></p>

            <p><Link to="/dash/posts/new">Add New Post ➕</Link></p>

            <p><Link to="/dash/chat">Chat with other users 🐧💬🐧</Link></p>

            {(isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}

            {(isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}
            <div className='digital-clock'>{formattedTime}</div>

        </section>
    )

    return content
}
export default Welcome