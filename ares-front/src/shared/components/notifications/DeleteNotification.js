import React from "react";

const DeleteNotification = (props) => {
  return (
    <div className="notification is-danger">
      <button className="delete">CONFIRM</button>
      <button className="delete">CANCEL</button>
      {props.children}
    </div>
  );
};

export default DeleteNotification;
