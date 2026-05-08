import React, { useState, useContext, useEffect } from 'react';
import busService from '../services/busService';
import BusCard from '../components/BusCard';
import { Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [buses, setBuses] = useState([]);
  const [allBuses, setAllBuses] = useState([]);
  const [searched, setSearched] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Load all available buses on page load
    busService.getAllBuses().then(setAllBuses).catch(console.error);
  }, [user, navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const results = await busService.searchBuses(source, destination, travelDate);
      setBuses(results);
      setSearched(true);
    } catch (err) {
      console.error(err);
    }
  };

  const displayBuses = searched ? buses : allBuses;

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Find Your Next Adventure</h1>
        <p style={{ color: 'var(--text-muted)' }}>Book bus tickets easily and securely</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
            <label className="input-label">From</label>
            <input type="text" className="input-field" value={source} onChange={(e) => setSource(e.target.value)} required placeholder="source" />
          </div>
          <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
            <label className="input-label">To</label>
            <input type="text" className="input-field" value={destination} onChange={(e) => setDestination(e.target.value)} required placeholder="destination" />
          </div>
          <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
            <label className="input-label">Date</label>
            <input type="date" className="input-field" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '46px' }}>
            <Search size={18} /> Search
          </button>
        </form>
      </div>

      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)' }}>
        {searched
          ? (buses.length > 0 ? `Found ${buses.length} buses` : 'No buses found for this route')
          : `All Available Buses (${allBuses.length})`}
      </h2>
      <div className="buses-grid">
        {displayBuses.map(bus => (
          <BusCard key={bus.id} bus={bus} />
        ))}
      </div>
    </div>
  );
};

export default Home;