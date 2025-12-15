import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import api from '../config/api';
import './Home.css';

const Home = () => {
  const { settings } = useSettings();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedReviews();
  }, []);

  const fetchFeaturedReviews = async () => {
    try {
      const response = await api.get('/reviews/featured/');
      // Ensure reviews is always an array
      const reviewsData = response.data;
      if (Array.isArray(reviewsData)) {
        setReviews(reviewsData);
      } else if (reviewsData && Array.isArray(reviewsData.results)) {
        // Handle paginated response
        setReviews(reviewsData.results);
      } else {
        // Fallback to empty array if data is not in expected format
        setReviews([]);
      }
    } catch (error) {
      setReviews([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>
        ★
      </span>
    ));
  };

  // Construct full URL for background image if it's a relative path
  const getBackgroundImageUrl = () => {
    if (!settings.background_image) return 'none';
    
    let imageUrl;
    
    // If it's already a full URL (starts with http:// or https://), use it as is
    if (settings.background_image.startsWith('http://') || settings.background_image.startsWith('https://')) {
      imageUrl = settings.background_image;
    } else {
      // If it's a relative path, construct the full URL using API base URL
      const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      // Remove /api from the end if present, since media files are served from root
      const baseUrl = apiBaseUrl.replace(/\/api$/, '');
      imageUrl = settings.background_image.startsWith('/') 
        ? `${baseUrl}${settings.background_image}`
        : `${baseUrl}/${settings.background_image}`;
    }
    
    // Return with proper URL formatting for CSS - use single quotes for better mobile compatibility
    return imageUrl ? `url('${imageUrl}')` : 'none';
  };

  const backgroundImageUrl = getBackgroundImageUrl();
  const hasBackgroundImage = backgroundImageUrl !== 'none' && settings.background_image;
  
  // Extract the actual URL from the CSS url() format for iOS img fallback
  const getImageUrlForIOS = () => {
    if (!hasBackgroundImage) return null;
    const urlMatch = backgroundImageUrl.match(/url\(['"]?([^'"]+)['"]?\)/);
    return urlMatch ? urlMatch[1] : null;
  };
  
  const imageUrlForIOS = getImageUrlForIOS();

  return (
    <div className="home">
      {/* Hero Section */}
      <section 
        className={`hero ${hasBackgroundImage ? 'has-background-image' : ''}`}
        style={{
          backgroundColor: settings.background_color,
          backgroundImage: backgroundImageUrl,
          WebkitBackgroundSize: 'cover',
          backgroundSize: 'cover',
          WebkitBackgroundPosition: 'center center',
          backgroundPosition: 'center center',
          WebkitBackgroundRepeat: 'no-repeat',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* iOS fallback: absolutely positioned img element */}
        {imageUrlForIOS && (
          <img 
            src={imageUrlForIOS}
            alt=""
            className="hero-background-image-ios"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: -1,
              pointerEvents: 'none',
            }}
            onError={(e) => {
              // Hide if image fails to load
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="container">
          <div className="hero-content">
            <h1>
              {settings.hero_title}
            </h1>
            <p className="hero-subtitle">
              {settings.hero_subtitle}
            </p>
            <div className="hero-buttons">
              <Link to="/contact" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/programs" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section quick-links">
        <div className="container">
          <h2 className="section-title" style={{ color: settings.primary_color }}>
            How We Can Help
          </h2>
          <div className="links-grid">
            <Link to="/programs" className="link-card">
              <div className="link-icon">🏠</div>
              <h3>Programs & Housing</h3>
              <p>Explore our recovery programs and housing options</p>
            </Link>
            <Link to="/about" className="link-card">
              <div className="link-icon">ℹ️</div>
              <h3>About Us</h3>
              <p>Learn about our mission and approach to recovery</p>
            </Link>
            <Link to="/contact" className="link-card">
              <div className="link-icon">📞</div>
              <h3>Contact Us</h3>
              <p>Reach out for help or more information</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section reviews-section" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: settings.primary_color }}>
            What Our Clients Say
          </h2>
          {loading ? (
            <p style={{ textAlign: 'center', color: settings.secondary_color }}>
              Loading reviews...
            </p>
          ) : Array.isArray(reviews) && reviews.length > 0 ? (
            <div className="reviews-grid">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-author">
                      <h4>{review.author_name}</h4>
                      {review.author_location && (
                        <p className="review-location">{review.author_location}</p>
                      )}
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="review-content">{review.content}</p>
                  <p className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: settings.secondary_color }}>
              No reviews available at this time.
            </p>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section cta-section" style={{ backgroundColor: settings.accent_color }}>
        <div className="container">
          <h2 style={{ color: '#FFFFFF', textAlign: 'center', marginBottom: '1rem' }}>
            Ready to Start Your Recovery Journey?
          </h2>
          <p style={{ color: '#FFFFFF', textAlign: 'center', marginBottom: '2rem' }}>
            Contact us today to learn more about our programs and take the first step.
          </p>
          <div style={{ textAlign: 'center' }}>
            <Link to="/contact" className="btn btn-secondary">
              Contact Us Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
