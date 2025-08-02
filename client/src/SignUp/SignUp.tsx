import React, { useState } from 'react';
import './SignUp.css';
import { signUpUser } from '../Services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const result = await signUpUser(signupData.username, signupData.email, signupData.password);

    if (result.user) {
      toast.success("✅ Account created successfully!");
      console.log("User created:", result.user);

      setTimeout(() => {
        window.location.href = '/';  // Redirect to login
      }, 2000);
    } else {
      toast.error("❌ " + (result.message || "Signup failed"));
    }
  };

  return (
    <div className="SignUp">
      <div className="signup-container">
        <div className="signup-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="signup-btn">Sign Up</button>
          </form>

          <div className="form-footer">
            <p>Already have an account? <a href="/">Login</a></p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default SignUp;
