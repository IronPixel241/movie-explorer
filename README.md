# Movie Explorer

A Next.js application that allows users to browse movies, search for specific ones, and view detailed information. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- User authentication with NextAuth.js
- Browse popular movies
- Search for movies
- View detailed movie information
- Add/remove movies to/from favorites
- Responsive design
- Infinite scrolling
- Loading states and skeletons

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- TMDB API key

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd movie-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:
   ```
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key-here
   ```

   Replace `your-secret-key-here` with a random string for session encryption.
   Replace `your-tmdb-api-key-here` with your TMDB API key from [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Account

For testing purposes, you can use the following demo account:
- Email: demo@example.com
- Password: password

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- NextAuth.js
- React Query
- TMDB API
- Axios

## Project Structure

```
movie-explorer/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── signin/
│   │   │       └── page.tsx
│   │   ├── favorites/
│   │   │   └── page.tsx
│   │   ├── movie/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── MovieCard.tsx
│   ├── services/
│   │   └── tmdb.ts
│   └── types/
│       ├── auth.ts
│       └── movie.ts
├── .env.local
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
