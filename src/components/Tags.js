import React from "react";

const Tags = ({ tags, setSearchTerm, searchTerm }) => {
  const handleClick = (tag) => {
    if (tag === searchTerm) {
      setSearchTerm("");
    } else {
      setSearchTerm(tag);
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col">
          <h4 className="mb-3">Tags</h4>
          <div className="d-flex flex-wrap">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`btn btn-outline-secondary me-2 mb-2 ${
                  tag === searchTerm ? "active" : ""
                }`}
                onClick={() => handleClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tags;
