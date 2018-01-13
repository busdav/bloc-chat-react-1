import React, { Component } from 'react';

export class RoomParticipants extends Component {
  constructor(props) {
    super(props);
    this.state = {participants: []};
  }

  componentDidMount() {
    const userRef = this.props.firebase.database().ref("presence/");
    userRef.orderByChild("currentRoom").equalTo(this.props.activeRoom).on('value', snapshot => {
      const participantChanges = [];
        if (snapshot.val()) {
          snapshot.forEach((participant) => {
            participantChanges.push({
              key: participant.key,
              username: participant.val().username,
              isTyping: participant.val().isTyping,
              isOnline: participant.val().isOnline
            });
          });
        }
      this.setState({ participants: participantChanges});
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeRoom !== this.props.activeRoom) {
      const userRef = this.props.firebase.database().ref("presence/");
      userRef.orderByChild("currentRoom").equalTo(nextProps.activeRoom).on('value', snapshot => {
        const participantChanges = [];
          if (snapshot.val()) {
            snapshot.forEach((participant) => {
              participantChanges.push({
                key: participant.key,
                username: participant.val().username,
                isTyping: participant.val().isTyping,
                isOnline: participant.val().isOnline
              });
            });
          }
        this.setState({ participants: participantChanges});
      });
    }
  }

  render() {
    const roomParticipants = (
      this.state.participants.map((participant) =>
      <div key={participant.key}>
        <h4>
          {participant.username}
          <span><small>{participant.isTyping ? " is typing..." : null}</small></span>
        </h4>
      </div>
      )
    );
    return(
      <div>
        {roomParticipants}
      </div>
    );
  }
}
