import './CSS/LoginSignup.css'
const LoginSignup = () => {
  return (
    <div className="loginSignup">
      <div className="loginSignup-container">
        <h1>Sign Up</h1>
        <div className="loginSignup-fields">
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Email Address" />
          <input type="password" placeholder="Password" />
        </div>
        <button>Sign Up</button>
        <div className="loginSignup-login">
          <p>Already have an account? <span>Login</span></p>
          <div className="loginSignup-agree">
            <input type="checkbox" id="agree" />
            <label htmlFor="agree">I agree to the Terms and Conditions</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup