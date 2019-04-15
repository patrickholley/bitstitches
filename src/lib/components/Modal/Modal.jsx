import React from "react";
import "./Modal.scss";

export default ({ children, className }) => (
  <div className="modal__wrapper">
    <div className={`modal ${className}`}>{children}</div>
  </div>
);
