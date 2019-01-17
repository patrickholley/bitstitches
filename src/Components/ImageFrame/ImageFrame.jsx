import React, { Component } from 'react';
import './ImageFrame.scss';

class ImageFrame extends Component {
  constructor(props) {
    super(props);

    this.state = { width: 0, height: 0 };
  }

  componentDidMount() {
    this.onImageUpload();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.image !== this.props.image) {
      this.onImageUpload();
    }
  }

  onImageUpload = () => {
    const { image } = this.props;
    const canvasImage = new Image();
    canvasImage.src = image;
    canvasImage.onload = () => {
      this.setState({
        width: canvasImage.width,
        height: canvasImage.height,
      }, () => {
        const canvas = document.getElementsByClassName('image-frame__canvas')[0]
        const context = canvas.getContext('2d');
        context.drawImage(canvasImage, 0, 0, canvasImage.width, canvasImage.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 16) {
          const greyValue = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = greyValue;
          data[i + 1] = greyValue;
          data[i + 2] = greyValue;
        }
        context.putImageData(imageData, 0, 0);
      });
    };
  };

  render() {
    return (
      <div
        className="image-frame"
      >
        Image will show here
        <canvas width={this.state.width} height={this.state.height} className="image-frame__canvas" />
      </div>
    )
  }
}

export default ImageFrame;
