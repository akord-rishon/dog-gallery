import { useState } from 'react'

function DogCard({ url, liked, toggleFavorite, makeProfilePicture }) {
    const [busy, setBusy] = useState(false)

    async function run(action) {
        setBusy(true)
        try { await action(url) }
        catch (err) { alert(err.message) }
        finally { setBusy(false) }
    }

    return (
        <div className="dog-card">
            <img src={url} alt="Dog" loading="lazy" />
            <button disabled={busy} onClick={() => run(toggleFavorite)}>{liked ? '♥ Unlike' : '♡ Like'}</button>
            {makeProfilePicture && <button disabled={busy} onClick={() => run(makeProfilePicture)}>Make profile picture</button>}
        </div>
    )
}

export default DogCard
