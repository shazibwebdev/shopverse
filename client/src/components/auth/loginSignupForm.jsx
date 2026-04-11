// src/pages/LoginSignUpPage.jsx
import React, { useState } from "react";
import "../../styles/login-signup.css";
import { FaEye, FaEyeSlash, FaEnvelope, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../../services/api";

export default function LoginSignUpPage() {
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showLogInPassword, setShowLogInPassword] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(false);
  const [isLoading, setIsLoading] = useState({ login: false, signup: false });

  // Resend verification state
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const { signup, login } = useAuth();

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: signUpErrors },
    reset: signUpReset,
  } = useForm();

  const {
    register: registerLogIn,
    handleSubmit: handleSubmitLogIn,
    formState: { errors: logInErrors },
    reset: loginReset,
  } = useForm();

  const onSignUpSubmit = async (data) => {
    setIsLoading(prev => ({ ...prev, signup: true }));
    await signup(data, signUpReset, setIsLoginActive);
    setIsLoading(prev => ({ ...prev, signup: false }));
  };

  const onLogInSubmit = async (data) => {
    setIsLoading(prev => ({ ...prev, login: true }));
    await login(data, loginReset);
    setIsLoading(prev => ({ ...prev, login: false }));
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) return toast.error("Please enter your email.");
    setResendLoading(true);
    try {
      const res = await api.post("/api/auth/resend-verification", { email: resendEmail });
      toast.success(res.data.msg);
      setShowResend(false);
      setResendEmail("");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to resend. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="login-signup-form">
      <ToastContainer
        autoClose={2200}
        position='top-center' />


      <main>
        <Link to={'/'}>
          <button className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 font-semibold rounded-lg cursor-pointer shadow-lg hover:shadow-xl hover:bg-white transition-all duration-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </button>
        </Link>
        <div className="container">
          <div className={`slider ${isLoginActive ? "logIn-active" : "signUp-active"}`} />

          {/* Header Sections */}
          <div className={`headd ${!isLoginActive ? "head-" : ""}`}>
            <p className="text-white text-2xl font-bold">Welcome</p>
            <p className="p">Already have an account?</p>
            <button className="btn logIn-btn" onClick={() => setIsLoginActive(true)}>Log In</button>
          </div>

          <div className={`head1 ${isLoginActive ? "head-1" : ""}`}>
            <p className="text-white text-2xl font-bold">Welcome Back!</p>
            <p className="p">Don't have an account?</p>
            <button className="btn signUp-btn" onClick={() => setIsLoginActive(false)}>Sign Up</button>
          </div>

          {/* SIGNUP FORM */}
          <div className={`signUp-main gap-[10px] md:gap-[20px] ${!isLoginActive ? "signUp-form-active" : ""}`}>
            <h2 className="font-bold text-2xl">SIGN UP</h2>
            <form className="sign gap-[5px] md:gap-[10px]" onSubmit={handleSubmitSignUp(onSignUpSubmit)}>
              {/* Username */}
              <div className="div relative">
                <input
                  {...registerSignUp("username", { required: "Username is required" })}
                  className="border-2 rounded border-gray-400 sign-name"
                  placeholder="Username"
                  type="text"
                />
                <FaUser className="absolute top-3 right-2" />
                {signUpErrors.username && <p className="text-red-500 text-sm">{signUpErrors.username.message}</p>}
              </div>

              {/* Email */}
              <div className="div relative">
                <input
                  {...registerSignUp("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
                  })}
                  className="border-2 rounded border-gray-400 sign-mail"
                  placeholder="E-mail"
                  type="email"
                />
                <FaEnvelope className="absolute top-3 right-2" />
                {signUpErrors.email && <p className="text-red-500 text-sm">{signUpErrors.email.message}</p>}
              </div>

              {/* Password (SIGNUP) */}
              <div className="div relative">
                <input
                  {...registerSignUp("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" }
                  })}
                  className="border-2 rounded border-gray-400 sign-pass pr-10"
                  placeholder="Password"
                  type={showSignUpPassword ? "text" : "password"}
                />
                <span
                  className="absolute top-3 right-2 cursor-pointer"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                >
                  {showSignUpPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {signUpErrors.password && <p className="text-red-500 text-sm">{signUpErrors.password.message}</p>}
              </div>
              <button className="same signUp" type="submit" disabled={isLoading.signup}>
                {isLoading.signup ? (
                  <>
                    <span className="spinner"></span>
                    Signing Up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
          </div>

          {/* LOGIN FORM */}
          <div className={`logIn-main ${isLoginActive ? "logIn-form-active" : ""}`}>
            <h2 className="font-bold text-2xl">LOG IN</h2>
            <form className="log gap-[10px] md:gap-[20px]" onSubmit={handleSubmitLogIn(onLogInSubmit)}>
              {/* Email */}
              <div className="div relative">
                <input
                  {...registerLogIn("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
                  })}
                  className="border-2 rounded border-gray-400 log-mail"
                  placeholder="E-mail"
                  type="email"
                />
                <FaEnvelope className="absolute top-3 right-2" />
                {logInErrors.email && <p className="text-red-500 text-sm">{logInErrors.email.message}</p>}
              </div>

              {/* Password (LOGIN) */}
              <div className="div relative">
                <input
                  {...registerLogIn("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" }
                  })}
                  className="border-2 rounded border-gray-400 log-pass pr-10"
                  placeholder="Password"
                  type={showLogInPassword ? "text" : "password"}
                />
                <span
                  className="absolute top-3 right-2 cursor-pointer"
                  onClick={() => setShowLogInPassword(!showLogInPassword)}
                >
                  {showLogInPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {logInErrors.password && <p className="text-red-500 text-sm">{logInErrors.password.message}</p>}
              </div>

              <button className="same logIn" type="submit" disabled={isLoading.login}>
                {isLoading.login ? (
                  <>
                    <span className="spinner"></span>
                    Logging In...
                  </>
                ) : (
                  'Log In'
                )}
              </button>
              <Link to={'/forgot-password'}>
                <p className="text-sm text-[green] font-semibold">
                  Forgot password?
                </p>
              </Link>

              {/* Resend verification */}
              <div className="mt-1">
                {!showResend ? (
                  <p
                    className="text-sm text-blue-600 font-semibold cursor-pointer hover:underline"
                    onClick={() => setShowResend(true)}
                  >
                    Resend verification email?
                  </p>
                ) : (
                  <form onSubmit={handleResendVerification} className="flex flex-col gap-2 mt-1">
                    <div className="div relative">
                      <input
                        type="email"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="border-2 rounded border-gray-400 w-full "
                      />
                      <FaEnvelope className="absolute top-3 right-2" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        onClick={handleResendVerification}
                        disabled={resendLoading}
                        className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded font-semibold disabled:opacity-60 cursor-pointer"
                      >
                        {resendLoading ? "Sending..." : "Send"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowResend(false); setResendEmail(""); }}
                        className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
