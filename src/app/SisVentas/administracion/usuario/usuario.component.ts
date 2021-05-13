import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DynamicScriptLoaderService} from '../../../services/dynamic-script-loader.service';
import {RolService} from '../../service/Administracion/rol/rol.service';
import {PeopleService} from '../../service/Administracion/people/people.service';
import {UserService} from '../../service/Administracion/user/user.service';
import swal from 'sweetalert2';
declare const sendRespuesta: any;
declare const soloNumeros: any;
declare const $: any;
import iziToast from 'izitoast';


@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
    @ViewChild('isloading', {static: true}) isloading;
    @ViewChild('isloadingUpdatePerson', {static: true}) isloadingUpdatePerson;
    @ViewChild('isloadingUpdateUsers', {static: true}) isloadingUpdateUsers;
    creating: boolean;
    editing: boolean;
    editingUser: boolean;
    editPersonForm: FormGroup;
    editUserForm: FormGroup;
    peopleActive: any[];
    peopleDisabled: any[];
    isbtnLoading = false;
    isloadinglista: boolean;
    isBtnAccion = false;
    rols: any[];
    isTipoDoument = 'DNI';
    title = '';
    idUsuario = localStorage.getItem('idUsuario');
    create = {
      nameUser: '',
      password: '',
      idRol: '',
      name: '',
      lastName: '',
      phone: '',
      typePerson: 'usuario',
      typeDocument: '',
      docNumber: '',
      address: '',
      idPersona: 0,
      idUsuario: 0,
      perfil : false
    };
    constructor(
        private rolService: RolService,
        private peopleService: PeopleService,
        private dynamicScriptLoader: DynamicScriptLoaderService,
        private userService: UserService,
    ) {}

    ngOnInit() {
        this.closeModal();
        this.startScript();
        this.getRol();
        this.getUsuario();
    }
    async startScript() {
      await this.dynamicScriptLoader.load('form.min').then(data => {
        this.loadData();
      }).catch(error => console.log(error));
    }
    private loadData() {
        const vm = this;
        $('.select2').select2({width: '100%'}).on('change', (event) => {
        });
        $('#typeDocumentCreate').select2({width: '100%'}).on('change', (event) => {
            if (event.target.value === 'DNI') {
                vm.isTipoDoument = 'DNI';
            }
            if (event.target.value === 'RUC') {
                vm.isTipoDoument = 'RUC';
            }
            vm.create.docNumber = '';
        });
        $('#typeDocumentEdit').select2({width: '100%'}).on('change', (event) => {
            if (event.target.value === 'DNI') {
                vm.isTipoDoument = 'DNI';
            }
            if (event.target.value === 'RUC') {
                vm.isTipoDoument = 'RUC';
            }
        });
        $('#rolupdate').select2({width: '100%'}).on('change', (event) => {
            vm.create.idRol = event.target.value;
        });
    }
    createUserPerson() {
        const vm = this;
        vm.create.idRol = document.getElementById('idRols')['value'];
        vm.create.typeDocument = document.getElementById('typeDocumentCreate')['value'];
        const isValidatePersona = vm.validarCamposPersonales();
        const isValidateCredenciales = vm.validarCamposCredenciales('crear');
        if (isValidatePersona && isValidateCredenciales) {
            vm.isloading.showReload();
            vm.isbtnLoading = true;
            this.userService.registerUserAndPerson(this.create).then( res => {
                const rpta = sendRespuesta(res);
                if (rpta.status) {
                    iziToast.success({
                    title: 'Exito',
                    position: 'topRight',
                    message: rpta.message,
                    });
                    $('#createUserModal').modal('hide');
                    this.closeModal();
                } else {
                    iziToast.error({
                    title: 'Error',
                    position: 'topRight',
                    message: rpta.message,
                    });
                }
            }).catch((err) => {
                console.log('Error', err);
            }).finally(() => {
                this.getUsuario();
                vm.isloading.closeReload();
                vm.isbtnLoading = false;
            });
        }
    }
    getRol() {
        this.rolService.getRol().then(res => {
            const rpta = sendRespuesta(res);
            this.rols = rpta.data.filter(rol => rol.rol_status === 'active');
        });
    }
    getUsuario() {
      const vm = this;
      vm.isloadinglista = true;
      $('#tbUsersActive').hide();
      $('#tbUsersDisabled').hide();
      vm.userService.getUsers().then(res => {
        const rpta = sendRespuesta(res);
        if (rpta.status) {
            vm.peopleActive = rpta.data.filter(people => people.per_status === 'active' && people.per_tipo === 'usuario');
            vm.peopleDisabled = rpta.data.filter(people => people.per_status === 'disabled' && people.per_tipo === 'usuario');
            vm.datatable('.tbUserEnable', vm.peopleActive);
            vm.datatable('.tbUserDisabled', vm.peopleDisabled);
        }
      }).catch((err) => {
        console.log('Error', err);
      }).finally(() => {
        vm.isloadinglista = false;
        $('#tbUsersActive').show();
        $('#tbUsersDisabled').show();
      });
    }
    datatable(url, data) {
      $('#reload').hide();
      $(url).DataTable({
            // tslint:disable-next-line:object-literal-shorthand
        data: data,
        columns: [
          { data: 'per_nombre'},
          { data: 'per_apellido'},
          { data: 'us_usuario'},
          { data: 'rol_name'},
          { data: 'per_celular'},
          { data: 'per_numero_documento'},
          { data: (users) => {
            // tslint:disable-next-line:max-line-length
            const btnActualizarPersona = '<button  title="Actualizar Datos Personales" class="btn bg-green btn-circle  waves-effect waves-circle waves-float edit"' +
                                         'type="button" style="margin-left: 5px;font-size: 20px;">' +
                                          '<i style="padding-bottom:20px" class="fas fa-pen"></i></button>';
            // tslint:disable-next-line:max-line-length
            const btnActualizarUsers   = '<button title="Actualizar Credenciales" class="btn bg-dark btn-circle waves-effect waves-circle waves-float editUser"' +
                                         'type="button"' + 'style="margin-left: 5px;font-size: 20px;">' +
                                         '<i class="fas fa-user-alt text-white"></i></button>';
            // tslint:disable-next-line:max-line-length
            const btnDelete            = '<button title="Eliminar usuarios" class="btn bg-red btn-circle waves-effect waves-circle waves-float delete"' +
                                         'type="button"' + 'style="margin-left: 5px;font-size: 20px;">' +
                                         '<i class="fas fa-trash-alt text-white"></i></button>';
            const btnreload            = '<div id="reload" _ngcontent-yja-c6="" class="preloader pl-size-xs">' +
                                         '<div _ngcontent-yja-c6="" style="border-color: white !important;" class="spinner-layer">' +
                                         '<div _ngcontent-yja-c6="" class="circle-clipper left">' +
                                         '<div _ngcontent-yja-c6="" class="circle"></div> </div>' +
                                         '<div _ngcontent-yja-c6="" class="circle-clipper right">' +
                                         '<div _ngcontent-yja-c6="" class="circle"></div> </div>' +
                                         '</div></div>';
            if (users.per_status === 'active') {
                return (
                  btnActualizarPersona + btnActualizarUsers + btnDelete +
                  // tslint:disable-next-line:max-line-length
                  '<button id="btnstatusDesab" title="Desabilitar" class="btn bg-info btn-circle waves-effect waves-circle waves-float changeStatus" type="button"' +
                  'style="margin-left: 5px;font-size: 20px;">' +
                  '<i id="iconStatusDesab" class="fas fa-lock fa-fw fa-3x text-white"></i>' +
                  btnreload + '</button>'
                );
            } else {
              return (
                btnActualizarPersona + btnActualizarUsers + btnDelete +
                // tslint:disable-next-line:max-line-length
                '<button id="btnstatusHabi"  title="Habilitar" class="btn bg-green btn-circle waves-effect waves-circle waves-float changeStatus" type="button"' +
                'style="margin-left: 5px;font-size: 20px;">' +
                '<i id="iconStatusHabi" class="fas fa-unlock-alt text-white"></i>' +
                btnreload + '</button>'
              );
            }
          }
          },
        ],
            // tslint:disable-next-line:ban-types no-shadowed-variable
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const vem = this;
                $('.edit', row).bind('click', () => {
                    $('#personales').show();
                    $('#credenciales').hide();
                    $('#btnPerson').show();
                    $('#btnUsers').hide();
                    vem.getPersonById(data);
                });
                $('.delete', row).bind('click', () => {
                    vem.deletePersonUser(data);
                });
                $('.changeStatus', row).bind('click', () => {
                    $('#iconStatusDesab').hide();
                    $('#iconStatusHabi').hide();
                    $('#btnstatusDesab').attr('disabled', 'disabled');
                    $('#btnstatusHabi').attr('disabled', 'disabled');
                    $('#reload').show();
                    vem.changeStatusPersonUser(data);
                });
                $('.editUser', row).bind('click', () => {
                  $('#credenciales').show();
                  $('#personales').hide();
                  $('#btnUsers').show();
                  $('#btnPerson').hide();
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
    getPersonById(data) {
      const vm = this;
      vm.userService.getUserInfo(data.id_user).then( res => {
        const rpta = sendRespuesta(res);
        if (rpta.status) {
            vm.create.name = rpta.data.person.per_nombre;
            vm.create.lastName = rpta.data.person.per_apellido;
            vm.create.phone = rpta.data.person.per_celular;
            vm.create.typeDocument = rpta.data.person.per_tipo_documento;
            vm.create.docNumber = rpta.data.person.per_numero_documento;
            vm.create.address = rpta.data.person.per_direccion;
            vm.create.idPersona = rpta.data.person.id_persona;
            $('#typeDocumentEdit').val(rpta.data.person.per_tipo_documento).trigger('change');
            vm.title = 'Actualizar Datos Personales';
            $('#ModalPersonandCredenciales').modal('show');
        } else {
            alert('esta persona no tiene credenciales');
        }
      }).catch((err) => {
          console.log('Error', err);
      }).finally(() => {
          console.log('finally');
      });
    }
    updatePerson() {
      const vm = this;
      vm.create.idRol = document.getElementById('idRols')['value'];
      vm.create.typeDocument = document.getElementById('typeDocumentEdit')['value'];
      const isvalidatePersona = vm.validarCamposPersonales();
      const isvalidateLengttyeDocum = vm.validateTypeDocument();
      if (isvalidatePersona && isvalidateLengttyeDocum) {
        vm.isbtnLoading = true;
        vm.isloadingUpdatePerson.showReload();
        this.peopleService.updatePerson(this.create).then( res => {
            const rpta = sendRespuesta(res);
            if (rpta.status) {
                iziToast.success({
                  title: 'Exito',
                  position: 'topRight',
                  message: rpta.message,
                });
                $('#ModalPersonandCredenciales').modal('hide');
                this.closeModal();
            } else {
                iziToast.error({
                  title: 'Error',
                  position: 'topRight',
                  message: rpta.message,
                });
            }
        }).catch((err) => {
            console.log('Error', err);
        }).finally(() => {
            vm.getUsuario();
            vm.isloadingUpdatePerson.closeReload();
            vm.isbtnLoading = false;
        });
      }
    }
    getUserById(data) {
        const vm = this;
        vm.userService.getUserInfo(data.id_user).then( res => {
          const rpta = sendRespuesta(res);
          if (rpta.status) {
              vm.create.nameUser = rpta.data.person.us_usuario;
              vm.create.idPersona = rpta.data.person.id_persona;
              vm.create.idUsuario = rpta.data.person.id_user;
              $('#rolupdate').val(rpta.data.person.id_rol).trigger('change');
              vm.title = 'Actualizar Credenciales';
              $('#ModalPersonandCredenciales').modal('show');
          } else {
              alert('esta persona no tiene credenciales');
          }
        }).catch((err) => {
          console.log('Error', err);
        }).finally(() => {
            vm.getUsuario();
        });
    }
    updateUsers() {
     const vm = this;
     const isValidate = this.validarCamposCredenciales('actualizar');
     if (isValidate) {
        vm.isbtnLoading = true;
        vm.isloadingUpdateUsers.showReload();
        vm.userService.updateUser(vm.create).then( res => {
         const rpta = sendRespuesta(res);
         if (rpta.status) {
             iziToast.success({
               title: 'Exito',
               position: 'topRight',
               message: rpta.message,
             });
             $('#ModalPersonandCredenciales').modal('hide');
             vm.closeModal();
             vm.getUsuario();
         } else {
           iziToast.error({
             title: 'Error',
             position: 'topRight',
             message: rpta.message,
           });
         }
       }).catch((err) => {
           console.log('Error', err);
       }).finally(() => {
         vm.isloadingUpdateUsers.closeReload();
         vm.isbtnLoading = false;
       });
     }
    }
    deletePersonUser(person: any) {
      const vm = this;
      swal.fire({
        title: 'Eliminar',
        text:  'Seguro de eliminar al usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#008000',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          vm.userService.deleteUserandPeson(person).then(res => {
            const rpta = sendRespuesta(res);
            if (rpta.status) {
              swal.fire(
                'Eliminado!',
                rpta.message,
                'success'
              );
            } else {
              swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: rpta.message,
              });
            }
          }).catch((err) => {
                    console.log('Error', err);
          }).finally(() => {
                    vm.getUsuario();
          });
        } else {
          swal.fire({
            icon: 'error',
            title: 'Cancelado',
            text: 'Usuario a salvo',
          });
        }
      });
    }
    changeStatusPersonUser(data) {
      const vm = this;
      vm.userService.changeStatusPersonUsers(data).then( res => {
        const rpta = sendRespuesta(res);
        if (rpta.status) {
          iziToast.success({
            title: 'Exito',
            position: 'topRight',
            message: rpta.message,
          });
        } else {
          iziToast.error({
            title: 'Error',
            position: 'topRight',
            message: rpta.message,
          });
        }
      }).catch((err) => {
        console.log('Error', err);
      }).finally(() => {
        vm.getUsuario();
        $('#iconStatusDesab').show();
        $('#iconStatusHabi').show();
        $('#reload').hide();
        $('#btnstatusDesab').removeAttr('disabled');
        $('#btnstatusHabi').removeAttr('disabled');
      });
    }
    validarCamposPersonales() {
      const vm = this;
      if (vm.create.name === '') {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Nombre requerido',
        });
        return false;
      }
      if (vm.create.lastName === '') {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Apellidos requerido',
        });
        return false;
      }
      if (vm.create.address === '') {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Direccion requerido',
        });
        return false;
      }
      if (vm.create.phone === '') {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Telfono requerido',
        });
        return false;
      }
      if (vm.create.typeDocument === '' ) {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Tipo Documento requerido',
        });
        return false;
      }
      if (vm.create.docNumber === '') {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Numero Documento requerido',
        });
        return false;
      }
      return true;
    }
    validarCamposCredenciales(accion) {
      const vm = this;
      if (accion === 'crear') {
        if (vm.create.password === '') {
            iziToast.error({
              title: 'Error',
              position: 'topRight',
              message: 'Password requerido',
            });
            return false;
        }
        return true;
      }
      if (vm.create.nameUser === '') {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Nombre Usuario requerido',
        });
        return false;
      }
      if (vm.create.idRol === '') {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Rol requerido',
        });
        return false;
      }
      return true;
    }
    validateTypeDocument() {
        if (this.create.typeDocument === 'DNI') {
            if (this.create.docNumber.length < 8 || this.create.docNumber.length > 8) {
                iziToast.error({
                  title: 'Error',
                  position: 'topRight',
                  message: 'Su DNI debe tener 8 dijitos',
                });
                return false;
            }
            return true;
        } else {
            if (this.create.docNumber.length < 11) {
                iziToast.error({
                    title: 'Error',
                    position: 'topRight',
                    message: 'Su RUC debe tener 11 dijitos',
                  });
                return false;
            }
            return true;
        }
    }
    clearFormFields() {
      const vm = this;
      vm.create = {
          nameUser: '',
          password: '',
          idRol: '',
          name: '',
          lastName: '',
          phone: '',
          typePerson: 'usuario',
          typeDocument: '',
          docNumber: '',
          address: '',
          idPersona: 0,
          perfil : false,
          idUsuario: 0
      };
      $('#typeDocumentCreate').val(null).trigger('change');
      $('#idRols').val(null).trigger('change');
      $('#typeDocumentEdit').val(null).trigger('change');
    }
    soloNumeros(event) {
        soloNumeros(event);
    }
    closeModal() {
      $('body').on('hidden.bs.modal', '.modal', () => {
        this.clearFormFields();
      });
    }
}
