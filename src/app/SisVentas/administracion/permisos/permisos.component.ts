import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { RolService } from '../../service/Administracion/rol/rol.service';
import { PrivilegesService } from '../../service/Privileges/privileges.service';
import iziToast from 'izitoast';
import swal from 'sweetalert2';
import { PermisosService } from '../../service/Administracion/permisos/permisos.service';
declare const sendRespuesta: any;
declare const $: any;
// declare const swal: any;
@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css']
})
export class PermisosComponent implements OnInit {

  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private servPrivilegio: PrivilegesService,
              private rolService: RolService, private permSer: PermisosService) { }
  @ViewChild('isloading', {static: true}) isloading;
  isloadinglista: boolean;
  listPrivilegios = [];
  listRoles       = [];
  idPrivilegio    = [];
  btnisLoading    = false;
  permisos = {
    rol: 0,
    idPrivilegio: []
  };
  ngOnInit() {
    this.startScript();
    this.closeModal();
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min', 'bootstrap-colorpicker').then(data => {
      $('.privilegio').select2({width: '100%'});
      $('.rol').select2({width: '100%'}).on('change', (event) => {
        this.permisos.rol = event.target.value;
      });
      this.getPermisos();
      this.getPrivilegios();
      this.getRol();
      }).catch(error => console.log(error));
  }
  showModal() {
    $('#modalPermisos').modal('show');
  }
  getPermisos() {
    const vm = this;
    this.isloadinglista = true;
    $('#btn').hide();
    $('#table').hide();
    vm.permSer.List().then( res => {
      const rpta = sendRespuesta(res);
      rpta.data.lista.forEach((element, index) => {
        rpta.data.user.forEach(us => {
          if (element.id_rol === us.id_rol) {
            rpta.data.lista[index].users = us.us_usuario;
          }
        });
      });
      vm.datatable('.tbPermisos', rpta.data.lista);
    }).catch((err) => {
      alert(err);
    }).finally(() => {
      $('#btn').show();
      $('#table').show();
      console.log('finalll');
      this.isloadinglista = false;
    });
  }
  getPrivilegios() {
    const vm = this;
    vm.servPrivilegio.getPrivilegios().then( res => {
      const rpta = sendRespuesta(res);
      vm.listPrivilegios = rpta.data;
    }).catch((err) => {
      alert(err);
    }).finally(() => {
      console.log('finalll');
    });
  }
  getRol() {
    const vm = this;
    vm.rolService.getRol().then( res => {
     const rpta = sendRespuesta(res);
     vm.listRoles = rpta.data;
    }).catch((err) => {
        console.log('Error', err);
    }).finally(() => {
        console.log('Final');
    });
  }
  guardar() {
    const vm = this;
    vm.idPrivilegio = [];
    const id = $('.privilegio').select2('data').map(function(elem) {
      return +elem.id;
    });
    vm.idPrivilegio.push(id);
    vm.permisos.idPrivilegio = vm.idPrivilegio[0];
    if (vm.permisos.idPrivilegio.length === 0) {
      iziToast.warning({
        title: 'Advertencia',
        position: 'topRight',
        message: 'necesita como minimo un privilegio para guardar',
      });
      return false;
    }
    if (!vm.permisos.rol) {
      iziToast.warning({
        title: 'Advertencia',
        position: 'topRight',
        message: 'necesita como minimo un rol para guardar',
      });
      return false;
    }
    vm.isloading.showReload();
    vm.btnisLoading = true;
    vm.permSer.Guardar(this.permisos).then( res => {
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
      console.log(err);
    }).finally(() => {
      vm.isloading.closeReload();
      vm.btnisLoading = false;
      $('#modalPermisos').modal('hide');
      vm.getPermisos();
    });
  }
  closeModal() {
    const vm = this;
    $('body').on('hidden.bs.modal', '.modal', () => {
      $('.privilegio').val(null).trigger('change');
      $('.rol').val(null).trigger('change');
      vm.btnisLoading = false;
    });
  }
  datatable(table, permisos) {
    $(table).DataTable({
        data: permisos,
        columns: [
            {
              render(info, type, full, meta) {
                return meta.row + 1;
              }
            },
            { data: 'users'},
            { data: 'pri_nombre'},
            { data: 'rol_name'},
            { data: (data) => {
              // tslint:disable-next-line:max-line-length
              return '<button title="ELIMINAR" class="btn bg-red btn-circle waves-effect waves-circle waves-float delete" type="button"' + 'style="margin-left: 5px;font-size: 20px;">' +
                      '<i class="fas fa-trash-alt"></i>' + '</button>';
            }
          },
        ],
        // tslint:disable-next-line:ban-types
        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          const vem = this;
          $('.delete', row).bind('click', () => {
              vem.deletePermisos(data);
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
  deletePermisos(permisos: any) {
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
        text: 'Seguro de eliminar este permiso',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Eliminar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            vm.permSer.delete(permisos.idrol_has_privilegio).then( res => {
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
                vm.getPermisos();
            });
        } else if (
            result.dismiss === swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'Permiso a salvo',
                'error'
            );
        }
    });
}
}
