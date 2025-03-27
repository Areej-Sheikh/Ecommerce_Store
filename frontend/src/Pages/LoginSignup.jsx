import { useState } from "react";
import "./CSS/LoginSignup.css";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const toggleState = () => {
    setState(state === "Login" ? "Sign Up" : "Login");
  };

  const handleSubmit = async () => {
    const url =
      state === "Login"
        ? "http://localhost:3000/login"
        : "http://localhost:3000/signup";
    const requestData =
      state === "Login"
        ? { email: formData.email, password: formData.password }
        : formData;

    try {
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
        localStorage.setItem("auth-token", responseData.token);
        alert(
          state === "Login" ? "Login Successful!" : "Registration Successful!"
        );
        window.location.replace("/");
      } else {
        alert(responseData.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(`${state} error:`, error);
      alert("Something went wrong. Please try again.");
    }
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="loginSignup">
      <div className="loginSignup-container">
        <h1>{state}</h1>
        <div className="loginSignup-fields">
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

        {state === "Sign Up" && (
          <div className="loginSignup-agree">
            <input type="checkbox" id="agree" required />
            <label htmlFor="agree">I agree to the Terms and Conditions</label>
          </div>
        )}
        <button onClick={handleSubmit}>Continue</button>
      </div>
    </div>
  );
};

export default LoginSignup;
