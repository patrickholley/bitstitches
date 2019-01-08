import * as React from 'react'
import ImageUploader from './Components/ImageUploader';
import ImageFrame from './Components/ImageFrame';

class App extends React.Component {
  render() {
    return (
      <>
        <ImageUploader />
        <ImageFrame />
      </>
    )
  }
}

export default App;
