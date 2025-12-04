import React from "react";


const RemSearchBar = ({ search, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Buscar trabajos..."
      value={search}
      onChange={onChange} // usamos la función pasada desde RemoteJobs
      className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32baa5]"
    />
  );
};
 // RemSearchBar

export default RemSearchBar;