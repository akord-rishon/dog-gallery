import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { request } from '../api.js'
import DogList from '../components/DogList.jsx'

function UserGallery({ favorites, toggleFavorite }) {
    const { user_id } = useParams()
    const [owner, setOwner] = useState(null)
    const [images, setImages] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true
        setLoading(true)
        setError('')
        setOwner(null)
        setImages([])
        Promise.all([request(`/api/users/${user_id}`), request(`/api/users/${user_id}/favorites`)])
            .then(([user, items]) => {
                if (active) {
                    setOwner(user)
                    setImages(items.map(item => item.url))
                }
            })
            .catch(err => { if (active) setError(err.message) })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [user_id, favorites])

    return (
        <>
            <h1>{owner ? owner.username + "'s favorites" : 'User favorites'}</h1>
            {error && <p>{error}</p>}
            {loading ? <p>Loading...</p> : <>
                {!error && images.length === 0 && <p>No favorite pictures yet.</p>}
                <DogList images={images} favorites={favorites} toggleFavorite={toggleFavorite} />
            </>}
        </>
    )
}

export default UserGallery
