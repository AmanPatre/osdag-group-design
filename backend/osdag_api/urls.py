from django.urls import path, include

urlpatterns = [
    path('api/', include('design.urls')),
]
