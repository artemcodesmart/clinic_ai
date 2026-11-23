from rest_framework import serializers

from clinics.models import Clinic,ClinicBranding,ClinicAsset
from clinics.models import ClinicPage
import copy



class ClinicPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = [
            "name",
            "slug",
        ]


class ClinicBrandingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicBranding
        fields = [
            "logo",
            "favicon",
            "colors",
            "typography",
            "global_styles",
        ]


class ClinicPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicPage
        fields = [
            "id",
            "slug",
            "title",
            "sections",
            "is_published",
        ]
        read_only_fields = ["id", "is_published"]

    def validate_sections(self, sections):
        if not isinstance(sections, list):
            raise serializers.ValidationError(
                "Sections must be a list."
            )

        request = self.context.get("request")
        clinic = getattr(request.user, "clinic", None) if request else None

        if not clinic:
            raise serializers.ValidationError(
                "You do not have access to a clinic."
            )

        for index, section in enumerate(sections):
            if not isinstance(section, dict):
                raise serializers.ValidationError(
                    f"Section {index} must be an object."
                )

            image_id = section.get("image")

            if image_id is None:
                continue

            try:
                asset_id = serializers.UUIDField().run_validation(
                    image_id
                )
            except serializers.ValidationError:
                raise serializers.ValidationError(
                    f"Invalid image ID in section {index}."
                )

            asset_exists = ClinicAsset.objects.filter(
                id=asset_id,
                clinic=clinic,
            ).exists()

            if not asset_exists:
                raise serializers.ValidationError(
                    f"Image in section {index} does not exist "
                    "or does not belong to your clinic."
                )

        return sections

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Создаём независимую копию JSON
        data["sections"] = copy.deepcopy(data["sections"])

        image_ids = []

        for section in data["sections"]:
            if not isinstance(section, dict):
                continue

            image = section.get("image")

            # Поддерживаем UUID и старый формат объекта
            if isinstance(image, dict):
                image_id = image.get("id")
            else:
                image_id = image

            if image_id:
                image_ids.append(image_id)

        assets = ClinicAsset.objects.filter(
            clinic=instance.clinic,
            id__in=image_ids,
        )

        assets_by_id = {
            str(asset.id): asset
            for asset in assets
        }

        for section in data["sections"]:
            if not isinstance(section, dict):
                continue

            image = section.get("image")

            if not image:
                continue

            image_id = (
                image.get("id")
                if isinstance(image, dict)
                else image
            )

            asset = assets_by_id.get(str(image_id))

            if not asset:
                continue

            image_url = asset.file.url

            request = self.context.get("request")

            if request:
                image_url = request.build_absolute_uri(image_url)

            section["image"] = {
                "id": str(asset.id),
                "url": image_url,
                "alt_text": asset.alt_text,
            }

        return data


class ClinicAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicAsset
        fields = [
            "id",
            "name",
            "file",
            "alt_text",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]