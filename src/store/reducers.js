const initialState = {
  refreshToken: undefined,
  user: null,
  userPrefs: { nightmode: false },
  subreddits: {},
  subscriptions: [],
  defaults: [],
  // subscriptionNames: [],
  // favoriteNames: [],
  // defaultNames: [],
  multireddits: [],
  currentPost: null,
  location: {
    name: "Frontpage",
    type: "listing",
  },
  themesBySubreddit: {},
  themesByColor: {},
  themePrefs: {
    useSubredditThemes: true,
    useFlairThemes: true,
    syncSystemTheme: true,
    syncRedditTheme: false,
    useDarkThemes: false,
    lightTheme: "light",
    darkTheme: "dark",
    colorTheme: "blue",
    darkSystem: false,
  },
  layoutPrefs: {
    split: "right",
  },
  postListingSettings: {
    sort: "hot",
    time: "all",
    subName: null,
    visible: true,
  },
  threadSettings: {
    sort: "best",
    visible: false,
  },
};

const store = (state = initialState, action) => {
  var {
    user,
    subreddits,
    lightboxIsOpen,
    themesBySubreddit,
    themesByColor,
  } = state;
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
    case "SET_LAYOUT_PREFS":
      return {
        ...state,
        layoutPrefs: { ...state.layoutPrefs, ...action.prefs },
      };
    case "SET_SUBSCRIPTIONS":
      action.subscriptions.forEach((sub) => {
        const subName = sub.display_name.toLowerCase();
        subreddits[subName] = sub;
      });
      return { ...state, subreddits, subscriptions: action.subscriptions };
      // let favoriteNames = [];
      // let subscriptionNames = action.subscriptions;
      // subscriptionNames.forEach((sub, i, array) => {
      //   const subName = sub.display_name.toLowerCase();
      //   subreddits[subName] = sub;
      //   array[i] = subName;
      //   if (sub.user_has_favorited) favoriteNames.push(subName);
      // });
      // return { ...state, subreddits, subscriptionNames, favoriteNames };
    case "SET_DEFAULTS":
      action.defaults.forEach((sub) => {
        const subName = sub.display_name.toLowerCase();
        subreddits[subName] = sub;
      });
      return { ...state, subreddits, defaults: action.defaults };
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
    case "SET_LOCATION":
      return { ...state, location: action.location };
    case "ADD_SUBREDDIT_THEME":
      themesBySubreddit[action.subName] = action.theme;
      return { ...state, themesBySubreddit };
    case "ADD_COLOR_THEME":
      themesByColor[action.color] = action.theme;
      return { ...state, themesByColor };
    case "LOGOUT":
      return {
        ...initialState,
        themePrefs: state.themePrefs,
      };
    case "SET_THREAD_SETTINGS":
      return {
        ...state,
        threadSettings: {
          ...state.threadSettings,
          ...action.settings,
        },
      };
    case "SET_POST_LISTING_SETTINGS":
      return {
        ...state,
        postListingSettings: {
          ...state.postListingSettings,
          ...action.settings,
        },
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
