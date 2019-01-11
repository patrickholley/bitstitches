import * as React from 'react'
import './ImageUploader.scss';

interface IProps {
  onDrop(event: React.DragEvent): void,
}

class ImageUploader extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
  }

  onDragOver = (event: React.DragEvent) => {
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
