import React from "react";

const ErrorNotification = (props) => {
  return (
    <div className="notification is-danger">
      <button className="delete" onClick={props.onClose}></button>
      {props.children}
    </div>
  );
};

export default ErrorNotification;
