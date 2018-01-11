import React, { Component } from 'react';

export class RoomParticipants extends Component {
  constructor(props) {
    super(props);
    this.state = {participants: []};
  }

  componentDidMount() {
    const roomRef = this.props.firebase.database().ref("rooms/" + this.props.activeRoom + "/participants");
    roomRef.on('value', snapshot => {
      const participantChanges = [];
      snapshot.forEach((participant) => {
          participantChanges.push({
            key: participant.key,
            username: participant.val().username,
            isTyping: participant.val().isTyping
          });
      });
      this.setState({ participants: participantChanges});
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeRoom !== this.props.activeRoom) {
      const roomRef = this.props.firebase.database().ref("rooms/" + nextProps.activeRoom + "/participants");
      roomRef.on('value', snapshot => {
        const participantChanges = [];
        snapshot.forEach((participant) => {
            participantChanges.push({
              key: participant.key,
              username: participant.val().username,
              isTyping: participant.val().isTyping
            });
        });
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
