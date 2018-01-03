import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import { RoomList } from './components/RoomList.js';
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
}

setUser(user) {
  this.setState({ user: user });
}

  render() {
    let messageList;
    let currentUser;
    let roomList;
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
          user={this.state.user.displayName}
        />
      );
    }

    return (
      <Grid fluid>
        <Row className="show-grid main-row">
          <Col xs={3} className="nav-section">
            <Navbar fluid>
              <Navbar.Header>
                <Navbar.Brand><h1>Bloc Chat</h1></Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <Col xs={12}>
                  <h2>{this.state.activeRoom.title || "Select a Room"}</h2>
                </Col>
                {roomList}
              </Navbar.Collapse>
            </Navbar>
          </Col>
          <Col xs={9} className="message-section">
            <User
              firebase={firebase}
              setUser={this.setUser}
              welcome={currentUser}
            />
            {messageList}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
