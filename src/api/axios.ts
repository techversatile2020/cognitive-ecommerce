// src/api.js
import axios from "axios";

const ip4Addr = "192.168.1.10"; // replace with your actual IP
const BASE_URL = `http://${ip4Addr}`; // or use https if needed

const Api = (ip) => {
  return axios.create({
    baseURL: `http://${ip}`,
    timeout: 5000, // optional: set timeout
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default Api;
