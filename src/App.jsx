// Import React hooks
import { useState, useEffect } from 'react'
// Import global styles
import './App.css'
// Load API key from environment variables
const API_KEY = import.meta.env.VITE_APP_API_KEY;
// Import routing and chart libraries
import { Link } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";

function App() {
  // State for movie list, search input, language filter, loading and error handling
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies when component mounts
  useEffect(() => {
    const ac = new AbortController();
    const fetchAllMovieData = async () => {
      try {
        setLoading(true);
        setError(null);
        const randomPage = Math.floor(Math.random() * 100) + 1;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${randomPage}`,
          { signal: ac.signal }
        );
        if (!response.ok) throw new Error(`TMDB error ${response.status}`);
        const data = await response.json();
        setList(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log("error fetching movie data", err);
          setError("Could not load movies. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAllMovieData();
    return () => ac.abort();
  }, []);

  // Calculate total movies and average rating
  const totalMovies = list.length;
  const averageRatings = list.length
    ? (list.reduce((acc, movie) => acc + (Number(movie.vote_average) || 0), 0) / list.length).toFixed(1)
    : 0;

  // Find newest release year safely
  const years = list
    .map((m) => (m && m.release_date ? Number(m.release_date.slice(0, 4)) : null))
    .filter((y) => Number.isFinite(y));
  const newestYear = years.length ? Math.max(...years) : "-";

  // Apply search and language filters
  const filteredList = list.filter((movie) => {
    const title = (movie.title || "").toLowerCase();
    const matchedSearch = title.includes(searchTerm.toLowerCase());
    const matchesLang = languageFilter === "all" || movie.original_language === languageFilter;
    return matchedSearch && matchesLang;
  });

  // Count number of movies per language
  const languageCounts = {};
  filteredList.forEach((movie) => {
    const lang = movie.original_language || "unknown";
    if (languageCounts[lang]) {
      languageCounts[lang]++;
    } else {
      languageCounts[lang] = 1;
    }
  });

  // Prepare bar chart data
  const languageData = Object.keys(languageCounts).map((lang) => ({
    language: lang,
    count: languageCounts[lang],
  }));

  // Calculate average ratings per language
  const ratingSums = {};
  const ratingCounts = {};
  filteredList.forEach((movie) => {
    const lang = movie.original_language || "unknown";
    const rating = Number(movie.vote_average) || 0;
    if (ratingSums[lang]) {
      ratingSums[lang] += rating;
      ratingCounts[lang] += 1;
    } else {
      ratingSums[lang] = rating;
      ratingCounts[lang] = 1;
    }
  });

  // Prepare pie chart data
  const ratingData = Object.keys(ratingSums).map((lang) => ({
    language: lang,
    average: Number((ratingSums[lang] / ratingCounts[lang]).toFixed(1)),
  }));

  return (
    <div className="app-container">
      {/* Application title */}
      <h1 className="app-title">🎬 Movie Explorer</h1>

      {/* Controls: stats, search bar, and language filter */}
      <div className="controls">
        <div className="stats-bar">
          <p>Total Movies: {totalMovies}</p>
          <p>Average Ratings: {averageRatings}</p>
          <p>Newest Release Year: {newestYear}</p>
        </div>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
          <option value="all">All languages</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      {/* Charts overview */}
      <h2 className="chart-title">Charts Overview</h2>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          {/* Bar chart for movie counts by language */}
          <div className="chart-row">
            <div className="chart-container">
              <h3 className="chart-subtitle">Number of Movies by Language</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={languageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="language" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart for average ratings by language */}
            <div className="chart-container">
              <h3 className="chart-subtitle">Average Ratings by Language</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingData}
                    dataKey="average"
                    nameKey="language"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {ratingData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#ff6f61", "#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#a4de6c"][index % 6]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Movie list */}
          <div className="movie-list">
            {filteredList.length === 0 ? (
              <p>No movies match your search.</p>
            ) : (
              filteredList.map((movie) => {
                const imgUrl = movie.poster_path
                  ? "https://media.themoviedb.org/t/p/w440_and_h660_face/" + movie.poster_path
                  : "https://via.placeholder.com/440x660?text=No+Image";
                return (
                  <Link key={movie.id} to={`/movieDetails/${movie.id}`} className="movie-link">
                    <div className="movie-card">
                      <img src={imgUrl} alt={movie.title || "Movie poster"} loading="lazy" />
                      <h2>{movie.title}</h2>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App
