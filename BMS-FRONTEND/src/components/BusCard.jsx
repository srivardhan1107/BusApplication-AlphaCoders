import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BusCard = ({ bus }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary)' }}>{bus.busName}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={16} /> {bus.source}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={16} /> {bus.destination}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
          <Calendar size={16} /> {bus.travelDate}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: 'var(--secondary)' }}>
          <span>₹</span> {bus.fare}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <Users size={16} /> {bus.availableSeats} seats left
        </span>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate(`/book/${bus.id}`)}
          style={{ padding: '0.5rem 1rem' }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BusCard;
