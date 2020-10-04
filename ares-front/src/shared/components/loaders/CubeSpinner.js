import React from "react";

import "./CubeSpinner.css";

const CubeSpinner = (props) => {
  return (
    <div className="loader-wrapper is-active">
      <div className="loader is-loading"></div>
    </div>
  );
};

export default CubeSpinner;
