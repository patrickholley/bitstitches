import * as React from 'react'
import './ImageUploader.scss';

interface IImageUploader {
  onImageDrop(): void,
}

class ImageUploader extends React.Component<IImageUploader> {
  constructor(props: any) {
    super(props);
  }

  onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    this.props.onImageDrop();
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
