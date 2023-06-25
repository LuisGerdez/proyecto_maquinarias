import datetime
import textwrap
from django.contrib.auth.models import AbstractUser, Permission
from django.db import models

from .serializers import MaquinariaSerializer, TrabajadorSerializer, MantenimientoSerializer, ProyectoSerializer, ClienteSerializer, AlquilerSerializer


class User(AbstractUser):
	cedula = models.CharField(max_length=10, unique=True, default="")		
	middle_name = models.CharField(max_length=150, default="", blank=True)		
	last_name_2 = models.CharField(max_length=150, default="", blank=True)
	num_tlf = models.CharField(max_length=15, default="", blank=True)

	pregunta_seguridad = models.CharField(max_length=80, default="", blank=True)
	respuesta_seguridad = models.CharField(max_length=80, default="", blank=True)

	img = models.ImageField(null=True, blank=True, upload_to="perfil_img")

	def get_permissions(self):
		if self.is_superuser:
			return [p.codename for p in Permission.objects.all()]
		
		return [p.codename for p in self.user_permissions.all()]

	def get_names(self):
		return f"{self.first_name} {self.middle_name}".strip().replace("  ", " ")

	def get_last_names(self):
		return f"{self.last_name} {self.last_name_2}".strip().replace("  ", " ")

	def get_full_name(self):
		return f"{self.first_name} {self.middle_name} {self.last_name} {self.last_name_2}".strip().replace("  ", " ")

	def get_short_name(self):
		return f"{self.first_name} {self.last_name}".strip().replace("  ", " ")

	def is_available_to_reset_password(self):
		return True if self.pregunta_seguridad != "" or self.respuesta_seguridad != "" else False
	
	def get_profile_img_url(self):
		if self.img:
			return self.img.url
		else:
			return ""


class Maquinaria(models.Model):
	placa = models.CharField(max_length=10, unique=True)
	anio_fabricacion = models.DateField(blank=True, null=True)
	tipo = models.CharField(max_length=30, blank=True) # Cuales son los tipos
	marca = models.CharField(max_length=50, blank=True)
	modelo = models.CharField(max_length=50, blank=True)
	clase = models.CharField(max_length=30, blank=True) # Cuales son las clases
	color = models.CharField(max_length=40, blank=True)
	serial_niv = models.CharField(max_length=20, blank=True)
	serial_motor = models.CharField(max_length=20, blank=True)
	serial_carroceria = models.CharField(max_length=20, blank=True)
	serial_chasis = models.CharField(max_length=20, blank=True)
	tara = models.FloatField(default=0)
	num_ejes = models.IntegerField(default=0)
	capacidad_carga = models.FloatField(default=0)
	tipo_combustible = models.CharField(max_length=30, blank=True) # Cuales son los tipos
	capacidad_combustible = models.FloatField(default=0)
	descripcion = models.TextField(blank=True)

	deshabilitado = models.BooleanField(default=False)

	class Meta:
		verbose_name = "Maquinaria"
		verbose_name_plural = "Maquinarias"

	def get_description_wrapped(self):
		return textwrap.fill(self.descripcion, 100) if self.descripcion else ""

	def get_maquinaria_display(self):
		return f"{self.placa} - {self.marca} - Año {self.get_anio_fabricacion()}"

	def get_anio_fabricacion(self):
		return self.anio_fabricacion.year if self.anio_fabricacion else ""

	def get_estado(self, fecha_inicio=None, fecha_fin=None):
		if self.deshabilitado:
			return "Deshabilitado"

		if fecha_inicio and fecha_fin:
			mantenimientos_maquinaria = [mantenimiento for mantenimiento in Mantenimiento.objects.filter(maquinaria=self, fecha__range=(fecha_inicio, fecha_fin)) if mantenimiento.get_estado() != "Ejecutado" and mantenimiento.get_estado() != "Cancelado"]
			proyectos_maquinaria = [proyecto for proyecto in Proyecto.objects.all() if self in proyecto.maquinarias.all() and proyecto.fecha_finalizacion >= fecha_fin and proyecto.get_estado() != "Ejecutado" and proyecto.get_estado() != "Cancelado"]
			alquileres_maquinaria = [alquiler for alquiler in Alquiler.objects.all() if self in alquiler.maquinarias.all() and alquiler.fecha_retorno.date() >= fecha_fin and alquiler.get_estado() != "Ejecutado" and alquiler.get_estado() != "Cancelado"]
		else:
			mantenimientos_maquinaria = [mantenimiento for mantenimiento in Mantenimiento.objects.filter(maquinaria=self, fecha=datetime.date.today()) if mantenimiento.get_estado() != "Ejecutado" and mantenimiento.get_estado() != "Cancelado"]
			proyectos_maquinaria = [proyecto for proyecto in Proyecto.objects.all() if self in proyecto.maquinarias.all() and proyecto.fecha_finalizacion >= datetime.date.today() and proyecto.get_estado() != "Ejecutado" and proyecto.get_estado() != "Cancelado"]
			alquileres_maquinaria = [alquiler for alquiler in Alquiler.objects.all() if self in alquiler.maquinarias.all() and alquiler.fecha_retorno.date() >= datetime.date.today() and alquiler.get_estado() != "Ejecutado" and alquiler.get_estado() != "Cancelado"]

		if mantenimientos_maquinaria:
			return "En mantenimiento"
		if proyectos_maquinaria:
			return "En proyecto"
		if alquileres_maquinaria:
			return "En alquiler"

		return "Disponible"

	def serialize(self):
		return MaquinariaSerializer(self)

	def __str__(self):
		return f"{self.placa} - {self.marca} {self.get_anio_fabricacion()}"


class Trabajador(models.Model):
	class Cargos(models.TextChoices):
		CHOFER = "1", "Chófer"
		MECANICO = "2", "Mecánico"
		AYUDANTE = "3", "Ayudante de Mecánico"
		SUPERVISOR = "4", "Supervisor de mantenimiento"

	cedula = models.CharField(max_length=10, unique=True)
	first_name = models.CharField(max_length=150, blank=True)
	middle_name = models.CharField(max_length=150, blank=True, default="")
	last_name = models.CharField(max_length=150, blank=True)
	last_name_2 = models.CharField(max_length=150, blank=True, default="")
	num_tlf = models.CharField(max_length=15, default="", blank=True)
	cargo = models.CharField(max_length=3, choices=Cargos.choices, blank=True)

	deshabilitado = models.BooleanField(default=False)

	class Meta:
		verbose_name = "Trabajador"
		verbose_name_plural = "Trabajadores"

	def get_names(self):
		return f"{self.first_name} {self.middle_name}".strip().replace("  ", " ")

	def get_last_names(self):
		return f"{self.last_name} {self.last_name_2}".strip().replace("  ", " ")

	def get_full_name(self):
		return f"{self.first_name} {self.middle_name} {self.last_name} {self.last_name_2}".strip().replace("  ", " ")

	def get_short_name(self):
		return f"{self.first_name} {self.last_name}".strip().replace("  ", " ")

	def get_cargo(self):
		return self.Cargos(self.cargo).label if self.cargo else ""
	
	def get_estado(self, fecha_inicio=None, fecha_fin=None):
		if self.deshabilitado:
			return "Deshabilitado"
		
		proyectos_chofer = []
		alquileres_chofer = []

		if self.cargo == self.Cargos.CHOFER:
			if fecha_inicio and fecha_fin:
				proyectos_chofer = [proyecto for proyecto in Proyecto.objects.all() if self in proyecto.choferes.all() and proyecto.fecha_finalizacion >= fecha_fin and proyecto.get_estado() != "Ejecutado" and proyecto.get_estado() != "Cancelado"]
				alquileres_chofer = [alquiler for alquiler in Alquiler.objects.all() if self in alquiler.choferes.all() and alquiler.fecha_retorno.date() >= fecha_fin and alquiler.get_estado() != "Ejecutado" and alquiler.get_estado() != "Cancelado"]
			else:
				proyectos_chofer = [proyecto for proyecto in Proyecto.objects.all() if self in proyecto.choferes.all() and proyecto.fecha_finalizacion >= datetime.date.today() and proyecto.get_estado() != "Ejecutado" and proyecto.get_estado() != "Cancelado"]
				alquileres_chofer = [alquiler for alquiler in Alquiler.objects.all() if self in alquiler.choferes.all() and alquiler.fecha_retorno.date() >= datetime.date.today() and alquiler.get_estado() != "Ejecutado" and alquiler.get_estado() != "Cancelado"]

		if proyectos_chofer:
			return "En proyecto"
		if alquileres_chofer:
			return "En alquiler"

		return "Disponible"

	def serialize(self):
		return TrabajadorSerializer(self)

	def __str__(self):
		return f"{self.cedula} - {self.get_short_name()} - {self.get_cargo()}"


class Mantenimiento(models.Model):
	class TipoMantenimiento(models.TextChoices):
		CORRECTIVO = "1", "Correctivo"
		PREVENTIVO = "2", "Preventivo"

	maquinaria = models.ForeignKey(Maquinaria, on_delete=models.CASCADE)
	tipo_mantenimiento = models.CharField(max_length=3, choices=TipoMantenimiento.choices)

	supervisor = models.ForeignKey(Trabajador, limit_choices_to={'cargo': Trabajador.Cargos.SUPERVISOR}, 
		on_delete=models.SET_NULL, blank=True, null=True, related_name="supervidor")
	mecanicos = models.ManyToManyField(Trabajador, limit_choices_to={'cargo': Trabajador.Cargos.MECANICO}, 
		blank=True, related_name="mecanicos")
	ayudantes = models.ManyToManyField(Trabajador, limit_choices_to={'cargo': Trabajador.Cargos.AYUDANTE}, 
		blank=True, related_name="ayudantes")

	actividad = models.CharField(max_length=255)
	descripcion = models.TextField(blank=True)

	herramientas = models.TextField(blank=True)
	gastos = models.TextField(blank=True, default="")

	fecha = models.DateField(blank=True, null=True)

	culminado = models.BooleanField(default=False)
	culminado_nota = models.TextField(blank=True)

	cancelado = models.BooleanField(default=False)

	class Meta:
		verbose_name = "Mantenimiento"
		verbose_name_plural = "Mantenimientos"

	def get_tipo_mantenimiento(self):
		return self.TipoMantenimiento(self.tipo_mantenimiento).label

	def get_maquinaria(self):
		return f"{self.maquinaria.placa} - {self.maquinaria.marca} - Año {self.maquinaria.get_anio_fabricacion()}"
	
	def get_description_wrapped(self):
		return textwrap.fill(self.descripcion, 100) if self.descripcion else ""
	
	def get_herramientas_wrapped(self):
		return textwrap.fill(self.herramientas, 100) if self.herramientas else ""

	def get_estado(self):
		if self.cancelado:
			return "Cancelado"
		
		if self.culminado:
			return "Ejecutado"
		elif self.fecha and not self.culminado:
			return "Sin culminar"

	def get_supervisor_id(self):
		return self.supervisor.id if self.supervisor else ""

	def get_mecanicos_id(self):
		return [str(mecanico.id) for mecanico in self.mecanicos.all()]

	def get_ayudantes_id(self):
		return [str(ayudante.id) for ayudante in self.ayudantes.all()]

	def get_gastos_format(self):
		gastos = []

		gastos_split = self.gastos.split("//")

		for gasto in gastos_split:
			current = {}

			if gasto != "":
				split_values = gasto.split(";;")
				current["descripcion"] = split_values[0]

				try:
					current["monto"] = float(split_values[1])
				except Exception as e:
					current["monto"] = 0
				gastos.append(current)

		return gastos

	def get_gastos_total(self):
		total = 0

		gastos_split = self.gastos.split("//")

		for gasto in gastos_split:
			if gasto != "":
				split_values = gasto.split(";;")

				try:
					monto = float(split_values[1])
				except Exception as e:
					monto = 0

				total += monto

		return total

	def serialize(self):
		return MantenimientoSerializer(self)

	def __str__(self):
		return f"{self.id} - {self.maquinaria.placa} {self.maquinaria.marca} - Mantenimiento {self.get_tipo_mantenimiento()}"


class Proyecto(models.Model):
	nombre = models.CharField(max_length=255)
	fecha_inicio = models.DateField(blank=True, null=True)
	fecha_finalizacion = models.DateField(blank=True, null=True)
	lugar = models.TextField(blank=True)
	descripcion = models.TextField(blank=True)

	maquinarias = models.ManyToManyField(Maquinaria, blank=True, related_name="maquinarias")
	choferes = models.ManyToManyField(Trabajador, blank=True, related_name="choferes")

	culminado = models.BooleanField(default=False)
	culminado_nota = models.TextField(blank=True)

	cancelado = models.BooleanField(default=False)

	class Meta:
		verbose_name = "Proyecto"
		verbose_name_plural = "Proyectos"

	def get_description_wrapped(self):
		return textwrap.fill(self.descripcion, 100) if self.descripcion else ""
	
	def get_lugar_wrapped(self):
		return textwrap.fill(self.lugar, 100) if self.lugar else ""

	def get_maquinarias_id(self):
		return [str(maquinaria.id) for maquinaria in self.maquinarias.all()]

	def get_choferes_id(self):
		return [str(chofer.id) for chofer in self.choferes.all()]

	def get_estado(self):
		if self.cancelado:
			return "Cancelado"
		
		return "Ejecutado" if self.culminado else "Sin culminar"

	def serialize(self):
		return ProyectoSerializer(self)

	def __str__(self):
		return f"{self.id} - {self.nombre}"
	

class Cliente(models.Model):
	cedula = models.CharField(max_length=10, unique=True)
	first_name = models.CharField(max_length=150, blank=True)
	middle_name = models.CharField(max_length=150, blank=True, default="")
	last_name = models.CharField(max_length=150, blank=True)
	last_name_2 = models.CharField(max_length=150, blank=True, default="")
	num_tlf = models.CharField(max_length=15, default="", blank=True)
	direccion = models.TextField(blank=True)

	class Meta:
		verbose_name = "Cliente"
		verbose_name_plural = "Clientes"

	def get_names(self):
		return f"{self.first_name} {self.middle_name}".strip().replace("  ", " ")

	def get_last_names(self):
		return f"{self.last_name} {self.last_name_2}".strip().replace("  ", " ")

	def get_full_name(self):
		return f"{self.first_name} {self.middle_name} {self.last_name} {self.last_name_2}".strip().replace("  ", " ")

	def get_short_name(self):
		return f"{self.first_name} {self.last_name}".strip().replace("  ", " ")

	def serialize(self):
		return ClienteSerializer(self)

	def __str__(self):
		return f"{self.cedula} - {self.get_short_name()}"
	

class Alquiler(models.Model):
	actividad = models.CharField(max_length=255)
	fecha_salida = models.DateTimeField(blank=True, null=True)
	fecha_retorno = models.DateTimeField(blank=True, null=True)

	cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name="cliente")

	maquinarias = models.ManyToManyField(Maquinaria, blank=True, related_name="maquinarias_alquiler")
	choferes = models.ManyToManyField(Trabajador, blank=True, related_name="choferes_alquiler")

	monto = models.FloatField(default=0)

	culminado = models.BooleanField(default=False)
	culminado_nota = models.TextField(blank=True)

	cancelado = models.BooleanField(default=False)

	class Meta:
		verbose_name = "Alquiler"
		verbose_name_plural = "Alquileres"

	def get_cliente_id(self):
		return self.cliente.id if self.cliente else ""

	def get_maquinarias_id(self):
		return [str(maquinaria.id) for maquinaria in self.maquinarias.all()]

	def get_choferes_id(self):
		return [str(chofer.id) for chofer in self.choferes.all()]

	def get_estado(self):
		if self.cancelado:
			return "Cancelado"

		return "Ejecutado" if self.culminado else "Sin culminar"

	def serialize(self):
		return AlquilerSerializer(self)

	def __str__(self):
		return f"{self.id} - {self.actividad}"