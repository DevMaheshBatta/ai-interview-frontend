import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Track errors for the UI
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    /**
     * FIX: Use URLSearchParams to send data as "application/x-www-form-urlencoded"
     * FastAPI's OAuth2PasswordRequestForm looks specifically for this format.
     */
    const formData = new URLSearchParams();
    
    /**
     * FIX: The key MUST be "username", even if you are sending an email.
     * Your backend maps "username" to "User.email" in the database query.
     */
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await api.post("/login", formData);

      // Successfully received JWT
      const token = response.data.access_token;

      // Store the token for use in the axios interceptor
      localStorage.setItem("token", token);

      navigate("/dashboard");

    } catch (error) {
      // Capture the 422 or 400 error details from the backend
      const errorDetail = error.response?.data?.detail;
      setError(typeof errorDetail === 'string' ? errorDetail : "Invalid login format");
      console.error("Login Error:", error.response?.data);
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "50px auto", textAlign: "center" }}>
      <h2>Login</h2>
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "20px", padding: "8px" }}
        />

        <button type="submit" style={{ width: "100%", padding: "10px", cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;