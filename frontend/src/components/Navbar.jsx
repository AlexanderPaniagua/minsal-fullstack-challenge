import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand navbar-dark bg-primary">
      <div className="container">
        <span className="navbar-brand fw-bold">MINSAL Recetas</span>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              className={`nav-link ${location.pathname === '/crear' ? 'active' : ''}`}
              to="/crear"
            >
              Crear Receta
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${location.pathname === '/listar' ? 'active' : ''}`}
              to="/listar"
            >
              Listar Recetas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
