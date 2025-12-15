import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import api from '../config/api';
import './Admin.css';

const Admin = () => {
  const { currentUser, logout } = useAuth();
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('forms');
  const [contactForms, setContactForms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [housing, setHousing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSettings, setEditingSettings] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser]);

  const fetchAllData = async () => {
    try {
      const [formsRes, reviewsRes, programsRes, housingRes] = await Promise.all([
        api.get('/contact-forms/'),
        api.get('/reviews/'),
        api.get('/programs/'),
        api.get('/housing/'),
      ]);
      // Handle paginated responses (DRF returns {results: [...]} when paginated)
      setContactForms(Array.isArray(formsRes.data) ? formsRes.data : (formsRes.data.results || []));
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : (reviewsRes.data.results || []));
      setPrograms(Array.isArray(programsRes.data) ? programsRes.data : (programsRes.data.results || []));
      setHousing(Array.isArray(housingRes.data) ? housingRes.data : (housingRes.data.results || []));
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error to prevent map errors
      setContactForms([]);
      setReviews([]);
      setPrograms([]);
      setHousing([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (id) => {
    if (window.confirm('Are you sure you want to delete this form submission?')) {
      try {
        await api.delete(`/contact-forms/${id}/`);
        setContactForms(contactForms.filter(form => form.id !== id));
      } catch (error) {
        console.error('Error deleting form:', error);
        alert('Error deleting form');
      }
    }
  };

  const handleUpdateForm = async (id, data) => {
    try {
      const response = await api.patch(`/contact-forms/${id}/`, data);
      setContactForms(contactForms.map(form => form.id === id ? response.data : form));
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating form:', error);
      alert('Error updating form');
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${id}/`);
        setReviews(reviews.filter(review => review.id !== id));
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review');
      }
    }
  };

  const handleUpdateReview = async (id, data) => {
    try {
      const response = await api.patch(`/reviews/${id}/`, data);
      setReviews(reviews.map(review => review.id === id ? response.data : review));
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Error updating review');
    }
  };

  const handleDeleteProgram = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await api.delete(`/programs/${id}/`);
        setPrograms(programs.filter(program => program.id !== id));
      } catch (error) {
        console.error('Error deleting program:', error);
        alert('Error deleting program');
      }
    }
  };

  const handleUpdateProgram = async (id, data) => {
    try {
      const response = await api.patch(`/programs/${id}/`, data);
      setPrograms(programs.map(program => program.id === id ? response.data : program));
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating program:', error);
      alert('Error updating program');
    }
  };

  const handleCreateProgram = async (data) => {
    try {
      const response = await api.post('/programs/', data);
      setPrograms([...programs, response.data]);
      setEditingItem(null);
    } catch (error) {
      console.error('Error creating program:', error);
      alert('Error creating program');
    }
  };

  const handleDeleteHousing = async (id) => {
    if (window.confirm('Are you sure you want to delete this housing option?')) {
      try {
        await api.delete(`/housing/${id}/`);
        setHousing(housing.filter(h => h.id !== id));
      } catch (error) {
        console.error('Error deleting housing:', error);
        alert('Error deleting housing');
      }
    }
  };

  const handleUpdateHousing = async (id, data) => {
    try {
      const response = await api.patch(`/housing/${id}/`, data);
      setHousing(housing.map(h => h.id === id ? response.data : h));
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating housing:', error);
      alert('Error updating housing');
    }
  };

  const handleCreateHousing = async (data) => {
    try {
      const response = await api.post('/housing/', data);
      setHousing([...housing, response.data]);
      setEditingItem(null);
    } catch (error) {
      console.error('Error creating housing:', error);
      alert('Error creating housing');
    }
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      const result = await updateSettings(newSettings);
      if (result.success) {
        setEditingSettings(false);
        alert('Settings updated successfully!');
      } else {
        const errorMsg = result.error || 'Unknown error occurred';
        console.error('Settings update error:', errorMsg);
        alert(`Error updating settings: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Settings update exception:', error);
      alert(`Error updating settings: ${error.message || 'Please check the console for details'}`);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    } else {
      console.error('Logout error:', result.error);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-left">
            <Link to="/" className="admin-home-link">
              <svg className="home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </Link>
            <h1>Admin Panel</h1>
          </div>
          <div className="admin-header-actions">
            <span>Welcome, {currentUser?.email}</span>
            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <div className="container">
          <button 
            className={activeTab === 'forms' ? 'active' : ''}
            onClick={() => setActiveTab('forms')}
          >
            Contact Forms
          </button>
          <button 
            className={activeTab === 'reviews' ? 'active' : ''}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          <button 
            className={activeTab === 'programs' ? 'active' : ''}
            onClick={() => setActiveTab('programs')}
          >
            Programs
          </button>
          <button 
            className={activeTab === 'housing' ? 'active' : ''}
            onClick={() => setActiveTab('housing')}
          >
            Housing
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            Site Settings
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          {activeTab === 'forms' && (
            <ContactFormsTab 
              forms={contactForms}
              onDelete={handleDeleteForm}
              onUpdate={handleUpdateForm}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewsTab 
              reviews={reviews}
              onDelete={handleDeleteReview}
              onUpdate={handleUpdateReview}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
            />
          )}

          {activeTab === 'programs' && (
            <ProgramsTab 
              programs={programs}
              onDelete={handleDeleteProgram}
              onUpdate={handleUpdateProgram}
              onCreate={handleCreateProgram}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
            />
          )}

          {activeTab === 'housing' && (
            <HousingTab 
              housing={housing}
              onDelete={handleDeleteHousing}
              onUpdate={handleUpdateHousing}
              onCreate={handleCreateHousing}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              settings={settings}
              onSave={handleSaveSettings}
              editing={editingSettings}
              setEditing={setEditingSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Contact Forms Tab Component
const ContactFormsTab = ({ forms, onDelete, onUpdate, editingItem, setEditingItem }) => {
  const [formData, setFormData] = useState({});

  // Ensure forms is always an array
  const formsArray = Array.isArray(forms) ? forms : [];

  const handleEdit = (form) => {
    setEditingItem(form.id);
    setFormData({
      status: form.status,
      notes: form.notes || '',
    });
  };

  const handleSave = (id) => {
    onUpdate(id, formData);
  };

  return (
    <div className="admin-tab-content">
      <h2>Contact Form Submissions ({formsArray.length})</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {formsArray.map(form => (
              <tr key={form.id}>
                <td>{form.name}</td>
                <td>{form.email}</td>
                <td>{form.phone || 'N/A'}</td>
                <td className="message-cell">{form.message.substring(0, 50)}...</td>
                <td>
                  {editingItem === form.id ? (
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  ) : (
                    form.status
                  )}
                </td>
                <td>{new Date(form.submitted_at).toLocaleDateString()}</td>
                <td className="actions-cell">
                  {editingItem === form.id ? (
                    <>
                      <button onClick={() => handleSave(form.id)} className="btn-small btn-primary">Save</button>
                      <button onClick={() => setEditingItem(null)} className="btn-small">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(form)} className="btn-small btn-primary">Edit</button>
                      <button onClick={() => onDelete(form.id)} className="btn-small btn-danger">Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reviews Tab Component
const ReviewsTab = ({ reviews, onDelete, onUpdate, editingItem, setEditingItem }) => {
  const [formData, setFormData] = useState({});

  const handleEdit = (review) => {
    setEditingItem(review.id);
    setFormData({
      author_name: review.author_name,
      author_location: review.author_location,
      rating: review.rating,
      content: review.content,
      is_approved: review.is_approved,
      is_featured: review.is_featured,
    });
  };

  const handleSave = (id) => {
    onUpdate(id, formData);
  };

  return (
    <div className="admin-tab-content">
      <h2>Reviews ({reviews.length})</h2>
      <div className="admin-grid">
        {reviews.map(review => (
          <div key={review.id} className="admin-card">
            {editingItem === review.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                  placeholder="Author Name"
                />
                <input
                  type="text"
                  value={formData.author_location}
                  onChange={(e) => setFormData({...formData, author_location: e.target.value})}
                  placeholder="Location"
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  placeholder="Rating"
                />
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Review Content"
                  rows="4"
                />
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_approved}
                    onChange={(e) => setFormData({...formData, is_approved: e.target.checked})}
                  />
                  Approved
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                  />
                  Featured
                </label>
                <div className="edit-actions">
                  <button onClick={() => handleSave(review.id)} className="btn-small btn-primary">Save</button>
                  <button onClick={() => setEditingItem(null)} className="btn-small">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h3>{review.author_name}</h3>
                <p>{review.author_location}</p>
                <p>Rating: {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                <p>{review.content}</p>
                <div className="admin-card-actions">
                  <button onClick={() => handleEdit(review)} className="btn-small btn-primary">Edit</button>
                  <button onClick={() => onDelete(review.id)} className="btn-small btn-danger">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Programs Tab Component
const ProgramsTab = ({ programs, onDelete, onUpdate, onCreate, editingItem, setEditingItem }) => {
  const [formData, setFormData] = useState({});

  const handleEdit = (program) => {
    setEditingItem(program.id);
    setFormData({
      name: program.name,
      description: program.description,
      duration: program.duration,
      features: Array.isArray(program.features) ? program.features.join('\n') : '',
      is_active: program.is_active,
      order: program.order,
    });
  };

  const handleNew = () => {
    setEditingItem('new');
    setFormData({
      name: '',
      description: '',
      duration: '',
      features: '',
      is_active: true,
      order: 0,
    });
  };

  const handleSave = async (id) => {
    const data = {
      ...formData,
      features: formData.features.split('\n').filter(f => f.trim()),
    };
    if (id === 'new') {
      await onCreate(data);
    } else {
      await onUpdate(id, data);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-header-actions">
        <h2>Programs ({programs.length})</h2>
        <button onClick={handleNew} className="btn btn-primary">Add New Program</button>
      </div>
      <div className="admin-grid">
        {programs.map(program => (
          <div key={program.id} className="admin-card">
            {editingItem === program.id ? (
              <ProgramForm
                formData={formData}
                setFormData={setFormData}
                onSave={() => handleSave(program.id)}
                onCancel={() => setEditingItem(null)}
              />
            ) : (
              <>
                <h3>{program.name}</h3>
                <p>{program.duration}</p>
                <p>{program.description}</p>
                <div className="admin-card-actions">
                  <button onClick={() => handleEdit(program)} className="btn-small btn-primary">Edit</button>
                  <button onClick={() => onDelete(program.id)} className="btn-small btn-danger">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
        {editingItem === 'new' && (
          <div className="admin-card">
            <ProgramForm
              formData={formData}
              setFormData={setFormData}
              onSave={() => handleSave('new')}
              onCancel={() => setEditingItem(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ProgramForm = ({ formData, setFormData, onSave, onCancel }) => (
  <div className="edit-form">
    <input
      type="text"
      value={formData.name}
      onChange={(e) => setFormData({...formData, name: e.target.value})}
      placeholder="Program Name"
    />
    <textarea
      value={formData.description}
      onChange={(e) => setFormData({...formData, description: e.target.value})}
      placeholder="Description"
      rows="3"
    />
    <input
      type="text"
      value={formData.duration}
      onChange={(e) => setFormData({...formData, duration: e.target.value})}
      placeholder="Duration (e.g., 30 days)"
    />
    <textarea
      value={formData.features}
      onChange={(e) => setFormData({...formData, features: e.target.value})}
      placeholder="Features (one per line)"
      rows="4"
    />
    <label>
      <input
        type="checkbox"
        checked={formData.is_active}
        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
      />
      Active
    </label>
    <input
      type="number"
      value={formData.order}
      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
      placeholder="Order"
    />
    <div className="edit-actions">
      <button onClick={onSave} className="btn-small btn-primary">Save</button>
      <button onClick={onCancel} className="btn-small">Cancel</button>
    </div>
  </div>
);

// Housing Tab Component
const HousingTab = ({ housing, onDelete, onUpdate, onCreate, editingItem, setEditingItem }) => {
  const [formData, setFormData] = useState({});

  const handleEdit = (h) => {
    setEditingItem(h.id);
    setFormData({
      name: h.name,
      description: h.description,
      capacity: h.capacity || '',
      amenities: Array.isArray(h.amenities) ? h.amenities.join('\n') : '',
      is_available: h.is_available,
      order: h.order,
    });
  };

  const handleNew = () => {
    setEditingItem('new');
    setFormData({
      name: '',
      description: '',
      capacity: '',
      amenities: '',
      is_available: true,
      order: 0,
    });
  };

  const handleSave = async (id) => {
    const data = {
      ...formData,
      amenities: formData.amenities.split('\n').filter(a => a.trim()),
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
    };
    if (id === 'new') {
      await onCreate(data);
    } else {
      await onUpdate(id, data);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-header-actions">
        <h2>Housing Options ({housing.length})</h2>
        <button onClick={handleNew} className="btn btn-primary">Add New Housing</button>
      </div>
      <div className="admin-grid">
        {housing.map(h => (
          <div key={h.id} className="admin-card">
            {editingItem === h.id ? (
              <HousingForm
                formData={formData}
                setFormData={setFormData}
                onSave={() => handleSave(h.id)}
                onCancel={() => setEditingItem(null)}
              />
            ) : (
              <>
                <h3>{h.name}</h3>
                <p>Capacity: {h.capacity || 'N/A'}</p>
                <p>{h.description}</p>
                <div className="admin-card-actions">
                  <button onClick={() => handleEdit(h)} className="btn-small btn-primary">Edit</button>
                  <button onClick={() => onDelete(h.id)} className="btn-small btn-danger">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
        {editingItem === 'new' && (
          <div className="admin-card">
            <HousingForm
              formData={formData}
              setFormData={setFormData}
              onSave={() => handleSave('new')}
              onCancel={() => setEditingItem(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const HousingForm = ({ formData, setFormData, onSave, onCancel }) => (
  <div className="edit-form">
    <input
      type="text"
      value={formData.name}
      onChange={(e) => setFormData({...formData, name: e.target.value})}
      placeholder="Housing Name"
    />
    <textarea
      value={formData.description}
      onChange={(e) => setFormData({...formData, description: e.target.value})}
      placeholder="Description"
      rows="3"
    />
    <input
      type="number"
      value={formData.capacity}
      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
      placeholder="Capacity"
    />
    <textarea
      value={formData.amenities}
      onChange={(e) => setFormData({...formData, amenities: e.target.value})}
      placeholder="Amenities (one per line)"
      rows="4"
    />
    <label>
      <input
        type="checkbox"
        checked={formData.is_available}
        onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
      />
      Available
    </label>
    <input
      type="number"
      value={formData.order}
      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
      placeholder="Order"
    />
    <div className="edit-actions">
      <button onClick={onSave} className="btn-small btn-primary">Save</button>
      <button onClick={onCancel} className="btn-small">Cancel</button>
    </div>
  </div>
);

// Settings Tab Component
const SettingsTab = ({ settings, onSave, editing, setEditing }) => {
  const [formData, setFormData] = useState(settings);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setFormData(settings);
    // Set preview if there's an existing image
    if (settings.background_image && typeof settings.background_image === 'string') {
      const apiBaseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000';
      const imageUrl = settings.background_image.startsWith('http') 
        ? settings.background_image 
        : `${apiBaseUrl}${settings.background_image}`;
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [settings]);

  const handleSave = () => {
    // Create a clean copy of formData
    const dataToSave = { ...formData };
    
    // Handle background_image:
    // - If it's a File object, include it (new upload)
    // - If it's null, include it (to remove existing image)
    // - If it's a string (URL), exclude it (keep existing image)
    if (dataToSave.background_image && typeof dataToSave.background_image === 'string') {
      // It's a URL string, don't send it (backend will keep existing)
      delete dataToSave.background_image;
    }
    // If it's null or a File, keep it in dataToSave
    
    onSave(dataToSave);
  };

  if (!editing) {
    return (
      <div className="admin-tab-content">
        <div className="admin-header-actions">
          <h2>Site Settings</h2>
          <button onClick={() => setEditing(true)} className="btn btn-primary">Edit Settings</button>
        </div>
        <div className="settings-display">
          <div className="setting-item">
            <strong>Site Name:</strong> {settings.site_name}
          </div>
          <div className="setting-item">
            <strong>Primary Color:</strong> 
            <span className="color-box" style={{ backgroundColor: settings.primary_color }}></span>
            {settings.primary_color}
          </div>
          <div className="setting-item">
            <strong>Secondary Color:</strong> 
            <span className="color-box" style={{ backgroundColor: settings.secondary_color }}></span>
            {settings.secondary_color}
          </div>
          <div className="setting-item">
            <strong>Accent Color:</strong> 
            <span className="color-box" style={{ backgroundColor: settings.accent_color }}></span>
            {settings.accent_color}
          </div>
          <div className="setting-item">
            <strong>Background Color:</strong> 
            <span className="color-box" style={{ backgroundColor: settings.background_color }}></span>
            {settings.background_color}
          </div>
          <div className="setting-item">
            <strong>Hero Title:</strong> {settings.hero_title}
          </div>
          <div className="setting-item">
            <strong>Hero Subtitle:</strong> {settings.hero_subtitle}
          </div>
          <div className="setting-item">
            <strong>About Content:</strong> {settings.about_content}
          </div>
          <div className="setting-item">
            <strong>Contact Email:</strong> {settings.contact_email}
          </div>
          <div className="setting-item">
            <strong>Contact Phone:</strong> {settings.contact_phone}
          </div>
          <div className="setting-item">
            <strong>Address:</strong> {settings.address}
          </div>
          <div className="setting-item">
            <strong>Background Image:</strong>
            {settings.background_image ? (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={settings.background_image.startsWith('http') 
                    ? settings.background_image 
                    : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}${settings.background_image}`}
                  alt="Background preview" 
                  style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>
            ) : (
              <span style={{ color: '#999' }}>No background image set</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-tab-content">
      <h2>Edit Site Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label>Site Name</label>
          <input
            type="text"
            value={formData.site_name}
            onChange={(e) => setFormData({...formData, site_name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Primary Color (Hex)</label>
          <input
            type="text"
            value={formData.primary_color}
            onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
            placeholder="#000000"
          />
        </div>
        <div className="form-group">
          <label>Secondary Color (Hex)</label>
          <input
            type="text"
            value={formData.secondary_color}
            onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
            placeholder="#808080"
          />
        </div>
        <div className="form-group">
          <label>Accent Color (Hex)</label>
          <input
            type="text"
            value={formData.accent_color}
            onChange={(e) => setFormData({...formData, accent_color: e.target.value})}
            placeholder="#DC143C"
          />
        </div>
        <div className="form-group">
          <label>Background Color (Hex)</label>
          <input
            type="text"
            value={formData.background_color}
            onChange={(e) => setFormData({...formData, background_color: e.target.value})}
            placeholder="#FFFFFF"
          />
        </div>
        <div className="form-group">
          <label>Background Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setFormData({...formData, background_image: file});
                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '10px' }}
              />
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                {formData.background_image instanceof File ? formData.background_image.name : 'Current image'}
              </p>
            </div>
          )}
          {formData.background_image && !(formData.background_image instanceof File) && (
            <button
              type="button"
              onClick={() => {
                setFormData({...formData, background_image: null});
                setImagePreview(null);
              }}
              style={{ marginTop: '10px', padding: '5px 10px', fontSize: '0.9rem' }}
              className="btn btn-outline"
            >
              Remove Image
            </button>
          )}
        </div>
        <div className="form-group">
          <label>Hero Title</label>
          <input
            type="text"
            value={formData.hero_title}
            onChange={(e) => setFormData({...formData, hero_title: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Hero Subtitle</label>
          <textarea
            value={formData.hero_subtitle}
            onChange={(e) => setFormData({...formData, hero_subtitle: e.target.value})}
            rows="2"
          />
        </div>
        <div className="form-group">
          <label>About Content</label>
          <textarea
            value={formData.about_content}
            onChange={(e) => setFormData({...formData, about_content: e.target.value})}
            rows="5"
          />
        </div>
        <div className="form-group">
          <label>Contact Email</label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Contact Phone</label>
          <input
            type="text"
            value={formData.contact_phone}
            onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            rows="2"
          />
        </div>
        <div className="edit-actions">
          <button onClick={handleSave} className="btn btn-primary">Save Settings</button>
          <button onClick={() => setEditing(false)} className="btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
