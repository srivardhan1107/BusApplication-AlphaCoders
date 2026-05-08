import React, { useState, useEffect } from 'react';
import busService from '../services/busService';
import bookingService from '../services/bookingService';
import { PlusCircle, Trash2, List, CheckCircle, XCircle, Edit } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('addBus');
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  const [editingBusId, setEditingBusId] = useState(null);
  const [busData, setBusData] = useState({
    busName: '',
    source: '',
    destination: '',
    travelDate: '',
    price: '',
    totalSeats: ''
  });
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'manageBuses') {
      fetchBuses();
    } else if (activeTab === 'allBookings') {
      fetchBookings();
    }
    // reset edit state when switching tabs
    if (activeTab !== 'manageBuses') {
      setEditingBusId(null);
    }
  }, [activeTab]);

  const fetchBuses = async () => {
    try {
      const data = await busService.getAllBuses();
      setBuses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setBusData({ ...busData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (bus) => {
    setEditingBusId(bus.id);
    setBusData({
      busName: bus.busName,
      source: bus.source,
      destination: bus.destination,
      travelDate: bus.travelDate,
      price: bus.fare || '', // Map fare back to price for the form
      totalSeats: bus.totalSeats
    });
    setSuccess('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingBusId(null);
    setBusData({
      busName: '',
      source: '',
      destination: '',
      travelDate: '',
      price: '',
      totalSeats: ''
    });
  };

  const handleSaveBus = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    try {
      const formattedData = {
        busName: busData.busName,
        source: busData.source,
        destination: busData.destination,
        travelDate: busData.travelDate,
        fare: parseFloat(busData.price), // backend uses 'fare'
        totalSeats: parseInt(busData.totalSeats, 10),
      };

      const wasEditing = !!editingBusId;
      const currentEditId = editingBusId;

      if (wasEditing) {
        await busService.updateBus(currentEditId, formattedData);
        setSuccess('Bus updated successfully!');
        setEditingBusId(null);
        setBusData({ busName: '', source: '', destination: '', travelDate: '', price: '', totalSeats: '' });
        fetchBuses();
      } else {
        formattedData.availableSeats = formattedData.totalSeats;
        await busService.addBus(formattedData);
        setSuccess('Bus created successfully!');
        setBusData({ busName: '', source: '', destination: '', travelDate: '', price: '', totalSeats: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editingBusId ? 'update' : 'create'} bus`);
    }
  };

  const handleDeleteBus = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus? All associated bookings will also be deleted.')) {
      try {
        await busService.deleteBus(id);
        fetchBuses(); // Refresh the list
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete bus');
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage buses, routes, and platform bookings</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`btn ${activeTab === 'addBus' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('addBus')}
        >
          <PlusCircle size={18} /> Add New Bus
        </button>
        <button 
          className={`btn ${activeTab === 'manageBuses' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('manageBuses')}
        >
          <List size={18} /> Manage Buses
        </button>
        <button 
          className={`btn ${activeTab === 'allBookings' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('allBookings')}
        >
          <List size={18} /> All Bookings
        </button>
      </div>

      {activeTab === 'addBus' && (
        <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            <PlusCircle size={24} /> Create a Bus
          </h2>
          
          {success && <div style={{ color: '#10b981', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#ecfdf5', borderRadius: '4px' }}>{success}</div>}
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '4px' }}>{error}</div>}
          
          <form onSubmit={handleSaveBus}>
            <div className="input-group">
              <label className="input-label">Bus Name</label>
              <input type="text" className="input-field" name="busName" value={busData.busName} onChange={handleChange} required />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Source</label>
                <input type="text" className="input-field" name="source" value={busData.source} onChange={handleChange} required />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Destination</label>
                <input type="text" className="input-field" name="destination" value={busData.destination} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Travel Date</label>
              <input type="date" className="input-field" name="travelDate" value={busData.travelDate} onChange={handleChange} required />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Ticket Price (₹)</label>
                <input type="number" step="0.01" min="0" className="input-field" name="price" value={busData.price} onChange={handleChange} required />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Total Seats</label>
                <input type="number" min="1" className="input-field" name="totalSeats" value={busData.totalSeats} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: '48px', fontSize: '1.1rem' }}>
              Create Bus
            </button>
          </form>
        </div>
      )}

      {activeTab === 'manageBuses' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
            {editingBusId ? 'Edit Bus' : 'Manage Buses'}
          </h2>
          
          {success && <div style={{ color: '#10b981', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#ecfdf5', borderRadius: '4px' }}>{success}</div>}
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '4px' }}>{error}</div>}

          {editingBusId ? (
            <form onSubmit={handleSaveBus} style={{ maxWidth: '600px' }}>
              <div className="input-group">
                <label className="input-label">Bus Name</label>
                <input type="text" className="input-field" name="busName" value={busData.busName} onChange={handleChange} required />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Source</label>
                  <input type="text" className="input-field" name="source" value={busData.source} onChange={handleChange} required />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Destination</label>
                  <input type="text" className="input-field" name="destination" value={busData.destination} onChange={handleChange} required />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Travel Date</label>
                <input type="date" className="input-field" name="travelDate" value={busData.travelDate} onChange={handleChange} required />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Ticket Price (₹)</label>
                  <input type="number" step="0.01" min="0" className="input-field" name="price" value={busData.price} onChange={handleChange} required />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Total Seats</label>
                  <input type="number" min="1" className="input-field" name="totalSeats" value={busData.totalSeats} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '48px' }}>
                  Save Changes
                </button>
                <button type="button" onClick={handleCancelEdit} className="btn btn-secondary" style={{ flex: 1, height: '48px' }}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Bus Name</th>
                    <th style={{ padding: '1rem' }}>Route</th>
                    <th style={{ padding: '1rem' }}>Date</th>
                    <th style={{ padding: '1rem' }}>Price</th>
                    <th style={{ padding: '1rem' }}>Seats</th>
                    <th style={{ padding: '1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map(bus => (
                    <tr key={bus.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '1rem' }}>{bus.id}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>{bus.busName}</td>
                      <td style={{ padding: '1rem' }}>{bus.source} &rarr; {bus.destination}</td>
                      <td style={{ padding: '1rem' }}>{bus.travelDate}</td>
                      <td style={{ padding: '1rem' }}>₹{bus.fare}</td>
                      <td style={{ padding: '1rem' }}>{bus.availableSeats} / {bus.totalSeats}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEditClick(bus)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteBus(bus.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {buses.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No buses found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'allBookings' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>All Platform Bookings</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
                  <th style={{ padding: '1rem' }}>ID</th>
                  <th style={{ padding: '1rem' }}>User</th>
                  <th style={{ padding: '1rem' }}>Bus</th>
                  <th style={{ padding: '1rem' }}>Seats</th>
                  <th style={{ padding: '1rem' }}>Amount</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '1rem' }}>{booking.id}</td>
                    <td style={{ padding: '1rem' }}>{booking.user?.username || 'Unknown'}</td>
                    <td style={{ padding: '1rem' }}>
                      {booking.bus?.busName} <br />
                      <small style={{ color: 'var(--text-muted)' }}>{booking.bus?.source} &rarr; {booking.bus?.destination}</small>
                    </td>
                    <td style={{ padding: '1rem' }}>{booking.seatNumbers?.length || 0}</td>
                    <td style={{ padding: '1rem' }}>₹{booking.totalAmount}</td>
                    <td style={{ padding: '1rem', color: booking.status === 'CONFIRMED' ? 'var(--secondary)' : '#ef4444' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {booking.status === 'CONFIRMED' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {booking.status}
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;