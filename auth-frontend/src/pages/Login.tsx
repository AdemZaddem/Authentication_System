import React, { useState } from "react";
import { loginSchema, type LoginForm } from "../schemas/authSchema";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<Partial<LoginForm>>({});
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    mutate,
    isPending,
    isError,
    error: mutationError,
  } = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      setAuth(data.token);
      setError({});
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    },
    onError: (err) => {
      console.log("Failed to connect", err);
    },
  });
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldError: Partial<LoginForm> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginForm;
        fieldError[field] = issue.message;
      });
      setError(fieldError);
      return;
    }

    mutate();
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && <p>{error.email}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && <p>{error.password}</p>}
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "Loggin in..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Login;
