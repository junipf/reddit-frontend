import React from "react";
// import { connect } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import { Requester } from "./requester";
import styled from "styled-components";
// import { Spinner } from "./Spinner";

// import SubredditIcon from "./subreddit-icon";

import { ReactComponent as Chevron } from "../icons/chevron-down.svg";
import { ReactComponent as Mail } from "../icons/mail.svg";

const UnreadButton = styled.button`
  &.btn {
    background-color: transparent;
    display: block;
    width: auto;
  }
  &.new-mail {
    color: orange;
  }
  line-height: 1;
  svg {
    height: 1em;
  }
`;

const Badge = styled.span``;

const DropdownToggle = styled(Dropdown.Toggle)`
  &.dropdown-toggle {
    &:after {
      display: none;
    }
  }
`;

const User = styled.div`
  font-size: 1.125rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  align-content: center;
  line-height: 1;
  padding: 0;
  height: inherit;
  &:after {
    display: none;
  }
`;

export default class UserMenu extends React.Component {
  static contextType = Requester;
  constructor(props) {
    super(props);
    this.state = {
      lastGotUnread: Date.now(),
      unread: [],
    };
    this.getUnread = this.getUnread.bind(this);
  }
  componentDidMount() {
    this.getUnreadInterval = setInterval(() => {
      this.setState({
        lastGotUnread: Date.now(),
      });
    }, 1000);
    this.context.getMe().then(unread => {
      this.setState({ unread: unread });
      console.info("Unread messages:", unread);
    });
    // this.getUnread();
  }
  componentWillUnmount() {
    clearInterval(this.getUnreadInterval);
  }
  getUnread() {
    this.context.getUnreadMessages().then(unread => {
      this.setState({ unread: unread });
      console.info("Unread messages:", unread);
    });
  }
  render() {
    return (
      <>
        <UnreadButton
          className={this.state.unread.length > 0 ? "btn new-mail" : "btn"}
        >
          <Mail />
          <Badge>{this.state.unread.length}</Badge>
        </UnreadButton>
        <Dropdown drop="down" navbar focusFirstItemOnShow={true}>
          <DropdownToggle id="user-menu" variant="link">
            <User>
              {this.props.user.name}
              <Chevron />
            </User>
          </DropdownToggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to={"/message/inbox"}>
              Inbox
            </Dropdown.Item>
            <Dropdown.Item as={Link} to={"/profile"}>
              Go to profile
            </Dropdown.Item>
            <Dropdown.Item>Night mode</Dropdown.Item>
            <Dropdown.Item>Log out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
}
