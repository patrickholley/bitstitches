import React, { Component, lazy, Suspense } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import ErrorBoundary from "./lib/components/ErrorBoundary";
import Header from "./Components/Header";
import Loading from "./lib/components/Loading";

const BitStitchEditor = lazy(() => import("./Components/BitStitchEditor"));

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <Header>
            <Suspense fallback={<div>Loading</div>}>
              <Loading />
              <Switch>
                <Route exact path="/" render={() => <BitStitchEditor />} />
                <Redirect to="/" />
              </Switch>
            </Suspense>
          </Header>
        </BrowserRouter>
      </ErrorBoundary>
    );
  }
}

export default App;
