import React, { useEffect, useCallback } from "react";
import { SpinnerPage } from "../components/spinner";
import { useInView } from "react-intersection-observer";

export default ({ listing, setListing }) => {
  const [ref, inView] = useInView();

  const fetchMore = useCallback(() => {
    console.log("fetch more ran!");
    if (listing && !listing.isFinished)
      listing.fetchMore({ amount: 25 }).then((listing) => {
        console.log(listing);
        setListing(listing);
      });
  }, [listing, setListing]);

  useEffect(() => {
    if (inView) fetchMore();
  }, [inView, fetchMore]);

  return (
    <div ref={ref}>
      <SpinnerPage />
    </div>
  );
};
