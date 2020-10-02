import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

const App = () => {
  return (
    <div className="container">
      <div className="notification is-primary">
        This container is <strong>centered</strong> on desktop and larger
        viewports.
      </div>
    </div>
  );
};

export default App;
