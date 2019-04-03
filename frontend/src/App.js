import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

import LoginPage from './components/LoginPage.js';
import HomePage from './components/HomePage.js';

class App extends Component {
  render() {

    if (this.props.location.pathname === '/')
      this.props.history.push('/home');

    return (
      <div className="App">

        <Route
          exact
          path='/home'
          render={props => <HomePage {...props} />}
        />

        <Route
          exact
          path='/login'
          render={props => <LoginPage {...props} />}
        />

      </div>
    );
  }
}

export default withRouter(App);
