import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import iziToast from 'izitoast';
import swal from 'sweetalert2';
declare const flatpickr: any;
declare const $: any;
@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.css']
})
export class LoteComponent implements OnInit {
  form: FormGroup;
  formupdate: FormGroup;
  fechahoy = moment().format('YYYY-MM-DD HH:mm:ss');
  fechaexpiracion = moment().add(1, 'months').format('YYYY-MM-DD HH:mm:ss');
  btnform: boolean;
  isloading: boolean;
  isloadinglista: boolean;
  constructor(private fb: FormBuilder, private almacenServ: AlmacenService, private dynamicScriptLoader: DynamicScriptLoaderService) {
    this.form = this.fb.group({
      lote: [null, Validators.required],
      codigo: [null, Validators.required],
      fecha_creacion: [null, Validators.required],
      fecha_expiracion: [null, Validators.required]
    });
    this.formupdate = this.fb.group({
      lote_update: [0, Validators.required] ,
      codigo_update : [0, Validators.required],
      fecha_creacion_update : [0, Validators.required],
      fecha_expiracion_update : [0, Validators.required],
      id_lote : [0]
    });
  }
  ngOnInit() {
    this.startScript();
    this.Listar();
    this.loadingfalse()
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }
  private loadData() {
    flatpickr('#fecha_creacion', {
      locale: Spanish,
      dateFormat: 'Y-m-d',
      // defaultDate: [this.fechahoy]
    });
    this.form.controls.fecha_creacion.setValue(this.fechahoy);
    flatpickr('#fecha_expiracion', {
      locale: Spanish,
      dateFormat: 'Y-m-d',
      // defaultDate: [this.fechaexpiracion]
    });
    this.form.controls.fecha_expiracion.setValue(this.fechaexpiracion);
  }
  Registrar() {
    const vem = this;
    if (this.form.valid) {
      vem.loadingtrue();
      vem.almacenServ.RegistrarLote(this.form.value).subscribe(res => {
        vem.loadingfalse();
        if ( res['status'] === true) {
          $('#modalRegistrar').modal('hide');
          this.form.reset();
          this.Listar();
          iziToast.success({
           title: 'OK',
           position: 'topRight',
           // tslint:disable-next-line:no-string-literal
           message: res['message'],
          });
         } else {
           iziToast.error({
            title: 'Error',
            position: 'topRight',
            // tslint:disable-next-line:no-string-literal
            message: res['message'],
           });
         }
      });
     } else {
       Object.keys(this.form.controls).forEach(field => { // {1}
         const control = this.form.get(field);            // {2}
         control.markAsTouched({ onlySelf: true });       // {3}
       });
     }
  }
   Listar() {
    let datadesacti: any = [];
    let dataactiva: any = [];
    this.isloadinglista = true;
    $('#tableactive').hide();
    $('#tabledesactivi').hide();
    this.almacenServ.Lote().subscribe((data: any = [] ) => {
      this.isloadinglista = false;
      $('#tableactive').show();
      $('#tabledesactivi').show();
      if (data.length > 0) {
        dataactiva = data.filter(o => o.lot_status === 'active');
        datadesacti = data.filter(o => o.lot_status === 'disable');
        this.datatable('.tblote-activate', dataactiva);
        this.datatable('.tblote-disable', datadesacti);
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: 'Lotes encontrados',
      });
      } else {
        this.datatable('.tblote-activate', data);
        this.datatable('.tblote-disable', data);
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Lotes no encontrados',
      });
      }
    });
   }
  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }
  displayFieldCss(field: string) {
    return {
   'has-error': this.isFieldValid(field),
   'has-feedback': this.isFieldValid(field)
 };
  }
  datatable(url, data) {
    $(url).DataTable({
       // tslint:disable-next-line:object-literal-shorthand
       data: data,
        columns: [
        { data: 'lot_name'},
        { data: 'lot_codigo'},
        { data: 'lot_creation_date'},
        { data: 'lot_expiration_date'},
        { data: 'lot_status',
        // tslint:disable-next-line:object-literal-shorthand
        render: (data1, type, row) => {
          if (row.lot_status === 'active') {
            return '<span _ngcontent-uwn-c151="" class="badge bg-green">ACTIVO</span>';
          } else {
            return '<span _ngcontent-uwn-c151="" class="badge bg-red">INACTIVO</span>';
          }
        }
      },
      { data: (data1) => {
        // tslint:disable-next-line:max-line-length
        const btn1 = '<button _ngcontent-xkn-c6=""  title="ACTUALIZAR" class="btn bg-green btn-circle  waves-effect waves-circle waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-pen"></i></button>';
        // tslint:disable-next-line:max-line-length
        const btn2 = '<button _ngcontent-xkn-c6=""  title="ELIMINAR" class="btn bg-red btn-circle waves-effect waves-circle waves-float delete" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fas fa-trash-alt"></i></button>';
        if (data1.lot_status === 'active') {
          return (
            // tslint:disable-next-line:max-line-length
             btn1 + btn2 + '<button _ngcontent-xkn-c6="" title="DESACTIVAR" class="btn btn-info btn-circle waves-effect waves-circle waves-float changestatus" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fas fa-frown"></i></button>');
        } else {
          return (
            // tslint:disable-next-line:max-line-length
            btn1 + btn2 + '<button _ngcontent-xkn-c6=""  title="ACTIVAR"  class="btn btn-success btn-circle  waves-effect waves-circle waves-float changestatus" type="button"  style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-grin-beam"></i></button>');
        }
      }
      },
      ],
      rowCallback: ( row, data ) => {
        $('.edit', row).bind('click', () => {
          this.edit(data);
        });
        $('.delete', row).bind('click', () => {
          this.delete(data);
        });
        $('.changestatus', row).bind('click', () => {
          this.changestatus(data);
        });
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
  edit(data) {
    $('#modalUpdate').modal('show');
    this.formupdate.controls.lote_update.setValue(data.lot_name);
    this.formupdate.controls.codigo_update.setValue(data.lot_codigo);
    this.formupdate.controls.fecha_creacion_update.setValue(data.lot_creation_date);
    this.formupdate.controls.fecha_expiracion_update.setValue(data.lot_expiration_date);
    this.formupdate.controls.id_lote.setValue(data.id_lote);
  }
  Actualizar() {
     if (this.formupdate.valid) {
      this.almacenServ.ActualizarLote(this.formupdate.value).subscribe(res => {
        if ( res['status'] === true) {
          $('#modalUpdate').modal('hide');
          this.form.reset();
          this.Listar();
          iziToast.success({
           title: 'OK',
           position: 'topRight',
           // tslint:disable-next-line:no-string-literal
           message: res['message'],
          });
         } else {
           iziToast.error({
            title: 'Error',
            position: 'topRight',
            // tslint:disable-next-line:no-string-literal
            message: res['message'],
           });
         }
      });
     } else {
      Object.keys(this.formupdate.controls).forEach(field => { // {1}
        const control = this.formupdate.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
     }
  }
  delete(info: any) {
    let me = this;
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: 'Estas seguro?',
      text: 'De eliminar este Lote',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        me.almacenServ.DeleteLote(info.id_lote).subscribe(res => {
          if (res['status'] === true) {
            swalWithBootstrapButtons.fire(
              'Deleted!',
               res['message'],
              'success');
            this.Listar();
          } else {
            swalWithBootstrapButtons.fire(
              'Error!',
              res['message'],
              'error');
          }
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Tu Lote está a salvo :)',
          'error'
          );
      }
    });
   }
   changestatus(data) {
    this.almacenServ.ChangeStatusLote(data).subscribe( res => {
      if (res['status'] === true) {
        this.Listar();
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: res['message'],
      });
      } else {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: res['message'],
      });
      }
    });
  }
  loadingtrue() {
    let vm = this;
    vm.btnform = false;
    vm.isloading = true;
  }
  loadingfalse() {
    let vm= this;
    vm.btnform = true;
    vm.isloading = false;
  }
  isFieldValidUpdate(field: string) {
    return !this.formupdate.get(field).valid && this.formupdate.get(field).touched;
  }
  displayFieldCssUpdate(field: string) {
    return {
   'has-error': this.isFieldValidUpdate(field),
   'has-feedback': this.isFieldValidUpdate(field),
  };
  }
}
