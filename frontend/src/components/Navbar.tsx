import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark gothic-nav shadow w-100">
      <div className="container">
        <Link className="navbar-brand fw-bold text-danger d-flex align-items-center gap-2" to="/">
          <img src={logo} alt="Cursed Compass Logo" style={{ height: '2rem' }} />
          Cursed Compass
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/explore">
                Explore
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/by-state">
                By State
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/cryptid-hotspots">
                Cryptid Hotspots
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/haunted-hotels">
                Haunted Hotels
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-warning fw-semibold" to="/hotels/jerome-grand">
                🏨 Book Hotels
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
