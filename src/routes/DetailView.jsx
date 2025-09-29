// Import the MovieDetail component to display individual movie details
import MovieDetail from "../components/MovieDetail"

// Component that serves as the detail view page
function DetailView() {
    return(
        <div>
            {/* Render the MovieDetail component */}
            <MovieDetail/>
        </div>
    )
}

// Export the DetailView component so it can be used in routing
export default DetailView