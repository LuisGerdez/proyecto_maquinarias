document.addEventListener('DOMContentLoaded', function() {
	if(window.location.pathname.split('/')[1] === 'maquinarias') {
		// Agregar maquinaria
		$('#form_maquinaria_agregar').submit(function(e) {
			var form_agregar_data = $('#form_maquinaria_agregar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});

			fetch('/api/maquinarias/', {
		    	method: 'POST',
		    	body: JSON.stringify(form_agregar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Maquinaria registrada con éxito');
		    		$('#agregarMaquinariaModal').modal('hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('maquinarias');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#agregarMaquinariaModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para registrar maquinarias');
		    	} else if(result.error == 'PlacaNotUnique.') {
		    		toastr.warning('Ya existe maquinaria registrada con esta placa');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else {
		    		toastr.error('Ha ocurrido un error al registrar la maquinaria');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.error('Ha ocurrido un error al registrar la maquinaria');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Modificar maquinaria
		$('#form_maquinaria_modificar').submit(function(e) {
			maquinarias_selected_id = document.querySelector('#maquinarias_selected_id').value;
			var form_modificar_data = $('#form_maquinaria_modificar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});

			fetch('/api/maquinarias/' + maquinarias_selected_id, {
		    	method: 'PUT',
		    	body: JSON.stringify(form_modificar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Maquinaria modificada con éxito');
		    		$('#modificarMaquinariaModal').modal('hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('maquinarias');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#modificarMaquinariaModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para modificar información de maquinarias');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#modificarMaquinariaModal').modal('hide');
		    		toastr.warning('Esta maquinaria no está registrada');
		    	} else if(result.error == 'PlacaNotUnique.') {
		    		toastr.warning('Ya existe maquinaria registrada con esta placa');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else {
		    		toastr.warning('Ha ocurrido un error al modificar la información de la maquinaria!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al modificar la información de la maquinaria!');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Eliminar maquinaria
		$('#btn_maquinaria_eliminar').on('click', function() {
			maquinarias_selected_id = document.querySelector('#maquinarias_selected_id').value;

			fetch('/api/maquinarias/' + maquinarias_selected_id, {
		    	method: 'DELETE',
		    	body: JSON.stringify({})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		$('#eliminarMaquinariaModal').modal('hide');
		    		toastr.success('Maquinaria eliminada correctamente');

		    		setTimeout(() => {
						fill_table('maquinarias');
					}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#eliminarMaquinariaModal').modal('hide');
		    		toastr.warning('Esta maquinaria no está registrado');
		    	}
		    	else if(result.error == 'No permission.') {
		    		$('#eliminarMaquinariaModal').modal('hide');
		    		toastr.info('Tu cuenta no tiene permisos para eliminar maquinarias');
		    	} else {
		    		toastr.error('Ha ocurrido un error al eliminar maquinaria');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.error('Ha ocurrido un error al eliminar maquinaria');
		    	console.log('Error: ' + error);
		    });
		});

		// Deshabilitar maquinaria
		$('#btn_maquinaria_deshabilitar').on('click', function() {
			maquinarias_selected_id = document.querySelector('#maquinarias_selected_id').value;

			fetch('/api/maquinarias/' + maquinarias_selected_id, {
		    	method: 'PATCH',
		    	body: JSON.stringify({toggle: true})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Maquinaria deshabilitada con éxito');
		    		$('#deshabilitarMaquinariaModal').modal('hide');

		    		setTimeout(() => {
		    			fill_table('maquinarias');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#deshabilitarMaquinariaModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para deshabilitar maquinarias');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#deshabilitarMaquinariaModal').modal('hide');
		    		toastr.warning('Esta maquinaria no está registrado');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else if(result.error == 'InvalidToggle.') {
		    		toastr.info('No puedes deshabilitar una maquinaria involucrada en mantenimientos, proyectos o alquileres sin culminar');
		    	}  else {
		    		toastr.warning('Ha ocurrido un error al deshabilitar maquinaria!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al deshabilitar maquinaria!');
		    	console.log('Error: ' + error);
		    });
		});

		// Habilitar maquinaria
		$('#btn_maquinaria_habilitar').on('click', function() {
			maquinarias_selected_id = document.querySelector('#maquinarias_selected_id').value;

			fetch('/api/maquinarias/' + maquinarias_selected_id, {
		    	method: 'PATCH',
		    	body: JSON.stringify({toggle: true})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Maquinaria habilitada con éxito');
		    		$('#habilitarMaquinariaModal').modal('hide');

		    		setTimeout(() => {
		    			fill_table('maquinarias');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#habilitarMaquinariaModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para habilitar maquinarias');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#habilitarMaquinariaModal').modal('hide');
		    		toastr.warning('Esta maquinaria no está registrado');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else if(result.error == 'InvalidToggle.') {
		    		toastr.info('No puedes deshabilitar una maquinaria involucrada en mantenimientos, proyectos o alquileres sin culminar');
		    	} else {
		    		toastr.warning('Ha ocurrido un error al habilitar maquinaria!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al habilitar maquinaria!');
		    	console.log('Error: ' + error);
		    });
		});

		// Reporte maquinaria
		$('#btn_maquinaria_reporte_all').on('click', function() {
			$('#reporteMaquinariaModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/maquinarias';
			window.open(url, '_blank');
		});

		$('#btn_maquinaria_reporte_all_2').on('click', function() {
			$('#reporteMaquinariaAllModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/maquinarias';
			window.open(url, '_blank');
		});

		$('#btn_maquinaria_reporte_single').on('click', function() {
			$('#reporteMaquinariaModal').modal('hide');

			maquinarias_selected_id = document.querySelector('#maquinarias_selected_id').value;

			if(maquinarias_selected_id) {
				var url = 'http://' + location.host + '/pdf/maquinarias/' + maquinarias_selected_id;
				window.open(url, '_blank');
			} else {
				toastr.info('No hay maquinaria seleccionada');
			}
			
		});

		fill_table('maquinarias');
	}

	if(window.location.pathname.split('/')[1] === 'trabajadores') {
		// Agregar trabajador
		$('#form_trabajador_agregar').submit(function(e) {
			var form_agregar_data = $('#form_trabajador_agregar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});

			fetch('/api/trabajadores/', {
		    	method: 'POST',
		    	body: JSON.stringify(form_agregar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Trabajador registrado con éxito');
		    		$('#agregarTrabajadorModal').modal('hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('trabajadores');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#agregarTrabajadorModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para registrar trabajadores');
		    	} else if(result.error == 'CedulaNotUnique.') {
		    		toastr.warning('Ya existe trabajador registrado con esta cédula de identidad');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else {
		    		toastr.error('Ha ocurrido un error al registrar el trabajador');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.error('Ha ocurrido un error al registrar el trabajador');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Modificar trabajador
		$('#form_trabajador_modificar').submit(function(e) {
			trabajadores_selected_id = document.querySelector('#trabajadores_selected_id').value;
			var form_modificar_data = $('#form_trabajador_modificar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});

			fetch('/api/trabajadores/' + trabajadores_selected_id, {
		    	method: 'PUT',
		    	body: JSON.stringify(form_modificar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Trabajador modificado con éxito');
		    		$('#modificarTrabajadorModal').modal('hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('trabajadores');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#modificarTrabajadorModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para modificar información de trabajadores');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#modificarTrabajadorModal').modal('hide');
		    		toastr.warning('Trabajador no está registrada');
		    	} else if(result.error == 'CedulaNotUnique.') {
		    		toastr.warning('Ya existe trabajador registrado con esta cédula de identidad');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else {
		    		toastr.warning('Ha ocurrido un error al modificar la información del trabajador!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al modificar la información del trabajador!');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Eliminar trabajador
		$('#btn_trabajador_eliminar').on('click', function() {
			trabajadores_selected_id = document.querySelector('#trabajadores_selected_id').value;

			fetch('/api/trabajadores/' + trabajadores_selected_id, {
		    	method: 'DELETE',
		    	body: JSON.stringify({})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		$('#eliminarTrabajadorModal').modal('hide');
		    		toastr.success('Trabajador eliminado correctamente');

		    		setTimeout(() => {
						fill_table('trabajadores');
					}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#eliminarTrabajadorModal').modal('hide');
		    		toastr.warning('Trabajador no está registrado');
		    	}
		    	else if(result.error == 'No permission.') {
		    		$('#eliminarTrabajadorModal').modal('hide');
		    		toastr.info('Tu cuenta no tiene permisos para eliminar trabajadores');
		    	} else {
		    		toastr.error('Ha ocurrido un error al eliminar trabajador');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.error('Ha ocurrido un error al eliminar trabajador');
		    	console.log('Error: ' + error);
		    });
		});

		// Deshabilitar trabajador
		$('#btn_trabajador_deshabilitar').on('click', function() {
			trabajadores_selected_id = document.querySelector('#trabajadores_selected_id').value;

			fetch('/api/trabajadores/' + trabajadores_selected_id, {
		    	method: 'PATCH',
		    	body: JSON.stringify({toggle: true})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Trabajador deshabilitado con éxito');
		    		$('#deshabilitarTrabajadorModal').modal('hide');

		    		setTimeout(() => {
		    			fill_table('trabajadores');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#deshabilitarTrabajadorModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para deshabilitar trabajadores');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#deshabilitarTrabajadorModal').modal('hide');
		    		toastr.warning('Este trabajador no está registrado');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else if(result.error == 'InvalidToggle.') {
		    		toastr.info('No puedes deshabilitar un trabajador involucrada en mantenimientos, proyectos o alquileres sin culminar');
		    	}  else {
		    		toastr.warning('Ha ocurrido un error al deshabilitar trabajador!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al deshabilitar trabajador!');
		    	console.log('Error: ' + error);
		    });
		});

		// Habilitar trabajador
		$('#btn_trabajador_habilitar').on('click', function() {
			trabajadores_selected_id = document.querySelector('#trabajadores_selected_id').value;

			fetch('/api/trabajadores/' + trabajadores_selected_id, {
		    	method: 'PATCH',
		    	body: JSON.stringify({toggle: true})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Trabajador habilitado con éxito');
		    		$('#habilitarTrabajadorModal').modal('hide');

		    		setTimeout(() => {
		    			fill_table('trabajadores');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#habilitarTrabajadorModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para habilitar trabajadores');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#habilitarTrabajadorModal').modal('hide');
		    		toastr.warning('Este trabajador no está registrado');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else if(result.error == 'InvalidToggle.') {
		    		toastr.info('No puedes deshabilitar un trabajador involucrada en mantenimientos, proyectos o alquileres sin culminar');
		    	} else {
		    		toastr.warning('Ha ocurrido un error al habilitar trabajador!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al habilitar trabajador!');
		    	console.log('Error: ' + error);
		    });
		});

		// Reporte trabajador
		$('#btn_trabajador_reporte_all').on('click', function() {
			$('#reporteTrabajadorModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/trabajadores';
			window.open(url, '_blank');
		});

		$('#btn_trabajador_reporte_all_2').on('click', function() {
			$('#reporteTrabajadorAllModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/trabajadores';
			window.open(url, '_blank');
		});

		$('#btn_trabajador_reporte_single').on('click', function() {
			$('#reporteTrabajadorModal').modal('hide');

			trabajadores_selected_id = document.querySelector('#trabajadores_selected_id').value;

			if(trabajadores_selected_id) {
				var url = 'http://' + location.host + '/pdf/trabajadores/' + trabajadores_selected_id;
				window.open(url, '_blank');
			} else {
				toastr.info('No hay trabajador seleccionado');
			}
			
		});

		fill_table('trabajadores');
	}

	if(window.location.pathname.split('/')[1] === 'mantenimientos') {
		const select_mantenimiento_agregar_maquinaria = document.querySelector('#mantenimiento_agregar_maquinaria');
		const select_mantenimiento_agregar_supervisor = document.querySelector('#mantenimiento_agregar_supervisor');
		const select_mantenimiento_agregar_mecanicos = document.querySelector('#mantenimiento_agregar_mecanicos');
		const select_mantenimiento_agregar_ayudantes = document.querySelector('#mantenimiento_agregar_ayudantes');

		const select_mantenimiento_modificar_supervisor = document.querySelector('#mantenimiento_modificar_supervisor');
		const select_mantenimiento_modificar_mecanicos = document.querySelector('#mantenimiento_modificar_mecanicos');
		const select_mantenimiento_modificar_ayudantes = document.querySelector('#mantenimiento_modificar_ayudantes');

		// Agregar modal step 1 back
		$('#btn_mantenimiento_agregar_step_1_back').on('click', function() {
			$('#agregarMantenimientoModal_Step_2').modal('hide');
			$('#agregarMantenimientoModal_Step_3').modal('hide');
			$('#agregarMantenimientoModal_Step_4').modal('hide');
			$('#agregarMantenimientoModal_Step_1').modal('show');
		});

		// Agregar modal step 2
		$('#btn_mantenimiento_agregar_step_2').on('click', function() {
			if($('#mantenimiento_agregar_tipo').val() == '') {
				toastr.info('Por favor ingrese tipo de mantenimiento');
			} else if($('#mantenimiento_agregar_fecha').val() == '') {
				toastr.info('Por favor ingrese fecha del mantenimiento');
			} else if($('#mantenimiento_agregar_actividad').val() == '') {
				toastr.info('Por favor ingrese actividad del mantenimiento');
			} else {
				fecha = $('#mantenimiento_agregar_fecha').val();

				$(select_mantenimiento_agregar_maquinaria).selectpicker('destroy').empty().append('<option value="" selected>Seleccionar maquinaria</option>');
				fetch('/api/maquinarias')
				.then(response => response.json())
				.then(data => {
					data.forEach(maquinaria => {
						var opt = document.createElement('option');
						opt.value = maquinaria.id;
						opt.innerHTML = maquinaria.placa + ' ' + maquinaria.marca;
						select_mantenimiento_agregar_maquinaria.appendChild(opt);
					});
				})
				.catch(function(error) {console.log('Error buscar maquinarias: ' + error);});
				setTimeout(() => {$(select_mantenimiento_agregar_maquinaria).selectpicker();}, 1000);

				setTimeout(() => {
					$('#agregarMantenimientoModal_Step_1').modal('hide');
					$('#agregarMantenimientoModal_Step_3').modal('hide');
					$('#agregarMantenimientoModal_Step_4').modal('hide');
					$('#agregarMantenimientoModal_Step_2').modal('show');
				}, 1000);
			}
		});

		// Agregar modal step 2 back
		$('#btn_mantenimiento_agregar_step_2_back').on('click', function() {
			$('#agregarMantenimientoModal_Step_1').modal('hide');
			$('#agregarMantenimientoModal_Step_3').modal('hide');
			$('#agregarMantenimientoModal_Step_4').modal('hide');
			$('#agregarMantenimientoModal_Step_2').modal('show');
		});

		// Agregar modal step 3
		$('#btn_mantenimiento_agregar_step_3').on('click', function() {
			if($(select_mantenimiento_agregar_maquinaria).val() != '') {
				// Supervisor
				$(select_mantenimiento_agregar_supervisor).selectpicker('destroy').empty().append('<option value="" selected>Seleccionar supervisor</option>');
				fetch('/api/trabajadores/?cargo=4')
				.then(response => response.json())
				.then(data => {
					data.forEach(supervisor => {
						var opt = document.createElement('option');
						opt.value = supervisor.id;
						opt.innerHTML = supervisor.fullname;
						select_mantenimiento_agregar_supervisor.appendChild(opt);
					});
				})
				.catch(function(error) {console.log('Error buscar supervisores: ' + error);});
				setTimeout(() => {$(select_mantenimiento_agregar_supervisor).selectpicker();}, 1000);

				// Mecanicos
				$(select_mantenimiento_agregar_mecanicos).selectpicker('destroy').empty();
				fetch('/api/trabajadores/?cargo=2')
				.then(response => response.json())
				.then(data => {
					data.forEach(mecanico => {
						var opt = document.createElement('option');
						opt.value = mecanico.id;
						opt.innerHTML = mecanico.fullname;
						select_mantenimiento_agregar_mecanicos.appendChild(opt);
					});
				})
				.catch(function(error) {console.log('Error buscar mecánicos: ' + error);});
				setTimeout(() => {$(select_mantenimiento_agregar_mecanicos).selectpicker();}, 1000);

				// Ayudantes
				$(select_mantenimiento_agregar_ayudantes).selectpicker('destroy').empty();
				fetch('/api/trabajadores/?cargo=3')
				.then(response => response.json())
				.then(data => {
					data.forEach(ayudante => {
						var opt = document.createElement('option');
						opt.value = ayudante.id;
						opt.innerHTML = ayudante.fullname;
						select_mantenimiento_agregar_ayudantes.appendChild(opt);
					});
				})
				.catch(function(error) {console.log('Error buscar ayudantes: ' + error);});
				setTimeout(() => {$(select_mantenimiento_agregar_ayudantes).selectpicker();}, 1000);

				setTimeout(() => {
					$('#agregarMantenimientoModal_Step_1').modal('hide');
					$('#agregarMantenimientoModal_Step_2').modal('hide');
					$('#agregarMantenimientoModal_Step_4').modal('hide');
					$('#agregarMantenimientoModal_Step_3').modal('show');
				}, 1000);

			} else {
				toastr.info('Por favor seleccione maquinaria del mantenimiento');
			}
		});

		// Agregar modal step 3 back
		$('#btn_mantenimiento_agregar_step_3_back').on('click', function() {
			$('#agregarMantenimientoModal_Step_1').modal('hide');
			$('#agregarMantenimientoModal_Step_4').modal('hide');
			$('#agregarMantenimientoModal_Step_2').modal('hide');
			$('#agregarMantenimientoModal_Step_3').modal('show');
		});

		// Agregar modal step 4
		$('#btn_mantenimiento_agregar_step_4').on('click', function() {
			if($(select_mantenimiento_agregar_supervisor).val() != '') {
				mecanicos_size = $(select_mantenimiento_agregar_mecanicos).val().length;

				if(mecanicos_size <= 0) {
					toastr.info('Por favor seleccione mecánicos del mantenimiento');
				} else {
					gastos_reset_table('mantenimiento_agregar_gastos');

					setTimeout(() => {
						$('#agregarMantenimientoModal_Step_1').modal('hide');
						$('#agregarMantenimientoModal_Step_2').modal('hide');
						$('#agregarMantenimientoModal_Step_3').modal('hide');
						$('#agregarMantenimientoModal_Step_4').modal('show');
					}, 1000);
				}	
			} else {
				toastr.info('Por favor seleccione supervisor del mantenimiento');
			}
		});

		// Agregar mantenimiento
		$('#btn_mantenimiento_agregar').on('click', function() {
			fetch('/api/mantenimientos/', {
				method: 'POST',
				body: JSON.stringify({
					tipo: $('#mantenimiento_agregar_tipo').val(),
					fecha: $('#mantenimiento_agregar_fecha').val(),
					actividad: $('#mantenimiento_agregar_actividad').val(),
					descripcion: $('#mantenimiento_agregar_descripcion').val(),
					herramientas: $('#mantenimiento_agregar_herramientas').val(),

					maquinaria_id: $('#mantenimiento_agregar_maquinaria').val(),
					supervisor_id: $('#mantenimiento_agregar_supervisor').val(),

					mecanicos_id: $('#mantenimiento_agregar_mecanicos').val().toString(),
					ayudantes_id: $('#mantenimiento_agregar_ayudantes').val().toString(),

					gastos: gastos_get_table_data('mantenimiento_agregar_gastos')
				})
			   })
			.then(response => response.json())
			.then(result => {
				if(!result.error) {
					toastr.success('Mantenimiento registrado con éxito');

					$('#agregarMantenimientoModal_Step_1').modal('hide');
					$('#agregarMantenimientoModal_Step_2').modal('hide');
					$('#agregarMantenimientoModal_Step_3').modal('hide');
					$('#agregarMantenimientoModal_Step_4').modal('hide');

					$('.input-agregar').each(function() {$(this).val('');}); // reset

					setTimeout(() => {
						fill_table('mantenimientos');
					}, 100);
				} else if(result.error == 'No permission.') {
					$('#agregarMantenimientoModal_Step_1').modal('hide');
					$('#agregarMantenimientoModal_Step_2').modal('hide');
					$('#agregarMantenimientoModal_Step_3').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para registrar mantenimientos');
				} else if(result.error == 'ValueError.') {
					toastr.warning('Ingrese todos los campos correctamente');
				} else {
					toastr.error('Ha ocurrido un error al registrar el mantenimiento');
				}
			})
			.catch(function(error) {
				toastr.error('Ha ocurrido un error al registrar el proyecto');
				console.log('Error: ' + error);
			});
		});

		// Modificar modal step 1 back
		$('#btn_mantenimiento_modificar_step_1_back').on('click', function() {
			$('#modificarMantenimientoModal_Step_2').modal('hide');
			$('#modificarMantenimientoModal_Step_3').modal('hide');
			$('#modificarMantenimientoModal_Step_1').modal('show');
		});

		// Modificar modal step 2
		$('#btn_mantenimiento_modificar_step_2').on('click', function() {
			if($('#mantenimiento_modificar_tipo').val() == '') {
				toastr.info('Por favor ingrese tipo de mantenimiento');
			} else if($('#mantenimiento_modificar_fecha').val() == '') {
				toastr.info('Por favor ingrese fecha del mantenimiento');
			} else if($('#mantenimiento_modificar_actividad').val() == '') {
				toastr.info('Por favor ingrese actividad del mantenimiento');
			} else if($('#mantenimiento_modificar_maquinaria_id').val() != '') {

				// Supervisor
				$(select_mantenimiento_modificar_supervisor).selectpicker('destroy').empty().append('<option value="" selected>Seleccionar supervisor</option>');
				fetch('/api/trabajadores/?cargo=4')
				.then(response => response.json())
				.then(data => {
					data.forEach(supervisor => {
						var opt = document.createElement('option');
						opt.value = supervisor.id;
						opt.innerHTML = supervisor.fullname;
						select_mantenimiento_modificar_supervisor.appendChild(opt);
					});
				})
				.catch(function(error) {console.log('Error buscar supervisores: ' + error);});
				setTimeout(() => {
					$(select_mantenimiento_modificar_supervisor).selectpicker();
					mantenimiento_supervisor_id = $('#mantenimiento_modificar_supervisor_id').val();
					$('#mantenimiento_modificar_supervisor').selectpicker('val', mantenimiento_supervisor_id);
				}, 1000);

				// Mecanicos
				$(select_mantenimiento_modificar_mecanicos).selectpicker('destroy').empty();
				fetch('/api/trabajadores/?cargo=2')
				.then(response => response.json())
				.then(data => {
					data.forEach(mecanico => {
						var opt = document.createElement('option');
						opt.value = mecanico.id;
						opt.innerHTML = mecanico.fullname;
						select_mantenimiento_modificar_mecanicos.appendChild(opt);
					});
				})
				.catch(function(error) {console.log('Error buscar mecánicos: ' + error);});
				setTimeout(() => {
					$(select_mantenimiento_modificar_mecanicos).selectpicker();
					mantenimiento_mecanicos_id = $('#mantenimiento_modificar_mecanicos_id').val().split(',');
					$('#mantenimiento_modificar_mecanicos').selectpicker('val', mantenimiento_mecanicos_id);
				}, 1000);

				// Ayudantes
				$(select_mantenimiento_modificar_ayudantes).selectpicker('destroy').empty();
				fetch('/api/trabajadores/?cargo=3')
				.then(response => response.json())
				.then(data => {
					data.forEach(ayudante => {
						var opt = document.createElement('option');
						opt.value = ayudante.id;
						opt.innerHTML = ayudante.fullname;
						select_mantenimiento_modificar_ayudantes.appendChild(opt);
					});
				})
				.catch(function(error) {console.log('Error buscar ayudantes: ' + error);});
				setTimeout(() => {
					$(select_mantenimiento_modificar_ayudantes).selectpicker();
					mantenimiento_ayudantes_id = $('#mantenimiento_modificar_ayudantes_id').val().split(',');
					$('#mantenimiento_modificar_ayudantes').selectpicker('val', mantenimiento_ayudantes_id);
				}, 1000);

				setTimeout(() => {
					$('#modificarMantenimientoModal_Step_1').modal('hide');
					$('#modificarMantenimientoModal_Step_3').modal('hide');
					$('#modificarMantenimientoModal_Step_2').modal('show');
				}, 1000);

			} else {
				toastr.warning('No hay maquinaria asignada a este mantenimiento');
				$('#modificarMantenimientoModal_Step_1').modal('hide');
				$('#modificarMantenimientoModal_Step_2').modal('hide');
				$('#modificarMantenimientoModal_Step_3').modal('hide');
			}
		});

		// Modificar modal step 2 back
		$('#btn_mantenimiento_modificar_step_2_back').on('click', function() {
			$('#modificarMantenimientoModal_Step_1').modal('hide');
			$('#modificarMantenimientoModal_Step_3').modal('hide');
			$('#modificarMantenimientoModal_Step_2').modal('show');
		});

		// Modificar modal step 3
		$('#btn_mantenimiento_modificar_step_3').on('click', function() {
			if($(select_mantenimiento_modificar_supervisor).val() != '') {
				mecanicos_size = $(select_mantenimiento_modificar_mecanicos).val().length;

				if(mecanicos_size <= 0) {
					toastr.info('Por favor seleccione mecánicos del mantenimiento');
				} else {
					gastos_load_table_data('mantenimiento_modificar_gastos', $('#mantenimiento_modificar_gastos_string').val());

					setTimeout(() => {
						$('#modificarMantenimientoModal_Step_1').modal('hide');
						$('#modificarMantenimientoModal_Step_2').modal('hide');
						$('#modificarMantenimientoModal_Step_3').modal('show');
					}, 1000);
				}	
			} else {
				toastr.info('Por favor seleccione supervisor del mantenimiento');
			}
		});

		// Modificar modal step 3 back
		$('#btn_mantenimiento_modificar_step_3_back').on('click', function() {
			$('#modificarMantenimientoModal_Step_1').modal('hide');
			$('#modificarMantenimientoModal_Step_2').modal('hide');
			$('#modificarMantenimientoModal_Step_3').modal('show');
		});

		// Modificar mantenimiento
		$('#btn_mantenimiento_modificar').on('click', function() {
			mantenimientos_selected_id = document.querySelector('#mantenimientos_selected_id').value;

			fetch('/api/mantenimientos/' + mantenimientos_selected_id, {
				method: 'PUT',
				body: JSON.stringify({
					tipo: $('#mantenimiento_modificar_tipo').val(),
					fecha: $('#mantenimiento_modificar_fecha').val(),
					actividad: $('#mantenimiento_modificar_actividad').val(),
					descripcion: $('#mantenimiento_modificar_descripcion').val(),
					herramientas: $('#mantenimiento_modificar_herramientas').val(),

					supervisor_id: $('#mantenimiento_modificar_supervisor').val(),
					mecanicos_id: $('#mantenimiento_modificar_mecanicos').val().toString(),
					ayudantes_id: $('#mantenimiento_modificar_ayudantes').val().toString(),

					gastos: gastos_get_table_data('mantenimiento_modificar_gastos')
				})
			})
			.then(response => response.json())
			.then(result => {
				if(!result.error) {
					toastr.success('Mantenimiento registrado con éxito');

					$('#modificarMantenimientoModal_Step_1').modal('hide');
					$('#modificarMantenimientoModal_Step_2').modal('hide');
					$('#modificarMantenimientoModal_Step_3').modal('hide');

					$('.input-modificar').each(function() {$(this).val('');}); // reset

					setTimeout(() => {
						fill_table('mantenimientos');
					}, 100);
				} else if(result.error == 'No permission.') {
					$('#modificarMantenimientoModal_Step_1').modal('hide');
					$('#modificarMantenimientoModal_Step_2').modal('hide');
					$('#modificarMantenimientoModal_Step_3').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para modificar mantenimientos');
				} else if(result.error == 'ValueError.') {
					toastr.warning('Ingrese todos los campos correctamente');
				} else {
					toastr.error('Ha ocurrido un error al modificar el mantenimiento');
				}
			})
			.catch(function(error) {
				toastr.error('Ha ocurrido un error al modificar el mantenimiento');
				console.log('Error: ' + error);
			});
		});

		// Establecer ejecucion mantenimiento
		$('#form_mantenimiento_establecer_ejecucion').submit(function(e) {
			var form_establecer_ejecucion_data = $('#form_mantenimiento_establecer_ejecucion').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});
			mantenimiento_establecer_ejecucion_id = document.querySelector('#mantenimiento_establecer_ejecucion_id').value;

			fetch('/api/mantenimientos/' + mantenimiento_establecer_ejecucion_id, {
		    	method: 'PATCH',
		    	body: JSON.stringify(form_establecer_ejecucion_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Fecha de ejecución establecida con éxito');
		    		$('#establecerMantenimientoEjecucionModal').modal('hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('mantenimientos');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#establecerMantenimientoEjecucionModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para establecer fecha de ejecución de mantenimientos');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#establecerMantenimientoEjecucionModal').modal('hide');
		    		toastr.warning('Este mantenimiento no está registrada');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else if(result.error == 'InvalidDate.') {
		    		toastr.info('La fecha de ejecución debe ser mayor a la fecha programada');
		    	} else {
		    		toastr.warning('Ha ocurrido un error al establecer la fecha de ejecución del mantenimiento!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al establecer la fecha de ejecución del mantenimiento!');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Establecer culminado mantenimiento
		$('#btn_mantenimiento_establecer_culminado').on('click', function() {
			mantenimiento_establecer_culminado_id = document.querySelector('#mantenimiento_establecer_culminado_id').value;
			mantenimiento_establecer_culminado_nota = document.querySelector('#mantenimiento_establecer_culminado_nota').value;

			fetch('/api/mantenimientos/' + mantenimiento_establecer_culminado_id, {
		    	method: 'PATCH',
		    	body: JSON.stringify({culminado: true, culminado_nota: mantenimiento_establecer_culminado_nota})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Mantenimiento establecido como culminado con éxito');
		    		$('#establecerMantenimientoCulminadoModal').modal('hide');
					document.querySelector('#mantenimiento_establecer_culminado_nota').value = '';

		    		setTimeout(() => {
		    			fill_table('mantenimientos');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#establecerMantenimientoCulminadoModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para establecer mantenimientos como culminados');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#establecerMantenimientoCulminadoModal').modal('hide');
		    		toastr.warning('Este mantenimiento no está registrada');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else if(result.error == 'InvalidDate.') {
		    		toastr.warning('El mantenimiento no puede ser culminado antes de la fecha programada');
		    	} else {
		    		toastr.warning('Ha ocurrido un error al establecer mantenimiento como culminado!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al establecer mantenimiento como culminado!');
		    	console.log('Error: ' + error);
		    });
		});

		// Eliminar mantenimiento
		$('#btn_mantenimiento_eliminar').on('click', function() {
			mantenimientos_selected_id = document.querySelector('#mantenimientos_selected_id').value;

			fetch('/api/mantenimientos/' + mantenimientos_selected_id, {
		    	method: 'DELETE',
		    	body: JSON.stringify({})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		$('#eliminarMantenimientoModal').modal('hide');
		    		toastr.success('Mantenimiento eliminado correctamente');

		    		setTimeout(() => {
						fill_table('mantenimientos');
					}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#eliminarMantenimientoModal').modal('hide');
		    		toastr.warning('Este mantenimiento no está registrado');
		    	}
		    	else if(result.error == 'No permission.') {
		    		$('#eliminarMantenimientoModal').modal('hide');
		    		toastr.info('Tu cuenta no tiene permisos para eliminar mantenimientos');
		    	} else {
		    		toastr.error('Ha ocurrido un error al eliminar el mantenimiento');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.error('Ha ocurrido un error al eliminar el mantenimiento');
		    	console.log('Error: ' + error);
		    });
		});

		// Cancelar mantenimiento
		$('#btn_mantenimiento_cancelar').on('click', function() {
			mantenimiento_cancelar_id = document.querySelector('#mantenimiento_cancelar_id').value;

			fetch('/api/mantenimientos/' + mantenimiento_cancelar_id, {
		    	method: 'PATCH',
		    	body: JSON.stringify({cancelado: true})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Mantenimiento cancelado con éxito');
		    		$('#cancelarMantenimientoModal').modal('hide');

		    		setTimeout(() => {
		    			fill_table('mantenimientos');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#cancelarMantenimientoModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para cancelar mantenimientos');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#cancelarMantenimientoModal').modal('hide');
		    		toastr.warning('Este mantenimiento no está registrado');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else if(result.error == 'InvalidDate.') {
		    		toastr.warning('El mantenimiento no puede ser culminado antes de la fecha de retorno');
		    	}  else {
		    		toastr.warning('Ha ocurrido un error al cancelar el mantenimiento!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al cancelar el mantenimiento!');
		    	console.log('Error: ' + error);
		    });
		});

		// Reporte mantenimiento
		$('#btn_mantenimiento_reporte_all').on('click', function() {
			$('#reporteMantenimientoModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/mantenimientos';
			window.open(url, '_blank');
		});

		$('#btn_mantenimiento_reporte_all_2').on('click', function() {
			$('#reporteMantenimientoAllModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/mantenimientos';
			window.open(url, '_blank');
		});

		$('#btn_mantenimiento_reporte_culminados_2, #btn_mantenimiento_reporte_culminados').on('click', function() {
			$('#reporteMantenimientoAllModal').modal('hide');
			$('#reporteMantenimientoModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/mantenimientos?culminados=true';
			window.open(url, '_blank');
		});

		$('#btn_mantenimiento_reporte_sinculminar_2, #btn_mantenimiento_reporte_sinculminar').on('click', function() {
			$('#reporteMantenimientoAllModal').modal('hide');
			$('#reporteMantenimientoModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/mantenimientos?sinculminar=true';
			window.open(url, '_blank');
		});

		$('#btn_mantenimiento_reporte_cancelados_2, #btn_mantenimiento_reporte_cancelados').on('click', function() {
			$('#reporteMantenimientoAllModal').modal('hide');
			$('#reporteMantenimientoModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/mantenimientos?cancelados=true';
			window.open(url, '_blank');
		});

		$('#btn_mantenimiento_reporte_correctivos_2, #btn_mantenimiento_reporte_correctivos').on('click', function() {
			$('#reporteMantenimientoAllModal').modal('hide');
			$('#reporteMantenimientoModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/mantenimientos?correctivos=true';
			window.open(url, '_blank');
		});

		$('#btn_mantenimiento_reporte_preventivos_2, #btn_mantenimiento_reporte_preventivos').on('click', function() {
			$('#reporteMantenimientoAllModal').modal('hide');
			$('#reporteMantenimientoModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/mantenimientos?preventivos=true';
			window.open(url, '_blank');
		});

		$('#btn_mantenimiento_reporte_single').on('click', function() {
			$('#reporteMantenimientoModal').modal('hide');

			mantenimientos_selected_id = document.querySelector('#mantenimientos_selected_id').value;

			if(mantenimientos_selected_id) {
				var url = 'http://' + location.host + '/pdf/mantenimientos/' + mantenimientos_selected_id;
				window.open(url, '_blank');
			} else {
				toastr.info('No hay mantenimiento seleccionado');
			}
			
		});

		fill_table('mantenimientos');
	}

	if(window.location.pathname.split('/')[1] === 'proyectos') {
		const select_proyecto_agregar_maquinarias = document.querySelector('#proyecto_agregar_maquinarias');
		const select_proyecto_agregar_choferes = document.querySelector('#proyecto_agregar_choferes');

		const select_proyecto_modificar_maquinarias = document.querySelector('#proyecto_modificar_maquinarias');
		const select_proyecto_modificar_choferes = document.querySelector('#proyecto_modificar_choferes');

		// Agregar modal step 1 back
		$('#btn_proyecto_agregar_step_1_back').on('click', function() {
			$('#agregarProyectoModal_Step_2').modal('hide');
			$('#agregarProyectoModal_Step_3').modal('hide');
			$('#agregarProyectoModal_Step_1').modal('show');
		});

		// Agregar modal step 2
		$('#btn_proyecto_agregar_step_2').on('click', function() {
			if($('#proyecto_agregar_nombre').val() == '') {
				toastr.info('Por favor ingrese nombre del proyecto');
			} else if($('#proyecto_agregar_descripcion').val() == '') {
				toastr.info('Por favor ingrese descripción del proyecto');
			} else if($('#proyecto_agregar_lugar').val() == '') {
				toastr.info('Por favor ingrese lugar del proyecto');
			} else if($('#proyecto_agregar_fecha_inicio').val() == '') {
				toastr.info('Por favor ingrese fecha de inicio del proyecto');
			} else if($('#proyecto_agregar_fecha_finalizacion').val() == '') {
				toastr.info('Por favor ingrese fecha de finalización del proyecto');
			} else {
				fecha_inicio = $('#proyecto_agregar_fecha_inicio').val();
				fecha_finalizacion = $('#proyecto_agregar_fecha_finalizacion').val();

				date_inicio = new Date(fecha_inicio);
				date_finalizacion = new Date(fecha_finalizacion);

				if(date_inicio <= date_finalizacion){
				    $(select_proyecto_agregar_maquinarias).selectpicker('destroy').empty();
				    fetch('/api/maquinarias/?fecha_inicio=' + fecha_inicio + '&fecha_fin=' + fecha_finalizacion)
				    .then(response => response.json())
				    .then(data => {
				    	data.forEach(maquinaria => {
				    		var opt = document.createElement('option');
				    	    opt.value = maquinaria.id;
				    	    opt.innerHTML = maquinaria.placa + ' ' + maquinaria.marca;
				    	    select_proyecto_agregar_maquinarias.appendChild(opt);
				        });
				    })
				    .catch(function(error) {console.log('Error buscar maquinarias: ' + error);});
				    setTimeout(() => {$(select_proyecto_agregar_maquinarias).selectpicker();}, 1000);

				    setTimeout(() => {
				    	$('#agregarProyectoModal_Step_1').modal('hide');
				    	$('#agregarProyectoModal_Step_3').modal('hide');
				    	$('#agregarProyectoModal_Step_2').modal('show');
				    }, 1000);
				} else {
					toastr.info('La fecha de finalización debe ser mayor a la fecha de inicio');
				}
			}
		});

		// Agregar modal step 2 back
		$('#btn_proyecto_agregar_step_2_back').on('click', function() {
			$('#agregarProyectoModal_Step_1').modal('hide');
			$('#agregarProyectoModal_Step_3').modal('hide');
			$('#agregarProyectoModal_Step_2').modal('show');
		});

		// Agregar modal step 3
		$('#btn_proyecto_agregar_step_3').on('click', function() {
			if($(select_proyecto_agregar_maquinarias).val().length > 0) {
				$(select_proyecto_agregar_choferes).selectpicker('destroy').empty();
				fetch('/api/trabajadores/?cargo=1' + '&fecha_inicio=' + fecha_inicio + '&fecha_fin=' + fecha_finalizacion)
				.then(response => response.json())
				.then(data => {
					data.forEach(chofer => {
						var opt = document.createElement('option');
					    opt.value = chofer.id;
					    opt.innerHTML = chofer.fullname;
					    select_proyecto_agregar_choferes.appendChild(opt);
				    });
				})
				.catch(function(error) {console.log('Error buscar choferes: ' + error);});
				setTimeout(() => {$(select_proyecto_agregar_choferes).selectpicker();}, 1000);

				setTimeout(() => {
					$('#agregarProyectoModal_Step_1').modal('hide');
					$('#agregarProyectoModal_Step_2').modal('hide');
					$('#agregarProyectoModal_Step_3').modal('show');
				}, 1000);
			} else {
				toastr.info('Por favor seleccione maquinarias del proyecto');
			}
		});

		// Agregar proyecto
		$('#btn_proyecto_agregar').on('click', function() {
			maquinarias_size = $(select_proyecto_agregar_maquinarias).val().length;
			choferes_size = $(select_proyecto_agregar_choferes).val().length;

			if(choferes_size <= 0) {
				toastr.info('Por favor seleccione chóferes del proyecto');
			} else if(choferes_size != maquinarias_size) {
				toastr.info('Por favor seleccione un chófer para cada maquinaria del proyecto');
			} else {
				fetch('/api/proyectos/', {
			    	method: 'POST',
			    	body: JSON.stringify({
			    		nombre: $('#proyecto_agregar_nombre').val(),
			    		fecha_inicio: $('#proyecto_agregar_fecha_inicio').val(),
			    		fecha_finalizacion: $('#proyecto_agregar_fecha_finalizacion').val(),
			    		lugar: $('#proyecto_agregar_lugar').val(),
			    		descripcion: $('#proyecto_agregar_descripcion').val(),

			    		maquinarias_id: $('#proyecto_agregar_maquinarias').val().toString(),
			    		choferes_id: $('#proyecto_agregar_choferes').val().toString(),
			    	})
			   	})
			    .then(response => response.json())
			    .then(result => {
			    	if(!result.error) {
			    		toastr.success('Proyecto registrado con éxito');

			    		$('#agregarProyectoModal_Step_1').modal('hide');
			    		$('#agregarProyectoModal_Step_2').modal('hide');
			    		$('#agregarProyectoModal_Step_3').modal('hide');

			    		$('.input-agregar').each(function() {$(this).val('');}); // reset

			    		setTimeout(() => {
			    			fill_table('proyectos');
			    		}, 100);
					} else if(result.error == 'No permission.') {
						$('#agregarProyectoModal_Step_1').modal('hide');
			    		$('#agregarProyectoModal_Step_2').modal('hide');
			    		$('#agregarProyectoModal_Step_3').modal('hide');
						toastr.info('Tu cuenta no tiene permisos para registrar proyectos');
			    	} else if(result.error == 'ValueError.') {
			    		toastr.warning('Ingrese todos los campos correctamente');
			    	} else {
			    		toastr.error('Ha ocurrido un error al registrar el proyecto');
			    	}
			    })
			    .catch(function(error) {
			    	toastr.error('Ha ocurrido un error al registrar el proyecto');
			    	console.log('Error: ' + error);
			    });
			}
		});

		// Modificar modal step 1 back
		$('#btn_proyecto_modificar_step_1_back').on('click', function() {
			$('#modificarProyectoModal_Step_2').modal('hide');
			$('#modificarProyectoModal_Step_3').modal('hide');
			$('#modificarProyectoModal_Step_1').modal('show');
		});

		// Modificar modal step 2
		$('#btn_proyecto_modificar_step_2').on('click', function() {
			if($('#proyecto_modificar_nombre').val() == '') {
				toastr.info('Por favor ingrese nombre del proyecto');
			} else if($('#proyecto_modificar_descripcion').val() == '') {
				toastr.info('Por favor ingrese descripción del proyecto');
			} else if($('#proyecto_modificar_lugar').val() == '') {
				toastr.info('Por favor ingrese lugar del proyecto');
			} else if($('#proyecto_modificar_fecha_inicio').val() == '') {
				toastr.info('Por favor ingrese fecha de inicio del proyecto');
			} else if($('#proyecto_modificar_fecha_finalizacion').val() == '') {
				toastr.info('Por favor ingrese fecha de finalización del proyecto');
			} else {
				proyectos_selected_id = document.querySelector('#proyectos_selected_id').value;
				
				fecha_inicio = $('#proyecto_modificar_fecha_inicio').val();
				fecha_finalizacion = $('#proyecto_modificar_fecha_finalizacion').val();

				date_inicio = new Date(fecha_inicio);
				date_finalizacion = new Date(fecha_finalizacion);

				if(date_inicio <= date_finalizacion) {
				    $(select_proyecto_modificar_maquinarias).selectpicker('destroy').empty();
				    fetch('/api/maquinarias/?fecha_inicio=' + fecha_inicio + '&fecha_fin=' + fecha_finalizacion +
						'&exclude_proyecto_id=' + proyectos_selected_id)
				    .then(response => response.json())
				    .then(data => {
				    	data.forEach(maquinaria => {
				    		var opt = document.createElement('option');
				    	    opt.value = maquinaria.id;
				    	    opt.innerHTML = maquinaria.placa + ' ' + maquinaria.marca;
				    	    select_proyecto_modificar_maquinarias.appendChild(opt);
				        });
				    })
				    .catch(function(error) {console.log('Error buscar maquinarias: ' + error);});
				    setTimeout(() => {
				    	$(select_proyecto_modificar_maquinarias).selectpicker();
				    	proyecto_maquinarias_id = $('#proyecto_modificar_maquinarias_id').val().split(',');
				    	$('#proyecto_modificar_maquinarias').selectpicker('val', proyecto_maquinarias_id);
				    }, 1000);

				    setTimeout(() => {
				    	$('#modificarProyectoModal_Step_1').modal('hide');
				    	$('#modificarProyectoModal_Step_3').modal('hide');
				    	$('#modificarProyectoModal_Step_2').modal('show');
				    }, 1000);
				} else {
					toastr.info('La fecha de finalización debe ser mayor a la fecha de inicio');
				}
			}
		});

		// Modificar modal step 2 back
		$('#btn_proyecto_modificar_step_2_back').on('click', function() {
			$('#modificarProyectoModal_Step_1').modal('hide');
			$('#modificarProyectoModal_Step_3').modal('hide');
			$('#modificarProyectoModal_Step_2').modal('show');
		});

		// Modificar modal step 3
		$('#btn_proyecto_modificar_step_3').on('click', function() {
			if($(select_proyecto_modificar_maquinarias).val().length > 0) {
				proyectos_selected_id = document.querySelector('#proyectos_selected_id').value;

				$(select_proyecto_modificar_choferes).selectpicker('destroy').empty();
				fetch('/api/trabajadores/?cargo=1' + '&fecha_inicio=' + fecha_inicio + '&fecha_fin=' + fecha_finalizacion +
					'&exclude_proyecto_id=' + proyectos_selected_id)
				.then(response => response.json())
				.then(data => {
					data.forEach(chofer => {
						var opt = document.createElement('option');
					    opt.value = chofer.id;
					    opt.innerHTML = chofer.fullname;
					    select_proyecto_modificar_choferes.appendChild(opt);
				    });
				})
				.catch(function(error) {console.log('Error buscar choferes: ' + error);});
				setTimeout(() => {
					$(select_proyecto_modificar_choferes).selectpicker();
					proyecto_choferes_id = $('#proyecto_modificar_choferes_id').val().split(',');
					$('#proyecto_modificar_choferes').selectpicker('val', proyecto_choferes_id);
				}, 1000);

				setTimeout(() => {
					$('#modificarProyectoModal_Step_1').modal('hide');
					$('#modificarProyectoModal_Step_2').modal('hide');
					$('#modificarProyectoModal_Step_3').modal('show');
				}, 1000);
			} else {
				toastr.info('Por favor seleccione maquinarias del proyecto');
			}
		});

		// Modificar proyecto
		$('#btn_proyecto_modificar').on('click', function() {
			maquinarias_size = $(select_proyecto_modificar_maquinarias).val().length;
			choferes_size = $(select_proyecto_modificar_choferes).val().length;

			if(choferes_size <= 0) {
				toastr.info('Por favor seleccione chóferes del proyecto');
			} else if(choferes_size != maquinarias_size) {
				toastr.info('Por favor seleccione un chófer para cada maquinaria del proyecto');
			} else {
				proyectos_selected_id = document.querySelector('#proyectos_selected_id').value;

				fetch('/api/proyectos/' + proyectos_selected_id, {
			    	method: 'PUT',
			    	body: JSON.stringify({
			    		nombre: $('#proyecto_modificar_nombre').val(),
			    		fecha_inicio: $('#proyecto_modificar_fecha_inicio').val(),
			    		fecha_finalizacion: $('#proyecto_modificar_fecha_finalizacion').val(),
			    		lugar: $('#proyecto_modificar_lugar').val(),
			    		descripcion: $('#proyecto_modificar_descripcion').val(),

			    		maquinarias_id: $('#proyecto_modificar_maquinarias').val().toString(),
			    		choferes_id: $('#proyecto_modificar_choferes').val().toString(),
			    	})
			   	})
			    .then(response => response.json())
			    .then(result => {
			    	if(!result.error) {
			    		toastr.success('Proyecto modificado con éxito');

			    		$('#modificarProyectoModal_Step_1').modal('hide');
			    		$('#modificarProyectoModal_Step_2').modal('hide');
			    		$('#modificarProyectoModal_Step_3').modal('hide');

			    		$('.input-modificar').each(function() {$(this).val('');}); // reset

			    		setTimeout(() => {
			    			fill_table('proyectos');
			    		}, 100);
					} else if(result.error == 'No permission.') {
						$('#modificarProyectoModal_Step_1').modal('hide');
			    		$('#modificarProyectoModal_Step_2').modal('hide');
			    		$('#modificarProyectoModal_Step_3').modal('hide');
						toastr.info('Tu cuenta no tiene permisos para modificar proyectos');
			    	} else if(result.error == 'ValueError.') {
			    		toastr.warning('Ingrese todos los campos correctamente');
			    	} else {
			    		toastr.error('Ha ocurrido un error al modificar el proyecto');
			    	}
			    })
			    .catch(function(error) {
			    	toastr.error('Ha ocurrido un error al modificar el proyecto');
			    	console.log('Error: ' + error);
			    });
			}
		});

		// Establecer culminado proyecto
		$('#btn_proyecto_establecer_culminado').on('click', function() {
			proyecto_establecer_culminado_id = document.querySelector('#proyecto_establecer_culminado_id').value;
			proyecto_establecer_culminado_nota = document.querySelector('#proyecto_establecer_culminado_nota').value;

			fetch('/api/proyectos/' + proyecto_establecer_culminado_id, {
		    	method: 'PATCH',
		    	body: JSON.stringify({culminado: true, culminado_nota: proyecto_establecer_culminado_nota})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Proyecto establecido como culminado con éxito');
		    		$('#establecerProyectoCulminadoModal').modal('hide');
					document.querySelector('#proyecto_establecer_culminado_nota').value = '';

		    		setTimeout(() => {
		    			fill_table('proyectos');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#establecerProyectoCulminadoModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para establecer proyectos como culminados');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#establecerProyectoCulminadoModal').modal('hide');
		    		toastr.warning('Este proyecto no está registrado');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else if(result.error == 'InvalidDate.') {
		    		toastr.warning('El proyecto no puede ser culminado antes de la fecha de finalización');
		    	}  else {
		    		toastr.warning('Ha ocurrido un error al establecer proyecto como culminado!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al establecer proyecto como culminado!');
		    	console.log('Error: ' + error);
		    });
		});

		// Cancelar proyecto
		$('#btn_proyecto_cancelar').on('click', function() {
			proyecto_cancelar_id = document.querySelector('#proyecto_cancelar_id').value;

			fetch('/api/proyectos/' + proyecto_cancelar_id, {
		    	method: 'PATCH',
		    	body: JSON.stringify({cancelado: true})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Proyecto cancelado con éxito');
		    		$('#cancelarProyectoModal').modal('hide');

		    		setTimeout(() => {
		    			fill_table('proyectos');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#cancelarProyectoModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para cancelar proyectos');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#cancelarProyectoModal').modal('hide');
		    		toastr.warning('Este proyecto no está registrado');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else if(result.error == 'InvalidDate.') {
		    		toastr.warning('El proyecto no puede ser culminado antes de la fecha de retorno');
		    	}  else {
		    		toastr.warning('Ha ocurrido un error al cancelar el proyecto!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al cancelar el proyecto!');
		    	console.log('Error: ' + error);
		    });
		});

		// Eliminar proyecto
		$('#btn_proyecto_eliminar').on('click', function() {
			proyectos_selected_id = document.querySelector('#proyectos_selected_id').value;

			fetch('/api/proyectos/' + proyectos_selected_id, {
		    	method: 'DELETE',
		    	body: JSON.stringify({})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		$('#eliminarProyectoModal').modal('hide');
		    		toastr.success('Proyecto eliminado correctamente');

		    		setTimeout(() => {
						fill_table('proyectos');
					}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#eliminarProyectoModal').modal('hide');
		    		toastr.warning('Proyecto no está registrado');
		    	}
		    	else if(result.error == 'No permission.') {
		    		$('#eliminarProyectoModal').modal('hide');
		    		toastr.info('Tu cuenta no tiene permisos para eliminar proyectos');
		    	} else {
		    		toastr.error('Ha ocurrido un error al eliminar el proyecto');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.error('Ha ocurrido un error al eliminar el proyecto');
		    	console.log('Error: ' + error);
		    });
		});

		// Reporte proyecto
		$('#btn_proyecto_reporte_all').on('click', function() {
			$('#reporteProyectoModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/proyectos';
			window.open(url, '_blank');
		});

		$('#btn_proyecto_reporte_all_2').on('click', function() {
			$('#reporteProyectoAllModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/proyectos';
			window.open(url, '_blank');
		});

		$('#btn_proyecto_reporte_culminados_2, #btn_proyecto_reporte_culminados').on('click', function() {
			$('#reporteProyectoAllModal').modal('hide');
			$('#reporteProyectoModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/proyectos?culminados=true';
			window.open(url, '_blank');
		});

		$('#btn_proyecto_reporte_cancelados_2, #btn_proyecto_reporte_cancelados').on('click', function() {
			$('#reporteProyectoAllModal').modal('hide');
			$('#reporteProyectoModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/proyectos?cancelados=true';
			window.open(url, '_blank');
		});

		$('#btn_proyecto_reporte_sinculminar_2, #btn_proyecto_reporte_sinculminar').on('click', function() {
			$('#reporteProyectoAllModal').modal('hide');
			$('#reporteProyectoModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/proyectos?sinculminar=true';
			window.open(url, '_blank');
		});

		$('#btn_proyecto_reporte_single').on('click', function() {
			$('#reporteProyectoModal').modal('hide');

			proyectos_selected_id = document.querySelector('#proyectos_selected_id').value;

			if(proyectos_selected_id) {
				var url = 'http://' + location.host + '/pdf/proyectos/' + proyectos_selected_id;
				window.open(url, '_blank');
			} else {
				toastr.info('No hay proyecto seleccionado');
			}
		});

		fill_table('proyectos');
	}

	if(window.location.pathname.split('/')[1] === 'clientes') {
		// Agregar cliente
		$('#form_cliente_agregar').submit(function(e) {
			var form_agregar_data = $('#form_cliente_agregar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});

			fetch('/api/clientes/', {
		    	method: 'POST',
		    	body: JSON.stringify(form_agregar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Cliente registrado con éxito');
		    		$('#agregarClienteModal').modal('hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('clientes');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#agregarClienteModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para registrar clientes');
		    	} else if(result.error == 'CedulaNotUnique.') {
		    		toastr.warning('Ya existe cliente registrado con esta cédula de identidad');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else {
		    		toastr.error('Ha ocurrido un error al registrar el cliente');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.error('Ha ocurrido un error al registrar el cliente');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Modificar cliente
		$('#form_cliente_modificar').submit(function(e) {
			clientes_selected_id = document.querySelector('#clientes_selected_id').value;
			var form_modificar_data = $('#form_cliente_modificar').serializeArray().reduce(function(obj, item) {obj[item.name] = item.value;return obj;}, {});

			fetch('/api/clientes/' + clientes_selected_id, {
		    	method: 'PUT',
		    	body: JSON.stringify(form_modificar_data)
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Cliente modificado con éxito');
		    		$('#modificarClienteModal').modal('hide');
		    		this.reset();

		    		setTimeout(() => {
		    			fill_table('clientes');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#modificarClienteModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para modificar información de clientes');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#modificarClienteModal').modal('hide');
		    		toastr.warning('Cliente no está registrado');
		    	} else if(result.error == 'CedulaNotUnique.') {
		    		toastr.warning('Ya existe cliente registrado con esta cédula de identidad');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else {
		    		toastr.warning('Ha ocurrido un error al modificar la información del cliente!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al modificar la información del cliente!');
		    	console.log('Error: ' + error);
		    });

			e.preventDefault();
		});

		// Eliminar cliente
		$('#btn_cliente_eliminar').on('click', function() {
			clientes_selected_id = document.querySelector('#clientes_selected_id').value;

			fetch('/api/clientes/' + clientes_selected_id, {
		    	method: 'DELETE',
		    	body: JSON.stringify({})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		$('#eliminarClienteModal').modal('hide');
		    		toastr.success('Cliente eliminado correctamente');

		    		setTimeout(() => {
						fill_table('clientes');
					}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#eliminarClienteModal').modal('hide');
		    		toastr.warning('Cliente no está registrado');
		    	}
		    	else if(result.error == 'No permission.') {
		    		$('#eliminarClienteModal').modal('hide');
		    		toastr.info('Tu cuenta no tiene permisos para eliminar clientes');
		    	} else {
		    		toastr.error('Ha ocurrido un error al eliminar cliente');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.error('Ha ocurrido un error al eliminar cliente');
		    	console.log('Error: ' + error);
		    });
		});

		// Reporte maquinaria
		$('#btn_cliente_reporte_all').on('click', function() {
			$('#reporteClienteModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/clientes';
			window.open(url, '_blank');
		});

		$('#btn_cliente_reporte_all_2').on('click', function() {
			$('#reporteClienteAllModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/clientes';
			window.open(url, '_blank');
		});

		$('#btn_cliente_reporte_single').on('click', function() {
			$('#reporteClienteModal').modal('hide');

			clientes_selected_id = document.querySelector('#clientes_selected_id').value;

			if(clientes_selected_id) {
				var url = 'http://' + location.host + '/pdf/clientes/' + clientes_selected_id;
				window.open(url, '_blank');
			} else {
				toastr.info('No hay cliente seleccionado');
			}
		});

		fill_table('clientes');
	}

	if(window.location.pathname.split('/')[1] === 'alquileres') {
		const select_alquiler_agregar_cliente = document.querySelector('#alquiler_agregar_cliente');
		const select_alquiler_agregar_maquinarias = document.querySelector('#alquiler_agregar_maquinarias');
		const select_alquiler_agregar_choferes = document.querySelector('#alquiler_agregar_choferes');

		const select_alquiler_modificar_cliente = document.querySelector('#alquiler_modificar_cliente');
		const select_alquiler_modificar_maquinarias = document.querySelector('#alquiler_modificar_maquinarias');
		const select_alquiler_modificar_choferes = document.querySelector('#alquiler_modificar_choferes');

		// Select cliente agregar
		$(select_alquiler_agregar_cliente).selectpicker('destroy').empty().append('<option value="" selected>Seleccionar cliente</option>');
		fetch('/api/clientes')
		.then(response => response.json())
		.then(data => {
			data.forEach(cliente => {
				var opt = document.createElement('option');
				opt.value = cliente.id;
				opt.innerHTML = cliente.fullname;
				select_alquiler_agregar_cliente.appendChild(opt);
			});
		})
		.catch(function(error) {console.log('Error buscar clientes: ' + error);});
		setTimeout(() => {$(select_alquiler_agregar_cliente).selectpicker();}, 1000);

		// Agregar modal step 1 back
		$('#btn_alquiler_agregar_step_1_back').on('click', function() {
			$('#agregarAlquilerModal_Step_4').modal('hide');
			$('#agregarAlquilerModal_Step_3').modal('hide');
			$('#agregarAlquilerModal_Step_2').modal('hide');
			$('#agregarAlquilerModal_Step_1').modal('show');
		});

		// Agregar modal step 2
		$('#btn_alquiler_agregar_step_2').on('click', function() {
			if($('#alquiler_agregar_actividad').val() == '') {
				toastr.info('Por favor ingrese actividad del alquiler');
			} else if($('#alquiler_agregar_fecha_salida').val() == '') {
				toastr.info('Por favor ingrese fecha de salida del alquiler');
			} else if($('#alquiler_agregar_fecha_retorno').val() == '') {
				toastr.info('Por favor ingrese fecha de retorno del alquiler');
			} else if($('#alquiler_agregar_cliente').val() == '') {
				toastr.info('Por favor seleccione cliente del alquiler');
			} else {
				fecha_salida = $('#alquiler_agregar_fecha_salida').val();
				fecha_retorno = $('#alquiler_agregar_fecha_retorno').val();

				date_salida = new Date(fecha_salida);
				date_retorno = new Date(fecha_retorno);

				if(date_salida <= date_retorno) {
				    $(select_alquiler_agregar_maquinarias).selectpicker('destroy').empty();
					fetch('/api/maquinarias/?fecha_inicio=' + fecha_salida.split('T')[0] + '&fecha_fin=' + fecha_retorno.split('T')[0])
				    .then(response => response.json())
				    .then(data => {
				    	data.forEach(maquinaria => {
				    		var opt = document.createElement('option');
				    	    opt.value = maquinaria.id;
				    	    opt.innerHTML = maquinaria.placa + ' ' + maquinaria.marca;
				    	    select_alquiler_agregar_maquinarias.appendChild(opt);
				        });
				    })
				    .catch(function(error) {console.log('Error buscar maquinarias: ' + error);});
				    setTimeout(() => {$(select_alquiler_agregar_maquinarias).selectpicker();}, 1000);

				    setTimeout(() => {
				    	$('#agregarAlquilerModal_Step_1').modal('hide');
				    	$('#agregarAlquilerModal_Step_3').modal('hide');
				    	$('#agregarAlquilerModal_Step_4').modal('hide');
				    	$('#agregarAlquilerModal_Step_2').modal('show');
				    }, 1000);
				} else {
					toastr.info('La fecha de retorno debe ser mayor a la fecha de salida');
				}
			}
		});

		// Agregar modal step 2 back
		$('#btn_alquiler_agregar_step_2_back').on('click', function() {
			$('#agregarAlquilerModal_Step_1').modal('hide');
			$('#agregarAlquilerModal_Step_3').modal('hide');
			$('#agregarAlquilerModal_Step_4').modal('hide');
			$('#agregarAlquilerModal_Step_2').modal('show');
		});

		// Agregar modal step 3
		$('#btn_alquiler_agregar_step_3').on('click', function() {
			if($(select_alquiler_agregar_maquinarias).val().length > 0) {
				$(select_alquiler_agregar_choferes).selectpicker('destroy').empty();
				fetch('/api/trabajadores/?cargo=1' + '&fecha_inicio=' + fecha_salida.split('T')[0] + '&fecha_fin=' + fecha_retorno.split('T')[0])
				.then(response => response.json())
				.then(data => {
					data.forEach(chofer => {
						var opt = document.createElement('option');
					    opt.value = chofer.id;
					    opt.innerHTML = chofer.fullname;
					    select_alquiler_agregar_choferes.appendChild(opt);
				    });
				})
				.catch(function(error) {console.log('Error buscar choferes: ' + error);});
				setTimeout(() => {$(select_alquiler_agregar_choferes).selectpicker();}, 1000);

				setTimeout(() => {
					$('#agregarAlquilerModal_Step_1').modal('hide');
					$('#agregarAlquilerModal_Step_2').modal('hide');
					$('#agregarAlquilerModal_Step_4').modal('hide');
					$('#agregarAlquilerModal_Step_3').modal('show');
				}, 1000);
			} else {
				toastr.info('Por favor seleccione maquinarias del alquiler');
			}
		});

		// Agregar modal step 3 back
		$('#btn_alquiler_agregar_step_3_back').on('click', function() {
			$('#agregarAlquilerModal_Step_1').modal('hide');
			$('#agregarAlquilerModal_Step_4').modal('hide');
			$('#agregarAlquilerModal_Step_2').modal('hide');
			$('#agregarAlquilerModal_Step_3').modal('show');
		});

		// Agregar modal step 4
		$('#btn_alquiler_agregar_step_4').on('click', function() {
			maquinarias_size = $(select_alquiler_agregar_maquinarias).val().length;
			choferes_size = $(select_alquiler_agregar_choferes).val().length;

			if(choferes_size <= 0) {
				toastr.info('Por favor seleccione chóferes del proyecto');
			} else if(choferes_size != maquinarias_size) {
				toastr.info('Por favor seleccione un chófer para cada maquinaria del alquiler');
			} else {
				setTimeout(() => {
					$('#agregarAlquilerModal_Step_1').modal('hide');
					$('#agregarAlquilerModal_Step_2').modal('hide');
					$('#agregarAlquilerModal_Step_3').modal('hide');
					$('#agregarAlquilerModal_Step_4').modal('show');
				}, 1000);
			}
		});

		// Agregar alquiler
		$('#btn_alquiler_agregar').on('click', function() {
			if($('#alquiler_agregar_monto').val() == '') {
				toastr.info('Por favor ingrese monto del alquiler');
			} else {
				fetch('/api/alquileres/', {
			    	method: 'POST',
			    	body: JSON.stringify({
			    		actividad: $('#alquiler_agregar_actividad').val(),

			    		fecha_salida: $('#alquiler_agregar_fecha_salida').val(),
			    		fecha_retorno: $('#alquiler_agregar_fecha_retorno').val(),

						cliente_id: $('#alquiler_agregar_cliente').val(),

			    		maquinarias_id: $('#alquiler_agregar_maquinarias').val().toString(),
			    		choferes_id: $('#alquiler_agregar_choferes').val().toString(),
			    		
						monto: $('#alquiler_agregar_monto').val()
			    	})
			   	})
			    .then(response => response.json())
			    .then(result => {
			    	if(!result.error) {
			    		toastr.success('Alquiler registrado con éxito');

			    		$('#agregarAlquilerModal_Step_1').modal('hide');
			    		$('#agregarAlquilerModal_Step_2').modal('hide');
			    		$('#agregarAlquilerModal_Step_3').modal('hide');
			    		$('#agregarAlquilerModal_Step_4').modal('hide');

			    		$('.input-agregar').each(function() {$(this).val('');}); // reset

			    		setTimeout(() => {
			    			fill_table('alquileres');
			    		}, 100);
					} else if(result.error == 'No permission.') {
						$('#agregarAlquilerModal_Step_1').modal('hide');
			    		$('#agregarAlquilerModal_Step_2').modal('hide');
			    		$('#agregarAlquilerModal_Step_3').modal('hide');
			    		$('#agregarAlquilerModal_Step_4').modal('hide');
						toastr.info('Tu cuenta no tiene permisos para registrar alquileres');
			    	} else if(result.error == 'ValueError.') {
			    		toastr.warning('Ingrese todos los campos correctamente');
			    	} else {
			    		toastr.error('Ha ocurrido un error al registrar el alquiler');
			    	}
			    })
			    .catch(function(error) {
			    	toastr.error('Ha ocurrido un error al registrar el alquiler');
			    	console.log('Error: ' + error);
			    });
			}
		});

		// Select cliente modificar
		$(select_alquiler_modificar_cliente).selectpicker('destroy').empty().append('<option value="" selected>Seleccionar cliente</option>');
		fetch('/api/clientes')
		.then(response => response.json())
		.then(data => {
			data.forEach(cliente => {
				var opt = document.createElement('option');
				opt.value = cliente.id;
				opt.innerHTML = cliente.fullname;
				select_alquiler_modificar_cliente.appendChild(opt);
			});
		})
		.catch(function(error) {console.log('Error buscar clientes: ' + error);});
		setTimeout(() => {$(select_alquiler_modificar_cliente).selectpicker();}, 1000);

		// Modificar modal step 1 back
		$('#btn_alquiler_modificar_step_1_back').on('click', function() {
			$('#modificarAlquilerModal_Step_2').modal('hide');
			$('#modificarAlquilerModal_Step_3').modal('hide');
			$('#modificarAlquilerModal_Step_1').modal('show');
		});

		// Modificar modal step 2
		$('#btn_alquiler_modificar_step_2').on('click', function() {
			if($('#alquiler_modificar_actividad').val() == '') {
				toastr.info('Por favor ingrese actividad del alquiler');
			} else if($('#alquiler_modificar_fecha_salida').val() == '') {
				toastr.info('Por favor ingrese fecha de salida del alquiler');
			} else if($('#alquiler_modificar_fecha_retorno').val() == '') {
				toastr.info('Por favor ingrese fecha de retorno del alquiler');
			} else if($('#alquiler_modificar_monto').val() == '') {
				toastr.info('Por favor ingrese monto del alquiler');
			} else if($('#alquiler_modificar_cliente').val() == '') {
				toastr.info('Por favor seleccione cliente del alquiler');
			} else {
				alquileres_selected_id = document.querySelector('#alquileres_selected_id').value;
				
				fecha_salida = $('#alquiler_modificar_fecha_salida').val();
				fecha_retorno = $('#alquiler_modificar_fecha_retorno').val();

				date_salida = new Date(fecha_salida);
				date_retorno = new Date(fecha_retorno);

				if(date_salida <= date_retorno) {
				    $(select_alquiler_modificar_maquinarias).selectpicker('destroy').empty();
				    fetch('/api/maquinarias/?fecha_inicio=' + fecha_salida.split('T')[0] + '&fecha_fin=' + fecha_retorno.split('T')[0] +
						'&exclude_alquiler_id=' + alquileres_selected_id)
				    .then(response => response.json())
				    .then(data => {
				    	data.forEach(maquinaria => {
				    		var opt = document.createElement('option');
				    	    opt.value = maquinaria.id;
				    	    opt.innerHTML = maquinaria.placa + ' ' + maquinaria.marca;
				    	    select_alquiler_modificar_maquinarias.appendChild(opt);
				        });
				    })
				    .catch(function(error) {console.log('Error buscar maquinarias: ' + error);});
				    setTimeout(() => {
				    	$(select_alquiler_modificar_maquinarias).selectpicker();
				    	alquiler_maquinarias_id = $('#alquiler_modificar_maquinarias_id').val().split(',');
				    	$('#alquiler_modificar_maquinarias').selectpicker('val', alquiler_maquinarias_id);
				    }, 1000);

				    setTimeout(() => {
				    	$('#modificarAlquilerModal_Step_1').modal('hide');
				    	$('#modificarAlquilerModal_Step_3').modal('hide');
				    	$('#modificarAlquilerModal_Step_2').modal('show');
				    }, 1000);
				} else {
					toastr.info('La fecha de retorno debe ser mayor a la fecha de salida');
				}
			}
		});

		// Modificar modal step 2 back
		$('#btn_alquiler_modificar_step_2_back').on('click', function() {
			$('#modificarAlquilerModal_Step_1').modal('hide');
			$('#modificarAlquilerModal_Step_3').modal('hide');
			$('#modificarAlquilerModal_Step_2').modal('show');
		});

		// Modificar modal step 3
		$('#btn_alquiler_modificar_step_3').on('click', function() {
			if($(select_alquiler_modificar_maquinarias).val().length > 0) {
				alquileres_selected_id = document.querySelector('#alquileres_selected_id').value;

				$(select_alquiler_modificar_choferes).selectpicker('destroy').empty();
				fetch('/api/trabajadores/?cargo=1' + '&fecha_inicio=' + fecha_salida.split('T')[0] + '&fecha_fin=' + fecha_retorno.split('T')[0] +
					'&exclude_alquiler_id=' + alquileres_selected_id)
				.then(response => response.json())
				.then(data => {
					data.forEach(chofer => {
						var opt = document.createElement('option');
					    opt.value = chofer.id;
					    opt.innerHTML = chofer.fullname;
					    select_alquiler_modificar_choferes.appendChild(opt);
				    });
				})
				.catch(function(error) {console.log('Error buscar choferes: ' + error);});
				setTimeout(() => {
					$(select_alquiler_modificar_choferes).selectpicker();
					alquiler_choferes_id = $('#alquiler_modificar_choferes_id').val().split(',');
					$('#alquiler_modificar_choferes').selectpicker('val', alquiler_choferes_id);
				}, 1000);

				setTimeout(() => {
					$('#modificarAlquilerModal_Step_1').modal('hide');
					$('#modificarAlquilerModal_Step_2').modal('hide');
					$('#modificarAlquilerModal_Step_3').modal('show');
				}, 1000);
			} else {
				toastr.info('Por favor seleccione maquinarias del alquiler');
			}
		});

		// Modificar alquiler
		$('#btn_alquiler_modificar').on('click', function() {
			maquinarias_size = $(select_alquiler_modificar_maquinarias).val().length;
			choferes_size = $(select_alquiler_modificar_choferes).val().length;

			if(choferes_size <= 0) {
				toastr.info('Por favor seleccione chóferes del alquiler');
			} else if(choferes_size != maquinarias_size) {
				toastr.info('Por favor seleccione un chófer para cada maquinaria del alquiler');
			} else {
				alquileres_selected_id = document.querySelector('#alquileres_selected_id').value;

				fetch('/api/alquileres/' + alquileres_selected_id, {
			    	method: 'PUT',
			    	body: JSON.stringify({
						actividad: $('#alquiler_modificar_actividad').val(),
			    		fecha_salida: $('#alquiler_modificar_fecha_salida').val(),
			    		fecha_retorno: $('#alquiler_modificar_fecha_retorno').val(),
						cliente_id: $('#alquiler_modificar_cliente').val(),
			    		maquinarias_id: $('#alquiler_modificar_maquinarias').val().toString(),
			    		choferes_id: $('#alquiler_modificar_choferes').val().toString(),
						monto: $('#alquiler_modificar_monto').val()
			    	})
			   	})
			    .then(response => response.json())
			    .then(result => {
			    	if(!result.error) {
			    		toastr.success('Alquiler modificado con éxito');

			    		$('#modificarAlquilerModal_Step_1').modal('hide');
			    		$('#modificarAlquilerModal_Step_2').modal('hide');
			    		$('#modificarAlquilerModal_Step_3').modal('hide');

			    		$('.input-modificar').each(function() {$(this).val('');}); // reset

			    		setTimeout(() => {
			    			fill_table('alquileres');
			    		}, 100);
					} else if(result.error == 'No permission.') {
						$('#modificarAlquileresModal_Step_1').modal('hide');
			    		$('#modificarAlquileresModal_Step_2').modal('hide');
			    		$('#modificarAlquileresModal_Step_3').modal('hide');
						toastr.info('Tu cuenta no tiene permisos para modificar alquileres');
			    	} else if(result.error == 'ValueError.') {
			    		toastr.warning('Ingrese todos los campos correctamente');
			    	} else {
			    		toastr.error('Ha ocurrido un error al modificar el alquiler');
			    	}
			    })
			    .catch(function(error) {
			    	toastr.error('Ha ocurrido un error al modificar el alquiler');
			    	console.log('Error: ' + error);
			    });
			}
		});

		// Establecer culminado alquiler
		$('#btn_alquiler_establecer_culminado').on('click', function() {
			alquiler_establecer_culminado_id = document.querySelector('#alquiler_establecer_culminado_id').value;
			alquiler_establecer_culminado_nota = document.querySelector('#alquiler_establecer_culminado_nota').value;

			fetch('/api/alquileres/' + alquiler_establecer_culminado_id, {
		    	method: 'PATCH',
		    	body: JSON.stringify({culminado: true, culminado_nota: alquiler_establecer_culminado_nota})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Alquiler establecido como culminado con éxito');
		    		$('#establecerAlquilerCulminadoModal').modal('hide');
					document.querySelector('#alquiler_establecer_culminado_nota').value = '';

		    		setTimeout(() => {
		    			fill_table('alquileres');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#establecerAlquilerCulminadoModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para establecer alquileres como culminados');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#establecerAlquilerCulminadoModal').modal('hide');
		    		toastr.warning('Este proyecto no está registrado');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else if(result.error == 'InvalidDate.') {
		    		toastr.warning('El alquiler no puede ser culminado antes de la fecha de retorno');
		    	}  else {
		    		toastr.warning('Ha ocurrido un error al establecer alquiler como culminado!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al establecer alquiler como culminado!');
		    	console.log('Error: ' + error);
		    });
		});

		// Cancelar alquiler
		$('#btn_alquiler_cancelar').on('click', function() {
			alquiler_cancelar_id = document.querySelector('#alquiler_cancelar_id').value;

			fetch('/api/alquileres/' + alquiler_cancelar_id, {
		    	method: 'PATCH',
		    	body: JSON.stringify({cancelado: true})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		toastr.success('Alquiler cancelado con éxito');
		    		$('#cancelarAlquilerModal').modal('hide');

		    		setTimeout(() => {
		    			fill_table('alquileres');
		    		}, 100);
				} else if(result.error == 'No permission.') {
					$('#cancelarAlquilerModal').modal('hide');
					toastr.info('Tu cuenta no tiene permisos para cancelar alquileres');
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#cancelarAlquilerModal').modal('hide');
		    		toastr.warning('Este alquiler no está registrado');
		    	} else if(result.error == 'ValueError.') {
		    		toastr.warning('Ingrese todos los campos correctamente');
		    	} else if(result.error == 'InvalidDate.') {
		    		toastr.warning('El alquiler no puede ser culminado antes de la fecha de retorno');
		    	}  else {
		    		toastr.warning('Ha ocurrido un error al cancelar el alquiler!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.warning('Ha ocurrido un error al cancelar el alquiler!');
		    	console.log('Error: ' + error);
		    });
		});

		// Eliminar alquiler
		$('#btn_alquiler_eliminar').on('click', function() {
			alquileres_selected_id = document.querySelector('#alquileres_selected_id').value;

			fetch('/api/alquileres/' + alquileres_selected_id, {
		    	method: 'DELETE',
		    	body: JSON.stringify({})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(!result.error) {
		    		$('#eliminarAlquilerModal').modal('hide');
		    		toastr.success('Alquiler eliminado correctamente');

		    		setTimeout(() => {
						fill_table('alquileres');
					}, 100);
		    	} else if(result.error == 'DoesNotExist.') {
		    		$('#eliminarAlquilerModal').modal('hide');
		    		toastr.warning('Alquiler no está registrado');
		    	}
		    	else if(result.error == 'No permission.') {
		    		$('#eliminarAlquilerModal').modal('hide');
		    		toastr.info('Tu cuenta no tiene permisos para eliminar alquileres');
		    	} else {
		    		toastr.error('Ha ocurrido un error al eliminar el alquiler');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.error('Ha ocurrido un error al eliminar el alquiler');
		    	console.log('Error: ' + error);
		    });
		});

		// Reporte maquinaria
		$('#btn_alquiler_reporte_all').on('click', function() {
			$('#reporteAlquilerModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/alquileres';
			window.open(url, '_blank');
		});

		$('#btn_alquiler_reporte_all_2').on('click', function() {
			$('#reporteAlquilerAllModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/alquileres';
			window.open(url, '_blank');
		});

		$('#btn_alquiler_reporte_culminados_2, #btn_alquiler_reporte_culminados').on('click', function() {
			$('#reporteAlquilerAllModal').modal('hide');
			$('#reporteAlquilerModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/alquileres?culminados=true';
			window.open(url, '_blank');
		});

		$('#btn_alquiler_reporte_sinculminar_2, #btn_alquiler_reporte_sinculminar').on('click', function() {
			$('#reporteAlquilerAllModal').modal('hide');
			$('#reporteAlquilerModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/alquileres?sinculminar=true';
			window.open(url, '_blank');
		});

		$('#btn_alquiler_reporte_cancelados_2, #btn_alquiler_reporte_cancelados').on('click', function() {
			$('#reporteAlquilerAllModal').modal('hide');
			$('#reporteAlquilerModal').modal('hide');
			var url = 'http://' + location.host + '/pdf/alquileres?cancelados=true';
			window.open(url, '_blank');
		});

		$('#btn_alquiler_reporte_single').on('click', function() {
			$('#reporteAlquilerModal').modal('hide');

			alquileres_selected_id = document.querySelector('#alquileres_selected_id').value;

			if(alquileres_selected_id) {
				var url = 'http://' + location.host + '/pdf/alquileres/' + alquileres_selected_id;
				window.open(url, '_blank');
			} else {
				toastr.info('No hay alquiler seleccionado');
			}
		});

		fill_table('alquileres');
	}

	if(window.location.pathname.split('/')[1] === 'login') {
		const input_restablecer_usuario = document.querySelector('#restablecer_usuario');

		const label_restablecer_pregunta_seguridad = document.querySelector('#restablecer_pregunta_seguridad');
		const input_restablecer_respuesta_seguridad = document.querySelector('#restablecer_respuesta_seguridad');

		const input_restablecer_nueva_contraseña = document.querySelector('#restablecer_nueva_contraseña');
		const input_restablecer_confirmar_contraseña = document.querySelector('#restablecer_confirmar_contraseña');


		$('#btn_contraseña_olvidada').on('click', function() {
			$('#restablecerContraseña1Modal').modal('show');
		});

		$('#btn_restablecer_1').on('click', function() {
			if(input_restablecer_usuario.value != '') {
				fetch('/api/user_exists', {
			    	method: 'POST',
			    	body: JSON.stringify({
			        	username: input_restablecer_usuario.value,
			    	})
			   	})
			    .then(response => response.json())
			    .then(result => {
			    	if(result.user_exists) {
			    		if(result.is_available_to_reset_password) {
			    			label_restablecer_pregunta_seguridad.innerHTML = result.pregunta_seguridad;

			    			$('#restablecerContraseña1Modal').modal('hide');
			    			$('#restablecerContraseña2Modal').modal('show');
			    		} else {
			    			$('#restablecerContraseña1Modal').modal('hide');
			    			toastr.warning('Pregunta de seguridad no establecida, no es posible restablecer su contraseña. Por favor comuniquese con un administrador!');
			    		}
			    	} else {
			    		toastr.warning('Este usuario no está registrado en el sistema!');
			    	}
			    })
			    .catch(function(error) {
			    	toastr.error('Ha ocurrido un verificar el nombre de usuario!');
			    	console.log('Error: ' + error);
			    });
			} else {
				toastr.info('Ingrese nombre de usuario!');
			}
		});

		$('#btn_restablecer_2').on('click', function() {
			fetch('/api/check_pregunta_seguridad', {
		    	method: 'POST',
		    	body: JSON.stringify({
		        	username: input_restablecer_usuario.value,
		        	respuesta: input_restablecer_respuesta_seguridad.value
		    	})
		   	})
		    .then(response => response.json())
		    .then(result => {
		    	if(result.check_respuesta == true) {
		    		$('#restablecerContraseña1Modal').modal('hide');
		    		$('#restablecerContraseña2Modal').modal('hide');
		    		$('#restablecerContraseña3Modal').modal('show');
		    	} else {
		    		toastr.warning('Respuesta incorrecta!');
		    	}
		    })
		    .catch(function(error) {
		    	toastr.error('Ha ocurrido un verificar la respuesta!');
		    	console.log('Error: ' + error);
		    });
		});

		$('#btn_restablecer_3').on('click', function() {
			if(input_restablecer_nueva_contraseña.value == input_restablecer_confirmar_contraseña.value) {
				fetch('/api/user_reset_password', {
			    	method: 'POST',
			    	body: JSON.stringify({
			        	username: input_restablecer_usuario.value,
			        	new_password: input_restablecer_nueva_contraseña.value,
			    	})
			   	})
			    .then(response => response.json())
			    .then(result => {
			    	if(!result.error) {
			    		$('#restablecerContraseña1Modal').modal('hide');
			    		$('#restablecerContraseña2Modal').modal('hide');
			    		$('#restablecerContraseña3Modal').modal('hide');

			    		toastr.success('Contraseña restablecida con éxito!');
			    	} else if(result.error == 'DoesNotExist.') {
						$('#restablecerContraseña1Modal').modal('hide');
			    		$('#restablecerContraseña2Modal').modal('hide');
			    		$('#restablecerContraseña3Modal').modal('hide');

			    		toastr.info('Este usuario no está registrado en el sistema!');
			    	} else if(result.error == 'NotAvailableToResetPassword.') {
						$('#restablecerContraseña1Modal').modal('hide');
			    		$('#restablecerContraseña2Modal').modal('hide');
			    		$('#restablecerContraseña3Modal').modal('hide');

			    		toastr.info('Este usuario no puede restablecer su contraseña!');
			    	} else {
			    		toastr.error('Ha ocurrido un error al restablecer la contraseña!');
			    	}
			    })
			    .catch(function(error) {
			    	toastr.error('Ha ocurrido un error al restablecer la contraseña!');
			    	console.log('Error: ' + error);
			    });
			} else {
				toastr.info('Las contraseñas no coinciden!');
			}
		});

	}

	if(window.location.pathname.split('/')[1] === 'respaldo') {
		$('#btn_importar').on('click', function() {
			$('#loadImportFileModal').modal('show');
		});
	}

	if(window.location.pathname.split('/')[1] === 'perfil') {
		$('#perfil_agregar_img').on('change', function() {
			if(this.files.length > 0) {
				user_id = $('#perfil_usuario_id').val();
				user_img = this.files[0];
				img_extension = user_img.name.split('.').pop();
				img_name = user_id + '_profile_img_.' + img_extension;
				img_size = user_img.size/1024/1024;

				if(img_size <= 3) {
					const form_data = new FormData();
					form_data.append('update_profile_img', true);
					form_data.append('user-img', user_img, img_name);

					fetch('/api/perfil/' + user_id, {
						method: 'POST',
						body: form_data
					})
					.then(response => response.json())
					.then(result => {
						if(!result.error) {
							toastr.success('Imagen de perfil establecida con éxito');
							setTimeout(function() { location.reload(); }, 2000);
						} else {
							toastr.info('Ha ocurrido un error al establecer imagen!');
						}
					})
					.catch(function(error) {
						toastr.warning('Ha ocurrido un error al establecer imagen!');
						console.log('Error: ' + error);
					});
				} else {
					toastr.info('No se pueden cargar imagenes de mas de 3mb!');
				}
			}

		});
	}
});

function fill_table(tipo) {
	if(tipo == 'maquinarias') {
		if(isAdmin()) {
			var buttons = [
				{
					'text': '<i class="bi bi-filetype-pdf"></i> Generar reporte',
					'attr':  {'id': 'btn_reporte_maquinaria'},
					'action':
						function(e) {
							if($('#maquinarias_selected_id').val()) {
								$('#reporteMaquinariaModal').modal('show');
							} else {
								$('#reporteMaquinariaAllModal').modal('show');
							}
						}
				},
				{
					'text': '<i class="bi bi-plus-circle"></i> Registrar maquinaria',
					'attr':  {'id': 'btn_agregar_maquinaria'},
					'action':
						function(e) {
							$('#agregarMaquinariaModal').modal('show');
						}
				},
				{
					'name': 'btn_detalles_maquinaria',
					'text': '<i class="bi bi-eye"></i> Ver detalles',
					'attr':  {'id': 'btn_detalles_maquinaria', 'disabled': true},
					'action':
						function(e) {
							maquinarias_selected_id = document.querySelector('#maquinarias_selected_id').value;
	
							if(maquinarias_selected_id != '') {
								fetch('/api/maquinarias/' + maquinarias_selected_id)
								.then(response => response.json())
								.then(maquinaria => {
									document.querySelector('#maquinaria_detalles_placa').value = maquinaria.placa;
									document.querySelector('#maquinaria_detalles_marca').value = maquinaria.marca;
									document.querySelector('#maquinaria_detalles_anio_fabricacion').value = maquinaria.anio_fabricacion;
									document.querySelector('#maquinaria_detalles_modelo').value = maquinaria.modelo;
									document.querySelector('#maquinaria_detalles_estado').value = maquinaria.estado;
									document.querySelector('#maquinaria_detalles_descripcion').value = maquinaria.descripcion;
									document.querySelector('#maquinaria_detalles_color').value = maquinaria.color;
									document.querySelector('#maquinaria_detalles_tipo').value = maquinaria.tipo;
									document.querySelector('#maquinaria_detalles_clase').value = maquinaria.clase;
									document.querySelector('#maquinaria_detalles_num_ejes').value = maquinaria.num_ejes;
									document.querySelector('#maquinaria_detalles_serial_niv').value = maquinaria.serial_niv;
									document.querySelector('#maquinaria_detalles_serial_motor').value = maquinaria.serial_motor;
									document.querySelector('#maquinaria_detalles_serial_carroceria').value = maquinaria.serial_carroceria;
									document.querySelector('#maquinaria_detalles_serial_chasis').value = maquinaria.serial_chasis;
									document.querySelector('#maquinaria_detalles_tara').value = maquinaria.tara;
									document.querySelector('#maquinaria_detalles_capacidad_carga').value = maquinaria.capacidad_carga;
									document.querySelector('#maquinaria_detalles_tipo_combustible').value = maquinaria.tipo_combustible;
									document.querySelector('#maquinaria_detalles_capacidad_combustible').value = maquinaria.capacidad_combustible;
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar la maquinaria');
									console.log('Error buscar maquinaria: ' + error);
								});
	
								$('#detallesMaquinariaModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ninguna maquinaria');
							}
						}
				},
				{
					'name': 'btn_modificar_maquinaria',
					'text': '<i class="bi bi-pencil"></i> Modificar',
					'attr':  {'id': 'btn_modificar_maquinaria', 'disabled': true},
					'action':
						function(e) {
							maquinarias_selected_id = document.querySelector('#maquinarias_selected_id').value;
	
							if(maquinarias_selected_id != '') {
								fetch('/api/maquinarias/' + maquinarias_selected_id)
								.then(response => response.json())
								.then(maquinaria => {
									document.querySelector('#maquinaria_modificar_placa').value = maquinaria.placa;
									document.querySelector('#maquinaria_modificar_marca').value = maquinaria.marca;
									document.querySelector('#maquinaria_modificar_anio_fabricacion').value = maquinaria.anio_fabricacion;
									document.querySelector('#maquinaria_modificar_modelo').value = maquinaria.modelo;
									document.querySelector('#maquinaria_modificar_descripcion').value = maquinaria.descripcion;
									document.querySelector('#maquinaria_modificar_color').value = maquinaria.color;
									document.querySelector('#maquinaria_modificar_tipo').value = maquinaria.tipo;
									document.querySelector('#maquinaria_modificar_clase').value = maquinaria.clase;
									document.querySelector('#maquinaria_modificar_num_ejes').value = maquinaria.num_ejes;
									document.querySelector('#maquinaria_modificar_serial_niv').value = maquinaria.serial_niv;
									document.querySelector('#maquinaria_modificar_serial_motor').value = maquinaria.serial_motor;
									document.querySelector('#maquinaria_modificar_serial_carroceria').value = maquinaria.serial_carroceria;
									document.querySelector('#maquinaria_modificar_serial_chasis').value = maquinaria.serial_chasis;
									document.querySelector('#maquinaria_modificar_tara').value = maquinaria.tara;
									document.querySelector('#maquinaria_modificar_capacidad_carga').value = maquinaria.capacidad_carga;
									document.querySelector('#maquinaria_modificar_tipo_combustible').value = maquinaria.tipo_combustible;
									document.querySelector('#maquinaria_modificar_capacidad_combustible').value = maquinaria.capacidad_combustible;
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar la maquinaria');
									console.log('Error buscar maquinaria: ' + error);
								});
	
								$('#modificarMaquinariaModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ninguna maquinaria');
							}
						}
				},
				{
					'name': 'btn_toggle_maquinaria',
					'text': '<i class="bi bi-x-octagon"></i> Deshabilitar',
					'attr':  {'id': 'btn_toggle_maquinaria', 'disabled': true},
					'action':
						function(e) {
							if(e.target.innerText == ' Deshabilitar') {
								$('#deshabilitarMaquinariaModal').modal('show');
							} else if(e.target.innerText == ' Habilitar') {
								$('#habilitarMaquinariaModal').modal('show');
							}
						}
				}
			];
		} else {
			var buttons = [
				{
					'text': '<i class="bi bi-filetype-pdf"></i> Generar reporte',
					'attr':  {'id': 'btn_reporte_maquinaria'},
					'action':
						function(e) {
							if($('#maquinarias_selected_id').val()) {
								$('#reporteMaquinariaModal').modal('show');
							} else {
								$('#reporteMaquinariaAllModal').modal('show');
							}
						}
				},
				{
					'text': '<i class="bi bi-plus-circle"></i> Registrar maquinaria',
					'attr':  {'id': 'btn_agregar_maquinaria'},
					'action':
						function(e) {
							$('#agregarMaquinariaModal').modal('show');
						}
				},
				{
					'name': 'btn_detalles_maquinaria',
					'text': '<i class="bi bi-eye"></i> Ver detalles',
					'attr':  {'id': 'btn_detalles_maquinaria', 'disabled': true},
					'action':
						function(e) {
							maquinarias_selected_id = document.querySelector('#maquinarias_selected_id').value;
	
							if(maquinarias_selected_id != '') {
								fetch('/api/maquinarias/' + maquinarias_selected_id)
								.then(response => response.json())
								.then(maquinaria => {
									document.querySelector('#maquinaria_detalles_placa').value = maquinaria.placa;
									document.querySelector('#maquinaria_detalles_marca').value = maquinaria.marca;
									document.querySelector('#maquinaria_detalles_anio_fabricacion').value = maquinaria.anio_fabricacion;
									document.querySelector('#maquinaria_detalles_modelo').value = maquinaria.modelo;
									document.querySelector('#maquinaria_detalles_estado').value = maquinaria.estado;
									document.querySelector('#maquinaria_detalles_descripcion').value = maquinaria.descripcion;
									document.querySelector('#maquinaria_detalles_color').value = maquinaria.color;
									document.querySelector('#maquinaria_detalles_tipo').value = maquinaria.tipo;
									document.querySelector('#maquinaria_detalles_clase').value = maquinaria.clase;
									document.querySelector('#maquinaria_detalles_serial_niv').value = maquinaria.serial_niv;
									document.querySelector('#maquinaria_detalles_serial_motor').value = maquinaria.serial_motor;
									document.querySelector('#maquinaria_detalles_serial_carroceria').value = maquinaria.serial_carroceria;
									document.querySelector('#maquinaria_detalles_serial_chasis').value = maquinaria.serial_chasis;
									document.querySelector('#maquinaria_detalles_tara').value = maquinaria.tara;
									document.querySelector('#maquinaria_detalles_capacidad_carga').value = maquinaria.capacidad_carga;
									document.querySelector('#maquinaria_detalles_tipo_combustible').value = maquinaria.tipo_combustible;
									document.querySelector('#maquinaria_detalles_capacidad_combustible').value = maquinaria.capacidad_combustible;
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar la maquinaria');
									console.log('Error buscar maquinaria: ' + error);
								});
	
								$('#detallesMaquinariaModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ninguna maquinaria');
							}
						}
				},
				{
					'name': 'btn_modificar_maquinaria',
					'text': '<i class="bi bi-pencil"></i> Modificar',
					'attr':  {'id': 'btn_modificar_maquinaria', 'disabled': true},
					'action':
						function(e) {
							maquinarias_selected_id = document.querySelector('#maquinarias_selected_id').value;
	
							if(maquinarias_selected_id != '') {
								fetch('/api/maquinarias/' + maquinarias_selected_id)
								.then(response => response.json())
								.then(maquinaria => {
									document.querySelector('#maquinaria_modificar_placa').value = maquinaria.placa;
									document.querySelector('#maquinaria_modificar_marca').value = maquinaria.marca;
									document.querySelector('#maquinaria_modificar_anio_fabricacion').value = maquinaria.anio_fabricacion;
									document.querySelector('#maquinaria_modificar_modelo').value = maquinaria.modelo;
									document.querySelector('#maquinaria_modificar_descripcion').value = maquinaria.descripcion;
									document.querySelector('#maquinaria_modificar_color').value = maquinaria.color;
									document.querySelector('#maquinaria_modificar_tipo').value = maquinaria.tipo;
									document.querySelector('#maquinaria_modificar_clase').value = maquinaria.clase;
									document.querySelector('#maquinaria_modificar_serial_niv').value = maquinaria.serial_niv;
									document.querySelector('#maquinaria_modificar_serial_motor').value = maquinaria.serial_motor;
									document.querySelector('#maquinaria_modificar_serial_carroceria').value = maquinaria.serial_carroceria;
									document.querySelector('#maquinaria_modificar_serial_chasis').value = maquinaria.serial_chasis;
									document.querySelector('#maquinaria_modificar_tara').value = maquinaria.tara;
									document.querySelector('#maquinaria_modificar_capacidad_carga').value = maquinaria.capacidad_carga;
									document.querySelector('#maquinaria_modificar_tipo_combustible').value = maquinaria.tipo_combustible;
									document.querySelector('#maquinaria_modificar_capacidad_combustible').value = maquinaria.capacidad_combustible;
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar la maquinaria');
									console.log('Error buscar maquinaria: ' + error);
								});
	
								$('#modificarMaquinariaModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ninguna maquinaria');
							}
						}
				},
			];
		}

		var table = $('#tabla_maquinarias').DataTable({
			'dom': 'Bfrtip',
			'buttons': buttons,
			'autoWidth': false,
			'responsive': true,
			'pageLength': 5,
			'destroy': true,
			'scrollY': '560px',
			'scrollCollapse': true,
			'language': {'url': '/media/datatables-languages/es-ES_custom.json'},
			'ajax': {
				'url': isAdmin() ? '/api/maquinarias?admin=true' : '/api/maquinarias',
				'type': 'GET',
				'dataSrc': '',
				'error': function(jqXHR, ajaxOptions, thrownError) {
					toastr.error('Ha ocurrido un error al cargar la lista de maquinarias');
					console.log('Error buscar maquinarias: ' + thrownError);
				 }
			},
			'columns': [
				{'data': 'id'},
				{'data': 'placa'},
				{'data': 'marca'},
				{'data': 'modelo'},
				{'data': 'anio_fabricacion'},
				{'data': 'deshabilitado'},
				{'data': 'estado'},
			],
			'columnDefs': [
				{'class': 'd-none', 'orderable': false, 'targets': [0, 5]},
				{
					'width': 120,
					'targets': [-1],
					'render': function (data, type, row) {
						if(data == 'Disponible') {
							return `<span class='badge bg-success'>${data}</span>`;
						} else if(data == 'Deshabilitado') {
							return `<span class='badge bg-danger'>${data}</span>`;
						} else {
							return `<span class='badge bg-secondary'>${data}</span>`;
						}
					}
				},
			],
			'order': [[0, 'asc']]
		});

		$('#tabla_maquinarias tbody').off('click', 'tr').on('click', 'tr', function () {
			maquinarias_selected = document.querySelector('#maquinarias_selected_id');

			if(this.children[0].innerText != 'Ningún dato disponible en esta tabla') {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					maquinarias_selected.value = '';
				} else {
					table.$('tr.selected').removeClass('selected');
					$(this).addClass('selected');
					maquinarias_selected.value = this.children[0].innerText;
				}
	
				btn_disabled_value = (maquinarias_selected.value == '');
				maquinaria_deshabilitado_value = (this.children[5].innerText == 'true');
	
				table.button('btn_detalles_maquinaria:name').nodes().attr('disabled', btn_disabled_value);
				table.button('btn_modificar_maquinaria:name').nodes().attr('disabled', (btn_disabled_value || maquinaria_deshabilitado_value));

				table.button('btn_toggle_maquinaria:name').nodes().attr('disabled', btn_disabled_value);

				table.button('btn_toggle_maquinaria:name').text(maquinaria_deshabilitado_value ? '<i class="bi bi-patch-check"></i> Habilitar' : '<i class="bi bi-x-octagon"></i> Deshabilitar');
			}

		});
	} else if(tipo == 'trabajadores') {
		if(isAdmin()) {
			var buttons = [
				{
					'text': '<i class="bi bi-filetype-pdf"></i> Generar reporte',
					'attr':  {'id': 'btn_reporte_trabajador'},
					'action':
						function(e) {
							if($('#trabajadores_selected_id').val()) {
								$('#reporteTrabajadorModal').modal('show');
							} else {
								$('#reporteTrabajadorAllModal').modal('show');
							}
						}
				},
				{
					'text': '<i class="bi bi-plus-circle"></i> Registrar trabajador',
					'attr':  {'id': 'btn_agregar_trabajador'},
					'action':
						function(e) {
							$('#agregarTrabajadorModal').modal('show');
						}
				},
				{
					'name': 'btn_detalles_trabajador',
					'text': '<i class="bi bi-eye"></i> Ver detalles',
					'attr':  {'id': 'btn_detalles_trabajador', 'disabled': true},
					'action':
						function(e) {
							trabajadores_selected_id = document.querySelector('#trabajadores_selected_id').value;

							if(trabajadores_selected_id != '') {
								fetch('/api/trabajadores/' + trabajadores_selected_id)
								.then(response => response.json())
								.then(trabajador => {
									document.querySelector('#trabajador_detalles_cedula').value = trabajador.cedula;
									document.querySelector('#trabajador_detalles_primer_nombre').value = trabajador.first_name;
									document.querySelector('#trabajador_detalles_segundo_nombre').value = trabajador.middle_name;
									document.querySelector('#trabajador_detalles_primer_apellido').value = trabajador.last_name;
									document.querySelector('#trabajador_detalles_segundo_apellido').value = trabajador.last_name_2;
									document.querySelector('#trabajador_detalles_num_tlf').value = trabajador.num_tlf;
									document.querySelector('#trabajador_detalles_cargo').value = trabajador.cargo_display;
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el trabajador');
									console.log('Error buscar trabajador: ' + error);
								});

								$('#detallesTrabajadorModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún trabajador');
							}
						}
				},
				{
					'name': 'btn_modificar_trabajador',
					'text': '<i class="bi bi-pencil"></i> Modificar',
					'attr':  {'id': 'btn_modificar_trabajador', 'disabled': true},
					'action':
						function(e) {
							trabajadores_selected_id = document.querySelector('#trabajadores_selected_id').value;

							if(trabajadores_selected_id != '') {
								fetch('/api/trabajadores/' + trabajadores_selected_id)
								.then(response => response.json())
								.then(trabajador => {
									document.querySelector('#trabajador_modificar_cedula').value = trabajador.cedula;
									document.querySelector('#trabajador_modificar_primer_nombre').value = trabajador.first_name;
									document.querySelector('#trabajador_modificar_segundo_nombre').value = trabajador.middle_name;
									document.querySelector('#trabajador_modificar_primer_apellido').value = trabajador.last_name;
									document.querySelector('#trabajador_modificar_segundo_apellido').value = trabajador.last_name_2;
									document.querySelector('#trabajador_modificar_num_tlf').value = trabajador.num_tlf;
									document.querySelector('#trabajador_modificar_cargo').value = trabajador.cargo;
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el trabajador');
									console.log('Error buscar trabajador: ' + error);
								});

								$('#modificarTrabajadorModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún trabajador');
							}
						}
				},
				{
					'name': 'btn_toggle_trabajador',
					'text': '<i class="bi bi-x-octagon"></i> Deshabilitar',
					'attr':  {'id': 'btn_toggle_trabajador', 'disabled': true},
					'action':
						function(e) {
							if(e.target.innerText == ' Deshabilitar') {
								$('#deshabilitarTrabajadorModal').modal('show');
							} else if(e.target.innerText == ' Habilitar') {
								$('#habilitarTrabajadorModal').modal('show');
							}
						}
				}
			];
		} else {
			var buttons = [
				{
					'text': '<i class="bi bi-filetype-pdf"></i> Generar reporte',
					'attr':  {'id': 'btn_reporte_trabajador'},
					'action':
						function(e) {
							if($('#trabajadores_selected_id').val()) {
								$('#reporteTrabajadorModal').modal('show');
							} else {
								$('#reporteTrabajadorAllModal').modal('show');
							}
						}
				},
				{
					'text': '<i class="bi bi-plus-circle"></i> Registrar trabajador',
					'attr':  {'id': 'btn_agregar_trabajador'},
					'action':
						function(e) {
							$('#agregarTrabajadorModal').modal('show');
						}
				},
				{
					'name': 'btn_detalles_trabajador',
					'text': '<i class="bi bi-eye"></i> Ver detalles',
					'attr':  {'id': 'btn_detalles_trabajador', 'disabled': true},
					'action':
						function(e) {
							trabajadores_selected_id = document.querySelector('#trabajadores_selected_id').value;

							if(trabajadores_selected_id != '') {
								fetch('/api/trabajadores/' + trabajadores_selected_id)
								.then(response => response.json())
								.then(trabajador => {
									document.querySelector('#trabajador_detalles_cedula').value = trabajador.cedula;
									document.querySelector('#trabajador_detalles_primer_nombre').value = trabajador.first_name;
									document.querySelector('#trabajador_detalles_segundo_nombre').value = trabajador.middle_name;
									document.querySelector('#trabajador_detalles_primer_apellido').value = trabajador.last_name;
									document.querySelector('#trabajador_detalles_segundo_apellido').value = trabajador.last_name_2;
									document.querySelector('#trabajador_detalles_num_tlf').value = trabajador.num_tlf;
									document.querySelector('#trabajador_detalles_cargo').value = trabajador.cargo_display;
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el trabajador');
									console.log('Error buscar trabajador: ' + error);
								});

								$('#detallesTrabajadorModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún trabajador');
							}
						}
				},
				{
					'name': 'btn_modificar_trabajador',
					'text': '<i class="bi bi-pencil"></i> Modificar',
					'attr':  {'id': 'btn_modificar_trabajador', 'disabled': true},
					'action':
						function(e) {
							trabajadores_selected_id = document.querySelector('#trabajadores_selected_id').value;

							if(trabajadores_selected_id != '') {
								fetch('/api/trabajadores/' + trabajadores_selected_id)
								.then(response => response.json())
								.then(trabajador => {
									document.querySelector('#trabajador_modificar_cedula').value = trabajador.cedula;
									document.querySelector('#trabajador_modificar_primer_nombre').value = trabajador.first_name;
									document.querySelector('#trabajador_modificar_segundo_nombre').value = trabajador.middle_name;
									document.querySelector('#trabajador_modificar_primer_apellido').value = trabajador.last_name;
									document.querySelector('#trabajador_modificar_segundo_apellido').value = trabajador.last_name_2;
									document.querySelector('#trabajador_modificar_num_tlf').value = trabajador.num_tlf;
									document.querySelector('#trabajador_modificar_cargo').value = trabajador.cargo;
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el trabajador');
									console.log('Error buscar trabajador: ' + error);
								});

								$('#modificarTrabajadorModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún trabajador');
							}
						}
				}
			];
		}

		var table = $('#tabla_trabajadores').DataTable({
			'dom': 'Bfrtip',
			'buttons': buttons,
			'autoWidth': false,
			'responsive': true,
			'pageLength': 5,
			'destroy': true,
			'scrollY': '560px',
			'scrollCollapse': true,
			'language': {'url': '/media/datatables-languages/es-ES_custom.json'},
			'ajax': {
				'url': isAdmin() ? '/api/trabajadores?admin=true' : '/api/trabajadores',
				'type': 'GET',
				'dataSrc': '',
				'error': function(jqXHR, ajaxOptions, thrownError) {
					toastr.error('Ha ocurrido un error al cargar la lista de trabajadores');
					console.log('Error buscar trabajadores: ' + thrownError);
				 }
			},
			'columns': [
				{'data': 'id'},
				{'data': 'cedula'},
				{'data': 'names'},
				{'data': 'last_names'},
				{'data': 'num_tlf'},
				{'data': 'cargo_display'},
				{'data': 'deshabilitado'},
				{'data': 'estado'},
			],
			'columnDefs': [
				{'class': 'd-none', 'orderable': false, 'targets': [0, 6]},
				{
					'width': 120,
					'targets': [-1],
					'render': function (data, type, row) {
						if(data == 'Disponible') {
							return `<span class='badge bg-success'>${data}</span>`;
						} else if(data == 'Deshabilitado') {
							return `<span class='badge bg-danger'>${data}</span>`;
						} else {
							return `<span class='badge bg-secondary'>${data}</span>`;
						}
					}
				},
			],
			'order': [[0, 'asc']]
		});

		$('#tabla_trabajadores tbody').off('click', 'tr').on('click', 'tr', function () {
			trabajadores_selected = document.querySelector('#trabajadores_selected_id');

			if(this.children[0].innerText != 'Ningún dato disponible en esta tabla') {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					trabajadores_selected.value = '';
				} else {
					table.$('tr.selected').removeClass('selected');
					$(this).addClass('selected');
					trabajadores_selected.value = this.children[0].innerText;
				}
	
				btn_disabled_value = (trabajadores_selected.value == '');
				trabajador_deshabilitado_value = (this.children[6].innerText == 'true');
	
				table.button('btn_detalles_trabajador:name').nodes().attr('disabled', btn_disabled_value);
				table.button('btn_modificar_trabajador:name').nodes().attr('disabled', btn_disabled_value || trabajador_deshabilitado_value);

				table.button('btn_toggle_trabajador:name').nodes().attr('disabled', btn_disabled_value);

				table.button('btn_toggle_trabajador:name').text(trabajador_deshabilitado_value ? '<i class="bi bi-patch-check"></i> Habilitar' : '<i class="bi bi-x-octagon"></i> Deshabilitar');
			}
		});
	} else if(tipo == 'mantenimientos') {
		if(isAdmin()) {
			var buttons = [
				{
					'text': '<i class="bi bi-filetype-pdf"></i> Generar reporte',
					'attr':  {'id': 'btn_reporte_mantenimiento'},
					'action':
						function(e) {
							if($('#mantenimientos_selected_id').val()) {
								$('#reporteMantenimientoModal').modal('show');
							} else {
								$('#reporteMantenimientoAllModal').modal('show');
							}
						}
				},
				{
					'text': '<i class="bi bi-plus-circle"></i> Registrar mantenimiento',
					'attr':  {'id': 'btn_agregar_mantenimiento'},
					'action':
					function(e) {
						$('#agregarMantenimientoModal_Step_4').modal('hide');
						$('#agregarMantenimientoModal_Step_3').modal('hide');
						$('#agregarMantenimientoModal_Step_2').modal('hide');
						$('#agregarMantenimientoModal_Step_1').modal('show');
					}
				},
				{
					'name': 'btn_detalles_mantenimiento',
					'text': '<i class="bi bi-eye"></i> Ver detalles',
					'attr':  {'id': 'btn_detalles_mantenimiento', 'disabled': true},
					'action':
						function(e) {
							mantenimientos_selected_id = document.querySelector('#mantenimientos_selected_id').value;

							if(mantenimientos_selected_id != '') {
								fetch('/api/mantenimientos/' + mantenimientos_selected_id)
								.then(response => response.json())
								.then(mantenimiento => {
									document.querySelector('#maquinaria_detalles_placa').value = mantenimiento.maquinaria.placa;
									document.querySelector('#maquinaria_detalles_marca').value = mantenimiento.maquinaria.marca;
									document.querySelector('#maquinaria_detalles_anio_fabricacion').value = mantenimiento.maquinaria.anio_fabricacion;
									document.querySelector('#maquinaria_detalles_modelo').value = mantenimiento.maquinaria.modelo;
									document.querySelector('#maquinaria_detalles_estado').value = mantenimiento.maquinaria.estado;
									document.querySelector('#maquinaria_detalles_descripcion').value = mantenimiento.maquinaria.descripcion;
									document.querySelector('#maquinaria_detalles_color').value = mantenimiento.maquinaria.color;
									document.querySelector('#maquinaria_detalles_tipo').value = mantenimiento.maquinaria.tipo;
									document.querySelector('#maquinaria_detalles_clase').value = mantenimiento.maquinaria.clase;
									document.querySelector('#maquinaria_detalles_serial_niv').value = mantenimiento.maquinaria.serial_niv;
									document.querySelector('#maquinaria_detalles_serial_motor').value = mantenimiento.maquinaria.serial_motor;
									document.querySelector('#maquinaria_detalles_serial_carroceria').value = mantenimiento.maquinaria.serial_carroceria;
									document.querySelector('#maquinaria_detalles_serial_chasis').value = mantenimiento.maquinaria.serial_chasis;
									document.querySelector('#maquinaria_detalles_tara').value = mantenimiento.maquinaria.tara;
									document.querySelector('#maquinaria_detalles_capacidad_carga').value = mantenimiento.maquinaria.capacidad_carga;
									document.querySelector('#maquinaria_detalles_tipo_combustible').value = mantenimiento.maquinaria.tipo_combustible;
									document.querySelector('#maquinaria_detalles_capacidad_combustible').value = mantenimiento.maquinaria.capacidad_combustible;

									document.querySelector('#mantenimiento_detalles_tipo').value = mantenimiento.tipo_mantenimiento_display;
									document.querySelector('#mantenimiento_detalles_fecha').value = mantenimiento.fecha;
									document.querySelector('#mantenimiento_detalles_actividad').value = mantenimiento.actividad;
									document.querySelector('#mantenimiento_detalles_descripcion').value = mantenimiento.descripcion;
									document.querySelector('#mantenimiento_detalles_herramientas').value = mantenimiento.herramientas;
									document.querySelector('#mantenimiento_detalles_culminado_nota').value = mantenimiento.culminado_nota;
									document.querySelector('#mantenimiento_culminado_nota_container').style.display = mantenimiento.culminado ? 'block' : 'none';

									element_lista_gastos = document.querySelector('#mantenimiento_detalles_gastos');
									element_lista_gastos.innerHTML = '';

									if(mantenimiento.gastos_format.length > 0) {
										mantenimiento.gastos_format.forEach(gasto => {
											element = document.createElement('li');
											element.className = 'list-group-item d-flex justify-content-between align-items-center list-group-item-info';
											element.innerHTML = `
												${gasto.descripcion}
												<span class="badge bg-primary rounded-pill">$${gasto.monto}</span>
											`;
											element_lista_gastos.appendChild(element);
										});

										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-center list-group-item-dark';
										element.innerHTML = `
											Monto total
											<span class="badge bg-primary rounded-pill">$${mantenimiento.gastos_total}</span>
										`;
										element_lista_gastos.appendChild(element);
									} else {
										element_lista_gastos.innerHTML = '<p>No hay gastos registrados</p>';
									}

									element_lista_trabajadores = document.querySelector('#mantenimiento_detalles_trabajadores');
									element_lista_trabajadores.innerHTML = '';

									element = document.createElement('li');
									element.className = 'list-group-item d-flex justify-content-between align-items-start';
									element.innerHTML = `
										<div class="ms-2 me-auto">
										    <div class="fw-bold">${mantenimiento.supervisor.fullname} - ${mantenimiento.supervisor.cedula}</div>
										    Supervisor de mantenimiento
										</div>
									`;
									element_lista_trabajadores.appendChild(element);

									mantenimiento.mecanicos.forEach(mecanico => {
										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-start';
										element.innerHTML = `
											<div class="ms-2 me-auto">
											    <div class="fw-bold">${mecanico.fullname} - ${mecanico.cedula}</div>
											    Mecánico
											</div>
										`;
										element_lista_trabajadores.appendChild(element);
									});

									mantenimiento.ayudantes.forEach(ayudante => {
										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-start';
										element.innerHTML = `
											<div class="ms-2 me-auto">
											    <div class="fw-bold">${ayudante.fullname} - ${ayudante.cedula}</div>
											    Ayudante de mecánico
											</div>
										`;
										element_lista_trabajadores.appendChild(element);
									});
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar mantenimiento');
									console.log('Error buscar mantenimiento: ' + error);
								});

								$('#detallesMantenimientoModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún mantenimiento');
							}
						}
				},
				{
					'name': 'btn_modificar_mantenimiento',
					'text': '<i class="bi bi-pencil"></i> Modificar',
					'attr':  {'id': 'btn_modificar_mantenimiento', 'disabled': true},
					'action':
						function(e) {
							mantenimientos_selected_id = document.querySelector('#mantenimientos_selected_id').value;

							if(mantenimientos_selected_id != '') {
								fetch('/api/mantenimientos/' + mantenimientos_selected_id)
								.then(response => response.json())
								.then(mantenimiento => {
									if(!mantenimiento.culminado) {
										document.querySelector('#mantenimiento_modificar_tipo').value = mantenimiento.tipo_mantenimiento;
										document.querySelector('#mantenimiento_modificar_fecha').value = mantenimiento.fecha;
										document.querySelector('#mantenimiento_modificar_actividad').value = mantenimiento.actividad;
										document.querySelector('#mantenimiento_modificar_descripcion').value = mantenimiento.descripcion;
										document.querySelector('#mantenimiento_modificar_herramientas').value = mantenimiento.herramientas;

										document.querySelector('#mantenimiento_modificar_maquinaria_id').value = mantenimiento.maquinaria.id;
										document.querySelector('#mantenimiento_modificar_supervisor_id').value = mantenimiento.supervisor_id;
										document.querySelector('#mantenimiento_modificar_mecanicos_id').value = mantenimiento.mecanicos_id;
										document.querySelector('#mantenimiento_modificar_ayudantes_id').value = mantenimiento.ayudantes_id;
										document.querySelector('#mantenimiento_modificar_gastos_string').value = mantenimiento.gastos;

										$('#modificarMantenimientoModal_Step_2').modal('hide');
										$('#modificarMantenimientoModal_Step_3').modal('hide');
										$('#modificarMantenimientoModal_Step_1').modal('show');
									} else {
										toastr.warning('Los mantenimientos culminados no pueden ser modificados');
									}
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el mantenimiento');
									console.log('Error buscar mantenimiento: ' + error);
								});
							} else {
								toastr.info('No se ha seleccionado ningún mantenimiento');
							}
						}
				}
			];
		} else {
			var buttons = [
				{
					'text': '<i class="bi bi-filetype-pdf"></i> Generar reporte',
					'attr':  {'id': 'btn_reporte_mantenimiento'},
					'action':
						function(e) {
							if($('#mantenimientos_selected_id').val()) {
								$('#reporteMantenimientoModal').modal('show');
							} else {
								$('#reporteMantenimientoAllModal').modal('show');
							}
						}
				},
				{
					'text': '<i class="bi bi-plus-circle"></i> Registrar mantenimiento',
					'attr':  {'id': 'btn_agregar_mantenimiento'},
					'action':
					function(e) {
						$('#agregarMantenimientoModal_Step_4').modal('hide');
						$('#agregarMantenimientoModal_Step_3').modal('hide');
						$('#agregarMantenimientoModal_Step_2').modal('hide');
						$('#agregarMantenimientoModal_Step_1').modal('show');
					}
				},
				{
					'name': 'btn_detalles_mantenimiento',
					'text': '<i class="bi bi-eye"></i> Ver detalles',
					'attr':  {'id': 'btn_detalles_mantenimiento', 'disabled': true},
					'action':
						function(e) {
							mantenimientos_selected_id = document.querySelector('#mantenimientos_selected_id').value;

							if(mantenimientos_selected_id != '') {
								fetch('/api/mantenimientos/' + mantenimientos_selected_id)
								.then(response => response.json())
								.then(mantenimiento => {
									document.querySelector('#maquinaria_detalles_placa').value = mantenimiento.maquinaria.placa;
									document.querySelector('#maquinaria_detalles_marca').value = mantenimiento.maquinaria.marca;
									document.querySelector('#maquinaria_detalles_anio_fabricacion').value = mantenimiento.maquinaria.anio_fabricacion;
									document.querySelector('#maquinaria_detalles_modelo').value = mantenimiento.maquinaria.modelo;
									document.querySelector('#maquinaria_detalles_estado').value = mantenimiento.maquinaria.estado;
									document.querySelector('#maquinaria_detalles_descripcion').value = mantenimiento.maquinaria.descripcion;
									document.querySelector('#maquinaria_detalles_color').value = mantenimiento.maquinaria.color;
									document.querySelector('#maquinaria_detalles_tipo').value = mantenimiento.maquinaria.tipo;
									document.querySelector('#maquinaria_detalles_clase').value = mantenimiento.maquinaria.clase;
									document.querySelector('#maquinaria_detalles_serial_niv').value = mantenimiento.maquinaria.serial_niv;
									document.querySelector('#maquinaria_detalles_serial_motor').value = mantenimiento.maquinaria.serial_motor;
									document.querySelector('#maquinaria_detalles_serial_carroceria').value = mantenimiento.maquinaria.serial_carroceria;
									document.querySelector('#maquinaria_detalles_serial_chasis').value = mantenimiento.maquinaria.serial_chasis;
									document.querySelector('#maquinaria_detalles_tara').value = mantenimiento.maquinaria.tara;
									document.querySelector('#maquinaria_detalles_capacidad_carga').value = mantenimiento.maquinaria.capacidad_carga;
									document.querySelector('#maquinaria_detalles_tipo_combustible').value = mantenimiento.maquinaria.tipo_combustible;
									document.querySelector('#maquinaria_detalles_capacidad_combustible').value = mantenimiento.maquinaria.capacidad_combustible;

									document.querySelector('#mantenimiento_detalles_tipo').value = mantenimiento.tipo_mantenimiento_display;
									document.querySelector('#mantenimiento_detalles_fecha').value = mantenimiento.fecha;
									document.querySelector('#mantenimiento_detalles_actividad').value = mantenimiento.actividad;
									document.querySelector('#mantenimiento_detalles_descripcion').value = mantenimiento.descripcion;
									document.querySelector('#mantenimiento_detalles_herramientas').value = mantenimiento.herramientas;
									document.querySelector('#mantenimiento_detalles_culminado_nota').value = mantenimiento.culminado_nota;
									document.querySelector('#mantenimiento_culminado_nota_container').style.display = mantenimiento.culminado ? 'block' : 'none';

									element_lista_gastos = document.querySelector('#mantenimiento_detalles_gastos');
									element_lista_gastos.innerHTML = '';

									if(mantenimiento.gastos_format.length > 0) {
										mantenimiento.gastos_format.forEach(gasto => {
											element = document.createElement('li');
											element.className = 'list-group-item d-flex justify-content-between align-items-center list-group-item-info';
											element.innerHTML = `
												${gasto.descripcion}
												<span class="badge bg-primary rounded-pill">$${gasto.monto}</span>
											`;
											element_lista_gastos.appendChild(element);
										});

										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-center list-group-item-dark';
										element.innerHTML = `
											Monto total
											<span class="badge bg-primary rounded-pill">$${mantenimiento.gastos_total}</span>
										`;
										element_lista_gastos.appendChild(element);
									} else {
										element_lista_gastos.innerHTML = '<p>No hay gastos registrados</p>';
									}

									element_lista_trabajadores = document.querySelector('#mantenimiento_detalles_trabajadores');
									element_lista_trabajadores.innerHTML = '';

									element = document.createElement('li');
									element.className = 'list-group-item d-flex justify-content-between align-items-start';
									element.innerHTML = `
										<div class="ms-2 me-auto">
										    <div class="fw-bold">${mantenimiento.supervisor.fullname} - ${mantenimiento.supervisor.cedula}</div>
										    Supervisor de mantenimiento
										</div>
									`;
									element_lista_trabajadores.appendChild(element);

									mantenimiento.mecanicos.forEach(mecanico => {
										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-start';
										element.innerHTML = `
											<div class="ms-2 me-auto">
											    <div class="fw-bold">${mecanico.fullname} - ${mecanico.cedula}</div>
											    Mecánico
											</div>
										`;
										element_lista_trabajadores.appendChild(element);
									});

									mantenimiento.ayudantes.forEach(ayudante => {
										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-start';
										element.innerHTML = `
											<div class="ms-2 me-auto">
											    <div class="fw-bold">${ayudante.fullname} - ${ayudante.cedula}</div>
											    Ayudante de mecánico
											</div>
										`;
										element_lista_trabajadores.appendChild(element);
									});
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar mantenimiento');
									console.log('Error buscar mantenimiento: ' + error);
								});

								$('#detallesMantenimientoModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún mantenimiento');
							}
						}
				},
				{
					'name': 'btn_modificar_mantenimiento',
					'text': '<i class="bi bi-pencil"></i> Modificar',
					'attr':  {'id': 'btn_modificar_mantenimiento', 'disabled': true},
					'action':
						function(e) {
							mantenimientos_selected_id = document.querySelector('#mantenimientos_selected_id').value;

							if(mantenimientos_selected_id != '') {
								fetch('/api/mantenimientos/' + mantenimientos_selected_id)
								.then(response => response.json())
								.then(mantenimiento => {
									if(!mantenimiento.culminado) {
										document.querySelector('#mantenimiento_modificar_tipo').value = mantenimiento.tipo_mantenimiento;
										document.querySelector('#mantenimiento_modificar_fecha').value = mantenimiento.fecha;
										document.querySelector('#mantenimiento_modificar_actividad').value = mantenimiento.actividad;
										document.querySelector('#mantenimiento_modificar_descripcion').value = mantenimiento.descripcion;
										document.querySelector('#mantenimiento_modificar_herramientas').value = mantenimiento.herramientas;

										document.querySelector('#mantenimiento_modificar_maquinaria_id').value = mantenimiento.maquinaria.id;
										document.querySelector('#mantenimiento_modificar_supervisor_id').value = mantenimiento.supervisor_id;
										document.querySelector('#mantenimiento_modificar_mecanicos_id').value = mantenimiento.mecanicos_id;
										document.querySelector('#mantenimiento_modificar_ayudantes_id').value = mantenimiento.ayudantes_id;
										document.querySelector('#mantenimiento_modificar_gastos_string').value = mantenimiento.gastos;

										$('#modificarMantenimientoModal_Step_2').modal('hide');
										$('#modificarMantenimientoModal_Step_3').modal('hide');
										$('#modificarMantenimientoModal_Step_1').modal('show');
									} else {
										toastr.warning('Los mantenimientos culminados no pueden ser modificados');
									}
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el mantenimiento');
									console.log('Error buscar mantenimiento: ' + error);
								});
							} else {
								toastr.info('No se ha seleccionado ningún mantenimiento');
							}
						}
				}
			];
		}

		var table = $('#tabla_mantenimientos').DataTable({
			'dom': 'Bfrtip',
			'buttons': buttons,
			'autoWidth': false,
			'responsive': true,
			'pageLength': 5,
			'destroy': true,
			'scrollY': '560px',
			'scrollCollapse': true,
			'language': {'url': '/media/datatables-languages/es-ES_custom.json'},
			'ajax': {
				'url': '/api/mantenimientos',
				'type': 'GET',
				'dataSrc': '',
				'error': function(jqXHR, ajaxOptions, thrownError) {
					toastr.error('Ha ocurrido un error al cargar la lista de mantenimientos');
					console.log('Error buscar mantenimientos: ' + thrownError);
				 }
			},
			'columns': [
				{'data': 'id'},
				{'data': 'maquinaria_display'},
				{'data': 'tipo_mantenimiento_display'},
				{'data': 'fecha'},
				{'data': 'cancelado'},
				{'data': 'estado'},
			],
			'columnDefs': [
				{'class': 'd-none', 'orderable': false, 'targets': [0, 4]},
				{
					'targets': [-1],
					'width': '25px',
					'render': function (data, type, row) {
						if(row.estado == 'Ejecutado') {
							return `<span class='badge bg-success'>${data}</span>`;
						} else if(row.estado == 'Cancelado') {
							return `<span class='badge bg-danger'>${data}</span>`;
						} else if(row.estado == 'Sin culminar') {
							return `
								<button type="button" class="btn btn-warning btn-sm btn_establecer_culminado">
									<i class="bi bi-bookmark-check-fill"></i> Sin culminar
								</button>
								<button type="button" class="btn btn-danger btn-sm btn_establecer_cancelado">
									<i class="bi bi-clipboard-x"></i> Cancelar
								</button>
							`;
						} else {
							return `<span class='badge bg-secondary'>${data}</span>`;
						}
					}
				},
			],
			'order': [[0, 'asc']]
		});

		table.column(5).search('Sin culminar').draw();

		$('#mantenimientos_btn_filtro_ejecutados').on('click', function() {
			table.column(5).search('Ejecutado').draw();
		});

		$('#mantenimientos_btn_filtro_cancelados').on('click', function() {
			table.column(5).search('Cancelado').draw();
		});

		$('#mantenimientos_btn_filtro_sin_culminar').on('click', function() {
			table.column(5).search('Sin culminar').draw();
		});

		$('#tabla_mantenimientos tbody').off('click', 'tr').on('click', 'tr', function () {
			mantenimientos_selected = document.querySelector('#mantenimientos_selected_id');

			if(this.children[0].innerText != 'Ningún dato disponible en esta tabla') {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					mantenimientos_selected.value = '';
				} else {
					table.$('tr.selected').removeClass('selected');
					$(this).addClass('selected');
					mantenimientos_selected.value = this.children[0].innerText;
				}
	
				btn_disabled_value = (mantenimientos_selected.value == '');
				mantenimientos_cancelado_value = (this.children[5].innerText == 'true');
	
				table.button('btn_detalles_mantenimiento:name').nodes().attr('disabled', btn_disabled_value);
				table.button('btn_modificar_mantenimiento:name').nodes().attr('disabled', btn_disabled_value || mantenimientos_cancelado_value);
				//table.button('btn_eliminar_mantenimiento:name').nodes().attr('disabled', btn_disabled_value);
			}

		});
	} else if(tipo == 'proyectos') {
		if(isAdmin()) {
			var buttons = [
				{
					'text': '<i class="bi bi-filetype-pdf"></i> Generar reporte',
					'attr':  {'id': 'btn_reporte_proyecto'},
					'action':
						function(e) {
							if($('#proyectos_selected_id').val()) {
								$('#reporteProyectoModal').modal('show');
							} else {
								$('#reporteProyectoAllModal').modal('show');
							}
						}
				},
				{
					'text': '<i class="bi bi-plus-circle"></i> Registrar proyecto',
					'attr':  {'id': 'btn_agregar_proyecto'},
					'action':
						function(e) {
							$('#agregarProyectoModal_Step_2').modal('hide');
							$('#agregarProyectoModal_Step_3').modal('hide');
							$('#agregarProyectoModal_Step_1').modal('show');
						}
				},
				{
					'name': 'btn_detalles_proyecto',
					'text': '<i class="bi bi-eye"></i> Ver detalles',
					'attr':  {'id': 'btn_detalles_proyecto', 'disabled': true},
					'action':
						function(e) {
							proyectos_selected_id = document.querySelector('#proyectos_selected_id').value;

							if(proyectos_selected_id != '') {
								fetch('/api/proyectos/' + proyectos_selected_id)
								.then(response => response.json())
								.then(proyecto => {
									document.querySelector('#proyecto_detalles_nombre').value = proyecto.nombre;
									document.querySelector('#proyecto_detalles_fecha_inicio').value = proyecto.fecha_inicio;
									document.querySelector('#proyecto_detalles_fecha_finalizacion').value = proyecto.fecha_finalizacion;
									document.querySelector('#proyecto_detalles_descripcion').value = proyecto.descripcion;
									document.querySelector('#proyecto_detalles_lugar').value = proyecto.lugar;
									document.querySelector('#proyecto_detalles_culminado_nota').value = proyecto.culminado_nota;
									document.querySelector('#proyecto_culminado_nota_container').style.display = proyecto.culminado ? 'block' : 'none';

									element_lista_maquinarias = document.querySelector('#proyecto_detalles_maquinarias');
									element_lista_maquinarias.innerHTML = '';

									proyecto.maquinarias.forEach(maquinaria => {
										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-start';
										element.innerHTML = `
											<div class="ms-2 me-auto">
											    <div class="fw-bold">${maquinaria.maquinaria_display}</div>
											</div>
										`;
										element_lista_maquinarias.appendChild(element);
									});

									element_lista_choferes = document.querySelector('#proyecto_detalles_choferes');
									element_lista_choferes.innerHTML = '';

									proyecto.choferes.forEach(chofer => {
										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-start';
										element.innerHTML = `
											<div class="ms-2 me-auto">
											    <div class="fw-bold">${chofer.fullname} - ${chofer.cedula}</div>
											</div>
										`;
										element_lista_choferes.appendChild(element);
									});

								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el proyecto');
									console.log('Error buscar proyecto: ' + error);
								});

								$('#detallesProyectoModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún proyecto');
							}
						}
				},
				{
					'name': 'btn_modificar_proyecto',
					'text': '<i class="bi bi-pencil"></i> Modificar',
					'attr':  {'id': 'btn_modificar_proyecto', 'disabled': true},
					'action':
						function(e) {
							proyectos_selected_id = document.querySelector('#proyectos_selected_id').value;

							if(proyectos_selected_id != '') {
								fetch('/api/proyectos/' + proyectos_selected_id)
								.then(response => response.json())
								.then(proyecto => {
									if(!proyecto.culminado) {
										document.querySelector('#proyecto_modificar_nombre').value = proyecto.nombre;
										document.querySelector('#proyecto_modificar_fecha_inicio').value = proyecto.fecha_inicio;
										document.querySelector('#proyecto_modificar_fecha_finalizacion').value = proyecto.fecha_finalizacion;
										document.querySelector('#proyecto_modificar_descripcion').value = proyecto.descripcion;
										document.querySelector('#proyecto_modificar_lugar').value = proyecto.lugar;
										document.querySelector('#proyecto_modificar_maquinarias_id').value = proyecto.maquinarias_id;
										document.querySelector('#proyecto_modificar_choferes_id').value = proyecto.choferes_id;

										$('#modificarProyectoModal_Step_2').modal('hide');
										$('#modificarProyectoModal_Step_3').modal('hide');
										$('#modificarProyectoModal_Step_1').modal('show');
									} else {
										toastr.warning('Los proyectos culminados no pueden ser modificados');
									}
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el proyecto');
									console.log('Error buscar proyecto: ' + error);
								});
							} else {
								toastr.info('No se ha seleccionado ningún proyecto');
							}
						}
				}
			];
		} else {
			var buttons = [
				{
					'text': '<i class="bi bi-filetype-pdf"></i> Generar reporte',
					'attr':  {'id': 'btn_reporte_proyecto'},
					'action':
						function(e) {
							if($('#proyectos_selected_id').val()) {
								$('#reporteProyectoModal').modal('show');
							} else {
								$('#reporteProyectoAllModal').modal('show');
							}
						}
				},
				{
					'text': '<i class="bi bi-plus-circle"></i> Registrar proyecto',
					'attr':  {'id': 'btn_agregar_proyecto'},
					'action':
						function(e) {
							$('#agregarProyectoModal_Step_2').modal('hide');
							$('#agregarProyectoModal_Step_3').modal('hide');
							$('#agregarProyectoModal_Step_1').modal('show');
						}
				},
				{
					'name': 'btn_detalles_proyecto',
					'text': '<i class="bi bi-eye"></i> Ver detalles',
					'attr':  {'id': 'btn_detalles_proyecto', 'disabled': true},
					'action':
						function(e) {
							proyectos_selected_id = document.querySelector('#proyectos_selected_id').value;

							if(proyectos_selected_id != '') {
								fetch('/api/proyectos/' + proyectos_selected_id)
								.then(response => response.json())
								.then(proyecto => {
									document.querySelector('#proyecto_detalles_nombre').value = proyecto.nombre;
									document.querySelector('#proyecto_detalles_fecha_inicio').value = proyecto.fecha_inicio;
									document.querySelector('#proyecto_detalles_fecha_finalizacion').value = proyecto.fecha_finalizacion;
									document.querySelector('#proyecto_detalles_descripcion').value = proyecto.descripcion;
									document.querySelector('#proyecto_detalles_lugar').value = proyecto.lugar;
									document.querySelector('#proyecto_detalles_culminado_nota').value = proyecto.culminado_nota;
									document.querySelector('#proyecto_culminado_nota_container').style.display = proyecto.culminado ? 'block' : 'none';

									element_lista_maquinarias = document.querySelector('#proyecto_detalles_maquinarias');
									element_lista_maquinarias.innerHTML = '';

									proyecto.maquinarias.forEach(maquinaria => {
										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-start';
										element.innerHTML = `
											<div class="ms-2 me-auto">
											    <div class="fw-bold">${maquinaria.maquinaria_display}</div>
											</div>
										`;
										element_lista_maquinarias.appendChild(element);
									});

									element_lista_choferes = document.querySelector('#proyecto_detalles_choferes');
									element_lista_choferes.innerHTML = '';

									proyecto.choferes.forEach(chofer => {
										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-start';
										element.innerHTML = `
											<div class="ms-2 me-auto">
											    <div class="fw-bold">${chofer.fullname} - ${chofer.cedula}</div>
											</div>
										`;
										element_lista_choferes.appendChild(element);
									});

								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el proyecto');
									console.log('Error buscar proyecto: ' + error);
								});

								$('#detallesProyectoModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún proyecto');
							}
						}
				},
				{
					'name': 'btn_modificar_proyecto',
					'text': '<i class="bi bi-pencil"></i> Modificar',
					'attr':  {'id': 'btn_modificar_proyecto', 'disabled': true},
					'action':
						function(e) {
							proyectos_selected_id = document.querySelector('#proyectos_selected_id').value;

							if(proyectos_selected_id != '') {
								fetch('/api/proyectos/' + proyectos_selected_id)
								.then(response => response.json())
								.then(proyecto => {
									if(!proyecto.culminado) {
										document.querySelector('#proyecto_modificar_nombre').value = proyecto.nombre;
										document.querySelector('#proyecto_modificar_fecha_inicio').value = proyecto.fecha_inicio;
										document.querySelector('#proyecto_modificar_fecha_finalizacion').value = proyecto.fecha_finalizacion;
										document.querySelector('#proyecto_modificar_descripcion').value = proyecto.descripcion;
										document.querySelector('#proyecto_modificar_lugar').value = proyecto.lugar;
										document.querySelector('#proyecto_modificar_maquinarias_id').value = proyecto.maquinarias_id;
										document.querySelector('#proyecto_modificar_choferes_id').value = proyecto.choferes_id;

										$('#modificarProyectoModal_Step_2').modal('hide');
										$('#modificarProyectoModal_Step_3').modal('hide');
										$('#modificarProyectoModal_Step_1').modal('show');
									} else {
										toastr.warning('Los proyectos culminados no pueden ser modificados');
									}
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el proyecto');
									console.log('Error buscar proyecto: ' + error);
								});
							} else {
								toastr.info('No se ha seleccionado ningún proyecto');
							}
						}
				}
			];
		}

		var table = $('#tabla_proyectos').DataTable({
			'dom': 'Bfrtip',
			'buttons': buttons,
			'autoWidth': false,
			'responsive': true,
			'pageLength': 5,
			'destroy': true,
			'scrollY': '560px',
			'scrollCollapse': true,
			'language': {'url': '/media/datatables-languages/es-ES_custom.json'},
			'ajax': {
				'url': '/api/proyectos',
				'type': 'GET',
				'dataSrc': '',
				'error': function(jqXHR, ajaxOptions, thrownError) {
					toastr.error('Ha ocurrido un error al cargar la lista de proyectos');
					console.log('Error buscar proyectos: ' + thrownError);
				 }
			},
			'columns': [
				{'data': 'id'},
				{'data': 'nombre'},
				{'data': 'fecha_inicio'},
				{'data': 'fecha_finalizacion'},
				{'data': 'cancelado'},
				{'data': 'estado'},
			],
			'columnDefs': [
				{'class': 'd-none', 'orderable': false, 'targets': [0, 4]},
				{
					'targets': [-1],
					'width': '25px',
					'render': function (data, type, row) {
						if(row.estado == 'Ejecutado') {
							return `<span class='badge bg-success'>${data}</span>`;
						} else if(row.estado == 'Cancelado') {
							return `<span class='badge bg-danger'>${data}</span>`;
						} else if(row.estado == 'Sin culminar') {
							return `
								<button type="button" class="btn btn-warning btn-sm btn_establecer_culminado">
									<i class="bi bi-bookmark-check-fill"></i> Sin culminar
								</button>
								<button type="button" class="btn btn-danger btn-sm btn_establecer_cancelado">
									<i class="bi bi-clipboard-x"></i> Cancelar
								</button>
							`;
						} else {
							return `<span class='badge bg-secondary'>${data}</span>`;
						}
					}
				},
			],
			'order': [[0, 'asc']]
		});

		table.column(5).search('Sin culminar').draw();

		$('#proyectos_btn_filtro_ejecutados').on('click', function() {
			table.column(5).search('Ejecutado').draw();
		});

		$('#proyectos_btn_filtro_cancelados').on('click', function() {
			table.column(5).search('Cancelado').draw();
		});

		$('#proyectos_btn_filtro_sin_culminar').on('click', function() {
			table.column(5).search('Sin culminar').draw();
		});

		$('#tabla_proyectos tbody').off('click', 'tr').on('click', 'tr', function () {
			proyectos_selected = document.querySelector('#proyectos_selected_id');

			if(this.children[0].innerText != 'Ningún dato disponible en esta tabla') {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					proyectos_selected.value = '';
				} else {
					table.$('tr.selected').removeClass('selected');
					$(this).addClass('selected');
					proyectos_selected.value = this.children[0].innerText;
				}
	
				btn_disabled_value = (proyectos_selected.value == '');
				proyectos_cancelado_value = (this.children[4].innerText == 'true');
	
				table.button('btn_detalles_proyecto:name').nodes().attr('disabled', btn_disabled_value);
				table.button('btn_modificar_proyecto:name').nodes().attr('disabled', btn_disabled_value || proyectos_cancelado_value);
				//table.button('btn_eliminar_proyecto:name').nodes().attr('disabled', btn_disabled_value);
			}

		});
	} else if(tipo == 'clientes') {
		if(isAdmin()) {
			var buttons = [
				{
					'text': '<i class="bi bi-filetype-pdf"></i> Generar reporte',
					'attr':  {'id': 'btn_reporte_cliente'},
					'action':
						function(e) {
							if($('#clientes_selected_id').val()) {
								$('#reporteClienteModal').modal('show');
							} else {
								$('#reporteClienteAllModal').modal('show');
							}
						}
				},
				{
					'text': '<i class="bi bi-plus-circle"></i> Registrar cliente',
					'attr':  {'id': 'btn_agregar_cliente'},
					'action':
						function(e) {
							$('#agregarClienteModal').modal('show');
						}
				},
				{
					'name': 'btn_detalles_cliente',
					'text': '<i class="bi bi-eye"></i> Ver detalles',
					'attr':  {'id': 'btn_detalles_cliente', 'disabled': true},
					'action':
						function(e) {
							clientes_selected_id = document.querySelector('#clientes_selected_id').value;

							if(clientes_selected_id != '') {
								fetch('/api/clientes/' + clientes_selected_id)
								.then(response => response.json())
								.then(cliente => {
									document.querySelector('#cliente_detalles_cedula').value = cliente.cedula;
									document.querySelector('#cliente_detalles_primer_nombre').value = cliente.first_name;
									document.querySelector('#cliente_detalles_segundo_nombre').value = cliente.middle_name;
									document.querySelector('#cliente_detalles_primer_apellido').value = cliente.last_name;
									document.querySelector('#cliente_detalles_segundo_apellido').value = cliente.last_name_2;
									document.querySelector('#cliente_detalles_num_tlf').value = cliente.num_tlf;
									document.querySelector('#cliente_detalles_direccion').value = cliente.direccion;
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el cliente');
									console.log('Error buscar cliente: ' + error);
								});

								$('#detallesClienteModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún cliente');
							}
						}
				},
				{
					'name': 'btn_modificar_cliente',
					'text': '<i class="bi bi-pencil"></i> Modificar',
					'attr':  {'id': 'btn_modificar_cliente', 'disabled': true},
					'action':
						function(e) {
							clientes_selected_id = document.querySelector('#clientes_selected_id').value;

							if(clientes_selected_id != '') {
								fetch('/api/clientes/' + clientes_selected_id)
								.then(response => response.json())
								.then(cliente => {
									document.querySelector('#cliente_modificar_cedula').value = cliente.cedula;
									document.querySelector('#cliente_modificar_primer_nombre').value = cliente.first_name;
									document.querySelector('#cliente_modificar_segundo_nombre').value = cliente.middle_name;
									document.querySelector('#cliente_modificar_primer_apellido').value = cliente.last_name;
									document.querySelector('#cliente_modificar_segundo_apellido').value = cliente.last_name_2;
									document.querySelector('#cliente_modificar_num_tlf').value = cliente.num_tlf;
									document.querySelector('#cliente_modificar_direccion').value = cliente.direccion;
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el cliente');
									console.log('Error buscar cliente: ' + error);
								});

								$('#modificarClienteModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún cliente');
							}
						}
				}
			];
		} else {
			var buttons = [
				{
					'text': '<i class="bi bi-filetype-pdf"></i> Generar reporte',
					'attr':  {'id': 'btn_reporte_cliente'},
					'action':
						function(e) {
							if($('#clientes_selected_id').val()) {
								$('#reporteClienteModal').modal('show');
							} else {
								$('#reporteClienteAllModal').modal('show');
							}
						}
				},
				{
					'text': '<i class="bi bi-plus-circle"></i> Registrar cliente',
					'attr':  {'id': 'btn_agregar_cliente'},
					'action':
						function(e) {
							$('#agregarClienteModal').modal('show');
						}
				},
				{
					'name': 'btn_detalles_cliente',
					'text': '<i class="bi bi-eye"></i> Ver detalles',
					'attr':  {'id': 'btn_detalles_cliente', 'disabled': true},
					'action':
						function(e) {
							clientes_selected_id = document.querySelector('#clientes_selected_id').value;

							if(clientes_selected_id != '') {
								fetch('/api/clientes/' + clientes_selected_id)
								.then(response => response.json())
								.then(cliente => {
									document.querySelector('#cliente_detalles_cedula').value = cliente.cedula;
									document.querySelector('#cliente_detalles_primer_nombre').value = cliente.first_name;
									document.querySelector('#cliente_detalles_segundo_nombre').value = cliente.middle_name;
									document.querySelector('#cliente_detalles_primer_apellido').value = cliente.last_name;
									document.querySelector('#cliente_detalles_segundo_apellido').value = cliente.last_name_2;
									document.querySelector('#cliente_detalles_num_tlf').value = cliente.num_tlf;
									document.querySelector('#cliente_detalles_direccion').value = cliente.direccion;
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el cliente');
									console.log('Error buscar cliente: ' + error);
								});

								$('#detallesClienteModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún cliente');
							}
						}
				},
				{
					'name': 'btn_modificar_cliente',
					'text': '<i class="bi bi-pencil"></i> Modificar',
					'attr':  {'id': 'btn_modificar_cliente', 'disabled': true},
					'action':
						function(e) {
							clientes_selected_id = document.querySelector('#clientes_selected_id').value;

							if(clientes_selected_id != '') {
								fetch('/api/clientes/' + clientes_selected_id)
								.then(response => response.json())
								.then(cliente => {
									document.querySelector('#cliente_modificar_cedula').value = cliente.cedula;
									document.querySelector('#cliente_modificar_primer_nombre').value = cliente.first_name;
									document.querySelector('#cliente_modificar_segundo_nombre').value = cliente.middle_name;
									document.querySelector('#cliente_modificar_primer_apellido').value = cliente.last_name;
									document.querySelector('#cliente_modificar_segundo_apellido').value = cliente.last_name_2;
									document.querySelector('#cliente_modificar_num_tlf').value = cliente.num_tlf;
									document.querySelector('#cliente_modificar_direccion').value = cliente.direccion;
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el cliente');
									console.log('Error buscar cliente: ' + error);
								});

								$('#modificarClienteModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún cliente');
							}
						}
				}
			];
		}

		var table = $('#tabla_clientes').DataTable({
			'dom': 'Bfrtip',
			'buttons': buttons,
			'autoWidth': false,
			'responsive': true,
			'pageLength': 5,
			'destroy': true,
			'scrollY': '560px',
			'scrollCollapse': true,
			'language': {'url': '/media/datatables-languages/es-ES_custom.json'},
			'ajax': {
				'url': '/api/clientes',
				'type': 'GET',
				'dataSrc': '',
				'error': function(jqXHR, ajaxOptions, thrownError) {
					toastr.error('Ha ocurrido un error al cargar la lista de clientes');
					console.log('Error buscar clientes: ' + thrownError);
				 }
			},
			'columns': [
				{'data': 'id'},
				{'data': 'cedula'},
				{'data': 'names'},
				{'data': 'last_names'},
				{'data': 'num_tlf'},
			],
			'columnDefs': [
				{'class': 'd-none', 'orderable': false, 'targets': [0]},
			],
			'order': [[0, 'asc']]
		});

		$('#tabla_clientes tbody').off('click', 'tr').on('click', 'tr', function () {
			clientes_selected = document.querySelector('#clientes_selected_id');

			if(this.children[0].innerText != 'Ningún dato disponible en esta tabla') {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					clientes_selected.value = '';
				} else {
					table.$('tr.selected').removeClass('selected');
					$(this).addClass('selected');
					clientes_selected.value = this.children[0].innerText;
				}
	
				btn_disabled_value = (clientes_selected.value == '')
	
				table.button('btn_detalles_cliente:name').nodes().attr('disabled', btn_disabled_value);
				table.button('btn_modificar_cliente:name').nodes().attr('disabled', btn_disabled_value);
				table.button('btn_eliminar_cliente:name').nodes().attr('disabled', btn_disabled_value);
			}

		});
	} else if(tipo == 'alquileres') {
		if(isAdmin()) {
			var buttons = [
				{
					'text': '<i class="bi bi-filetype-pdf"></i> Generar reporte',
					'attr':  {'id': 'btn_reporte_alquiler'},
					'action':
						function(e) {
							if($('#alquileres_selected_id').val()) {
								$('#reporteAlquilerModal').modal('show');
							} else {
								$('#reporteAlquilerAllModal').modal('show');
							}
						}
				},
				{
					'text': '<i class="bi bi-plus-circle"></i> Registrar alquiler',
					'attr':  {'id': 'btn_agregar_alquiler'},
					'action':
						function(e) {
							$('#agregarAlquilerModal_Step_2').modal('hide');
							$('#agregarAlquilerModal_Step_3').modal('hide');
							$('#agregarAlquilerModal_Step_1').modal('show');
						}
				},
				{
					'name': 'btn_detalles_alquiler',
					'text': '<i class="bi bi-eye"></i> Ver detalles',
					'attr':  {'id': 'btn_detalles_alquiler', 'disabled': true},
					'action':
						function(e) {
							alquileres_selected_id = document.querySelector('#alquileres_selected_id').value;

							if(alquileres_selected_id != '') {
								fetch('/api/alquileres/' + alquileres_selected_id)
								.then(response => response.json())
								.then(alquiler => {
									document.querySelector('#alquiler_detalles_actividad').value = alquiler.actividad;
									document.querySelector('#alquiler_detalles_fecha_salida').value = alquiler.fecha_salida;
									document.querySelector('#alquiler_detalles_fecha_retorno').value = alquiler.fecha_retorno;
									document.querySelector('#alquiler_detalles_cliente').value = alquiler.cliente.fullname;
									document.querySelector('#alquiler_detalles_monto').value = alquiler.monto;
									document.querySelector('#alquiler_detalles_culminado_nota').value = alquiler.culminado_nota;
									document.querySelector('#alquiler_culminado_nota_container').style.display = alquiler.culminado ? 'block' : 'none';

									element_lista_maquinarias = document.querySelector('#alquiler_detalles_maquinarias');
									element_lista_maquinarias.innerHTML = '';

									alquiler.maquinarias.forEach(maquinaria => {
										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-start';
										element.innerHTML = `
											<div class="ms-2 me-auto">
											    <div class="fw-bold">${maquinaria.maquinaria_display}</div>
											</div>
										`;
										element_lista_maquinarias.appendChild(element);
									});

									element_lista_choferes = document.querySelector('#alquiler_detalles_choferes');
									element_lista_choferes.innerHTML = '';

									alquiler.choferes.forEach(chofer => {
										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-start';
										element.innerHTML = `
											<div class="ms-2 me-auto">
											    <div class="fw-bold">${chofer.fullname} - ${chofer.cedula}</div>
											</div>
										`;
										element_lista_choferes.appendChild(element);
									});

								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el alquiler');
									console.log('Error buscar alquiler: ' + error);
								});

								$('#detallesAlquilerModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún alquiler');
							}
						}
				},
				{
					'name': 'btn_modificar_alquiler',
					'text': '<i class="bi bi-pencil"></i> Modificar',
					'attr':  {'id': 'btn_modificar_alquiler', 'disabled': true},
					'action':
						function(e) {
							alquileres_selected_id = document.querySelector('#alquileres_selected_id').value;

							if(alquileres_selected_id != '') {
								fetch('/api/alquileres/' + alquileres_selected_id)
								.then(response => response.json())
								.then(alquiler => {
									if(!alquiler.culminado) {
										document.querySelector('#alquiler_modificar_actividad').value = alquiler.actividad;
										document.querySelector('#alquiler_modificar_fecha_salida').value = alquiler.fecha_salida;
										document.querySelector('#alquiler_modificar_fecha_retorno').value = alquiler.fecha_retorno;
										$('#alquiler_modificar_cliente').selectpicker('val', alquiler.cliente_id.toString());
										document.querySelector('#alquiler_modificar_monto').value = alquiler.monto;

										document.querySelector('#alquiler_modificar_maquinarias_id').value = alquiler.maquinarias_id;
										document.querySelector('#alquiler_modificar_choferes_id').value = alquiler.choferes_id;

										$('#modificarAlquilerModal_Step_2').modal('hide');
										$('#modificarAlquilerModal_Step_3').modal('hide');
										$('#modificarAlquilerModal_Step_1').modal('show');
									} else {
										toastr.warning('Los alquileres culminados no pueden ser modificados');
									}
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el alquiler');
									console.log('Error buscar alquiler: ' + error);
								});
							} else {
								toastr.info('No se ha seleccionado ningún alquiler');
							}
						}
				}
			];
		} else {
			var buttons = [
				{
					'text': '<i class="bi bi-filetype-pdf"></i> Generar reporte',
					'attr':  {'id': 'btn_reporte_alquiler'},
					'action':
						function(e) {
							if($('#alquileres_selected_id').val()) {
								$('#reporteAlquilerModal').modal('show');
							} else {
								$('#reporteAlquilerAllModal').modal('show');
							}
						}
				},
				{
					'text': '<i class="bi bi-plus-circle"></i> Registrar alquiler',
					'attr':  {'id': 'btn_agregar_alquiler'},
					'action':
						function(e) {
							$('#agregarAlquilerModal_Step_2').modal('hide');
							$('#agregarAlquilerModal_Step_3').modal('hide');
							$('#agregarAlquilerModal_Step_1').modal('show');
						}
				},
				{
					'name': 'btn_detalles_alquiler',
					'text': '<i class="bi bi-eye"></i> Ver detalles',
					'attr':  {'id': 'btn_detalles_alquiler', 'disabled': true},
					'action':
						function(e) {
							alquileres_selected_id = document.querySelector('#alquileres_selected_id').value;

							if(alquileres_selected_id != '') {
								fetch('/api/alquileres/' + alquileres_selected_id)
								.then(response => response.json())
								.then(alquiler => {
									document.querySelector('#alquiler_detalles_actividad').value = alquiler.actividad;
									document.querySelector('#alquiler_detalles_fecha_salida').value = alquiler.fecha_salida;
									document.querySelector('#alquiler_detalles_fecha_retorno').value = alquiler.fecha_retorno;
									document.querySelector('#alquiler_detalles_cliente').value = alquiler.cliente.fullname;
									document.querySelector('#alquiler_detalles_monto').value = alquiler.monto;
									document.querySelector('#alquiler_detalles_culminado_nota').value = alquiler.culminado_nota;
									document.querySelector('#alquiler_culminado_nota_container').style.display = alquiler.culminado ? 'block' : 'none';

									element_lista_maquinarias = document.querySelector('#alquiler_detalles_maquinarias');
									element_lista_maquinarias.innerHTML = '';

									alquiler.maquinarias.forEach(maquinaria => {
										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-start';
										element.innerHTML = `
											<div class="ms-2 me-auto">
											    <div class="fw-bold">${maquinaria.maquinaria_display}</div>
											</div>
										`;
										element_lista_maquinarias.appendChild(element);
									});

									element_lista_choferes = document.querySelector('#alquiler_detalles_choferes');
									element_lista_choferes.innerHTML = '';

									alquiler.choferes.forEach(chofer => {
										element = document.createElement('li');
										element.className = 'list-group-item d-flex justify-content-between align-items-start';
										element.innerHTML = `
											<div class="ms-2 me-auto">
											    <div class="fw-bold">${chofer.fullname} - ${chofer.cedula}</div>
											</div>
										`;
										element_lista_choferes.appendChild(element);
									});

								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el alquiler');
									console.log('Error buscar alquiler: ' + error);
								});

								$('#detallesAlquilerModal').modal('show');
							} else {
								toastr.info('No se ha seleccionado ningún alquiler');
							}
						}
				},
				{
					'name': 'btn_modificar_alquiler',
					'text': '<i class="bi bi-pencil"></i> Modificar',
					'attr':  {'id': 'btn_modificar_alquiler', 'disabled': true},
					'action':
						function(e) {
							alquileres_selected_id = document.querySelector('#alquileres_selected_id').value;

							if(alquileres_selected_id != '') {
								fetch('/api/alquileres/' + alquileres_selected_id)
								.then(response => response.json())
								.then(alquiler => {
									if(!alquiler.culminado) {
										document.querySelector('#alquiler_modificar_actividad').value = alquiler.actividad;
										document.querySelector('#alquiler_modificar_fecha_salida').value = alquiler.fecha_salida;
										document.querySelector('#alquiler_modificar_fecha_retorno').value = alquiler.fecha_retorno;
										$('#alquiler_modificar_cliente').selectpicker('val', alquiler.cliente_id.toString());
										document.querySelector('#alquiler_modificar_monto').value = alquiler.monto;

										document.querySelector('#alquiler_modificar_maquinarias_id').value = alquiler.maquinarias_id;
										document.querySelector('#alquiler_modificar_choferes_id').value = alquiler.choferes_id;

										$('#modificarAlquilerModal_Step_2').modal('hide');
										$('#modificarAlquilerModal_Step_3').modal('hide');
										$('#modificarAlquilerModal_Step_1').modal('show');
									} else {
										toastr.warning('Los alquileres culminados no pueden ser modificados');
									}
								})
								.catch(function(error) {
									toastr.error('Ha ocurrido un error al buscar el alquiler');
									console.log('Error buscar alquiler: ' + error);
								});
							} else {
								toastr.info('No se ha seleccionado ningún alquiler');
							}
						}
				}
			];
		}

		var table = $('#tabla_alquileres').DataTable({
			'dom': 'Bfrtip',
			'buttons': buttons,
			'autoWidth': false,
			'responsive': true,
			'pageLength': 5,
			'destroy': true,
			'scrollY': '560px',
			'scrollCollapse': true,
			'language': {'url': '/media/datatables-languages/es-ES_custom.json'},
			'ajax': {
				'url': '/api/alquileres',
				'type': 'GET',
				'dataSrc': '',
				'error': function(jqXHR, ajaxOptions, thrownError) {
					toastr.error('Ha ocurrido un error al cargar la lista de alquileres');
					console.log('Error buscar alquileres: ' + thrownError);
				 }
			},
			'columns': [
				{'data': 'id'},
				{'data': 'actividad'},
				{'data': 'fecha_salida'},
				{'data': 'fecha_retorno'},
				{'data': 'monto'},
				{'data': 'cancelado'},
				{'data': 'estado'},
			],
			'columnDefs': [
				{'class': 'd-none', 'orderable': false, 'targets': [0, 5]},
				{
					'targets': [-1],
					'width': '25px',
					'render': function (data, type, row) {
						if(row.estado == 'Ejecutado') {
							return `<span class='badge bg-success'>${data}</span>`;
						} else if(row.estado == 'Cancelado') {
							return `<span class='badge bg-danger'>${data}</span>`;
						} else if(row.estado == 'Sin culminar') {
							return `
								<button type="button" class="btn btn-warning btn-sm btn_establecer_culminado">
									<i class="bi bi-bookmark-check-fill"></i> Sin culminar
								</button>
								<button type="button" class="btn btn-danger btn-sm btn_establecer_cancelado">
									<i class="bi bi-clipboard-x"></i> Cancelar
								</button>
							`;
						} else {
							return `<span class='badge bg-secondary'>${data}</span>`;
						}
					}
				},
				{
					'targets': [4],
					'render': function (data, type, row) {
						return `$${data}`;
					}
				},
			],
			'order': [[0, 'asc']]
		});

		table.column(6).search('Sin culminar').draw();

		$('#alquileres_btn_filtro_ejecutados').on('click', function() {
			table.column(6).search('Ejecutado').draw();
		});
		
		$('#alquileres_btn_filtro_cancelados').on('click', function() {
			table.column(6).search('Cancelado').draw();
		});

		$('#alquileres_btn_filtro_sin_culminar').on('click', function() {
			table.column(6).search('Sin culminar').draw();
		});
		

		$('#tabla_alquileres tbody').off('click', 'tr').on('click', 'tr', function () {
			alquileres_selected = document.querySelector('#alquileres_selected_id');

			if(this.children[0].innerText != 'Ningún dato disponible en esta tabla') {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					alquileres_selected.value = '';
				} else {
					table.$('tr.selected').removeClass('selected');
					$(this).addClass('selected');
					alquileres_selected.value = this.children[0].innerText;
				}

				btn_disabled_value = (alquileres_selected.value == '');
				alquileres_cancelado_value = (this.children[5].innerText == 'true');

				table.button('btn_detalles_alquiler:name').nodes().attr('disabled', btn_disabled_value);
				table.button('btn_modificar_alquiler:name').nodes().attr('disabled', btn_disabled_value || alquileres_cancelado_value);
				//table.button('btn_eliminar_alquiler:name').nodes().attr('disabled', btn_disabled_value);
			}
		});
	}

	setTimeout(() => {
		update_table_event(tipo);
	}, 120);
}

function update_table_event(tipo) {
	if(tipo == 'mantenimientos') {
		$('#tabla_mantenimientos tbody').off('click', '.btn_establecer_fecha').on('click', '.btn_establecer_fecha', function () {
			var row = $(this).parents('tr')[0];
			mantenimiento_id = row.cells[0].innerHTML;

			document.querySelector('#mantenimiento_establecer_ejecucion_id').value = mantenimiento_id;

			$('#establecerMantenimientoEjecucionModal').modal('show');
		});

		$('#tabla_mantenimientos tbody').off('click', '.btn_establecer_culminado').on('click', '.btn_establecer_culminado', function () {
			var row = $(this).parents('tr')[0];
			mantenimiento_id = row.cells[0].innerHTML;

			document.querySelector('#mantenimiento_establecer_culminado_id').value = mantenimiento_id;

			$('#establecerMantenimientoCulminadoModal').modal('show');
		});

		$('#tabla_mantenimientos tbody').off('click', '.btn_establecer_cancelado').on('click', '.btn_establecer_cancelado', function () {
			var row = $(this).parents('tr')[0];
			mantenimiento_id = row.cells[0].innerHTML;

			document.querySelector('#mantenimiento_cancelar_id').value = mantenimiento_id;

			$('#cancelarMantenimientoModal').modal('show');
		});
	} else if(tipo == 'proyectos') {
		$('#tabla_proyectos tbody').off('click', '.btn_establecer_culminado').on('click', '.btn_establecer_culminado', function () {
			var row = $(this).parents('tr')[0];
			proyecto_id = row.cells[0].innerHTML;

			document.querySelector('#proyecto_establecer_culminado_id').value = proyecto_id;

			$('#establecerProyectoCulminadoModal').modal('show');
		});

		$('#tabla_proyectos tbody').off('click', '.btn_establecer_cancelado').on('click', '.btn_establecer_cancelado', function () {
			var row = $(this).parents('tr')[0];
			proyecto_id = row.cells[0].innerHTML;

			document.querySelector('#proyecto_cancelar_id').value = proyecto_id;

			$('#cancelarProyectoModal').modal('show');
		});
	} else if(tipo == 'alquileres') {
		$('#tabla_alquileres tbody').off('click', '.btn_establecer_culminado').on('click', '.btn_establecer_culminado', function () {
			var row = $(this).parents('tr')[0];
			alquiler_id = row.cells[0].innerHTML;

			document.querySelector('#alquiler_establecer_culminado_id').value = alquiler_id;

			$('#establecerAlquilerCulminadoModal').modal('show');
		});

		$('#tabla_alquileres tbody').off('click', '.btn_establecer_cancelado').on('click', '.btn_establecer_cancelado', function () {
			var row = $(this).parents('tr')[0];
			alquiler_id = row.cells[0].innerHTML;

			document.querySelector('#alquiler_cancelar_id').value = alquiler_id;

			$('#cancelarAlquilerModal').modal('show');
		});
	}
}

function gastos_get_table_data(table_id) {
	all_data_table = '';

	$('#' + table_id + ' tbody tr').each(function(index) {
		descripcion = this.children[1].children[0].value;
		monto = this.children[2].children[0].value;

		if(descripcion) {
			current = descripcion + ';;' + monto;
			all_data_table += (current + '//');
		}
	});

	return all_data_table;
}

function gastos_add_table_row(table_id) {
	count = $('#' + table_id + ' tbody tr').length;

	$('#' + table_id).find('tbody').append(
		`<tr>
			<td scope="row">${count+1}</td>
			<td><input type="text" class="form-control" placeholder="Nuevo gasto" value=""></td>
			<td><input type="number" class="form-control" step=".01" value="0.00"></td>
			<td><button type="button" class="btn btn-danger btn-sm" onclick="gastos_delete_row(this)"><i class="bi bi-x-circle"></i></button></td>
		</tr>`
	);
}

function gastos_load_table_data(table_id, data) {
	if(data) {
		$('#' + table_id + ' tbody tr').remove();

		$.each(data.split('//'), function( index, value ) {
			if(value) {
				value_split = value.split(';;');

				$('#' + table_id).find('tbody').append(
					`<tr>
						<td scope="row">${index+1}</td>
						<td><input type="text" class="form-control" value="${value_split[0]}"></td>
						<td><input type="number" class="form-control" step=".01" value="${value_split[1]}"></td>
						<td><button type="button" class="btn btn-danger btn-sm" onclick="gastos_delete_row(this)"><i class="bi bi-x-circle"></i></button></td>
					</tr>`
				);
			}
		});
	} else {
		gastos_reset_table(table_id);
	}
}

function gastos_reset_table(table_id) {
	$('#' + table_id + ' tbody tr').remove();
	gastos_add_table_row(table_id);
}

function gastos_delete_row(btn) {
	btn.parentElement.parentElement.remove();
}

toastr.options = {
	'closeButton': true,
	'debug': false,
	'newestOnTop': true,
	'progressBar': true,
	'positionClass': 'toast-bottom-center',
	'preventDuplicates': false,
	'onclick': null,
	'showDuration': '300',
	'hideDuration': '1000',
	'timeOut': '5000',
	'extendedTimeOut': '2000',
	'showMethod': 'slideDown',
	'hideMethod': 'slideUp'
}