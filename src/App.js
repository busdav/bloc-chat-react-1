import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import { RoomList } from './components/RoomList.js';

class App extends Component {
  render() {
    return (
      <div>
        <RoomList firebase={firebase}/>
      </div>
    );
  }
}

export default App;
