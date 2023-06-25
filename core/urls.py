from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("maquinarias/", views.maquinarias, name="maquinarias"),
    path("trabajadores/", views.trabajadores, name="trabajadores"),
    path("mantenimientos/", views.mantenimientos, name="mantenimientos"),
    path("proyectos/", views.proyectos, name="proyectos"),
    path("clientes/", views.clientes, name="clientes"),
    path("alquileres/", views.alquileres, name="alquileres"),

    path("perfil", views.perfil, name="perfil"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),

    path("respaldo", views.respaldo, name="respaldo"),
    
    path("admin/register", views.register, name="register"),
    path("admin/modificar_usuarios", views.modificar_usuarios, name="modificar_usuarios"),

    path("backup/export", views.backup_export, name="backup_export"),

    path("error_no_permission", views.error_no_permission, name="error_no_permission"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
