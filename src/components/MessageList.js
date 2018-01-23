import React, { Component } from 'react';
import { Col, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';
import '.././styles/MessageList.css';

export class MessageList extends Component {
  constructor(props) {
    super(props);
      this.state = {username: "", content: "", sentAt: "", messages: [], toEdit: ""};
      this.handleChange = this.handleChange.bind(this);
      this.createMessage = this.createMessage.bind(this);
      this.editMessage = this.editMessage.bind(this);
      this.updateMessage = this.updateMessage.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(e) {
    const userRef = this.props.firebase.database().ref("presence/" + this.props.user.uid);
    userRef.update({isTyping: true});
    setTimeout(() => {
      userRef.update({isTyping: false});
    }, 2000);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      username: this.props.user.displayName,
      content: e.target.value,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP
    });
  }

  createMessage(e) {
    const messagesRef = this.props.firebase.database().ref("messages/" + this.props.activeRoom);
    e.preventDefault();
    messagesRef.push({
      username: this.state.username,
      content: this.state.content,
      sentAt: this.state.sentAt
    });
    this.setState({ username: "", content: "", sentAt: ""});
  }

  editMessage(message) {
    const editMessage = (
      <form onSubmit={this.updateMessage}>
        <FormGroup>
          <InputGroup>
            <FormControl type="text" defaultValue={message.content} inputRef={(input) => this.input = input}/>
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
    );
    return editMessage;
  }

  updateMessage(e) {
    e.preventDefault();
    const messagesRef = this.props.firebase.database().ref("messages/" + this.props.activeRoom);
    const updates = {[this.state.toEdit + "/content"]: this.input.value};
    messagesRef.update(updates);
    this.setState({ toEdit: ""});
  }

  componentDidMount() {
    const messagesRef = this.props.firebase.database().ref("messages/" + this.props.activeRoom);
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
    if (!this.state.toEdit) {
      this.latestMessage.scrollIntoView();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeRoom !== this.props.activeRoom) {
      const messagesRef =  this.props.firebase.database().ref("messages/" + nextProps.activeRoom);
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
    const messageBar = (
      <form onSubmit={this.createMessage}>
        <FormGroup>
          <InputGroup>
          <FormControl
            type="text"
            value={this.state.content}
            placeholder="Enter Message"
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          <InputGroup.Button>
            <Button type="submit">Send</Button>
          </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </form>
    );

    const messageList = (
      this.state.messages.map((message) =>
        <li key={message.key}>
          <h4>{message.username}</h4>
          {(this.state.toEdit === message.key) && (this.props.user.displayName === message.username) ?
            this.editMessage(message)
            :
            <div>
              {this.props.user.displayName === message.username ?
                <span
                  className="fa fa-wrench edit-msg"
                  onClick={() => this.setState({toEdit: message.key})}
                />
                :
                <div className="no-edit-msg" />
              }
              <p>{message.content}</p>
            </div>
          }
        </li>
      )
    );

    return(
        <Col xs={12} className="message-list-bar">
            <Col xs={12} className="message-list">
              <ul>{messageList}</ul>
              <div ref={(latest) => this.latestMessage = latest} />
            </Col>
            <Col xs={12} id="message-bar">{messageBar}</Col>
        </Col>
    );
  }
}
