import React from "react";

import { SimplifyNumber } from "./simplify-number";

import { ReactComponent as UpvoteIcon } from "../icons/chevron-up.svg";
import { ReactComponent as DownvoteIcon } from "../icons/chevron-down.svg";

export const Votes = props => {
  const { mod, score, upvote, downvote, showDot } = props;

  let _className = "votes";
  _className += mod === 1 ? " upvoted" : mod === -1 ? " downvoted" : "";

  return (
    <div className={_className}>
      <button className="upvote" onClick={upvote}>
        <UpvoteIcon />
      </button>
      {score ? (
        <SimplifyNumber className="score" number={score} />
      ) : showDot ? (
        <span>•</span>
      ) : null}
      <button className="downvote" onClick={downvote}>
        <DownvoteIcon />
      </button>
    </div>
  );
};

// <svg
//   version="1.1"
//   xmlns="http://www.w3.org/2000/svg"
//   x="0px"
//   y="0px"
//   width="12px"
//   height="12px"
//   viewBox="0 0 12 12"
// >
//   <polygon points="8.5,12 3.5,12 3.5,7.6 0,7.6 6,0 12,7.6 8.5,7.6 " />
// </svg>;

//         <svg
//           version="1.1"
//           xmlns="http://www.w3.org/2000/svg"
//           x="0px"
//           y="0px"
//           width="12px"
//           height="12px"
//           viewBox="0 0 12 12"
//         >
//           <polygon points="3.5,0 8.5,0 8.5,4.4 12,4.4 6,12 0,4.4 3.5,4.4 " />
//         </svg>;
