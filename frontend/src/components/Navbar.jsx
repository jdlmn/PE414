import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>Dog Breed Explorer 🐾</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/breeds">Breeds</Link>
      </div>
    </nav>
  );
}
