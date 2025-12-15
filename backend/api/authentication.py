from rest_framework import authentication
from rest_framework import exceptions
import firebase_admin
from firebase_admin import credentials, auth
import os
import json
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


class FirebaseAuthentication(authentication.BaseAuthentication):
    """Custom authentication using Firebase tokens"""
    
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split('Bearer ')[1]
        
        try:
            # Initialize Firebase Admin if not already initialized
            if not firebase_admin._apps:
                cred_path = settings.FIREBASE_CREDENTIALS_PATH
                cred_initialized = False
                
                if cred_path:
                    try:
                        # Railway may provide credentials as:
                        # 1. A JSON string in the environment variable
                        # 2. A file path to a JSON file
                        # 3. A dict (if parsed by Django settings)
                        
                        if isinstance(cred_path, dict):
                            # Already a dict, use it directly
                            cred = credentials.Certificate(cred_path)
                            firebase_admin.initialize_app(cred, name='ndchancerecovery')
                            cred_initialized = True
                        elif isinstance(cred_path, str):
                            # Check if it's a JSON string
                            if cred_path.strip().startswith('{'):
                                try:
                                    cred_dict = json.loads(cred_path)
                                    cred = credentials.Certificate(cred_dict)
                                    firebase_admin.initialize_app(cred, name='ndchancerecovery')
                                    cred_initialized = True
                                except json.JSONDecodeError:
                                    pass
                            
                            # If not JSON, try as file path
                            if not cred_initialized and os.path.exists(cred_path):
                                cred = credentials.Certificate(cred_path)
                                firebase_admin.initialize_app(cred, name='ndchancerecovery')
                                cred_initialized = True
                    
                    except Exception as e:
                        logger.error(f"Error initializing Firebase with provided credentials: {e}", exc_info=True)
                        cred_initialized = False
                
                # If we couldn't initialize with provided credentials, raise an error
                # Don't fall back to default (Railway's) credentials
                if not cred_initialized:
                    raise Exception(
                        f"Firebase credentials not properly configured. "
                        f"FIREBASE_CREDENTIALS_PATH type: {type(cred_path)}, value: {str(cred_path)[:100] if cred_path else 'None'}. "
                        f"Please ensure it contains valid Firebase credentials JSON for project 'ndchancerecovery'."
                    )
            
            # Verify the token using the correct app instance
            # Try to get the named app, fallback to default if it doesn't exist
            try:
                app = firebase_admin.get_app('ndchancerecovery')
            except ValueError:
                # Named app doesn't exist, use default
                app = firebase_admin.get_app()
            
            decoded_token = auth.verify_id_token(token, app=app)
            uid = decoded_token['uid']
            
            # Return a user object with necessary attributes for Django REST Framework
            # Create a simple object that mimics Django's User model
            user = type('User', (), {
                'uid': uid,
                'email': decoded_token.get('email'),
                'is_authenticated': True,
                'is_active': True,
                'is_anonymous': False,
            })()
            return (user, None)
            
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Invalid token: {str(e)}')
