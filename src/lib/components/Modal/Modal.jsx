import React from "react";
import "./Modal.scss";

export default ({ children, className }) => (
  <div
    className="modal__wrapper"
    onClick={() => {
      console.log("!");
    }}
  >
    <div
      className={`modal ${className}`}
      onClick={e => {
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  </div>
);
