import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Gallery from './pages/Gallery.jsx'
import Favorites from './pages/Favorites.jsx'
import Users from './pages/Users.jsx'
import UserGallery from './pages/UserGallery.jsx'
import { request } from './api.js'

function App() {
    const [user, setUser] = useState(null)
    const [favorites, setFavorites] = useState([])

    async function login(username) {
        const newUser = await request('/api/login', 'POST', { username })
        const images = await request(`/api/users/${newUser._id}/favorites`)
        setFavorites(images.map(item => item.url))
        setUser(newUser)
    }

    function logout() {
        setUser(null)
        setFavorites([])
    }

    async function toggleFavorite(url) {
        if (!user) return alert('Please log in first')
        const liked = favorites.includes(url)
        await request('/api/favorites', liked ? 'DELETE' : 'POST', { user_id: user._id, url })
        setFavorites(old => liked ? old.filter(item => item !== url) : [...new Set([...old, url])])
    }

    async function makeProfilePicture(url) {
        const updated = await request(`/api/users/${user._id}/profile`, 'PATCH', { url })
        setUser(updated)
    }

    return (
        <>
            <Navbar user={user} login={login} logout={logout} />
            <main>
                <Routes>
                    <Route path="/" element={<Home favorites={favorites} toggleFavorite={toggleFavorite} />} />
                    <Route path="/gallery/:breed" element={<Gallery favorites={favorites} toggleFavorite={toggleFavorite} />} />
                    <Route path="/favorites" element={<Favorites user={user} favorites={favorites} toggleFavorite={toggleFavorite} makeProfilePicture={makeProfilePicture} />} />
                    <Route path="/users" element={<Users user={user} />} />
                    <Route path="/users/:user_id" element={<UserGallery favorites={favorites} toggleFavorite={toggleFavorite} />} />
                    <Route path="*" element={<h2>Page not found</h2>} />
                </Routes>
            </main>
        </>
    )
}

export default App
