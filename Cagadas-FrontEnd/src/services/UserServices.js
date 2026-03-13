import axios from "axios";

axios.defaults.withCredentials = true;

const backendAuthEndpoint = import.meta.env.VITE_BACKEND_URL + "/api/user";

function getOptions(user) {
  const base64UserAndPassword = window.btoa(user.email + ":" + user.password);
  const basicAccess = "Basic " + base64UserAndPassword;
  const options = {
    headers: {
      Authorization: basicAccess,
    },
  };
  return options;
}

async function login(user) {
  try {
    console.log("Attempting login with:", user.email);
    const response = await axios.post(
      `${backendAuthEndpoint}/login`,
      { email: user.email, password: user.password },
      { withCredentials: true }
    );
    return response;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

async function register(user) {
  try {
    console.log("Attempting registration with:", user.email);
    const response = await axios.post(
      backendAuthEndpoint,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      },
      { withCredentials: true }
    );
    return response;
  } catch (err) {
    console.error("Registration error:", err);
    throw err;
  }
}

async function updateUser(userId, data) {
  try {
    const response = await axios.put(
      `${backendAuthEndpoint}/${userId}`,
      data,
      { withCredentials: true }
    );
    return response;
  } catch (err) {
    console.error("Update user error:", err);
    throw err;
  }
}

export { login, register, updateUser };
