import { useMemo, useState } from "react";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";

function App() {
  // Persist token so refreshes keep the user in the protected dashboard.
  const [token, setToken] = useState(localStorage.getItem("todo_auth_token") || "");
  const [authMode, setAuthMode] = useState("login");

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

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

  return (
    <div className="min-h-screen bg-white p-4 text-black sm:p-8">
      <main className="mx-auto grid w-full max-w-4xl gap-4 border-4 border-black bg-white p-4 sm:p-8">
        <section className="grid gap-2 border-b-4 border-black pb-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Swiss Editorial Brutalism</p>
          <h1 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">Production To-Do System</h1>
        </section>

        {isAuthenticated ? (
          <Dashboard token={token} onLogout={handleLogout} />
        ) : (
          <AuthForm mode={authMode} onModeChange={setAuthMode} onAuthSuccess={handleAuthSuccess} />
        )}
      </main>
    </div>
  );
}

export default App;
