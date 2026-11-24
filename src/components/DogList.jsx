import DogCard from './DogCard.jsx'

function DogList({ images, favorites, toggleFavorite, makeProfilePicture }) {
    return (
        <div className="dog-list">
            {images.map(url => <DogCard key={url} url={url} liked={favorites.includes(url)} toggleFavorite={toggleFavorite} makeProfilePicture={makeProfilePicture} />)}
        </div>
    )
}

export default DogList
