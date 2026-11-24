import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { request } from '../api.js'

function Users({ user }) {
    const [users, setUsers] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        request('/api/users').then(setUsers).catch(err => setError(err.message)).finally(() => setLoading(false))
    }, [user])

    return (
        <>
            <h1>Users</h1>
            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
            {!loading && !error && users.length === 0 && <p>No users yet.</p>}
            {users.map(user => (
                <Link className="user-row" key={user._id} to={`/users/${user._id}`}>
                    {user.profilePicture ? <img className="avatar" src={user.profilePicture} alt="Profile" /> : <span className="avatar placeholder">{user.username[0].toUpperCase()}</span>}
                    {user.username}
                </Link>
            ))}
        </>
    )
}

export default Users
