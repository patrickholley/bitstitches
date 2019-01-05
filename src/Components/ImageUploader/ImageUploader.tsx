import * as React from 'react'
import './ImageUploader.scss';



class ImageUploader extends React.Component {
  constructor(props: any) {
    super(props);
  }

  onDragOver = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  onDrop = (event: React.MouseEvent) => {
    alert("Thanks for the file!");
    event.preventDefault();
  };

  render() {
    return (
      <div
        className="image-uploader"
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >
        Drag files here
      </div>
    )
  }
}

export default ImageUploader;
