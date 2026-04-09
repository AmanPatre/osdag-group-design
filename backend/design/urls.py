from django.urls import path
from . import views

urlpatterns = [
    path('locations/', views.locations),
    path('location-data/', views.location_data),
    path('validate-geometry/', views.validate_geometry),
    path('calculate-girder/', views.calculate_girder),
    path('design/', views.design_bridge),
]
