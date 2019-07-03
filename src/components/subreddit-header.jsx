import React from "react";

import { connect } from "react-redux";
import SubredditIcon from "./subreddit-icon";
import { overlayTextColor } from "./color";
import { formatNumber } from "../utils/format-number";
// import { Link } from "react-router-dom";
// import Time from "./Timestamp";

// function DefaultIcon(props) {
//   return (
//     <svg
//       style={{
//         fill: props.primaryColor,
//         backgroundColor: props.keyColor,
//       }}
//       className="icon"
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 20 20"
//     >
//       <path d="M15.8286,15.8998 C15.3466,16.3788 12.6326,15.5598 8.5516,11.4798 C4.4706,7.3968 3.6486,4.6858 4.1316,4.2038 C4.3566,3.9788 4.9286,3.9208 5.9126,4.3518 C5.6166,4.5678 5.3306,4.8008 5.0666,5.0658 C5.0536,5.0798 5.0416,5.0948 5.0266,5.1098 C5.5756,6.4268 6.8946,8.4088 9.2596,10.7728 C11.6206,13.1338 13.6046,14.4538 14.9246,15.0028 C14.9376,14.9898 14.9526,14.9778 14.9666,14.9638 C15.2316,14.6988 15.4646,14.4128 15.6786,14.1178 C16.1096,15.1028 16.0526,15.6748 15.8286,15.8998 M16.7526,11.8998 C17.4066,9.5458 16.8136,6.9138 14.9666,5.0658 C13.6436,3.7438 11.8866,3.0148 10.0166,3.0148 C9.3686,3.0148 8.7356,3.1078 8.1286,3.2768 C5.7306,1.7598 3.9176,1.5898 2.7176,2.7898 C1.4036,4.1028 2.0736,6.1918 3.2866,8.1688 C2.6446,10.5128 3.2276,13.1258 5.0666,14.9638 C6.3886,16.2868 8.1456,17.0148 10.0166,17.0148 C10.6536,17.0148 11.2746,16.9178 11.8736,16.7518 C13.0856,17.4938 14.3406,18.0318 15.4316,18.0318 C16.1156,18.0318 16.7366,17.8198 17.2426,17.3138 C18.4416,16.1138 18.2706,14.2988 16.7526,11.8998" />
//     </svg>
//   );
// }

/*

Styling data:

  Banner:
    banner_background_image -> REDESIGN banner background
    banner_background_color -> REDESIGN banner background color
    banner_img              -> MOBILE header
  
  Icon:
    community_icon          -> REDESIGN icon
    header_img              -> OLD icon
    icon_img                -> MOBILE icon

*/

// function Banner(props) {
//   const {
//     community_icon,
//     icon_img,
//     primary_color,
//     key_color,
//     backgroundColor,
//     backgroundImage,
//     alt,
//     title,
//   } = props;
//   let headerIcon = community_icon || icon_img || null;
//   let color = backgroundColor || primary_color || key_color || null;
//   if (headerIcon || backgroundImage) {
//     return (
//       <div
//         className="banner"
//         style={{
//           backgroundColor: color,
//           borderBottomColor: color,
//           backgroundImage: "url(" + backgroundImage + ")",
//         }}
//       >
//         {headerIcon ? (
//           <div
//             className="icon"
//             style={{
//               backgroundImage: "url(" + headerIcon + ")",
//               backgroundColor: color,
//             }}
//             alt={alt}
//             title={title}
//           />
//         ) : null}
//       </div>
//     );
//   }
//   return null;
// }

class SubredditHeader extends React.Component {
  constructor(props) {
    super(props);
    const { subreddits, currentSubredditName } = props;
    this.state = {
      subscribed: subreddits[currentSubredditName.toLowerCase()]
        ? subreddits[currentSubredditName.toLowerCase()].subscribed
        : null,
    };
    this.toggleSubscribe = this.toggleSubscribe.bind(this);
  }
  toggleSubscribe() {
    this.setState({
      subscribed: !this.state.subscribed,
    });
  }
  render() {
    const { subreddits, currentSubredditName } = this.props;
    if (subreddits[currentSubredditName.toLowerCase()] === undefined) return null;
    const {
      banner_background_color,
      banner_background_image,
      // display_name_prefixed,
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
    } = this.props;
    if (id) {
      let bgColor = primary_color || key_color || null;

      const className = this.props.card
        ? "subreddit-header card"
        : "subreddit-header";

      return (
        <div className={className}>
          <div
            className="banner"
            style={{
              backgroundColor:
                banner_background_color || primary_color || key_color || null,
              borderBottomColor:
                banner_background_color || primary_color || key_color || null,
              backgroundImage: "url(" + banner_background_image + ")",
            }}
          >
            <SubredditIcon subredditInfo={this.props} />
          </div>
          <div className="description">
            <div className="actions">
              <span>{formatNumber(subscribers, "user")}</span>
              <span>{formatNumber(accounts_active, "active user")}</span>
              <button
                className={
                  this.state.subscribed ? "button leave" : "button join"
                }
                style={
                  this.state.subscribed
                    ? {
                        color: bgColor,
                      }
                    : {
                        backgroundColor: bgColor,
                        color: overlayTextColor(bgColor),
                      }
                }
                onClick={this.toggleSubscribe}
              >
                {this.state.subscribed ? "Leave" : "Join"}
              </button>
            </div>
          </div>

          {/* <div className="description">
            <Link to={url} className="subreddit-name">
              {display_name_prefixed}
            </Link>
            
            <div className="info-banner">
              Created <Time time={created_utc} />
            </div>

            
            {title}
            <div
              className="body"
              dangerouslySetInnerHTML={{
                __html: public_description_html,
              }}
            />
          </div>*/}
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  const { subreddits, currentSubredditName } = state;
  return { subreddits, currentSubredditName };
}

export default connect(mapStateToProps)(SubredditHeader);
