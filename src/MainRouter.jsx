import React, { Component } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import BitStitchEditor from './Components/BitStitchEditor';
import Header from "./Components/Header";

class MainRouter extends Component {
  render() {
    return (
      <BrowserRouter>
        <Header>
          <Switch>
            <Route exact path="/" component={BitStitchEditor} />
            <Redirect to="/" />
          </Switch>
        </Header>
      </BrowserRouter>
    )
  }
}

export default MainRouter;
