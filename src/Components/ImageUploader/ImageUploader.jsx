import React, { Component } from 'react';
import './ImageUploader.scss';

class ImageUploader extends Component {
  constructor(props) {
    super(props);
  }

  onUpload = (e, dataKey) => {
    e.preventDefault();
    this.props.onUpload(e[dataKey].files[0]);
  };

  render() {
    return (
      <div className="image-uploader__wrapper">
        <label
          className="image-uploader"
          onDragOver={e => { e.preventDefault(); }}
          onDrop={e => { this.onUpload(e, "dataTransfer"); }}
        >
          <input type="file" onChange={e => { this.onUpload(e, "target"); }} />
          <span className="image-uploader__prompt">Select image</span>
        </label>
      </div>
    )
  }
}

export default ImageUploader;
