import datetime
from io import BytesIO
from django.http import HttpResponse
from django.template.loader import get_template

from .models import *

from xhtml2pdf import pisa


def render_to_pdf(template_src, context_dict={}):
    template = get_template(template_src)
    html  = template.render(context_dict)
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
    if not pdf.err:
        return HttpResponse(result.getvalue(), content_type='application/pdf')
    return None


def get_alertas():
	alertas = []

	for mantenimiento in Mantenimiento.objects.all():
		if mantenimiento.get_estado() != "Ejecutado" and mantenimiento.get_estado() != "Cancelado":
			time_difference = mantenimiento.fecha - (datetime.date.today())

			if time_difference.days <= 2:
				current = {}
				current["alert_title"] = mantenimiento.get_maquinaria()

				if time_difference.days == 0:
					current["alert_msg"] = f"Hoy es el día de la fecha programada de mantenimiento!"
				elif time_difference.days < 0:
					current["alert_msg"] = f"Han pasado {(time_difference.days) * -1} días de la fecha programada de mantenimiento!"
				else:
					current["alert_msg"] = f"Faltan {time_difference.days} días para alcanzar la fecha programada de mantenimiento!"

				if time_difference.days < 0:
					alert_type = "text-danger"
					alert_icon = "bi bi-x-circle"
				elif time_difference.days < 1:
					alert_type = "text-warning"
					alert_icon = "bi bi-exclamation-circle"
				elif time_difference.days <= 2:
					alert_type = "text-primary"
					alert_icon = "bi bi-info-circle"

				current["alert_type"] = alert_type
				current["alert_icon"] = alert_icon

				alertas.append(current)

	for alquiler in Alquiler.objects.all():
		if alquiler.get_estado() != "Ejecutado" and alquiler.get_estado() != "Cancelado":
			time_difference = alquiler.fecha_retorno.date() - (datetime.date.today())

			if time_difference.days <= 2:
				current = {}
				current["alert_title"] = alquiler.actividad

				if time_difference.days == 0:
					current["alert_msg"] = f"Hoy es el día de la fecha de retorno del alquiler!"
				elif time_difference.days < 0:
					current["alert_msg"] = f"Han pasado {(time_difference.days) * -1} días de la fecha de retorno del alquiler!"
				else:
					current["alert_msg"] = f"Faltan {time_difference.days} días para alcanzar la fecha de retorno del alquiler!"

				if time_difference.days < 0:
					alert_type = "text-danger"
					alert_icon = "bi bi-x-circle"
				elif time_difference.days < 1:
					alert_type = "text-warning"
					alert_icon = "bi bi-exclamation-circle"
				elif time_difference.days <= 2:
					alert_type = "text-primary"
					alert_icon = "bi bi-info-circle"

				current["alert_type"] = alert_type
				current["alert_icon"] = alert_icon

				alertas.append(current)

	for proyecto in Proyecto.objects.all():
		if proyecto.get_estado() != "Ejecutado" and proyecto.get_estado() != "Cancelado":
			time_difference = proyecto.fecha_finalizacion - (datetime.date.today())

			if time_difference.days <= 2:
				current = {}
				current["alert_title"] = proyecto.nombre

				if time_difference.days == 0:
					current["alert_msg"] = f"Hoy es el día de la fecha de finalización del proyecto!"
				elif time_difference.days < 0:
					current["alert_msg"] = f"Han pasado {(time_difference.days) * -1} días de la fecha de finalización del proyecto!"
				else:
					current["alert_msg"] = f"Faltan {time_difference.days} días para alcanzar la fecha de finalización del proyecto!"

				if time_difference.days < 0:
					alert_type = "text-danger"
					alert_icon = "bi bi-x-circle"
				elif time_difference.days < 1:
					alert_type = "text-warning"
					alert_icon = "bi bi-exclamation-circle"
				elif time_difference.days <= 2:
					alert_type = "text-primary"
					alert_icon = "bi bi-info-circle"

				current["alert_type"] = alert_type
				current["alert_icon"] = alert_icon

				alertas.append(current)
				
	return alertas