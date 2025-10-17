import React, { useContext } from "react";

const Topbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Hotel Admin Panel</h1>
      <div className="flex items-center space-x-4">
        <span className="font-medium">{"Admin"}</span>
        
      </div>
    </nav>
  );
};

export default Topbar;
