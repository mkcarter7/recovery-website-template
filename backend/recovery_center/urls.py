"""
URL configuration for recovery_center project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def api_root(request):
    """Root endpoint"""
    return JsonResponse({
        'message': '2nd Chance Recovery API'
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# Serve media files in both development and production
# In production, consider using a CDN or cloud storage for better performance
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
