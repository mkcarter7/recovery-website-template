from django.contrib import admin
from .models import ContactForm, Review, Program, Housing, SiteSettings, AmazonWishList, Donor


@admin.register(ContactForm)
class ContactFormAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'status', 'submitted_at']
    list_filter = ['status', 'submitted_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['submitted_at']
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Message', {
            'fields': ('message',)
        }),
        ('Status', {
            'fields': ('status', 'notes', 'submitted_at')
        }),
    )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['author_name', 'rating', 'is_approved', 'is_featured', 'created_at']
    list_filter = ['is_approved', 'is_featured', 'rating', 'created_at']
    search_fields = ['author_name', 'content']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ['name', 'duration', 'is_active', 'order']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Housing)
class HousingAdmin(admin.ModelAdmin):
    list_display = ['name', 'capacity', 'is_available', 'order']
    list_filter = ['is_available']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(AmazonWishList)
class AmazonWishListAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'order', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Donor)
class DonorAdmin(admin.ModelAdmin):
    list_display = ['name', 'amount', 'is_anonymous', 'is_featured', 'created_at']
    list_filter = ['is_featured', 'is_anonymous', 'created_at']
    search_fields = ['name', 'message']
    readonly_fields = ['created_at']

