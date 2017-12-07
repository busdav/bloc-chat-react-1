import React, { Component } from 'react';

export class RoomList extends Component {
  constructor(props) {
    super(props);
      this.state = {title: "", rooms: []};
      this.roomsRef = this.props.firebase.database().ref("rooms");
      this.handleChange = this.handleChange.bind(this);
      this.createRoom = this.createRoom.bind(this);
  }

  handleChange(e) {
    this.setState({ title: e.target.value });
  }

  createRoom(e) {
    e.preventDefault();
    this.roomsRef.push({ title: this.state.title });
    this.setState({ title: "" });
  }

  deleteRoom(roomKey) {
    let room = this.props.firebase.database().ref("rooms/" + roomKey);
    room.remove();
  }

  componentDidMount() {
    this.roomsRef.on('value', snapshot => {
      let roomChanges = [];
      snapshot.forEach((room) => {
        roomChanges.push({
          key: room.key,
          title: room.val().title
        });
      });
      this.setState({ rooms: roomChanges})
    });
  }

  selectRoom(room) {
    this.props.activeRoom(room);
  }

  render() {
    const roomForm = (
      <form onSubmit={this.createRoom}>
        <input type="text" value={this.state.title} placeholder="Enter Room Name" onChange={this.handleChange}/>
        <input type="submit" value="Create" />
      </form>
    );

    const roomList = this.state.rooms.map((room) =>
      <li key={room.key} onClick={(e) => this.selectRoom(room, e)}>
        {room.title}
        <button onClick={() => this.deleteRoom(room.key)}>Remove</button>
      </li>
    );

    return(
      <div>
        <div>{roomForm}</div>
        <ul>{roomList}</ul>
      </div>
    );
  }
}
