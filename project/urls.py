from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("pdf/", include("pdf.urls")),
    path("", include("core.urls")),
]
