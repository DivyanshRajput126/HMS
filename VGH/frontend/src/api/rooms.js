import api from "./axiosConfig";

export const fetchRooms = async () => {
  const res = await api.get("/api/rooms/rooms");
  return res.data;
};