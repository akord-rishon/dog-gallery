import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DogList from '../components/DogList.jsx'
import { request } from '../api.js'

function Home({ favorites, toggleFavorite }) {
    const [images, setImages] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    async function loadImages() {
        setLoading(true)
        setError('')
        try {
            const data = await request('https://dog.ceo/api/breeds/image/random/8')
            setImages([...new Set(data.message)])
        } catch (err) { setError(err.message) }
        finally { setLoading(false) }
    }

    useEffect(() => { loadImages() }, [])

    return (
        <>
            <h1>Welcome to Dog Gallery</h1>
            <p>Find dogs you like and save your favorite pictures.</p>
            <p><Link to="/gallery/labrador">Browse breeds</Link></p>
            <button onClick={loadImages} disabled={loading}>More dogs</button>
            {error && <p>{error}</p>}
            {loading ? <p>Loading...</p> : <DogList images={images} favorites={favorites} toggleFavorite={toggleFavorite} />}
        </>
    )
}

export default Home
