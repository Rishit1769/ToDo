import { useState } from "react";
import { loginUser, registerUser } from "../api/client";

function AuthForm({ mode, onModeChange, onAuthSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    <section className="grid gap-6 border-4 border-black bg-white p-6 shadow-brutal sm:p-8">
      <header className="grid gap-2 border-b-4 border-black pb-4">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent">Authentication</p>
        <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          {isLoginMode ? "Access Console" : "Create Operator"}
        </h1>
      </header>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-xs font-mono uppercase tracking-[0.12em]">
          Username
          <input
            className="border-2 border-black bg-white px-3 py-3 text-base font-semibold outline-none transition-colors focus:bg-accent focus:text-white"
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
          <input
            className="border-2 border-black bg-white px-3 py-3 text-base font-semibold outline-none transition-colors focus:bg-accent focus:text-white"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="minimum 8 characters"
            autoComplete={isLoginMode ? "current-password" : "new-password"}
            required
          />
        </label>

        {errorMessage ? (
          <p className="border-2 border-black bg-black px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-white">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="border-2 border-black bg-accent px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-white">
            {successMessage}
          </p>
        ) : null}

        <button
          className="border-4 border-black bg-accent px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-brutal transition-transform hover:-translate-y-[1px] active:translate-y-0"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Processing" : isLoginMode ? "Login" : "Register"}
        </button>
      </form>

      <footer className="border-t-4 border-black pt-4">
        <button
          type="button"
          className="border-2 border-black bg-white px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] hover:bg-black hover:text-white"
          onClick={() => onModeChange(isLoginMode ? "register" : "login")}
        >
          {isLoginMode ? "Need an account? Register" : "Already registered? Login"}
        </button>
      </footer>
    </section>
  );
}

export default AuthForm;
