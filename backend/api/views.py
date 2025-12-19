from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import ContactForm, Review, Program, Housing, SiteSettings, AmazonWishList, Donor, HousingApplication
from .serializers import (
    ContactFormSerializer, ReviewSerializer, PublicReviewSerializer,
    ProgramSerializer, HousingSerializer, SiteSettingsSerializer,
    AmazonWishListSerializer, DonorSerializer, PublicDonorSerializer,
    HousingApplicationSerializer
)


class ContactFormViewSet(viewsets.ModelViewSet):
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer
    
    def get_permissions(self):
        # Allow public access for create and submit actions
        action_name = getattr(self, 'action', None)
        path = self.request.path if hasattr(self.request, 'path') else ''
        
        # Check if this is a submit or create endpoint
        if action_name in ['create', 'submit'] or 'submit' in path:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def submit(self, request):
        """Public endpoint for submitting contact forms"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
    def get_permissions(self):
        # Allow public access for list with public param, and for custom actions
        # Check both the action name and the URL path to handle custom actions
        action_name = getattr(self, 'action', None)
        path = self.request.path if hasattr(self.request, 'path') else ''
        
        # Check if this is a featured or public endpoint
        if action_name in ['public', 'featured'] or 'featured' in path or 'public' in path:
            return [AllowAny()]
        if action_name == 'list' and 'public' in self.request.query_params:
            return [AllowAny()]
        if action_name == 'list' and 'public' not in self.request.query_params:
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action in ['public', 'featured'] or (self.action == 'list' and 'public' in self.request.query_params):
            return PublicReviewSerializer
        return ReviewSerializer
    
    def get_queryset(self):
        queryset = Review.objects.all()
        if 'public' in self.request.query_params:
            queryset = queryset.filter(is_approved=True)
        if 'featured' in self.request.query_params:
            queryset = queryset.filter(is_featured=True, is_approved=True)
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """Public endpoint for viewing approved reviews"""
        reviews = Review.objects.filter(is_approved=True)
        serializer = PublicReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        """Public endpoint for featured reviews (homepage)"""
        reviews = Review.objects.filter(is_featured=True, is_approved=True)
        serializer = PublicReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.filter(is_active=True)
    serializer_class = ProgramSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'is_authenticated') and self.request.user.is_authenticated:
            return Program.objects.all()
        return Program.objects.filter(is_active=True)


class HousingViewSet(viewsets.ModelViewSet):
    queryset = Housing.objects.filter(is_available=True)
    serializer_class = HousingSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'is_authenticated') and self.request.user.is_authenticated:
            return Housing.objects.all()
        return Housing.objects.filter(is_available=True)


class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    
    def get_permissions(self):
        if self.action in ['retrieve', 'public']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_object(self):
        obj, created = SiteSettings.objects.get_or_create(pk=1)
        return obj
    
    def update(self, request, *args, **kwargs):
        """Handle PUT/PATCH requests"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def perform_update(self, serializer):
        serializer.save()
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """Public endpoint for site settings"""
        settings_obj, created = SiteSettings.objects.get_or_create(pk=1)
        serializer = self.get_serializer(settings_obj, context={'request': request})
        return Response(serializer.data)


class AmazonWishListViewSet(viewsets.ModelViewSet):
    queryset = AmazonWishList.objects.filter(is_active=True)
    serializer_class = AmazonWishListSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'is_authenticated') and self.request.user.is_authenticated:
            return AmazonWishList.objects.all()
        return AmazonWishList.objects.filter(is_active=True)


class DonorViewSet(viewsets.ModelViewSet):
    queryset = Donor.objects.filter(is_featured=True)
    serializer_class = DonorSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'feed']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action in ['feed', 'list'] and not (hasattr(self.request.user, 'is_authenticated') and self.request.user.is_authenticated):
            return PublicDonorSerializer
        return DonorSerializer
    
    def get_queryset(self):
        if hasattr(self.request.user, 'is_authenticated') and self.request.user.is_authenticated:
            return Donor.objects.all()
        return Donor.objects.filter(is_featured=True).order_by('-created_at')
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def feed(self, request):
        """Public endpoint for donor news feed (homepage)"""
        donors = Donor.objects.filter(is_featured=True).order_by('-created_at')[:20]
        serializer = PublicDonorSerializer(donors, many=True)
        return Response(serializer.data)


class HousingApplicationViewSet(viewsets.ModelViewSet):
    queryset = HousingApplication.objects.all()
    serializer_class = HousingApplicationSerializer
    
    def get_permissions(self):
        # Allow public access for create and submit actions
        action_name = getattr(self, 'action', None)
        path = self.request.path if hasattr(self.request, 'path') else ''
        
        # Check if this is a submit or create endpoint
        if action_name in ['create', 'submit'] or 'submit' in path:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def submit(self, request):
        """Public endpoint for submitting housing applications"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
