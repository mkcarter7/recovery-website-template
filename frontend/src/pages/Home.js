import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import api from '../config/api';

const Home = () => {
  const { settings } = useSettings();
  const [reviews, setReviews] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedReviews();
    fetchSponsorFeed();
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

  const fetchSponsorFeed = async () => {
    try {
      const response = await api.get('/donors/feed/');
      const sponsorsData = response.data;
      if (Array.isArray(sponsorsData)) {
        setSponsors(sponsorsData);
      } else if (sponsorsData && Array.isArray(sponsorsData.results)) {
        setSponsors(sponsorsData.results);
      } else {
        setSponsors([]);
      }
    } catch (error) {
      setSponsors([]);
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

  // Helper function to check if a URL is valid
  const hasValidUrl = (url) => {
    return url && typeof url === 'string' && url.trim().length > 0;
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section 
        className={`hero ${hasBackgroundImage ? 'has-background-image' : ''}`}
        style={{
          backgroundColor: hasBackgroundImage ? 'transparent' : settings.background_color,
          backgroundImage: backgroundImageUrl,
          WebkitBackgroundSize: 'cover',
          backgroundSize: 'cover',
          WebkitBackgroundPosition: 'center center',
          backgroundPosition: 'center center',
          WebkitBackgroundRepeat: 'no-repeat',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container">
          <div className="hero-content">
            <h1>
              {settings.hero_title}
            </h1>
            <p className="hero-subtitle" style={{ whiteSpace: 'pre-line' }}>
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
            {/* Social Media Links - Always show icons, but disable if no URL */}
            <div className="hero-social-links">
              {hasValidUrl(settings.facebook_url) ? (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              ) : (
                <span className="social-icon-disabled" aria-label="Facebook (not configured)">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </span>
              )}
              {hasValidUrl(settings.instagram_url) ? (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              ) : (
                <span className="social-icon-disabled" aria-label="Instagram (not configured)">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </span>
              )}
              {hasValidUrl(settings.twitter_url) ? (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              ) : (
                <span className="social-icon-disabled" aria-label="Twitter (not configured)">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </span>
              )}
              {hasValidUrl(settings.linkedin_url) ? (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              ) : (
                <span className="social-icon-disabled" aria-label="LinkedIn (not configured)">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </span>
              )}
              {hasValidUrl(settings.youtube_url) ? (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              ) : (
                <span className="social-icon-disabled" aria-label="YouTube (not configured)">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </span>
              )}
              {hasValidUrl(settings.tiktok_url) ? (
                <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              ) : (
                <span className="social-icon-disabled" aria-label="TikTok (not configured)">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </span>
              )}
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

      {/* Sponsor Feed Section */}
      {sponsors.length > 0 && (
        <section className="section sponsor-feed-section" style={{ backgroundColor: '#F9F9F9' }}>
          <div className="container">
            <h2 className="section-title" style={{ color: settings.primary_color }}>
              Recent Sponsorships
            </h2>
            <div className="sponsor-feed">
              {sponsors.slice(0, 10).map((sponsor) => (
                <div key={sponsor.id} className="sponsor-item">
                  <div className="sponsor-content">
                    <span className="sponsor-name" style={{ color: settings.accent_color, fontWeight: 'bold' }}>
                      {sponsor.display_name}
                    </span>
                    {sponsor.amount && (
                      <span className="sponsor-amount" style={{ color: settings.primary_color }}>
                        {' '}sponsored ${parseFloat(sponsor.amount).toFixed(2)}
                      </span>
                    )}
                    {sponsor.message && (
                      <span className="sponsor-message" style={{ color: settings.secondary_color }}>
                        {' '}- {sponsor.message}
                      </span>
                    )}
                  </div>
                  <span className="sponsor-date" style={{ color: settings.secondary_color }}>
                    {new Date(sponsor.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
