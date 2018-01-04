import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import '.././styles/User.css';

export class User extends Component {
  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

signIn() {
  const provider = new this.props.firebase.auth.GoogleAuthProvider();
  this.props.firebase.auth().signInWithPopup(provider).then((result) => {
    const user = result.user;
    this.props.setUser(user);
  });
}

signOut() {
  this.props.firebase.auth().signOut().then(() => {
    this.props.setUser(null);
  });
}

componentDidMount() {
  this.props.firebase.auth().onAuthStateChanged(user => {
    this.props.setUser(user);
  });
}

  render() {
    return(
      <Row className="show-grid">
        <Col xs={12} className="login-section">
          <h3>Welcome, {this.props.welcome}</h3>
          { this.props.welcome === "Guest" ?
            <button onClick={this.signIn}>Sign In</button>
            :
            <button onClick={this.signOut}>Sign Out</button>
          }
        </Col>
      </Row>
    )
  }
}
