import api from '../api/axiosConfig';

const searchBuses = async (source, destination, date) => {
  const response = await api.get(`/buses/search?source=${source}&destination=${destination}&travelDate=${date}`);
  return response.data;
};

const getAllBuses = async () => {
  const response = await api.get('/buses');
  return response.data;
};

const getBusById = async (id) => {
  const response = await api.get(`/buses/${id}`);
  return response.data;
};

const addBus = async (busData) => {
  const response = await api.post('/buses', busData);
  return response.data;
};

const deleteBus = async (id) => {
  const response = await api.delete(`/buses/${id}`);
  return response.data;
};

const updateBus = async (id, busData) => {
  const response = await api.put(`/buses/${id}`, busData);
  return response.data;
};

const getBookedSeats = async (busId) => {
  const response = await api.get(`/buses/${busId}/seats`);
  return response.data;
};

const busService = {
  searchBuses,
  getAllBuses,
  getBusById,
  addBus,
  deleteBus,
  updateBus,
  getBookedSeats,
};

export default busService;
