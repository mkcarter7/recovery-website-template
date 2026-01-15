import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    const result = await loginWithGoogle();
    
    if (result.success) {
      navigate('/admin');
    } else {
      // Provide user-friendly error messages with more details
      let errorMessage = 'Failed to sign in. Please try again.';
      
      if (result.code) {
        // Handle specific Firebase error codes
        switch (result.code) {
          case 'auth/popup-closed-by-user':
            errorMessage = 'Sign-in was cancelled. Please try again.';
            break;
          case 'auth/account-exists-with-different-credential':
            errorMessage = 'An account already exists with this email.';
            break;
          case 'auth/unauthorized-domain':
            errorMessage = 'This domain is not authorized. Please contact the administrator.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Google sign-in is not enabled. Please contact the administrator.';
            break;
          case 'auth/invalid-api-key':
            errorMessage = 'Invalid API key. Please contact the administrator.';
            break;
          default:
            errorMessage = result.error || `Error: ${result.code}`;
        }
      } else if (result.error) {
        // Fallback to error message parsing
        if (result.error.includes('popup-closed-by-user')) {
          errorMessage = 'Sign-in was cancelled. Please try again.';
        } else if (result.error.includes('account-exists-with-different-credential')) {
          errorMessage = 'An account already exists with this email.';
        } else if (result.error.includes('unauthorized-domain')) {
          errorMessage = 'This domain is not authorized. Please add this domain to Firebase authorized domains.';
        } else {
          errorMessage = result.error;
        }
      }
      
      setError(errorMessage);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <p className="login-subtitle">Recovery</p>
        <p className="login-note">Administrator access only. Sign in with your Google account.</p>
        
        {error && <div className="login-error">{error}</div>}
        
        <div className="login-form">
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="btn btn-google login-button"
            disabled={loading}
          >
            {loading ? (
              'Signing in...'
            ) : (
              <>
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
