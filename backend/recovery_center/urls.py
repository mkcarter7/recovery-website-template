"""
URL configuration for recovery_center project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.http import require_http_methods
from django.views.decorators.cache import cache_control
import os
import mimetypes

@require_http_methods(["GET"])
def api_root(request):
    """Root endpoint"""
    return JsonResponse({
        'message': 'Recovery API'
    })

@require_http_methods(["GET"])
@cache_control(max_age=3600)
def serve_media(request, path):
    """Serve media files in production"""
    file_path = os.path.join(settings.MEDIA_ROOT, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        # Detect content type based on file extension
        content_type, _ = mimetypes.guess_type(file_path)
        if not content_type:
            content_type = 'application/octet-stream'
        return FileResponse(open(file_path, 'rb'), content_type=content_type)
    raise Http404("File not found")

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# Serve media files
if settings.DEBUG:
    # In development, use Django's static file serving
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # In production, use custom view to serve media files
    urlpatterns += [
        path('media/<path:path>', serve_media, name='serve_media'),
    ]
