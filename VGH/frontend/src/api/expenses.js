import api from "./axiosConfig";

export const getExpenses = async (params) => {
  const res = await api.get("/api/expenses/", { params });
  return res.data;
};

export const createExpense = async (data) => {
  const res = await api.post("/api/expenses/", data);
  return res.data;
};

export const updateExpense = async (id, data) => {
  const res = await api.put(`/api/expenses/${id}`, data);
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await api.delete(`/api/expenses/${id}`);
  return res.data;
};