import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import RegisterForm from "./pages/register.js";
import LoginForm from "./pages/login.js";
import Profile from "./pages/profile.js";
import "./App.css"; // Import the CSS file
import axios from "axios";

axios.defaults.withCredentials = true;
function App() {
  return (
    <Router>
      <div>
        <h1>My Application</h1>
        <nav>
          <ul>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
