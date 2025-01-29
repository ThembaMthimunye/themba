import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-between items-center p-6 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:28" />
      <button onClick={() => navigate("/login")} 
      className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-500 transition-all">
        Login
        <img src={assets.arrow_icon} />
      </button>
    </div>
  );
};

export default Navbar;
