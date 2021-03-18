import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import * as moment from 'moment';
import iziToast from 'izitoast';
import swal from 'sweetalert2';
declare const flatpickr: any;
declare const $: any;

@Component({
  selector: 'app-unidadmedida',
  templateUrl: './unidadmedida.component.html',
  styleUrls: ['./unidadmedida.component.sass']
})
export class UnidadmedidaComponent implements OnInit {
  form: FormGroup;
  formupdate: FormGroup;
  fechahoy = moment().format('YYYY-MM-DD HH:mm:ss');
  btnform: boolean;
   isloading: boolean;
  constructor(private fb: FormBuilder, private almacenServ: AlmacenService, private dynamicScriptLoader: DynamicScriptLoaderService) {
    this.form = this.fb.group({
      um_name: [null, Validators.required],
      um_alias: [null, Validators.required],
      fecha_creacion: [null, Validators.required],
    });
    this.formupdate = this.fb.group({
      unidad_update : [null, Validators.required],
      alias_update : [null, Validators.required],
      fecha_creacion_update : [null, Validators.required],
      id_unidad_medida : [0]
    });
   }
  ngOnInit() {
    this.startScript();
    this.loadingfalse();
    this.Listar();
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
    });
    this.form.controls.fecha_creacion.setValue(this.fechahoy);
  }
  Registrar() {
    let vm = this;
    if (this.form.valid) {
      this.loadingtrue();
      this.almacenServ.RegistrarUnidad(this.form.value).subscribe(res => {
        $('#modalRegistrar').modal('hide');
        this.form.reset();
        this.loadingfalse();
        if (res['status'] === true) {
          this.Listar();
          iziToast.success({
            title: 'OK',
            position: 'topRight',
            message: res['message'],
        });
        } else {
          this.loadingfalse();
          iziToast.error({
            title: 'OK',
            position: 'topRight',
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
    let vm= this;
    let datadesacti: any = [];
    let dataactiva: any = [];
    vm.isloading = true;
    $('#tableactive').hide();
    $('#tabledesactivi').hide();
    this.almacenServ.UnidadMedida().subscribe((res: any = []) => {
       if (res.length > 0) {
        this.loadingfalse();
        $('#tableactive').show();
        $('#tabledesactivi').show();
        dataactiva = res.filter(o => o.um_status === 'active');
        datadesacti = res.filter(o => o.um_status === 'disable');
        this.datatable('.tbunidad-activate', dataactiva);
        this.datatable('.tbunidad-disable', datadesacti);
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: 'Unidad de Medida encontradas',
        });
       } else {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Unidad de Medida no encontradas',
        });
        this.datatable('.tbunidad-activate', dataactiva);
        this.datatable('.tbunidad-disable', datadesacti);
       }
     });
   }
   datatable(url, data) {
    $(url).DataTable({
       // tslint:disable-next-line:object-literal-shorthand
       data: data,
        columns: [
        { data: 'um_name'},
        { data: 'um_nombre_corto'},
        { data: 'um_fecha_creacion'},
        { data: 'um_status',
        // tslint:disable-next-line:object-literal-shorthand
        render: (data1, type, row) => {
          if (row.um_status === 'active') {
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
        if (data1.um_status === 'active') {
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
        emptyTable: 'No exsiten Unidad de medida',
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
  // capturarAlias(event) {
  //   const anyString = 'Kilogramo';
  //   let data1 = '';
  //   for (let index = 0; index < anyString.length; index++) {
  //     console.log(anyString.length);
  //     if (anyString.length[index] === 1 ) {
  //       console.log('anyString[index]', anyString[index]);
  //       data1 += anyString[index];
  //     } else if (anyString.length === 3 ) {
  //       data1 += anyString[index];
  //     } else if (anyString.length === 5 ) {
  //       data1 += anyString[index];
  //     }
  //   }
    // console.log('data1', data1);
    // var anyString1 = anyString.substring(1, 5); // Displays last 5 characters
    // console.log(anyString1);
    // const element = event.target.value;
    // let data1 = element.substring(0,3);
    //  console.log('data', data1)
  //   // // this.form.controls.um_alias.setValue(alias);
  // }
  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }
  isFieldValidUpdate(field: string) {
    return !this.formupdate.get(field).valid && this.formupdate.get(field).touched;
  }
  displayFieldCss(field: string) {
    return {
   'has-error': this.isFieldValid(field),
   'has-feedback': this.isFieldValid(field),
 };
  }
  displayFieldCssUpdate(field: string) {
    return {
   'has-error': this.isFieldValidUpdate(field),
   'has-feedback': this.isFieldValidUpdate(field),
  };
  }
  edit(data) {
    $('#modalUpdate').modal('show');
    this.formupdate.controls.unidad_update.setValue(data.um_name);
    this.formupdate.controls.alias_update.setValue(data.um_nombre_corto);
    this.formupdate.controls.fecha_creacion_update.setValue(data.um_fecha_creacion);
    this.formupdate.controls.id_unidad_medida.setValue(data.id_unidad_medida);
  }
  Actualizar() {
    if (this.formupdate.valid) {
      this.loadingtrue();
      this.almacenServ.ActualizarUnidad(this.formupdate.value).subscribe(res => {
        $('#modalUpdate').modal('hide');
        this.loadingfalse();
        if (res['status'] === true) {
          this.Listar();
          iziToast.success({
            title: 'OK',
            position: 'topRight',
            message: res['message'],
        });
        } else {
          iziToast.error({
            title: 'OK',
            position: 'topRight',
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
      text: 'De eliminar esta Unidad',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        me.almacenServ.DeleteUnidad(info.id_unidad_medida).subscribe(res => {
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
          'Tu Unidad está a salvo :)',
          'error'
          );
      }
    });
   }
   changestatus(data) {
    this.almacenServ.ChangeStatusUnidad(data).subscribe( res => {
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
    let vm= this;
    vm.btnform = false;
    vm.isloading = true;
  }
  loadingfalse() {
    let vm= this;
    vm.btnform = true;
    vm.isloading = false;
  }
}
