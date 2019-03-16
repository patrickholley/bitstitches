import React, { Component } from "react";
import "./ImageUploader.scss";

class ImageUploader extends Component {
  constructor(props) {
    super(props);
  }

  onUpload = (e, dataKey) => {
    e.preventDefault();
    this.props.onUpload(e[dataKey].files[0]);
  };

  render() {
    const { label } = this.props;
    console.log(label);

    return (
      <div className="image-uploader__wrapper">
        <span className="image-uploader__label">
          {label ? `Uploaded image: ${label}` : "Please upload an image"}
        </span>
        <label
          className="image-uploader"
          onDragOver={e => {
            e.preventDefault();
          }}
          onDrop={e => {
            this.onUpload(e, "dataTransfer");
          }}
        >
          <input
            type="file"
            onChange={e => {
              this.onUpload(e, "target");
            }}
          />
          <span className="image-uploader__prompt">Select image</span>
        </label>
      </div>
    );
  }
}

export default ImageUploader;
