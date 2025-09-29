# Movie Explorer

Movie Explorer is am application that lets you explore popular movies using the [TMDB API](https://developers.themoviedb.org/3). It provides search, language filtering, and interactive charts to visualize movies by language and average ratings.

---

## Features

- **Search** movies by title  
- **Filter** movies by language (English, Spanish, French, Japanese, etc.)  
- **Bar chart** showing number of movies by language  
- **Pie chart** showing average ratings by language  
- Display **total movies, average ratings, and newest release year**  
- Individual **movie detail pages** with poster, release date, rating, language, and overview  

---

## Demo
_Adding GIF here_

---

## Tech Stack

- [React](https://react.dev/) with [Vite](https://vitejs.dev/)  
- [React Router](https://reactrouter.com/) for navigation  
- [Recharts](https://recharts.org/en-US/) for data visualization  
- [TMDB API](https://developers.themoviedb.org/3) for movie data  

---

## Setup

## Prerequisites
- [Node.js](https://nodejs.org/)
- You will also need a [TMDB API key](https://developer.themoviedb.org/docs/getting-started) to fetch movie data.

1. **Clone the repository**
   ```bash
  git clone https://github.com/nazhatanika/movie-explorer.git
  cd movie-explorer
  ```

2. **Install dependencies**
  npm install

3. **Set up environment variables**
  Copy .env.example to .env
  Add your TMDB API key

4. **Run the development server**
  npm run dev

## Future Improvements

1. Add ability to favorite movies

2. Pagination for browsing more movies

4. Sorting by popularity, rating, or release year

5. Dark/light mode toggle