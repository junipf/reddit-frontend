export const setRefreshToken = (token) => ({
  type: "SET_REFRESH_TOKEN",
  token,
});

export const setUser = (user) => ({
  type: "SET_USER",
  user,
});

export const setThemePrefs = (prefs) => ({
  type: "SET_THEME_PREFS",
  prefs,
})

export const setUserPrefs = (prefs) => ({
  type: "SET_USER_PREFS",
  prefs,
});

export const setNightmode = (nightmode) => ({
  type: "SET_NIGHTMODE",
  nightmode,
});

export const setSubscriptions = (subscriptions) => ({
  type: "SET_SUBSCRIPTIONS",
  subscriptions,
});

export const setMultireddits = (multis) => ({
  type: "SET_MULTIREDDITS",
  multis,
});

export const setDefaults = (defaults) => ({
  type: "SET_DEFAULTS",
  defaults,
});

export const setLocationName = (name) => {
  return {
    type: "SET_LOCATION_NAME",
    name,
  };
};

export const addSubreddit = (subredditInfo) => ({
  type: "ADD_SUBREDDIT",
  subredditInfo,
});

export const toggleLightboxIsOpen = () => ({ type: "TOGGLE_LIGHTBOX_IS_OPEN" });

export const setCurrentPost = (post) => ({ type: "SET_CURRENT_POST", post });

export const setUseSystemTheme = (bool) => ({
  type: "SET_USE_SYSTEM_THEME",
  bool,
});

export const addSubredditTheme = (subName, theme) => ({
  type: "ADD_SUBREDDIT_THEME",
  subName,
  theme,
});

export const addColorTheme = (color, theme) => ({
  type: "ADD_COLOR_THEME",
  color,
  theme,
});

export const logout = () => ({ type: "LOGOUT" });
