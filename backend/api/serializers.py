from rest_framework import serializers
from django.conf import settings
from .models import ContactForm, Review, Program, Housing, SiteSettings


class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactForm
        fields = ['id', 'name', 'email', 'phone', 'message', 'status', 'submitted_at', 'notes']
        read_only_fields = ['submitted_at']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'author_name', 'author_location', 'rating', 'content', 
                  'is_featured', 'is_approved', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class PublicReviewSerializer(serializers.ModelSerializer):
    """Serializer for public-facing reviews (only approved ones)"""
    class Meta:
        model = Review
        fields = ['id', 'author_name', 'author_location', 'rating', 'content', 'created_at']


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ['id', 'name', 'description', 'duration', 'features', 'image', 
                  'is_active', 'order', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class HousingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Housing
        fields = ['id', 'name', 'description', 'capacity', 'amenities', 'image', 
                  'is_available', 'order', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class SiteSettingsSerializer(serializers.ModelSerializer):
    background_image = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = SiteSettings
        fields = ['site_name', 'primary_color', 'secondary_color', 'accent_color', 
                  'background_color', 'background_image', 'hero_title', 'hero_subtitle',
                  'about_content', 'contact_email', 'contact_phone', 'address',
                  'facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url', 
                  'youtube_url', 'tiktok_url']
        extra_kwargs = {
            'background_image': {'required': False, 'allow_null': True}
        }
    
    def to_representation(self, instance):
        """Return full URL for background_image"""
        representation = super().to_representation(instance)
        if instance.background_image:
            request = self.context.get('request')
            image_url = instance.background_image.url
            
            if request:
                # Try to build absolute URI
                try:
                    # Use build_absolute_uri which handles protocol and host correctly
                    representation['background_image'] = request.build_absolute_uri(image_url)
                except Exception:
                    # Fallback: construct URL manually using request info
                    try:
                        scheme = request.scheme if hasattr(request, 'scheme') else 'https'
                        host = request.get_host() if hasattr(request, 'get_host') else ''
                        if host:
                            representation['background_image'] = f"{scheme}://{host}{image_url}"
                        else:
                            # Last resort: use relative URL
                            representation['background_image'] = image_url
                    except Exception:
                        representation['background_image'] = image_url
            else:
                # No request context - return relative URL (frontend will construct full URL)
                representation['background_image'] = image_url
        return representation
    
    def validate(self, data):
        """Custom validation for settings"""
        # Allow partial updates
        return data
    
    def update(self, instance, validated_data):
        """Handle update with proper field handling"""
        # Handle background_image deletion (empty string means delete)
        if 'background_image' in validated_data:
            if validated_data['background_image'] == '' or validated_data['background_image'] is None:
                # Delete the existing image
                if instance.background_image:
                    instance.background_image.delete(save=False)
                validated_data['background_image'] = None
        
        return super().update(instance, validated_data)
