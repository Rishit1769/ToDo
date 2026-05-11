import { useState } from "react";
import { loginUser, registerUser } from "../api/client";

function AuthForm({ mode, onModeChange, onAuthSuccess, isDark }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isLoginMode = mode === "login";

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic client-side validation keeps API responses focused on business rules.
    const normalizedUsername = username.trim();
    if (!normalizedUsername || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    setIsLoading(true);

    try {
      if (isLoginMode) {
        const response = await loginUser({ username: normalizedUsername, password });
        onAuthSuccess(response.token);
      } else {
        // Registration returns confirmation; user then continues with login flow.
        await registerUser({ username: normalizedUsername, password });
        setSuccessMessage("Registration complete. Continue with login.");
        onModeChange("login");
      }
    } catch (error) {
      setErrorMessage(error.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      className={`grid gap-6 border-4 p-5 shadow-brutal transition-colors duration-500 sm:p-8 ${
        isDark ? "border-white bg-[#0f172a] text-white" : "border-black bg-white text-black"
      }`}
    >
      <header className={`grid gap-2 border-b-4 pb-4 ${isDark ? "border-white" : "border-black"}`}>
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent">Authentication</p>
        <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          {isLoginMode ? "Access Console" : "Create Operator"}
        </h1>
      </header>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-xs font-mono uppercase tracking-[0.12em]">
          Username
          <input
            className={`border-2 px-3 py-3 text-base font-semibold outline-none transition-colors ${
              isDark
                ? "border-white bg-[#0b1220] text-white focus:bg-accent focus:text-white"
                : "border-black bg-white text-black focus:bg-accent focus:text-white"
            }`}
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="operator_name"
            autoComplete="username"
            required
          />
        </label>

        <label className="grid gap-2 text-xs font-mono uppercase tracking-[0.12em]">
          Password
          <div className="relative">
            <input
              className={`w-full border-2 px-3 py-3 pr-12 text-base font-semibold outline-none transition-colors ${
                isDark
                  ? "border-white bg-[#0b1220] text-white focus:bg-accent focus:text-white"
                  : "border-black bg-white text-black focus:bg-accent focus:text-white"
              }`}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="minimum 8 characters"
              autoComplete={isLoginMode ? "current-password" : "new-password"}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className={`absolute right-2 top-1/2 -translate-y-1/2 border px-2 py-1 transition-colors ${
                isDark
                  ? "border-white bg-[#0f172a] text-white hover:bg-white hover:text-black"
                  : "border-black bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 102.8 2.8" />
                  <path d="M9.9 4.2A10.9 10.9 0 0112 4c5.5 0 9.2 4.5 10 8-0.3 1.2-1 2.7-2.1 4" />
                  <path d="M6.6 6.6C4.5 8 3.2 10.1 2 12c0.8 3.5 4.5 8 10 8 1.9 0 3.5-.5 4.9-1.2" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12s3.7-8 10-8 10 8 10 8-3.7 8-10 8-10-8-10-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </label>

        {errorMessage ? (
          <p
            className={`border-2 px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-white ${
              isDark ? "border-white bg-[#7f1d1d]" : "border-black bg-black"
            }`}
          >
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="border-2 border-black bg-accent px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-white">
            {successMessage}
          </p>
        ) : null}

        <button
          className={`border-4 bg-accent px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-brutal transition-transform hover:-translate-y-[1px] active:translate-y-0 ${
            isDark ? "border-white" : "border-black"
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Processing" : isLoginMode ? "Login" : "Register"}
        </button>
      </form>

      <footer className={`border-t-4 pt-4 ${isDark ? "border-white" : "border-black"}`}>
        <button
          type="button"
          className={`border-2 px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] transition-colors ${
            isDark ? "border-white bg-[#0f172a] text-white hover:bg-white hover:text-black" : "border-black bg-white hover:bg-black hover:text-white"
          }`}
          onClick={() => onModeChange(isLoginMode ? "register" : "login")}
        >
          {isLoginMode ? "Need an account? Register" : "Already registered? Login"}
        </button>
      </footer>
    </section>
  );
}

export default AuthForm;
