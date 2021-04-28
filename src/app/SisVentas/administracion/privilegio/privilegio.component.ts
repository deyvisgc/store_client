import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import iziToast from 'izitoast';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { PrivilegesService } from '../../service/Privileges/privileges.service';
declare const sendRespuesta: any;
declare const $: any;
declare const swal: any;
@Component({
  selector: 'app-privilegio',
  templateUrl: './privilegio.component.html',
  styleUrls: ['./privilegio.component.css']
})
export class PrivilegioComponent implements OnInit {
  btnisLoading = false;
  grupoPrivile = false;
  title = '';
  listGrupos = [];
  viewDetalle = false;
  detallePrivielgios = [];
  idPrivilegios = [];
  btnOperacion = false;
  privilegio = {
    nombre: '',
    acceso : '',
    grupo: '',
    icon: '',
    idPadre: 0,
    idPrivilegio: 0
  };
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private servPrivilegio: PrivilegesService ) { }

  ngOnInit() {
    this.startScript();
    $('body').on('hidden.bs.modal', '.modal', () => {
      this.limpiar();
      this.getIconSelect();
      this.btnOperacion = false;
      this.viewDetalle = false;
    });
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.getGrupos();
      this.getIconSelect();
      this.getPrivilegios();
    }).catch(error => console.log(error));
  }
  showGrupo() {
    const vm = this;
    $('#modalGrupoAndPrivlegio').modal('show');
    vm.grupoPrivile = false;
    vm.title = 'Registrar Grupo';
  }
  showPrivilegio() {
    const vm = this;
    $('#modalGrupoAndPrivlegio').modal('show');
    vm.title = 'Registrar Privilegios';
    vm.grupoPrivile = true;
  }
  getIconSelect() {
    const vm = this;
    vm.servPrivilegio.getIcon().then( res => {
      const rpta = sendRespuesta(res);
      vm.addIcons(rpta);
    }).catch((err) => {
      alert(err);
    }).finally(() => {
      console.log('finalll');
    });
  }
  getGrupos() {
    const vm = this;
    vm.servPrivilegio.getGrupo().then( res => {
      const rpta = sendRespuesta(res);
      vm.listGrupos = rpta.data.filter( f => f.pri_status === 'active');
      vm.datatableGrupos('.tbgrupos', rpta.data);
    }).catch((err) => {
      alert(err);
    }).finally(() => {
      console.log('finalll');
    });
  }
  getPrivilegios() {
    const vm = this;
    vm.servPrivilegio.getPrivilegios().then( res => {
      const rpta = sendRespuesta(res);
      vm.datatablePrivilegio('.privilegios', rpta.data);
    }).catch((err) => {
      alert(err);
    }).finally(() => {
      console.log('finalll');
    });
  }
  addIcons(icons) {
    // const options = new Array();
    $.each(icons, function(index, icon) {
    $('#icons').append("<option value='" + icon.icon_name + "'>" + icon.icon_name + ' ' + icon.codeunic + "</option>");

    // options.push({
    //     id: icon.icon_name,
    //     text: '<i class="fas fa' + icon.icon_name + '"></i> ' + icon.icon_name
    //   });
    });
    // $('#select').select2({
    //   data: options,
    //   width: '95%',
    //   theme: 'classic',
    //   selectOnClose: true,
    //   escapeMarkup(markup) {
    //     return markup;
    //   },
    // });
  }
  guardarGrupoAndPrivilegios() {
    const vm = this;
    const statusValidacion = vm.validar(vm.privilegio.idPadre);
    if (statusValidacion) {
      vm.btnisLoading = true;
      vm.servPrivilegio.AddGrupos(vm.privilegio).then(res => {
        const rpta = sendRespuesta(res);
        if (rpta.status) {
          iziToast.success({
            title: 'Exito',
            position: 'topRight',
            message: rpta.message,
          });
          vm.limpiar();
          $('#modalGrupoAndPrivlegio').modal('hide');
          return false;
        }
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: rpta.message,
        });
        return false;
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        vm.btnisLoading = false;
        vm.getGrupos();
        vm.getPrivilegios();
      });
    }
  }
  limpiar() {
    const vm = this;
    vm.privilegio.acceso = '';
    vm.privilegio.grupo = '';
    vm.privilegio.nombre = '';
    $('#icons').val(null).trigger('change');
    $('#grupo').val(null).trigger('change');
  }
  validar(idPadre) {
    const vm = this;
    if (vm.privilegio.nombre === '') {
      iziToast.warning({
        title: 'Advertencia',
        position: 'topRight',
        message: 'Nombre de grupo requerido',
      });
      return false;
    }
    if (idPadre === 0) {
      vm.privilegio.icon = document.getElementById('icons')['value'];
      if (vm.privilegio.icon === '') {
        iziToast.warning({
          title: 'Advertencia',
          position: 'topRight',
          message: 'Icon de grupo requerido',
        });
        return false;
      }
      return true;
    } else {
      if (vm.privilegio.acceso === '') {
        iziToast.warning({
          title: 'Advertencia',
          position: 'topRight',
          message: 'Acceso del privilegio requerido',
        });
        return false;
      }
      if (vm.privilegio.idPadre === 0) {
        iziToast.warning({
          title: 'Advertencia',
          position: 'topRight',
          message: 'Grupo del privilegio requerido',
        });
        return false;
      }
      return true;
    }
  }
  selectGrupo(event) {
    const vm = this;
    const grupo = event.target.value.split(' ');
    vm.privilegio.idPadre = grupo[0];
    vm.privilegio.grupo = grupo[1];
  }
  datatableGrupos(table, grupo) {
    $(table).DataTable({
      // tslint:disable-next-line:object-literal-shorthand
      data: grupo,
      columns: [
        {
          render(info, type, full, meta) {
            return meta.row + 1;
          }
        },
        { data: 'pri_group'},
        { data: 'pri_acces'},
        { data: 'pri_icon'},
        { data: 'pri_status',
        render: (data1, type, row) => {
          if (row.pri_status === 'active') {
            return '<span _ngcontent-uwn-c151="" class="badge bg-green">HABILITADO</span>';
          } else {
            return '<span _ngcontent-uwn-c151="" class="badge bg-red">DESABILITADO</span>';
          }
        }
        },
        // tslint:disable-next-line:no-shadowed-variable
        { data: (data) => {
          // tslint:disable-next-line:max-line-length
          const btnDetalle = '<button  title="VER PRIVILEGIOS DEL GRUPO" class="btn btn-info btn-circle  waves-effect waves-circle waves-float viewDetalle" type="button" style="margin-left: 5px;font-size: 20px;">' + '<i  class="fas fa-eye"></i>' + '</button>';
          // tslint:disable-next-line:max-line-length
          const btnActualizar = '<button  title="ACTUALIZAR GRUPO" class="btn bg-green btn-circle  waves-effect waves-circle waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;">' + '<i class="fas fa-pen"></i>' + '</button>';
          if (data.pri_status === 'active') {
            return (
              btnDetalle + btnActualizar +
             '<button title="DESACTIVAR" class="btn bg-red btn-circle waves-effect waves-circle waves-float changeStatus" type="button"' +
             'style="margin-left: 5px;font-size: 20px;">' +
             '<i class="fas fa-trash-alt"></i>' +
             '</button>'
           );
          } else {
            return (
              btnDetalle + btnActualizar +
             '<button title="ACTIVAR" class="btn bg-teal btn-circle waves-effect waves-circle waves-float changeStatus" type="button"' +
             'style="margin-left: 5px;font-size: 20px;">' +
             '<i _ngcontent-cfq-c7="" class="fas fa-check-square"></i>' +
             '</button>'
           );
          }
          }
        },
      ],
      // tslint:disable-next-line:ban-types no-shadowed-variable
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const vm = this;

        $('.viewDetalle', row).bind('click', () => {
          vm.fetchDetallePrivilegios(data);
        });
        $('.edit', row).bind('click', () => {
          vm.getGrupoxId(data);
        });
        $('.changeStatus', row).bind('click', () => {
          vm.ChangeStatus(data);
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
  datatablePrivilegio(table, privilegio) {
    $(table).DataTable({
      // tslint:disable-next-line:object-literal-shorthand
      data: privilegio,
      columns: [
        {
          render(info, type, full, meta) {
            return meta.row + 1;
          }
        },
        { data: 'pri_nombre'},
        { data: 'pri_acces'},
        { data: 'pri_group'},
        { data: 'pri_status',
        render: (data1, type, row) => {
          if (row.pri_status === 'active') {
            return '<span _ngcontent-uwn-c151="" class="badge bg-green">HABILITADO</span>';
          } else {
            return '<span _ngcontent-uwn-c151="" class="badge bg-red">DESABILITADO</span>';
          }
        }
        },
        { data: (data) => {
          // tslint:disable-next-line:max-line-length
          const btnActualizar = '<button  title="ACTUALIZAR GRUPO" class="btn bg-green btn-circle  waves-effect waves-circle waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;">' + '<i class="fas fa-pen"></i>' + '</button>';
          if (data.pri_status === 'active') {
            return (
               btnActualizar +
             '<button title="DESACTIVAR" class="btn bg-red btn-circle waves-effect waves-circle waves-float changeStatus" type="button"' +
             'style="margin-left: 5px;font-size: 20px;">' +
             '<i class="fas fa-trash-alt"></i>' +
             '</button>'
           );
          } else {
            return (
               btnActualizar +
             '<button title="ACTIVAR" class="btn bg-teal btn-circle waves-effect waves-circle waves-float changeStatus" type="button"' +
             'style="margin-left: 5px;font-size: 20px;">' +
             '<i _ngcontent-cfq-c7="" class="fas fa-check-square"></i>' +
             '</button>'
           );
          }
          }
        },
      ],
      // tslint:disable-next-line:ban-types no-shadowed-variable
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const vm = this;

        $('.viewDetalle', row).bind('click', () => {
          vm.fetchDetallePrivilegios(data);
        });
        $('.edit', row).bind('click', () => {
          vm.getGrupoxId12(data);
        });
        $('.changeStatus', row).bind('click', () => {
          vm.ChangeStatus(data);
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
  fetchDetallePrivilegios(grupo: any) {
    const vm = this;
    vm.title = 'Detalle de Privilegios';
    vm.viewDetalle = true;
    vm.servPrivilegio.getGrupoDetalle(grupo.id_privilegio).then( res => {
      const rpta = sendRespuesta(res);
      if (rpta.data.length > 0) {
        $('#modalGrupoAndPrivlegio').modal('show');
        vm.detallePrivielgios = rpta.data;
        return;
      }
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'no existen privilegios para este grupo',
      });
      vm.viewDetalle = false;
    }).catch((err) => {
      console.log('Error', err);
    }).finally(() => {
    });
  }
  eliminarPrivilegioGrupo(item) {
    const vm = this;
    const obj = {
      idPadre: item.id_Padre,
      idPrivlegio: item.id_privilegio
    };
    vm.servPrivilegio.DeletePrivilegioGrupo(obj).then( res => {
      console.log(res);
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        iziToast.success({
          title: 'Exito',
          position: 'topRight',
          message: rpta.message,
        });
        $('#modalGrupoAndPrivlegio').modal('hide');
      } else {
        iziToast.error({
          title: 'Advertencia',
          position: 'topRight',
          message: rpta.message,
        });
      }
    }).catch((err) => {
      alert(err);
    }).finally(() => {
      vm.viewDetalle = false;
      console.log('final');
    });
  }
  getGrupoxId(item) {
    const vm = this;
    vm.privilegio.nombre = item.pri_nombre;
    vm.privilegio.acceso = item.pri_acces;
    document.querySelector('#icons')['value'] = item.pri_icon;
    vm.title = 'Actualizar Grupo';
    vm.privilegio.idPrivilegio = item.id_privilegio;
    vm.btnOperacion = true;
    $('#modalGrupoAndPrivlegio').modal('show');
  }
  getGrupoxId12(item) {
    const vm = this;
    vm.privilegio.nombre = item.pri_nombre;
    vm.privilegio.acceso = item.pri_acces;
    document.querySelector('#grupos')['value'] = item.id_Padre;
    vm.title = 'Actualizar Grupo';
    vm.privilegio.idPrivilegio = item.id_privilegio;
    vm.btnOperacion = true;
    vm.grupoPrivile = true;
    $('#modalGrupoAndPrivlegio').modal('show');
  }
  Actualizar() {
    const vm = this;
    const statusValidacion = vm.validar(vm.privilegio.idPadre);
    if (statusValidacion) {
      vm.btnisLoading = true;
      vm.servPrivilegio.UpdatePrivilegios(vm.privilegio).then(res => {
        const rpta = sendRespuesta(res);
        if (rpta.status) {
          iziToast.success({
            title: 'Exito',
            position: 'topRight',
            message: rpta.message,
          });
          vm.limpiar();
          $('#modalGrupoAndPrivlegio').modal('hide');
          return false;
        }
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: rpta.message,
        });
        return false;
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        vm.btnisLoading = false;
        vm.getGrupos();
      });
    }
  }
  ChangeStatus(item) {
    const vm = this;
    const texto = item.pri_status === 'active' ? 'Desabilitar este grupo' : 'Habilitar este grupo';
    const confirmbtn = item.pri_status === 'active' ? 'Si, Desabilitar!' : 'Si, Habilitar!';
    swal({
        title: 'Estas seguro de?',
        text: texto,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#31DE41',
        confirmButtonText: confirmbtn,
        closeOnConfirm: false
    // tslint:disable-next-line:only-arrow-functions
    }, function(isConfirm) {
        if (isConfirm) {
          vm.servPrivilegio.ChangeStatus(item).then( res => {
            const rpta = sendRespuesta(res);
            if (rpta.status) {
              swal('Desabilitado!', rpta.message);
            }
          }).catch((err) => {
            swal(err);
          }).finally(() => {
            vm.getGrupos();
          });
        } else {
            swal('Cancelado', 'Grupo a salvo :)', 'error');
        }
    });
  }
}
