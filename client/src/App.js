import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    data: null
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res }))
      .catch(err => console.log(err));
  }

  // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const resUsers = await fetch('/api/user');
    const resEastStats = await fetch('/api/stat/east');
    const resSouthStats = await fetch('/api/stat/south');
    if (resUsers.status !== 200 || 
      resEastStats.status !== 200 || 
      resSouthStats.status !== 200) {
      throw Error("server error"); 
    }
    const users = await resUsers.json();
    const eastStats = await resEastStats.json();
    const southStats = await resSouthStats.json();

    return [users, eastStats, southStats];
  };

  render() {
    return (
      <div className="App">
        <p className="App-intro">{JSON.stringify(this.state.data)}</p>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
      </div>
    );
  }
}

export default App;
