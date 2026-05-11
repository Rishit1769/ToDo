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
    <div className="relative min-h-screen overflow-hidden p-3 sm:p-8">
      <div
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,_#e2ecff_0%,_#f2f5f9_45%,_#ecf2ff_100%)] transition-opacity duration-700 ease-in-out ${
          isDark ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,_#1d293f_0%,_#0d1117_45%,_#070b12_100%)] transition-opacity duration-700 ease-in-out ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      />

      <main
        className={`relative z-10 mx-auto grid w-full max-w-5xl gap-5 border-4 p-4 shadow-brutal transition-colors duration-500 sm:p-8 ${
          isDark ? "border-white bg-[#111827] text-white" : "border-black bg-white text-black"
        }`}
      >
        <section
          className={`grid gap-3 border-b-4 pb-4 transition-colors duration-500 sm:grid-cols-[1fr_auto] sm:items-end ${
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
            className={`inline-flex items-center gap-2 justify-self-start border-2 px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] transition-colors duration-500 sm:justify-self-end ${
              isDark ? "border-white bg-[#0d1117] text-white hover:bg-white hover:text-black" : "border-black bg-white hover:bg-black hover:text-white"
            }`}
          >
            <span className="relative inline-block h-4 w-4" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                className={`absolute inset-0 h-4 w-4 transition-all duration-500 ease-in-out ${
                  isDark ? "scale-75 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="M4.93 4.93l1.41 1.41" />
                <path d="M17.66 17.66l1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="M4.93 19.07l1.41-1.41" />
                <path d="M17.66 6.34l1.41-1.41" />
              </svg>

              <svg
                viewBox="0 0 24 24"
                className={`absolute inset-0 h-4 w-4 transition-all duration-500 ease-in-out ${
                  isDark ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-90 opacity-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
              </svg>
            </span>
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
