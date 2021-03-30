import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RolService} from '../../service/Administracion/rol/rol.service';
import {ToastrService} from 'ngx-toastr';
import swal from 'sweetalert2';
import {DynamicScriptLoaderService} from '../../../services/dynamic-script-loader.service';

declare const $: any;

@Component({
    selector: 'app-rol',
    templateUrl: './rol.component.html',
    styleUrls: ['./rol.component.sass']
})
export class RolComponent implements OnInit {
    formCreateRol: FormGroup;
    formEditRol: FormGroup;
    creating = true;
    editing = true;
    activeRol: any[] = [];
    disabledRol: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private rolService: RolService,
        private toast: ToastrService,
        private dynamicScriptLoader: DynamicScriptLoaderService
    ) {
        this.formCreateRol = this.formBuilder.group({
            rolName: [''],
        });

        this.formEditRol = this.formBuilder.group({
            rolName: [''],
            idRol: [''],
            rolStatus: [''],
        });
    }

    ngOnInit() {
        this.getRol();
        this.startScript();
    }

    private loadData() {
        $('.estadoRol').select2({ width: '100%' });
    }

    async startScript() {
        await this.dynamicScriptLoader.load('form.min').then(data => {
            this.loadData();
        }).catch(error => console.log(error));
    }

    createRol() {
        const rolName = this.formCreateRol.get('rolName').value;

        if (!rolName) {
            return this.toast.warning('Complete el nombre del rol', 'CAMPOS INCOMPLETOS');
        }
        this.creating = false;
        this.rolService.createRol(this.formCreateRol.value).subscribe(
            resp => {
                if (resp['original']['code'] === 200 && resp['original']['status']  === true) {
                    this.toast.success('Se registro correctamente el rol', 'ROL REGISTRADO');
                    this.getRol();
                    this.clearFormFields();
                    $('#createRolModal').modal('hide');
                    this.creating = true;
                } else {
                    this.creating = true;
                    return this.toast.error('No se enviaron los datos al servidor, intentelo nuevamente', 'ERROR CREANDO ROL');
                }
            },
            error => {
                this.toast.error('No se enviaron los datos al servidor, intentelo nuevamente', 'ERROR CREANDO ROL');
            }
        );
    }

    getRol() {
        this.rolService.getRol().subscribe(
            (data: any = []) => {
                this.activeRol = data.filter(r => r.rol_status === 'ACTIVE');
                this.disabledRol = data.filter(r => r.rol_status === 'DISABLED');
                this.datatable('.tbRolEnable', this.activeRol);
                this.datatable('.tbRolDisabled', this.disabledRol);
            },
            error => {
                return this.toast.error('No se pudo obtener los roles del servidor', 'ERROR OBTENER ROLES');
            }
        );
    }

    getRolById(rol: any) {

        this.rolService.getRolById(rol.id_rol).subscribe(
          resp => {
              if (resp[0]['id_rol'] > 0) {
                  $('#editRolModal').modal({
                      keyboard: false,
                      backdrop: 'static',
                      show: true
                  });
                  this.formEditRol.controls.idRol.setValue(resp[0]['id_rol']);
                  this.formEditRol.controls.rolName.setValue(resp[0]['rol_name']);
                  this.formEditRol.controls.rolStatus.setValue(resp[0]['rol_status']);
              }
          },
            error => {
              return this.toast.error('No se obtenieron los datos del rol', 'ERROR');
            }
        );
    }

    deleteRol(rol: any) {
        const me = this;

        const swalWithBootstrapButtons = swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: 'Eliminar?',
            text: 'Seguro de eliminar este rol',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                me.rolService.deleteRol(rol.id_rol).subscribe(
                    resp => {
                        if (resp['original']['status'] === true && resp['original']['code'] === 200) {
                            swalWithBootstrapButtons.fire(
                                'Eliminado!',
                                'El rol fue eliminado.',
                                'success'
                            );
                            this.getRol();
                        } else {
                            swalWithBootstrapButtons.fire(
                                'ERROR',
                                'No se pudo eliminar el rol',
                                'error'
                            );
                        }
                    },
                    error => {
                        swalWithBootstrapButtons.fire(
                            'ERROR',
                            'No se pudo eliminar el rol',
                            'error'
                        );
                    }
                );
            } else if (
                result.dismiss === swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'Rol no eliminado',
                    'error'
                );
            }
        });
    }

    editRol() {
        const rolName = this.formEditRol.get('rolName').value;


        if (!rolName) {
            return this.toast.warning('Complete el nombre del rol', 'CAMPOS INCOMPLETOS');
        }
        this.editing = false;

        this.rolService.editRol(this.formEditRol.value).subscribe(
            resp => {
                if (resp['original']['code'] === 200 && resp['original']['status']  === true) {
                    this.toast.success('Se edito correctamente el rol', 'ROL EDITADO');
                    this.getRol();
                    this.clearFormFieldsEdit();
                    $('#editRolModal').modal('hide');
                    this.editing = true;
                } else {
                    this.editing = true;
                    return this.toast.error('No se enviaron los datos al servidor, intentelo nuevamente', 'ERROR EDITANDO ROL');
                }
            },
            error => {
                return this.toast.error('No se pudo actualizar los datos del rol', 'ERROR ACTUALIZANDO');
            }
        );
    }

    clearFormFields() {
        this.formCreateRol.controls.rolName.setValue(['']);
    }

    clearFormFieldsEdit() {
        this.formEditRol.controls.idRol.setValue(['']);
        this.formEditRol.controls.rolStatus.setValue(['']);
        this.formEditRol.controls.rolName.setValue(['']);
    }

    changeStatus(data: any) {
        this.rolService.changeStatusRol(data.id_rol).subscribe(
            resp => {
                if (resp['original']['code'] === 200 && resp['original']['status']  === true) {
                    this.toast.info('Se habilito el rol', 'ROL HABILITADO');
                    this.getRol();
                } else {
                    return this.toast.error('No se pudo contactar con el servidor intentelo mas tarde', 'ROL NO HABILITADO');
                }
            },
            error => {
                return this.toast.error('No se pudo contactar con el servidor intentelo mas tarde', 'ROL NO HABILITADO');
            }
        );
    }

    datatable(url, data) {
        $(url).DataTable({
            // tslint:disable-next-line:object-literal-shorthand
            data: data,
            columns: [
                { data: 'rol_name'},
                { data: 'rol_status',
                    // tslint:disable-next-line:object-literal-shorthand no-shadowed-variable
                    render: (data, type, row) => {
                        if (row.rol_status === 'ACTIVE') {
                            return '<span class="badge bg-green">HABILITADO</span>';
                        } else {
                            return '<span class="badge bg-red">DESHABILITADO</span>';
                        }
                    }
                },
                // tslint:disable-next-line:no-shadowed-variable
                { data: (data) => {
                        if (data.rol_status === 'ACTIVE') {
                            return (
                                // tslint:disable-next-line:max-line-length
                                '<button  title="ACTUALIZAR" class="btn bg-green btn-circle  waves-effect waves-circle waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;">' +
                                '<i style="padding-bottom:20px" class="fas fa-pen"></i>' +
                                '</button>' +
                                '<button title="ELIMINAR" class="btn bg-red btn-circle waves-effect waves-circle waves-float delete" type="button"' +
                                'style="margin-left: 5px;font-size: 20px;">' +
                                '<i class="fas fa-trash-alt"></i>' +
                                '</button>'
                            );
                        } else {
                            return (
                                // tslint:disable-next-line:max-line-length
                                '<button  title="ACTUALIZAR" class="btn bg-green btn-circle waves-effect waves-circle waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;">' +
                                '<i style="padding-bottom:20px" class="fas fa-pen"></i>' +
                                '</button>' +
                                '<button title="HABLITAR ROL" class="btn bg-blue btn-circle waves-effect waves-circle waves-float changeStatus" type="button"' +
                                'style="margin-left: 5px;font-size: 20px;">' +
                                '<i class="fas fa-redo"></i>' +
                                '</button>'
                            );
                        }
                    }
                },
            ],
            // tslint:disable-next-line:ban-types no-shadowed-variable
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const vem = this;

                $('.edit', row).bind('click', () => {
                    vem.getRolById(data);
                });
                $('.delete', row).bind('click', () => {
                    vem.deleteRol(data);
                });
                $('.changeStatus', row).bind('click', () => {
                   vem.changeStatus(data);
                });
                return row;
            },
            language: {
                decimal: '',
                emptyTable: 'No exsiten Productos',
                info: 'Mostrando _START_ a _END_ de _TOTAL_ Entradas',
                infoEmpty: 'Mostrando 0 to 0 of 0 Entradas',
                infoFiltered: '(Filtrado de _MAX_ total entradas)',
                infoPostFix: '',
                thousands: ',',
                lengthMenu: 'Mostrar _MENU_ Entradas',
                loadingRecords: 'Cargando...',
                processing: 'Procesando...',
                search: 'Buscar:',
                zeroRecords: 'Sin resultados encontrados',
                paginate: {
                    first: 'Primero',
                    last: 'Ultimo',
                    next: 'Siguiente',
                    previous: 'Anterior'
                }
            },
            order: [],
            destroy: true
        });
    }

}
