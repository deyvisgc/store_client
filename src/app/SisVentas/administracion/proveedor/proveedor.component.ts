import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {PeopleService} from '../../service/Administracion/people/people.service';
import swal from 'sweetalert2';
import { People } from '../../Interfaces/people.interface';
declare const $: any;
declare const sendRespuesta: any;
declare const soloNumeros: any;
import iziToast from 'izitoast';
@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  personActive: any[] = [];
  personDisabled: any[] = [];
  people: People  = {
    perfil: false,
    lastName: null,
    name: null,
    address: null,
    docNumber: null,
    per_razon_social: null,
    phone: null,
    typeDocument: 'RUC',
    idPerson: null,
    typePerson: 'proveedor'
  };
  isloadinglista: boolean;
  isLoading: boolean;
  btnAccion: boolean;
  constructor(private peopleService: PeopleService) {
  }
  ngOnInit() {
    this.getPerson();
    this.isLoading = false;
    this.btnAccion = false;
    this.closeModal();
  }
  getPerson() {
    const vm = this;
    vm.isloadinglista = true;
    $('#tbPersonActive').hide();
    $('#tbPersonDisabled').hide();
    vm.peopleService.getPeopleInfo().then(res => {
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        vm.personActive = rpta.data.filter( per => per.per_tipo === 'proveedor' && per.per_status === 'active');
        vm.personDisabled =  rpta.data.filter( per => per.per_tipo === 'proveedor' && per.per_status === 'disabled');
        vm.datatable('.tbPersonActive', vm.personActive);
        vm.datatable('.tbPersonDisabled', vm.personDisabled);
      }
    }).catch((err) => {
      console.log('err', err);
    }).finally(() => {
      vm.isloadinglista = false;
      $('#tbPersonActive').show();
      $('#tbPersonDisabled').show();
    });
  }
  datatable(tabla, provee) {
    $(tabla).DataTable({
      // tslint:disable-next-line:object-literal-shorthand
      data: provee,
      columns: [
        { data: 'per_razon_social'},
        { data: 'per_numero_documento'},
        { data: 'per_celular'},
        { data: 'per_direccion'},
        // tslint:disable-next-line:no-shadowed-variable
        { data: (provee) => {
          const iconreload     = '<div id="editReload" _ngcontent-yja-c6="" class="preloader pl-size-xs">' +
                                 '<div _ngcontent-yja-c6="" style="border-color: white !important;" class="spinner-layer">' +
                                 '<div _ngcontent-yja-c6="" class="circle-clipper left">' +
                                 '<div _ngcontent-yja-c6="" class="circle"></div> </div>' +
                                 '<div _ngcontent-yja-c6="" class="circle-clipper right">' +
                                 '<div _ngcontent-yja-c6="" class="circle"></div> </div>' +
                                 '</div></div>';
            // tslint:disable-next-line:max-line-length
          const btnActualizar = '<button title="EDITAR PROVEEDOR" class="btn bg-green btn-circle waves-effect waves-circle waves-float edit" type="button' +
                                  'style="margin-left: 5px;font-size: 20px;">' +
                                  '<i id="iconEdit" style="padding-bottom:20px" class="fas fa-pen"></i>' +
                                  iconreload +
                                  '</button>';
            // tslint:disable-next-line:max-line-length
          const btndelete     = '<button title="Eliminar" class="btn bg-red btn-circle waves-effect waves-circle waves-float delete" type="button"' +
                                'style="margin-left: 5px;font-size: 20px;">' +
                                '<i class="fas fa-trash-alt"></i>' +
                                '</button>';
          if (provee.per_status === 'active') {
            return (
              btnActualizar + btndelete +
              // tslint:disable-next-line:max-line-length
              '<button id="btnstatusDesab" title="Desabilitar" class="btn bg-info btn-circle waves-effect waves-circle waves-float changeStatus" type="button"' +
              'style="margin-left: 5px;font-size: 20px;">' +
              '<i id="iconStatusDesab" class="fas fa-lock fa-fw fa-3x text-white"></i>' +
              iconreload + '</button>'
            );
          } else {
            return (
              btnActualizar + btndelete +
              // tslint:disable-next-line:max-line-length
              '<button id="btnstatusHabi"  title="Habilitar" class="btn bg-green btn-circle waves-effect waves-circle waves-float changeStatus" type="button"' +
                'style="margin-left: 5px;font-size: 20px;">' +
                '<i id="iconStatusHabi" class="fas fa-unlock-alt text-white"></i>' +
              iconreload + '</button>'
            );
          }
        }
        },
      ],
      // tslint:disable-next-line:ban-types no-shadowed-variable
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const vm = this;
        $('.edit', row).bind('click', () => {
          $('#editReload', row).show();
          $('#iconEdit', row).hide();
          vm.getPersonById(data, row);
        });
        $('.delete', row).bind('click', () => {
          vm.deletePerson(data);
        });
        $('.changeStatus', row).bind('click', () => {
          $('#editReload', row).show();
          $('#iconStatusDesab', row).hide();
          $('#iconStatusHabi', row).hide();
          vm.changeStatusPerson(data, row);
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
  getPersonById(data: any, row) {
    const vm = this;
    vm.peopleService.getPersonById(data.id_persona).then(res => {
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        vm.people.per_razon_social = rpta.data.per_razon_social;
        vm.people.docNumber = rpta.data.per_numero_documento;
        vm.people.phone = rpta.data.per_celular;
        vm.people.address = rpta.data.per_direccion;
        vm.people.idPerson = rpta.data.id_persona;
        $('#modalPerson').modal('show');
        vm.btnAccion = true;
      }
    }).catch((err) => {
      console.log('err', err);
    }).finally(() => {
      $('#editReload', row).hide();
      $('#iconEdit', row).show();
    });
  }
  UpdatePerson() {
    const vm = this;
    const isValidate = vm.validate();
    if (isValidate) {
      vm.isLoading = true;
      vm.peopleService.updatePerson(vm.people).then(res => {
        const rpta = sendRespuesta(res);
        if (rpta.status) {
          iziToast.success({
            title: 'Exito',
            position: 'topRight',
            message: rpta.message,
          });
          $('#modalPerson').modal('hide');
          vm.clearForm();
        } else {
          iziToast.error({
            title: 'Error',
            position: 'topRight',
            message: rpta.message,
          });
        }
      }).catch((err) => {
        console.log('error', err);
      }).finally(() => {
        vm.getPerson();
        vm.isLoading = false;
      });
    }
  }
  createPerson() {
    const vm = this;
    const isValidate = vm.validate();
    if (isValidate) {
      vm.isLoading = true;
      vm.peopleService.createPerson(vm.people).then( res => {
        const rpta = sendRespuesta(res);
        if (rpta.status) {
          iziToast.success({
            title: 'Exito',
            position: 'topRight',
            message: rpta.message,
          });
          $('#modalPerson').modal('hide');
          vm.clearForm();
        } else {
          iziToast.error({
            title: 'Error',
            position: 'topRight',
            message: rpta.message,
          });
        }
      }).catch((err) => {
        console.log('err', err);
      }).finally(() => {
        vm.getPerson();
        vm.isLoading = false;
      });
    }
  }
  deletePerson(person: any) {
    const vm = this;
    swal.fire({
      title: 'Eliminar',
      text:  'Seguro de eliminar este proveedor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#008000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        vm.peopleService.deletePerson(person.id_persona).then(res => {
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
          vm.getPerson();
        });
      } else {
        swal.fire({
          icon: 'error',
          title: 'Cancelado',
          text: 'Proveedor a salvo',
        });
      }
    });
  }
  changeStatusPerson(person: any, row) {
    const vm = this;
    vm.peopleService.changeStatusPerson(person).then( res => {
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
      console.log('error', err);
    }).finally(() => {
      $('#editReload', row).hide();
      $('#iconStatusDesab', row).show();
      $('#iconStatusHabi', row).show();
      vm.getPerson();
    });
  }
  clearForm() {
    const vm = this;
    vm.people.per_razon_social = null;
    vm.people.docNumber = null;
    vm.people.phone = null;
    vm.people.address = null;
    vm.people.idPerson = 0;
  }
  soloNumeros(event) {
    soloNumeros(event);
  }
  validate() {
    const vm = this;
    if (vm.people.per_razon_social === null) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Razon Social requerido',
      });
      return false;
    }
    if (vm.people.docNumber === null) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Numero ruc requerido',
      });
      return false;
    }
    if (vm.people.docNumber.length < 11) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Numero ruc debe tener 11 digitos',
      });
      return false;
    }
    if (vm.people.phone === null) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Numero telefonico requerido',
      });
      return false;
    }
    if (vm.people.phone.length < 9) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Numero telefonico debe tener 8 digitos',
      });
      return false;
    }
    if (vm.people.address === null) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Direccion requerido',
      });
      return false;
    }
    return true;
  }
  closeModal() {
    $('body').on('hidden.bs.modal', '.modal', () => {
      this.clearForm();
    });
  }
}
