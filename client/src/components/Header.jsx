import React from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/appContext";
import  { useContext, useState } from "react";



const Header = () => {
  const {userData} = useContext(AppContext);
  return (
    
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <img
        src={assets.header_img}
        alt=""
        className="w-36 h-36 rounded-full mb-6"
      />
      <h1 className="flex items-center gap-4 text-xl sm:text-3xl font-medium mb-2">
        {/* Hey {userData? userData.name:'Developer'}  */}
        hey {userData?.name || 'Developer'}
        <img src={assets.hand_wave} className="w-8 aspect-square" alt="" />
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">Welcome to our app</h2>
      <p className="mb-8 max-w-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
      <button className="border border-gray-500 rounded-full px-6 py-2 hover:bg-gray-100  transition-all" >Get Started</button>
    </div>
  );
};

export default Header;
