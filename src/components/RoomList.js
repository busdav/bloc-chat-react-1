import React, { Component } from 'react';
import { Col, Navbar, DropdownButton, MenuItem, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '.././styles/RoomList.css';

export class RoomList extends Component {
  constructor(props) {
    super(props);
      this.state = {title: "", creator: "", rooms: [], toEdit: ""};
      this.roomsRef = this.props.firebase.database().ref("rooms");
      this.handleChange = this.handleChange.bind(this);
      this.createRoom = this.createRoom.bind(this);
      this.editRoom = this.editRoom.bind(this);
      this.updateRoom = this.updateRoom.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
      creator: this.props.user
    });
  }

  createRoom(e) {
    e.preventDefault();
    this.roomsRef.push({ title: this.state.title, creator: this.state.creator });
    this.setState({ title: "", creator: ""});
  }

  deleteRoom(roomKey) {
    const room = this.props.firebase.database().ref("rooms/" + roomKey);
    const roomMessages = this.props.firebase.database().ref("messages/" + roomKey)
    room.remove();
    roomMessages.remove();
    this.props.activeRoom("");
  }

  editRoom(room) {
    const editRoom = (
      <div className="room-edit">
        <form onSubmit={this.updateRoom}>
          <FormGroup>
            <InputGroup>
              <FormControl type="text" defaultValue={room.title} inputRef={(input) => this.input = input} />
              <InputGroup.Button>
                <Button type="submit" alt="update">
                  <i className="fa fa-check"></i>
                </Button>
                <Button type="button" alt="cancel" onClick={() => this.setState({toEdit: ""})}>
                  <i className="fa fa-times"></i>
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </form>
      </div>
    );
    return editRoom;
  }

  updateRoom(e) {
    e.preventDefault();
    const updates = {[this.state.toEdit + "/title"]: this.input.value};
    this.roomsRef.update(updates);
    this.setState({ toEdit: ""});
  }

  componentDidMount() {
    this.roomsRef.on('value', snapshot => {
      const roomChanges = [];
      snapshot.forEach((room) => {
        roomChanges.push({
          key: room.key,
          title: room.val().title,
          creator: room.val().creator
        });
      });
      this.setState({ rooms: roomChanges});
    });
  }

  selectRoom(room) {
    this.props.activeRoom(room);
  }

  render() {
    const roomForm = (
      <form onSubmit={this.createRoom}>
        <FormGroup>
          <InputGroup>
            <FormControl type="text" name="title" value={this.state.title} placeholder="New Room" onChange={this.handleChange}/>
            <InputGroup.Button>
              <Button type="submit">Create</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </form>
    );

    const roomList = this.state.rooms.map((room) =>
      <CSSTransition
        key={room.key}
        classNames="room-transition"
        timeout={{ enter: 500, exit: 300 }}>
          <li>
            {this.state.toEdit === room.key ?
              this.editRoom(room)
            :
            <div className="room-block">
                {this.props.user === room.creator ?
                  <DropdownButton noCaret title={<span className="fa fa-angle-double-down"></span>} id="bg-nested-dropdown" className="room-options">
                    <MenuItem onClick={() => this.setState({toEdit: room.key})}>Edit</MenuItem>
                    <MenuItem onClick={() => this.deleteRoom(room.key)}>Delete</MenuItem>
                  </DropdownButton>
                : <div className="no-options"></div>
                }
              <h3 className="room-title" onClick={(e) => this.selectRoom(room, e)}>{room.title}</h3>
            </div>
            }
          </li>
      </CSSTransition>
    );

    return(
      <Col xs={12} className="room-list">
        <Navbar.Form>{roomForm}</Navbar.Form>
        <TransitionGroup
          component="ul">
            {roomList}
        </TransitionGroup>
      </Col>
    );
  }
}
