import json
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from core.models import *


@csrf_exempt
@login_required
def maquinarias(request, id=None):
    if request.method == "GET":
        fecha_inicio_string = request.GET.get("fecha_inicio", None)
        fecha_fin_string = request.GET.get("fecha_fin", None)
        exclude_proyecto_id = request.GET.get("exclude_proyecto_id", None)
        exclude_alquiler_id = request.GET.get("exclude_alquiler_id", None)

        try:
            proyecto_exclude = Proyecto.objects.get(id=exclude_proyecto_id)
            maquinarias_proyecto_exclude = proyecto_exclude.get_maquinarias_id()
        except:
            maquinarias_proyecto_exclude = []

        try:
            alquiler_exclude = Alquiler.objects.get(id=exclude_alquiler_id)
            maquinarias_alquiler_exclude = alquiler_exclude.get_maquinarias_id()
        except:
            maquinarias_alquiler_exclude = []

        if fecha_inicio_string and fecha_fin_string:
            try:
                fecha_inicio = datetime.datetime.strptime(fecha_inicio_string, '%Y-%m-%d').date()
                fecha_fin = datetime.datetime.strptime(fecha_fin_string, '%Y-%m-%d').date()

                return JsonResponse([maquinaria.serialize() for maquinaria in Maquinaria.objects.filter(deshabilitado=False) if maquinaria.get_estado(fecha_inicio=fecha_inicio, fecha_fin=fecha_fin) == "Disponible" or (str(maquinaria.id) in maquinarias_proyecto_exclude or maquinarias_alquiler_exclude)], safe=False)
            except ValueError:
                return JsonResponse([], safe=False)

        if id != None:
            try:
                maquinaria = Maquinaria.objects.get(id=id)
                return JsonResponse(maquinaria.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Maquinaria.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse([maquinaria.serialize() for maquinaria in (Maquinaria.objects.filter(deshabilitado=False) if "admin" not in request.GET else Maquinaria.objects.all())], safe=False)

    if request.method == "POST":
        data = json.loads(request.body)
        data["anio_fabricacion"] = datetime.datetime.strptime("01-01-" + data["anio_fabricacion"], '%m-%d-%Y').date()

        if id == None:
            try:
                maquinaria = Maquinaria.objects.create(**data)
                return JsonResponse({"message": "Maquinaria agregada."}, status=201)
            except IntegrityError as e:
                if "UNIQUE constraint failed: core_maquinaria.placa" in e.args:
                    return JsonResponse({"error": "PlacaNotUnique."}, status=417)
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "PUT":
        data = json.loads(request.body)
        data["anio_fabricacion"] = datetime.datetime.strptime("01-01-" + data["anio_fabricacion"], '%m-%d-%Y').date()

        if id != None:
            if not Maquinaria.objects.filter(id=id).exists():
                return JsonResponse({"error": "DoesNotExist."}, status=417)

            try:
                data.pop("placa", None)
                maquinaria = Maquinaria.objects.filter(id=id).update(**data)
                return JsonResponse({"message": "Maquinaria modificada."}, status=201)
            except IntegrityError as e:
                if "UNIQUE constraint failed: core_maquinaria.placa" in e.args:
                    return JsonResponse({"error": "PlacaNotUnique."}, status=417)
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "DELETE":
        if not request.user.is_superuser:
            return JsonResponse({"error": "No permission."}, status=417)
        
        if id != None:
            try:
                maquinaria = Maquinaria.objects.get(id=id).delete()
                return JsonResponse({"message": "Maquinaria eliminada."}, status=201)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Maquinaria.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    
    if request.method == "PATCH":
        data = json.loads(request.body)

        if id != None:
            try:
                maquinaria = Maquinaria.objects.get(id=id)

                if "toggle" in data.keys():
                    if not maquinaria.deshabilitado:
                        mantenimientos_maquinaria = [mantenimiento for mantenimiento in Mantenimiento.objects.filter(maquinaria=maquinaria) if mantenimiento.get_estado() != "Ejecutado" and mantenimiento.get_estado() != "Cancelado"]
                        proyectos_maquinaria = [proyecto for proyecto in Proyecto.objects.all() if maquinaria in proyecto.maquinarias.all() and proyecto.get_estado() != "Ejecutado" and proyecto.get_estado() != "Cancelado"]
                        alquileres_maquinaria = [alquiler for alquiler in Alquiler.objects.all() if maquinaria in alquiler.maquinarias.all() and alquiler.get_estado() != "Ejecutado" and alquiler.get_estado() != "Cancelado"]

                        if mantenimientos_maquinaria or proyectos_maquinaria or alquileres_maquinaria:
                            return JsonResponse({"error": "InvalidToggle."}, status=417)
                    
                    maquinaria.deshabilitado = not maquinaria.deshabilitado

                maquinaria.save()

                return JsonResponse({"message": "Maquinaria modificada."}, status=201)
            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError as e:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)


@csrf_exempt
@login_required
def trabajadores(request, id=None):
    if request.method == "GET":
        fecha_inicio_string = request.GET.get("fecha_inicio", None)
        fecha_fin_string = request.GET.get("fecha_fin", None)
        exclude_proyecto_id = request.GET.get("exclude_proyecto_id", None)
        exclude_alquiler_id = request.GET.get("exclude_alquiler_id", None)

        trabajador_cargo = request.GET.get("cargo", None)

        try:
            proyecto_exclude = Proyecto.objects.get(id=exclude_proyecto_id)
            choferes_proyecto_exclude = proyecto_exclude.get_choferes_id()
        except:
            choferes_proyecto_exclude = []

        try:
            alquiler_exclude = Alquiler.objects.get(id=exclude_alquiler_id)
            choferes_alquiler_exclude = alquiler_exclude.get_choferes_id()
        except:
            choferes_alquiler_exclude = []

        if trabajador_cargo in ["1", "2", "3", "4"]:
            if fecha_inicio_string and fecha_fin_string:
                try:
                    fecha_inicio = datetime.datetime.strptime(fecha_inicio_string, '%Y-%m-%d').date()
                    fecha_fin = datetime.datetime.strptime(fecha_fin_string, '%Y-%m-%d').date()

                    if trabajador_cargo == "1":
                        return JsonResponse([trabajador.serialize() for trabajador in Trabajador.objects.filter(cargo=trabajador_cargo) if trabajador.get_estado(fecha_inicio=fecha_inicio, fecha_fin=fecha_fin) == "Disponible" or (str(trabajador.id) in choferes_proyecto_exclude or choferes_alquiler_exclude)], safe=False)
                    
                    return JsonResponse([trabajador.serialize() for trabajador in Trabajador.objects.filter(cargo=trabajador_cargo) if trabajador.get_estado(fecha_inicio=fecha_inicio, fecha_fin=fecha_fin) == "Disponible"], safe=False)
                except ValueError:
                    return JsonResponse([], safe=False)
                
            return JsonResponse([trabajador.serialize() for trabajador in Trabajador.objects.filter(cargo=trabajador_cargo, deshabilitado=False)], safe=False)
        
        if fecha_inicio_string and fecha_fin_string:
            try:
                fecha_inicio = datetime.datetime.strptime(fecha_inicio_string, '%Y-%m-%d').date()
                fecha_fin = datetime.datetime.strptime(fecha_fin_string, '%Y-%m-%d').date()

                return JsonResponse([trabajador.serialize() for trabajador in Trabajador.objects.all() if trabajador.get_estado(fecha_inicio=fecha_inicio, fecha_fin=fecha_fin) == "Disponible"], safe=False)
            except ValueError:
                return JsonResponse([], safe=False)

        if id != None:
            try:
                trabajador = Trabajador.objects.get(id=id)
                return JsonResponse(trabajador.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Trabajador.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse([trabajador.serialize() for trabajador in (Trabajador.objects.filter(deshabilitado=False) if "admin" not in request.GET else Trabajador.objects.all())], safe=False)

    if request.method == "POST":
        data = json.loads(request.body)

        if id == None:
            try:
                trabajador = Trabajador.objects.create(**data)
                return JsonResponse({"message": "Trabajador agregada."}, status=201)
            except IntegrityError as e:
                if "UNIQUE constraint failed: core_trabajador.cedula" in e.args:
                    return JsonResponse({"error": "CedulaNotUnique."}, status=417)
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "PUT":
        data = json.loads(request.body)

        if id != None:
            if not Trabajador.objects.filter(id=id).exists():
                return JsonResponse({"error": "DoesNotExist."}, status=417)

            try:
                data.pop("cedula", None)
                trabajador = Trabajador.objects.filter(id=id).update(**data)
                return JsonResponse({"message": "Trabajador modificado."}, status=201)
            except IntegrityError as e:
                if "UNIQUE constraint failed: core_trabajador.cedula" in e.args:
                    return JsonResponse({"error": "CedulaNotUnique."}, status=417)
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "DELETE":
        if not request.user.is_superuser:
            return JsonResponse({"error": "No permission."}, status=417)
        
        if id != None:
            try:
                trabajador = Trabajador.objects.get(id=id).delete()
                return JsonResponse({"message": "Trabajador eliminado."}, status=201)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Trabajador.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    
    if request.method == "PATCH":
        data = json.loads(request.body)

        if id != None:
            try:
                trabajador = Trabajador.objects.get(id=id)

                if "toggle" in data.keys():
                    if not trabajador.deshabilitado:
                        proyectos_chofer = [proyecto for proyecto in Proyecto.objects.all() if trabajador in proyecto.choferes.all() and proyecto.get_estado() != "Ejecutado" and proyecto.get_estado() != "Cancelado"]
                        alquileres_chofer = [alquiler for alquiler in Alquiler.objects.all() if trabajador in alquiler.choferes.all() and alquiler.get_estado() != "Ejecutado" and alquiler.get_estado() != "Cancelado"]

                        if proyectos_chofer or alquileres_chofer:
                            return JsonResponse({"error": "InvalidToggle."}, status=417)
                    
                    trabajador.deshabilitado = not trabajador.deshabilitado

                trabajador.save()

                return JsonResponse({"message": "Trabajador modificado."}, status=201)
            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError as e:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)


@csrf_exempt
@login_required
def mantenimientos(request, id=None):
    if request.method == "GET":
        if id != None:
            try:
                mantenimiento = Mantenimiento.objects.get(id=id)
                return JsonResponse(mantenimiento.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Mantenimiento.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse([mantenimiento.serialize() for mantenimiento in Mantenimiento.objects.all()], safe=False)
    
    if request.method == "POST":
        data = json.loads(request.body)

        if id == None:
            maquinaria_id = data.get("maquinaria_id", "")
            supervisor_id = data.get("supervisor_id", "")

            mecanicos, ayudantes = [], []

            mecanicos_id = data.get("mecanicos_id", "")
            ayudantes_id = data.get("ayudantes_id", "")

            try:
                if maquinaria_id != "":
                    maquinaria = Maquinaria.objects.get(id=maquinaria_id)

                if supervisor_id != "":
                    supervisor = Trabajador.objects.get(id=supervisor_id)

                if mecanicos_id != "":
                    for mecanico_id in mecanicos_id.split(","):
                        mecanico = Trabajador.objects.get(id=mecanico_id)
                        mecanicos.append(mecanico)

                if ayudantes_id != "":
                    for ayudante_id in ayudantes_id.split(","):
                        ayudante = Trabajador.objects.get(id=ayudante_id)
                        ayudantes.append(ayudante)

                fecha = None if data.get("fecha", "") == "" else data.get("fecha", None)

                mantenimiento = Mantenimiento.objects.create(maquinaria=maquinaria, tipo_mantenimiento=data.get("tipo", ""), supervisor=supervisor, actividad=data.get("actividad", ""),
                    descripcion=data.get("descripcion", ""), herramientas=data.get("herramientas", ""), gastos=data.get("gastos", ""), fecha=fecha)

                for mecanico in mecanicos: mantenimiento.mecanicos.add(mecanico)
                for ayudante in ayudantes: mantenimiento.ayudantes.add(ayudante)

                if data.get("tipo", "") == "1":
                    mantenimiento.culminado = True

                mantenimiento.save()

                return JsonResponse({"message": "Mantenimiento agregado."}, status=201)

            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Trabajador.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            except Maquinaria.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            except ValueError as e:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "PUT":
        data = json.loads(request.body)

        if id != None:
            supervisor_id = data.get("supervisor_id", "")

            mecanicos, ayudantes = [], []

            mecanicos_id = data.get("mecanicos_id", "")
            ayudantes_id = data.get("ayudantes_id", "")

            try:
                if supervisor_id != "":
                    supervisor = Trabajador.objects.get(id=supervisor_id)

                if mecanicos_id != "":
                    for mecanico_id in mecanicos_id.split(","):
                        mecanico = Trabajador.objects.get(id=mecanico_id)
                        mecanicos.append(mecanico)

                if ayudantes_id != "":
                    for ayudante_id in ayudantes_id.split(","):
                        ayudante = Trabajador.objects.get(id=ayudante_id)
                        ayudantes.append(ayudante)

                fecha = None if data.get("fecha", "") == "" else data.get("fecha", None)

                mantenimiento = Mantenimiento.objects.get(id=id)

                mantenimiento.tipo_mantenimiento = data.get("tipo", "")
                mantenimiento.fecha = fecha
                mantenimiento.supervisor = supervisor
                mantenimiento.actividad = data.get("actividad", "")
                mantenimiento.descripcion = data.get("descripcion", "")
                mantenimiento.herramientas = data.get("herramientas", "")
                mantenimiento.gastos = data.get("gastos", "")

                mantenimiento.mecanicos.clear()
                mantenimiento.ayudantes.clear()

                for mecanico in mecanicos: mantenimiento.mecanicos.add(mecanico)
                for ayudante in ayudantes: mantenimiento.ayudantes.add(ayudante)

                mantenimiento.save()

                return JsonResponse({"message": "Mantenimiento agregado."}, status=201)

            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Trabajador.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            except ValueError as e:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "DELETE":
        if not request.user.is_superuser:
            return JsonResponse({"error": "No permission."}, status=417)
        
        if id != None:
            try:
                mantenimiento = Mantenimiento.objects.get(id=id).delete()
                return JsonResponse({"message": "Mantenimiento eliminado."}, status=201)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Mantenimiento.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "PATCH":
        data = json.loads(request.body)

        if id != None:
            try:
                mantenimiento = Mantenimiento.objects.get(id=id)

                if "culminado" in data.keys():
                    if mantenimiento.tipo_mantenimiento == 2 and datetime.date.today() < mantenimiento.fecha:
                        return JsonResponse({"error": "InvalidDate."}, status=417)
                    
                    if mantenimiento.fecha == None:
                        mantenimiento.fecha = datetime.date.today()
                    
                    mantenimiento.culminado = True
                    mantenimiento.culminado_nota = data.get("culminado_nota", "")

                elif "cancelado" in data.keys():
                    mantenimiento.cancelado = True

                mantenimiento.save()

                return JsonResponse({"message": "Mantenimiento modificado."}, status=201)
            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError as e:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)


@csrf_exempt
@login_required
def proyectos(request, id=None):
    if request.method == "GET":
        if id != None:
            try:
                proyecto = Proyecto.objects.get(id=id)
                return JsonResponse(proyecto.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Proyecto.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse([proyecto.serialize() for proyecto in Proyecto.objects.all()], safe=False)

    if request.method == "POST":
        data = json.loads(request.body)

        if id == None:
            maquinarias, choferes = [], []

            maquinarias_id = data.get("maquinarias_id", "")
            choferes_id = data.get("choferes_id", "")

            try:
                if maquinarias_id != "":
                    for maquinaria_id in maquinarias_id.split(","):
                        maquinaria = Maquinaria.objects.get(id=maquinaria_id)
                        maquinarias.append(maquinaria)

                if choferes_id != "":
                    for chofer_id in choferes_id.split(","):
                        chofer = Trabajador.objects.get(id=chofer_id)
                        choferes.append(chofer)

                proyecto = Proyecto.objects.create(nombre=data.get("nombre", ""), fecha_inicio=data.get("fecha_inicio", ""), fecha_finalizacion=data.get("fecha_finalizacion", ""),
                    lugar=data.get("lugar", ""), descripcion=data.get("descripcion", ""))

                for maquinaria in maquinarias: proyecto.maquinarias.add(maquinaria)
                for chofer in choferes: proyecto.choferes.add(chofer)

                proyecto.save()

                return JsonResponse({"message": "Proyecto agregado."}, status=201)

            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Trabajador.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            except Maquinaria.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            except ValueError as e:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "PUT":
        data = json.loads(request.body)

        if id != None:
            maquinarias, choferes = [], []

            maquinarias_id = data.get("maquinarias_id", "")
            choferes_id = data.get("choferes_id", "")

            try:
                if maquinarias_id != "":
                    for maquinaria_id in maquinarias_id.split(","):
                        maquinaria = Maquinaria.objects.get(id=maquinaria_id)
                        maquinarias.append(maquinaria)

                if choferes_id != "":
                    for chofer_id in choferes_id.split(","):
                        chofer = Trabajador.objects.get(id=chofer_id)
                        choferes.append(chofer)

                proyecto = Proyecto.objects.get(id=id)

                proyecto.nombre = data.get("nombre", "")
                proyecto.fecha_inicio = data.get("fecha_inicio", "")
                proyecto.fecha_finalizacion = data.get("fecha_finalizacion", "")
                proyecto.lugar = data.get("lugar", "")
                proyecto.descripcion = data.get("descripcion", "")

                proyecto.maquinarias.clear()
                proyecto.choferes.clear()

                for maquinaria in maquinarias: proyecto.maquinarias.add(maquinaria)
                for chofer in choferes: proyecto.choferes.add(chofer)

                proyecto.save()

                return JsonResponse({"message": "Proyecto modificado."}, status=201)

            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Trabajador.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            except Maquinaria.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            except ValueError as e:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "DELETE":
        if not request.user.is_superuser:
            return JsonResponse({"error": "No permission."}, status=417)
        
        if id != None:
            try:
                proyecto = Proyecto.objects.get(id=id).delete()
                return JsonResponse({"message": "Proyecto eliminado."}, status=201)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Proyecto.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    
    if request.method == "PATCH":
        data = json.loads(request.body)

        if id != None:
            try:
                proyecto = Proyecto.objects.get(id=id)

                if "culminado" in data.keys():
                    if datetime.date.today() < proyecto.fecha_finalizacion:
                        return JsonResponse({"error": "InvalidDate."}, status=417)
                    
                    proyecto.culminado = True
                    proyecto.culminado_nota = data.get("culminado_nota", "")

                elif "cancelado" in data.keys():
                    proyecto.cancelado = True

                proyecto.save()

                return JsonResponse({"message": "Proyecto modificado."}, status=201)
            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError as e:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    

@csrf_exempt
@login_required
def clientes(request, id=None):
    if request.method == "GET":
        if id != None:
            try:
                cliente = Cliente.objects.get(id=id)
                return JsonResponse(cliente.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Cliente.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse([cliente.serialize() for cliente in Cliente.objects.all()], safe=False)
    
    if request.method == "POST":
        data = json.loads(request.body)

        if id == None:
            try:
                cliente = Cliente.objects.create(**data)
                return JsonResponse({"message": "Cliente agregado."}, status=201)
            except IntegrityError as e:
                if "UNIQUE constraint failed: core_cliente.cedula" in e.args:
                    return JsonResponse({"error": "CedulaNotUnique."}, status=417)
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    
    if request.method == "PUT":
        data = json.loads(request.body)

        if id != None:
            if not Cliente.objects.filter(id=id).exists():
                return JsonResponse({"error": "DoesNotExist."}, status=417)

            try:
                data.pop("cedula", None)
                cliente = Cliente.objects.filter(id=id).update(**data)
                return JsonResponse({"message": "Cliente modificado."}, status=201)
            except IntegrityError as e:
                if "UNIQUE constraint failed: core_cliente.cedula" in e.args:
                    return JsonResponse({"error": "CedulaNotUnique."}, status=417)
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    
    if request.method == "DELETE":
        if not request.user.is_superuser:
            return JsonResponse({"error": "No permission."}, status=417)
        
        if id != None:
            try:
                cliente = Cliente.objects.get(id=id).delete()
                return JsonResponse({"message": "Cliente eliminado."}, status=201)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Cliente.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    

@csrf_exempt
@login_required
def alquileres(request, id=None):
    if request.method == "GET":
        if id != None:
            try:
                alquiler = Alquiler.objects.get(id=id)
                return JsonResponse(alquiler.serialize(), safe=False)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Alquiler.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse([alquiler.serialize() for alquiler in Alquiler.objects.all()], safe=False)
    
    if request.method == "POST":
        data = json.loads(request.body)

        if id == None:
            cliente_id = data.get("cliente_id", "")

            maquinarias, choferes = [], []

            maquinarias_id = data.get("maquinarias_id", "")
            choferes_id = data.get("choferes_id", "")

            try:
                if cliente_id != "":
                    cliente = Cliente.objects.get(id=cliente_id)

                if maquinarias_id != "":
                    for maquinaria_id in maquinarias_id.split(","):
                        maquinaria = Maquinaria.objects.get(id=maquinaria_id)
                        maquinarias.append(maquinaria)

                if choferes_id != "":
                    for chofer_id in choferes_id.split(","):
                        chofer = Trabajador.objects.get(id=chofer_id)
                        choferes.append(chofer)

                alquiler = Alquiler.objects.create(actividad=data.get("actividad", ""), fecha_salida=data.get("fecha_salida", ""), fecha_retorno=data.get("fecha_retorno", ""),
                    cliente=cliente, monto=data.get("monto", ""))

                for maquinaria in maquinarias: alquiler.maquinarias.add(maquinaria)
                for chofer in choferes: alquiler.choferes.add(chofer)

                alquiler.save()

                return JsonResponse({"message": "Alquiler agregado."}, status=201)

            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Cliente.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            except Maquinaria.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            except ValueError as e:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "PUT":
        data = json.loads(request.body)

        if id != None:
            cliente_id = data.get("cliente_id", "")

            maquinarias, choferes = [], []

            maquinarias_id = data.get("maquinarias_id", "")
            choferes_id = data.get("choferes_id", "")

            try:
                if cliente_id != "":
                    cliente = Cliente.objects.get(id=cliente_id)

                if maquinarias_id != "":
                    for maquinaria_id in maquinarias_id.split(","):
                        maquinaria = Maquinaria.objects.get(id=maquinaria_id)
                        maquinarias.append(maquinaria)

                if choferes_id != "":
                    for chofer_id in choferes_id.split(","):
                        chofer = Trabajador.objects.get(id=chofer_id)
                        choferes.append(chofer)

                alquiler = Alquiler.objects.get(id=id)

                alquiler.actividad = data.get("actividad", "")
                alquiler.fecha_salida = data.get("fecha_salida", "")
                alquiler.fecha_retorno = data.get("fecha_retorno", "")
                alquiler.cliente = cliente
                alquiler.monto = data.get("monto", "")

                alquiler.maquinarias.clear()
                alquiler.choferes.clear()

                for maquinaria in maquinarias: alquiler.maquinarias.add(maquinaria)
                for chofer in choferes: alquiler.choferes.add(chofer)

                alquiler.save()

                return JsonResponse({"message": "Alquiler modificado."}, status=201)

            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Trabajador.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            except Maquinaria.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)
            except ValueError as e:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "DELETE":
        if not request.user.is_superuser:
            return JsonResponse({"error": "No permission."}, status=417)
        
        if id != None:
            try:
                alquiler = Alquiler.objects.get(id=id).delete()
                return JsonResponse({"message": "Alquiler eliminado."}, status=201)
            except IntegrityError:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except Alquiler.DoesNotExist:
                return JsonResponse({"error": "DoesNotExist."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)

    if request.method == "PATCH":
        data = json.loads(request.body)

        if id != None:
            try:
                alquiler = Alquiler.objects.get(id=id)

                if "culminado" in data.keys():
                    if datetime.datetime.now() < alquiler.fecha_retorno:
                        return JsonResponse({"error": "InvalidDate."}, status=417)
                    
                    alquiler.culminado = True
                    alquiler.culminado_nota = data.get("culminado_nota", "")

                elif "cancelado" in data.keys():
                    alquiler.cancelado = True

                alquiler.save()

                return JsonResponse({"message": "Alquiler modificado."}, status=201)
            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError as e:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)
    

@csrf_exempt
def user_exists(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request requerido."}, status=400)

    data = json.loads(request.body)
    username = data.get("username", "")

    if User.objects.filter(username=username).exists() == False:
        return JsonResponse({"user_exists": False}, safe=False)

    user = User.objects.get(username=username)
    return JsonResponse({"user_exists": True, "is_available_to_reset_password": user.is_available_to_reset_password(), "pregunta_seguridad": user.pregunta_seguridad}, safe=False)


@csrf_exempt
def check_pregunta_seguridad(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request requerido."}, status=400)

    data = json.loads(request.body)
    username = data.get("username", "")
    respuesta = data.get("respuesta", "")

    if User.objects.filter(username=username).exists() == False:
        return JsonResponse({"check_respuesta": False}, safe=False)

    user = User.objects.get(username=username)
    return JsonResponse({"check_respuesta": user.respuesta_seguridad == respuesta}, safe=False)


@csrf_exempt
def user_reset_password(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request requerido."}, status=400)

    data = json.loads(request.body)
    username = data.get("username", "")
    new_password = data.get("new_password", "")

    if User.objects.filter(username=username).exists() == False:
        return JsonResponse({"error": "DoesNotExist."}, safe=False)
        
    user = User.objects.get(username=username)

    if user.is_available_to_reset_password() == False:
        return JsonResponse({"error": "NotAvailableToResetPassword."}, safe=False)

    user.set_password(new_password)
    user.save()

    return JsonResponse({"msg": "Contraseña actualizada"}, safe=False)


@csrf_exempt
@login_required
def perfil(request, id=None):
    if request.method == "POST":
        if id != None:
            try:
                usuario = User.objects.get(id=id)

                if request.POST['update_profile_img']:
                    if not request.FILES:
                        return JsonResponse({"error": "NoImage."}, status=417)
                    
                    usuario = User.objects.get(id=id)
                    usuario.img = request.FILES['user-img']

                usuario.save()

                return JsonResponse({"message": "Usuario modificado."}, status=201)
            except IntegrityError as e:
                return JsonResponse({"error": "IntegrityError."}, status=417)
            except ValueError as e:
                return JsonResponse({"error": "ValueError."}, status=417)

        return JsonResponse({"error": "Error."}, status=417)