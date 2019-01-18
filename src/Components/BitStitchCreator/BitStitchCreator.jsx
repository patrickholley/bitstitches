import React, { Component } from 'react';
import './BitStitchCreator.scss';
import ImageUploader from '../ImageUploader';
import ImageFrame from '../ImageFrame';
import CrossStitchPattern from '../CrossStitchPattern/CrossStitchPattern';

class BitStitchCreator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      image: null,
    }
  }

  componentWillMount = () => {
    const testData = [];

    for (let i = 0; i < 100; i++) {
      const testColumnData = [];

      for (let j = 0; j < 100; j++) {
        testColumnData.push([Math.random() * 255, Math.random() * 255, Math.random() * 255]);
      }

      testData.push(testColumnData);
    }

    this.setState({ data: testData });
  };

  onDrop = (event) => {
    event.preventDefault();
    const imageFile = event.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (file) => {
      const image = new Image();
      image.onload = () => {
        this.setState({ image }, () => { this.onImageLoad(); });
      };
      image.src = file.target.result;
    };

    reader.readAsDataURL(imageFile);
  };

  onImageLoad = () => {
    const { image } = this.state;
    const data = Object.assign({}, this.state.data);
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, image.width, image.height).data;

    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        const x = Math.round((image.height/100) * i);
        const y = Math.round((image.width/100) * j);

        const colorIndex = ((image.width * x) + y) * 4;

        data[i][j] = [imageData[colorIndex], imageData[colorIndex + 1], imageData[colorIndex + 2]];
      }
    }

    this.setState({ data });
  };

  /*onImageUpload = () => {
    const { image } = this.props;
    const canvasImage = new Image();
    canvasImage.src = image;
    canvasImage.onload = () => {
      this.setState({
        width: canvasImage.width,
        height: canvasImage.height,
      }, () => {
        const canvas = document.getElementsByClassName('image-frame__canvas')[0];
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
  };*/

  render() {
    return (
      <>
        <ImageUploader onDrop={this.onDrop} />
        {/*<ImageFrame image={this.state.image} />*/}
        <CrossStitchPattern
          columnCount={100}
          data={this.state.data}
          rowCount={100}
        />
      </>
    )
  }
}

export default BitStitchCreator;
