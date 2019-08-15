const initialState = {
  refreshToken: undefined,
  user: null,
  userPrefs: { nightmode: false },
  subreddits: {},
  subscriptionNames: [],
  favoriteNames: [],
  defaultNames: [],
  multireddits: [],
  currentPost: null,
  locationName: "Frontpage",
  themesBySubreddit: {},
  themesByColor: {},
  themePrefs: { syncSystemTheme: true, syncRedditTheme: false },
};

const store = (state = initialState, action) => {
  var {
    user,
    subreddits,
    lightboxIsOpen,
    themesBySubreddit,
    themesByColor,
  } = state;

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
    case "SET_USER_PREFS":
      return { ...state, userPrefs: action.prefs };
    case "SET_THEME_PREFS":
      return { ...state, themePrefs: { ...state.themePrefs, ...action.prefs } };
    case "SET_NIGHTMODE":
      return {
        ...state,
        userPrefs: { ...state.userPrefs, nightmode: action.nightmode },
      };
    case "SET_SUBSCRIPTIONS":
      let favoriteNames = [];
      const subscriptionNames = action.subscriptions.reduce(
        (names, subscription) => {
          // Adds the subreddit info to the subreddits store
          subreddits[subscription.display_name.toLowerCase()] = subscription;

          if (subscription.user_has_favorited) {
            favoriteNames.push(subscription.display_name.toLowerCase());
          } else {
            names.push(subscription.display_name.toLowerCase());
          }
          return names;
        },
        []
      );
      return { ...state, subreddits, subscriptionNames, favoriteNames };
    case "SET_DEFAULTS":
      console.log("Storing defaults");
      const defaultNames = action.defaults.map((sub) => {
        subreddits[sub.display_name.toLowerCase()] = sub;
        return sub.display_name.toLowerCase();
      });
      return { ...state, subreddits, defaultNames };
    case "SET_MULTIREDDITS":
      return { ...state, multireddits: action.multis };
    case "ADD_SUBREDDIT":
      subreddits[action.subredditInfo.display_name.toLowerCase()] =
        action.subredditInfo;
      return { ...state, subreddits };
    case "TOGGLE_LIGHTBOX_IS_OPEN":
      return { ...state, lightboxIsOpen: !lightboxIsOpen };
    case "SET_CURRENT_POST":
      return { ...state, currentPost: action.post };
    case "SET_LOCATION_NAME":
      return { ...state, locationName: action.name };
    case "SET_USE_SYSTEM_THEME":
      return { ...state, useSystemTheme: action.bool };
    case "ADD_SUBREDDIT_THEME":
      themesBySubreddit[action.subName] = action.theme;
      return { ...state, themesBySubreddit };
    case "ADD_COLOR_THEME":
      themesByColor[action.color] = action.theme;
      return { ...state, themesByColor };
    case "LOGOUT":
      for (let [subName, sub] of Object.entries(subreddits)) {
        if (sub.subreddit_type === "private") subreddits[subName] = undefined;
      }
      return {
        ...state,
        subscriptionNames: [],
        favoriteNames: [],
        multireddits: [],
        user: null,
        refreshToken: undefined,
        userPrefs: { nightmode: state.userPrefs.nightmode },
        subreddits,
      };
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
