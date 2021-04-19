import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {DynamicScriptLoaderService} from '../../../services/dynamic-script-loader.service';
import {RolService} from '../../service/Administracion/rol/rol.service';
import {PeopleService} from '../../service/Administracion/people/people.service';
import {UserService} from '../../service/Administracion/user/user.service';
import swal from 'sweetalert2';

declare const $: any;

@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.sass']
})
export class UsuarioComponent implements OnInit {
    creating: boolean;
    editing: boolean;
    editingUser: boolean;
    createUserForm: FormGroup;
    editPersonForm: FormGroup;
    editUserForm: FormGroup;
    peopleActive: any[];
    peopleDisabled: any[];
    rols: any[];

    constructor(
        private rolService: RolService,
        private peopleService: PeopleService,
        private formBuilder: FormBuilder,
        private toast: ToastrService,
        private dynamicScriptLoader: DynamicScriptLoaderService,
        private userService: UserService,
    ) {
        this.createUserForm = this.formBuilder.group({
            nameUser: [''],
            password: [''],
            idRol: [''],
            name: [''],
            lastName: [''],
            phone: [''],
            typePerson: [''],
            typeDocument: [''],
            docNumber: [''],
            address: [''],
        });

        this.editPersonForm = this.formBuilder.group({
            idPersona: [''],
            name: [''],
            lastName: [''],
            address: [''],
            phone: [''],
            typePerson: [''],
            typeDocument: [''],
            docNumber: [''],
        });

        this.editUserForm = this.formBuilder.group({
            idUser: [''],
            idRol: [''],
            nameUser: [''],
            statusUser: [''],
        });
    }

    ngOnInit() {
        this.creating = true;
        this.editing = true;
        this.editingUser = true;
        this.startScript().then(r => console.log(r));

        this.getRol();
        this.getPeopleInfo();
    }

    createUserPerson() {
        const selectId = document.getElementById('idRols')['value'];
        const selectTypeDocument = document.getElementById('typeDocument')['value'];
        this.createUserForm.controls.idRol.setValue(selectId);
        this.createUserForm.controls.typeDocument.setValue(selectTypeDocument);
        const nameUser = this.createUserForm.get('nameUser').value;
        const password = this.createUserForm.get('password').value;
        const idRol = this.createUserForm.get('idRol').value;
        const name = this.createUserForm.get('name').value;
        const lastName = this.createUserForm.get('lastName').value;
        const phone = this.createUserForm.get('phone').value;
        this.createUserForm.controls.typePerson.setValue('USUARIO');
        const typeDocument = this.createUserForm.get('typeDocument').value;
        const docNumber = this.createUserForm.get('docNumber').value;
        const address = this.createUserForm.get('address').value;

        if (nameUser === '' || password === '' || idRol === '' || name === '' || lastName === ''
            || phone === '' || typeDocument === '' || docNumber === '' || address === '') {
            return this.toast.error('Complete todos los campos del formulario', 'CAMPOS INCOMPLETOS');
        }

        const checkNumberDoc: boolean = this.validateNumberDoc(typeDocument, docNumber);

        if (checkNumberDoc === false) {
            return this.toast.error('El tipo de documento no coincide con el numero de documento. ' +
                'Verifique la cantidad de dígitos. DNI = 8, RUC = 11', 'NUMERO DOC INVALIDO');
        }
        this.creating = false;
        this.userService.registerPeople(this.createUserForm.value).subscribe(
            resp => {
                if (resp['original']['code'] === 200 && resp['original']['status']  === true) {
                    this.toast.success('Persona y Usuario registrado correctamente', 'USUARIO REGISTRADO');
                    this.getPeopleInfo();
                    this.clearFormFields();
                    $('#createUserModal').modal('hide');
                    this.creating = true;
                } else {
                    this.creating = true;
                    return this.toast.error('No se enviaron los datos al servidor, intentelo nuevamente', 'ERROR EDITANDO ROL');
                }
            },
            error => {
                return this.toast.error('No se pudo contactar con el servidor. Intentelo nuevamente mas tarde', 'ERROR REGISTRANDO');
            }
        );
    }

    getRol() {
        this.rolService.getRol().subscribe(
            (resp: any = []) => {
                this.rols = resp.filter(rol => rol.rol_status === 'ACTIVE');
            },
            error => {
                return this.toast.error('No se pudo obtener los roles del servidor', 'ERROR OBTENIENDO ROLES');
            }
        );
    }

    getPeopleInfo() {
        this.peopleService.getPeopleInfo().subscribe(
            (data: any = []) => {
                this.peopleActive = data.filter(people => people.per_status === 'ACTIVE' && people.per_tipo !== 'PROVEEDOR');
                this.peopleDisabled = data.filter(people => people.per_status === 'DISABLED' && people.per_tipo !== 'PROVEEDOR');
                this.datatable('.tbUserEnable', this.peopleActive);
                this.datatable('.tbUserDisabled', this.peopleDisabled);
            },
            error => {
                return this.toast.error('No se pudo obtener los datos personales. Intentelo nuevamente', 'ERROR OBTENIENDO DATOS');
            },
        );
    }

    getPersonById(data) {
        this.peopleService.getPersonById(data.id_persona).subscribe(
            resp => {
                if (resp[0]['id_persona'] > 0) {
                    $('#editPerson').modal({
                        keyboard: false,
                        backdrop: 'static',
                        show: true
                    });
                    this.editPersonForm.controls.idPersona.setValue(resp[0].id_persona);
                    this.editPersonForm.controls.name.setValue(resp[0].per_nombre);
                    this.editPersonForm.controls.lastName.setValue(resp[0].per_apellido);
                    this.editPersonForm.controls.address.setValue(resp[0].per_direccion);
                    this.editPersonForm.controls.phone.setValue(resp[0].per_celular);
                    this.editPersonForm.controls.typePerson.setValue(resp[0].per_tipo);
                    this.editPersonForm.controls.typeDocument.setValue(resp[0].per_tipo_documento);
                    this.editPersonForm.controls.docNumber.setValue(resp[0].per_numero_documento);
                    return ;
                }
                return this.toast.error('No se pudo obtener los datos del Servidor. Intentelo nuevamente', 'ERROR OBTENIENDO DATOS');

            },
            error => {
                return this.toast.error('No se pudo obtener los datos del Servidor. Intentelo nuevamente', 'ERROR OBTENIENDO DATOS');
            }
        );
    }

    updatePersonById() {
        const selectTypeDocument = document.getElementById('etypeDocument')['value'];

        this.editPersonForm.controls.typeDocument.setValue(selectTypeDocument);
        this.editPersonForm.controls.typePerson.setValue('USUARIO');

        const idPersona = this.editPersonForm.get('idPersona').value;
        const name = this.editPersonForm.get('name').value;
        const lastName = this.editPersonForm.get('lastName').value;
        const phone = this.editPersonForm.get('phone').value;
        const docNumber = this.editPersonForm.get('docNumber').value;
        const address = this.editPersonForm.get('address').value;

        if (idPersona === '' || name === '' || lastName === '' || phone === '' || docNumber === '' || address === '' ||
            selectTypeDocument === '') {
            return this.toast.error('Complete todos los campos del formulario', 'CAMPOS INCOMPLETOS');
        }
        const checkNumberDoc: boolean = this.validateNumberDoc(selectTypeDocument, docNumber);

        if (checkNumberDoc === false) {
            return this.toast.error('El tipo de documento no coincide con el numero de documento. ' +
                'Verifique la cantidad de dígitos. DNI = 8, RUC = 11', 'NUMERO DOC INVALIDO');
        }
        this.editing = false;
        this.peopleService.updatePerson(this.editPersonForm.value).subscribe(
            resp => {
                if (resp['original']['code'] === 200 && resp['original']['status']  === true) {
                    this.toast.success('Se ACTUALIZARON correctamente los datos', 'DATOS ACTUALIZADOS');
                    this.getRol();
                    $('#editPerson').modal('hide');
                    this.editing = true;
                } else {
                    this.editing = true;
                    return this.toast.error('No se enviaron los datos al servidor, intentelo nuevamente', 'ERROR EDITANDO ROL');
                }
            },
            error => {
                return this.toast.error('No se pudo contactar con el servidor. Intentelo mas tarde', 'ERROR SERVIDOR');
            }
        );
    }

    deletePersonUser(person: any) {
        const contextUser = this;

        const swalWithBootstrapButtons = swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: 'Deshabilitar',
            text: 'Seguro de deshabilitar al usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, Deshabilitar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                contextUser.peopleService.disabledPerson(person.id_persona).subscribe(
                    resp => {
                        if (resp['original']['status'] === true && resp['original']['code'] === 200) {
                            swalWithBootstrapButtons.fire(
                                'Deshabilitado!',
                                'El usuario fue deshabilitado.',
                                'success'
                            );
                            this.getPeopleInfo();
                        } else {
                            swalWithBootstrapButtons.fire(
                                'ERROR',
                                'No se pudo deshabilitar al usuario',
                                'error'
                            );
                        }
                    },
                    error => {
                        swalWithBootstrapButtons.fire(
                            'ERROR',
                            'No se pudo deshabilitar al usuario',
                            'error'
                        );
                    }
                );
            } else if (
                result.dismiss === swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'Persona no deshabilitada',
                    'error'
                );
            }
        });
    }

    changeStatusPersonUser(data) {
        this.peopleService.changeStatusPerson(data.id_persona).subscribe(
            resp => {
                if (resp['original']['code'] === 200 && resp['original']['status']  === true) {
                    this.toast.info('Usuario y persona habilitada, ya puede ingresar al sistema', 'PERSONA HABILITADA');
                    this.getPeopleInfo();
                } else {
                    return this.toast.error('No se pudo contactar con el servidor intentelo mas tarde', 'PERSONA NO HABILITADO');
                }
            },
            error => {
                return this.toast.error('No se pudo contactar con el servidor. Intentelo nuevamente', 'ERROR SERVIDOR');
            }
        );
    }

    getUserById(data) {
        this.userService.getUserInfo(data.id_persona).subscribe(
            resp => {
                if (resp['original']['status'] == true || resp['original']['code'] == 200) {
                    this.editUserForm.controls.idUser.setValue(resp['original']['user']['id_user']);
                    this.editUserForm.controls.idRol.setValue(resp['original']['user']['id_rol']);
                    this.editUserForm.controls.nameUser.setValue(resp['original']['user']['us_name']);
                    this.editUserForm.controls.statusUser.setValue(resp['original']['user']['us_status']);
                    $('#idRolUser').val(resp['original']['user']['id_rol']).trigger('change');
                    $('#statusUser').val(resp['original']['user']['us_status']).trigger('change');

                    $('#editUserModal').modal({
                        keyboard: false,
                        backdrop: 'static',
                        show: true
                    });
                } else {
                    return this.toast.warning('Esta persona no tiene un usuario creado', 'PERSONA SIN USUARIO');
                }

            },
            error => {
                return this.toast.error('No se pudo obtener los datos desde el servidor', 'DATOS NO ENCONTRADOS');
            }
        );
    }

    updateUser() {
        this.editingUser = false;
        const selectRol = document.getElementById('idRolUser')['value'];
        const statusUser = document.getElementById('statusUser')['value'];
        this.editUserForm.controls.idRol.setValue(selectRol);
        this.editUserForm.controls.statusUser.setValue(statusUser);
        const idUser = this.editUserForm.get('idUser').value;
        const nameUser = this.editUserForm.get('nameUser').value;

        if (selectRol === '' || statusUser === '' || idUser === '' || nameUser === '') {
            this.editingUser = true;
            return this.toast.error('Complete todos los campos del formulario', 'CAMPOS INCOMPLETOS');
        }

        this.userService.updateUser(this.editUserForm.value).subscribe(
            resp => {
                if (resp['original']['code'] == 200 && resp['original']['status']  == true) {
                    this.toast.success('Se ACTUALIZARON correctamente los datos', 'DATOS ACTUALIZADOS');
                    this.getPeopleInfo();
                    this.clearUserForm();
                    $('#editUserModal').modal('hide');
                    this.editingUser = true;
                } else {
                    this.editingUser = true;
                    return this.toast.error('No se enviaron los datos al servidor. Intentelo nuevamente', 'ERROR EDITANDO USUARIO');
                }
            },
            error =>  {
                return this.toast.error('No se pudo contactar con el servidor. Intentelo mas tarde', 'ERROR SERVIDOR');
            }
        );
    }

    // UTILITIES
    private loadData() {
        $('.select2').select2({ width: '100%' });
    }

    async startScript() {
        await this.dynamicScriptLoader.load('form.min').then(data => {
            this.loadData();
        }).catch(error => console.log(error));
    }

    datatable(url, data) {
        $(url).DataTable({
            // tslint:disable-next-line:object-literal-shorthand
            data: data,
            columns: [
                { data: 'per_nombre'},
                { data: 'per_apellido'},
                { data: 'per_celular'},
                { data: 'per_numero_documento'},
                // tslint:disable-next-line:no-shadowed-variable
                { data: (data) => {
                        if (data.per_status === 'ACTIVE') {
                            return (
                                // tslint:disable-next-line:max-line-length
                                '<button  title="EDITAR PERSONA" class="btn bg-green btn-circle  waves-effect waves-circle waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;">' +
                                '<i style="padding-bottom:20px" class="fas fa-pen"></i>' +
                                '</button>' +
                                '<button title="EDITAR USUARIO" class="btn bg-dark btn-circle waves-effect waves-circle waves-float editUser" type="button"' +
                                'style="margin-left: 5px;font-size: 20px;">' +
                                '<i class="fas fa-user-alt text-white"></i>' +
                                '</button>' +
                                '<button title="DESHABILITAR" class="btn bg-red btn-circle waves-effect waves-circle waves-float delete" type="button"' +
                                'style="margin-left: 5px;font-size: 20px;">' +
                                '<i class="fas fa-trash-alt"></i>' +
                                '</button>'
                            );
                        } else {
                            return (
                                // tslint:disable-next-line:max-line-length
                                '<button  title="EDITAR PERSONA" class="btn bg-green btn-circle waves-effect waves-circle ' +
                                'waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;">' +
                                '<i style="padding-bottom:20px" class="fas fa-pen"></i>' +
                                '</button>' +
                                '<button title="EDITAR USUARIO" class="btn bg-dark btn-circle waves-effect waves-circle ' +
                                'waves-float editUser" type="button"' +
                                'style="margin-left: 5px;font-size: 20px;">' +
                                '<i class="fas fa-user-alt text-white"></i>' +
                                '</button>' +
                                '<button title="HABLITAR" class="btn bg-blue btn-circle waves-effect waves-circle waves-float ' +
                                'changeStatus" type="button"' +
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
                    vem.getPersonById(data);
                });
                $('.delete', row).bind('click', () => {
                    vem.deletePersonUser(data);
                });
                $('.changeStatus', row).bind('click', () => {
                    vem.changeStatusPersonUser(data);
                });
                $('.editUser', row).bind('click', () => {
                    vem.getUserById(data);
                });
                return row;
            },
            language: {
                decimal: '',
                emptyTable: 'Sin datos disponibles',
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

    validateNumberDoc(typeDoc: string, numberDoc: string): boolean {
        switch (typeDoc) {
            case 'DNI':
                return numberDoc.length === 8;
            case 'RUC':
                return numberDoc.length === 11;
            default:
                return false;
        }
    }

    clearFormFields() {
        this.createUserForm.controls.nameUser.setValue('');
        this.createUserForm.controls.password.setValue('');
        this.createUserForm.controls.idRol.setValue('');
        this.createUserForm.controls.name.setValue('');
        this.createUserForm.controls.lastName.setValue('');
        this.createUserForm.controls.phone.setValue('');
        this.createUserForm.controls.typePerson.setValue('');
        this.createUserForm.controls.typeDocument.setValue('');
        this.createUserForm.controls.docNumber.setValue('');
        this.createUserForm.controls.address.setValue('');
    }

    clearUserForm() {
        this.editUserForm.controls.idUser.setValue('');
        this.editUserForm.controls.idRol.setValue('');
        this.editUserForm.controls.statusUser.setValue('');
        this.editUserForm.controls.nameUser.setValue('');
    }
}
