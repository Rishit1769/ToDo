import { useEffect, useMemo, useState } from "react";
import { createTodo, deleteTodo, getTodos, toggleTodo } from "../api/client";

function Dashboard({ token, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openCount = useMemo(() => todos.filter((todo) => !todo.is_completed).length, [todos]);

  useEffect(() => {
    async function loadTodos() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        // Pull user-scoped tasks from protected backend endpoint.
        const todoList = await getTodos(token);
        setTodos(todoList);
      } catch (error) {
        if (error.status === 401) {
          onLogout();
          return;
        }
        setErrorMessage(error.message || "Failed to load todos.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTodos();
  }, [token, onLogout]);

  async function handleAddTask(event) {
    event.preventDefault();

    const task = newTask.trim();
    if (!task) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const created = await createTodo(token, task);
      // Prepend newest task for immediate editorial-style list updates.
      setTodos((previous) => [created, ...previous]);
      setNewTask("");
    } catch (error) {
      if (error.status === 401) {
        onLogout();
        return;
      }
      setErrorMessage(error.message || "Failed to create todo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(id) {
    setErrorMessage("");

    try {
      const updated = await toggleTodo(token, id);
      // Merge server-confirmed state to avoid drift.
      setTodos((previous) =>
        previous.map((todo) =>
          todo.id === id ? { ...todo, is_completed: updated.is_completed } : todo
        )
      );
    } catch (error) {
      if (error.status === 401) {
        onLogout();
        return;
      }
      setErrorMessage(error.message || "Failed to update todo.");
    }
  }

  async function handleDelete(id) {
    setErrorMessage("");

    try {
      await deleteTodo(token, id);
      setTodos((previous) => previous.filter((todo) => todo.id !== id));
    } catch (error) {
      if (error.status === 401) {
        onLogout();
        return;
      }
      setErrorMessage(error.message || "Failed to delete todo.");
    }
  }

  return (
    <section className="grid gap-6 border-4 border-black bg-white p-6 shadow-brutal sm:p-8">
      <header className="grid gap-3 border-b-4 border-black pb-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent">Task Ledger</p>
          <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">To-Do Control Plane</h1>
        </div>

        <div className="grid gap-2 text-right">
          <p className="font-mono text-xs uppercase tracking-[0.14em]">Open Items: {openCount}</p>
          <button
            type="button"
            onClick={onLogout}
            className="justify-self-end border-2 border-black bg-white px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] hover:bg-black hover:text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleAddTask}>
        <input
          className="border-2 border-black bg-white px-3 py-3 text-base font-semibold outline-none transition-colors focus:bg-accent focus:text-white"
          placeholder="Define next action..."
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          maxLength={255}
        />

        <button
          className="border-4 border-black bg-accent px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-brutal transition-transform hover:-translate-y-[1px] active:translate-y-0"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving" : "Add Task"}
        </button>
      </form>

      {errorMessage ? (
        <p className="border-2 border-black bg-black px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-white">
          {errorMessage}
        </p>
      ) : null}

      <div className="grid gap-3">
        {isLoading ? (
          <p className="border-2 border-black px-3 py-4 font-mono text-xs uppercase tracking-[0.12em]">
            Loading tasks...
          </p>
        ) : null}

        {!isLoading && todos.length === 0 ? (
          <p className="border-2 border-black px-3 py-4 font-mono text-xs uppercase tracking-[0.12em]">
            No tasks recorded.
          </p>
        ) : null}

        {!isLoading
          ? todos.map((todo) => (
              <article
                key={todo.id}
                className="grid gap-3 border-2 border-black p-3 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <p
                  className={`text-base font-semibold ${
                    todo.is_completed ? "line-through opacity-70" : "no-underline"
                  }`}
                >
                  {todo.task}
                </p>

                <div className="grid grid-cols-2 gap-2 sm:w-[220px]">
                  <button
                    type="button"
                    onClick={() => handleToggle(todo.id)}
                    className="border-2 border-black bg-white px-2 py-2 font-mono text-xs uppercase tracking-[0.09em] hover:bg-black hover:text-white"
                  >
                    {todo.is_completed ? "Reopen" : "Complete"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(todo.id)}
                    className="border-2 border-black bg-accent px-2 py-2 font-mono text-xs uppercase tracking-[0.09em] text-white hover:bg-black"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          : null}
      </div>
    </section>
  );
}

export default Dashboard;
