import React, { Component } from 'react'
import ErrorBoundary from './lib/ErrorBoundary';
import MainRouter from './MainRouter';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <MainRouter />
      </ErrorBoundary>
    )
  }
}

export default App;
