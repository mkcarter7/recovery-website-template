import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import api from '../config/api';

const Admin = () => {
  const { currentUser, logout } = useAuth();
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('forms');
  const [contactForms, setContactForms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [housing, setHousing] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [housingApplications, setHousingApplications] = useState([]);
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
      const [formsRes, reviewsRes, programsRes, housingRes, wishlistsRes, sponsorsRes, applicationsRes] = await Promise.all([
        api.get('/contact-forms/'),
        api.get('/reviews/'),
        api.get('/programs/'),
        api.get('/housing/'),
        api.get('/wishlists/'),
        api.get('/donors/'),
        api.get('/housing-applications/'),
      ]);
      // Handle paginated responses (DRF returns {results: [...]} when paginated)
      setContactForms(Array.isArray(formsRes.data) ? formsRes.data : (formsRes.data.results || []));
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : (reviewsRes.data.results || []));
      setPrograms(Array.isArray(programsRes.data) ? programsRes.data : (programsRes.data.results || []));
      setHousing(Array.isArray(housingRes.data) ? housingRes.data : (housingRes.data.results || []));
      setWishlists(Array.isArray(wishlistsRes.data) ? wishlistsRes.data : (wishlistsRes.data.results || []));
      setSponsors(Array.isArray(sponsorsRes.data) ? sponsorsRes.data : (sponsorsRes.data.results || []));
      setHousingApplications(Array.isArray(applicationsRes.data) ? applicationsRes.data : (applicationsRes.data.results || []));
    } catch (error) {
      // Set empty arrays on error to prevent map errors
      setContactForms([]);
      setReviews([]);
      setPrograms([]);
      setHousing([]);
      setWishlists([]);
      setSponsors([]);
      setHousingApplications([]);
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
      alert('Error updating form');
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${id}/`);
        setReviews(reviews.filter(review => review.id !== id));
      } catch (error) {
        alert('Error deleting review');
      }
    }
  };

  const handleCreateReview = async (data) => {
    try {
      const response = await api.post('/reviews/', data);
      setReviews([...reviews, response.data]);
      setEditingItem(null);
    } catch (error) {
      alert('Error creating review');
    }
  };

  const handleUpdateReview = async (id, data) => {
    try {
      const response = await api.patch(`/reviews/${id}/`, data);
      setReviews(reviews.map(review => review.id === id ? response.data : review));
      setEditingItem(null);
    } catch (error) {
      alert('Error updating review');
    }
  };

  const handleDeleteProgram = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await api.delete(`/programs/${id}/`);
        setPrograms(programs.filter(program => program.id !== id));
      } catch (error) {
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
      alert('Error updating program');
    }
  };

  const handleCreateProgram = async (data) => {
    try {
      const response = await api.post('/programs/', data);
      setPrograms([...programs, response.data]);
      setEditingItem(null);
    } catch (error) {
      alert('Error creating program');
    }
  };

  const handleDeleteHousing = async (id) => {
    if (window.confirm('Are you sure you want to delete this housing option?')) {
      try {
        await api.delete(`/housing/${id}/`);
        setHousing(housing.filter(h => h.id !== id));
      } catch (error) {
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
      alert('Error updating housing');
    }
  };

  const handleCreateHousing = async (data) => {
    try {
      const response = await api.post('/housing/', data);
      setHousing([...housing, response.data]);
      setEditingItem(null);
    } catch (error) {
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
        alert(`Error updating settings: ${errorMsg}`);
      }
    } catch (error) {
      alert(`Error updating settings: ${error.message || 'Unknown error occurred'}`);
    }
  };

  const handleDeleteWishList = async (id) => {
    if (window.confirm('Are you sure you want to delete this wish list?')) {
      try {
        await api.delete(`/wishlists/${id}/`);
        setWishlists(wishlists.filter(w => w.id !== id));
      } catch (error) {
        alert('Error deleting wish list');
      }
    }
  };

  const handleUpdateWishList = async (id, data) => {
    try {
      const response = await api.patch(`/wishlists/${id}/`, data);
      setWishlists(wishlists.map(w => w.id === id ? response.data : w));
      setEditingItem(null);
    } catch (error) {
      alert('Error updating wish list');
    }
  };

  const handleCreateWishList = async (data) => {
    try {
      const response = await api.post('/wishlists/', data);
      setWishlists([...wishlists, response.data]);
      setEditingItem(null);
    } catch (error) {
      alert('Error creating wish list');
    }
  };

  const handleDeleteSponsor = async (id) => {
    if (window.confirm('Are you sure you want to delete this sponsor entry?')) {
      try {
        await api.delete(`/donors/${id}/`);
        setSponsors(sponsors.filter(d => d.id !== id));
      } catch (error) {
        alert('Error deleting sponsor');
      }
    }
  };

  const handleUpdateSponsor = async (id, data) => {
    try {
      const response = await api.patch(`/donors/${id}/`, data);
      setSponsors(sponsors.map(d => d.id === id ? response.data : d));
      setEditingItem(null);
    } catch (error) {
      alert('Error updating sponsor');
    }
  };

  const handleCreateSponsor = async (data) => {
    try {
      const response = await api.post('/donors/', data);
      setSponsors([...sponsors, response.data]);
      setEditingItem(null);
    } catch (error) {
      alert('Error creating sponsor');
    }
  };

  const handleDeleteHousingApplication = async (id) => {
    if (window.confirm('Are you sure you want to delete this housing application?')) {
      try {
        await api.delete(`/housing-applications/${id}/`);
        setHousingApplications(housingApplications.filter(app => app.id !== id));
      } catch (error) {
        alert('Error deleting housing application');
      }
    }
  };

  const handleUpdateHousingApplication = async (id, data) => {
    try {
      const response = await api.patch(`/housing-applications/${id}/`, data);
      setHousingApplications(housingApplications.map(app => app.id === id ? response.data : app));
      setEditingItem(null);
    } catch (error) {
      alert('Error updating housing application');
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
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
            className={activeTab === 'wishlists' ? 'active' : ''}
            onClick={() => setActiveTab('wishlists')}
          >
            Wish Lists
          </button>
          <button 
            className={activeTab === 'sponsors' ? 'active' : ''}
            onClick={() => setActiveTab('sponsors')}
          >
            Sponsors
          </button>
          <button 
            className={activeTab === 'applications' ? 'active' : ''}
            onClick={() => setActiveTab('applications')}
          >
            Housing Applications
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
              onCreate={handleCreateReview}
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

          {activeTab === 'wishlists' && (
            <WishListsTab 
              wishlists={wishlists}
              onDelete={handleDeleteWishList}
              onUpdate={handleUpdateWishList}
              onCreate={handleCreateWishList}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
            />
          )}

          {activeTab === 'sponsors' && (
            <SponsorsTab 
              sponsors={sponsors}
              onDelete={handleDeleteSponsor}
              onUpdate={handleUpdateSponsor}
              onCreate={handleCreateSponsor}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
            />
          )}

          {activeTab === 'applications' && (
            <HousingApplicationsTab 
              applications={housingApplications}
              onDelete={handleDeleteHousingApplication}
              onUpdate={handleUpdateHousingApplication}
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
const ReviewsTab = ({ reviews, onDelete, onUpdate, onCreate, editingItem, setEditingItem }) => {
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

  const handleNew = () => {
    setEditingItem('new');
    setFormData({
      author_name: '',
      author_location: '',
      rating: 5,
      content: '',
      is_approved: false,
      is_featured: false,
    });
  };

  const handleSave = (id) => {
    if (id === 'new') {
      onCreate(formData);
    } else {
      onUpdate(id, formData);
    }
  };

  // Ensure reviews is always an array
  const reviewsArray = Array.isArray(reviews) ? reviews : [];

  return (
    <div className="admin-tab-content">
      <div className="admin-header-actions">
        <h2>Reviews ({reviewsArray.length})</h2>
        {editingItem !== 'new' && (
          <button onClick={handleNew} className="btn btn-primary">Add New Review</button>
        )}
      </div>
      
      {/* New Review Form */}
      {editingItem === 'new' && (
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <div className="edit-form">
            <h3>New Review</h3>
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
              placeholder="Location (optional)"
            />
            <label>
              Rating (1-5):
              <input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value) || 5})}
                placeholder="Rating"
              />
            </label>
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
              Featured (show on homepage)
            </label>
            <div className="edit-actions">
              <button onClick={() => handleSave('new')} className="btn-small btn-primary">Create Review</button>
              <button onClick={() => setEditingItem(null)} className="btn-small">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-grid">
        {reviewsArray.map(review => (
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
      let imageUrl;
      if (settings.background_image.startsWith('http://') || settings.background_image.startsWith('https://')) {
        // Already a full URL
        imageUrl = settings.background_image;
      } else {
        // Construct full URL from relative path
        const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
        const baseUrl = apiBaseUrl.replace(/\/api$/, '');
        imageUrl = settings.background_image.startsWith('/') 
          ? `${baseUrl}${settings.background_image}`
          : `${baseUrl}/${settings.background_image}`;
      }
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
    
    // Handle social media URLs: convert empty strings to null so backend can clear them
    const socialMediaFields = ['facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url', 'youtube_url', 'tiktok_url'];
    socialMediaFields.forEach(field => {
      if (dataToSave[field] === '' || dataToSave[field] === undefined) {
        dataToSave[field] = null;
      }
    });
    
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
            <strong>Mission:</strong> {settings.mission || 'Not set'}
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
            <strong>Social Media Links:</strong>
            <div style={{ marginTop: '10px' }}>
              {settings.facebook_url && <div>Facebook: <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer">{settings.facebook_url}</a></div>}
              {settings.instagram_url && <div>Instagram: <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">{settings.instagram_url}</a></div>}
              {settings.twitter_url && <div>Twitter/X: <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer">{settings.twitter_url}</a></div>}
              {settings.linkedin_url && <div>LinkedIn: <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer">{settings.linkedin_url}</a></div>}
              {settings.youtube_url && <div>YouTube: <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">{settings.youtube_url}</a></div>}
              {settings.tiktok_url && <div>TikTok: <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer">{settings.tiktok_url}</a></div>}
              {!settings.facebook_url && !settings.instagram_url && !settings.twitter_url && 
               !settings.linkedin_url && !settings.youtube_url && !settings.tiktok_url && (
                <span style={{ color: '#999' }}>No social media links set</span>
              )}
            </div>
          </div>
          <div className="setting-item">
            <strong>Background Image:</strong>
            {settings.background_image ? (
              <div style={{ marginTop: '10px' }}>
                {(() => {
                  let imageUrl;
                  if (settings.background_image.startsWith('http://') || settings.background_image.startsWith('https://')) {
                    imageUrl = settings.background_image;
                  } else {
                    const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
                    const baseUrl = apiBaseUrl.replace(/\/api$/, '');
                    imageUrl = settings.background_image.startsWith('/') 
                      ? `${baseUrl}${settings.background_image}`
                      : `${baseUrl}/${settings.background_image}`;
                  }
                  return (
                    <img 
                      src={imageUrl}
                      alt="Background preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        width: 'auto',
                        height: 'auto',
                        borderRadius: '5px', 
                        border: '1px solid #ddd', 
                        display: 'block',
                        marginTop: '10px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  );
                })()}
                <span style={{ display: 'none', color: '#999' }}>Image failed to load</span>
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
            placeholder="#91B9C1"
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
            placeholder="#91B9C1"
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
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  width: 'auto',
                  height: 'auto',
                  borderRadius: '5px', 
                  border: '1px solid #ddd', 
                  marginTop: '10px', 
                  display: 'block' 
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const errorMsg = e.target.nextElementSibling;
                  if (errorMsg) errorMsg.style.display = 'block';
                }}
              />
              <span style={{ display: 'none', color: '#91B9C1', fontSize: '0.9rem' }}>Failed to load image preview</span>
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
          <label>Mission</label>
          <textarea
            value={formData.mission || ''}
            onChange={(e) => setFormData({...formData, mission: e.target.value})}
            rows="5"
            placeholder="Enter your organization's mission statement"
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
        <div className="form-group">
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>Social Media Links</h3>
          <label>Facebook URL</label>
          <input
            type="url"
            value={formData.facebook_url || ''}
            onChange={(e) => setFormData({...formData, facebook_url: e.target.value})}
            placeholder="https://www.facebook.com/yourpage"
          />
        </div>
        <div className="form-group">
          <label>Instagram URL</label>
          <input
            type="url"
            value={formData.instagram_url || ''}
            onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
            placeholder="https://www.instagram.com/yourprofile"
          />
        </div>
        <div className="form-group">
          <label>Twitter/X URL</label>
          <input
            type="url"
            value={formData.twitter_url || ''}
            onChange={(e) => setFormData({...formData, twitter_url: e.target.value})}
            placeholder="https://twitter.com/yourhandle"
          />
        </div>
        <div className="form-group">
          <label>LinkedIn URL</label>
          <input
            type="url"
            value={formData.linkedin_url || ''}
            onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
            placeholder="https://www.linkedin.com/company/yourcompany"
          />
        </div>
        <div className="form-group">
          <label>YouTube URL</label>
          <input
            type="url"
            value={formData.youtube_url || ''}
            onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
            placeholder="https://www.youtube.com/channel/yourchannel"
          />
        </div>
        <div className="form-group">
          <label>TikTok URL</label>
          <input
            type="url"
            value={formData.tiktok_url || ''}
            onChange={(e) => setFormData({...formData, tiktok_url: e.target.value})}
            placeholder="https://www.tiktok.com/@yourhandle"
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

// Wish Lists Tab Component
const WishListsTab = ({ wishlists, onDelete, onUpdate, onCreate, editingItem, setEditingItem }) => {
  const [formData, setFormData] = useState({});

  const handleEdit = (wishlist) => {
    setEditingItem(wishlist.id);
    setFormData({
      name: wishlist.name,
      url: wishlist.url,
      description: wishlist.description || '',
      is_active: wishlist.is_active,
      order: wishlist.order,
    });
  };

  const handleCreate = () => {
    setEditingItem('new');
    setFormData({
      name: '',
      url: '',
      description: '',
      is_active: true,
      order: 0,
    });
  };

  const handleSave = (id) => {
    if (id === 'new') {
      onCreate(formData);
    } else {
      onUpdate(id, formData);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-tab-header">
        <h2>Amazon Wish Lists ({wishlists.length})</h2>
        <button onClick={handleCreate} className="btn btn-primary">Add Wish List</button>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>URL</th>
              <th>Description</th>
              <th>Active</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {editingItem === 'new' && (
              <tr>
                <td>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Wish List Name"
                  />
                </td>
                <td>
                  <input
                    type="url"
                    value={formData.url || ''}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder="Amazon Wish List URL"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description"
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={formData.is_active || false}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  />
                </td>
                <td>
                  <button onClick={() => handleSave('new')} className="btn btn-sm">Save</button>
                  <button onClick={() => setEditingItem(null)} className="btn btn-sm btn-outline">Cancel</button>
                </td>
              </tr>
            )}
            {wishlists.map(wishlist => (
              <tr key={wishlist.id}>
                {editingItem === wishlist.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSave(wishlist.id)} className="btn btn-sm">Save</button>
                      <button onClick={() => setEditingItem(null)} className="btn btn-sm btn-outline">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{wishlist.name}</td>
                    <td><a href={wishlist.url} target="_blank" rel="noopener noreferrer">{wishlist.url.substring(0, 50)}...</a></td>
                    <td>{wishlist.description || 'N/A'}</td>
                    <td>{wishlist.is_active ? 'Yes' : 'No'}</td>
                    <td>{wishlist.order}</td>
                    <td>
                      <button onClick={() => handleEdit(wishlist)} className="btn btn-sm">Edit</button>
                      <button onClick={() => onDelete(wishlist.id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sponsors Tab Component
const SponsorsTab = ({ sponsors, onDelete, onUpdate, onCreate, editingItem, setEditingItem }) => {
  const [formData, setFormData] = useState({});

  const handleEdit = (sponsor) => {
    setEditingItem(sponsor.id);
    setFormData({
      name: sponsor.name,
      amount: sponsor.amount || '',
      message: sponsor.message || '',
      is_anonymous: sponsor.is_anonymous,
      is_featured: sponsor.is_featured,
    });
  };

  const handleCreate = () => {
    setEditingItem('new');
    setFormData({
      name: '',
      amount: '',
      message: '',
      is_anonymous: false,
      is_featured: true,
    });
  };

  const handleSave = (id) => {
    const dataToSave = {
      ...formData,
      amount: formData.amount ? parseFloat(formData.amount) : null,
    };
    if (id === 'new') {
      onCreate(dataToSave);
    } else {
      onUpdate(id, dataToSave);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-tab-header">
        <h2>Sponsors ({sponsors.length})</h2>
        <button onClick={handleCreate} className="btn btn-primary">Add Sponsor</button>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Message</th>
              <th>Anonymous</th>
              <th>Featured</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {editingItem === 'new' && (
              <tr>
                <td>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Sponsor Name"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="Amount"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.message || ''}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Message"
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={formData.is_anonymous || false}
                    onChange={(e) => setFormData({...formData, is_anonymous: e.target.checked})}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={formData.is_featured !== false}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                  />
                </td>
                <td>-</td>
                <td>
                  <button onClick={() => handleSave('new')} className="btn btn-sm">Save</button>
                  <button onClick={() => setEditingItem(null)} className="btn btn-sm btn-outline">Cancel</button>
                </td>
              </tr>
            )}
            {sponsors.map(sponsor => (
              <tr key={sponsor.id}>
                {editingItem === sponsor.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={formData.is_anonymous}
                        onChange={(e) => setFormData({...formData, is_anonymous: e.target.checked})}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                      />
                    </td>
                    <td>{formatDate(sponsor.created_at)}</td>
                    <td>
                      <button onClick={() => handleSave(sponsor.id)} className="btn btn-sm">Save</button>
                      <button onClick={() => setEditingItem(null)} className="btn btn-sm btn-outline">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{sponsor.is_anonymous ? 'Anonymous' : sponsor.name}</td>
                    <td>{sponsor.amount ? `$${parseFloat(sponsor.amount).toFixed(2)}` : 'N/A'}</td>
                    <td className="message-cell">{sponsor.message || 'N/A'}</td>
                    <td>{sponsor.is_anonymous ? 'Yes' : 'No'}</td>
                    <td>{sponsor.is_featured ? 'Yes' : 'No'}</td>
                    <td>{formatDate(sponsor.created_at)}</td>
                    <td>
                      <button onClick={() => handleEdit(sponsor)} className="btn btn-sm">Edit</button>
                      <button onClick={() => onDelete(sponsor.id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Housing Applications Tab Component
const HousingApplicationsTab = ({ applications, onDelete, onUpdate, editingItem, setEditingItem }) => {
  const [formData, setFormData] = useState({});

  const handleEdit = (application) => {
    setEditingItem(application.id);
    setFormData({
      status: application.status,
      notes: application.notes || '',
    });
  };

  const handleSave = (id) => {
    onUpdate(id, formData);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const applicationsArray = Array.isArray(applications) ? applications : [];

  return (
    <div className="admin-tab-content">
      <h2>Housing Applications ({applicationsArray.length})</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Preferred Housing</th>
              <th>Move-In Date</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicationsArray.map(application => (
              <tr key={application.id}>
                {editingItem === application.id ? (
                  <>
                    <td>{application.first_name} {application.last_name}</td>
                    <td>{application.email}</td>
                    <td>{application.phone}</td>
                    <td>{application.preferred_housing_name || 'N/A'}</td>
                    <td>{formatDate(application.move_in_date)}</td>
                    <td>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="approved">Approved</option>
                        <option value="denied">Denied</option>
                        <option value="waitlisted">Waitlisted</option>
                      </select>
                    </td>
                    <td>{formatDate(application.submitted_at)}</td>
                    <td>
                      <button onClick={() => handleSave(application.id)} className="btn btn-sm">Save</button>
                      <button onClick={() => setEditingItem(null)} className="btn btn-sm btn-outline">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{application.first_name} {application.last_name}</td>
                    <td>{application.email}</td>
                    <td>{application.phone}</td>
                    <td>{application.preferred_housing_name || 'N/A'}</td>
                    <td>{formatDate(application.move_in_date)}</td>
                    <td>
                      <span className={`status-badge status-${application.status}`}>
                        {application.status}
                      </span>
                    </td>
                    <td>{formatDate(application.submitted_at)}</td>
                    <td>
                      <button onClick={() => handleEdit(application)} className="btn btn-sm">Edit</button>
                      <button onClick={() => onDelete(application.id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {applicationsArray.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No housing applications submitted yet.
        </p>
      )}
    </div>
  );
};

export default Admin;
