import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import busService from '../services/busService';
import bookingService from '../services/bookingService';
import { AuthContext } from '../context/AuthContext';

const BookingPage = () => {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const busData = await busService.getBusById(id);
        setBus(busData);
        const bookedData = await busService.getBookedSeats(id);
        setBookedSeats(bookedData || []);
      } catch (err) {
        setError('Failed to load bus details');
      }
    };
    fetchBusData();
  }, [id]);

  const toggleSeat = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(s => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }
    try {
      await bookingService.bookTickets({ busId: bus.id, seatNumbers: selectedSeats });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  if (!bus) return <div className="container" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '2rem 0' }}>
      <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '800px', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        
        {/* Left side: Seat Map */}
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Select Your Seats</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '16px', height: '16px', background: '#10b981', borderRadius: '4px' }}></div> Available
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '16px', height: '16px', background: '#9ca3af', borderRadius: '4px' }}></div> Booked
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '16px', height: '16px', background: 'var(--primary)', borderRadius: '4px' }}></div> Selected
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
            {Array.from({ length: bus.totalSeats }, (_, i) => i + 1).map(seat => {
              const isBooked = bookedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);
              
              let bgColor = '#10b981'; // default green (available)
              let cursor = 'pointer';
              
              if (isBooked) {
                bgColor = '#9ca3af'; // grey
                cursor = 'not-allowed';
              } else if (isSelected) {
                bgColor = 'var(--primary)'; // blue
              }

              return (
                <div 
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  style={{
                    height: '40px',
                    background: bgColor,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: cursor,
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 4px var(--primary)' : 'none',
                    opacity: isBooked ? 0.7 : 1
                  }}
                >
                  {seat}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side: Booking Details */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
          <h2 className="page-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Confirm Booking</h2>
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', background: '#fef2f2', borderRadius: '4px' }}>{error}</div>}
          
          <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>{bus.busName}</h3>
            <p style={{ marginBottom: '0.5rem' }}><strong>Route:</strong> {bus.source} to {bus.destination}</p>
            <p style={{ marginBottom: '0.5rem' }}><strong>Date:</strong> {bus.travelDate}</p>
            <p style={{ marginBottom: '0.5rem' }}><strong>Fare per seat:</strong> ₹{bus.fare}</p>
            <p><strong>Available Seats:</strong> {bus.availableSeats}</p>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
              <span>Selected Seats:</span>
              <span style={{ fontWeight: '600', maxWidth: '200px', textAlign: 'right' }}>
                {selectedSeats.length > 0 ? selectedSeats.sort((a,b)=>a-b).join(', ') : 'None'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
              <span>Total Amount:</span>
              <span style={{ color: 'var(--secondary)', fontSize: '1.5rem' }}>₹{(bus.fare * selectedSeats.length).toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleBook}
              className="btn btn-primary" 
              style={{ width: '100%', height: '50px', fontSize: '1.1rem' }}
              disabled={selectedSeats.length === 0}
            >
              Confirm Booking
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingPage;
