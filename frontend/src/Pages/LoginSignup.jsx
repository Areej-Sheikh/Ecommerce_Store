import { useState } from "react";
import "./CSS/LoginSignup.css";

const LoginSignup = () => {
  // State to toggle between Login and Sign Up modes
  const [state, setState] = useState("Login");

  // State to store user input data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Function to toggle between Login and Sign Up
  const toggleState = () => {
    setState(state === "Login" ? "Sign Up" : "Login");
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    const url =
      state === "Login"
        ? "http://localhost:3000/login" // API endpoint for login
        : "http://localhost:3000/signup"; // API endpoint for signup

    // Determine request payload based on current state
    const requestData =
      state === "Login"
        ? { email: formData.email, password: formData.password }
        : formData;

    try {
      // Sending request to server
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (response.ok && responseData.token) {
        // Store authentication token in local storage
        localStorage.setItem("auth-token", responseData.token);
        alert(
          state === "Login" ? "Login Successful!" : "Registration Successful!"
        );
        window.location.replace("/"); // Redirect to home page
      } else {
        alert(responseData.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(`${state} error:`, error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Function to handle input field changes
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="loginSignup">
      <div className="loginSignup-container">
        <h1>{state}</h1>
        <div className="loginSignup-fields">
          {/* Show username field only for Sign Up */}
          {state === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
              required
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
            required
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
            required
          />
        </div>

        {/* Toggle between Login and Sign Up */}
        {state === "Login" ? (
          <p>
            Create an Account?{" "}
            <span onClick={toggleState} className="links">
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={toggleState} className="links">
              Login
            </span>
          </p>
        )}

        {/* Terms and Conditions checkbox for Sign Up */}
        {state === "Sign Up" && (
          <div className="loginSignup-agree">
            <input type="checkbox" id="agree" required />
            <label htmlFor="agree">I agree to the Terms and Conditions</label>
          </div>
        )}

        {/* Submit button */}
        <button onClick={handleSubmit}>Continue</button>
      </div>
    </div>
  );
};

export default LoginSignup;
