import React, { Component } from 'react';
import "./CrossStitchCell.scss";

class CrossStitchCell extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className="cross-stitch__cell" style={{ backgroundColor: `rgb(${data[0]}, ${data[1]}, ${data[2]})`}} />
    )
  }
}

export default CrossStitchCell;
