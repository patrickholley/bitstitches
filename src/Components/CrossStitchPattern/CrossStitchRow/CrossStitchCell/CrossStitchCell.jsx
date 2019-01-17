import React, { Component } from 'react';
import "./CrossStitchCell.scss";

class CrossStitchCell extends Component {
  render() {
    const { columns, rows } = this.props;
    return (
      <div className="cross-stitch__cell" />
    )
  }
}

export default CrossStitchCell;
