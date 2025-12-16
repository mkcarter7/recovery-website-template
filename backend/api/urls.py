from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ContactFormViewSet, ReviewViewSet, ProgramViewSet,
    HousingViewSet, SiteSettingsViewSet
)

router = DefaultRouter()
router.register(r'contact-forms', ContactFormViewSet, basename='contactform')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'programs', ProgramViewSet, basename='program')
router.register(r'housing', HousingViewSet, basename='housing')
router.register(r'settings', SiteSettingsViewSet, basename='settings')

urlpatterns = [
    path('', include(router.urls)),
]
