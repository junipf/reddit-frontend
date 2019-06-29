/* eslint-disable array-callback-return */
// import { combineReducers } from "redux";
// import tokens from "./tokens";
// import user from "./user";
// import subredditInfo from "./subreddit-info";

// export default combineReducers({
//   tokens,
//   user,
//   subredditInfo
// });

const initialState = {
  refreshToken: undefined,
  user: {},
  subreddits: { frontpage: {} },
  subscriptionNames: [],
  favoriteNames: [],
  multireddits: [],
  currentPost: null,
  themesBySubreddit: {},
  themesByColor: {},
};
const store = (state = initialState, action) => {
  var { user, subreddits, lightboxIsOpen, themesBySubreddit, themesByColor } = state;

  // console.log("REDUCER ACTION: ", action);
  switch (action.type) {
    case "SET_REFRESH_TOKEN":
      return Object.assign({}, state, {
        refreshToken: action.token,
      });
    case "SET_USER":
      const {
        _hasFetched,
        name,
        icon_img,
        id,
        created_utc,
        link_karma,
        comment_karma,
        has_mail,
        inbox_count,
        has_mod_mail,
        new_modmail_exists,
        is_employee,
        num_friends,
        over_18,
        is_mod,
        is_gold,
        is_suspended,
        pref_nightmode,
        has_subscribed,
      } = action.user;
      user = {
        _hasFetched,
        name,
        icon_img,
        id,
        created_utc,
        link_karma,
        comment_karma,
        has_mail,
        inbox_count,
        has_mod_mail,
        new_modmail_exists,
        is_employee,
        num_friends,
        over_18,
        is_mod,
        is_gold,
        is_suspended,
        pref_nightmode,
        has_subscribed,
      };
      return { ...state, user };
    case "SET_SUBSCRIPTIONS":
      let favoriteNames = [];
      const subscriptionNames = action.subscriptions.reduce(
        (names, subscription) => {
          // Adds the subreddit info to the subreddits store
          subreddits[subscription.display_name] = subscription;

          if (subscription.user_has_favorited) {
            favoriteNames.push(subscription.display_name);
          } else {
            names.push(subscription.display_name);
          }
          return names;
        },
        []
      );
      return { ...state, subreddits, subscriptionNames, favoriteNames };
    case "SET_MULTIREDDITS":
      return { ...state, multireddits: action.multis };
    case "ADD_SUBREDDIT":
      subreddits[action.subredditInfo.display_name] = action.subredditInfo;
      return { ...state, subreddits };
    // case "ADD_POST":
    //   const { comments, ...post } = action.post;
    //   postsById[post.id] = post;
    //   if (comments && comments.length > 0) {
    //     commentsById[post.id] = comments;
    //   }
    //   return { ...state, postsById, commentsById };
    // case "SET_HOT":
    //   if (hotIdsBySubreddit[action.subredditName] === undefined) {
    //     hotIdsBySubreddit[action.subredditName] = [];
    //   }

    //   action.listing.map(post => {
    //     hotIdsBySubreddit[action.subredditName].push(post.id);
    //     postsById[post.id] = post;
    //   });

    //   return { ...state, hotIdsBySubreddit, postsById };
    // case "CLEAR_HOT":
    //   hotIdsBySubreddit[action.subredditName] = [];
    //   return { ...state, hotIdsBySubreddit };
    // case "ADD_HOT":
    //   if (hotIdsBySubreddit[action.subredditName] === undefined) {
    //     hotIdsBySubreddit[action.subredditName] = [];
    //   }

    //   action.listing.map(post => {
    //     if (!hotIdsBySubreddit[action.subredditName].includes(post.id)) {
    //       hotIdsBySubreddit[action.subredditName].push(post.id);
    //     }
    //     postsById[post.id] = post;
    //   });
    //   return { ...state, hotIdsBySubreddit, postsById };
    case "TOGGLE_LIGHTBOX_IS_OPEN":
      return { ...state, lightboxIsOpen: !lightboxIsOpen };
    case "SET_CURRENT_POST":
      return { ...state, currentPost: action.post };
    case "SET_PREF_DARKTHEME":
      return { ...state, prefDarkTheme: action.bool };
    case "ADD_SUBREDDIT_THEME":
      themesBySubreddit[action.subredditName] = action.theme;
      return { ...state, themesBySubreddit};
    case "ADD_COLOR_THEME":
      themesByColor[action.color] = action.theme;
      return { ...state, themesByColor };
    default:
      return state;
  }
};

export default store;

/*

{
  refreshToken: ""
  user: {}
  currentPostId: ""
  currentSubredditName: ""
  subreddits: {}
  postsById: {}
  commentsById: {}
  hotIdsBySubreddit: {}
  
  
}


*/
