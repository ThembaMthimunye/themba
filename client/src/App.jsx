import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import Resertpassword from "./pages/Resertpassword";
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/resetpassword" element={<Resertpassword />} />
      </Routes>
    </div>
  );
}

export default App;
