import api from "./axiosConfig";

export const login = async (username, password) => {
  const res = await api.post("/api/auth/login", {
    username,
    password,
  });
  return res.data;
};