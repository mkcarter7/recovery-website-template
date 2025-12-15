from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class SiteSettings(models.Model):
    """Site-wide settings that can be updated by admin"""
    site_name = models.CharField(max_length=200, default="2nd Chance Recovery")
    primary_color = models.CharField(max_length=7, default="#000000", help_text="Hex color code (Black)")
    secondary_color = models.CharField(max_length=7, default="#808080", help_text="Hex color code (Gray)")
    accent_color = models.CharField(max_length=7, default="#DC143C", help_text="Hex color code (Red)")
    background_color = models.CharField(max_length=7, default="#FFFFFF", help_text="Hex color code (White)")
    background_image = models.ImageField(upload_to='backgrounds/', null=True, blank=True)
    hero_title = models.CharField(max_length=200, default="Your Journey to Recovery Starts Here")
    hero_subtitle = models.TextField(default="Compassionate care for lasting recovery")
    about_content = models.TextField(default="2nd Chance Recovery is dedicated to helping individuals overcome addiction and build a foundation for lasting recovery.")
    contact_email = models.EmailField(default="info@2ndchancerecovery.com")
    contact_phone = models.CharField(max_length=20, default="(555) 123-4567")
    address = models.TextField(default="123 Recovery Street, City, State 12345")
    
    # Social Media Links
    facebook_url = models.URLField(max_length=500, blank=True, null=True, help_text="Facebook page URL")
    instagram_url = models.URLField(max_length=500, blank=True, null=True, help_text="Instagram profile URL")
    twitter_url = models.URLField(max_length=500, blank=True, null=True, help_text="Twitter/X profile URL")
    linkedin_url = models.URLField(max_length=500, blank=True, null=True, help_text="LinkedIn page URL")
    youtube_url = models.URLField(max_length=500, blank=True, null=True, help_text="YouTube channel URL")
    tiktok_url = models.URLField(max_length=500, blank=True, null=True, help_text="TikTok profile URL")
    
    class Meta:
        verbose_name_plural = "Site Settings"
    
    def __str__(self):
        return "Site Settings"
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        self.pk = 1
        super().save(*args, **kwargs)


class ContactForm(models.Model):
    """Contact form submissions"""
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    submitted_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, help_text="Admin notes")
    
    class Meta:
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.name} - {self.submitted_at.strftime('%Y-%m-%d %H:%M')}"


class Review(models.Model):
    """Client reviews and recommendations"""
    author_name = models.CharField(max_length=200)
    author_location = models.CharField(max_length=200, blank=True)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5"
    )
    content = models.TextField()
    is_featured = models.BooleanField(default=False, help_text="Show on homepage")
    is_approved = models.BooleanField(default=False, help_text="Approve for public display")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.author_name} - {self.rating} stars"


class Program(models.Model):
    """Recovery programs offered"""
    name = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.CharField(max_length=100, blank=True, help_text="e.g., '30 days', '90 days'")
    features = models.JSONField(default=list, help_text="List of program features")
    image = models.ImageField(upload_to='programs/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text="Display order")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class Housing(models.Model):
    """Housing options"""
    name = models.CharField(max_length=200)
    description = models.TextField()
    capacity = models.IntegerField(null=True, blank=True)
    amenities = models.JSONField(default=list, help_text="List of amenities")
    image = models.ImageField(upload_to='housing/', null=True, blank=True)
    is_available = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text="Display order")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Housing Options"
    
    def __str__(self):
        return self.name
