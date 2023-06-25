from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(User)
admin.site.register(Maquinaria)
admin.site.register(Trabajador)
admin.site.register(Mantenimiento)
admin.site.register(Proyecto)
admin.site.register(Cliente)
admin.site.register(Alquiler)