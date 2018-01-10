import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import '.././styles/MessageList.css';

export class MessageList extends Component {
  constructor(props) {
    super(props);
      this.state = {username: "", content: "", sentAt: "", messages: [], toEdit: "", isTyping: false};
      this.handleChange = this.handleChange.bind(this);
      this.createMessage = this.createMessage.bind(this);
      this.editMessage = this.editMessage.bind(this);
      this.updateMessage = this.updateMessage.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(e) {
    this.setState({isTyping: true});
    setTimeout(() => {
      this.setState({isTyping: false});
    }, 2000);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      username: this.props.user,
      content: e.target.value,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP
    });
  }

  createMessage(e) {
    const participant = this.props.firebase.database().ref("rooms/" + this.props.activeRoom + "/participants");
    const messagesRef = this.props.firebase.database().ref("rooms/" + this.props.activeRoom + "/messages");
    e.preventDefault();

    //become a room participant
    messagesRef.orderByChild("username").equalTo(this.state.username).once("value", snapshot => {
      if (!snapshot.val()) {
        participant.push({
          username: this.state.username
        });
      }
    });

    //create message
    messagesRef.push({
      username: this.state.username,
      content: this.state.content,
      sentAt: this.state.sentAt
    });
    this.setState({ username: "", content: "", sentAt: "", roomId: "", isTyping: false });
  }

  editMessage(message) {
    const editMessage = (
      <form onSubmit={this.updateMessage}>
        <input type="text" defaultValue={message.content} ref={(input) => this.input = input}/>
        <input type="submit" value="Update" />
        <button type="button" onClick={() => this.setState({toEdit: ""})}>Cancel</button>
      </form>
    );
    return editMessage;
  }

  updateMessage(e) {
    e.preventDefault();
    const messagesRef = this.props.firebase.database().ref("rooms/" + this.props.activeRoom + "/messages");
    const updates = {[this.state.toEdit + "/content"]: this.input.value};
    messagesRef.update(updates);
    this.setState({ toEdit: ""});
  }

  componentDidMount() {
    const messagesRef = this.props.firebase.database().ref("rooms/" + this.props.activeRoom + "/messages");
    messagesRef.on('value', snapshot => {
      const messageChanges = [];
      snapshot.forEach((message) => {
          messageChanges.push({
            key: message.key,
            username: message.val().username,
            content: message.val().content,
            sentAt: message.val().sentAt
          });
      });
      this.setState({ messages: messageChanges});
      this.latestMessage.scrollIntoView();
    });
  }

  componentDidUpdate() {
    this.latestMessage.scrollIntoView();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeRoom !== this.props.activeRoom) {
      const messagesRef =  this.props.firebase.database().ref("rooms/" + nextProps.activeRoom + "/messages");
      messagesRef.on('value', snapshot => {
        let messageChanges = [];
        snapshot.forEach((message) => {
            messageChanges.push({
              key: message.key,
              username: message.val().username,
              content: message.val().content,
              sentAt: message.val().sentAt
            });
        });
        this.setState({ messages: messageChanges});
        this.latestMessage.scrollIntoView();
      });
    }
  }

  render() {
    const userTyping = this.state.isTyping;
    const messageBar = (
      <form onSubmit={this.createMessage}>
        <input
          type="text"
          value={this.state.content}
          placeholder="Enter Message"
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        <input type="submit" value="Send" />
      </form>
    );

    const messageList = (
      this.state.messages.map((message) =>
        <li key={message.key}>
          <h2>
            {message.username}
            <span><small>{message.username === this.props.user && userTyping ? " is typing..." : ":"}</small></span>
          </h2>
          {(this.state.toEdit === message.key) && (this.props.user === message.username) ?
            this.editMessage(message)
            :
            <div>
              <h3>{message.content}</h3>
            {this.props.user === message.username ?
              <button onClick={() => this.setState({toEdit: message.key})}>Edit</button>
              : null
            }
            </div>
          }
        </li>
      )
    );

    return(
      <Row className="show-grid message-list-bar">
        <Col xs={12} className="message-list-bar">

          <Row className="show-grid">
            <Col xs={12} className="message-list">
              <ul>{messageList}</ul>
              <div ref={(latest) => this.latestMessage = latest} />
            </Col>
          </Row>

          <Row className="show-grid">
            <Col xs={12} id="message-bar">{messageBar}</Col>
          </Row>

        </Col>
      </Row>
    );
  }
}
