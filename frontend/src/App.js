import { useEffect, useMemo, useState } from "react";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";

function App() {
  // Persist token so refreshes keep the user in the protected dashboard.
  const [token, setToken] = useState(localStorage.getItem("todo_auth_token") || "");
  const [authMode, setAuthMode] = useState("login");
  const [theme, setTheme] = useState(localStorage.getItem("todo_theme") || "light");

  const isAuthenticated = useMemo(() => Boolean(token), [token]);
  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("todo_theme", theme);
  }, [theme]);

  function handleAuthSuccess(nextToken) {
    // Store JWT in localStorage per requirement.
    localStorage.setItem("todo_auth_token", nextToken);
    setToken(nextToken);
  }

  function handleLogout() {
    // Clearing token forces a redirect-equivalent back to auth form.
    localStorage.removeItem("todo_auth_token");
    setToken("");
    setAuthMode("login");
  }

  function handleThemeToggle() {
    setTheme((previous) => (previous === "dark" ? "light" : "dark"));
  }

  return (
    <div
      className={`min-h-screen p-3 transition-colors duration-300 sm:p-8 ${
        isDark ? "bg-[#0d1117] text-white" : "bg-[#f2f5f9] text-black"
      }`}
    >
      <main
        className={`mx-auto grid w-full max-w-5xl gap-5 border-4 p-4 shadow-brutal sm:p-8 ${
          isDark ? "border-white bg-[#111827]" : "border-black bg-white"
        }`}
      >
        <section
          className={`grid gap-3 border-b-4 pb-4 sm:grid-cols-[1fr_auto] sm:items-end ${
            isDark ? "border-white" : "border-black"
          }`}
        >
          <div className="grid gap-1">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Personal Productivity Hub</p>
            <h1 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">To-Do Website</h1>
          </div>

          <button
            type="button"
            onClick={handleThemeToggle}
            className={`justify-self-start border-2 px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] transition-colors sm:justify-self-end ${
              isDark ? "border-white bg-[#0d1117] text-white hover:bg-white hover:text-black" : "border-black bg-white hover:bg-black hover:text-white"
            }`}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </section>

        {isAuthenticated ? (
          <Dashboard token={token} onLogout={handleLogout} isDark={isDark} />
        ) : (
          <AuthForm
            mode={authMode}
            onModeChange={setAuthMode}
            onAuthSuccess={handleAuthSuccess}
            isDark={isDark}
          />
        )}
      </main>
    </div>
  );
}

export default App;
