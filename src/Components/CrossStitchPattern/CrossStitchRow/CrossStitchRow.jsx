import React, { Component } from 'react'
import CrossStitchCell from './CrossStitchCell';
import './CrossStitchRow.scss';

class CrossStitchRow extends Component {
  getCells = () => {
    const { columnCount } = this.props;
    const columns = [];

    for (let i = 0; i < columnCount; i++) {
      columns.push(<CrossStitchCell />);
    }

    return columns;
  };

  render() {
    return (
      <div className="cross-stitch__row">
        {this.getCells()}
      </div>
    )
  }
}

export default CrossStitchRow;
