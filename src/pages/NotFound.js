import React from "react";
import notFound from "../images/404.jpg";

const NotFound = () => {
  return (
    <div>
      <img src={notFound} alt="Page not found" />
    </div>
  );
};

export default NotFound;