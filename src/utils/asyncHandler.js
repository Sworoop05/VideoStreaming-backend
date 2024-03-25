import React from "react";

const asyncHandler = (requestHandler) => {
  Promise.resolve((req, res, next) => requestHandler(req, res, next)).reject(
    (err) => next(err)
  );
};

export default asyncHandler;
