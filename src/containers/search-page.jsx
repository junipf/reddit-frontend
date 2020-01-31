import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  // useCallback,
  // useMemo,
} from "react";
// import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Requester } from "../components/requester";
// import uniqueId from "../utils/unique-id";
// import {
//   setLocation,
// } from "../store/actions";
// import styled from "styled-components";

// import { SpinnerPage } from "../components/spinner";
// import genTheme from "../style/gen-theme";
// import ReactTooltip from "react-tooltip";
// import SubredditBanner from "../components/subreddit-banner";
import { addSubreddit, addSubredditTheme } from "../store/actions";
import Post, { PostPlaceholder } from "./post";
import useIntersect from "../utils/use-intersect";
import Error from "../components/error";

import { Column } from "../containers/column";
import { SpinnerPage } from "../components/spinner";
import { SubredditEntry } from "./../components/subscription-list";
import Comment from "./comment";
// import Dropdown from "./../components/dropdown";
// import Button from "../components/button";
// import { sorts, times } from "./../components/search";

// const HorizontalList = styled.div`
//   display: flex;
//   flex-flow: row wrap;
//   overflow: auto;
//   max-height: 50vh;
//   width: 100%;
//   background-color: ${({ theme }) => theme.card.bg};
//   border: 1px solid ${({ theme }) => theme.card.border};
//   font-size: 8px;
//   & > * {
//     flex: 1 1 auto;
//     min-width: 300px;
//     max-width: 600px;
//   }
// `;

const PostPlaceholderLoader = ({ onIntersect }) => {
  const [ref, entry] = useIntersect({
    threshold: [0],
    rootMargin: "0px 0px 2000px 0px",
  });

  useEffect(() => {
    if (entry.isIntersecting) onIntersect();
  }, [entry.isIntersecting, onIntersect]);

  return <PostPlaceholder forwardRef={ref} />;
};
export default connect(
  ({
    subreddits,
    lightboxIsOpen,
    themesBySubreddit,
    themesByColor,
    // postListingSettings,
  }) => ({
    subreddits,
    lightboxIsOpen,
    themesBySubreddit,
    themesByColor,
    // settings: postListingSettings,
  }),
  {
    addSubreddit,
    // addSubredditTheme,
    // addColorTheme,
    // setLocation,
  }
)(
  ({
    history,
    location,
    match: { params: path },
    subreddits,
    addSubreddit,
  }) => {
    const r = useContext(Requester);
    const [error, setError] = useState(null);
    const [listing, setListing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState({
      restrictSr: true,
      syntax: "play",
      query: "",
      sort: "relevance",
      time: "all",
      subreddit: undefined,
      nsfw: false,
      quarantine: false,
    });

    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      setSearch((search) => ({
        ...search,
        query: searchParams.get("q"),
        sort: path.sort || "relevance",
        time: searchParams.get("t") || "all",
        subreddit: path.subName,
        nsfw: searchParams.get("nsfw") || false,
        quarantine: searchParams.get("quarantine") || false,
      }));
    }, [location.search, path]);

    // const postSearch = useCallback(() => {
    //   if (
    //     listing.length === 0 ||
    //     (listing._query &&
    //       (listing._query.q !== search.query ||
    //         listing._query.subreddit !== search.subreddit ||
    //         listing._query.subreddit !== ""))
    //   )
    //     r.search(search)
    //       .then((listing) => {
    //         // console.log(results.search, search);
    //         // let listing = [...results];
    //         // listing.search = search;
    //         setListing(listing);
    //         console.log("Search results", listing);
    //         setLoading(false);
    //       })
    //       .catch((e) => {
    //         setError({ type: "search", name: `"${search.query}"`, e });
    //         setLoading(false);
    //       });
    // }, [r, search, listing]);

    useEffect(() => {
      if (search && (search.query !== "" || search.subreddit)) {
        setListing([]);
        setError(null);
        setLoading(true);
        r.search(search)
          .then((listing) => {
            // console.log(results.search, search);
            // let listing = [...results];
            // listing.search = search;
            setListing(listing);
            console.log("Search results", listing);
            setLoading(false);
          })
          .catch((e) => {
            setError({ type: "search", name: `"${search.query}"`, e });
            setLoading(false);
          });
      }
    }, [search, r]);

    const [fetchingMore, setFetchingMore] = useState(false);

    const fetchMore = useCallback(() => {
      setFetchingMore(true);
      listing.fetchMore({ amount: 25 }).then(
        (listing) => {
          setListing(listing);
          setFetchingMore(false);
        },
        (e) => {
          setError({ name: "Fetch more", e, type: "subreddit" });
          setFetchingMore(false);
        }
      );
    }, [listing]);

    const handleIntersect = () => {
      if (!loading && !fetchingMore && listing && listing.isFinished === false)
        fetchMore();
    };

    const fetchSubreddit = useCallback(
      (subName) => {
        if (
          subName &&
          subName !== "frontpage" &&
          subName !== "popular" &&
          subName !== "all" &&
          subreddits[subName.toLowerCase()] === undefined
        ) {
          r.getSubreddit(subName)
            .refresh()
            .then(
              (subreddit) => {
                // Stores subreddit info.
                addSubreddit(subreddit);
              },
              (e) => {
                setError({ name: `r/${subName}`, e, type: "subreddit" });
              }
            );
        }
      },
      [r, subreddits, addSubreddit]
    );

    // LISTING
    useEffect(() => {
      // Generate list of subreddits to be fetched
      // and link flair colors to generate themes on
      if (listing.length === 0) return;

      const subreddits = listing.reduce((subs, thing) => {
        const subName =
          thing.subreddit && thing.subreddit.display_name
            ? thing.subreddit.display_name.toLowerCase()
            : null;
        if (subName && !subs.includes(subName)) subs.push(subName);
        return subs;
      }, []);
      subreddits.forEach((subName) => {
        if (subreddits[subName] === undefined) {
          fetchSubreddit(subName);
        }
      });
    }, [listing, fetchSubreddit]);

    return (
      <Column>
        {error ? (
          <Error {...error} />
        ) : loading ? (
          <SpinnerPage />
        ) : listing && listing.length === 0 && listing.isFinished ? (
          <span>No results</span>
        ) : (
          // <HorizontalList>
          listing.map((item) =>
            (!search.nsfw && item.over_18) ||
            (!search.quarantine && item.quarantine) ? null : !!item.comments ? (
              <Post post={item} key={item.id} inListing />
            ) : !!item.replies ? (
              <Comment comment={item} key={item.id} />
            ) : (
              <SubredditEntry sub={item} key={item.id} />
            )
          )
        )
        // </HorizontalList>
        }
        {/* <Button onClick={fetchMore}>More</Button> */}
        {!loading && listing && !listing.isFinished ? (
          <PostPlaceholderLoader onIntersect={handleIntersect} />
        ) : null}
      </Column>
    );
  }
);
