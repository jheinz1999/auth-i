import React from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

export default class HomePage extends React.Component {

  state = {

    authenticated: null,
    res: null

  }

  componentDidMount() {

    axios.get('http://localhost:5000/api/users')
      .then(res => this.setState({res: res, authenticated: true}))
      .catch(err => this.setState({authenticated: false}));

  }

  logout() {

    /*window.browser.cookies.remove({
      name: 'cool session',
      url: 'localhost'
    });*/

    axios.get('http://localhost:5000/api/logout')
      .then(res => this.setState({authenticated: false}));

  }

  render() {

    console.log('home!!!');

    const { authenticated, res } = this.state;

    if (authenticated === null)
      return <h1>Authenticating...</h1>

    if (authenticated === false) {

      this.props.history.push('/login');

    }

    if (authenticated) {
      return (

        <>

          <h1>Logged in!</h1>
          <button onClick={() => this.logout()}>Log Out</button>

        </>

      );
    }

    return <p>test</p>

  }

}
