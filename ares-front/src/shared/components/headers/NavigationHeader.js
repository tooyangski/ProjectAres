import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

const MainNavigation = () => {
  const auth = useContext(AuthContext);

  return (
    <nav
      className="navbar is-info"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-menu is-active">
        <div className="navbar-end">
          <Link className="navbar-item" to="/">
            HOMEPAGE
          </Link>

          <Link className="navbar-item" to="/">
            CONTACT US
          </Link>

          {auth.isLoggedIn && auth.role === 1 && (
            <div className="navbar-item has-dropdown is-hoverable">
              <span className="navbar-link">MANAGE</span>
              <div className="navbar-dropdown">
                <Link className="navbar-item" to="/categories">
                  CATEGORIES
                </Link>

                <Link className="navbar-item" to="/">
                  PRODUCTS
                </Link>

                <hr className="navbar-divider" />

                <Link className="navbar-item" to="/">
                  REPORT AN ISSUE?
                </Link>
              </div>
            </div>
          )}

          {auth.isLoggedIn && auth.role === 0 && (
            <div className="navbar-item has-dropdown is-hoverable">
              <span className="navbar-link">MY ACCOUNT</span>
              <div className="navbar-dropdown">
                <Link className="navbar-item" to="/">
                  MY PROFILE
                </Link>

                <Link className="navbar-item" to="/">
                  MY SHOPPING CART
                </Link>

                <hr className="navbar-divider" />

                <Link className="navbar-item" to="/">
                  REPORT AN ISSUE?
                </Link>
              </div>
            </div>
          )}

          <div className="navbar-item">
            <div className="buttons">
              {!auth.isLoggedIn && (
                <Link to="/signup">
                  <button className="button is-black">SIGN-UP</button>
                </Link>
              )}

              {!auth.isLoggedIn && (
                <Link to="/login">
                  <button className="button is-light">LOG-IN</button>
                </Link>
              )}

              {auth.isLoggedIn && (
                <button className="button is-light" onClick={auth.logout}>
                  LOG-OUT
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
