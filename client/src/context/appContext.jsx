import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/user/data");
      if (data.success) {
        console.log(data.name)
        setUserData(data.userData);
        toast.success(data.message);
        console.log(data.userData.name);
      } else {
        toast.error("Failed to load user data");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(data.userData);
    }
  };

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
