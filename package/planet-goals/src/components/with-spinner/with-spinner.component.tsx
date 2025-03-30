import React from "react";

import Spinner from "../spinner/spinner.component";

const WithSpinner =
  (WrappedComponent: React.FC) =>
  ({ isLoading, ...otherProps }) => {
    return isLoading ? <Spinner /> : <WrappedComponent {...otherProps} />;
  };

export default WithSpinner;
