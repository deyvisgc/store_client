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
    apellido: null,
    nombre: null,
    direccion: null,
    numeroDocumento: null,
    per_razon_social: null,
    telefono: null,
    tipoDocumento: 'RUC',
    idPerson: null,
    typePeron: 'proveedor'
  };
  isloadinglista: boolean;
  isLoading: boolean;
  btnAccion = false;
  constructor(private peopleService: PeopleService) {
  }
  ngOnInit() {
    this.getPerson();
    this.isLoading = false;
  }
  getPerson() {
    const vm = this;
    vm.isloadinglista = true;
    $('.tbPersonActive').hide();
    $('.tbPersonDisabled').hide();
    vm.peopleService.getPeopleInfo().then(res => {
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        vm.personActive = rpta.data.filter( per => per.per_tipo === 'proveedor' && per.per_status === 'active');
        vm.personDisabled =  rpta.data.filter( per => per.per_tipo === 'proveedor' && per.per_status === 'disabled');
        console.log('perso', vm.personActive);
        vm.datatable('.tbPersonActive', vm.personActive);
        vm.datatable('.tbPersonDisabled', vm.personDisabled);
      }
    }).catch((err) => {
      console.log('err', err);
    }).finally(() => {
      vm.isloadinglista = false;
      $('.tbPersonActive').show();
      $('.tbPersonDisabled').show();
    });
    // this.peopleService.getPeopleInfo().subscribe(
    //     (suppliers: any = []) => {
    //       this.supplierActive = suppliers.filter(supplier => supplier.per_tipo === 'PROVEEDOR' && supplier.per_status === 'ACTIVE');
    //       this.supplierDisabled = suppliers.filter(supplier => supplier.per_tipo === 'PROVEEDOR' && supplier.per_status === 'DISABLED');
    //       this.datatable('.tbSupplierEnabled', this.supplierActive);
    //       this.datatable('.tbSupplierDisabled', this.supplierDisabled);
    //     },
    //     error => {
    //       return this.toast.error('No se pudo contactar con el servidor.' +
    //           ' Intentelo nuevamente en 5 minutos', 'ERROR SERVIDOR');
    //     }
    // );
  }

  getSupplierById(data: any) {
  }

  // updateSupplier() {
  //   const typeDocument = document.getElementById('etypeDocument')['value'];
  //   const idPersona = this.supplierForm.get('idPersona').value;
  //   const name = this.supplierForm.get('name').value;
  //   const lastName = this.supplierForm.get('lastName').value;
  //   const address = this.supplierForm.get('address').value;
  //   const phone = this.supplierForm.get('phone').value;
  //   const docNumber = this.supplierForm.get('docNumber').value;
  //   const validation = new Validation();
  //   const checkNumberDoc = validation.validateNumberDoc(typeDocument, docNumber);

  //   if (idPersona === '' || name === '' || lastName === '' || phone === '' || docNumber === '' || address === '') {
  //     return this.toast.error('Complete todos los campos del formulario', 'CAMPOS INCOMPLETOS');
  //   }

  //   if (checkNumberDoc === false) {
  //     return this.toast.error('El tipo de documento no coincide con el numero de documento. ' +
  //         'Verifique la cantidad de dígitos. DNI = 8, RUC = 11', 'NUMERO DOC INVALIDO');
  //   }

  //   this.editing = false;

  //   this.peopleService.updatePerson(this.supplierForm.value).subscribe(
  //       person => {
  //         if (person['original']['code'] === 200 && person['original']['status']  === true) {
  //           this.toast.success('Se ACTUALIZARON correctamente los datos', 'DATOS ACTUALIZADOS');
  //           this.getSuppliers();
  //           this.clearForm();
  //           $('#editSupplier').modal('hide');
  //           this.editing = true;
  //         } else {
  //           this.editing = true;
  //           return this.toast.error('No se enviaron los datos al servidor, intentelo mas tarde', 'ERROR EDITANDO');
  //         }
  //       },
  //       error => {
  //         return this.toast.error('No se enviaron los datos al servidor. Intentelo nuevamente mas tarde', 'ERROR EDITANDO');
  //       }
  //   );
  // }

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

  deleteSupplier(supplier: any) {
  }

  changeStatusSupplier(supplier: any) {
    // this.peopleService.changeStatusPerson(supplier.id_persona).subscribe(
    //     suppliers => {
    //       if (suppliers['original']['code'] === 200 && suppliers['original']['status']  === true) {
    //         this.toast.info('PROVEEDOR habilitada, ya puede ingresar al sistema', 'PROVEEDOR HABILITADA');
    //         this.getSuppliers();
    //       } else {
    //         return this.toast.error('No se pudo contactar con el servidor intentelo mas tarde', 'PROVEEDOR NO HABILITADO');
    //       }
    //     },
    //     error => {
    //       return this.toast.error('No se pudo contactar con el servidor. Intentelo nuevamente', 'ERROR SERVIDOR');
    //     }
    // );
  }

  // UTILITIES

  clearForm() {
    const vm = this;
    vm.people.per_razon_social = null;
    vm.people.numeroDocumento = null;
    vm.people.telefono = null;
    vm.people.direccion = null;
  }
  datatable(tabla, data) {
    $(tabla).DataTable({
      // tslint:disable-next-line:object-literal-shorthand
      data: data,
      columns: [
        { data: 'per_razon_social'},
        { data: 'per_numero_documento'},
        { data: 'per_celular'},
        { data: 'per_direccion'},
        // tslint:disable-next-line:no-shadowed-variable
        { data: (data) => {
            if (data.per_status === 'active') {
              return (
                  // tslint:disable-next-line:max-line-length
                  '<button  title="EDITAR PROVEEDOR" class="btn bg-green btn-circle  waves-effect waves-circle waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;">' +
                  '<i style="padding-bottom:20px" class="fas fa-pen"></i>' +
                  '</button>' +
                  '<button title="DESHABILITAR" class="btn bg-red btn-circle waves-effect waves-circle waves-float delete" type="button"' +
                  'style="margin-left: 5px;font-size: 20px;">' +
                  '<i class="fas fa-trash-alt"></i>' +
                  '</button>'
              );
            } else {
              return (
                  // tslint:disable-next-line:max-line-length
                  '<button  title="EDITAR PROVEEDOR" class="btn bg-green btn-circle waves-effect waves-circle ' +
                  'waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;">' +
                  '<i style="padding-bottom:20px" class="fas fa-pen"></i>' +
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
          vem.getSupplierById(data);
        });
        $('.delete', row).bind('click', () => {
          vem.deleteSupplier(data);
        });
        $('.changeStatus', row).bind('click', () => {
          vem.changeStatusSupplier(data);
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
    if (vm.people.numeroDocumento === null) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Numero ruc requerido',
      });
      return false;
    }
    if (vm.people.numeroDocumento.length < 11) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Numero ruc debe tener 11 digitos',
      });
      return false;
    }
    if (vm.people.telefono === null) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Numero telefonico requerido',
      });
      return false;
    }
    if (vm.people.telefono.length < 9) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Numero telefonico debe tener 8 digitos',
      });
      return false;
    }
    if (vm.people.direccion === null) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Direccion requerido',
      });
      return false;
    }
    return true;
  }
}
