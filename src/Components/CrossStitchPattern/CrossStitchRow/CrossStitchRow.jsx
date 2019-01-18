import React, { Component } from 'react'
import CrossStitchCell from './CrossStitchCell';
import './CrossStitchRow.scss';

class CrossStitchRow extends Component {
  getCells = () => {
    const { columnCount, data } = this.props;
    const columns = [];

    for (let i = 0; i < columnCount; i++) {
      columns.push(<CrossStitchCell data={data[i]} />);
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
