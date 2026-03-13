import axios from "axios";

axios.defaults.withCredentials = true;

const backendPoopEndpoint = import.meta.env.VITE_BACKEND_URL + "/api/poop";

export async function createPoop(userId) {
  try {
    console.log("Creating poop for user:", userId);
    const response = await axios.post(backendPoopEndpoint, { userId });
    return response;
  } catch (err) {
    console.error("Create poop error:", err);
    throw err;
  }
}


export async function getMonthAllPoops() {
  try {
    const response = await axios.get(backendPoopEndpoint + "/month");
    return response;
  } catch (err) {
    console.error("Get month all poops error:", err);
    throw err;
  }
}

export async function getWeekAllPoops() {
  try {
    const response = await axios.get(backendPoopEndpoint + "/week");
    return response;
  } catch (err) {
    console.error("Get week all poops error:", err);
    throw err;
  }
}

export async function getYearAllPoops() {
  try {
    const response = await axios.get(backendPoopEndpoint + "/year");
    return response;
  } catch (err) {
    console.error("Get year all poops error:", err);
    throw err;
  }
}

export async function getClassificationPoints() {
  try {
    const response = await axios.get(backendPoopEndpoint + "/classification");
    return response;
  } catch (err) {
    console.error("Get classification points error:", err);
    throw err;
  }
}

