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
            username: participant.val().username
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
              username: participant.val().username
            });
        });
        this.setState({ participants: participantChanges});
      });
    }
  }

  render() {
    const roomParticipants = (
      this.state.participants.map((participant) =>
        <h6 key={participant.key}>{participant.username}</h6>
      )
    );
    return(
      <div>
        {roomParticipants}
      </div>
    );
  }
}
