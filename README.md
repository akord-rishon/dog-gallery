# Dog Gallery

A simple dog pictures website using React, Express, MongoDB and the Dog CEO API.

## How to run

Requirements: Node.js 22 or newer and a running MongoDB server (local or Atlas).

1. Open the project folder in VS Code.
2. Run `npm install`.
3. Copy `.env.example` to `.env`. For local MongoDB, keep the default URL. For Atlas, replace it with your own connection string.
4. In the first terminal run `npm run server`.
5. In a second terminal run `npm run dev`.
6. Open http://localhost:5173 (or the address printed by Vite).

To use the production build, run `npm run build` and `npm run server`, then open http://localhost:3001.

## Pages

- `/` - random dog images
- `/gallery/:breed` - images by breed and a breed list
- `/favorites` - my favorite images and profile picture selection
- `/users` - all users
- `/users/:user_id` - favorites of a selected user

## Database

`users`: username (unique), profilePicture.

`favorites`: user_id, url. A unique compound index prevents duplicate favorites per user.

Login creates a user if the username does not exist. App state holds the logged-in user, so refreshing the page logs out. There are no passwords or real authentication yet, as requested for this assignment. Do not use this authentication design for a public production site.

Dog API: https://dog.ceo/dog-api/
