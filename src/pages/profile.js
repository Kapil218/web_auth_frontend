import React from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const handleRegisterPasskey = () => {
    // Add your passkey registration logic here
    console.log("Register Passkey clicked");
  };

  const handleLogout = async () => {
    try {
      // Make a POST request to the logout API
      const response = await fetch(
        "http://localhost:8000/api/v1/users/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optionally, handle the response if needed
      const data = await response.json();
      console.log("Logout Response:", data);

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
