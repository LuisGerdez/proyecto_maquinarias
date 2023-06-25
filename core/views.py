from django.db import IntegrityError
from django.conf import settings
from django.contrib.auth.models import User
from django.core.management import call_command
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from django.contrib.auth import authenticate, login, logout

from .models import *

from .utils import get_alertas


def index(request):
	return render(request, "core/index.html", {
		"alertas": get_alertas()
	})

def error_no_permission(request):
    return render(request, "core/error_no_permission.html")


def maquinarias(request):
	if not request.user.is_authenticated:
		return HttpResponseRedirect(reverse("index"))
	return render(request, "core/maquinarias.html", {
		"alertas": get_alertas()
	})


def trabajadores(request):
	if not request.user.is_authenticated:
		return HttpResponseRedirect(reverse("index"))
	return render(request, "core/trabajadores.html", {
		"alertas": get_alertas()
	})


def mantenimientos(request):
	if not request.user.is_authenticated:
		return HttpResponseRedirect(reverse("index"))
	return render(request, "core/mantenimientos.html", {
		"alertas": get_alertas()
	})


def proyectos(request):
	if not request.user.is_authenticated:
		return HttpResponseRedirect(reverse("index"))
	return render(request, "core/proyectos.html", {
		"alertas": get_alertas()
	})


def clientes(request):
	if not request.user.is_authenticated:
		return HttpResponseRedirect(reverse("index"))
	return render(request, "core/clientes.html", {
		"alertas": get_alertas()
	})


def alquileres(request):
	if not request.user.is_authenticated:
		return HttpResponseRedirect(reverse("index"))
	return render(request, "core/alquileres.html", {
		"alertas": get_alertas()
	})


def perfil(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            if "modificar_usuario" in request.POST:
                user_modificar = request.user

                password = request.POST["password"]
                
                newpassword = request.POST["newpassword"]
                renewpassword = request.POST["renewpassword"]

                if password != "":
                    if not user_modificar.check_password(password):
                        return render(request, "core/perfil.html", {
                            "msg": "La contraseña actual es incorrecta!", "alert_type": "alert-warning"
                        })

                    if newpassword == renewpassword:
                        user_modificar.set_password(newpassword)
                        user_modificar.save()

                        return render(request, "core/perfil.html", {
                            "msg": "Contraseña actualizada con éxito, por favor inicia sesión nuevamente!", "alert_type": "alert-success"
                        })
                    else:
                        return render(request, "core/perfil.html", {
                            "msg": "Las contraseñas no coinciden!", "alert_type": "alert-info"
                        })
                    
            if "pregunta_guardar" in request.POST:
                user_modificar = request.user

                pregunta = request.POST["pregunta"]
                respuesta = request.POST["respuesta"]

                user_modificar.pregunta_seguridad = pregunta
                user_modificar.respuesta_seguridad = respuesta
                user_modificar.save()

                return render(request, "core/perfil.html", {
                    "msg": "Pregunta y respuesta de seguridad establecidas correctamente!", "alert_type": "alert-success"
                })

        return render(request, "core/perfil.html")
    else:
        return HttpResponseRedirect(reverse("index"))


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
	
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "core/login.html", {
                "message": "Nombre de usuario o contraseña invalido."
            })
    else:
        return render(request, "core/login.html")
    

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.user.is_superuser:
        if request.method == "POST":
            cedula = request.POST["cedula"]
            
            first_name = request.POST["nombres"].split(" ")[0]
            middle_name = request.POST["nombres"].split(" ")[1] if (len(request.POST["nombres"].split(" ")) > 1) else ""
            
            last_name = request.POST["apellidos"].split(" ")[0]
            second_name = request.POST["apellidos"].split(" ")[1] if (len(request.POST["apellidos"].split(" ")) > 1) else ""

            username = request.POST["username"]
            email = request.POST["email"]
            num_tlf = request.POST["num_tlf"]

            if User.objects.filter(username=username).exists():
                return render(request, "core/register.html", {
                    "msg": "Este nombre de usuario ya está registrado en el sistema!", "alert_type": "alert-info"
                })

            password = request.POST["password"]
            confirmation = request.POST["confirmation"]
            if password != confirmation:
                return render(request, "core/register.html", {
                    "msg": "Las contraseñas no coinciden!", "alert_type": "alert-info"
                })

            if request.POST["tipo_usuario"] == "1":
                try:
                    User.objects.create_user(username, email, password, cedula=cedula, first_name=first_name, middle_name=middle_name, last_name=last_name,
                        last_name_2=second_name, num_tlf=num_tlf)
                except IntegrityError:
                    return render(request, "core/register.html", {
                        "msg": "Ha ocurrido un error al registrar al usuario!", "alert_type": "alert-danger"
                    })

            elif request.POST["tipo_usuario"] == "2":
                try:
                    User.objects.create_superuser(username, email, password, cedula=cedula, first_name=first_name, middle_name=middle_name, last_name=last_name,
                        last_name_2=second_name, num_tlf=num_tlf)
                except IntegrityError:
                    return render(request, "core/register.html", {
                        "msg": "Ha ocurrido un error al registrar al usuario!", "alert_type": "alert-danger"
                    })

            return render(request, "core/register.html", {
                "msg": "Usuario registrado con éxito!", "alert_type": "alert-success"
            })
        else:
            return render(request, "core/register.html")
    else:
        return HttpResponseRedirect(reverse("error_no_permission"))
    

def modificar_usuarios(request):
    if request.user.is_superuser:
        query = False

        if request.method == "GET":
            if "username" in request.GET:
                query = True

                username = request.GET["username"]

                if not User.objects.filter(username=username).exists():
                    return render(request, "core/modificar_usuarios.html", {
                        "query": False, "users": User.objects.all(),
                        "msg": "Usuario no registrado!", "alert_type": "alert-info"
                    })

                user_modificar = User.objects.get(username=username)

                return render(request, "core/modificar_usuarios.html", {
                    "query": query, "users": User.objects.filter(is_superuser=False), "user_modificar": user_modificar
                })

        if request.method == "POST":
            if "modificar_usuario" in request.POST:
                username = request.POST["username"]

                if not User.objects.filter(username=username).exists():
                    return render(request, "core/modificar_usuarios.html", {
                        "query": False, "users": User.objects.all(),
                        "msg": "Usuario no registrado!", "alert_type": "alert-info"
                    })

                user_modificar = User.objects.get(username=username)
                
                user_modificar.first_name = request.POST["nombres"].split(" ")[0]
                user_modificar.middle_name = request.POST["nombres"].split(" ")[1] if (len(request.POST["nombres"].split(" ")) > 1) else ""
                
                user_modificar.last_name = request.POST["apellidos"].split(" ")[0]
                user_modificar.last_name_2 = request.POST["apellidos"].split(" ")[1] if (len(request.POST["apellidos"].split(" ")) > 1) else ""

                user_modificar.email = request.POST["email"]
                user_modificar.num_tlf = request.POST["num_tlf"]

                password = request.POST["password"]
                confirm_password = request.POST["confirmation"]
                if password != "":
                    if password == confirm_password:
                        user_modificar.set_password(password)
                    else:
                        return render(request, "core/modificar_usuarios.html", {
                            "query": True, "users": User.objects.all(), "user_modificar": user_modificar,
                            "msg": "Las contraseñas no coinciden!", "alert_type": "alert-info"
                        })

                if request.POST["tipo_usuario"] == "1":
                    user_modificar.is_superuser = False
                elif request.POST["tipo_usuario"] == "2":
                    user_modificar.is_superuser = True

                user_modificar.save()

                return render(request, "core/modificar_usuarios.html", {
                    "query": query, "users": User.objects.all(),
                    "msg": "Usuario modifcado con éxito!", "alert_type": "alert-success"
                })

            if "eliminar_usuario" in request.POST:
                username = request.POST["username"]

                if not User.objects.filter(username=username).exists():
                    return render(request, "core/modificar_usuarios.html", {
                        "query": False, "users": User.objects.all(),
                        "msg": "Usuario no registrado!", "alert_type": "alert-info"
                    })

                user_modificar = User.objects.get(username=username)

                if request.user == user_modificar:
                    logout(request)
                    user_modificar.delete()

                    return HttpResponseRedirect(reverse("index"))

                user_modificar.delete()

                return render(request, "core/modificar_usuarios.html", {
                    "query": query, "users": User.objects.all(),
                    "msg": "Usuario eliminado con éxito!", "alert_type": "alert-success"
                })
        
        return render(request, "core/modificar_usuarios.html", {
            "query": query, "users": User.objects.filter(is_superuser=False)
        })

    else:
        return HttpResponseRedirect(reverse("error_no_permission"))
    

def respaldo(request):
    if not request.user.is_superuser:
        return HttpResponseRedirect(reverse("error_no_permission"))
    
    # backup_import
    if request.method == 'POST' and request.FILES['import_file']:
        import_file = request.FILES['import_file']
        fs = FileSystemStorage()
        filename = fs.save("backup_loaddata_last.json", import_file)
        uploaded_file_url = fs.url(filename)

        path = settings.BASE_DIR + uploaded_file_url

        try:
            call_command('loaddata', path, app_label='core')
            return render(request, "core/respaldo.html", {
                "msg": "Se han importado los datos correctamente!", "alert_type": "alert-success"
            })
        except:
            return render(request, "core/respaldo.html", {
                "msg": "Ha ocurrido un error al importar los datos, por favor verifique el archivo cargado!", "alert_type": "alert-warning"
            })
        
    return render(request, "core/respaldo.html", {
		"alertas": get_alertas()
	})


def backup_export(request):
    if not request.user.is_superuser:
        return HttpResponseRedirect(reverse("error_no_permission"))

    path = settings.BASE_DIR + "\\media\\backup_dumpdata_last.json"

    with open(path, "w", encoding="utf-8") as fp:
        call_command("dumpdata", format="json", indent=2, stdout=fp)

    json_file = open(path, 'rb')
    response = HttpResponse(content=json_file)
    response['Content-Type'] = 'application/json'
    response['Content-Disposition'] = f'attachment; filename="SGMPT-BACKUP-{datetime.datetime.now()}.json"'
    return response