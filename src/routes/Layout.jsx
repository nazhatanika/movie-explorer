// Import Outlet for nested routes and Link for navigation
import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <>
      {/* Navigation bar with link to home page */}
      <nav className="navbar">
        <Link to="/" className="nav-link">🏠 Home</Link>
      </nav>

      {/* Outlet renders the child route components */}
      <Outlet />
    </>
  );
}

// Export Layout component for use in routing
export default Layout;