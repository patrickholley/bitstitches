import React, { Component } from 'react'
import CrossStitchRow from './CrossStitchRow';
import './CrossStitchPattern.scss';

class CrossStitchPattern extends Component {
  getRows = () => {
    const { columnCount, rowCount } = this.props;
    const rows = [];

    for (let i = 0; i < rowCount; i++) {
      rows.push(<CrossStitchRow columnCount={columnCount} />);
    }

    return rows;
  };

  render() {
    return (
      <div className="cross-stitch__wrapper">
        {this.getRows()}
      </div>
    )
  }
}

export default CrossStitchPattern;