import React, { useState, useContext, useEffect, useRef } from "react";
import styled from "styled-components";

// import UniqueId from "../utils/unique-id";
import { Requester } from "./requester";
import Button from "./button";
// import Icon from "./icon";
// import Dropdown from "./dropdown";
import Input from "./input";
// import SubredditCard from "./subreddit-card";
import ReactTooltip from "react-tooltip";
// import Dropdown from "./dropdown";
// import { SpinnerPage } from "./spinner";
// import { SubredditEntry } from "./subscription-list";
// import uniqueId from "../utils/unique-id";
// import Post from "../containers/post";
// import Error from "../components/error";

// const search = [
//   { type: "setting", query: "nsfw" },
//   { type: "sub", query: "firef", suggestions: ["firefox", "FirefoxOS"] },
//   { type: "keyword", query: "so on" },
// ];

const SubSearch = ({ query, nsfw: includeNsfw, setAutocomplete, focus }) => {
  const r = useContext(Requester);
  const [suggestions, setSuggestions] = useState([]);
  const $suggestions = useRef(null);

  useEffect(() => {
    setFocusItem(-1);
    r.searchSubredditNames({ query, includeNsfw }).then((result) => {
      setSuggestions(
        result.map((suggestion) => {
          for (let i = query.length; i > 0; i--) {
            const shortQuery = query.slice(0, i);
            if (suggestion.toLowerCase().startsWith(shortQuery.toLowerCase()))
              return {
                matched: shortQuery,
                afterMatch: suggestion.slice(i),
                suggestion,
              };
          }
          return {
            matched: "",
            afterMatch: suggestion,
            suggestion,
          };
        })
      );
    });
  }, [r, query, includeNsfw]);

  // console.log(suggestions);

  const [focusItem, setFocusItem] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        setFocusItem((f) =>
          f + 1 > suggestions.length - 1 ? suggestions.length - 1 : f + 1
        );
        // console.log("🔽");
      }
      if (e.key === "ArrowUp") {
        setFocusItem((f) => (f - 1 < -1 ? -1 : f - 1));
        // console.log("🔼");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  setAutocomplete(
    suggestions[focusItem] ? suggestions[focusItem].suggestion : ""
  );

  console.log(suggestions);

  return suggestions.length > 0 && focus ? (
    <Suggestions ref={$suggestions}>
      {suggestions.map(({ matched, afterMatch, suggestion }, i) => (
        <Button
          key={i}
          fill
          onClick={setAutocomplete}
          value={`r/${suggestion}`}
          flat={i !== focusItem}
        >
          <span>
            r/
            {matched}
            <HighlightSpan>{afterMatch}</HighlightSpan>
          </span>
        </Button>
      ))}
    </Suggestions>
  ) : null;
};

// const Query = styled.span`
//   position: relative;
// `;

// const SuggestionsWrapper = styled.span`
//   position: relative;
// `;

const Suggestions = styled.div`
  position: absolute;
  top: 100%;
  /* left: 0; */
  /* max-width: 30rem; */
  width: 10rem;
  border: 1px solid ${({ theme }) => theme.card.border};
  background-color: ${({ theme }) => theme.card.bg};
  padding: 0.25em 0;
  border-radius: 0.25em;
`;

export const sorts = ["relevance", "top", "new", "comments"];
export const times = ["hour", "day", "week", "month", "year", "all"];

export default ({ history, location, match: { params: path } }) => {
  const r = useContext(Requester);

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
  // const [results, setResults] = useState([]);
  // const [error, setError] = useState(null);

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

    // setSearch({
    //   value: e.target.value,
    //   nsfw: values.includes("nsfw"),
    //   parsed: values.map((value) =>
    //     value === "nsfw"
    //       ? { type: "setting", value }
    //       : value.startsWith("r/")
    //       ? { type: "sub", value }
    //       : { type: "word", value }
    //   ),
    // });
  };

  const $wrapper = useRef(null);
  const $input = useRef(null);

  // const [focus, setFocus] = useState(false);
  // const [pos, setPos] = useState(null);
  // const handleFocus = (e, $wrapper) => {
  //   setFocus(true);
  //   if ($wrapper.current) setPos($wrapper.current.getBoundingClientRect());
  // };
  // const handleBlur = () => {
  //   setFocus(false);
  // };

  // const $wrapper = useRef(null);

  // useEffect(() => {
  //   const handleClick = (e) => {
  //     if ($wrapper.current && $wrapper.current.contains(e.target)) return;
  //     setFocus(false);
  //   };

  //   if (focus) {
  //     document.addEventListener("click", handleClick, false);
  //   } else {
  //     document.removeEventListener("click", handleClick, false);
  //   }
  //   return () => {
  //     document.removeEventListener("click", handleClick, false);
  //   };
  // });

  useEffect(() => {
    ReactTooltip.rebuild();
  });
  // const [loading, setLoading] = useState(false);
  // const submit = () => {
  //   if (search.value !== "") {
  //     setLoading(true);
  //     setResults([]);
  //     setError(null);
  //     console.log(search);
  //     r.search(search)
  //       .then((results) => {
  //         setResults(results);
  //         console.log(results);
  //         setLoading(false);
  //       })
  //       .catch((e) => {
  //         setError({ type: "search", name: `"${search.query}"`, e });
  //         setLoading(false);
  //       }
  //       );
  //   }
  // };

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
      // `/search/?q=${query}&sort=${sort}&time=${time}`,
      { subreddit }
    );
  };

  const handleClear = () => {
    setSearch((s) => ({ ...s, query: "" }));
    // setResults([]);
    // setError(null);
  };

  // const [autocomplete, setAutocomplete] = useState("");

  // const [suggestions, setSuggestions] = useState([]);

  // useEffect(() => {
  //   const { query, includeNsfw } = search;
  //   // setFocusItem(-1);
  //   r.searchSubredditNames({ query, includeNsfw }).then((result) => {
  //     setSuggestions(
  //       result.map((suggestion) => {
  //         for (let i = query.length; i > 0; i--) {
  //           const shortQuery = query.slice(0, i);
  //           if (suggestion.toLowerCase().startsWith(shortQuery.toLowerCase()))
  //             return {
  //               matched: shortQuery,
  //               afterMatch: suggestion.slice(i),
  //               suggestion,
  //             };
  //         }
  //         return {
  //           matched: "",
  //           afterMatch: suggestion,
  //           suggestion,
  //         };
  //       })
  //     );
  //   });
  // }, [r, search]);

  return (
    <>
      <Wrapper ref={$wrapper}>
        <Input
          placeholder={`Search ${
            path.subName ? "r/" + path.subName : "reddit"
          }`}
          forwardRef={$input}
          onChange={handleInput}
          onSubmit={submit}
          // onFocus={handleFocus}
          // onBlur={handleBlur}
          onClear={handleClear}
          value={search.value}
          // autocomplete={autocomplete}
          type="search"
          clear
          submit
          wide
        >
          {/* {search.subreddit ? (
        <SubSearch
          query={search.subreddit}
          nsfw={search.nsfw}
          setAutocomplete={setAutocomplete}
          focus={focus}
        />
      ) : null} */}
        </Input>
        {/* <Expando focus={focus} pos={pos}>
        <Content focus={focus}>
          <Button>Button</Button>
          <Button>Button</Button>
          <Button>Button</Button>
        </Content>
      </Expando> */}
      </Wrapper>
    </>
  );
  // return (
  //   // <Wrapper ref={$wrapper}>
  //     // <Searchbar>
  //       <Input
  //         placeholder={`Search ${
  //           path.subName ? "r/" + path.subName : "reddit"
  //         }`}
  //         onChange={handleInput}
  //         onSubmit={submit}
  //         onFocus={handleFocus}
  //         onBlur={handleBlur}
  //         onClear={handleClear}
  //         value={search.value}
  //         autocomplete={autocomplete}
  //         type="search"
  //         clear
  //         submit
  //         wide
  //       >
  //         {search.subreddit ? (
  //           <SubSearch
  //             query={search.subreddit}
  //             nsfw={search.nsfw}
  //             setAutocomplete={setAutocomplete}
  //             focus={focus}
  //           />
  //         ) : null}

  //         {/* {search.sort ? (
  //           <Dropdown onSelect={setSort} label={search.sort}>
  //             {sorts.map((sort) => (
  //               <Button value={sort} toggled={search.sort === sort}>
  //                 {sort}
  //               </Button>
  //             ))}
  //           </Dropdown>
  //         ) : null} */}

  //         {/* {search.time ? (
  //           <Dropdown onSelect={setTime} label={search.time}>
  //             {times.map((time) => (
  //               <Button value={time} toggled={search.time === time}>
  //                 {time}
  //               </Button>
  //             ))}
  //           </Dropdown>
  //         ) : null} */}

  //         {/* {search.parsed.map(({ type, value }) =>
  //           type === "sub" ? (
  //             <SubSearch
  //               query={value}
  //               nsfw={search.nsfw}
  //               setAutocomplete={setAutocomplete}
  //               focus={focus}
  //             />
  //           ) : null
  //         )} */}
  //         <SearchExpando expand={focus}>Hints go here?</SearchExpando>
  //       </Input>
  //     // </Searchbar>
  //   // </Wrapper>
  // );
};

const Wrapper = styled.div`
  border: 1px solid ${({ focus, theme }) => (focus ? "pink" : "transparent")};
  border-radius: 0.25rem;
  background: ${({ focus, theme }) => (focus ? "grey" : "transparent")};
  padding: 0.125rem 0.5rem 0.5rem 0.5rem;
  width: 100%;
  max-width: 75rem;
  overflow: visible;
  /* top: 0; */
  & > input {
    margin: 0;
  }
`;

// const Expando = styled.div.attrs(({ pos }) =>
//   pos
//     ? {
//         style: {
//           top: pos.top + pos.height,
//           left: pos.left,
//           right: pos.right,
//           width: pos.width,
//         },
//       }
//     : {}
// )`
//   position: absolute;
//   background: ${({ focus, theme }) => (focus ? theme.card.innerBg : "transparent")};
//   border: 1px solid ${({ focus, theme }) => (focus ? theme.card.border : "transparent")};
//   border-radius: 0.25rem;
// `;

const Content = styled.div`
  height: ${({ focus }) => (focus ? "30em" : "0")};
  overflow: hidden;
  transition: height 250ms ease;
  width: 100%;
`;

const HighlightSpan = styled.span`
  color: ${({ theme }) => theme.primary.text};
  /* background-color: ${({ theme }) => theme.primary.base}; */
  /* color: ${({ theme }) => theme.primary.overlay}; */
`;

// const SearchExpando = styled.div`
//   background: ${({ expand, theme }) =>
//     expand ? theme.card.bg : "transparent"};
//   border: 1px solid
//     ${({ expand, theme }) => (expand ? theme.card.border : "transparent")};
//   color: ${({ theme }) => theme.text};
//   /* position: fixed; */
//   position: absolute;
//   left: 0;
//   right: 0;
//   top: 100%;
//   z-index: -1;
//   padding: ${({ expand }) => (expand ? 0.125 : 0)}em;
//   margin: ${({ expand }) => (expand ? 0 : 0.125)}em 0;

//   display: flex;
//   flex-flow: column nowrap;
//   /* max-width: 30em; */
//   border-radius: 0.5em;
//   transition: all 250ms ease;
// `;

// const Results = styled.div`
//   width: auto;
//   min-width: 250px;
//   height: ${({ expand }) => (expand ? "auto" : 0)};
//   scrollbar-width: thin;
//   scrollbar-color: ${({ theme }) => theme.scrollbar};
//   margin-top: 2rem;
//   overflow-y: auto;
//   max-height: 80vh;
// `;
