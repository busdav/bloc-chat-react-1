import React, { Component } from 'react';
import './styles/App.css';
import firebase from './firebase.js';
import { RoomList } from './components/RoomList.js';
import { RoomParticipants } from './components/RoomParticipants.js';
import { MessageList } from './components/MessageList.js';
import { User } from './components/User.js';
import { Grid, Row, Col, Navbar } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {activeRoom: "", user: null};
    this.activeRoom = this.activeRoom.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  activeRoom(room) {
    this.setState({ activeRoom: room });
    const userRef = firebase.database().ref("presence/" + this.state.user.uid);
    const roomKey = room === "" ? "" : room.key;
    userRef.update({currentRoom: roomKey});
  }

  setUser(user) {
    this.setState({ user: user });
  }

  render() {
    let messageList;
    let currentUser;
    let roomList;
    let roomParticipants;
    if (this.state.user !== null) {
      roomList = (
        <RoomList
          firebase={firebase}
          activeRoom={this.activeRoom}
          user={this.state.user.email}
        />
      );
      currentUser = this.state.user.displayName;
    }
    else {
      currentUser = "Guest";
    }

    if (this.state.user !== null && this.state.activeRoom) {
      messageList = (
        <MessageList
          firebase={firebase}
          activeRoom={this.state.activeRoom.key}
          user={this.state.user}
        />
      );
      roomParticipants = (
        <RoomParticipants
          firebase={firebase}
          activeRoom={this.state.activeRoom.key}
        />
      );
    }

    return (
      <Grid fluid className="main">
        <Row className="show-grid main-row">

          <Col sm={3} xs={12} className="sidenav">
            <Navbar fluid>
              <Navbar.Header>
                <Navbar.Brand>
                  <h1>Bloc Chat</h1>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <User
                  firebase={firebase}
                  setUser={this.setUser}
                  welcome={currentUser}
                />
                <Col xs={12} className="room-section">
                  <h2 className="active-room">{this.state.activeRoom.title || "Select a Room"}</h2>
                    {roomParticipants}
                </Col>
                {roomList}
              </Navbar.Collapse>
            </Navbar>
          </Col>

          {messageList}

        </Row>
      </Grid>
    );
  }
}

export default App;
