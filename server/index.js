import express from 'express'
import mongoose from 'mongoose'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
app.use(express.json())

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: '' }
})

const favoriteSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true }
})
favoriteSchema.index({ user_id: 1, url: 1 }, { unique: true })

const User = mongoose.model('User', userSchema, 'users')
const Favorite = mongoose.model('Favorite', favoriteSchema, 'favorites')

function validImage(url) {
    return typeof url === 'string' && /^https:\/\/images\.dog\.ceo\/breeds\//.test(url)
}

// Login or create a new user
app.post('/api/login', async (req, res, next) => {
    try {
        const username = typeof req.body.username === 'string' ? req.body.username.trim() : ''
        if (!username || username.length > 50) return res.status(400).json({ error: 'Enter a username (1-50 characters)' })
        const user = await User.findOneAndUpdate({ username }, { $setOnInsert: { username } }, { upsert: true, new: true })
        res.json(user)
    } catch (err) { next(err) }
})

app.get('/api/users', async (req, res, next) => {
    try { res.json(await User.find().sort({ username: 1 })) }
    catch (err) { next(err) }
})

app.get('/api/users/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.json(user)
    } catch (err) { next(err) }
})

app.get('/api/users/:id/favorites', async (req, res, next) => {
    try { res.json(await Favorite.find({ user_id: req.params.id })) }
    catch (err) { next(err) }
})

app.post('/api/favorites', async (req, res, next) => {
    try {
        const { user_id, url } = req.body
        if (!validImage(url)) return res.status(400).json({ error: 'Invalid image' })
        if (!mongoose.isValidObjectId(user_id) || !await User.exists({ _id: user_id })) {
            return res.status(404).json({ error: 'User not found' })
        }
        const favorite = await Favorite.findOneAndUpdate({ user_id, url }, { $setOnInsert: { user_id, url } }, { upsert: true, new: true })
        res.json(favorite)
    } catch (err) { next(err) }
})

app.delete('/api/favorites', async (req, res, next) => {
    try {
        const { user_id, url } = req.body
        if (!mongoose.isValidObjectId(user_id) || !validImage(url)) return res.status(400).json({ error: 'Invalid favorite' })
        await Favorite.deleteOne({ user_id, url })
        res.json({ success: true })
    } catch (err) { next(err) }
})

app.patch('/api/users/:id/profile', async (req, res, next) => {
    try {
        const { url } = req.body
        if (!validImage(url) || !await Favorite.exists({ user_id: req.params.id, url })) {
            return res.status(400).json({ error: 'Choose one of your favorites' })
        }
        const user = await User.findByIdAndUpdate(req.params.id, { profilePicture: url }, { new: true })
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.json(user)
    } catch (err) { next(err) }
})

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }))
const dist = fileURLToPath(new URL('../dist/', import.meta.url))
app.use(express.static(dist))
app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')))

app.use((err, req, res, next) => {
    console.error(err.message)
    const status = err.name === 'CastError' ? 400 : 500
    res.status(status).json({ error: status === 400 ? 'Invalid ID' : 'Server error' })
})

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dog_gallery'
mongoose.connect(uri).then(async () => {
    await User.init()
    await Favorite.init()
    app.listen(3001, () => console.log('Server running on http://localhost:3001'))
}).catch(err => console.error('MongoDB connection failed:', err.message))
