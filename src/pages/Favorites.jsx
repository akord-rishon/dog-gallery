import DogList from '../components/DogList.jsx'

function Favorites({ user, favorites, toggleFavorite, makeProfilePicture }) {
    if (!user) return <p>Please log in to see your favorites.</p>
    return (
        <>
            <h1>My favorites</h1>
            {favorites.length === 0 && <p>No favorite pictures yet.</p>}
            <DogList images={favorites} favorites={favorites} toggleFavorite={toggleFavorite} makeProfilePicture={makeProfilePicture} />
        </>
    )
}

export default Favorites
