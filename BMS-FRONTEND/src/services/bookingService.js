import api from '../api/axiosConfig';

const bookTickets = async (bookingRequest) => {
  const response = await api.post('/bookings', bookingRequest);
  return response.data;
};

const getUserBookings = async () => {
  const response = await api.get('/bookings/my');
  return response.data;
};

const cancelBooking = async (bookingId) => {
  const response = await api.delete(`/bookings/${bookingId}`);
  return response.data;
};

const getAllBookings = async () => {
  const response = await api.get('/bookings/all');
  return response.data;
};

const bookingService = {
  bookTickets,
  getUserBookings,
  cancelBooking,
  getAllBookings,
};

export default bookingService;
