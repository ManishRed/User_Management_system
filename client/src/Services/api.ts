const API_BASE = "http://localhost:5000/api";

export const signUpUser = async (username: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });

    return await response.json();
  } catch (err) {
    console.error("Signup error:", err);
    return { message: "Server error" };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    return await response.json();
  } catch (err) {
    console.error("Login error:", err);
    return { message: "Server error" };
  }
};
