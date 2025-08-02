const API_BASE = "https://user-management-system-1m4h.onrender.com/api";

export const signUpUser = async (username, email, password) => {
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

export const loginUser = async (emailg, password) => {
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
