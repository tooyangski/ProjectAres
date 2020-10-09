import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import NavigationHeader from "./shared/components/headers/NavigationHeader";
import InformationHeader from "./shared/components/headers/InformationHeader";

import MainStore from "./shared/pages/MainStore";

import Dashboard from "./admin/pages/Dashboard";
import ViewCategories from "./admin/categories/ViewCategories";

import Signup from "./users/Signup";
import Login from "./users/Login";

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { token, login, logout, userId, role } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          {role === 1 && <Dashboard />}
          {role === 0 && <MainStore />}
        </Route>

        <Route path="/categories">
          {role === 1 && <ViewCategories />}
          {/* {role === 0 && <Forbidden />} */}
        </Route>

        <Route path="/products" exact>
          {/* {role === 1 && <ManageProducts />} */}
          {/* {role === 0 && <Forbidden />} */}
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <InformationHeader />
        </Route>

        <Route path="/signup">
          <Signup />
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: token,
        token: token,
        userId: userId,
        role: role,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <NavigationHeader />
        {routes}
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
