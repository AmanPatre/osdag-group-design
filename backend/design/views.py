from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import (
    GeometryValidationSerializer,
    GirderCalcSerializer,
    DesignInputSerializer,
)


@api_view(['GET'])
def locations(request):
    from .models import State
    data = {}
    for st in State.objects.prefetch_related('station_set').order_by('name'):
        data[st.name] = [s.name for s in st.station_set.order_by('name')]
    return Response({'states': data})


@api_view(['GET'])
def location_data(request):
    state_name    = request.query_params.get('state', '').strip()
    district_name = request.query_params.get('district', '').strip()

    if not state_name or not district_name:
        return Response({'error': 'Both state and district query params are required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    from .models import Station
    try:
        st = Station.objects.select_related('seismic_zone').get(
            state__name=state_name, name=district_name
        )
        return Response({
            'wind_speed':     st.wind_speed_ms,
            'seismic_zone':   st.seismic_zone.zone_name   if st.seismic_zone else None,
            'seismic_factor': st.seismic_zone.seismic_factor if st.seismic_zone else None,
            'max_temp':       st.max_temp_c,
            'min_temp':       st.min_temp_c,
        })
    except Station.DoesNotExist:
        return Response({'error': f'{district_name} not found in {state_name}.'},
                        status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def validate_geometry(request):
    ser = GeometryValidationSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

    span = ser.validated_data['span']
    cw   = ser.validated_data['carriageway_width']
    skew = ser.validated_data['skew_angle']

    errors = []
    span_valid       = True
    carriageway_valid = True
    skew_warning     = False

    if span < 20 or span > 45:
        span_valid = False
        errors.append(f'Span {span} m is outside the software range (20–45 m).')

    if cw < 4.25 or cw >= 24:
        carriageway_valid = False
        errors.append(f'Carriageway width {cw} m must be ≥ 4.25 m and < 24 m.')

    if skew < -15 or skew > 15:
        skew_warning = True
        errors.append(f'Skew angle {skew}° exceeds ±15°. IRC 24 (2010) requires detailed analysis.')

    return Response({
        'span_valid': span_valid,
        'carriageway_valid': carriageway_valid,
        'skew_warning': skew_warning,
        'errors': errors,
    })


@api_view(['POST'])
def calculate_girder(request):
    ser = GirderCalcSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

    d  = ser.validated_data
    cw = d['carriageway_width']
    bw = cw + 5.0

    gs = d.get('girder_spacing')
    ng = d.get('num_girders')
    do = d.get('deck_overhang')

    result = {}
    try:
        if gs is None:
            if ng <= 0:
                return Response({'error': 'num_girders must be > 0'}, status=400)
            computed = (bw - do) / ng
            if computed <= 0:
                return Response({'error': 'Computed girder spacing is non-positive. Check inputs.'}, status=400)
            result = {'girder_spacing': round(computed, 3), 'num_girders': ng, 'deck_overhang': do}

        elif ng is None:
            if gs <= 0:
                return Response({'error': 'girder_spacing must be > 0'}, status=400)
            result = {'num_girders': round((bw - do) / gs), 'girder_spacing': gs, 'deck_overhang': do}

        else:
            if ng <= 0 or gs <= 0:
                return Response({'error': 'girder_spacing and num_girders must be > 0'}, status=400)
            computed = bw - ng * gs
            if computed < 0:
                return Response({'error': 'Computed deck overhang is negative. Reduce girder spacing or count.'}, status=400)
            result = {'deck_overhang': round(computed, 3), 'girder_spacing': gs, 'num_girders': ng}

    except ZeroDivisionError:
        return Response({'error': 'Division by zero — check girder_spacing and num_girders.'}, status=400)

    lhs = round((bw - result['deck_overhang']) / result['girder_spacing'], 3)
    result['overall_bridge_width'] = bw
    result['constraint_satisfied'] = abs(lhs - result['num_girders']) < 0.05

    return Response(result)


@api_view(['POST'])
def design_bridge(request):
    ser = DesignInputSerializer(data=request.data)
    if not ser.is_valid():
        return Response({'errors': ser.errors, 'ok': False}, status=status.HTTP_400_BAD_REQUEST)

    d  = ser.validated_data
    cw = d['carriageway_width']
    bw = cw + 5.0

    warnings = []

    if abs(d['skew_angle']) > 15:
        warnings.append(f"Skew angle {d['skew_angle']}° requires detailed analysis per IRC 24:2010.")

    gs = d.get('girder_spacing')
    ng = d.get('num_girders')
    do = d.get('deck_overhang')
    girder_ok = True
    if gs and ng and do is not None:
        if abs((bw - do) / gs - ng) > 0.05:
            girder_ok = False
            warnings.append(f"Girder constraint not satisfied: ({bw} - {do}) / {gs} ≠ {ng}.")

    return Response({
        'ok': girder_ok,
        'warnings': warnings,
        'inputs': {
            'structure_type':       d['structure_type'],
            'span_m':               d['span'],
            'carriageway_width_m':  cw,
            'overall_bridge_width_m': bw,
            'footpath':             d['footpath'],
            'skew_angle_deg':       d['skew_angle'],
            'girder_spacing_m':     gs,
            'num_girders':          ng,
            'deck_overhang_m':      do,
            'girder_steel':         d['girder_steel'],
            'cross_bracing_steel':  d['cross_bracing_steel'],
            'deck_concrete':        d['deck_concrete'],
        },
        'location': d.get('location', {}),
        'results': None,
        'message': (
            'Input validation passed. Design calculation engine not yet connected.'
            if girder_ok else
            'Input validation failed. Review warnings above.'
        ),
    }, status=status.HTTP_200_OK)
