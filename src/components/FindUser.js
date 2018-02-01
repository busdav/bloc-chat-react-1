import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return(
      <form>
        <FormGroup>
          <FormControl
            type="text"
            value={this.props.searchText}
            placeholder="Find User"
            onChange={this.handleChange}
          />
        </FormGroup>
      </form>
    );
  }
}

class FilteredUsers extends Component {
  render() {
    const searchText = this.props.searchText;
    const rows = [];

    this.props.users.forEach((user) => {
      if (user.username.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
        return;
      }

      const isOnline = user.isOnline ? "Yes" : "No";
      rows.push(
        <tr key={user.key}>
          <td>{user.username}</td>
          <td>{isOnline}</td>
          <td>{user.roomName}</td>
        </tr>
      );
    });

    return(
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Online</th>
            <th>Room</th>
          </tr>
        </thead>
          <tbody>
            {rows}
          </tbody>
      </table>
    );
  }
}

class FilterUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {searchText: ""};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(searchText) {
    this.setState({searchText: searchText});
  }

  render() {
    return(
      <div>
        <SearchBar
          searchText={this.state.searchText}
          onChange={this.handleChange}
        />
        <FilteredUsers
          users={this.props.users}
          searchText={this.state.searchText}
        />
      </div>
    );
  }
}

export class FindUser extends React.Component {
  constructor(props) {
    super(props);
      this.state = {userList: [], isOpen: false};
      this.toggleList = this.toggleList.bind(this);
    }

  toggleList() {
    this.setState( prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  componentDidMount() {
    const userRef = this.props.firebase.database().ref("presence/");
    userRef.on('value', snapshot => {
      const userChanges = [];
        if (snapshot.val()) {
          snapshot.forEach((participant) => {
            userChanges.push({
              key: participant.key,
              username: participant.val().username,
              roomName: participant.val().roomName,
              isOnline: participant.val().isOnline
            });
          });
        }
      this.setState({ userList: userChanges});
    });
  }
  render() {
    const userList = this.state.userList;
    return (
      <div>
        <Button
          bsSize="small"
          onClick={this.toggleList}>
            {this.state.isOpen ? "Hide" : "Find User"}
        </Button>
        {this.state.isOpen ? <FilterUsers users={userList} /> : null }
      </div>
    );
  }
}
