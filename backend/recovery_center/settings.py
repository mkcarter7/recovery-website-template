"""
Django settings for recovery_center project.
"""

from pathlib import Path
import os
from decouple import config

# Try to import dj_database_url (for production), fallback to None if not available
try:
    import dj_database_url  # type: ignore
except ImportError:
    dj_database_url = None

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-this-in-production')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

# Allow Railway domain and custom domain
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.railway.app', 'cleanandsoberhome.com', 'www.cleanandsoberhome.com']
if config('RAILWAY_PUBLIC_DOMAIN', default=None):
    ALLOWED_HOSTS.append(config('RAILWAY_PUBLIC_DOMAIN'))
if config('CUSTOM_DOMAIN', default=None):
    custom_domain = config('CUSTOM_DOMAIN').strip()
    ALLOWED_HOSTS.append(custom_domain)
    # Also add www version if not already included
    if custom_domain.startswith('www.'):
        ALLOWED_HOSTS.append(custom_domain.replace('www.', ''))
    else:
        ALLOWED_HOSTS.append(f'www.{custom_domain}')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'whitenoise.runserver_nostatic',  # Use whitenoise for static files
    'storages',  # For S3 media file storage
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add whitenoise for static files
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'recovery_center.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'recovery_center.wsgi.application'

# Database
# Use PostgreSQL on Railway, SQLite locally
if dj_database_url:
    DATABASES = {
        'default': dj_database_url.config(
            default=config('DATABASE_URL', default=f'sqlite:///{BASE_DIR / "db.sqlite3"}'),
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    # Fallback to SQLite if dj_database_url is not available
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files - Use S3 if configured, otherwise use local storage
USE_S3 = config('USE_S3', default='False', cast=bool)

if USE_S3:
    # AWS S3 settings for media files
    # Check if all required S3 credentials are provided
    aws_access_key = config('AWS_ACCESS_KEY_ID', default=None)
    aws_secret_key = config('AWS_SECRET_ACCESS_KEY', default=None)
    aws_bucket = config('AWS_STORAGE_BUCKET_NAME', default=None)
    
    if not all([aws_access_key, aws_secret_key, aws_bucket]):
        # If USE_S3 is True but credentials are missing, fall back to local storage
        import warnings
        warnings.warn(
            "USE_S3 is True but AWS credentials are missing. Falling back to local storage.",
            UserWarning
        )
        USE_S3 = False
    else:
        AWS_ACCESS_KEY_ID = aws_access_key
        AWS_SECRET_ACCESS_KEY = aws_secret_key
        AWS_STORAGE_BUCKET_NAME = aws_bucket
        AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', default='us-east-1')
        AWS_S3_CUSTOM_DOMAIN = config('AWS_S3_CUSTOM_DOMAIN', default=None)
        AWS_S3_OBJECT_PARAMETERS = {
            'CacheControl': 'max-age=86400',
        }
        AWS_S3_FILE_OVERWRITE = False
        AWS_DEFAULT_ACL = None  # ACLs deprecated by AWS - use bucket policy instead
        AWS_QUERYSTRING_AUTH = False
        AWS_S3_VERIFY = True
        
        # Media files stored in S3
        DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
        MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN or f"{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com"}/'
        MEDIA_ROOT = ''  # Not used when using S3

if not USE_S3:
    # Local media file storage (for development or when S3 is not configured)
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'api.authentication.FirebaseAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}

# CSRF Trusted Origins
CSRF_TRUSTED_ORIGINS = [
    'https://cleanandsoberhome.com',
    'https://www.cleanandsoberhome.com',
]
if config('CUSTOM_DOMAIN', default=None):
    custom_domain = config('CUSTOM_DOMAIN').strip()
    if not custom_domain.startswith(('http://', 'https://')):
        CSRF_TRUSTED_ORIGINS.append(f'https://{custom_domain}')
        if not custom_domain.startswith('www.'):
            CSRF_TRUSTED_ORIGINS.append(f'https://www.{custom_domain}')

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://cleanandsoberhome.com",
    "https://www.cleanandsoberhome.com",
]
# Add Railway frontend domain if set
if config('FRONTEND_URL', default=None):
    frontend_url = config('FRONTEND_URL').strip()
    # Add https:// if no scheme is provided
    if frontend_url and not frontend_url.startswith(('http://', 'https://')):
        frontend_url = f'https://{frontend_url}'
    CORS_ALLOWED_ORIGINS.append(frontend_url)
# Add custom domain if set
if config('CUSTOM_DOMAIN', default=None):
    custom_domain = config('CUSTOM_DOMAIN').strip()
    if not custom_domain.startswith(('http://', 'https://')):
        CORS_ALLOWED_ORIGINS.append(f'https://{custom_domain}')
        if not custom_domain.startswith('www.'):
            CORS_ALLOWED_ORIGINS.append(f'https://www.{custom_domain}')
# Add additional allowed origins from environment variable (comma-separated)
if config('CORS_ALLOWED_ORIGINS', default=None):
    additional_origins = []
    for origin in config('CORS_ALLOWED_ORIGINS').split(','):
        origin = origin.strip()
        # Add https:// if no scheme is provided
        if origin and not origin.startswith(('http://', 'https://')):
            origin = f'https://{origin}'
        if origin:
            additional_origins.append(origin)
    CORS_ALLOWED_ORIGINS.extend(additional_origins)
# Allow all origins in development (you can restrict this in production)
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Firebase settings
FIREBASE_CREDENTIALS_PATH = config('FIREBASE_CREDENTIALS_PATH', default='')
