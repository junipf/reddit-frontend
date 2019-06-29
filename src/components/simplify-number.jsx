import React from "react";

import PropTypes from "prop-types";
import { FormatNumber } from "../utils/format-number";

export const SimplifyNumber = props => {
  const { number, label, ...rest } = props;
  return (
    <span {...rest} data-tip={String(number)}>
      {FormatNumber(number, label)}
    </span>
  );
};

SimplifyNumber.propTypes = {
  number: PropTypes.number.isRequired,
  label: PropTypes.string,
};
