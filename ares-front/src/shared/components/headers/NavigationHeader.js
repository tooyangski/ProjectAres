import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

const MainNavigation = () => {
  const auth = useContext(AuthContext);

  return (
    <section className="hero is-info is-medium is-bold">
      <div className="hero-head">
        <nav className="navbar">
          <div className="container">
            <div id="navbarMenu" className="navbar-menu is-active">
              <div className="navbar-end">
                <div className="tabs is-right">
                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                    </li>

                    <li>
                      <Link to="/">About us</Link>
                    </li>

                    {auth.isLoggedIn && (
                      <React.Fragment>
                        <li>
                          <Link to="/">My Profile</Link>
                        </li>

                        <li>
                          <Link to="/">My Cart</Link>
                        </li>

                        <hr className="navbar-divider" />
                      </React.Fragment>
                    )}

                    {!auth.isLoggedIn && (
                      <li>
                        <Link to="/signup">Sign up</Link>
                      </li>
                    )}

                    {!auth.isLoggedIn && (
                      <li>
                        <Link to="/login">Log in</Link>
                      </li>
                    )}

                    {auth.isLoggedIn && (
                      <li>
                        <span></span>
                        <button
                          className="button is-white is-outlined"
                          onClick={auth.logout}
                        >
                          Log out
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
};

export default MainNavigation;
