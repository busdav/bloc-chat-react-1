import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import { RoomList } from './components/RoomList.js';
import { MessageList } from './components/MessageList.js';
import { User } from './components/User.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {activeRoom: "", user: null};
    this.activeRoom = this.activeRoom.bind(this);
    this.setUser = this.setUser.bind(this);
  }

activeRoom(room) {
  this.setState({ activeRoom: room })
}

setUser(user) {
  this.setState({ user: user });
}

  render() {
    const showMessages = this.state.activeRoom;

    return (
      <div>
        <h1>{this.state.activeRoom.title || "Select A Room"}</h1>
        <User firebase={firebase} setUser={this.setUser} />
        <RoomList firebase={firebase} activeRoom={this.activeRoom} />
        { showMessages ?
        (<MessageList firebase={firebase} activeRoom={this.state.activeRoom.key} />)
        : (null)
        }
      </div>
    );
  }
}

export default App;
