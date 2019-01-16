import React, { Component } from 'react'
import BitStitchCreator from './Components/BitStitchCreator/BitStitchCreator';
import ErrorBoundary from './lib/ErrorBoundary/ErrorBoundary';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <BitStitchCreator />
      </ErrorBoundary>
    )
  }
}

export default App;
