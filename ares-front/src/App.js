import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import NavigationHeader from "./shared/components/headers/NavigationHeader";
import InformationHeader from "./shared/components/headers/InformationHeader";

import Signup from "./users/Signup";
import Login from "./users/Login";

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact></Route>
        <Route path="/about" exact>
          <div>ABOUT PAGE</div>
        </Route>
        <Route path="/contact" exact>
          <div>CONTACT PAGE</div>
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
        <Route path="/about" exact>
          <div>ABOUT PAGE</div>
        </Route>
        <Route path="/contact" exact>
          <div>CONTACT PAGE</div>
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
