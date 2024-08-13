import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startAuthentication } from "@simplewebauthn/browser"; // Assuming you're using the SimpleWebAuthn library

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    loginIdentifier: "", // Field to hold email or passkey
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response.status);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response;
      console.log("Login Response:", data);

      // Redirect to the profile page
      navigate("/profile");
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  };

  const handleLoginWithPasskey = async () => {
    try {
      const { loginIdentifier } = formData;

      // Start the passkey authentication process
      const challengeResponse = await axios.post(
        "http://localhost:8000/api/v1/users/login-challenge",
        { email: loginIdentifier }, // Pass the login identifier in the request body
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(challengeResponse.data.data);

      const options = challengeResponse.data.data.options;
      const authResult = await startAuthentication(options);

      // Verify the passkey authentication result
      const verifyResponse = await axios.post(
        "http://localhost:8000/api/v1/users/login-verify",
        { email: loginIdentifier, cred: authResult }, // Include the login identifier
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (verifyResponse.status === 200) {
        console.log("Passkey login successful");
        navigate("/profile");
      } else {
        throw new Error("Passkey login failed");
      }
    } catch (error) {
      console.error("Error logging in with passkey:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Login</button>
      <div>
        <label>Email or Passkey:</label>
        <input
          type="text"
          name="loginIdentifier"
          value={formData.loginIdentifier}
          onChange={handleChange}
          placeholder="Enter your email or passkey"
          required
        />
      </div>
      <button type="button" onClick={handleLoginWithPasskey}>
        Login with Passkey
      </button>
    </form>
  );
}

export default LoginForm;
