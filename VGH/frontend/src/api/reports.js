import api from "./axiosConfig";

export const fetchMonthlyReport = async (year, month) => {
  const res = await api.get("/api/reports/monthly-profit", {
    params: { year, month },
  });
  return res.data;
};