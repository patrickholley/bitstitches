import React, { Component } from 'react';
import './ImageFrame.scss';

class ImageFrame extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="image-frame"
      >
        Image will show here
        <img src={this.props.image} />
      </div>
    )
  }
}

export default ImageFrame;
