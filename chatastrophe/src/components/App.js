import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import LoginContainer from "./LoginContainer";
import ChatContainer from "./ChatContainer";
import UserContainer from "./UserContainer";

import "./App.css";

class App extends Component {
  state = { user: null, messages: [] };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.props.history.push("/login");
      }
    });

    firebase
      .database()
      .ref("/messages")
      .once("value", snapshot => {
        this.onMessage(snapshot);
      });
  }
  onMessage = snapshot => {
    const messages = Object.keys(snapshot.val()).map(key => {
      const msg = snapshot.val()[key];
      msg.id = key;
      return msg;
    });
    console.log(messages);
  };

  handleSubmitMessage = msg => {
    // Send to database
    const data = {
      msg,
      author: this.state.user.email,
      user_id: this.state.user.uid,
      timestamp: Date.now()
    };
    firebase
      .database()
      .ref("messages/")
      .push(data);
  };

  render() {
    return (
      <div id="container">
        <Route path="/login" component={LoginContainer} />
        <Route
          exact
          path="/"
          render={() => (
            <ChatContainer
              onSubmit={this.handleSubmitMessage}
              messages={this.state.messages}
            />
          )}
        />
        <Route path="/users/:id" component={UserContainer} />
      </div>
    );
  }
}
export default withRouter(App);
