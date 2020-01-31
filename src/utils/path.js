export default ({ subreddit, username, sort, time, type, query }) => {
  // sorts[0] is always default and shouldn't be shown in URL
  const sorts = query
    ? ["relevance", "top", "new", "comments"]
    : subreddit
    ? ["hot", "new", "controversial", "top", "rising"]
    : username
    ? ["new", "hot", "top"]
    : // frontpage
      ["best", "hot", "new", "controversial", "top", "rising"];

  // times only when sort === "top" or "controversial"
  const times = ["hour", "day", "week", "month", "year", "all"];

  // types only on user page
  const types = [
    "overview",
    "posts",
    "comments",
    "saved", // only on logged-in-user page
    "hidden", // ^
    "upvoted", // only on logged-in-user page OR on users who have enabled setting
    "downvoted", // ^
  ];

  let searchParams = new URLSearchParams();

  let path = subreddit
    ? query
      ? `/r/${subreddit}/search/`
      : `/r/${subreddit}`
    : query
    ? "/search/"
    : username
    ? `/user/${username}`
    : "/";

  if (type && types.includes(type) && type !== types[0]) path += type + "/";

  if (query) searchParams.append("q", query);

  if (sort && sorts.includes(sort) && sort !== sorts[0]) {
    if (subreddit && !query) path += "/" + sort + "/";
    else searchParams.append("s", sort);
  }

  if (
    time &&
    times.includes(time) &&
    sort &&
    (sort === "top" || sort === "controversial")
  )
    searchParams.append("t", time);

  const params = searchParams.toString();

  return params.length > 0 ? path + "?" + params : path;

  // return ({
  //   path: searchParams.entries().length > 0 ? `${path}?${searchParams.toString()}` : path,
  //   params: searchParams.toString(),
  // }) 
  // return searchParams.entries().length > 0 ? `${path}?${searchParams.toString()}` : path;
};

export const modifyPath = ({
  path,
  subreddit,
  username,
  sort,
  time,
  type,
  query,
}) => {};
