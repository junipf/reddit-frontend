import React from "react";
import Button from "./button";
import SubredditIcon from "./subreddit-icon";
import { Link } from "react-router-dom";
import { Timestamp } from "./timestamp";
import styled from "styled-components";
import { formatNumber } from "../utils/format-number";

const Body = styled.div``;

const Card = styled.div``;

const Banner = styled.div.attrs(props => ({
  backgroundImage: "url(" + props.backgroundImage + ")",
  backgroundColor: props.backgroundColor,
}))``;

export default class SubredditCard extends React.Component {
  constructor(props) {
    super(props);
    const { user_is_subscriber } = props;
    this.state = {
      subscribed: user_is_subscriber,
    };
    this.toggleSubscribe = this.toggleSubscribe.bind(this);
  }
  toggleSubscribe() {
    this.setState({
      subscribed: !this.state.subscribed,
    });
  }
  render() {
    const {
      banner_background_color,
      banner_background_image,
      display_name_prefixed,
      // display_name,
      // header_title,
      // header_img,
      // community_icon,
      // icon_img,
      primary_color,
      key_color,
      id,
      subscribers,
      accounts_active,
      created_utc,
      url,
      // title,
      // public_description_html,
    } = this.props;
    const backgroundColor =
      banner_background_color || primary_color || key_color || null;
    if (id) {
      return (
        <Card>
          <Banner
            backgroundColor={backgroundColor}
            backgroundImage={banner_background_image}
          />
          <Body>
            <SubredditIcon subName={this.props.display_name} />
            <Link to={url} className="subreddit-name">
              {display_name_prefixed}
            </Link>
            <span>{formatNumber(subscribers, "user")}</span>
            {accounts_active !== null ? (
              <span>{formatNumber(accounts_active, "active user")}</span>
            ) : null}
            {/* <span
                className="body"
                dangerouslySetInnerHTML={{
                  __html: public_description_html,
                }}
              /> */}
            <Timestamp time={created_utc} to={"#" + id} />
            <Button type="primary" onClick={this.toggleSubscribe}>
              {this.state.subscribed ? "Leave" : "Join"}
            </Button>
          </Body>
        </Card>
      );
    } else {
      return null;
    }
  }
}
