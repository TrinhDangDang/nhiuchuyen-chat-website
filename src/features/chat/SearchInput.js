import React from "react";

const SearchInput = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="🔍 Search users..."
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      />
    </div>
  );
};

export default SearchInput;
