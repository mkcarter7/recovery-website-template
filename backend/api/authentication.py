from rest_framework import authentication
from rest_framework import exceptions
import firebase_admin
from firebase_admin import credentials, auth
import os
from django.conf import settings


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
                if cred_path and os.path.exists(cred_path):
                    cred = credentials.Certificate(cred_path)
                    firebase_admin.initialize_app(cred)
                else:
                    # Try default credentials
                    firebase_admin.initialize_app()
            
            # Verify the token
            decoded_token = auth.verify_id_token(token)
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
