from django.urls import path

from . import views

urlpatterns = [
    path("maquinarias/<int:id>", views.maquinarias, name="maquinarias"),
    path("maquinarias/", views.maquinarias_all, name="maquinarias_all"),

    path("trabajadores/<int:id>", views.trabajadores, name="trabajadores"),
    path("trabajadores/", views.trabajadores_all, name="trabajadores"),

    path("mantenimientos/<int:id>", views.mantenimientos, name="mantenimientos"),
    path("mantenimientos/", views.mantenimientos_all, name="mantenimientos"),

    path("proyectos/<int:id>", views.proyectos, name="proyectos"),
    path("proyectos/", views.proyectos_all, name="proyectos"),

    path("clientes/<int:id>", views.clientes, name="clientes"),
    path("clientes/", views.clientes_all, name="clientes"),

    path("alquileres/<int:id>", views.alquileres, name="alquileres"),
    path("alquileres/", views.alquileres_all, name="alquileres"),
]