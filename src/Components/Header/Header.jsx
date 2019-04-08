import React, { Component } from "react";
import "./Header.scss";

class Header extends Component {
  render() {
    return (
      <>
        <header className="header">
          <span className="header__title">BitStitches</span>
        </header>
        <div className="header__children">{this.props.children}</div>
      </>
    );
  }
}

export default Header;
