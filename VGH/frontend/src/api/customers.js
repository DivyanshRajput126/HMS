import api from "./axiosConfig";

export const checkinCustomer = async (payload) => {
  const res = await api.post("/api/customers/checkin", payload);
  return res.data;
};

export const checkoutByRoom = async (roomId, paidNow, pendingRemainder, checkoutDatetime) => {
  const res = await api.post(`/api/customers/checkout/by-room/${roomId}`, {
    paid_now: paidNow ? Number(paidNow) : 0,
    pending_remainder: pendingRemainder ? Number(pendingRemainder) : 0,

    // This matches the 'checkout_datetime' key your FastAPI payload.get() expects
    checkout_datetime: checkoutDatetime
  });

  return res.data;
};


export const checkoutCustomer = async (customerId) => {
  const res = await api.post(`/api/customers/checkout/${customerId}`);
  return res.data;
};

export const updateCustomer = async (customerId, payload) => {
  const res = await api.put(`/api/customers/${customerId}`, payload);
  return res.data;
};

export const deleteCustomer = async (customerId) => {
  const res = await api.delete(`/api/customers/${customerId}`);
  return res.data;
};

export const collectMoney = async (customerId, amountCollected) => {
  const formData = new FormData();
  formData.append("amount_collected", amountCollected);
  const res = await api.patch(`/api/customers/collect-money/${customerId}`, formData);
  return res.data;
};

export const fetchCustomerList = async (params) => {
  const res = await api.get("/api/customers/list", { params });
  return res.data;
};
