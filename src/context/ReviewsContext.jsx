import React, { createContext, useContext, useState } from "react";

const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  return (
    <ReviewsContext.Provider
      value={{ reviews, setReviews, selectedBusiness, setSelectedBusiness }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => useContext(ReviewsContext);
