import React, { useEffect, useState, useContext } from 'react';
import bookingService from '../services/bookingService';
import { AuthContext } from '../context/AuthContext';
import { Ticket, MapPin, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getUserBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(id);
        fetchBookings();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Ticket size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>No bookings found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Book a Ticket</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map(booking => (
            <div key={booking.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{booking.bus.busName}</h3>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {booking.bus.source}</span>
                  <span>→</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {booking.bus.destination}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> Travel: {booking.bus.travelDate}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Ticket size={14} /> Seats: {booking.seatNumbers?.length || 0}</span>
                </div>
              </div>
              
              <div style={{ flex: '0 0 auto', textAlign: 'right', minWidth: '150px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                  ₹{booking.totalAmount}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', color: booking.status === 'CONFIRMED' ? 'var(--secondary)' : '#ef4444', marginBottom: '1rem', fontWeight: '500' }}>
                  {booking.status === 'CONFIRMED' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {booking.status}
                </div>
                {booking.status === 'CONFIRMED' && (
                  <button className="btn btn-danger" onClick={() => handleCancel(booking.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
