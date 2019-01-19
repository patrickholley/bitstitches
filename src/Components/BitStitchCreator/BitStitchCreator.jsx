import React, { Component } from 'react';
import './BitStitchCreator.scss';
import ImageUploader from '../ImageUploader';
import ImageFrame from '../ImageFrame';
import CrossStitchPattern from '../CrossStitchPattern/CrossStitchPattern';

class BitStitchCreator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnCount: 100,
      data: [],
      image: null,
      rowCount: 100,
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
    const { width, height } = image;
    const imageData = context.getImageData(0, 0, width, height).data;

    const dimensionDifference = height - width;

    let largerDimension = dimensionDifference > 0 ? height : width;
    const yOffset = dimensionDifference > 0 ? dimensionDifference / 2 : 0;
    const xOffset = dimensionDifference < 0 ? (0 - dimensionDifference) / 2 : 0;

    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        const x = Math.round(((largerDimension/100) * i) - xOffset);
        const y = Math.round(((largerDimension/100) * j) - yOffset);

        if (this.outOfBounds(x, y, width, height)) {
          data[i][j] = [255, 255, 255];
        } else {
          const colorIndex = ((width * x) + y) * 4;
          data[i][j] = [imageData[colorIndex], imageData[colorIndex + 1], imageData[colorIndex + 2]];
        }
      }
    }

    this.setState({ data });
  };

  outOfBounds = (x, y, width, height) => x < 0 || x >= height || y < 0 || y >= width;

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
          columnCount={this.state.columnCount}
          data={this.state.data}
          rowCount={this.state.rowCount}
        />
      </>
    )
  }
}

export default BitStitchCreator;
