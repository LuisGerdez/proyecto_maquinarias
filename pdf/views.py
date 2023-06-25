from django.db import IntegrityError
from django.http import HttpResponse

from core.models import *

from pdf.utils import render_to_pdf


def maquinarias(request, id):
    try:
        maquinaria = Maquinaria.objects.get(id=id)
    except IntegrityError:
        return HttpResponse("Ha ocurrido un error al generar el pdf")
    except Maquinaria.DoesNotExist:
        return HttpResponse("Esta maquinaria no está registrada")

    data = {
        "maquinaria": maquinaria, "user": request.user, "host": "http://" + request.META['HTTP_HOST']
    }

    pdf = render_to_pdf("pdf/maquinarias.html", data)
    
    return HttpResponse(pdf, content_type="application/pdf")

def maquinarias_all(request):
    pdf = render_to_pdf("pdf/maquinarias_all.html", {"user": request.user, "maquinarias": Maquinaria.objects.all(), "host": "http://" + request.META['HTTP_HOST']})
    
    return HttpResponse(pdf, content_type="application/pdf")

def trabajadores(request, id):
    try:
        trabajador = Trabajador.objects.get(id=id)
    except IntegrityError:
        return HttpResponse("Ha ocurrido un error al generar el pdf")
    except Trabajador.DoesNotExist:
        return HttpResponse("Este trabajador no está registrado")

    data = {
        "trabajador": trabajador, "user": request.user, "host": "http://" + request.META['HTTP_HOST']
    }

    pdf = render_to_pdf("pdf/trabajadores.html", data)
    
    return HttpResponse(pdf, content_type="application/pdf")

def trabajadores_all(request):
    pdf = render_to_pdf("pdf/trabajadores_all.html", {"trabajadores": Trabajador.objects.all(), "user": request.user, "host": "http://" + request.META['HTTP_HOST']})
    
    return HttpResponse(pdf, content_type="application/pdf")

def mantenimientos(request, id):
    try:
        mantenimiento = Mantenimiento.objects.get(id=id)
    except IntegrityError:
        return HttpResponse("Ha ocurrido un error al generar el pdf")
    except Mantenimiento.DoesNotExist:
        return HttpResponse("Este mantenimiento no está registrado")

    data = {
        "mantenimiento": mantenimiento, "user": request.user, "host": "http://" + request.META['HTTP_HOST']
    }

    pdf = render_to_pdf("pdf/mantenimientos.html", data)
    
    return HttpResponse(pdf, content_type="application/pdf")

def mantenimientos_all(request):
    if request.GET.get("culminados"):
        mantenimientos = Mantenimiento.objects.filter(culminado=True)
    elif request.GET.get("sinculminar"):
        mantenimientos = Mantenimiento.objects.filter(culminado=False)
    elif request.GET.get("cancelados"):
        mantenimientos = Mantenimiento.objects.filter(cancelado=True)
    elif request.GET.get("correctivos"):
        mantenimientos = Mantenimiento.objects.filter(tipo_mantenimiento=1)
    elif request.GET.get("preventivos"):
        mantenimientos = Mantenimiento.objects.filter(tipo_mantenimiento=2)
    else:
        mantenimientos = Mantenimiento.objects.all()

    pdf = render_to_pdf("pdf/mantenimientos_all.html", {"mantenimientos": mantenimientos, "user": request.user, "host": "http://" + request.META['HTTP_HOST']})
    
    return HttpResponse(pdf, content_type="application/pdf")

def proyectos(request, id):
    try:
        proyecto = Proyecto.objects.get(id=id)
    except IntegrityError:
        return HttpResponse("Ha ocurrido un error al generar el pdf")
    except Proyecto.DoesNotExist:
        return HttpResponse("Este proyecto no está registrado")

    data = {
        "proyecto": proyecto, "user": request.user, "host": "http://" + request.META['HTTP_HOST']
    }

    pdf = render_to_pdf("pdf/proyectos.html", data)
    
    return HttpResponse(pdf, content_type="application/pdf")

def proyectos_all(request):
    if request.GET.get("culminados"):
        proyectos = Proyecto.objects.filter(culminado=True)
    elif request.GET.get("sinculminar"):
        proyectos = Proyecto.objects.filter(culminado=False)
    elif request.GET.get("cancelados"):
        proyectos = Proyecto.objects.filter(cancelado=True)
    else:
        proyectos = Proyecto.objects.all()


    pdf = render_to_pdf("pdf/proyectos_all.html", {"proyectos": proyectos, "user": request.user, "host": "http://" + request.META['HTTP_HOST']})
    
    return HttpResponse(pdf, content_type="application/pdf")

def clientes(request, id):
    try:
        cliente = Cliente.objects.get(id=id)
    except IntegrityError:
        return HttpResponse("Ha ocurrido un error al generar el pdf")
    except Cliente.DoesNotExist:
        return HttpResponse("Este cliente no está registrado")

    data = {
        "cliente": cliente, "user": request.user, "host": "http://" + request.META['HTTP_HOST']
    }

    pdf = render_to_pdf("pdf/clientes.html", data)
    
    return HttpResponse(pdf, content_type="application/pdf")

def clientes_all(request):
    pdf = render_to_pdf("pdf/clientes_all.html", {"clientes": Cliente.objects.all(), "user": request.user, "host": "http://" + request.META['HTTP_HOST']})
    
    return HttpResponse(pdf, content_type="application/pdf")

def alquileres(request, id):
    try:
        alquiler = Alquiler.objects.get(id=id)
    except IntegrityError:
        return HttpResponse("Ha ocurrido un error al generar el pdf")
    except Alquiler.DoesNotExist:
        return HttpResponse("Este alquiler no está registrado")

    data = {
        "alquiler": alquiler, "user": request.user, "host": "http://" + request.META['HTTP_HOST']
    }

    pdf = render_to_pdf("pdf/alquileres.html", data)
    
    return HttpResponse(pdf, content_type="application/pdf")

def alquileres_all(request):
    if request.GET.get("culminados"):
        alquileres = Alquiler.objects.filter(culminado=True)
    elif request.GET.get("sinculminar"):
        alquileres = Alquiler.objects.filter(culminado=False)
    elif request.GET.get("cancelados"):
        alquileres = Alquiler.objects.filter(cancelado=True)
    else:
        alquileres = Alquiler.objects.all()

    pdf = render_to_pdf("pdf/alquileres_all.html", {"alquileres": alquileres, "user": request.user, "host": "http://" + request.META['HTTP_HOST']})
    
    return HttpResponse(pdf, content_type="application/pdf")