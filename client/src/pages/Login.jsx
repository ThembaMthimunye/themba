import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // const onSubmitHandler = async (e) => {
  //   try {
  //     e.preventDefault();
  //     axios.defaults.withCredentials = true;
  //     if (state === "Sign Up") {
  //       const { data } = await axios.post(backendUrl + "/api/auth/register", {
  //         name,
  //         email,
  //         password,
  //       });
  //       if (data.success) {
  //         setIsLoggedin(true);
  //         navigate("/");
  //       } else {
  //         toast.error(data.message);
  //       }
  //     } else {
  //       const { data } = await axios.post(backendUrl + "/api/auth/login", {
  //         email,
  //         password,
  //       });
  //       if (data.success) {
  //         setIsLoggedin(true);
  //         navigate("/");
  //         console.log("data");
  //       } else {
  //         toast.error(data.message);
  //       }
  //     }
  //   } catch (error) {
  //   toast.error("Something went wrong");
  //   }
  // };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();

          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true); // Fix: Ensure you're using the correct setter
          getUserData();
          navigate("/");
          console.log(data); // Log the actual data, not the string "data"
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error); // Log the actual error for debugging
      toast.error("Something went wrong");
    }
  };

  return (
    <div className=" flex items-center justify-center min-h-screen  px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-300">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left:20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-md w-full shadow-lg sm:w-96 text-white">
        <h2 className="text-3xl font-semibold text-center mb-3">
          {state === "Sign Up" ? "Create account" : "Login "}
        </h2>
        <p className=" font-semibold text-center mb-3">
          {state === "Sign Up" ? "Sign Up" : "Login To Your Account"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="flex items-center gap-4 mt-4 w-full px-5 py-2 rounded-full bg-slate-600">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 w-full px-5 py-2 rounded-full bg-slate-600">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="flex items-center gap-4 my-4 w-full px-5 py-2 rounded-full bg-slate-600">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="password"
              required
            />
          </div>
          {state !== "Sign Up" && (
            <p
              onClick={() => navigate("/resetpassword")}
              className=" my-4 cursor-pointer px-4 underline text-slate-400"
            >
              Forgot Password ?
            </p>
          )}

          <button className="w-full py-2.5 rounded-full bg-gradient-to-br from-blue-200 to-purple-300 text-white font-medium cursor-pointer hover:bg-purple-400">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login Here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Dont have an account{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
