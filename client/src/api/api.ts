import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:7000";

export const api = axios.create({ baseURL });
