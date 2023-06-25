from django.forms.models import model_to_dict

from core.models import *


def maquinaria_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["maquinaria_display"] = self.get_maquinaria_display()
	dict_model["anio_fabricacion"] = self.get_anio_fabricacion()
	dict_model["estado"] = self.get_estado()
	return dict_model

def trabajador_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["names"] = self.get_names()
	dict_model["last_names"] = self.get_last_names()
	dict_model["fullname"] = self.get_full_name()
	dict_model["shortname"] = self.get_short_name()
	dict_model["cargo_display"] = self.get_cargo()
	dict_model["estado"] = self.get_estado()
	return dict_model

def mantenimiento_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["tipo_mantenimiento_display"] = self.get_tipo_mantenimiento()
	dict_model["maquinaria"] = self.maquinaria.serialize()
	dict_model["supervisor"] = self.supervisor.serialize()
	dict_model["supervisor_id"] = self.get_supervisor_id()
	dict_model["mecanicos"] = [mecanico.serialize() for mecanico in self.mecanicos.all()]
	dict_model["mecanicos_id"] = self.get_mecanicos_id()
	dict_model["ayudantes"] = [ayudante.serialize() for ayudante in self.ayudantes.all()]
	dict_model["ayudantes_id"] = self.get_ayudantes_id()
	dict_model["gastos_format"] = self.get_gastos_format()
	dict_model["gastos_total"] = self.get_gastos_total()
	dict_model["maquinaria_display"] = self.get_maquinaria()
	dict_model["estado"] = self.get_estado()
	return dict_model

def proyecto_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["maquinarias"] = [maquinaria.serialize() for maquinaria in self.maquinarias.all()]
	dict_model["maquinarias_id"] = self.get_maquinarias_id()
	dict_model["choferes"] = [chofer.serialize() for chofer in self.choferes.all()]
	dict_model["choferes_id"] = self.get_choferes_id()
	dict_model["estado"] = self.get_estado()
	return dict_model

def cliente_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["names"] = self.get_names()
	dict_model["last_names"] = self.get_last_names()
	dict_model["fullname"] = self.get_full_name()
	dict_model["shortname"] = self.get_short_name()
	return dict_model

def alquiler_serialize(self):
	dict_model = model_to_dict(self)
	dict_model["cliente"] = self.cliente.serialize()
	dict_model["cliente_id"] = self.get_cliente_id()
	dict_model["maquinarias"] = [maquinaria.serialize() for maquinaria in self.maquinarias.all()]
	dict_model["maquinarias_id"] = self.get_maquinarias_id()
	dict_model["choferes"] = [chofer.serialize() for chofer in self.choferes.all()]
	dict_model["choferes_id"] = self.get_choferes_id()
	dict_model["estado"] = self.get_estado()
	return dict_model

MaquinariaSerializer = maquinaria_serialize
TrabajadorSerializer = trabajador_serialize
MantenimientoSerializer = mantenimiento_serialize
ProyectoSerializer = proyecto_serialize
ClienteSerializer = cliente_serialize
AlquilerSerializer = alquiler_serialize