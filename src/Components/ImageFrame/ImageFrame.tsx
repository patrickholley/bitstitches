import * as React from 'react'
import './ImageFrame.scss';



class ImageFrame extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div
        className="image-frame"
      >
        Image will show here
      </div>
    )
  }
}

export default ImageFrame;
