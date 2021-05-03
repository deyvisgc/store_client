import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {PeopleService} from '../../service/Administracion/people/people.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DynamicScriptLoaderService} from '../../../services/dynamic-script-loader.service';
import {Validation} from '../../../utils/validation';
import swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.sass']
})
export class ProveedorComponent implements OnInit {
  supplierActive: any[] = [];
  supplierDisabled: any[] = [];
  supplierForm: FormGroup;
  editing: boolean;
  creating: boolean;

  constructor(
      private toast: ToastrService,
      private peopleService: PeopleService,
      private formBuilder: FormBuilder,
      private dynamicScriptLoader: DynamicScriptLoaderService,
  ) {
    this.supplierForm = this.formBuilder.group({
      idPersona: [''],
      name: [''],
      lastName: [''],
      address: [''],
      phone: [''],
      typePerson: [''],
      typeDocument: [''],
      docNumber: [''],
    });
  }

  ngOnInit() {
    this.creating = true;
    this.editing = true;
    this.getSuppliers();
    this.startScript().then(r => console.log(r));
  }

  getSuppliers() {
    this.peopleService.getPeopleInfo().subscribe(
        (suppliers: any = []) => {
          this.supplierActive = suppliers.filter(supplier => supplier.per_tipo === 'PROVEEDOR' && supplier.per_status === 'ACTIVE');
          this.supplierDisabled = suppliers.filter(supplier => supplier.per_tipo === 'PROVEEDOR' && supplier.per_status === 'DISABLED');
          this.datatable('.tbSupplierEnabled', this.supplierActive);
          this.datatable('.tbSupplierDisabled', this.supplierDisabled);
        },
        error => {
          return this.toast.error('No se pudo contactar con el servidor.' +
              ' Intentelo nuevamente en 5 minutos', 'ERROR SERVIDOR');
        }
    );
  }

  getSupplierById(data: any) {
    if (data.id_persona < 0) {
      return this.toast.error('No se pudo obtener informacion del proveedor. Recargue la página', 'ERROR SERVIDOR');
    }

    this.supplierForm.controls.idPersona.setValue(data.id_persona);
    this.supplierForm.controls.name.setValue(data.per_nombre);
    this.supplierForm.controls.lastName.setValue(data.per_apellido);
    this.supplierForm.controls.address.setValue(data.per_direccion);
    this.supplierForm.controls.phone.setValue(data.per_celular);
    this.supplierForm.controls.typePerson.setValue(data.per_tipo);
    this.supplierForm.controls.typeDocument.setValue(data.per_tipo_documento);
    $('#etypeDocument').val(data.per_tipo_documento).trigger('change');
    this.supplierForm.controls.docNumber.setValue(data.per_numero_documento);

    $('#editSupplier').modal({
      keyboard: false,
      backdrop: 'static',
      show: true,
    });
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

  createSupplier() {
    const typeDocument = document.getElementById('typeDocument')['value'];
    this.supplierForm.controls.typePerson.setValue('PROVEEDOR');
    this.supplierForm.controls.typeDocument.setValue(typeDocument);
    this.supplierForm.controls.idPersona.setValue('0');
    const idPersona = this.supplierForm.get('idPersona').value;
    const name = this.supplierForm.get('name').value;
    const lastName = this.supplierForm.get('lastName').value;
    const address = this.supplierForm.get('address').value;
    const phone = this.supplierForm.get('phone').value;
    const docNumber = this.supplierForm.get('docNumber').value;
    const validation = new Validation();
    const checkNumberDoc = validation.validateNumberDoc(typeDocument, docNumber);

    if (idPersona === '' || name === '' || lastName === '' || phone === '' ||
        docNumber === '' || address === '' || typeDocument === '') {
      return this.toast.error('Complete todos los campos del formulario', 'CAMPOS INCOMPLETOS');
    }

    if (checkNumberDoc === false) {
      return this.toast.error('El tipo de documento no coincide con el numero de documento. ' +
          'Verifique la cantidad de dígitos. DNI = 8, RUC = 11', 'NUMERO DOC INVALIDO');
    }
    this.creating = true;

    this.peopleService.createSupplierPerson(this.supplierForm.value).subscribe(
        person => {
          if (person['original']['code'] === 200 && person['original']['status']  === true) {
            this.toast.success('Proveedor registrado correctamente', 'PROVEEDOR REGISTRADO');
            this.getSuppliers();
            this.clearForm();
            $('#createSupplier').modal('hide');
            this.creating = true;
          } else {
            this.creating = true;
            return this.toast.error('No se enviaron los datos al servidor, intentelo mas tarde', 'ERROR SERVIDOR');
          }
        },
        error => {
          return this.toast.error('No se enviaron los datos al servidor. Intentelo mas tarde', 'ERROR SERVIDOR');
        }
    );
  }

  deleteSupplier(supplier: any) {
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
      text: 'Seguro de deshabilitar al Proveedor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Deshabilitar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        contextUser.peopleService.disabledPerson(supplier.id_persona).subscribe(
            suppliers => {
              if (suppliers['original']['status'] === true && suppliers['original']['code'] === 200) {
                swalWithBootstrapButtons.fire(
                    'Deshabilitado!',
                    'El proveedor fue deshabilitado.',
                    'success'
                );
                this.getSuppliers();
              } else {
                swalWithBootstrapButtons.fire(
                    'ERROR',
                    'No se pudo deshabilitar al proveedor',
                    'error'
                );
              }
            },
            error => {
              swalWithBootstrapButtons.fire(
                  'ERROR',
                  'No se pudo deshabilitar al proveedor',
                  'error'
              );
            }
        );
      } else if (
          result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
            'Cancelado',
            'Proveedor no deshabilitada',
            'error'
        );
      }
    });
  }

  changeStatusSupplier(supplier: any) {
    this.peopleService.changeStatusPerson(supplier.id_persona).subscribe(
        suppliers => {
          if (suppliers['original']['code'] === 200 && suppliers['original']['status']  === true) {
            this.toast.info('PROVEEDOR habilitada, ya puede ingresar al sistema', 'PROVEEDOR HABILITADA');
            this.getSuppliers();
          } else {
            return this.toast.error('No se pudo contactar con el servidor intentelo mas tarde', 'PROVEEDOR NO HABILITADO');
          }
        },
        error => {
          return this.toast.error('No se pudo contactar con el servidor. Intentelo nuevamente', 'ERROR SERVIDOR');
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

  clearForm() {
    this.supplierForm.controls.idPersona.setValue('');
    this.supplierForm.controls.name.setValue('');
    this.supplierForm.controls.lastName.setValue('');
    this.supplierForm.controls.address.setValue('');
    this.supplierForm.controls.phone.setValue('');
    this.supplierForm.controls.typePerson.setValue('');
    this.supplierForm.controls.typeDocument.setValue('');
    this.supplierForm.controls.docNumber.setValue('');
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
}
