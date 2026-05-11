import api from "./axiosConfig";

export const fetchDashboard = async () => {
  const res = await api.get("/api/reports/dashboard");
  return res.data;
};
