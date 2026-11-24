import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

function Navbar({ user, login, logout }) {
    const location = useLocation()
    const [username, setUsername] = useState('')
    const [busy, setBusy] = useState(false)

    async function handleLogin(event) {
        event.preventDefault()
        setBusy(true)
        try {
            await login(username)
            setUsername('')
        } catch (err) { alert(err.message) }
        finally { setBusy(false) }
    }

    return (
        <nav>
            <div className="links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/gallery/labrador" className={() => location.pathname.startsWith("/gallery/") ? "active" : ""}>Gallery</NavLink>
                <NavLink to="/favorites">Favorites</NavLink>
                <NavLink to="/users">Users</NavLink>
            </div>
            {user ? (
                <div className="login">
                    {user.profilePicture && <img className="avatar" src={user.profilePicture} alt="Profile" />}
                    <span>Hello, {user.username}</span>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <form className="login" onSubmit={handleLogin}>
                    <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required maxLength={50} />
                    <button disabled={busy}>Login</button>
                </form>
            )}
        </nav>
    )
}

export default Navbar
