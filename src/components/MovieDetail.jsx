// Import React hooks
import { useEffect, useState } from "react";
// Import router hook for accessing URL parameters
import { useParams } from "react-router-dom";

// Load API key from environment variables
const API_KEY = import.meta.env.VITE_APP_API_KEY;

function MovieDetail() {
  // Get movie ID from route parameters
  const { id } = useParams();

  // State for movie data, loading, and error handling
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movie details when component mounts or ID changes
  useEffect(() => {
    const ac = new AbortController();

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
          { signal: ac.signal }
        );
        if (!res.ok) throw new Error(`TMDB error ${res.status}`);
        const data = await res.json();
        setMovie(data);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Error fetching movie details:", e);
          setError("Could not load movie details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    return () => ac.abort();
  }, [id]);

  // Display messages for loading, error, or empty state
  if (loading) return <p className="status-message loading">Loading…</p>;
  if (error) return <p className="status-message error">{error}</p>;
  if (!movie) return <p className="status-message empty">No movie found.</p>;

  // Build poster image URL or fallback to placeholder
  const imgUrl = movie.poster_path
    ? `https://media.themoviedb.org/t/p/w440_and_h660_face/${movie.poster_path}`
    : "https://via.placeholder.com/440x660?text=No+Image";

  return (
    <div className="app-container">
      <div className="movie-detail-card">
        {/* Movie poster */}
        <img src={imgUrl} alt={movie.title || "Movie poster"} loading="lazy" />

        {/* Movie information */}
        <div className="movie-detail-info">
          <h2>{movie.title || "Untitled"}</h2>
          <p>
            <strong>Release Date:</strong> {movie.release_date || "N/A"}
          </p>
          <p>
            <strong>Rating:</strong>{" "}
            {Number.isFinite(movie.vote_average) ? movie.vote_average : "N/A"}
          </p>
          <p>
            <strong>Language:</strong> {movie.original_language || "N/A"}
          </p>
          <p>
            <strong>Overview:</strong> {movie.overview || "No overview available."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;