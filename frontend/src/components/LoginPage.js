import React from 'react';
import axios from 'axios';

export default class LoginPage extends React.Component {

  state = {

    username: '',
    password: '',
    errorMsg: null

  }

  handleChange = e => {

    this.setState({
      [e.target.name]: e.target.value,
      errorMsg: null
    });

  }

  handleSubmit = e => {

    e.preventDefault();

  }

  login = () => {

    console.log('login');

    axios.post('http://localhost:5000/api/login', { username: this.state.username, password: this.state.password})
      .then(res => this.props.history.push('/home'))
      .catch(err => this.setState({errorMsg: err.response.data.message}))

  }

  signup = () => {

    console.log('signup!');

    axios.post('http://localhost:5000/api/register', { username: this.state.username, password: this.state.password})
      .then(res => this.props.history.push('/home'))
      .catch(err => this.setState({errorMsg: err.response.data.message}))

  }

  render() {

    console.log(this.state.errorMsg);

    return (

      <form onSubmit={this.handleSubmit} className='login-form'>

        <input type='text' name='username' value={this.state.username} onChange={this.handleChange} required />
        <input type='password' name='password' value={this.state.password} onChange={this.handleChange} required />

        {this.state.errorMsg && <p>Error: {this.state.errorMsg}</p>}

        <button onClick={this.login}>Log In</button>
        <button onClick={this.signup}>Sign Up</button>

      </form>

    );

  }

}
