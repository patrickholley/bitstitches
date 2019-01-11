import React, { Component } from 'react';
import './ImageUploader.scss';

class ImageUploader extends Component {
  constructor(props) {
    super(props);
  }

  onDragOver = (event) => {
    event.preventDefault();
  };

  render() {
    return (
      <div
        className="image-uploader"
        onDragOver={this.onDragOver}
        onDrop={this.props.onDrop}
      >
        Drag files here
      </div>
    )
  }
}

export default ImageUploader;
