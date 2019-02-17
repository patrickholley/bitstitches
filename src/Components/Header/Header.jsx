import React, { Component } from 'react'
import './Header.scss';

class Header extends Component {
  render() {
    return (
      <>
        <header className="header">
          <span className="header-title">BitStitches</span>
        </header>
        {this.props.children}
      </>
    )
  }
}

export default Header;
