# Spotify Saved Song Exporter

A modern React web application that exports your Spotify saved tracks ("Liked Songs") into **CSV** or **JSON** format. You can use it to archive your library, analyze your listening history, or import your tracks into other music services.

## Features

- 🎵 **Fetch Saved Tracks**: Retrieves all tracks saved in your Spotify library using the Spotify Web API.
- 📁 **Export Formats**: Export your saved tracks list with full track, artist, album, and release date details in **CSV** or **JSON** formats.
- ⚡ **Local Caching**: Uses IndexedDB for client-side caching to reduce unnecessary API calls and ensure quick load times.
- 🔑 **Standard OAuth 2.0 Flow**: Implements Spotify Authorization Code Flow with Client ID and Client Secret authentication.

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- A Spotify Developer account

### 1. Register Spotify Developer App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Click **Create an App**.
3. Set **Redirect URI** to `http://127.0.0.1:3000/` (or `http://localhost:3000/`).
4. Save your **Client ID** and **Client Secret**.

### 2. Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/malialp/spotify-export-saved.git
   cd spotify-export-saved
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_CLIENT_ID=your-spotify-client-id
   VITE_CLIENT_SECRET=your-spotify-client-secret
   VITE_REDIRECT_URI=http://127.0.0.1:3000/
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://127.0.0.1:3000/` and log in with your Spotify account.

## Built With

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
