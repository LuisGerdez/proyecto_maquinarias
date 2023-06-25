from django.urls import path

from . import views

urlpatterns = [
	path("maquinarias/", views.maquinarias, name="maquinarias"),
	path("maquinarias/<int:id>", views.maquinarias, name="maquinarias"),

	path("trabajadores/", views.trabajadores, name="trabajadores"),
	path("trabajadores/<int:id>", views.trabajadores, name="trabajadores"),

	path("mantenimientos/", views.mantenimientos, name="mantenimientos"),
	path("mantenimientos/<int:id>", views.mantenimientos, name="mantenimientos"),

	path("proyectos/", views.proyectos, name="proyectos"),
	path("proyectos/<int:id>", views.proyectos, name="proyectos"),
    
	path("clientes/", views.clientes, name="clientes"),
	path("clientes/<int:id>", views.clientes, name="clientes"),
    
	path("alquileres/", views.alquileres, name="alquileres"),
	path("alquileres/<int:id>", views.alquileres, name="alquileres"),
    
	path("perfil/<int:id>", views.perfil, name="perfil"),
    
	path("user_exists", views.user_exists, name="user_exists"),
    path("check_pregunta_seguridad", views.check_pregunta_seguridad, name="check_pregunta_seguridad"),
    path("user_reset_password", views.user_reset_password, name="user_reset_password"),
]