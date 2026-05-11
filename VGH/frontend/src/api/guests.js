import api from "./axiosConfig";

export const addGuest = async (data) => {
  const res = await api.post("/api/guests/", data);
  return res.data;
};

export const fetchGuests = async (customerId) => {
  const res = await api.get(`/api/guests/by-customer/${customerId}`);
  return res.data;
};

export const deleteGuest = async (guestId) => {
  await api.delete(`/api/guests/${guestId}`);
};


export const fetchGuestList = async (params) => {
  const res = await api.get("/api/guests/list", { params });
  return res.data;
};
