import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { startRegistration } from "@simplewebauthn/browser";
function Profile() {
  const navigate = useNavigate();

  const handleRegisterPasskey = async () => {
    // Add your passkey registration logic here
    const response = await axios.post(
      "http://localhost:8000/api/v1/users/register-challenge",
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const { options } = response.data.data;

    const authenticationResult = await startRegistration(options);
    console.log(authenticationResult);

    await axios.post(
      "http://localhost:8000/api/v1/users/verify-challenge",
      { cred: authenticationResult },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
  };

  const handleLogout = async () => {
    try {
      // Make a POST request to the logout API
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Check if the response is okay
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optionally, handle the response if needed

      console.log("Logout Response:", response);

      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      <button onClick={handleRegisterPasskey}>Register Passkey</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;
