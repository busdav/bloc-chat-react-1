import React, { Component } from 'react';

export class MessageList extends Component {
  constructor(props) {
    super(props);
      this.state = { username: "", content: "", sentAt: "", messages: [], toEdit: ""};
      this.handleChange = this.handleChange.bind(this);
      this.createMessage = this.createMessage.bind(this);
      this.editMessage = this.editMessage.bind(this);
      this.updateMessage = this.updateMessage.bind(this);
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
    const messagesRef = this.props.firebase.database().ref("rooms/" + this.props.activeRoom + "/messages");
    e.preventDefault();
    messagesRef.push({
      username: this.state.username,
      content: this.state.content,
      sentAt: this.state.sentAt
    });
    this.setState({ username: "", content: "", sentAt: "", roomId: "" });
  }

  editMessage(message) {
    const editMessage= (
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
      this.setState({ messages: messageChanges})
    });
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
        this.setState({ messages: messageChanges})
      });
    }
  }

  render() {
    const messageBar = (
      <form onSubmit={this.createMessage}>
        <input type="text" value={this.state.content} placeholder="Enter Message" onChange={this.handleChange}/>
        <input type="submit" value="Send" />
      </form>
    );

    const messageList = (
      this.state.messages.map((message) =>
        <li key={message.key}>
          <h2>{message.username}:</h2>
          {(this.state.toEdit === message.key) && (this.props.user === message.username) ?
            this.editMessage(message)
            :
            <div>
              <h3>{message.content}</h3>
              <button onClick={() => this.setState({toEdit: message.key})}>Edit</button>
            </div>
          }
        </li>
      )
    );

    return(
      <div>
        <div>{messageBar}</div>
        <ul>{messageList}</ul>
      </div>
    );
  }
}
