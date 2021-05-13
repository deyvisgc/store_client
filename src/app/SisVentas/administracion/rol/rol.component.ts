import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RolService} from '../../service/Administracion/rol/rol.service';
import swal from 'sweetalert2';
import {DynamicScriptLoaderService} from '../../../services/dynamic-script-loader.service';
import iziToast from 'izitoast';
declare const $: any;
declare const sendRespuesta: any;

@Component({
    selector: 'app-rol',
    templateUrl: './rol.component.html',
    styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {
    @ViewChild('isloadingCreate', {static: true}) isloadingCreate;
    @ViewChild('isloadingUpdate', {static: true}) isloadingUpdate;
    formRol: FormGroup;
    btnisLoading = false;
    btnaccion   = false;
    creating = true;
    editing = true;
    activeRol: any[] = [];
    disabledRol: any[] = [];
    isloadingLista: boolean;
    constructor( private formBuilder: FormBuilder, private rolService: RolService,
                 private dynamicScriptLoader: DynamicScriptLoaderService) {
                     this.formRol = this.formBuilder.group({
                       rolName: [''],
                       idRol: 0,
                     });
                }

    ngOnInit() {
        this.startScript();
        document.getElementById('update').style.display = 'none';
    }
    async startScript() {
        await this.dynamicScriptLoader.load('form.min').then(data => {
            this.getRol();
            this.closeModal();
        }).catch(error => console.log(error));
    }
    createRol() {
        const vm = this;
        const rolName = vm.formRol.get('rolName').value;
        if (!rolName) {
            iziToast.warning({
                title: 'Advertencia',
                position: 'topRight',
                message: 'Nombre rol requerido',
            });
            return;
        }
        vm.isloadingCreate.showReload();
        vm.btnisLoading = true;
        vm.rolService.createRol(vm.formRol.value).then( res => {
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
            vm.isloadingCreate.closeReload();
            vm.getRol();
        });
    }

    getRol() {
      const vm = this;
      vm.isloadingLista = true;
      $('#tableRol').hide();
      this.rolService.getRol().then( res => {
       const rpta = sendRespuesta(res);
       vm.datatable('.tbRol', rpta.data);
      }).catch((err) => {
          console.log('Error', err);
      }).finally(() => {
        vm.isloadingLista = false;
        $('#tableRol').show();
      });
    }
    datatable(table, rol) {
      $(table).DataTable({
          data: rol,
          columns: [
              { data: 'rol_name'},
              { data: 'rol_status',
                render: (data, type, row) => {
                    if (row.rol_status === 'active') {
                        return '<span class="badge bg-green">HABILITADO</span>';
                    } else {
                         return '<span class="badge bg-red">DESHABILITADO</span>';
                    }
                }
              },
              { data: (data) => {
                  // tslint:disable-next-line:max-line-length
                  const btnActualizar = '<button  title="ACTUALIZAR GRUPO" class="btn bg-green btn-circle  waves-effect waves-circle waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;">' + '<i class="fas fa-pen"></i>' + '</button>';
                  // tslint:disable-next-line:max-line-length
                  const btneliminar   =  '<button title="ELIMINAR" class="btn bg-red btn-circle waves-effect waves-circle waves-float delete" type="button"' + 'style="margin-left: 5px;font-size: 20px;">' +
                                      '<i class="fas fa-trash-alt"></i>' + '</button>';
                  if (data.rol_status === 'active') {
                      return (
                        btnActualizar + btneliminar +
                          // tslint:disable-next-line:max-line-length
                          '<button title="DESABILITAR" class="btn bg-deep-orange btn-circle waves-effect waves-circle waves-float changeStatus" ' + 
                          ' type="button"' +
                          'style="margin-left: 5px;font-size: 20px;">' +
                          '<i _ngcontent-aoo-c6="" class="fas fa-user-slash"></i>' +
                          '</button>'
                      );
                  } else {
                      return (
                        btnActualizar + btneliminar +
                        '<button title="HABILITAR" class="btn bg-cyan btn-circle waves-effect waves-circle waves-float changeStatus" ' + 
                        ' type="button"' +
                        'style="margin-left: 5px;font-size: 20px;">' +
                        '<i _ngcontent-cfq-c7="" class="fas fa-check-square"></i>' +
                        '</button>'
                      );
                  }
              }
            },
          ],
          // tslint:disable-next-line:ban-types
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
            emptyTable: 'No exsiten Roles',
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
    getRolById(rol: any) {
        const vm = this;
        vm.formRol.controls.idRol.setValue(rol.id_rol);
        vm.formRol.controls.rolName.setValue( rol.rol_name);
        vm.btnisLoading = false;
        document.getElementById('create').style.display = 'none';
        document.getElementById('update').style.display = 'block';
        $('#RolModal').modal('show');
    }

    deleteRol(rol: any) {
        const vm = this;
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
                vm.rolService.deleteRol(rol.id_rol).then( res => {
                    const rpta = sendRespuesta(res);
                    if (rpta.status) {
                        swalWithBootstrapButtons.fire(
                            'Exito!',
                            rpta.message,
                            'success'
                        );
                    } else {
                        swalWithBootstrapButtons.fire(
                            'ERROR',
                            rpta.message,
                            'error'
                        );
                    }
                }).catch(( err) => {
                    console.log('Error', err);
                }).finally(() => {
                    vm.getRol();
                });
            } else if (
                result.dismiss === swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'Rol a salvo',
                    'error'
                );
            }
        });
    }
    UpdateRol() {
      const vm = this;
      const rolName = vm.formRol.get('rolName').value;
      if (!rolName) {
        iziToast.warning({
            title: 'Advertencia',
            position: 'topRight',
            message: 'Nombre rol requerido',
        });
        return;
      }
      vm.isloadingUpdate.showReload();
      vm.btnisLoading = true;
      vm.rolService.editRol(vm.formRol.value).then( res => {
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
        vm.isloadingUpdate.closeReload();
        vm.getRol();
        $('#RolModal').modal('hide');
      });
    }
    clearFormFields() {
        const vm = this;
        vm.formRol.controls.rolName.setValue(['']);
        vm.formRol.controls.idRol.setValue(['']);
    }
    changeStatus(data: any) {
        const vm = this;
        const texto = data.rol_status === 'active' ? 'Seguro de desabilitar este rol' : 'Seguro de habilirar este rol';
        const confirmButton = data.rol_status === 'active' ? ' Desabilitar' : 'Habilitar';
        const swalWithBootstrapButtons = swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: confirmButton + ' ?',
            text: texto,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, ' + confirmButton,
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                vm.rolService.changeStatusRol(data).then( res => {
                    const rpta = sendRespuesta(res);
                    if (rpta.status) {
                        swalWithBootstrapButtons.fire(
                            'Exito!',
                            rpta.message,
                            'success'
                        );
                    } else {
                        swalWithBootstrapButtons.fire(
                            'ERROR',
                            rpta.message,
                            'error'
                        );
                    }
                }).catch(( err) => {
                    console.log('Error', err);
                }).finally(() => {
                    vm.getRol();
                });
            } else if (
                result.dismiss === swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'Rol a salvo',
                    'error'
                );
            }
        });
    }
    closeModal() {
      $('body').on('hidden.bs.modal', '.modal', () => {
        document.getElementById('create').style.display = 'block';
        document.getElementById('update').style.display = 'none';
        this.formRol.controls.rolName.setValue('');
      });
    }

}
