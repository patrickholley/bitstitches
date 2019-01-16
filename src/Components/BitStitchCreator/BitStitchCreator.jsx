import React, { Component } from 'react';
import './BitStitchCreator.scss';
import ImageUploader from '../ImageUploader';
import ImageFrame from '../ImageFrame';

class BitStitchCreator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
    }
  }

  onDrop = (event) => {
    event.preventDefault();
    const imageFile = event.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (file) => {
      this.setState({
        image: file.target.result,
      });
    };

    reader.readAsDataURL(imageFile);
  };

  render() {
    return (
      <>
        <ImageUploader onDrop={this.onDrop} />
        <ImageFrame image={this.state.image} />
      </>
    )
  }
}

export default BitStitchCreator;
