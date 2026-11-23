from django.db import models
from django.contrib.auth.models import User

from common.models import BaseModel

class Clinic(BaseModel):
    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="clinic",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(
        max_length=100,
        unique=True,
        null=True,
        blank=True,
    )
    phone = models.CharField(max_length=30,blank=True,)
    email = models.EmailField(blank=True,)
    address = models.TextField(blank=True,)
    is_active = models.BooleanField(default=True,)
    def __str__(self):
        return self.name



class ClinicBranding(BaseModel):
    clinic = models.OneToOneField(
        Clinic,
        on_delete=models.CASCADE,
        related_name="branding",
    )
    logo = models.ImageField(
        upload_to="clinics/logo",
        blank=True,
        null=True,
    )
    favicon = models.ImageField(
        upload_to="clinics/logos/",
        blank=True,
        null=True,

    )
    colors = models.JSONField(default=dict, blank=True)
    typography = models.JSONField(default=dict, blank=True)
    global_styles = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.clinic.name} Branding"



class ClinicPage(BaseModel):
    clinic = models.ForeignKey(
        Clinic,
        on_delete=models.CASCADE,
        related_name="pages",
    )

    slug = models.SlugField(max_length=100)
    title = models.CharField(max_length=255)

    sections = models.JSONField(default=list, blank=True)
    published_sections = models.JSONField(default=list, blank=True)

    is_published = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["clinic", "slug"],
                name="unique_clinic_page_slug",
            )
        ]

    def __str__(self):
        return f"{self.clinic.name} - {self.title}"



class ClinicAsset(BaseModel):
    clinic = models.ForeignKey(
        Clinic,
        on_delete=models.CASCADE,
        related_name="assets",
    )
    name = models.CharField(max_length=255)
    file = models.ImageField(upload_to="clinics/assets/")
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.clinic.name} - {self.name}"
