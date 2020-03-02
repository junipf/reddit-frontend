import React, { useState, useEffect, useRef } from "react";
import Input from "../components/input";
import ReactTooltip from "react-tooltip";
import { map } from "./settings";

const sorts = map.sorts.search;
const times = map.times;

export default ({ history, location, match: { params: path } }) => {
  const searchParams = new URLSearchParams(location.search);

  const initialSearch = {
    nsfw: false,
    value: searchParams.get("q") || "",
    query: searchParams.get("q") || "",
    sort: path.sort || "relevance",
    time: searchParams.get("t") || "all",
    subreddit: path.subName || null,
  };
  const [search, setSearch] = useState(initialSearch);

  const handleInput = (e) => {
    const value = e.target.value;
    let search = {
      ...initialSearch,
      value,
    };
    let queries = [];

    value.split(" ").forEach((v) => {
      if (v === "nsfw") search.nsfw = true;
      else if (sorts.includes(v)) search.sort = v;
      else if (times.includes(v)) search.time = v;
      else if (v.startsWith("r/")) search.subreddit = v.slice(2).toString();
      else queries.push(v);
    });

    search.query = queries.join(" ");

    setSearch(search);
  };

  const $input = useRef(null);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const submit = (e) => {
    const { subreddit, sort, time, query } = search;
    console.log(search);
    history.push(
      (subreddit ? "/r/" + subreddit : "") +
        "/search/" +
        (sort && sort !== "relevance" ? sort + "/" : "") +
        "?q=" +
        query +
        (time && time !== "all" ? "&t=" + time : ""),
      { subreddit }
    );
  };

  return (
    <Input
      placeholder={`Search ${path.subName ? "r/" + path.subName : "reddit"}`}
      forwardRef={$input}
      onChange={handleInput}
      onSubmit={submit}
      value={search.value}
      type="search"
      clear
      submit
      expand
    />
  );
};
