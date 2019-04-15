import React from "react";
import "./Header.scss";

export default ({ children }) => (
  <>
    <header className="header">
      <span className="header__title">BitStitches</span>
    </header>
    <div className="header__children">{children}</div>
  </>
);
