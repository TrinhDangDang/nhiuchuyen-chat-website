import React from "react";

const SearchInput = () => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 border border-gray-300 rounded shadow-sm"
      />
    </div>
  );
};

export default SearchInput;
