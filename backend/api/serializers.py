from rest_framework import serializers
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
    class Meta:
        model = SiteSettings
        fields = ['site_name', 'primary_color', 'secondary_color', 'accent_color', 
                  'background_color', 'background_image', 'hero_title', 'hero_subtitle',
                  'about_content', 'contact_email', 'contact_phone', 'address']
        extra_kwargs = {
            'background_image': {'required': False, 'allow_null': True}
        }
    
    def validate(self, data):
        """Custom validation for settings"""
        # Allow partial updates
        return data
    
    def update(self, instance, validated_data):
        """Handle update with proper field handling"""
        # Remove background_image if it's None or empty string
        if 'background_image' in validated_data:
            if validated_data['background_image'] is None or validated_data['background_image'] == '':
                validated_data.pop('background_image', None)
        
        return super().update(instance, validated_data)
