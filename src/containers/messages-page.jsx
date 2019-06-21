import React from "react";

import { connect } from "react-redux";
// import Comment from "../components/comment";

class MessagesPage extends React.Component {
  render() {
    return <div className="messages-page">Messages!</div>;
  }
}

function mapStateToProps(state) {
  const { messages } = state;
  return {
    messages,
  };
}

export default connect(mapStateToProps)(MessagesPage);
