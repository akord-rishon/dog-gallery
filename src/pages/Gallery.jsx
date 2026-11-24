import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { request } from '../api.js'
import DogList from '../components/DogList.jsx'

function Gallery({ favorites, toggleFavorite }) {
    const { breed } = useParams()
    const [breeds, setBreeds] = useState([])
    const [images, setImages] = useState([])
    const [error, setError] = useState('')
    const [breedError, setBreedError] = useState('')
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(24)

    useEffect(() => {
        request('https://dog.ceo/api/breeds/list/all')
            .then(data => setBreeds(Object.keys(data.message)))
            .catch(err => setBreedError(err.message))
    }, [])

    useEffect(() => {
        let active = true
        setLoading(true)
        setImages([])
        setError('')
        setLimit(24)
        request(`https://dog.ceo/api/breed/${encodeURIComponent(breed)}/images`)
            .then(data => { if (active) setImages([...new Set(data.message)]) })
            .catch(err => { if (active) setError(err.message) })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [breed])

    return (
        <div className="gallery-layout">
            <aside>
                <h3>Breeds</h3>
                {breedError && <p>{breedError}</p>}
                {breeds.map(name => <NavLink key={name} to={`/gallery/${name}`}>{name}</NavLink>)}
            </aside>
            <section className="gallery-content">
                <h1>{breed}</h1>
                {error && <p>{error}</p>}
                {loading ? <p>Loading...</p> : <DogList images={images.slice(0, limit)} favorites={favorites} toggleFavorite={toggleFavorite} />}
                {limit < images.length && <button onClick={() => setLimit(limit + 24)}>Show more</button>}
            </section>
        </div>
    )
}

export default Gallery
