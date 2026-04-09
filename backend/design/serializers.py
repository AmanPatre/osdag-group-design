from rest_framework import serializers


class GeometryValidationSerializer(serializers.Serializer):
    span              = serializers.FloatField()
    carriageway_width = serializers.FloatField()
    skew_angle        = serializers.FloatField()


class GirderCalcSerializer(serializers.Serializer):
    carriageway_width = serializers.FloatField()
    girder_spacing    = serializers.FloatField(required=False)
    num_girders       = serializers.IntegerField(required=False)
    deck_overhang     = serializers.FloatField(required=False)

    def validate(self, data):
        provided = sum(1 for k in ('girder_spacing', 'num_girders', 'deck_overhang') if k in data)
        if provided != 2:
            raise serializers.ValidationError(
                'Provide exactly 2 of: girder_spacing, num_girders, deck_overhang.'
            )
        return data


class LocationInputSerializer(serializers.Serializer):
    state          = serializers.CharField(required=False, allow_blank=True)
    district       = serializers.CharField(required=False, allow_blank=True)
    wind_speed     = serializers.FloatField(required=False)
    seismic_zone   = serializers.CharField(required=False, allow_blank=True)
    seismic_factor = serializers.FloatField(required=False)
    max_temp       = serializers.FloatField(required=False)
    min_temp       = serializers.FloatField(required=False)


class DesignInputSerializer(serializers.Serializer):
    structure_type      = serializers.ChoiceField(choices=['highway', 'other'])
    location            = LocationInputSerializer()
    span                = serializers.FloatField()
    carriageway_width   = serializers.FloatField()
    footpath            = serializers.ChoiceField(choices=['None', 'Single-sided', 'Both'])
    skew_angle          = serializers.FloatField()
    girder_spacing      = serializers.FloatField(required=False, allow_null=True)
    num_girders         = serializers.IntegerField(required=False, allow_null=True)
    deck_overhang       = serializers.FloatField(required=False, allow_null=True)
    girder_steel        = serializers.ChoiceField(choices=['E250', 'E350', 'E450'])
    cross_bracing_steel = serializers.ChoiceField(choices=['E250', 'E350', 'E450'])
    deck_concrete       = serializers.ChoiceField(
        choices=['M25', 'M30', 'M35', 'M40', 'M45', 'M50', 'M55', 'M60']
    )

    def validate_span(self, val):
        # Span: software range 20–45 m
        if val < 20 or val > 45:
            raise serializers.ValidationError('Span must be between 20 m and 45 m.')
        return val

    def validate_carriageway_width(self, val):
        # IRC 6 standard lane limits
        if val < 4.25 or val >= 24:
            raise serializers.ValidationError('Carriageway width must be ≥ 4.25 m and < 24 m.')
        return val
