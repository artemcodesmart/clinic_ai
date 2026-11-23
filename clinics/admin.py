
from django.contrib import admin
from .models import Clinic, ClinicBranding, ClinicPage,ClinicAsset


@admin.register(Clinic)
class ClinicAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "phone",
        "email",
        "is_active",
    )
    search_fields = ("name", "phone", "email")


@admin.register(ClinicBranding)
class ClinicBrandingAdmin(admin.ModelAdmin):
    list_display = (
        "clinic",
        "created_at",
        "updated_at",
    )
    search_fields = ("clinic__name",)


@admin.register(ClinicPage)
class ClinicPageAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "clinic",
        "slug",
        "is_published",
    )
    list_filter = ("is_published",)
    search_fields = ("title", "clinic__name", "slug")


@admin.register(ClinicAsset)
class ClinicAssetAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "clinic",
        "created_at",
    )
    list_filter = ("clinic",)
    search_fields = ("name", "alt_text")