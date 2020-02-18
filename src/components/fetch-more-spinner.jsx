import React, { useEffect } from "react";
import { SpinnerPage } from "../components/spinner";

import useIntersect from "../utils/use-intersect";

export default ({ listing, setListing }) => {
  const [$spinner, entry] = useIntersect({
    threshold: 0.1,
  });

  useEffect(() => {
    if (
      listing?.fetched &&
      entry.intersectionRatio > 0.1 &&
      !listing?.isFinished
    ) {
      listing.fetchMore().then((listing) => setListing(listing));
    }
  }, [entry, listing, setListing]);

  return <SpinnerPage forwardRef={$spinner} />;
};
